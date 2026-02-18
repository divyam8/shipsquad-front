import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools
    .filter((t) => t.hasAlternativePage)
    .map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: `Best ${tool.name} Alternatives in 2026 (Top ${tool.alternatives.length}+ Options)`,
    description: `Looking for a ${tool.name} alternative? Compare the best ${tool.name} alternatives and competitors for 2026. Find the right tool for your needs.`,
    alternates: { canonical: `/alternative/${slug}` },
    openGraph: {
      title: `Best ${tool.name} Alternatives in 2026`,
      description: `Compare the best ${tool.name} alternatives and competitors.`,
      url: `https://shipsquad.ai/alternative/${slug}`,
    },
  };
}

export const revalidate = 86400;

export default async function AlternativePage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const alternativeTools = tool.alternatives
    .map((altSlug) => tools.find((t) => t.slug === altSlug))
    .filter(Boolean);

  const relatedPages = alternativeTools.slice(0, 5).map((t) => ({
    title: `${t!.name} Alternatives`,
    href: `/alternative/${t!.slug}`,
    category: t!.category,
  }));

  const faq = [
    { question: `What is the best alternative to ${tool.name}?`, answer: `The best ${tool.name} alternatives include ${alternativeTools.slice(0, 3).map(t => t!.name).join(", ")}. The right choice depends on your specific needs, budget, and use case.` },
    { question: `Is ${tool.name} worth the price?`, answer: `${tool.name} pricing starts at ${tool.pricingDetail}. Whether it's worth it depends on your needs. ${alternativeTools[0]?.name || "Other tools"} may offer better value for certain use cases.` },
    { question: `Can I switch from ${tool.name} to an alternative?`, answer: `Yes, most ${tool.name} alternatives offer import tools or migration support. The switch typically takes a few hours to a few days depending on your data and workflow complexity.` },
    { question: "How does ShipSquad compare?", answer: `ShipSquad takes a different approach — instead of a single tool, you get a full AI squad of 10 specialized agents working together on your mission for $99/mo.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.name,
    description: tool.description,
    aggregateRating: { "@type": "AggregateRating", ratingValue: tool.rating, bestRating: 5, ratingCount: Math.floor(Math.random() * 500) + 100 },
  };

  const tocItems = [
    { id: "overview", title: `Why Look for ${tool.name} Alternatives?`, level: 2 },
    { id: "alternatives", title: `Top ${tool.name} Alternatives`, level: 2 },
    ...alternativeTools.map((t) => ({ id: t!.slug, title: t!.name, level: 3 })),
    { id: "comparison", title: "Feature Comparison", level: 2 },
    { id: "shipsquad", title: "The ShipSquad Approach", level: 2 },
    { id: "faq", title: "FAQ", level: 2 },
  ];

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Alternatives", href: "/alternative/chatgpt" },
        { label: `${tool.name} Alternatives` },
      ]}
      relatedPages={relatedPages}
      tocItems={tocItems}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        Best {tool.name} Alternatives in 2026
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        {tool.name} is a popular {tool.category.toLowerCase()} tool, but it&apos;s not the only option. Here are the best alternatives for 2026, compared by features, pricing, and use case.
      </p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Why Look for {tool.name} Alternatives?
        </h2>
        <p className="text-text-secondary mb-4">{tool.description}</p>
        <p className="text-text-secondary mb-4">
          While {tool.name} is a strong choice in the {tool.category} space, there are several reasons you might want an alternative:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-2">
          {tool.cons.map((con, i) => (
            <li key={i}>{con}</li>
          ))}
          <li>Your specific use case may be better served by a specialized tool</li>
        </ul>
      </section>

      <section id="alternatives" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Top {tool.name} Alternatives for 2026
        </h2>
        <div className="space-y-8">
          {alternativeTools.map((alt, i) => (
            <div key={alt!.slug} id={alt!.slug} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-text-primary">
                  {i + 1}. {alt!.name}
                </h3>
                <span className="text-sm text-accent-blue font-medium">{alt!.pricing}</span>
              </div>
              <p className="text-text-secondary mb-4">{alt!.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-green-400 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {alt!.pros.map((pro, j) => (
                      <li key={j} className="text-sm text-text-secondary flex items-start gap-1.5">
                        <span className="text-green-400 mt-0.5">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {alt!.cons.map((con, j) => (
                      <li key={j} className="text-sm text-text-secondary flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">-</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {alt!.features.slice(0, 4).map((f, j) => (
                  <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-secondary">
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <a href={`/review/${alt!.slug}`} className="text-sm text-accent-blue hover:underline">Read full review &rarr;</a>
                <a href={`/pricing/${alt!.slug}`} className="text-sm text-text-muted hover:text-text-secondary">See pricing &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Feature Comparison</h2>
        <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-4 py-3 text-sm font-medium text-text-secondary">Tool</th>
                <th className="px-4 py-3 text-sm font-medium text-text-secondary">Pricing</th>
                <th className="px-4 py-3 text-sm font-medium text-text-secondary">Rating</th>
                <th className="px-4 py-3 text-sm font-medium text-text-secondary">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/[0.03]">
                <td className="px-4 py-3 text-sm text-accent-blue font-medium">{tool.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{tool.pricingDetail}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{tool.rating}/5</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{tool.category}</td>
              </tr>
              {alternativeTools.map((alt) => (
                <tr key={alt!.slug} className="border-b border-white/[0.03] last:border-0">
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{alt!.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{alt!.pricingDetail}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{alt!.rating}/5</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{alt!.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="shipsquad" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          The ShipSquad Approach: Why Use One Tool When You Can Have a Full AI Squad?
        </h2>
        <p className="text-text-secondary mb-4">
          Instead of choosing between individual tools, ShipSquad gives you a complete AI squad — 10 specialized agents working together on your mission. For $99/mo + your Claude subscription, you get:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-2">
          <li>Pre-built specialist agents (Jarvis, Loki, Fury, Vision, and more)</li>
          <li>Custom agents tailored to your specific needs</li>
          <li>Telegram-based communication — manage your squad from your phone</li>
          <li>Agents that work together, not in silos</li>
        </ul>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
