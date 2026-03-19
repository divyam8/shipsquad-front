import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getToolPillarLink } from "@/lib/pillar-links";
import { buildSoftwareApplicationSchema } from "@/lib/schema-helpers";
import { generateAlternativeFAQs } from "@/lib/faq-generators";
import { RelatedToolPages } from "@/components/seo/RelatedToolPages";

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
  const altNames = tool.alternatives.slice(0, 3).map(s => tools.find(t => t.slug === s)?.name).filter(Boolean);
  return {
    title: `${tool.name} Not Right? ${tool.alternatives.length} Better Alternatives for ${new Date().getFullYear()}`,
    description: `Switching from ${tool.name}? We ranked ${tool.alternatives.length} alternatives by features, pricing & real user fit. ${altNames.slice(0, 2).join(", ")} lead the pack.`,
    alternates: { canonical: `/alternative/${slug}` },
    openGraph: {
      title: `Best ${tool.name} Alternatives in 2026`,
      description: `Compare the best ${tool.name} alternatives and competitors.`,
      url: `https://shipsquad.ai/alternative/${slug}`,
    },
    other: {
      "article:modified_time": new Date().toISOString(),
      "article:section": tool.category,
      "article:author": "https://shipsquad.ai/about",
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

  // Cross-link to comparison pages involving this tool
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
    { title: `${tool.name} Review 2026`, href: `/review/${slug}`, description: `In-depth review and analysis` },
    { title: `${tool.name} Pricing`, href: `/pricing/${slug}`, description: `Complete pricing breakdown` },
    ...toolComparisons,
  ];

  const altNames = alternativeTools.map((t) => t!.name);
  const faq = generateAlternativeFAQs(tool, altNames);

  const jsonLd = [
    buildSoftwareApplicationSchema(tool),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Best ${tool.name} Alternatives`,
      numberOfItems: alternativeTools.length,
      itemListElement: alternativeTools.map((alt, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: alt!.name,
          description: alt!.description,
          url: `https://shipsquad.ai/review/${alt!.slug}`,
        },
      })),
    },
  ];

  const tocItems = [
    { id: "overview", title: `Why Consider Switching from ${tool.name}?`, level: 2 },
    ...(tool.bestFor?.length ? [{ id: "best-for", title: "Best Alternative by Use Case", level: 2 }] : []),
    ...(tool.expertVerdict ? [{ id: "expert-verdict", title: "Expert Verdict", level: 2 }] : []),
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
      furtherReading={furtherReading}
      tocItems={tocItems}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        Best {tool.name} Alternatives in 2026
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        {tool.name} is a popular {tool.category.toLowerCase()} tool, but it&apos;s not the only option. Here are the best alternatives for 2026, compared by features, pricing, and use case.
      </p>
      <LastUpdated />

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Why Consider Switching from {tool.name}?
        </h2>
        {tool.longDescription ? (
          <div className="text-text-secondary leading-relaxed space-y-4 mb-6">
            {tool.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary mb-4">{tool.description}</p>
        )}
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

      {tool.bestFor && tool.bestFor.length > 0 && (
        <section id="best-for" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Best Alternative by Use Case
          </h2>
          <p className="text-text-secondary mb-4">
            Different alternatives to {tool.name} excel in different scenarios. Here&apos;s who each option is best for:
          </p>
          <div className="space-y-3">
            {tool.bestFor.map((useCase, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
                <span className="text-accent-blue mt-0.5 shrink-0">&#8594;</span>
                <p className="text-text-secondary text-sm">{useCase}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tool.expertVerdict && (
        <section id="expert-verdict" className="mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Expert Verdict on {tool.name}</h2>
          <div className="rounded-xl border border-accent-purple/20 bg-accent-purple/5 p-6">
            <p className="text-text-secondary leading-relaxed">{tool.expertVerdict}</p>
          </div>
        </section>
      )}

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

      <RelatedToolPages toolSlug={slug} currentPageType="alternative" />
    </SEOPageLayout>
  );
}
