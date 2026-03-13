# autoresearch — article evolution

This is an experiment to have an LLM autonomously evolve ShipSquad blog articles.
Adapted from [Karpathy's autoresearch](https://github.com/karpathy/autoresearch) — same loop, but for content instead of ML training.

## Setup

To set up a new evolution session, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `mar13`). The branch `autoresearch/<tag>` must not already exist — this is a fresh run.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current main.
3. **Read the in-scope files**: The system is small. Read these files for full context:
   - `autoresearch/program.md` — this file. Your instructions. Do not modify.
   - `autoresearch/prepare.py` — fixed evaluation metrics. Do not modify.
   - `autoresearch/article.html` — the article content you modify. This is the ONLY file you edit.
4. **Establish baseline**: Run `python autoresearch/prepare.py` on the current article to get baseline scores.
5. **Initialize results.tsv**: Create `autoresearch/results.tsv` with just the header row. Record baseline after first eval.
6. **Confirm and go**: Confirm setup looks good.

Once you get confirmation, kick off the evolution loop.

## The Article File

`autoresearch/article.html` contains the blog post content as HTML — the same format used in ShipSquad's `blogPosts[].content` field. It uses standard HTML tags:
- `<h2>`, `<h3>` for section headings
- `<p>` for paragraphs
- `<ul>`, `<ol>`, `<li>` for lists
- `<strong>`, `<em>` for emphasis
- `<a>` for links (use `target="_blank"` for external)
- `<blockquote>` for pull quotes

## Experimentation

Each experiment is a single edit pass on `article.html`. You run the evaluator as: `python autoresearch/prepare.py`

**What you CAN do:**
- Modify `autoresearch/article.html` — this is the ONLY file you edit. Everything is fair game: restructure sections, rewrite paragraphs, add/remove content, change headings, improve hooks, sharpen CTAs, add data points, improve flow.

**What you CANNOT do:**
- Modify `autoresearch/prepare.py`. It is read-only. It contains the fixed evaluation metrics.
- Modify `autoresearch/program.md`. It is read-only. It contains your instructions.
- Change the article topic or core thesis. The article is about AutoResearch + OpenClaw + Claude Opus 4.6 and AI agents doing science. Stay on topic.
- Add fabricated statistics, fake quotes, or unverifiable claims. Every data point must be real.
- Remove the ShipSquad CTA at the end. It must stay.

**The goal is simple: maximize the composite_score.** The evaluator measures multiple dimensions and produces a single composite score (0-100). Higher is better.

**Constraints:**
- Article must be between 1,500 and 4,000 words. Too short = thin content. Too long = reader fatigue.
- Must have at least 5 `<h2>` sections for structure.
- Must maintain factual accuracy — do not invent data.

**Simplicity criterion**: All else being equal, clearer is better. A small score improvement that makes the prose convoluted is not worth it. Conversely, simplifying a sentence while maintaining or improving the score is a great outcome. Dense jargon that scores well on "depth" but kills readability? Not worth it. A rewrite that drops a point on depth but gains three on readability? Keep.

**The first run**: Your first run should always be to establish the baseline — evaluate the article as-is.

## Evaluation Dimensions

The evaluator scores across these dimensions (each 0-100):

1. **readability** — Flesch-Kincaid grade level mapped to score. Target: grade 8-12 (accessible but not dumbed down).
2. **seo_score** — Keyword density, heading structure, meta signals, internal/external link count.
3. **content_depth** — Word count, section count, data points, specificity, examples.
4. **engagement** — Hook strength (first 100 words), CTA presence, pull quotes, question usage.
5. **structure** — Heading hierarchy, paragraph length distribution, list usage, content flow.

**composite_score** = weighted average:
- readability: 20%
- seo_score: 20%
- content_depth: 25%
- engagement: 20%
- structure: 15%

## Output format

The evaluator prints a summary like this:

```
---
composite_score:   78.5
readability:       82.0
seo_score:         75.0
content_depth:     80.0
engagement:        76.0
structure:         79.0
word_count:        2450
section_count:     8
paragraph_count:   32
```

## Logging results

When an experiment is done, log it to `autoresearch/results.tsv` (tab-separated).

The TSV has a header row and 5 columns:

```
commit	composite_score	word_count	status	description
```

1. git commit hash (short, 7 chars)
2. composite_score achieved (e.g. 78.5) — use 0.0 for broken HTML
3. word_count of the article
4. status: `keep`, `discard`, or `broken`
5. short text description of what this experiment tried

Example:

```
commit	composite_score	word_count	status	description
a1b2c3d	72.3	2100	keep	baseline
b2c3d4e	75.1	2200	keep	stronger opening hook with specific stat
c3d4e5f	71.0	2300	discard	added jargon-heavy technical section
d4e5f6g	77.8	2400	keep	restructured for better flow + added blockquote
```

## The evolution loop

The experiment runs on a dedicated branch (e.g. `autoresearch/mar13`).

LOOP FOREVER:

1. Look at the current article state and scores.
2. Pick ONE focused improvement to try. Examples:
   - Strengthen the opening hook
   - Add a specific data point or example
   - Restructure a section for better flow
   - Improve a transition between sections
   - Sharpen a CTA
   - Add a pull quote
   - Simplify dense paragraphs
   - Improve heading hierarchy
   - Add internal links to ShipSquad pages
   - Optimize keyword placement
3. Make the edit to `article.html`.
4. git commit with a descriptive message.
5. Run the evaluator: `python autoresearch/prepare.py`
6. Record the results in results.tsv (do NOT commit results.tsv).
7. If composite_score improved (higher), keep the commit and advance.
8. If composite_score is equal or worse, git reset back to where you started.
9. Repeat.

**ONE CHANGE AT A TIME**: Each experiment should test exactly one hypothesis. "Rewrite the opening hook" is one experiment. "Rewrite the opening hook AND restructure section 3 AND add a blockquote" is three experiments — do them separately so you know what worked.

**NEVER STOP**: Once the evolution loop has begun, do NOT pause to ask the human if you should continue. The human might be away. You are autonomous. If you run out of ideas, re-read the article with fresh eyes, look at which dimension has the lowest score and focus there, try combining near-miss approaches, try more radical rewrites. The loop runs until the human interrupts you.

## ShipSquad Context

ShipSquad is an AI agent SaaS that deploys autonomous agent squads to ship production software. Key messaging:
- Solo founders / small teams are the target audience
- Agent squads > traditional dev teams (Brooks' Law in reverse)
- Evolving agents that learn from every mission
- The shift from vibe-coding to agent-commanded development
- Website: https://shipsquad.ai
- Waitlist CTA: /#waitlist

When optimizing the article, ensure it naturally supports ShipSquad's positioning without being a hard sell. The article should be genuinely valuable journalism first, with ShipSquad's relevance emerging organically.

## Target Keywords

Primary: autoresearch, karpathy autoresearch, ai agents research, autonomous ai agents
Secondary: openclaw, claude opus, ai agent framework, autonomous ml experiments
Long-tail: ai agents doing science, karpathy ml experiments overnight, claude firefox vulnerabilities
