import { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { useCases } from "@/data/use-cases";
import { industries } from "@/data/industries";
import { roles } from "@/data/roles";
import { workflows } from "@/data/workflows";
import { cities } from "@/data/cities";
import { glossaryTerms } from "@/data/glossary";
import { guides } from "@/data/guides";
import { aiModels } from "@/data/ai-models";
import { frameworks } from "@/data/frameworks";
import { missions } from "@/data/missions";
import { blogPosts } from "@/data/blog-posts";

const BASE_URL = "https://shipsquad.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/tools/ai-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/ai-squad-builder`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/roi-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const alternativePages: MetadataRoute.Sitemap = tools
    .filter((t) => t.hasAlternativePage)
    .map((t) => ({
      url: `${BASE_URL}/alternative/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${BASE_URL}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const pricingPages: MetadataRoute.Sitemap = tools
    .filter((t) => t.hasPricingPage)
    .map((t) => ({
      url: `${BASE_URL}/pricing/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const reviewPages: MetadataRoute.Sitemap = tools
    .filter((t) => t.hasReviewPage)
    .map((t) => ({
      url: `${BASE_URL}/review/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const useCasePages: MetadataRoute.Sitemap = useCases.map((u) => ({
    url: `${BASE_URL}/ai-agent-for/${u.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const industryPages: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${BASE_URL}/ai-squad-for/${i.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const rolePages: MetadataRoute.Sitemap = roles.map((r) => ({
    url: `${BASE_URL}/ai-tools-for/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const workflowPages: MetadataRoute.Sitemap = workflows.map((w) => ({
    url: `${BASE_URL}/ai-workflow/${w.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE_URL}/how-to/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const modelPages: MetadataRoute.Sitemap = aiModels.map((m) => ({
    url: `${BASE_URL}/ai-model/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const frameworkPages: MetadataRoute.Sitemap = frameworks.map((f) => ({
    url: `${BASE_URL}/framework/${f.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/location/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const glossaryPages: MetadataRoute.Sitemap = glossaryTerms.map((g) => ({
    url: `${BASE_URL}/glossary/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const missionPages: MetadataRoute.Sitemap = missions.map((m) => ({
    url: `${BASE_URL}/mission/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const vsPages: MetadataRoute.Sitemap = comparisons
    .filter((c) => c.isVsTraditional)
    .map((c) => ({
      url: `${BASE_URL}/vs/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...alternativePages,
    ...comparisonPages,
    ...pricingPages,
    ...reviewPages,
    ...useCasePages,
    ...industryPages,
    ...rolePages,
    ...workflowPages,
    ...guidePages,
    ...modelPages,
    ...frameworkPages,
    ...cityPages,
    ...glossaryPages,
    ...missionPages,
    ...vsPages,
    ...blogPages,
  ];
}
