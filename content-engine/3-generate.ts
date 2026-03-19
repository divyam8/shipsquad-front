import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ArticlePlan } from './types.js';
import {
  OUTPUT_DIR, DATA_DIR, PROMPTS_DIR, GENERATION_MODEL,
  BATCH_SIZE, BATCH_DELAY_MS, ARTICLE_TIMEOUT_MS
} from './config.js';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

const client = new Anthropic();

function loadPrompt(contentType: string): string {
  const filename = contentType === 'tool-x-industry' ? 'tool-x-industry.md'
    : contentType === 'news-explainer' ? 'news-explainer.md'
    : 'geo-adoption.md';
  return readFileSync(join(PROMPTS_DIR, filename), 'utf-8');
}

function loadSystemPrompt(): string {
  return readFileSync(join(PROMPTS_DIR, 'system.md'), 'utf-8');
}

function getDomainContext(domain: string | null): any {
  if (!domain) return null;
  const domains = JSON.parse(readFileSync(join(DATA_DIR, 'domains.json'), 'utf-8'));
  return domains.find((d: any) => d.name.toLowerCase() === domain.toLowerCase()) || null;
}

function fillTemplate(template: string, plan: ArticlePlan, domainCtx: any): string {
  let filled = template
    .replace(/\{\{ai_tool\}\}/g, plan.ai_tool || 'AI')
    .replace(/\{\{domain\}\}/g, plan.domain || 'business')
    .replace(/\{\{geography\}\}/g, plan.geography || 'global')
    .replace(/\{\{keywords\}\}/g, plan.keywords.join(', '))
    .replace(/\{\{target_query\}\}/g, plan.target_query)
    .replace(/\{\{source_news_title\}\}/g, plan.source_news_title || '')
    .replace(/\{\{source_news_url\}\}/g, plan.source_news_url || '')
    .replace(/\{\{source_news_summary\}\}/g, '');

  if (domainCtx) {
    filled = filled
      .replace(/\{\{pain_points\}\}/g, domainCtx.pain_points?.join(', ') || '')
      .replace(/\{\{decision_makers\}\}/g, domainCtx.decision_makers?.join(', ') || '')
      .replace(/\{\{jargon\}\}/g, domainCtx.jargon?.join(', ') || '');
  }

  return filled;
}

async function generateArticle(plan: ArticlePlan): Promise<string | null> {
  const systemPrompt = loadSystemPrompt();
  const template = loadPrompt(plan.content_type);
  const domainCtx = getDomainContext(plan.domain);
  const filledTemplate = fillTemplate(template, plan, domainCtx);

  const userPrompt = `${filledTemplate}

## Article Plan
- Title: ${plan.title}
- Slug: ${plan.slug}
- Target word count: ${plan.target_word_count}
- CTA style: ${plan.cta_style}
- Keywords: ${plan.keywords.join(', ')}

Write the article as clean HTML. Output ONLY the HTML content (no markdown, no code fences). Start with the first <h2> tag — do NOT include <h1> (the title is rendered separately).`;

  try {
    const stream = client.messages.stream({
      model: GENERATION_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const response = await stream.finalMessage();

    const html = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    // Strip markdown code fences if present
    return html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
  } catch (err: any) {
    console.error(`  ERROR generating ${plan.slug}: ${err.message}`);
    return null;
  }
}

async function processBatch(plans: ArticlePlan[], articlesDir: string, startIdx: number): Promise<number> {
  const batch = plans.slice(startIdx, startIdx + BATCH_SIZE);
  const results = await Promise.allSettled(
    batch.map(async (plan) => {
      const outPath = join(articlesDir, `${plan.slug}.html`);
      if (existsSync(outPath)) return; // Already generated

      const html = await generateArticle(plan);
      if (!html) {
        // Retry once
        const retry = await generateArticle(plan);
        if (retry) {
          writeFileSync(outPath, retry);
          return;
        }
        return; // Discard
      }
      writeFileSync(outPath, html);
    })
  );

  return results.filter(r => r.status === 'fulfilled').length;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== Stage 3: Generate Articles ===\n');

  const dir = join(OUTPUT_DIR, today());
  const plansPath = join(dir, 'article_plans.json');
  const articlesDir = join(dir, 'articles');

  if (!existsSync(plansPath)) {
    console.error('ERROR: article_plans.json not found. Run stage 2 first.');
    process.exit(1);
  }

  if (!existsSync(articlesDir)) mkdirSync(articlesDir, { recursive: true });

  const plans: ArticlePlan[] = JSON.parse(readFileSync(plansPath, 'utf-8'));
  console.log(`Plans: ${plans.length}`);

  // Check how many already generated (checkpoint/resume)
  const existingFiles = new Set(
    existsSync(articlesDir)
      ? readdirSync(articlesDir).map((f: string) => f.replace('.html', ''))
      : []
  );
  const remaining = plans.filter(p => !existingFiles.has(p.slug));
  console.log(`Already generated: ${existingFiles.size}, Remaining: ${remaining.length}`);

  let generated = existingFiles.size;
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(remaining.length / BATCH_SIZE);
    process.stdout.write(`\rBatch ${batchNum}/${totalBatches} — ${generated} generated`);

    await processBatch(remaining, articlesDir, i);
    generated += Math.min(BATCH_SIZE, remaining.length - i);

    if (i + BATCH_SIZE < remaining.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`\n\nGeneration complete. ${generated} articles in ${articlesDir}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
