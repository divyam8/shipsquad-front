import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { glossaryTerms } from "@/data/glossary";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getLearnPillarLinks } from "@/lib/pillar-links";
import { buildDefinedTermSchema, buildBreadcrumbSchema } from "@/lib/schema-helpers";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return glossaryTerms.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = glossaryTerms.find((g) => g.slug === slug);
  if (!term) return {};
  return {
    title: `What Is ${term.term}? Simple Definition + How AI Teams Use It`,
    description: `${term.term}: ${term.definition.slice(0, 100)} — explained for practitioners, not academics. See real examples and tools.`,
    alternates: { canonical: `/glossary/${slug}` },
  };
}

export const revalidate = 86400;

export default async function GlossaryPage({ params }: Props) {
  const { slug } = await params;
  const term = glossaryTerms.find((g) => g.slug === slug);
  if (!term) notFound();

  const relatedTermPages = term.relatedTerms
    .map((slug) => glossaryTerms.find((g) => g.slug === slug))
    .filter(Boolean)
    .map((t) => ({ title: `What is ${t!.term}?`, href: `/glossary/${t!.slug}`, category: t!.category }));
  const learnLinks = getLearnPillarLinks(term.category);

  const definedTermJsonLd = buildDefinedTermSchema({
    name: term.term,
    description: term.definition,
  });

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", url: "https://shipsquad.ai" },
    { name: "Glossary", url: "https://shipsquad.ai/glossary/ai-agent" },
    { name: term.term },
  ]);

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Glossary", href: "/glossary/ai-agent" },
        { label: term.term },
      ]}
      relatedPages={relatedTermPages}
      furtherReading={learnLinks}
      showTOC={false}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        What is {term.term}?
      </h1>
      <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue mb-8 inline-block">{term.category}</span>
      <LastUpdated />

      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 mb-8">
        <p className="text-lg text-text-primary font-medium">{term.definition}</p>
      </div>

      <div className="text-text-secondary leading-relaxed space-y-4 mb-10">
        <p>{term.longDescription}</p>
      </div>

      {term.longDefinition && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">{term.term}: A Comprehensive Guide</h2>
          <div className="text-text-secondary leading-relaxed space-y-4">
            {term.longDefinition.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {relatedTermPages.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4">Related Terms</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTermPages.map((t, i) => (
              <a key={i} href={t.href} className="text-sm px-3 py-1.5 rounded-full bg-white/[0.05] text-text-secondary border border-white/[0.05] hover:border-accent-blue/30 transition-colors">
                {t.title.replace("What is ", "").replace("?", "")}
              </a>
            ))}
          </div>
        </section>
      )}
    </SEOPageLayout>
  );
}
