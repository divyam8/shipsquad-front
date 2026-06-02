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

export interface FAQItem {
  question: string;
  answer: string;
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

export interface ComparisonFeature {
  feature: string;
  toolA: string;
  toolB: string;
  winner: "a" | "b" | "tie";
}

export interface Comparison {
  slug: string;
  toolASlug: string;
  toolA: string;
  toolBSlug: string;
  toolB: string;
  category: string;
  verdict: string;
  isVsTraditional: boolean;
  features: ComparisonFeature[];
  winnerSummary?: string;
  detailedVerdict?: string;
  useCaseRecommendations?: string[];
}

export interface GuideStep {
  title: string;
  description: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeToRead: string;
  introduction?: string;
  steps: GuideStep[];
  faq: FAQItem[];
  longDescription?: string;
  conclusion?: string;
}

export interface UseCase {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  agentRoles: string[];
  faq: FAQItem[];
  longDescription?: string;
}

export interface Role {
  slug: string;
  name: string;
  title: string;
  description: string;
  tools: string[];
  tasks: string[];
  faq: FAQItem[];
  longDescription?: string;
}

export interface Industry {
  slug: string;
  name: string;
  title: string;
  description: string;
  subNiches: string[];
  agentRoles: string[];
  benefits: string[];
  faq: FAQItem[];
  longDescription?: string;
}

export interface City {
  slug: string;
  name: string;
  country: string;
  region: string;
  population: string;
  techScene: string;
  description: string;
  longDescription?: string;
  topIndustries?: string[];
  aiOpportunities?: string[];
  faq?: FAQItem[];
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

export interface Mission {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  timeline: string;
  agentRoles: string[];
  faq: FAQItem[];
  longDescription?: string;
}

export interface Workflow {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  steps: string[];
  tools: string[];
  faq: FAQItem[];
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
  useCases: string[];
  pros: string[];
  cons: string[];
  faq?: FAQItem[];
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

export interface PillarSection {
  id: string;
  title: string;
  content: string;
}

export interface PillarRelatedSlugs {
  comparisons: string[];
  alternatives: string[];
  reviews: string[];
  pricing: string[];
  guides: string[];
  glossary: string[];
}

export interface PillarPage {
  slug: string;
  type: "tool" | "learn";
  name: string;
  title: string;
  description: string;
  heroSubtitle: string;
  sections: PillarSection[];
  relatedSlugs: PillarRelatedSlugs;
  faq: FAQItem[];
}
