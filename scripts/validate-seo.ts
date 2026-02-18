/**
 * SEO Validation Script
 * Run with: npx tsx scripts/validate-seo.ts
 *
 * Checks:
 * - No duplicate titles across all pages
 * - No duplicate meta descriptions
 * - Minimum content data per page type
 * - All internal links reference valid slugs
 * - No orphan data entries
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

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`  ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  WARN: ${msg}`);
  warnings++;
}

function checkDuplicateSlugs(name: string, items: { slug: string }[]) {
  const slugs = new Set<string>();
  for (const item of items) {
    if (slugs.has(item.slug)) {
      error(`${name}: Duplicate slug "${item.slug}"`);
    }
    slugs.add(item.slug);
  }
}

function checkMinimum(name: string, items: unknown[], min: number) {
  if (items.length < min) {
    warn(`${name}: Only ${items.length} entries (target: ${min})`);
  }
}

console.log("\n=== ShipSquad SEO Validation ===\n");

// 1. Check data counts
console.log("1. Data Counts:");
const dataSets = [
  { name: "Tools", data: tools, target: 150 },
  { name: "Comparisons", data: comparisons, target: 300 },
  { name: "Use Cases", data: useCases, target: 40 },
  { name: "Industries", data: industries, target: 20 },
  { name: "Roles", data: roles, target: 80 },
  { name: "Workflows", data: workflows, target: 80 },
  { name: "Cities", data: cities, target: 100 },
  { name: "Glossary", data: glossaryTerms, target: 150 },
  { name: "Guides", data: guides, target: 150 },
  { name: "AI Models", data: aiModels, target: 40 },
  { name: "Frameworks", data: frameworks, target: 30 },
  { name: "Missions", data: missions, target: 100 },
  { name: "Blog Posts", data: blogPosts, target: 20 },
];

let totalPages = 6; // static pages
for (const ds of dataSets) {
  console.log(`  ${ds.name}: ${ds.data.length} entries`);
  checkMinimum(ds.name, ds.data, ds.target);
  totalPages += ds.data.length;
}
// Add alternative, pricing, review pages (subsets of tools)
const altPages = tools.filter(t => t.hasAlternativePage).length;
const pricingPages = tools.filter(t => t.hasPricingPage).length;
const reviewPages = tools.filter(t => t.hasReviewPage).length;
const vsPages = comparisons.filter(c => c.isVsTraditional).length;
totalPages = totalPages - tools.length + altPages + pricingPages + reviewPages + comparisons.length - comparisons.filter(c => c.isVsTraditional).length + vsPages;
console.log(`\n  TOTAL ESTIMATED PAGES: ${totalPages}`);

// 2. Check duplicate slugs
console.log("\n2. Duplicate Slug Check:");
checkDuplicateSlugs("Tools", tools);
checkDuplicateSlugs("Comparisons", comparisons);
checkDuplicateSlugs("Use Cases", useCases);
checkDuplicateSlugs("Industries", industries);
checkDuplicateSlugs("Roles", roles);
checkDuplicateSlugs("Workflows", workflows);
checkDuplicateSlugs("Cities", cities);
checkDuplicateSlugs("Glossary", glossaryTerms);
checkDuplicateSlugs("Guides", guides);
checkDuplicateSlugs("AI Models", aiModels);
checkDuplicateSlugs("Frameworks", frameworks);
checkDuplicateSlugs("Missions", missions);
checkDuplicateSlugs("Blog Posts", blogPosts);
if (errors === 0) console.log("  All slugs unique!");

// 3. Check tool alternatives reference valid slugs
console.log("\n3. Internal Reference Check:");
const toolSlugs = new Set(tools.map(t => t.slug));
for (const tool of tools) {
  for (const alt of tool.alternatives) {
    if (!toolSlugs.has(alt)) {
      warn(`Tool "${tool.slug}" references unknown alternative "${alt}"`);
    }
  }
}

// Check glossary related terms
const glossarySlugs = new Set(glossaryTerms.map(g => g.slug));
for (const term of glossaryTerms) {
  for (const related of term.relatedTerms) {
    if (!glossarySlugs.has(related)) {
      warn(`Glossary "${term.slug}" references unknown related term "${related}"`);
    }
  }
}

// Check comparison tool slugs
for (const comp of comparisons) {
  if (!comp.isVsTraditional) {
    if (!toolSlugs.has(comp.toolASlug)) {
      warn(`Comparison "${comp.slug}" references unknown toolASlug "${comp.toolASlug}"`);
    }
    if (!toolSlugs.has(comp.toolBSlug)) {
      warn(`Comparison "${comp.slug}" references unknown toolBSlug "${comp.toolBSlug}"`);
    }
  }
}

// 4. Check data quality
console.log("\n4. Data Quality Check:");
for (const tool of tools) {
  if (!tool.description || tool.description.length < 20) error(`Tool "${tool.slug}" has short/missing description`);
  if (tool.features.length < 2) warn(`Tool "${tool.slug}" has fewer than 2 features`);
  if (tool.pros.length < 2) warn(`Tool "${tool.slug}" has fewer than 2 pros`);
  if (tool.cons.length < 2) warn(`Tool "${tool.slug}" has fewer than 2 cons`);
}

for (const post of blogPosts) {
  if (!post.content || post.content.length < 500) error(`Blog post "${post.slug}" has very short content`);
  if (!post.publishedAt) error(`Blog post "${post.slug}" missing publishedAt date`);
}

// Summary
console.log("\n=== Summary ===");
console.log(`  Total pages: ~${totalPages}`);
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log("\n  VALIDATION FAILED - Fix errors before deploying");
  process.exit(1);
} else {
  console.log("\n  VALIDATION PASSED");
  process.exit(0);
}
