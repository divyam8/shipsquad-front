import Parser from 'rss-parser';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { NewsItem } from './types.js';
import { ENGINE_ROOT, DATA_DIR, OUTPUT_DIR } from './config.js';

const parser = new Parser({ timeout: 10_000 });

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function outputDir(): string {
  const dir = join(OUTPUT_DIR, today());
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const al = a.toLowerCase(), bl = b.toLowerCase();
  const maxLen = Math.max(al.length, bl.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(al, bl) / maxLen;
}

function deduplicate(items: NewsItem[]): NewsItem[] {
  const result: NewsItem[] = [];
  for (const item of items) {
    const isDup = result.some(r => similarity(r.title, item.title) > 0.8);
    if (!isDup) result.push(item);
  }
  return result;
}

async function fetchRssFeeds(): Promise<NewsItem[]> {
  const feedsPath = join(DATA_DIR, 'rss-feeds.json');
  const feeds: { url: string; name: string }[] = JSON.parse(readFileSync(feedsPath, 'utf-8'));
  const items: NewsItem[] = [];
  let succeeded = 0;

  for (const feed of feeds) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const entry of (result.items || []).slice(0, 10)) {
        items.push({
          title: entry.title || 'Untitled',
          url: entry.link || '',
          source: feed.name,
          publishedAt: entry.pubDate || new Date().toISOString(),
          summary: (entry.contentSnippet || entry.content || '').slice(0, 500),
        });
      }
      succeeded++;
      console.log(`  OK: ${feed.name} (${result.items?.length || 0} items)`);
    } catch (err: any) {
      console.log(`  SKIP: ${feed.name} — ${err.message}`);
    }
  }

  if (succeeded < 5) {
    console.error('ERROR: Fewer than 5 feeds succeeded. Aborting.');
    process.exit(1);
  }

  return items;
}

async function main() {
  console.log('=== Stage 1: Fetch News ===\n');

  // Check for existing output (checkpoint/resume)
  const outPath = join(outputDir(), 'news_queue.json');
  if (existsSync(outPath)) {
    const existing = JSON.parse(readFileSync(outPath, 'utf-8'));
    console.log(`Checkpoint found: ${existing.length} items. Skipping fetch.`);
    return;
  }

  console.log('Fetching RSS feeds...');
  const rssItems = await fetchRssFeeds();
  console.log(`\nRaw items: ${rssItems.length}`);

  const deduped = deduplicate(rssItems);
  console.log(`After dedup: ${deduped.length}`);

  // Sort by date, newest first
  deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Take top 100
  const queue = deduped.slice(0, 100);

  writeFileSync(outPath, JSON.stringify(queue, null, 2));
  console.log(`\nSaved ${queue.length} news items to ${outPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
