import { join } from 'path';

export const ENGINE_ROOT = join(import.meta.dirname, '.');
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
