import { join, dirname } from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Self-load .env.local so scripts work without pre-sourcing
const _envPath = join(__dirname, '..', '.env.local');
if (existsSync(_envPath)) {
  for (const line of readFileSync(_envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

export const ENGINE_ROOT = join(__dirname, '.');
export const PROJECT_ROOT = join(ENGINE_ROOT, '..');
export const OUTPUT_DIR = join(ENGINE_ROOT, 'output');
export const DATA_DIR = join(ENGINE_ROOT, 'data');
export const PROMPTS_DIR = join(ENGINE_ROOT, 'prompts');
export const CREDENTIALS_DIR = join(PROJECT_ROOT, 'credentials');

export const DOMAIN = 'https://shipsquad.ai';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

export const GENERATION_MODEL = 'claude-sonnet-4-6';
export const PLANNING_MODEL = 'claude-sonnet-4-6';
export const BATCH_SIZE = 10;
export const BATCH_DELAY_MS = 5000;
export const ARTICLE_TIMEOUT_MS = 120_000;

export const PUBLISH_THRESHOLD = 80;
export const EVOLVE_THRESHOLD = 60;
export const MAX_EVOLUTION_PASSES = 5;

export const GOOGLE_DAILY_LIMIT = 200;
export const INDEXNOW_KEY = '2c0e0aa7560e4a7f9b937a5f6c717dc2';

export const WORD_COUNT_TARGETS: Record<string, { min: number; max: number }> = {
  'news-explainer': { min: 400, max: 800 },
  'tool-x-industry': { min: 800, max: 1500 },
  'geo-adoption': { min: 800, max: 1500 },
};

export const SEED_DOMAINS = [
  'Healthcare', 'Law', 'Accounting', 'Retail', 'Real Estate',
  'Education', 'Finance', 'Manufacturing', 'Logistics', 'HR',
  'Marketing', 'Insurance', 'Pharma', 'Hospitality', 'Agriculture',
  'Government', 'Media', 'Telecom', 'Energy', 'Construction',
  'Automotive', 'E-commerce', 'SaaS', 'Consulting', 'Nonprofit',
];
