import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { getToolPillarLink } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.filter((t) => t.hasReviewPage).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.name} Review 2026: Features, Pricing & Honest Analysis`,
    description: `In-depth ${tool.name} review for 2026. We cover features, pricing, pros, cons, and who it's best for. Is ${tool.name} worth it?`,
    alternates: { canonical: `/review/${slug}` },
    other: {
      "article:modified_time": new Date().toISOString(),
      "article:section": tool.category,
      "article:author": "https://shipsquad.ai/about",
    },
  };
}

export const revalidate = 86400;

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const relatedPages = [
    ...tools.filter((t) => t.slug !== slug && t.category === tool.category && t.hasReviewPage).slice(0, 3).map((t) => ({ title: `${t.name} Review`, href: `/review/${t.slug}`, category: "Review" })),
    { title: `${tool.name} Pricing`, href: `/pricing/${tool.slug}`, category: "Pricing" },
    { title: `${tool.name} Alternatives`, href: `/alternative/${tool.slug}`, category: "Alternatives" },
  ];

  // Cross-link to comparison pages for this tool
  const toolComparisons = comparisons
    .filter((c) => !c.isVsTraditional && (c.toolASlug === slug || c.toolBSlug === slug))
    .slice(0, 3)
    .map((c) => ({
      title: `${c.toolA} vs ${c.toolB}`,
      href: `/compare/${c.slug}`,
      description: c.verdict.slice(0, 80) + "...",
    }));

  const pillarLink = getToolPillarLink(slug);
  const furtherReading = [
    ...(pillarLink ? [pillarLink] : []),
    ...toolComparisons,
    ...(tool.hasAlternativePage ? [{ title: `Best ${tool.name} Alternatives in 2026`, href: `/alternative/${slug}`, description: `Compare top alternatives` }] : []),
    ...(tool.hasPricingPage ? [{ title: `${tool.name} Pricing Breakdown`, href: `/pricing/${slug}`, description: `Complete cost analysis` }] : []),
  ];

  const faq = [
    { question: `Is ${tool.name} good in 2026?`, answer: `${tool.name} scores ${tool.rating}/5 in our analysis. It excels at ${tool.pros[0]?.toLowerCase() || "its core features"} but has limitations around ${tool.cons[0]?.toLowerCase() || "certain edge cases"}.` },
    { question: `Who is ${tool.name} best for?`, answer: `${tool.name} is best for users who need ${tool.features[0]?.toLowerCase() || "AI capabilities"} and ${tool.features[1]?.toLowerCase() || "automation features"}.` },
    { question: `What are the main drawbacks of ${tool.name}?`, answer: `The main drawbacks are: ${tool.cons.join(". ")}.` },
    { question: "How does ShipSquad compare?", answer: "ShipSquad takes a different approach — instead of a single tool, you get 10 specialized AI agents working together for $99/mo." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Product", name: tool.name, description: tool.description },
    reviewRating: { "@type": "Rating", ratingValue: tool.rating, bestRating: 5 },
    author: { "@type": "Organization", name: "ShipSquad" },
    publisher: { "@type": "Organization", name: "ShipSquad" },
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Reviews", href: "/review/chatgpt" },
        { label: `${tool.name} Review` },
      ]}
      relatedPages={relatedPages}
      furtherReading={furtherReading}
      tocItems={[
        { id: "verdict", title: "Quick Verdict", level: 2 },
        ...(tool.longDescription ? [{ id: "in-depth", title: "In-Depth Review", level: 2 }] : []),
        { id: "features", title: "Key Features", level: 2 },
        ...(tool.keyDifferentiators?.length ? [{ id: "differentiators", title: "Key Differentiators", level: 2 }] : []),
        { id: "pros-cons", title: "Pros & Cons", level: 2 },
        ...(tool.bestFor?.length ? [{ id: "who-should-use", title: `Who Should Use ${tool.name}?`, level: 2 }] : []),
        { id: "pricing", title: "Pricing", level: 2 },
        ...(tool.expertVerdict ? [{ id: "expert-verdict", title: "Expert Verdict", level: 2 }] : []),
        { id: "alternatives", title: "Alternatives", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {tool.name} Review 2026: Is It Worth It?
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        An honest, in-depth review of {tool.name} — one of the most popular {tool.category.toLowerCase()} tools in 2026.
      </p>

      <section id="verdict" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Quick Verdict</h2>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold text-accent-blue">{tool.rating}</span>
            <span className="text-lg text-text-muted">/5</span>
            <span className="text-sm px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{tool.pricing}</span>
          </div>
          <p className="text-text-secondary">{tool.description}</p>
        </div>
      </section>

      {tool.longDescription && (
        <section id="in-depth" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">In-Depth Review: {tool.name}</h2>
          <div className="text-text-secondary leading-relaxed space-y-4">
            {tool.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      <section id="features" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Key Features</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {tool.features.map((feature, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 flex items-start gap-2">
              <span className="text-accent-blue mt-0.5">&#10003;</span>
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {tool.keyDifferentiators && tool.keyDifferentiators.length > 0 && (
        <section id="differentiators" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">What Sets {tool.name} Apart</h2>
          <div className="space-y-3">
            {tool.keyDifferentiators.map((diff, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-accent-blue/10 bg-accent-blue/5 p-4">
                <span className="text-accent-blue font-bold mt-0.5 shrink-0">{i + 1}.</span>
                <p className="text-text-secondary text-sm">{diff}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="pros-cons" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Pros & Cons</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">Pros</h3>
            <ul className="space-y-2">
              {tool.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-green-400 mt-0.5">+</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">Cons</h3>
            <ul className="space-y-2">
              {tool.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-red-400 mt-0.5">-</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {tool.bestFor && tool.bestFor.length > 0 && (
        <section id="who-should-use" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Who Should Use {tool.name}?</h2>
          <div className="space-y-3">
            {tool.bestFor.map((useCase, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
                <span className="text-accent-blue mt-0.5 shrink-0">&#10003;</span>
                <p className="text-text-secondary text-sm">{useCase}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="pricing" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Pricing</h2>
        <p className="text-text-secondary mb-2">{tool.pricingDetail}</p>
        {tool.detailedPricing && (
          <div className="text-text-secondary leading-relaxed mt-4 space-y-3">
            {tool.detailedPricing.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
        <a href={`/pricing/${tool.slug}`} className="inline-block mt-3 text-sm text-accent-blue hover:underline">See detailed pricing breakdown &rarr;</a>
      </section>

      {tool.expertVerdict && (
        <section id="expert-verdict" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Expert Verdict</h2>
          <div className="rounded-xl border border-accent-purple/20 bg-accent-purple/5 p-6">
            <p className="text-text-secondary leading-relaxed">{tool.expertVerdict}</p>
          </div>
        </section>
      )}

      <section id="alternatives" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Top Alternatives</h2>
        <div className="flex flex-wrap gap-2">
          {tool.alternatives.map((altSlug) => {
            const alt = tools.find((t) => t.slug === altSlug);
            return alt ? (
              <a key={altSlug} href={`/review/${altSlug}`} className="text-sm px-3 py-1.5 rounded-full bg-white/[0.05] text-text-secondary border border-white/[0.05] hover:border-accent-blue/30 transition-colors">
                {alt.name}
              </a>
            ) : null;
          })}
        </div>
        <a href={`/alternative/${tool.slug}`} className="inline-block mt-3 text-sm text-accent-blue hover:underline">See all {tool.name} alternatives &rarr;</a>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
