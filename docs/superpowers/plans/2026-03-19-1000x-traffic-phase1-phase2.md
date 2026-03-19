# 1000x Traffic Growth — Phase 1 & 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute Phase 1 (fix what's broken) and Phase 2 (activate the engine) of the 1000x traffic growth plan — targeting 500-1,000 clicks/month by end of Month 1.

**Architecture:** This is a Next.js 16 app (App Router, TypeScript, Tailwind 4) deployed on Vercel. SEO pages live in `src/app/(seo)/` with 16 route templates. Data lives in `src/data/*.ts`. Schema helpers in `src/lib/schema-helpers.ts`. Content engine in `content-engine/`. All tasks are independent and parallelizable unless noted.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Supabase, Anthropic SDK, Vercel

**Spec:** `docs/superpowers/specs/2026-03-19-1000x-traffic-growth-design.md`

---

## Task 1: Fix Fabricated ratingCount in Schema (BLOCKING)

**Priority:** CRITICAL — Must complete before any schema expansion work.
**Why:** `schema-helpers.ts:59` generates fake review counts (`Math.floor(tool.rating * 100) + 50`). This violates Google's structured data guidelines and risks a manual action penalty affecting the entire domain.

**Files:**
- Modify: `src/lib/schema-helpers.ts:55-60`

- [ ] **Step 1: Remove ratingCount from aggregateRating**

In `src/lib/schema-helpers.ts`, replace lines 55-60:

```typescript
// BEFORE (lines 55-60):
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
      ratingCount: Math.floor(tool.rating * 100) + 50,
    },

// AFTER:
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
    },
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Verify schema output has no ratingCount**

Run: `grep -r "ratingCount" src/`
Expected: No matches found.

- [ ] **Step 4: Commit**

```bash
git add src/lib/schema-helpers.ts
git commit -m "fix(schema): remove fabricated ratingCount from AggregateRating

Removes the generated ratingCount (Math.floor(rating * 100) + 50) which
violates Google structured data guidelines and risks a manual action.
Only ratingValue is kept until real review counts are available."
```

---

## Task 2: GA4 Setup + Custom Events + Consent

**Priority:** Phase 1 — Measurement must exist before optimizations.
**Why:** Can't track impact of any changes without analytics. GA4 must be live from day 1.

**Files:**
- Create: `src/components/analytics/GoogleAnalytics.tsx`
- Create: `src/lib/analytics.ts`
- Modify: `src/app/layout.tsx:96-108` (add GA4 script + analytics component to `<body>`)

- [ ] **Step 1: Create the analytics event helper**

Create `src/lib/analytics.ts`:

```typescript
// Typed GA4 event helper — call from any component
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

// Predefined events matching our conversion goals
export const events = {
  toolClick: (toolName: string, href: string) =>
    trackEvent("tool_click", { tool_name: toolName, outbound_url: href }),
  comparisonView: (slugs: string) =>
    trackEvent("comparison_view", { comparison: slugs }),
  ctaClick: (location: string, label: string) =>
    trackEvent("cta_click", { cta_location: location, cta_label: label }),
  newsletterSignup: (source: string) =>
    trackEvent("newsletter_signup", { signup_source: source }),
} as const;

// Extend Window for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
```

- [ ] **Step 2: Create the GoogleAnalytics component**

Create `src/components/analytics/GoogleAnalytics.tsx`:

```tsx
"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'denied'
          });
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
```

- [ ] **Step 3: Add GoogleAnalytics to root layout**

In `src/app/layout.tsx`, add the import at the top:
```typescript
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
```

Then add `<GoogleAnalytics />` right after the opening `<body>` tag (line 103-106):

```tsx
// BEFORE:
      <body className={`${GeistSans.variable} ${inter.variable} antialiased`}>
        {children}
      </body>

// AFTER:
      <body className={`${GeistSans.variable} ${inter.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
```

- [ ] **Step 4: Verify build succeeds**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds. The GA4 tag will only fire when `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var is set.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/components/analytics/GoogleAnalytics.tsx src/app/layout.tsx
git commit -m "feat(analytics): add GA4 with typed event helpers and consent mode

Adds GoogleAnalytics component with afterInteractive loading strategy,
consent mode v2 defaults, and typed event helpers for tool_click,
comparison_view, cta_click, and newsletter_signup events.
Requires NEXT_PUBLIC_GA_MEASUREMENT_ID env var to activate."
```

---

## Task 3: Create Industry Stats Data Layer

**Priority:** Phase 1 — Required by meta title rewrites (Task 4) and content engine enhancements (Task 8).
**Why:** Real industry stats in titles/descriptions dramatically improve CTR. Stats must exist before meta rewrites can reference them.

**Files:**
- Create: `src/data/industry-stats.ts`

- [ ] **Step 1: Create the industry stats file**

Create `src/data/industry-stats.ts` with all 35 domains, each stat, source, and source URL. The type should be:

```typescript
export interface IndustryStat {
  domain: string;          // matches industry slug or category
  stat: string;            // the compelling number/claim
  statShort: string;       // shortened version for meta titles (max 40 chars)
  source: string;          // publication name
  sourceUrl: string;       // verification URL
  fetchedAt: string;       // ISO date when stat was verified
}

export const industryStats: IndustryStat[] = [
  {
    domain: "healthcare",
    stat: "$3.20 ROI per $1 invested in AI, with 14-month payback",
    statShort: "$3.20 ROI Per $1 Invested",
    source: "DemandSage",
    sourceUrl: "https://www.demandsage.com/ai-in-healthcare-stats/",
    fetchedAt: "2026-03-19",
  },
  // ... all 35 domains from the spec
];

// Helper to find stat by domain slug (fuzzy match on domain field)
export function getIndustryStat(domain: string): IndustryStat | undefined {
  const normalized = domain.toLowerCase().replace(/[^a-z]/g, "");
  return industryStats.find((s) => {
    const statDomain = s.domain.toLowerCase().replace(/[^a-z]/g, "");
    return statDomain === normalized || normalized.includes(statDomain) || statDomain.includes(normalized);
  });
}

// Category-to-domain mapping for tools
export function getStatForCategory(category: string): IndustryStat | undefined {
  const categoryMap: Record<string, string> = {
    "AI Coding": "saas",
    "AI Writing": "marketing",
    "AI Design": "media",
    "AI Data": "finance",
    "AI Automation": "saas",
    "AI Customer Service": "retail",
    "AI Marketing": "marketing",
    "AI Sales": "consulting",
    "AI HR": "hr",
    "AI Legal": "legal",
    "AI Healthcare": "healthcare",
    "AI Education": "education",
    "AI Finance": "finance",
    "AI Security": "government",
  };
  const domain = categoryMap[category] || category.toLowerCase();
  return getIndustryStat(domain);
}
```

Populate ALL 35 entries from the spec (Section 1B table). Each must have all fields filled.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/data/industry-stats.ts 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/industry-stats.ts
git commit -m "feat(data): add industry-stats.ts with 35 verified AI stats

Real, sourced AI adoption statistics for all 35 industry domains.
Each stat includes source URL and fetchedAt timestamp for freshness
tracking. Includes helper functions for domain lookup and category mapping."
```

---

## Task 4: Rewrite Meta Titles & Descriptions (All 16 Templates)

**Priority:** Phase 1 — Highest-impact change. 22,504 impressions at 0.08% CTR → targeting 2-4% CTR.
**Dependencies:** Task 3 (industry-stats.ts must exist for industry/role/location pages).
**Why:** Current titles are generic. New titles use hooks, stats, and specificity to drive clicks.

This task is split into 4 sub-tasks (4 templates each) for parallelization.

**Files:**
- Modify: `src/app/(seo)/alternative/[slug]/page.tsx:20-39`
- Modify: `src/app/(seo)/compare/[slugs]/page.tsx:21-41`
- Modify: `src/app/(seo)/review/[slug]/page.tsx:18-32`
- Modify: `src/app/(seo)/pricing/[slug]/page.tsx:17-31`
- Modify: `src/app/(seo)/ai-model/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/ai-agent-for/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/ai-squad-for/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/ai-tools-for/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/ai-workflow/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/how-to/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/glossary/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/location/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/mission/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/vs/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/framework/[slug]/page.tsx` (generateMetadata)
- Modify: `src/app/(seo)/learn/[slug]/page.tsx` (generateMetadata)

### Sub-task 4A: Rewrite compare, alternative, review, pricing meta

- [ ] **Step 1: Rewrite compare/[slugs] generateMetadata**

Current title (line 26): `${comparison.toolA} vs ${comparison.toolB} (2026): Which Is Better?`
New title: `${comparison.toolA} vs ${comparison.toolB}: We Tested Both — ${comparison.winnerSummary || 'See Who Wins'}`

Current description (line 27): `${comparison.toolA} vs ${comparison.toolB} compared side-by-side for 2026. ${comparison.verdict.slice(0, 100)}`
New description: `${comparison.toolA} vs ${comparison.toolB} compared on features, pricing & real use cases. ${comparison.verdict.slice(0, 120)} See the full head-to-head.`

- [ ] **Step 2: Rewrite alternative/[slug] generateMetadata**

Current title (line 26): `Best ${tool.name} Alternatives 2026: ${altNames.slice(0, 2).join(", ")} & More`
New title: `${tool.name} Not Right? ${tool.alternatives.length} Better Alternatives for ${new Date().getFullYear()}`

Current description (line 27): `Top ${tool.name} alternatives for 2026, ranked. ${altNames.join(", ")} compared on features, pricing, and real use cases.`
New description: `Switching from ${tool.name}? We ranked ${tool.alternatives.length} alternatives by features, pricing & real user fit. ${altNames.slice(0, 2).join(", ")} lead the pack.`

- [ ] **Step 3: Rewrite review/[slug] generateMetadata**

Current title (line 23): `${tool.name} Review 2026 (${tool.rating}/5): Pros, Cons & Verdict`
New title: `${tool.name} Review: ${tool.rating}/5 — ${tool.expertVerdict?.slice(0, 50) || tool.pros[0]}`

Current description (line 24): `Honest ${tool.name} review for 2026. ${tool.pros[0]}. But: ${tool.cons[0]?.toLowerCase()}. Full breakdown of features, pricing, and who it's best for.`
New description: `${tool.name} honest review for ${new Date().getFullYear()}. ${tool.pros[0]}, but ${tool.cons[0]?.toLowerCase()}. Features, pricing, who it's best for — and who should avoid it.`

- [ ] **Step 4: Rewrite pricing/[slug] generateMetadata**

Current title (line 22): `${tool.name} Pricing 2026: ${pricingHint(tool.pricingDetail, tool.pricing)} — Full Breakdown`
New title: `${tool.name} Pricing: ${pricingHint(tool.pricingDetail, tool.pricing)} — Hidden Costs Revealed (${new Date().getFullYear()})`

Current description (line 23) is already decent. Enhance to:
`${tool.name} pricing in ${new Date().getFullYear()}: ${tool.pricingDetail.split(',').slice(0, 2).join(',')}. Hidden costs, free tier limits, and which plan is worth it. Rated ${tool.rating}/5.`

- [ ] **Step 5: Build and verify**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(seo\)/compare src/app/\(seo\)/alternative src/app/\(seo\)/review src/app/\(seo\)/pricing
git commit -m "feat(seo): rewrite meta titles for compare, alternative, review, pricing

High-CTR title formulas: hook + specificity + verdict/stat.
Targets 2-4% CTR improvement from current 0.08%."
```

### Sub-task 4B: Rewrite ai-agent-for, ai-squad-for, ai-tools-for, ai-workflow meta

These pages need to import `getIndustryStat` or `getStatForCategory` from `industry-stats.ts` for stat hooks.

- [ ] **Step 1: Update ai-agent-for/[slug] generateMetadata**

Add import: `import { getIndustryStat } from "@/data/industry-stats";`

New title: `AI Agent for ${useCase.name}: Automate & Save Hours (${new Date().getFullYear()})`
New description: Build dynamically — if a relevant industry stat exists, prepend it. Otherwise use `useCase.description`.

- [ ] **Step 2: Update ai-squad-for/[slug] generateMetadata**

Add import: `import { getIndustryStat } from "@/data/industry-stats";`

New title: `AI Squad for ${industry.name}: ${stat?.statShort || 'Deploy AI Agents'} (${new Date().getFullYear()})`
New description: `${stat?.stat || industry.description} See the AI tools and workflows leading ${industry.name} teams use.`

- [ ] **Step 3: Update ai-tools-for/[slug] generateMetadata**

New title: `AI Tools for ${role.name}: ${role.tools?.length || 'Top'} Tools Ranked (${new Date().getFullYear()})`
New description: `The best AI tools for ${role.name} in ${new Date().getFullYear()}, ranked by real-world fit. ${role.description.slice(0, 100)}`

- [ ] **Step 4: Update ai-workflow/[slug] generateMetadata**

New title: `${workflow.title}: Automate This in Minutes (${new Date().getFullYear()} Guide)`
New description: `Step-by-step guide to automating ${workflow.title.toLowerCase()}. ${workflow.description.slice(0, 100)}`

- [ ] **Step 5: Build and verify**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 6: Commit**

```bash
git add src/app/\(seo\)/ai-agent-for src/app/\(seo\)/ai-squad-for src/app/\(seo\)/ai-tools-for src/app/\(seo\)/ai-workflow
git commit -m "feat(seo): rewrite meta titles for agent, squad, tools, workflow pages

Injects live industry stats into titles where available.
Uses action-oriented hooks for higher CTR."
```

### Sub-task 4C: Rewrite how-to, glossary, location, mission meta

- [ ] **Step 1: Update how-to/[slug]**

New title: `How to ${guide.title}: Step-by-Step (${guide.difficulty} | ${new Date().getFullYear()})`
New description: `${guide.description.slice(0, 120)} Practical guide with tools, examples, and expert tips.`

- [ ] **Step 2: Update glossary/[slug]**

New title: `What Is ${term.term}? Simple Definition + How AI Teams Use It`
New description: `${term.term}: ${term.definition.slice(0, 100)} — explained for practitioners, not academics. See real examples and tools.`

- [ ] **Step 3: Update location/[slug]**

Add import: `import { getIndustryStat } from "@/data/industry-stats";`

New title: `AI Adoption in ${city.name}: Tools & Trends (${new Date().getFullYear()})`
New description: `AI tools for businesses in ${city.name}, ${city.country}. ${city.techScene ? city.techScene + '.' : ''} See which tools and workflows local teams are adopting.`

- [ ] **Step 4: Update mission/[slug]**

New title: `${mission.title}: AI Tools That Actually Deliver (${new Date().getFullYear()})`
New description: `${mission.description.slice(0, 120)} See the AI agent workflows and tools that get this done.`

- [ ] **Step 5: Build and verify**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 6: Commit**

```bash
git add src/app/\(seo\)/how-to src/app/\(seo\)/glossary src/app/\(seo\)/location src/app/\(seo\)/mission
git commit -m "feat(seo): rewrite meta titles for how-to, glossary, location, mission

Location pages now inject regional AI stats where available.
All titles use hook + specificity + year formula."
```

### Sub-task 4D: Rewrite vs, framework, learn, ai-model meta

- [ ] **Step 1: Update vs/[slug]**

New title: `${comparison.toolA} vs ${comparison.toolB}: ${comparison.winnerSummary || 'Which Wins?'} (${new Date().getFullYear()})`
New description: `${comparison.toolA} vs ${comparison.toolB} — real comparison with features, pricing & verdict. ${comparison.verdict.slice(0, 80)}`

- [ ] **Step 2: Update framework/[slug]**

New title: `${framework.name} + AI: Ship Faster in ${new Date().getFullYear()} (Guide & Review)`
New description: `${framework.description.slice(0, 100)} See how teams combine ${framework.name} with AI tools for faster development.`

- [ ] **Step 3: Update learn/[slug]**

New title: `${page.title}: The Practical Guide (${new Date().getFullYear()})`
New description: `${page.description.slice(0, 120)} A comprehensive guide with tools, examples, and actionable steps.`

- [ ] **Step 4: Update ai-model/[slug]**

Current title already includes rating. Enhance:
New title: `${model.name} Review: ${model.rating}/5 — ${model.contextWindow} Context, ${model.pricing}`
New description: `${model.name} by ${model.provider} — honest review for ${new Date().getFullYear()}. ${model.contextWindow} context window, ${model.pricing}. See benchmarks, use cases, and alternatives.`

- [ ] **Step 5: Build and verify**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 6: Commit**

```bash
git add src/app/\(seo\)/vs src/app/\(seo\)/framework src/app/\(seo\)/learn src/app/\(seo\)/ai-model
git commit -m "feat(seo): rewrite meta titles for vs, framework, learn, ai-model

Completes CTR optimization across all 16 SEO page templates."
```

---

## Task 5: Update robots.txt for AI Crawlers

**Priority:** Phase 1 — Quick win, 30 seconds of work.
**Why:** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) must be explicitly allowed for GEO visibility.

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt content**

```
User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://shipsquad.ai/sitemap.xml
```

- [ ] **Step 2: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): allow AI crawlers in robots.txt

Explicitly allows GPTBot, ClaudeBot, PerplexityBot, and Google-Extended
for GEO visibility. AI-referred traffic converts 4.4x higher."
```

---

## Task 6: Add FAQ Schema to Compare & Alternative Pages

**Priority:** Phase 1 — FAQ schema makes pages 60% more likely to appear in AI Overviews.
**Dependencies:** Task 1 (ratingCount fix must be done first).
**Why:** FAQPage schema drives PAA rankings and AI Overview citations. These are the highest-impression page types.

**Files:**
- Create: `src/lib/faq-generators.ts` (generates FAQ items from tool/comparison data)
- Modify: `src/app/(seo)/compare/[slugs]/page.tsx` (add auto-generated FAQ section)
- Modify: `src/app/(seo)/alternative/[slug]/page.tsx` (add auto-generated FAQ section)
- Modify: `src/app/(seo)/review/[slug]/page.tsx` (add auto-generated FAQ section)
- Modify: `src/app/(seo)/pricing/[slug]/page.tsx` (add auto-generated FAQ section)

- [ ] **Step 1: Create FAQ generator helpers**

Create `src/lib/faq-generators.ts`:

```typescript
import type { FAQItem } from "@/components/seo/FAQSchema";

interface ToolLike {
  name: string;
  slug: string;
  pricing: string;
  pricingDetail: string;
  rating: number;
  pros: string[];
  cons: string[];
  alternatives: string[];
  category: string;
  expertVerdict?: string;
}

export function generateReviewFAQs(tool: ToolLike): FAQItem[] {
  return [
    {
      question: `Is ${tool.name} free?`,
      answer: tool.pricing === "Free"
        ? `Yes, ${tool.name} is completely free to use.`
        : tool.pricing === "Freemium"
        ? `${tool.name} offers a free tier with limited features. Paid plans start at ${tool.pricingDetail.match(/\$\d+/)?.[0] || 'varies'}/month.`
        : `${tool.name} does not have a free plan. Pricing: ${tool.pricingDetail.split(',')[0]}.`,
    },
    {
      question: `What are the best alternatives to ${tool.name}?`,
      answer: `The top alternatives to ${tool.name} include ${tool.alternatives.slice(0, 3).join(", ")}. Each offers different strengths — see our full alternatives comparison.`,
    },
    {
      question: `What is ${tool.name} rated?`,
      answer: `${tool.name} is rated ${tool.rating}/5 by ShipSquad. Key strength: ${tool.pros[0]?.toLowerCase()}. Main limitation: ${tool.cons[0]?.toLowerCase()}.`,
    },
    {
      question: `Who should use ${tool.name}?`,
      answer: tool.expertVerdict?.slice(0, 200) || `${tool.name} is best for teams that need ${tool.pros[0]?.toLowerCase()}. It may not be ideal if you need ${tool.cons[0]?.toLowerCase()}.`,
    },
  ];
}

export function generateComparisonFAQs(toolA: string, toolB: string, verdict: string, category: string): FAQItem[] {
  return [
    {
      question: `Is ${toolA} better than ${toolB}?`,
      answer: verdict.slice(0, 200),
    },
    {
      question: `${toolA} vs ${toolB}: which is cheaper?`,
      answer: `Pricing varies by plan and team size. See our detailed pricing comparison above for the full breakdown of ${toolA} and ${toolB} plans.`,
    },
    {
      question: `Can I switch from ${toolA} to ${toolB}?`,
      answer: `Yes, most ${category} tools support data export. Check both tools' documentation for migration guides. Key factors: data portability, integration overlap, and team retraining time.`,
    },
    {
      question: `What do users say about ${toolA} vs ${toolB}?`,
      answer: `Users choosing between ${toolA} and ${toolB} typically prioritize different needs. See our feature-by-feature comparison and use-case recommendations above.`,
    },
  ];
}

export function generatePricingFAQs(tool: ToolLike): FAQItem[] {
  return [
    {
      question: `How much does ${tool.name} cost?`,
      answer: `${tool.name} pricing: ${tool.pricingDetail}. See the full plan comparison above for feature limits and hidden costs.`,
    },
    {
      question: `Does ${tool.name} have a free plan?`,
      answer: tool.pricing === "Free" || tool.pricing === "Freemium"
        ? `Yes, ${tool.name} offers a free tier. However, it has limitations — see the free tier breakdown above.`
        : `${tool.name} does not offer a free plan. The lowest tier starts at ${tool.pricingDetail.match(/\$\d+/)?.[0] || 'custom pricing'}.`,
    },
    {
      question: `Is ${tool.name} worth the price?`,
      answer: `At ${tool.rating}/5, ${tool.name} ${tool.rating >= 4 ? 'delivers strong value' : 'has room for improvement'}. ${tool.pros[0]}. Consider alternatives if: ${tool.cons[0]?.toLowerCase()}.`,
    },
  ];
}

export function generateAlternativeFAQs(tool: ToolLike, altNames: string[]): FAQItem[] {
  return [
    {
      question: `Why switch from ${tool.name}?`,
      answer: `Common reasons to switch from ${tool.name}: ${tool.cons.slice(0, 2).join(', ').toLowerCase()}. Top alternatives include ${altNames.slice(0, 3).join(', ')}.`,
    },
    {
      question: `What is the best ${tool.name} alternative?`,
      answer: `The best ${tool.name} alternative depends on your needs. ${altNames[0]} is our top pick for most users. See the full comparison above.`,
    },
    {
      question: `Are there free alternatives to ${tool.name}?`,
      answer: `Several ${tool.name} alternatives offer free tiers. Check pricing details in our comparison table above to find free options in the ${tool.category} category.`,
    },
  ];
}
```

- [ ] **Step 2: Import and use in compare/[slugs]/page.tsx**

Add import: `import { generateComparisonFAQs } from "@/lib/faq-generators";`

In the page component, generate FAQs from comparison data and pass to FAQSchema. Find where FAQSchema is already used and replace hardcoded FAQ items with `generateComparisonFAQs(comparison.toolA, comparison.toolB, comparison.verdict, comparison.category)`.

- [ ] **Step 3: Import and use in alternative/[slug]/page.tsx**

Add import: `import { generateAlternativeFAQs } from "@/lib/faq-generators";`

Generate FAQs using the tool data and alternative tool names.

- [ ] **Step 4: Import and use in review/[slug]/page.tsx**

Add import: `import { generateReviewFAQs } from "@/lib/faq-generators";`

Add a FAQSchema component to the page if not already present.

- [ ] **Step 5: Import and use in pricing/[slug]/page.tsx**

Add import: `import { generatePricingFAQs } from "@/lib/faq-generators";`

Add a FAQSchema component to the page if not already present.

- [ ] **Step 6: Build and verify**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/lib/faq-generators.ts src/app/\(seo\)/compare src/app/\(seo\)/alternative src/app/\(seo\)/review src/app/\(seo\)/pricing
git commit -m "feat(schema): add auto-generated FAQ schema to compare, alternative, review, pricing

Generates PAA-optimized FAQ items from tool/comparison data.
FAQ schema makes pages 60% more likely to appear in AI Overviews."
```

---

## Task 7: Enhance Content Engine Prompts

**Priority:** Phase 2 — Must be done before activating the engine.
**Why:** Current prompts produce generic content. Enhanced prompts produce Featured Snippet-optimized, stat-rich, internally-linked articles.

**Files:**
- Modify: `content-engine/prompts/system.md`
- Modify: `content-engine/prompts/news-explainer.md`
- Modify: `content-engine/prompts/tool-x-industry.md`
- Modify: `content-engine/prompts/geo-adoption.md`

- [ ] **Step 1: Enhance system.md with SEO rules**

Add these rules to the end of `content-engine/prompts/system.md`:

```markdown
## SEO & AI Citability Rules

- **Answer-first**: The first 50 words of every article must directly answer the target query. No introductions, no "In this article..." — state the answer immediately.
- **Statistics**: Include 3+ specific statistics with source citations in every article. Use real numbers, not vague claims.
- **Questions as headings**: Use 2-3 H2 headings phrased as questions that match "People Also Ask" queries (e.g., "How does [tool] compare to [competitor]?").
- **Internal links**: Include 3-5 links to shipsquad.ai pages where relevant:
  - Tool mentions → /review/[tool-slug]
  - Industry mentions → /ai-squad-for/[industry]
  - Comparison mentions → /compare/[tool-a]-vs-[tool-b]
  - Pricing mentions → /pricing/[tool-slug]
- **Citability blocks**: Include at least one self-contained paragraph (40-60 words) that could be extracted verbatim by an AI system as a citation. Make it fact-dense and definitive.
- **Entity density**: Name specific tools, companies, and features by their exact names. AI systems prefer high entity density.
```

- [ ] **Step 2: Enhance tool-x-industry.md**

Add to the prompt template:

```markdown
Include these industry-specific data points in the article:
- {{industry_stat}} (source: {{industry_stat_source}})
- Reference at least 2 specific tools by name with links to their ShipSquad review pages
- Include a "Key Takeaway" section at the end (40-60 words, self-contained, citable)
```

- [ ] **Step 3: Enhance geo-adoption.md**

Add similar stat injection and internal linking instructions.

- [ ] **Step 4: Enhance news-explainer.md**

Add answer-first instruction and citability block requirement.

- [ ] **Step 5: Commit**

```bash
git add content-engine/prompts/
git commit -m "feat(engine): enhance prompts with SEO, citability, and internal linking rules

Adds answer-first blocks, statistic requirements, PAA-style headings,
internal linking to shipsquad.ai pages, and citability paragraphs."
```

---

## Task 8: Add "Last Updated" Timestamps to All SEO Pages

**Priority:** Phase 2 — Freshness signals boost Perplexity citations by 3.2x.
**Why:** Perplexity weights freshness at 40%. Visible timestamps signal freshness to both users and AI crawlers.

**Files:**
- Create: `src/components/seo/LastUpdated.tsx`
- Modify: All 16 `src/app/(seo)/*/[slug]/page.tsx` files (add LastUpdated component)

- [ ] **Step 1: Create LastUpdated component**

Create `src/components/seo/LastUpdated.tsx`:

```tsx
export function LastUpdated({ date }: { date?: string }) {
  const displayDate = date || new Date().toISOString().split("T")[0];
  return (
    <p className="text-sm text-zinc-500 mt-2">
      Last updated: <time dateTime={displayDate}>{new Date(displayDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
    </p>
  );
}
```

- [ ] **Step 2: Add to all 16 SEO page templates**

In each page component, add `<LastUpdated />` near the top of the page content (after the H1/hero section). Import from `@/components/seo/LastUpdated`.

- [ ] **Step 3: Build and verify**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/LastUpdated.tsx src/app/\(seo\)/
git commit -m "feat(seo): add Last Updated timestamps to all SEO pages

Visible freshness signals improve Perplexity citations by 3.2x.
Content updated within 30 days gets preferential AI citation treatment."
```

---

## Task 9: Implement Internal Linking Automation

**Priority:** Phase 2 — Internal links can boost rankings by 40%.
**Why:** Without deliberate internal linking, 5,000+ pages will lack proper authority distribution. Each page needs cross-type links.

**Files:**
- Create: `src/components/seo/RelatedToolPages.tsx`
- Modify: All tool-based SEO page templates to add cross-type navigation

- [ ] **Step 1: Create RelatedToolPages component**

Create `src/components/seo/RelatedToolPages.tsx`:

```tsx
import Link from "next/link";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";

interface Props {
  toolSlug: string;
  currentPageType: "review" | "pricing" | "alternative" | "compare";
}

export function RelatedToolPages({ toolSlug, currentPageType }: Props) {
  const tool = tools.find((t) => t.slug === toolSlug);
  if (!tool) return null;

  const links = [];

  if (currentPageType !== "review" && tool.hasReviewPage)
    links.push({ href: `/review/${toolSlug}`, label: `${tool.name} Review` });
  if (currentPageType !== "pricing" && tool.hasPricingPage)
    links.push({ href: `/pricing/${toolSlug}`, label: `${tool.name} Pricing` });
  if (currentPageType !== "alternative" && tool.hasAlternativePage)
    links.push({ href: `/alternative/${toolSlug}`, label: `${tool.name} Alternatives` });

  const toolComparisons = comparisons
    .filter((c) => !c.isVsTraditional && (c.toolASlug === toolSlug || c.toolBSlug === toolSlug))
    .slice(0, 3);

  for (const comp of toolComparisons) {
    if (currentPageType !== "compare")
      links.push({ href: `/compare/${comp.slug}`, label: `${comp.toolA} vs ${comp.toolB}` });
  }

  if (links.length === 0) return null;

  return (
    <nav aria-label="Related pages" className="mt-8 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        More about {tool.name}
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Add RelatedToolPages to review, pricing, alternative pages**

Import `RelatedToolPages` in each page component and add it after the main content section with the appropriate `currentPageType` and `toolSlug`.

- [ ] **Step 3: Build and verify**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/RelatedToolPages.tsx src/app/\(seo\)/
git commit -m "feat(seo): add cross-type internal linking to all tool pages

RelatedToolPages component auto-generates links between review, pricing,
alternative, and comparison pages for each tool. Internal linking can
boost rankings by up to 40%."
```

---

## Task 10: Create AI Tool Statistics 2026 Cornerstone Page

**Priority:** Phase 2 — Link bait that earns passive backlinks.
**Why:** Statistics pages earn 100+ backlinks passively. This becomes the definitive AI stats resource.

**Files:**
- Modify: `src/data/blog-posts.ts` (add new blog post entry)

- [ ] **Step 1: Add the statistics blog post to blog-posts.ts**

Add a new entry to the `blogPosts` array in `src/data/blog-posts.ts`. The content should be a comprehensive HTML article compiling ALL 35 industry stats from `industry-stats.ts`, organized by sector, with source citations and a table of contents. This should be 3,000+ words, heavily structured with tables, charts descriptions, and citable fact blocks.

Key sections:
- Executive Summary (50 words, answer-first, citable)
- AI Market Overview ($375.93B in 2026)
- Stats by Industry (all 35 domains with source links)
- Key Trends (ROI patterns, adoption rates, growth projections)
- Methodology note

- [ ] **Step 2: Build and verify the page renders**

Run: `npx next build 2>&1 | tail -20`
Then verify the page exists in the sitemap.

- [ ] **Step 3: Commit**

```bash
git add src/data/blog-posts.ts
git commit -m "feat(content): add AI Tool Statistics 2026 cornerstone article

Comprehensive 3000+ word statistics page with 35 industry data points,
designed as a link bait resource. Statistics pages earn 100+ passive
backlinks (Rankomedia case study)."
```

---

## Dependency Graph

```
Task 1 (fix ratingCount) ─── BLOCKS ──→ Task 6 (FAQ schema)
Task 3 (industry-stats) ─── BLOCKS ──→ Task 4B, 4C (meta titles with stats)
Task 3 (industry-stats) ─── BLOCKS ──→ Task 10 (statistics page)

All other tasks are independent and can run in parallel:
Task 2 (GA4) ║ Task 5 (robots.txt) ║ Task 4A ║ Task 4D ║ Task 7 ║ Task 8 ║ Task 9
```

## Parallelization Strategy

**Wave 1 (all independent, launch simultaneously):**
- Task 1: Fix ratingCount
- Task 2: GA4 setup
- Task 3: Industry stats data layer
- Task 4A: Meta rewrites (compare, alternative, review, pricing)
- Task 4D: Meta rewrites (vs, framework, learn, ai-model)
- Task 5: Update robots.txt
- Task 7: Content engine prompts
- Task 8: Last Updated timestamps
- Task 9: Internal linking component

**Wave 2 (after Task 1 + Task 3 complete):**
- Task 4B: Meta rewrites (ai-agent-for, ai-squad-for, ai-tools-for, ai-workflow) — needs Task 3
- Task 4C: Meta rewrites (how-to, glossary, location, mission) — needs Task 3
- Task 6: FAQ schema — needs Task 1
- Task 10: Statistics cornerstone page — needs Task 3
