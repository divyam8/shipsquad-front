import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { comparisons } from "@/data/comparisons";
import { tools } from "@/data/tools";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { ComparisonTable } from "@/components/seo/ComparisonTable";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getToolPillarLink } from "@/lib/pillar-links";
import { buildSoftwareApplicationSchema } from "@/lib/schema-helpers";
import { generateComparisonFAQs } from "@/lib/faq-generators";

interface Props {
  params: Promise<{ slugs: string }>;
}

export async function generateStaticParams() {
  return comparisons
    .filter((c) => !c.isVsTraditional)
    .map((c) => ({ slugs: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const comparison = comparisons.find((c) => c.slug === slugs);
  if (!comparison) return {};
  return {
    title: `${comparison.toolA} vs ${comparison.toolB}: We Tested Both — ${comparison.winnerSummary || 'See Who Wins'}`,
    description: `${comparison.toolA} vs ${comparison.toolB} compared on features, pricing & real use cases. ${comparison.verdict.slice(0, 120)} See the full head-to-head.`,
    alternates: { canonical: `/compare/${slugs}` },
    openGraph: {
      title: `${comparison.toolA} vs ${comparison.toolB} (2026)`,
      description: `Head-to-head comparison of ${comparison.toolA} and ${comparison.toolB}.`,
      type: "article",
      url: `https://shipsquad.ai/compare/${slugs}`,
    },
    other: {
      "article:modified_time": new Date().toISOString(),
      "article:section": comparison.category,
      "article:author": "https://shipsquad.ai/about",
    },
  };
}

export const revalidate = 86400;

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  const comparison = comparisons.find((c) => c.slug === slugs);
  if (!comparison) notFound();

  const relatedComparisons = comparisons
    .filter((c) => c.slug !== slugs && (c.toolASlug === comparison.toolASlug || c.toolBSlug === comparison.toolBSlug || c.category === comparison.category))
    .slice(0, 6)
    .map((c) => ({
      title: `${c.toolA} vs ${c.toolB}`,
      href: c.isVsTraditional ? `/vs/${c.slug}` : `/compare/${c.slug}`,
      category: c.category,
    }));

  const toolA = tools.find((t) => t.slug === comparison.toolASlug);
  const toolB = tools.find((t) => t.slug === comparison.toolBSlug);

  const pillarLinkA = getToolPillarLink(comparison.toolASlug);
  const pillarLinkB = getToolPillarLink(comparison.toolBSlug);
  const furtherReading = [
    ...(pillarLinkA ? [pillarLinkA] : []),
    ...(pillarLinkB && pillarLinkB.href !== pillarLinkA?.href ? [pillarLinkB] : []),
    ...(toolA?.hasReviewPage ? [{ title: `${comparison.toolA} Review 2026`, href: `/review/${comparison.toolASlug}`, description: `In-depth analysis of ${comparison.toolA}` }] : []),
    ...(toolB?.hasReviewPage ? [{ title: `${comparison.toolB} Review 2026`, href: `/review/${comparison.toolBSlug}`, description: `In-depth analysis of ${comparison.toolB}` }] : []),
    ...(toolA?.hasAlternativePage ? [{ title: `Best ${comparison.toolA} Alternatives`, href: `/alternative/${comparison.toolASlug}`, description: `Top alternatives to ${comparison.toolA}` }] : []),
    ...(toolA?.hasPricingPage ? [{ title: `${comparison.toolA} Pricing Breakdown`, href: `/pricing/${comparison.toolASlug}`, description: `Complete pricing guide` }] : []),
    ...(toolB?.hasPricingPage ? [{ title: `${comparison.toolB} Pricing Breakdown`, href: `/pricing/${comparison.toolBSlug}`, description: `Complete pricing guide` }] : []),
  ].slice(0, 6);

  const faq = generateComparisonFAQs(comparison.toolA, comparison.toolB, comparison.verdict, comparison.category);

  const jsonLd = [
    ...(toolA ? [buildSoftwareApplicationSchema(toolA)] : [{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: comparison.toolA, description: `${comparison.toolA} — ${comparison.category} tool` }]),
    ...(toolB ? [buildSoftwareApplicationSchema(toolB)] : [{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: comparison.toolB, description: `${comparison.toolB} — ${comparison.category} tool` }]),
  ];

  const winsA = comparison.features.filter((f) => f.winner === "a").length;
  const winsB = comparison.features.filter((f) => f.winner === "b").length;

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Comparisons", href: "/compare/chatgpt-vs-claude" },
        { label: `${comparison.toolA} vs ${comparison.toolB}` },
      ]}
      relatedPages={relatedComparisons}
      furtherReading={furtherReading}
      tocItems={[
        { id: "overview", title: "Quick Verdict", level: 2 },
        ...(comparison.detailedVerdict ? [{ id: "detailed-analysis", title: "Detailed Analysis", level: 2 }] : []),
        { id: "comparison", title: "Feature Comparison", level: 2 },
        ...(comparison.useCaseRecommendations?.length ? [{ id: "recommendation", title: "Our Recommendation", level: 2 }] : []),
        { id: "toolA", title: comparison.toolA, level: 2 },
        { id: "toolB", title: comparison.toolB, level: 2 },
        { id: "shipsquad", title: "The ShipSquad Alternative", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {comparison.toolA} vs {comparison.toolB}: Which Is Better in 2026?
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        A detailed comparison of {comparison.toolA} and {comparison.toolB} in the {comparison.category} space. We compare features, pricing, pros, and cons to help you choose.
      </p>
      <LastUpdated />

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Quick Verdict</h2>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-text-secondary">{comparison.verdict}</p>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-accent-blue">{winsA}</span>
              <p className="text-xs text-text-muted mt-1">{comparison.toolA} wins</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-text-muted">{comparison.features.filter(f => f.winner === "tie").length}</span>
              <p className="text-xs text-text-muted mt-1">Ties</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-accent-purple">{winsB}</span>
              <p className="text-xs text-text-muted mt-1">{comparison.toolB} wins</p>
            </div>
          </div>
        </div>
      </section>

      {comparison.detailedVerdict && (
        <section id="detailed-analysis" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {comparison.toolA} vs {comparison.toolB}: Detailed Analysis
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-4">
            {comparison.detailedVerdict.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {comparison.winnerSummary && (
            <div className="mt-6 rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-5">
              <p className="text-sm font-semibold text-accent-blue mb-1">Bottom Line</p>
              <p className="text-text-primary">{comparison.winnerSummary}</p>
            </div>
          )}
        </section>
      )}

      <section id="comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Feature-by-Feature Comparison</h2>
        <ComparisonTable
          toolAName={comparison.toolA}
          toolBName={comparison.toolB}
          features={comparison.features}
        />
      </section>

      {comparison.useCaseRecommendations && comparison.useCaseRecommendations.length > 0 && (
        <section id="recommendation" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Recommendation: Which Should You Choose?</h2>
          <div className="space-y-3">
            {comparison.useCaseRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
                <span className="text-accent-blue mt-0.5 shrink-0">&#8594;</span>
                <p className="text-text-secondary text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="toolA" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {comparison.toolA} Overview
        </h2>
        <p className="text-text-secondary mb-4">
          {comparison.toolA} is a {comparison.category.toLowerCase()} tool that competes directly with {comparison.toolB}.
        </p>
        <div className="flex gap-3 mt-4">
          <a href={`/review/${comparison.toolASlug}`} className="text-sm text-accent-blue hover:underline">Full {comparison.toolA} Review &rarr;</a>
          <a href={`/alternative/${comparison.toolASlug}`} className="text-sm text-text-muted hover:text-text-secondary">{comparison.toolA} Alternatives &rarr;</a>
        </div>
      </section>

      <section id="toolB" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {comparison.toolB} Overview
        </h2>
        <p className="text-text-secondary mb-4">
          {comparison.toolB} is a {comparison.category.toLowerCase()} tool that offers an alternative approach to {comparison.toolA}.
        </p>
        <div className="flex gap-3 mt-4">
          <a href={`/review/${comparison.toolBSlug}`} className="text-sm text-accent-blue hover:underline">Full {comparison.toolB} Review &rarr;</a>
          <a href={`/alternative/${comparison.toolBSlug}`} className="text-sm text-text-muted hover:text-text-secondary">{comparison.toolB} Alternatives &rarr;</a>
        </div>
      </section>

      <section id="shipsquad" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Beyond {comparison.toolA} vs {comparison.toolB}: The ShipSquad Approach
        </h2>
        <p className="text-text-secondary mb-4">
          Instead of choosing between individual tools, ShipSquad gives you a complete AI squad — 10 specialized agents that work together. For $99/mo, you get pre-built specialists like Jarvis (research), Loki (strategy), and Fury (execution), plus custom agents tailored to your needs.
        </p>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
