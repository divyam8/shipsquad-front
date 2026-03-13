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
  source_news_title text,
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now(),

  -- Indexing
  indexed_google  boolean DEFAULT false,
  indexed_indexnow boolean DEFAULT false,
  indexed_at      timestamptz,

  -- Performance (updated by GSC sync)
  impressions     int DEFAULT 0,
  clicks          int DEFAULT 0,
  avg_position    float
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_domain ON articles(domain);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_score ON articles(composite_score DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
