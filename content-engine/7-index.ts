import { GoogleAuth } from 'google-auth-library';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './lib/supabase.js';
import { CREDENTIALS_DIR, DOMAIN, GOOGLE_DAILY_LIMIT, INDEXNOW_KEY } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GOOGLE_API_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const QUOTA_FILE = join(__dirname, '..', '.indexing-quota.json');

function loadServiceAccounts() {
  if (!existsSync(CREDENTIALS_DIR)) {
    console.error('No credentials/ directory. Skipping Google Indexing.');
    return [];
  }
  const files = readdirSync(CREDENTIALS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => ({
    path: join(CREDENTIALS_DIR, f),
    name: f.replace('.json', ''),
    email: JSON.parse(readFileSync(join(CREDENTIALS_DIR, f), 'utf-8')).client_email,
  }));
}

function loadQuota(): Record<string, any> {
  if (!existsSync(QUOTA_FILE)) return {};
  try {
    const data = JSON.parse(readFileSync(QUOTA_FILE, 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    if (data._date !== today) return { _date: today };
    return data;
  } catch { return {}; }
}

function saveQuota(quota: Record<string, any>) {
  quota._date = new Date().toISOString().split('T')[0];
  writeFileSync(QUOTA_FILE, JSON.stringify(quota, null, 2));
}

function pickBestKey(accounts: any[], quota: Record<string, any>) {
  let best: any = null, bestUsage = Infinity;
  for (const acct of accounts) {
    const usage = quota[acct.name] || 0;
    if (usage < GOOGLE_DAILY_LIMIT && usage < bestUsage) {
      best = acct;
      bestUsage = usage;
    }
  }
  return best;
}

async function submitToIndexNow(urls: string[]) {
  const payload = {
    host: 'shipsquad.ai',
    key: INDEXNOW_KEY,
    keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`  IndexNow ${new URL(endpoint).hostname}: ${res.status}`);
    } catch (err: any) {
      console.error(`  IndexNow ${new URL(endpoint).hostname}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('=== Stage 7: Index URLs ===\n');

  // Get all un-indexed articles (includes backlog from previous days)
  const { data: unindexedGoogle } = await supabase
    .from('articles')
    .select('slug, composite_score')
    .eq('status', 'published')
    .eq('indexed_google', false)
    .order('composite_score', { ascending: false });

  const { data: unindexedIndexNow } = await supabase
    .from('articles')
    .select('slug')
    .eq('status', 'published')
    .eq('indexed_indexnow', false);

  const googleUrls = (unindexedGoogle || []).map(r => `${DOMAIN}/insights/${r.slug}`);
  const indexNowUrls = (unindexedIndexNow || []).map(r => `${DOMAIN}/insights/${r.slug}`);

  console.log(`Un-indexed (Google): ${googleUrls.length}`);
  console.log(`Un-indexed (IndexNow): ${indexNowUrls.length}`);

  // IndexNow first (no quota)
  if (indexNowUrls.length > 0) {
    console.log('\n-- IndexNow --');
    for (let i = 0; i < indexNowUrls.length; i += 10000) {
      await submitToIndexNow(indexNowUrls.slice(i, i + 10000));
    }

    // Mark as indexed
    const slugs = (unindexedIndexNow || []).map(r => r.slug);
    for (let i = 0; i < slugs.length; i += 100) {
      await supabase
        .from('articles')
        .update({ indexed_indexnow: true, indexed_at: new Date().toISOString() })
        .in('slug', slugs.slice(i, i + 100));
    }
  }

  // Google Indexing API
  const accounts = loadServiceAccounts();
  if (accounts.length === 0 || googleUrls.length === 0) {
    console.log('\nSkipping Google Indexing (no accounts or no URLs).');
    return;
  }

  const quota = loadQuota();
  const remaining = accounts.reduce((sum, a) => sum + Math.max(0, GOOGLE_DAILY_LIMIT - (quota[a.name] || 0)), 0);
  console.log(`\nGoogle quota remaining: ${remaining}`);

  const clientCache = new Map();
  let success = 0, failed = 0;
  const urlsToSubmit = googleUrls.slice(0, remaining);

  console.log(`\n-- Google Indexing API (${urlsToSubmit.length} URLs) --`);

  for (let i = 0; i < urlsToSubmit.length; i++) {
    const url = urlsToSubmit[i];
    const account = pickBestKey(accounts, quota);
    if (!account) break;

    if (!clientCache.has(account.name)) {
      try {
        const auth = new GoogleAuth({ keyFile: account.path, scopes: ['https://www.googleapis.com/auth/indexing'] });
        clientCache.set(account.name, await auth.getClient());
      } catch (err: any) {
        quota[account.name] = GOOGLE_DAILY_LIMIT;
        saveQuota(quota);
        i--;
        continue;
      }
    }

    try {
      await clientCache.get(account.name).request({
        url: GOOGLE_API_URL,
        method: 'POST',
        data: { url, type: 'URL_UPDATED' },
      });
      quota[account.name] = (quota[account.name] || 0) + 1;
      success++;
    } catch (err: any) {
      const status = err.response?.status || err.code;
      if (status === 429 || status === 403) {
        quota[account.name] = GOOGLE_DAILY_LIMIT;
        saveQuota(quota);
        i--;
        continue;
      }
      failed++;
    }

    if (success % 50 === 0) {
      saveQuota(quota);
      process.stdout.write(`\r  Google: ${success} submitted, ${failed} failed`);
    }
  }

  saveQuota(quota);

  // Mark submitted URLs as indexed in Supabase
  if (success > 0) {
    const indexedSlugs = urlsToSubmit.slice(0, success).map(u => u.split('/insights/')[1]);
    for (let i = 0; i < indexedSlugs.length; i += 100) {
      await supabase
        .from('articles')
        .update({ indexed_google: true, indexed_at: new Date().toISOString() })
        .in('slug', indexedSlugs.slice(i, i + 100));
    }
  }

  console.log(`\n\nGoogle: ${success} submitted, ${failed} failed, ${googleUrls.length - urlsToSubmit.length} overflow for tomorrow`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
