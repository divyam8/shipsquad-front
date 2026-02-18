import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aiModels } from "@/data/ai-models";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return aiModels.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = aiModels.find((m) => m.slug === slug);
  if (!model) return {};
  return {
    title: `${model.name} Review 2026: Capabilities, Pricing & Analysis`,
    description: `${model.name} by ${model.provider} — complete review for 2026. Capabilities, pricing, context window, and how it compares to competitors.`,
    alternates: { canonical: `/ai-model/${slug}` },
  };
}

export const revalidate = 86400;

export default async function AIModelPage({ params }: Props) {
  const { slug } = await params;
  const model = aiModels.find((m) => m.slug === slug);
  if (!model) notFound();

  const relatedModels = aiModels.filter((m) => m.slug !== slug && m.category === model.category).slice(0, 6).map((m) => ({ title: `${m.name} Review`, href: `/ai-model/${m.slug}`, category: m.provider }));
  const learnLinks = getLearnPillarLinks(model.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.name,
    applicationCategory: model.category,
    operatingSystem: "Cloud",
    offers: { "@type": "Offer", description: model.pricing },
    review: { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: model.rating, bestRating: 5 }, author: { "@type": "Organization", name: "ShipSquad" } },
  };

  const faq = [
    { question: `What is ${model.name}?`, answer: model.description },
    { question: `How much does ${model.name} cost?`, answer: `${model.name} pricing: ${model.pricing}` },
    { question: `What is the context window for ${model.name}?`, answer: `${model.name} supports a context window of ${model.contextWindow}.` },
    { question: `When was ${model.name} released?`, answer: `${model.name} was released on ${model.releaseDate} by ${model.provider}.` },
  ];

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "AI Models", href: "/ai-model/gpt-4o" },
        { label: model.name },
      ]}
      relatedPages={relatedModels}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        ...(model.longDescription ? [{ id: "deep-dive", title: "Performance Deep Dive", level: 2 }] : []),
        { id: "capabilities", title: "Capabilities", level: 2 },
        ...(model.bestUseCases?.length ? [{ id: "best-use-cases", title: "Best Use Cases", level: 2 }] : []),
        { id: "pricing", title: "Pricing", level: 2 },
        { id: "pros-cons", title: "Pros & Cons", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{model.name} Review 2026</h1>
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{model.provider}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{model.category}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{model.releaseDate}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-purple/10 text-accent-purple">{model.rating}/5</span>
      </div>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Overview</h2>
        <p className="text-text-secondary mb-4">{model.description}</p>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 grid sm:grid-cols-3 gap-4">
          <div><span className="text-xs text-text-muted block">Provider</span><span className="text-sm text-text-primary font-medium">{model.provider}</span></div>
          <div><span className="text-xs text-text-muted block">Context Window</span><span className="text-sm text-text-primary font-medium">{model.contextWindow}</span></div>
          <div><span className="text-xs text-text-muted block">Pricing</span><span className="text-sm text-text-primary font-medium">{model.pricing}</span></div>
        </div>
      </section>

      {model.longDescription && (
        <section id="deep-dive" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Performance Deep Dive: {model.name}</h2>
          <div className="text-text-secondary leading-relaxed space-y-4">
            {model.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {model.performanceBenchmarks && (
            <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
              <p className="text-sm font-semibold text-accent-blue mb-2">Benchmark Performance</p>
              <p className="text-text-secondary text-sm">{model.performanceBenchmarks}</p>
            </div>
          )}
        </section>
      )}

      <section id="capabilities" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Capabilities</h2>
        <ul className="space-y-2">
          {model.capabilities.map((cap, i) => (
            <li key={i} className="flex items-start gap-2 text-text-secondary">
              <span className="text-accent-blue mt-0.5">&#10003;</span> {cap}
            </li>
          ))}
        </ul>
      </section>

      {model.bestUseCases && model.bestUseCases.length > 0 && (
        <section id="best-use-cases" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Best Use Cases for {model.name}</h2>
          <div className="space-y-3">
            {model.bestUseCases.map((useCase, i) => (
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
        <p className="text-text-secondary">{model.pricing}</p>
      </section>

      <section id="pros-cons" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Pros & Cons</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-3">Pros</h3>
            <ul className="space-y-2">{model.pros.map((p, i) => (<li key={i} className="text-sm text-text-secondary flex items-start gap-1.5"><span className="text-green-400">+</span>{p}</li>))}</ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-3">Cons</h3>
            <ul className="space-y-2">{model.cons.map((c, i) => (<li key={i} className="text-sm text-text-secondary flex items-start gap-1.5"><span className="text-red-400">-</span>{c}</li>))}</ul>
          </div>
        </div>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
