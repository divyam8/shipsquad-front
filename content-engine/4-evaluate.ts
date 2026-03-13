import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ArticlePlan, EvalResult, GeneratedArticle } from './types.js';
import { OUTPUT_DIR, ENGINE_ROOT, PUBLISH_THRESHOLD, EVOLVE_THRESHOLD } from './config.js';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function evaluateArticle(htmlPath: string, plan: ArticlePlan): EvalResult | null {
  const keywords = plan.keywords.join(',');
  const minWords = plan.content_type === 'news-explainer' ? 400 : 800;
  const maxWords = plan.content_type === 'news-explainer' ? 800 : 1500;

  try {
    const cmd = `python "${join(ENGINE_ROOT, 'prepare.py')}" "${htmlPath}" --keywords "${keywords}" --min-words ${minWords} --max-words ${maxWords} --json`;
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 30_000 });
    return JSON.parse(output.trim());
  } catch (err: any) {
    console.error(`  EVAL ERROR: ${htmlPath} — ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('=== Stage 4: Evaluate Articles ===\n');

  const dir = join(OUTPUT_DIR, today());
  const articlesDir = join(dir, 'articles');
  const plansPath = join(dir, 'article_plans.json');
  const outPath = join(dir, 'eval_results.json');

  if (!existsSync(articlesDir) || !existsSync(plansPath)) {
    console.error('ERROR: articles/ or article_plans.json not found. Run stages 2-3 first.');
    process.exit(1);
  }

  // Checkpoint
  if (existsSync(outPath)) {
    const existing = JSON.parse(readFileSync(outPath, 'utf-8'));
    console.log(`Checkpoint found: ${existing.length} results. Skipping.`);
    return;
  }

  const plans: ArticlePlan[] = JSON.parse(readFileSync(plansPath, 'utf-8'));
  const planMap = new Map(plans.map(p => [p.slug, p]));

  const htmlFiles = readdirSync(articlesDir).filter(f => f.endsWith('.html'));
  console.log(`Evaluating ${htmlFiles.length} articles...\n`);

  const results: GeneratedArticle[] = [];
  let publishCount = 0, evolveCount = 0, discardCount = 0;

  for (let i = 0; i < htmlFiles.length; i++) {
    const slug = htmlFiles[i].replace('.html', '');
    const plan = planMap.get(slug);
    if (!plan) continue;

    const htmlPath = join(articlesDir, htmlFiles[i]);
    const html = readFileSync(htmlPath, 'utf-8');
    const evalResult = evaluateArticle(htmlPath, plan);

    let tier: 'publish' | 'evolve' | 'discard' = 'discard';
    if (evalResult) {
      if (evalResult.composite_score >= PUBLISH_THRESHOLD) {
        tier = 'publish';
        publishCount++;
      } else if (evalResult.composite_score >= EVOLVE_THRESHOLD) {
        tier = 'evolve';
        evolveCount++;
      } else {
        discardCount++;
      }
    } else {
      discardCount++;
    }

    results.push({ plan, html, eval: evalResult || undefined, tier });

    if ((i + 1) % 50 === 0 || i === htmlFiles.length - 1) {
      process.stdout.write(`\r  Evaluated: ${i + 1}/${htmlFiles.length} | Publish: ${publishCount} | Evolve: ${evolveCount} | Discard: ${discardCount}`);
    }
  }

  console.log('\n');
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${outPath}`);
  console.log(`\nSummary: ${publishCount} publish, ${evolveCount} evolve, ${discardCount} discard`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
