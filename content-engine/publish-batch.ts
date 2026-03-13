import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLISH_THRESHOLD = 80;

async function main() {
  const envFile = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8');
  const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim() || '';
  const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim() || '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get slugs to publish from CLI args, or publish all 80+ from eval
  const slugsArg = process.argv.slice(2);

  const today = new Date().toISOString().split('T')[0];
  const dir = join(__dirname, 'output', today);
  const plansPath = join(dir, 'article_plans.json');
  const plans = JSON.parse(readFileSync(plansPath, 'utf-8'));

  const toPublish = slugsArg.length > 0
    ? plans.filter((p: any) => slugsArg.includes(p.slug))
    : plans;

  console.log(`Publishing ${toPublish.length} articles to Supabase...\n`);

  let published = 0, errors = 0;

  for (const plan of toPublish) {
    const htmlPath = join(dir, 'articles', `${plan.slug}.html`);
    if (!existsSync(htmlPath)) {
      console.log(`  SKIP: ${plan.slug} — no HTML file`);
      continue;
    }

    const html = readFileSync(htmlPath, 'utf-8');
    const wordCount = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;

    // Evaluate
    let score = 0;
    try {
      const { execSync } = await import('child_process');
      const keywords = plan.keywords.join(',');
      const minW = plan.content_type === 'news-explainer' ? 400 : 800;
      const maxW = plan.content_type === 'news-explainer' ? 800 : 1500;
      const cmd = `python3 "${join(__dirname, 'prepare.py')}" "${htmlPath}" --keywords "${keywords}" --min-words ${minW} --max-words ${maxW} --json`;
      const result = JSON.parse(execSync(cmd, { encoding: 'utf-8', timeout: 30000 }).trim());
      score = result.composite_score;
    } catch {
      console.log(`  EVAL FAIL: ${plan.slug}`);
      continue;
    }

    if (score < PUBLISH_THRESHOLD && slugsArg.length === 0) {
      console.log(`  SKIP: ${plan.slug} — score ${score} < ${PUBLISH_THRESHOLD}`);
      continue;
    }

    const row = {
      slug: plan.slug,
      title: plan.title,
      description: plan.description,
      content: html,
      content_type: plan.content_type,
      domain: plan.domain,
      ai_tool: plan.ai_tool,
      geography: plan.geography,
      category: plan.domain || plan.content_type,
      tags: plan.keywords,
      keywords: plan.keywords,
      target_query: plan.target_query,
      composite_score: score,
      word_count: wordCount,
      cta_style: plan.cta_style,
      author: 'ShipSquad AI',
      status: 'published',
      source_news_url: plan.source_news_url,
      source_news_title: plan.source_news_title,
      published_at: new Date().toISOString(),
      indexed_google: false,
      indexed_indexnow: false,
    };

    const { error } = await supabase.from('articles').upsert([row], { onConflict: 'slug' });
    if (error) {
      console.log(`  ERROR: ${plan.slug} — ${error.message}`);
      errors++;
    } else {
      console.log(`  OK: ${plan.slug} (score: ${score}, words: ${wordCount})`);
      published++;
    }
  }

  console.log(`\nDone. Published: ${published}, Errors: ${errors}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
