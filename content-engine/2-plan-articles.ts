import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NewsItem, ArticlePlan } from './types.js';
import {
  ENGINE_ROOT, OUTPUT_DIR, DATA_DIR, PLANNING_MODEL, DOMAIN,
  SEED_DOMAINS, WORD_COUNT_TARGETS
} from './config.js';
import { supabase } from './lib/supabase.js';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

const client = new Anthropic();

async function getExistingSlugs(): Promise<Set<string>> {
  const { data } = await supabase.from('articles').select('slug');
  return new Set((data || []).map((r: any) => r.slug));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function planArticles(newsItems: NewsItem[]): Promise<ArticlePlan[]> {
  const domainsData = JSON.parse(readFileSync(join(DATA_DIR, 'domains.json'), 'utf-8'));
  const aiTools = JSON.parse(readFileSync(join(DATA_DIR, 'ai-tools.json'), 'utf-8'));
  const gscInsights = JSON.parse(readFileSync(join(DATA_DIR, 'gsc-insights.json'), 'utf-8'));
  const existingSlugs = await getExistingSlugs();

  const systemPrompt = `You are a content planning AI. Given news items, AI tools, and industry domains, create article plans.

Output a JSON array of article plans. Each plan must have:
- slug (URL-friendly, max 80 chars)
- title (compelling, SEO-friendly)
- description (meta description, 150-160 chars)
- content_type: "tool-x-industry" | "news-explainer" | "geo-adoption"
- domain: industry name or null
- ai_tool: tool name or null
- geography: country/region or null
- keywords: array of 3-5 target keywords
- target_query: the search query this article should rank for
- target_word_count: number based on content_type (news-explainer: 400-800, tool-x-industry: 800-1500, geo-adoption: 800-1500)
- cta_style: "soft" for news-explainer, "woven" for tool-x-industry, "agency-pitch" for implementation guides
- source_news_url: URL of source news or null
- source_news_title: title of source news or null

Rules:
- 60% should be tool-x-industry, 25% news-explainer, 15% geo-adoption
- Only map news to industries where it's genuinely relevant (don't force)
- Vary geographies across major markets (US, UK, India, Germany, Brazil, Japan, Australia, etc.)
- Generate 500-700 plans total
- Make titles specific and search-friendly, not generic
- Each slug must be unique`;

  const userPrompt = `## Today's News (${newsItems.length} items)
${newsItems.slice(0, 50).map(n => `- "${n.title}" (${n.source}) — ${n.summary.slice(0, 200)}`).join('\n')}

## AI Tools Available
${aiTools.map((t: any) => `- ${t.name} (${t.company})`).join('\n')}

## Industry Domains
${SEED_DOMAINS.join(', ')}

## GSC Insights (content gaps to target)
${JSON.stringify(gscInsights.content_gaps?.slice(0, 20) || [])}
${JSON.stringify(gscInsights.rising_queries?.slice(0, 20) || [])}

## Existing slugs to AVOID (already published)
${Array.from(existingSlugs).slice(0, 100).join(', ')}

Generate 500-700 article plans as a JSON array. Mix content types as specified.`;

  console.log('Calling Claude for article planning...');
  const response = await client.messages.create({
    model: PLANNING_MODEL,
    max_tokens: 64000,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('ERROR: No JSON array found in planning response');
    process.exit(1);
  }

  let plans: ArticlePlan[] = JSON.parse(jsonMatch[0]);

  // Filter out existing slugs
  plans = plans.filter(p => !existingSlugs.has(p.slug));

  // Deduplicate by slug
  const seen = new Set<string>();
  plans = plans.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return plans;
}

async function main() {
  console.log('=== Stage 2: Plan Articles ===\n');

  const dir = join(OUTPUT_DIR, today());
  const outPath = join(dir, 'article_plans.json');

  // Checkpoint
  if (existsSync(outPath)) {
    const existing = JSON.parse(readFileSync(outPath, 'utf-8'));
    console.log(`Checkpoint found: ${existing.length} plans. Skipping.`);
    return;
  }

  const newsPath = join(dir, 'news_queue.json');
  if (!existsSync(newsPath)) {
    console.error('ERROR: news_queue.json not found. Run stage 1 first.');
    process.exit(1);
  }

  const newsItems: NewsItem[] = JSON.parse(readFileSync(newsPath, 'utf-8'));
  console.log(`Input: ${newsItems.length} news items`);

  const plans = await planArticles(newsItems);
  console.log(`Generated ${plans.length} article plans`);

  // Stats
  const types = { 'tool-x-industry': 0, 'news-explainer': 0, 'geo-adoption': 0 };
  plans.forEach(p => { if (p.content_type in types) types[p.content_type as keyof typeof types]++; });
  console.log(`  tool-x-industry: ${types['tool-x-industry']}`);
  console.log(`  news-explainer: ${types['news-explainer']}`);
  console.log(`  geo-adoption: ${types['geo-adoption']}`);

  writeFileSync(outPath, JSON.stringify(plans, null, 2));
  console.log(`\nSaved to ${outPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
