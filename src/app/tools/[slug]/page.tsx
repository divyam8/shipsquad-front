import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pillarPages } from "@/data/pillar-pages";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return pillarPages
    .filter((p) => p.type === "tool")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pillarPages.find((p) => p.slug === slug && p.type === "tool");
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://shipsquad.ai/tools/${slug}`,
      type: "article",
    },
    other: {
      "article:modified_time": new Date().toISOString(),
      "article:section": "AI Tools",
      "article:author": "https://shipsquad.ai/about",
    },
  };
}

export const revalidate = 86400;

export default async function ToolPillarPage({ params }: Props) {
  const { slug } = await params;
  const page = pillarPages.find((p) => p.slug === slug && p.type === "tool");
  if (!page) notFound();

  const relatedPages = [
    ...page.relatedSlugs.comparisons.map((s) => ({
      title: s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/compare/${s}`,
      category: "Comparison",
    })),
    ...page.relatedSlugs.alternatives.map((s) => ({
      title: s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/alternative/${s}`,
      category: "Alternative",
    })),
    ...page.relatedSlugs.reviews.map((s) => ({
      title: s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Review",
      href: `/review/${s}`,
      category: "Review",
    })),
    ...page.relatedSlugs.pricing.map((s) => ({
      title: s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Pricing",
      href: `/pricing/${s}`,
      category: "Pricing",
    })),
  ];

  const furtherReading = [
    ...page.relatedSlugs.guides.map((s) => ({
      title: s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/how-to/${s}`,
      description: "Step-by-step guide",
    })),
    ...page.relatedSlugs.glossary.map((s) => ({
      title: `What is ${s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}?`,
      href: `/glossary/${s}`,
      description: "Definition & explanation",
    })),
  ];

  const tocItems = [
    { id: "overview", title: "Overview", level: 2 },
    ...page.sections.map((s) => ({ id: s.id, title: s.title, level: 2 })),
    { id: "faq", title: "FAQ", level: 2 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    author: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
    publisher: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://shipsquad.ai/tools/${slug}`,
    },
    articleSection: "AI Tools",
    about: page.sections.map((s) => ({
      "@type": "Thing",
      name: s.title,
    })),
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools/ai-cost-calculator" },
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

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {page.title}
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        {page.heroSubtitle}
      </p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Overview</h2>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-text-secondary leading-relaxed">{page.description}</p>
        </div>
      </section>

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

      <FAQSchema items={page.faq} />
    </SEOPageLayout>
  );
}
