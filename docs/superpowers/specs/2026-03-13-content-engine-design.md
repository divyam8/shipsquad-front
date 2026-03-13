# Content Engine — Daily AI Article Generation at Scale

**Date**: 2026-03-13
**Status**: Approved
**Scope**: Autonomous content pipeline generating 500-1000 AI articles/day across industries and geographies

---

## 1. Problem & Opportunity

ShipSquad.ai has 1,896 pages indexed, generating 14,239 impressions over the last 3 months with only 10 clicks (0.06% CTR). Impressions are growing exponentially (0/day → 1,776/day in 3 weeks). The site ranks on page 1 for many AI tool queries (crewai pricing, gptengineer review, aider review) but gets zero clicks.

**Opportunity**: Scale content production to cover AI tools × industries × geographies, building topical authority that drives traffic and positions ShipSquad as an AI agency for every vertical.

## 2. Content Strategy

### Three Content Types

| Type | % Volume | Format | Word Count | Example |
|------|----------|--------|------------|---------|
| Tool × Industry | 60% | Deep-dive | 800-1500 | "How Law Firms Use Claude for Contract Review" |
| News Explainer | 25% | Quick read | 400-800 | "OpenClaw Hit 280K Stars — What Retailers Need to Know" |
| Geo Adoption | 15% | Market guide | 800-1500 | "AI Agent Adoption in India: What SMBs Need to Know" |

### Seed Domains (~25)

Healthcare, Law, Accounting/CA, Retail, Real Estate, Education, Finance/Banking, Manufacturing, Logistics, HR/Recruitment, Marketing/Advertising, Insurance, Pharma, Hospitality, Agriculture, Government, Media, Telecom, Energy, Construction, Automotive, E-commerce, SaaS, Consulting, Nonprofit

### Domain Mapping

Domains are NOT forced. Each news item is dynamically mapped to relevant industries. A Claude update might be relevant to law, healthcare, and SaaS — but not agriculture. The planning stage decides.

### CTA Strategy

Dynamic based on content intent:
- **Informational articles** (news explainers, market overviews) → **Soft CTA**: single "ShipSquad can help your team adopt this" line at the end (1 mention max)
- **Mixed-intent articles** (tool × industry deep-dives, geo adoption) → **Woven CTA**: 2-3 natural ShipSquad mentions throughout. E.g., "For healthcare teams exploring this, ShipSquad deploys AI agent squads that..." — positioned as the bridge between the news and the reader's industry
- **Implementation articles** (how-to, getting-started guides) → **Agency pitch**: dedicated "How This Applies to Your Business" section with clear hire-ShipSquad angle (3-4 mentions)

## 3. Architecture — Pipeline Design

### Directory Structure

```
content-engine/
├── run.sh                          # Cron entry — chains all stages
├── config.ts                       # Domains, feeds, thresholds, prompts config
├── types.ts                        # NewsItem, ArticlePlan, GeneratedArticle, etc.
│
├── 1-fetch-news.ts                 # RSS + Web Search + Twitter → news_queue.json
├── 2-plan-articles.ts              # Maps news × domains × geos → article_plans.json
├── 3-generate.ts                   # Spawns N Claude Code subagents (Sonnet 4.6)
├── 4-evaluate.ts                   # Runs prepare.py on each → tier results
├── 5-publish.ts                    # Supabase insert + dynamic route serving
├── 6-evolve.ts                     # Autoresearch loop on mid-tier articles
├── 7-index.ts                      # Google Indexing API + IndexNow submission
│
├── prompts/
│   ├── system.md                   # Shared system prompt (tone, ShipSquad context)
│   ├── tool-x-industry.md          # Type 1: AI Tool × Industry (60%)
│   ├── news-explainer.md           # Type 2: News for industry audience (25%)
│   └── geo-adoption.md             # Type 3: Geography × AI (15%)
│
├── data/
│   ├── domains.json                # 25 industry domains with context
│   ├── rss-feeds.json              # Curated RSS feed URLs
│   ├── ai-tools.json               # OpenClaw, Claude, GPT, AutoResearch, etc.
│   └── gsc-insights.json           # Auto-updated from GSC — top queries, gaps
│
├── output/                         # Daily working dir (gitignored)
│   ├── YYYY-MM-DD/
│   │   ├── news_queue.json         # Stage 1
│   │   ├── article_plans.json      # Stage 2
│   │   ├── articles/               # Stage 3 (one HTML per article)
│   │   └── eval_results.json       # Stage 4
│
├── prepare.py                      # Evaluator (adapted from autoresearch/)
└── sync-gsc.ts                     # Weekly GSC data sync
```

### Stage-by-Stage Flow

**Stage 1 — Fetch News** (`1-fetch-news.ts`)
- Pull from ~30 RSS feeds (TechCrunch AI, Verge, HN, ArXiv, Anthropic Blog, OpenAI Blog, etc.)
- Web search for trending: "AI news today", "Claude update", "OpenClaw", "GPT announcement"
- Twitter/X scrape for AI influencers (Karpathy, Anthropic, OpenAI accounts)
- Deduplicate by title similarity (Levenshtein distance)
- Output: `news_queue.json` — 50-100 deduplicated news items/day

**Stage 2 — Plan Articles** (`2-plan-articles.ts`)
- Claude Code reads news queue + domain list + GSC insights
- For each news item, maps to relevant industries (dynamic, not forced)
- Also generates "evergreen" plans: tool × industry × geo combos not yet covered
- Assigns content type, target length, CTA style
- Output: `article_plans.json` — 500-1000 article plans

Each plan contains:
```typescript
{
  slug: string;
  title: string;
  description: string;
  content_type: 'tool-x-industry' | 'news-explainer' | 'geo-adoption';
  domain: string | null;
  ai_tool: string | null;
  geography: string | null;
  keywords: string[];
  target_query: string;
  target_word_count: number;
  cta_style: 'soft' | 'woven' | 'agency-pitch';
  source_news_url: string | null;
}
```

**Stage 3 — Generate** (`3-generate.ts`)
- Spawns Claude Code subagents using Sonnet 4.6
- 10 concurrent subagents per batch, 5-second wait between batches
- Each subagent receives: plan + prompt template + ShipSquad context + domain context
- Timeout: 120 seconds per article, retry once then discard
- Output: one HTML file per article in `output/articles/`
- Estimated runtime: 2-3 hours for 500 articles

**Stage 4 — Evaluate** (`4-evaluate.ts`)
- Runs adapted `prepare.py` evaluator on each article
- The evaluator is parameterized per article (NOT hardcoded like `autoresearch/prepare.py`):
  - CLI interface: `python prepare.py article.html --keywords "claude,law firm,contract review" --min-words 400 --max-words 1500`
  - Keywords, word count bounds, and content type are read from the article plan
  - Word count targets per type: news-explainer (400-800), tool-x-industry (800-1500), geo-adoption (800-1500)
- Scoring dimensions: readability (20%), seo_score (20%), content_depth (25%), engagement (20%), structure (15%)
- Tiered results:
  - **Score 80+** → auto-publish queue
  - **Score 60-80** → evolution queue
  - **Score <60** → discarded
- Output: `eval_results.json`

**Stage 5 — Publish** (`5-publish.ts`)
- Inserts passing articles (80+) into Supabase `articles` table
- Sets status to `published`, generates `published_at`
- Top performers (90+) are promoted but NOT written to `blog-posts.ts` (already 275KB). Instead, promoted articles are served from Supabase with static-like performance via ISR (60-second revalidation for promoted, 1-hour for regular). The promotion pipeline updates status to `promoted` and adds the article to the main sitemap with higher priority. If blog-posts.ts migration is desired later, content should be split into individual files (e.g., `src/data/blog/[slug].ts`) or moved entirely to Supabase.

**Stage 6 — Evolve** (`6-evolve.ts`)
- Takes mid-tier articles (60-80 score)
- Runs autoresearch-style evolution: 3-5 passes per article
- If final score ≥ 80, promote to publish
- If still <80 after 5 passes, discard
- Uses Sonnet 4.6 subagents for rewrites

**Stage 7 — Index** (`7-index.ts`)
- Collects all newly published URLs
- Submits to IndexNow first (Bing/Yandex, no quota limit) — all URLs submitted immediately
- Submits to Google Indexing API (3 service accounts, 600 URLs/day quota)
- Reuses existing quota rotation logic from `scripts/google-indexing-submit.js`
- **Overflow strategy**: When daily publish count exceeds 600 Google quota, articles are prioritized by composite_score (highest first). Remaining URLs are marked `indexed_google: false` in Supabase. Stage 7 always checks for un-indexed URLs from previous days and submits those first before new articles. This drains the backlog over multiple days.
- **Schema addition**: `indexed_google boolean DEFAULT false`, `indexed_indexnow boolean DEFAULT false`, `indexed_at timestamptz` columns in the `articles` table

## 4. Database Schema

```sql
CREATE TABLE articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  description     text NOT NULL,
  content         text NOT NULL,

  -- Classification
  content_type    text NOT NULL,
  domain          text,
  ai_tool         text,
  geography       text,

  -- SEO
  category        text NOT NULL,
  tags            text[] DEFAULT '{}',
  keywords        text[] DEFAULT '{}',
  target_query    text,

  -- Quality
  composite_score float NOT NULL,
  readability     float,
  seo_score       float,
  content_depth   float,
  engagement      float,
  structure       float,
  word_count      int NOT NULL,

  -- CTA
  cta_style       text DEFAULT 'soft',

  -- Metadata
  author          text DEFAULT 'ShipSquad AI',
  status          text DEFAULT 'draft',
  source_news_url text,
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now(),

  -- Indexing
  indexed_google  boolean DEFAULT false,
  indexed_indexnow boolean DEFAULT false,
  indexed_at      timestamptz,

  -- Performance (updated by GSC sync)
  impressions     int DEFAULT 0,
  clicks          int DEFAULT 0,
  avg_position    float,
  source_news_title text
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_domain ON articles(domain);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_score ON articles(composite_score DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
```

## 5. Dynamic Routing

New Next.js route: `src/app/insights/[slug]/page.tsx`

- Fetches from Supabase at request time with ISR (1-hour revalidation)
- Separate from `/blog/` — blog stays hand-curated, `/insights/` is the engine's output
- Reuses blog layout and structured data components, but `ArticleSchema` must be refactored to accept a `basePath` prop instead of hardcoding `/blog/`. Currently `src/components/seo/ArticleSchema.tsx` hardcodes `https://shipsquad.ai/blog/${slug}` — this must become `https://shipsquad.ai/${basePath}/${slug}`
- Automatic internal linking to existing ShipSquad pages (reviews, pricing, comparisons)
- Top performers (promoted status) get dual-published to both `/insights/` and `/blog/`

**Sitemap extension**: `src/app/insights-sitemap.ts` generates sitemap entries for all published articles, updated dynamically from Supabase.

## 6. Subagent Generation Details

### Model

Claude Sonnet 4.6 (`claude-sonnet-4-6`) for all subagent article generation.

### Prompt Architecture

Each subagent receives:

1. **System prompt** (`prompts/system.md`):
   - ShipSquad voice and brand context
   - Layman-terms mandate: "Write for a smart 15-year-old"
   - Factual accuracy rules: no invented statistics
   - ShipSquad mention limits based on CTA style
   - Internal linking requirements (at least 1 link to shipsquad.ai)
   - Target keyword placement rules (H1, first paragraph, at least 2 H2s)

2. **Template prompt** (based on content_type):
   - `tool-x-industry.md`: Hook → What is [tool]? → Use cases → Example → Getting started → CTA
   - `news-explainer.md`: Hook → Why it matters → What it means for [domain] → What to do → CTA
   - `geo-adoption.md`: Hook → Current state → Top industries → Regulatory notes → Getting started → CTA

3. **Article plan**: Title, slug, domain, AI tool, keywords, target word count, CTA style

4. **Domain context**: From `data/domains.json` — industry pain points, decision-makers, jargon guide

### Concurrency

- Batch size: 10 concurrent subagents
- Wait between batches: 5 seconds
- Timeout per article: 120 seconds
- Retry: once, then discard
- Estimated total runtime: 2-3 hours for 500 articles

## 7. News Intelligence Layer

### Sources

**RSS Feeds (~30)**:
- AI/ML Core: TechCrunch AI, The Verge AI, Ars Technica, VentureBeat AI, MIT Tech Review, ArXiv CS.AI, HackerNews, Anthropic Blog, OpenAI Blog, Google AI Blog, Meta AI Blog, Hugging Face Blog, LangChain Blog, GitHub Blog
- Industry: Healthcare IT News, Law.com, Accounting Today, Retail Dive, Financial Times AI, Manufacturing.net, EdTech Magazine, Insurance Journal, Pharma Intelligence, Hospitality Tech

**Web Search**: Trending queries for OpenClaw, Claude, GPT, AutoResearch, competitor tools

**Twitter/X**: ~50 key accounts — AI leaders, company accounts, trending AI repos

### Deduplication

Levenshtein distance on titles — items with >80% similarity are merged, keeping the earliest source.

### GSC Feedback Loop

Weekly sync (`sync-gsc.ts`) using GSC MCP server:

```json
{
  "high_impression_zero_click": [],   // Rewrite titles/descriptions
  "near_first_page": [],              // Create supporting cluster content
  "content_gaps": [],                 // Queries hitting site with no dedicated page
  "top_countries": [],                // Geo content priorities
  "rising_queries": []                // Trending topics to cover
}
```

Stage 2 (plan-articles) uses this to:
- Prioritize articles targeting high-impression queries with no dedicated content
- Generate supporting "cluster" articles around near-first-page queries
- Create geo-specific content for top-performing countries
- Avoid duplicates of content already ranking well

## 8. Scheduling & Operations

### Daily Cron (6:00 AM IST)

`run.sh` chains stages 1→7 sequentially. Each stage reads previous stage's output. If any stage fails, the pipeline stops and logs the error.

### Weekly GSC Sync (Sundays)

`sync-gsc.ts` pulls latest performance data → updates `data/gsc-insights.json` → feeds into next week's planning.

### Promotion Pipeline (Weekly)

Articles earning real traffic get promoted:
1. GSC sync identifies `/insights/` articles with impressions > 50 AND position < 15
2. Promoted articles copied to `src/data/blog-posts.ts` for static generation
3. Internal links added from related existing pages
4. Status updated to `promoted` in Supabase

### Monitoring

Daily summary appended to `content-engine/output/summary.tsv`:
```
date	planned	generated	score_80+	score_60_80	score_lt_60	evolved_to_80	published	indexed
```

### The Flywheel

```
Generate → Publish → Index → GSC data flows back
    ↑                              ↓
    ← Plan smarter articles ← Identify gaps & winners
```

## 9. Quality Guardrails

- Minimum composite score 80 to auto-publish
- Mid-tier (60-80) gets 5 evolution passes before discard
- Below 60 immediately discarded
- All articles must be 400-2500 words (depending on type)
- At least 3 H2 sections per article
- Factual accuracy: no invented statistics or quotes
- ShipSquad mention limits: soft CTA = 1 mention, woven = 2-3, agency-pitch = 3-4
- Duplicate slug check against Supabase before publishing

## 10. Error Handling & Resilience

- **RSS feed failures**: Each feed has a 10-second timeout. Failed feeds are logged and skipped. Pipeline continues if at least 5 feeds succeed.
- **Supabase connection failures**: 3 retries with exponential backoff (1s, 5s, 15s). On persistent failure, articles are written to local `output/fallback/` directory and retried next run.
- **Subagent failures**: 120-second timeout, retry once, then discard. Failed plans are logged with error details.
- **Checkpointing**: Each stage writes output to the dated directory. If `run.sh` is re-run, stages with existing valid output files are skipped (resume capability).
- **Content deduplication**: Before generating, Stage 2 queries Supabase for existing articles by `domain + ai_tool` combination and checks title similarity (>70% Levenshtein = skip). Prevents content cannibalization.

## 11. Supabase Client for Engine Scripts

Engine scripts run as standalone cron jobs, NOT inside Next.js request context. They cannot use the existing cookie-based `createServerClient` from `src/lib/supabase/server.ts`.

New file: `content-engine/lib/supabase.ts`
- Uses `createClient` from `@supabase/supabase-js` directly
- Authenticates with `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- Environment variable: `SUPABASE_SERVICE_ROLE_KEY` stored in `.env.local` (gitignored)
- TypeScript execution: All engine scripts use `npx tsx` for direct TS execution, sharing the project's `tsconfig.json`

## 12. Cost Estimation

Rough daily cost for Sonnet 4.6 at 500 articles/day:

| Item | Tokens | Cost |
|------|--------|------|
| Planning (Stage 2) | ~200K input, ~100K output | ~$1.50 |
| Generation (500 articles × ~3K input + ~2K output each) | ~1.5M input, ~1M output | ~$12.00 |
| Evolution (150 mid-tier × 3 passes × ~3K in + ~2K out) | ~1.35M input, ~900K output | ~$10.50 |
| **Daily total** | | **~$24** |
| **Monthly total** | | **~$720** |

Note: Actual costs depend on Sonnet 4.6 pricing at time of implementation. Budget ~$1000/month for buffer.

## 13. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Generation model | Sonnet 4.6 via Claude Code subagents | User preference — powerful enough for quality, fast enough for scale |
| News sources | RSS + Web Search + Twitter (all 4) | Maximum coverage, each fills gaps the others miss |
| Domain mapping | Dynamic (news-driven) | Avoids forced/thin content — only write when AI news is genuinely relevant to an industry |
| Storage | Supabase for firehose, git for curated best | Keeps repo clean, scales infinitely, top performers get promoted |
| CTA style | Dynamic based on content intent | Informational → soft, implementation → agency pitch |
| Quality gate | Tiered (80+/60-80/<60) | Catches valuable mid-tier content via evolution, maintains bar |
| Scheduling | Daily cron at 6 AM | Fully automated, zero-touch |
| Article length | Mixed by content type | Breaking news = short, analysis = medium, guides = long |
| Route | `/insights/[slug]` separate from `/blog/` | Protects curated blog quality, engine content lives separately |
