import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pillarPages } from "@/data/pillar-pages";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return pillarPages
    .filter((p) => p.type === "learn")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pillarPages.find((p) => p.slug === slug && p.type === "learn");
  if (!page) return {};
  const year = new Date().getFullYear();
  const newTitle = `${page.title}: The Practical Guide (${year})`;
  const newDescription = `${page.description.slice(0, 120)} A comprehensive guide with tools, examples, and actionable steps.`;
  return {
    title: newTitle,
    description: newDescription,
    alternates: { canonical: `/learn/${slug}` },
    openGraph: {
      title: newTitle,
      description: newDescription,
      url: `/learn/${slug}`,
      type: "article",
      siteName: "ShipSquad",
    },
    other: {
      "article:modified_time": new Date().toISOString(),
      "article:section": "Learn",
      "article:author": "https://shipsquad.ai/about",
    },
  };
}

export const revalidate = 86400;

export default async function LearnPillarPage({ params }: Props) {
  const { slug } = await params;
  const page = pillarPages.find((p) => p.slug === slug && p.type === "learn");
  if (!page) notFound();

  // Related pages sidebar — comparisons, guides, and glossary links
  const relatedPages = [
    ...page.relatedSlugs.comparisons.map((s) => ({
      title: s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/compare/${s}`,
      category: "Comparison",
    })),
    ...page.relatedSlugs.guides.map((s) => ({
      title: s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/how-to/${s}`,
      category: "Guide",
    })),
    ...page.relatedSlugs.glossary.map((s) => ({
      title: s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/glossary/${s}`,
      category: "Glossary",
    })),
  ];

  // Further reading — reviews, pricing, and alternative links
  const furtherReading = [
    ...page.relatedSlugs.reviews.map((s) => ({
      title: `${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Review`,
      href: `/review/${s}`,
      description: `In-depth review and analysis`,
    })),
    ...page.relatedSlugs.pricing.map((s) => ({
      title: `${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Pricing`,
      href: `/pricing/${s}`,
      description: `Complete pricing breakdown`,
    })),
    ...page.relatedSlugs.alternatives.map((s) => ({
      title: `Best ${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Alternatives`,
      href: `/alternative/${s}`,
      description: `Top alternatives compared`,
    })),
  ];

  // TOC items from sections
  const tocItems = [
    { id: "overview", title: "Overview", level: 2 },
    ...page.sections.map((s) => ({ id: s.id, title: s.title, level: 2 })),
    ...(page.faq.length > 0 ? [{ id: "faq", title: "FAQ", level: 2 }] : []),
  ];

  // JSON-LD Article schema for educational content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    author: {
      "@type": "Organization",
      name: "ShipSquad",
      url: "https://shipsquad.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "ShipSquad",
      url: "https://shipsquad.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://shipsquad.ai/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://shipsquad.ai/learn/${slug}`,
    },
    dateModified: new Date().toISOString(),
    articleSection: "Learn",
    educationalLevel: "Beginner to Advanced",
    about: {
      "@type": "Thing",
      name: page.name,
    },
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Learn", href: `/learn/${pillarPages.find((p) => p.type === "learn")?.slug || slug}` },
        { label: page.name },
      ]}
      relatedPages={relatedPages}
      furtherReading={furtherReading}
      tocItems={tocItems}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero section */}
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {page.title}
      </h1>
      <p className="text-lg text-text-secondary mb-8">{page.heroSubtitle}</p>
      <LastUpdated />

      {/* Overview */}
      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Overview</h2>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-text-secondary leading-relaxed">{page.description}</p>
        </div>
      </section>

      {/* All sections */}
      {page.sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {section.title}
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-4">
            {section.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      {/* FAQ */}
      {page.faq.length > 0 && <FAQSchema items={page.faq} />}
    </SEOPageLayout>
  );
}
