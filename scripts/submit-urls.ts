/**
 * URL Submission Script for IndexNow
 * Run with: INDEXNOW_SECRET=your-secret npx tsx scripts/submit-urls.ts
 *
 * Submits all site URLs to IndexNow for faster indexing.
 */

import { tools } from "../src/data/tools";
import { comparisons } from "../src/data/comparisons";
import { useCases } from "../src/data/use-cases";
import { industries } from "../src/data/industries";
import { roles } from "../src/data/roles";
import { workflows } from "../src/data/workflows";
import { cities } from "../src/data/cities";
import { glossaryTerms } from "../src/data/glossary";
import { guides } from "../src/data/guides";
import { aiModels } from "../src/data/ai-models";
import { frameworks } from "../src/data/frameworks";
import { missions } from "../src/data/missions";
import { blogPosts } from "../src/data/blog-posts";

const BASE_URL = "https://shipsquad.ai";
const API_URL = process.env.SUBMIT_URL || `${BASE_URL}/api/indexnow`;
const SECRET = process.env.INDEXNOW_SECRET;

if (!SECRET) {
  console.error("ERROR: Set INDEXNOW_SECRET environment variable");
  process.exit(1);
}

function collectUrls(): string[] {
  const urls: string[] = [
    "/",
    "/about",
    "/blog",
    "/tools/ai-cost-calculator",
    "/tools/ai-squad-builder",
    "/tools/roi-calculator",
  ];

  // Tool pages
  tools.filter(t => t.hasAlternativePage).forEach(t => urls.push(`/alternative/${t.slug}`));
  tools.filter(t => t.hasPricingPage).forEach(t => urls.push(`/pricing/${t.slug}`));
  tools.filter(t => t.hasReviewPage).forEach(t => urls.push(`/review/${t.slug}`));

  // Comparison pages
  comparisons.filter(c => !c.isVsTraditional).forEach(c => urls.push(`/compare/${c.slug}`));
  comparisons.filter(c => c.isVsTraditional).forEach(c => urls.push(`/vs/${c.slug}`));

  // Content pages
  useCases.forEach(u => urls.push(`/ai-agent-for/${u.slug}`));
  industries.forEach(i => urls.push(`/ai-squad-for/${i.slug}`));
  roles.forEach(r => urls.push(`/ai-tools-for/${r.slug}`));
  workflows.forEach(w => urls.push(`/ai-workflow/${w.slug}`));
  guides.forEach(g => urls.push(`/how-to/${g.slug}`));
  aiModels.forEach(m => urls.push(`/ai-model/${m.slug}`));
  frameworks.forEach(f => urls.push(`/framework/${f.slug}`));
  cities.forEach(c => urls.push(`/location/${c.slug}`));
  glossaryTerms.forEach(g => urls.push(`/glossary/${g.slug}`));
  missions.forEach(m => urls.push(`/mission/${m.slug}`));
  blogPosts.forEach(p => urls.push(`/blog/${p.slug}`));

  return urls;
}

async function submitBatch(urls: string[]) {
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SECRET}`,
    },
    body: JSON.stringify({ urls }),
  });

  const data = await response.json();
  console.log("Response:", JSON.stringify(data, null, 2));
  return data;
}

async function pingGoogle() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

  try {
    const res = await fetch(pingUrl);
    console.log(`Google ping: ${res.status}`);
  } catch (err) {
    console.error("Google ping failed:", err);
  }
}

async function main() {
  const urls = collectUrls();
  console.log(`\nCollected ${urls.length} URLs\n`);

  // Submit in batches of 5000
  for (let i = 0; i < urls.length; i += 5000) {
    const batch = urls.slice(i, i + 5000);
    await submitBatch(batch);
    if (i + 5000 < urls.length) {
      console.log("Waiting 2s before next batch...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Ping Google
  await pingGoogle();

  console.log("\nDone! URLs submitted to IndexNow and Google pinged.");
}

main().catch(console.error);
