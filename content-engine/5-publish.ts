import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GeneratedArticle, ArticleRow } from './types.js';
import { OUTPUT_DIR, PUBLISH_THRESHOLD } from './config.js';
import { supabase } from './lib/supabase.js';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function toArticleRow(article: GeneratedArticle): ArticleRow {
  const { plan, html, eval: ev } = article;
  return {
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
    composite_score: ev?.composite_score || 0,
    readability: ev?.readability || null,
    seo_score: ev?.seo_score || null,
    content_depth: ev?.content_depth || null,
    engagement: ev?.engagement || null,
    structure: ev?.structure || null,
    word_count: ev?.word_count || 0,
    cta_style: plan.cta_style,
    author: 'ShipSquad AI',
    status: 'published',
    source_news_url: plan.source_news_url,
    source_news_title: plan.source_news_title,
    published_at: new Date().toISOString(),
    indexed_google: false,
    indexed_indexnow: false,
    indexed_at: null,
  };
}

async function main() {
  console.log('=== Stage 5: Publish to Supabase ===\n');

  const dir = join(OUTPUT_DIR, today());
  const evalPath = join(dir, 'eval_results.json');

  if (!existsSync(evalPath)) {
    console.error('ERROR: eval_results.json not found. Run stage 4 first.');
    process.exit(1);
  }

  const results: GeneratedArticle[] = JSON.parse(readFileSync(evalPath, 'utf-8'));
  const toPublish = results.filter(r => r.tier === 'publish' && r.eval && r.eval.composite_score >= PUBLISH_THRESHOLD);

  console.log(`Articles to publish: ${toPublish.length}`);

  let published = 0, errors = 0;

  // Batch insert in groups of 50
  for (let i = 0; i < toPublish.length; i += 50) {
    const batch = toPublish.slice(i, i + 50).map(toArticleRow);

    const { error } = await supabase
      .from('articles')
      .upsert(batch, { onConflict: 'slug', ignoreDuplicates: true });

    if (error) {
      console.error(`  Batch error at ${i}: ${error.message}`);
      errors += batch.length;
    } else {
      published += batch.length;
    }

    process.stdout.write(`\r  Published: ${published} / ${toPublish.length} (errors: ${errors})`);
  }

  console.log(`\n\nPublished ${published} articles to Supabase.`);
  if (errors > 0) console.log(`${errors} articles had errors.`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
