import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR } from './config.js';

/**
 * Weekly GSC sync — pulls performance data and updates gsc-insights.json.
 *
 * This script is a stub that should be run manually or via weekly cron.
 * It uses the GSC MCP server which is available during Claude Code sessions.
 *
 * For automated use, replace with direct GSC API calls using the service account.
 *
 * Usage: npx tsx content-engine/sync-gsc.ts
 */

async function main() {
  console.log('=== GSC Sync ===\n');
  console.log('NOTE: This is a stub. Run GSC queries via the MCP server in Claude Code,');
  console.log('or implement direct API calls for automated weekly sync.\n');

  const insightsPath = join(DATA_DIR, 'gsc-insights.json');
  const current = JSON.parse(readFileSync(insightsPath, 'utf-8'));

  // TODO: Implement direct GSC API calls here for full automation
  // For now, this file is updated manually via Claude Code + GSC MCP server

  console.log('Current insights:');
  console.log(`  Content gaps: ${current.content_gaps?.length || 0}`);
  console.log(`  Rising queries: ${current.rising_queries?.length || 0}`);
  console.log(`  Last synced: ${current.last_synced || 'never'}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
