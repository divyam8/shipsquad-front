#!/bin/bash
# Content Engine — daily pipeline orchestrator
# Usage: ./content-engine/run.sh
# Cron: 0 6 * * * cd /path/to/shipsquad-front && ./content-engine/run.sh >> content-engine/output/cron.log 2>&1

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$DIR")"
cd "$PROJECT_ROOT"

# Load env
set -a
source .env.local 2>/dev/null || true
set +a

DATE=$(date +%Y-%m-%d)
echo "=== Content Engine — $DATE ==="
echo "Started at $(date)"

echo ""
echo "--- Stage 1: Fetch News ---"
npx tsx content-engine/1-fetch-news.ts

echo ""
echo "--- Stage 2: Plan Articles ---"
npx tsx content-engine/2-plan-articles.ts

echo ""
echo "--- Stage 3: Generate Articles ---"
npx tsx content-engine/3-generate.ts

echo ""
echo "--- Stage 4: Evaluate ---"
npx tsx content-engine/4-evaluate.ts

echo ""
echo "--- Stage 5: Publish ---"
npx tsx content-engine/5-publish.ts

echo ""
echo "--- Stage 6: Evolve ---"
npx tsx content-engine/6-evolve.ts

echo ""
echo "--- Stage 5 (re-run for evolved): Publish ---"
npx tsx content-engine/5-publish.ts

echo ""
echo "--- Stage 7: Index ---"
npx tsx content-engine/7-index.ts

echo ""
echo "=== Pipeline complete at $(date) ==="
