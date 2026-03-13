import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GeneratedArticle, EvalResult } from './types.js';
import {
  OUTPUT_DIR, ENGINE_ROOT, GENERATION_MODEL,
  PUBLISH_THRESHOLD, MAX_EVOLUTION_PASSES
} from './config.js';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

const client = new Anthropic();

function evaluateHtml(htmlPath: string, keywords: string[], contentType: string): EvalResult | null {
  const minWords = contentType === 'news-explainer' ? 400 : 800;
  const maxWords = contentType === 'news-explainer' ? 800 : 1500;
  try {
    const cmd = `python "${join(ENGINE_ROOT, 'prepare.py')}" "${htmlPath}" --keywords "${keywords.join(',')}" --min-words ${minWords} --max-words ${maxWords} --json`;
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 30_000 });
    return JSON.parse(output.trim());
  } catch {
    return null;
  }
}

async function evolveArticle(html: string, evalResult: EvalResult, plan: any): Promise<string | null> {
  // Find the weakest dimension
  const dimensions = [
    { name: 'readability', score: evalResult.readability },
    { name: 'seo_score', score: evalResult.seo_score },
    { name: 'content_depth', score: evalResult.content_depth },
    { name: 'engagement', score: evalResult.engagement },
    { name: 'structure', score: evalResult.structure },
  ].sort((a, b) => a.score - b.score);

  const weakest = dimensions[0];

  const prompt = `You are improving an article. The current composite score is ${evalResult.composite_score}/100.

The WEAKEST dimension is "${weakest.name}" at ${weakest.score}/100.

Current scores:
${dimensions.map(d => `- ${d.name}: ${d.score}`).join('\n')}

## Improvement Focus: ${weakest.name}
${weakest.name === 'readability' ? 'Simplify sentences. Target Flesch-Kincaid grade 8-12. Shorter paragraphs.' : ''}
${weakest.name === 'seo_score' ? 'Improve keyword placement. Add keywords to headings. Add internal/external links.' : ''}
${weakest.name === 'content_depth' ? 'Add data points, examples, proper nouns. Add lists and blockquotes.' : ''}
${weakest.name === 'engagement' ? 'Strengthen the opening hook. Add questions. Add power words. Strengthen CTA.' : ''}
${weakest.name === 'structure' ? 'Add H2/H3 headings. Vary paragraph lengths. Add lists and bold text.' : ''}

## Current Article
${html}

## Instructions
Rewrite to improve ${weakest.name} while maintaining other scores. Output ONLY the improved HTML. Keep the same topic, title angle, and CTA style. Target keywords: ${plan.keywords?.join(', ')}`;

  try {
    const response = await client.messages.create({
      model: GENERATION_MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    return text.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
  } catch {
    return null;
  }
}

async function main() {
  console.log('=== Stage 6: Evolve Mid-Tier Articles ===\n');

  const dir = join(OUTPUT_DIR, today());
  const evalPath = join(dir, 'eval_results.json');

  if (!existsSync(evalPath)) {
    console.error('ERROR: eval_results.json not found. Run stage 4 first.');
    process.exit(1);
  }

  const results: GeneratedArticle[] = JSON.parse(readFileSync(evalPath, 'utf-8'));
  const toEvolve = results.filter(r => r.tier === 'evolve');

  console.log(`Articles to evolve: ${toEvolve.length}`);

  let promoted = 0, discarded = 0;
  const promotedArticles: GeneratedArticle[] = [];

  for (let i = 0; i < toEvolve.length; i++) {
    const article = toEvolve[i];
    let currentHtml = article.html;
    let currentEval = article.eval!;
    let improved = false;

    for (let pass = 1; pass <= MAX_EVOLUTION_PASSES; pass++) {
      const newHtml = await evolveArticle(currentHtml, currentEval, article.plan);
      if (!newHtml) break;

      // Write to temp file for evaluation
      const tmpPath = join(dir, `_evolve_tmp_${i}.html`);
      writeFileSync(tmpPath, newHtml);
      const newEval = evaluateHtml(tmpPath, article.plan.keywords, article.plan.content_type);

      if (newEval && newEval.composite_score > currentEval.composite_score) {
        currentHtml = newHtml;
        currentEval = newEval;

        if (newEval.composite_score >= PUBLISH_THRESHOLD) {
          improved = true;
          break;
        }
      }
    }

    if (improved || currentEval.composite_score >= PUBLISH_THRESHOLD) {
      promoted++;
      promotedArticles.push({ ...article, html: currentHtml, eval: currentEval, tier: 'publish' });
    } else {
      discarded++;
    }

    process.stdout.write(`\r  Progress: ${i + 1}/${toEvolve.length} | Promoted: ${promoted} | Discarded: ${discarded}`);
  }

  console.log('\n');

  // Append promoted articles to eval_results for stage 5 to pick up
  if (promotedArticles.length > 0) {
    const allResults = [...results, ...promotedArticles];
    writeFileSync(evalPath, JSON.stringify(allResults, null, 2));
    console.log(`Added ${promotedArticles.length} evolved articles to eval_results.json`);
    console.log('Run stage 5 again to publish evolved articles.');
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
