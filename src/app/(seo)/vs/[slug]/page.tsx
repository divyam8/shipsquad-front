import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { comparisons } from "@/data/comparisons";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { ComparisonTable } from "@/components/seo/ComparisonTable";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return comparisons.filter((c) => c.isVsTraditional).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = comparisons.find((c) => c.slug === slug && c.isVsTraditional);
  if (!comparison) return {};
  const year = new Date().getFullYear();
  return {
    title: `${comparison.toolA} vs ${comparison.toolB}: ${comparison.winnerSummary || 'Which Wins?'} (${year})`,
    description: `${comparison.toolA} vs ${comparison.toolB} — real comparison with features, pricing & verdict. ${comparison.verdict.slice(0, 80)}`,
    alternates: { canonical: `/vs/${slug}` },
  };
}

export const revalidate = 86400;

export default async function VsPage({ params }: Props) {
  const { slug } = await params;
  const comparison = comparisons.find((c) => c.slug === slug && c.isVsTraditional);
  if (!comparison) notFound();

  const relatedComps = comparisons.filter((c) => c.slug !== slug && c.isVsTraditional).slice(0, 6).map((c) => ({ title: `${c.toolA} vs ${c.toolB}`, href: `/vs/${c.slug}`, category: c.category }));
  const learnLinks = getLearnPillarLinks(comparison.category);

  const faq = [
    { question: `Should I choose ${comparison.toolA} or ${comparison.toolB}?`, answer: comparison.verdict },
    { question: `What are the cost differences?`, answer: `The cost comparison depends on your specific needs. ${comparison.toolA} and ${comparison.toolB} have different pricing models that suit different use cases and scales.` },
    { question: "What does ShipSquad offer?", answer: "ShipSquad offers managed AI squads — 10 specialized agents working together for $99/mo. It's the AI-first approach to getting work done." },
  ];

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "AI vs Traditional", href: "/vs/ai-team-vs-hiring-developers" },
        { label: `${comparison.toolA} vs ${comparison.toolB}` },
      ]}
      relatedPages={relatedComps}
      furtherReading={learnLinks}
      tocItems={[
        { id: "verdict", title: "Quick Verdict", level: 2 },
        { id: "comparison", title: "Detailed Comparison", level: 2 },
        { id: "shipsquad", title: "The ShipSquad Way", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {comparison.toolA} vs {comparison.toolB}
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        A comprehensive comparison of {comparison.toolA.toLowerCase()} and {comparison.toolB.toLowerCase()} approaches in 2026.
      </p>
      <LastUpdated />

      <section id="verdict" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Quick Verdict</h2>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
          <p className="text-text-secondary">{comparison.verdict}</p>
        </div>
      </section>

      {comparison.detailedVerdict && (
        <section id="detailed-analysis" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">In-Depth Analysis</h2>
          <div className="text-text-secondary leading-relaxed space-y-4">
            {comparison.detailedVerdict.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      <section id="comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Detailed Comparison</h2>
        <ComparisonTable toolAName={comparison.toolA} toolBName={comparison.toolB} features={comparison.features} />
      </section>

      {comparison.useCaseRecommendations && comparison.useCaseRecommendations.length > 0 && (
        <section id="recommendation" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">When to Choose Which</h2>
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

      <section id="shipsquad" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">The ShipSquad Way</h2>
        <p className="text-text-secondary mb-4">
          ShipSquad combines the best of both worlds — AI efficiency with human expertise. For $99/mo, you get a full squad of 10 AI agents coordinated via Telegram, plus the ability to create custom agents for your specific needs.
        </p>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
