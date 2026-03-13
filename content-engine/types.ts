export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary: string;
}

export interface ArticlePlan {
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
  source_news_title: string | null;
}

export interface EvalResult {
  composite_score: number;
  readability: number;
  seo_score: number;
  content_depth: number;
  engagement: number;
  structure: number;
  word_count: number;
  section_count: number;
  paragraph_count: number;
}

export interface GeneratedArticle {
  plan: ArticlePlan;
  html: string;
  eval?: EvalResult;
  tier?: 'publish' | 'evolve' | 'discard';
}

export interface ArticleRow {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  content_type: string;
  domain: string | null;
  ai_tool: string | null;
  geography: string | null;
  category: string;
  tags: string[];
  keywords: string[];
  target_query: string | null;
  composite_score: number;
  readability: number | null;
  seo_score: number | null;
  content_depth: number | null;
  engagement: number | null;
  structure: number | null;
  word_count: number;
  cta_style: string;
  author: string;
  status: string;
  source_news_url: string | null;
  source_news_title: string | null;
  published_at: string | null;
  indexed_google: boolean;
  indexed_indexnow: boolean;
  indexed_at: string | null;
}

export interface DailySummary {
  date: string;
  planned: number;
  generated: number;
  score_80_plus: number;
  score_60_80: number;
  score_lt_60: number;
  evolved_to_80: number;
  published: number;
  indexed: number;
}
