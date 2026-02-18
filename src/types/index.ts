export interface WaitlistFormData {
  email: string;
  projectDescription?: string;
}

export interface WaitlistEntry extends WaitlistFormData {
  id: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

export interface SquadAgent {
  name: string;
  codename: string;
  emoji: string;
  role: string;
  icon: string;
}

export interface DomainVertical {
  name: string;
  icon: string;
}

// SEO Data Types

export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  pricingDetail: string;
  features: string[];
  pros: string[];
  cons: string[];
  url: string;
  hasAlternativePage: boolean;
  hasPricingPage: boolean;
  hasReviewPage: boolean;
  rating: number;
  alternatives: string[];
  longDescription?: string;
  expertVerdict?: string;
  detailedPricing?: string;
  bestFor?: string[];
  keyDifferentiators?: string[];
}

export interface Comparison {
  slug: string;
  toolA: string;
  toolB: string;
  toolASlug: string;
  toolBSlug: string;
  category: string;
  verdict: string;
  isVsTraditional: boolean;
  features: {
    feature: string;
    toolA: string;
    toolB: string;
    winner: "a" | "b" | "tie";
  }[];
  detailedVerdict?: string;
  winnerSummary?: string;
  useCaseRecommendations?: string[];
}

export interface UseCase {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  agentRoles: string[];
  faq: { question: string; answer: string }[];
}

export interface Industry {
  slug: string;
  name: string;
  title: string;
  description: string;
  subNiches: string[];
  agentRoles: string[];
  benefits: string[];
  faq: { question: string; answer: string }[];
}

export interface Role {
  slug: string;
  name: string;
  title: string;
  description: string;
  tools: string[];
  tasks: string[];
  faq: { question: string; answer: string }[];
  longDescription?: string;
}

export interface Workflow {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  tools: string[];
  faq: { question: string; answer: string }[];
  longDescription?: string;
}

export interface City {
  slug: string;
  name: string;
  country: string;
  region: string;
  description: string;
  population: string;
  techScene: string;
  longDescription?: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  longDescription: string;
  relatedTerms: string[];
  category: string;
  longDefinition?: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToRead: string;
  steps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  introduction?: string;
  conclusion?: string;
}

export interface AIModel {
  slug: string;
  name: string;
  provider: string;
  releaseDate: string;
  category: string;
  description: string;
  capabilities: string[];
  pricing: string;
  contextWindow: string;
  rating: number;
  pros: string[];
  cons: string[];
  longDescription?: string;
  performanceBenchmarks?: string;
  bestUseCases?: string[];
}

export interface Framework {
  slug: string;
  name: string;
  description: string;
  language: string;
  category: string;
  github: string;
  stars: string;
  features: string[];
  pros: string[];
  cons: string[];
  useCases: string[];
}

export interface Mission {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  timeline: string;
  agentRoles: string[];
  faq: { question: string; answer: string }[];
  longDescription?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  tags: string[];
  content: string;
}

export interface PillarPage {
  slug: string;
  type: "tool" | "learn";
  name: string;
  title: string;
  description: string;
  heroSubtitle: string;
  sections: { id: string; title: string; content: string }[];
  relatedSlugs: {
    comparisons: string[];
    alternatives: string[];
    reviews: string[];
    pricing: string[];
    guides: string[];
    glossary: string[];
  };
  faq: { question: string; answer: string }[];
}
