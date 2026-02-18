import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.filter((t) => t.hasPricingPage).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.name} Pricing 2026: Plans, Costs & Best Deals`,
    description: `${tool.name} pricing breakdown for 2026. Compare plans, features, and costs. Find the best ${tool.name} plan for your needs.`,
    alternates: { canonical: `/pricing/${slug}` },
  };
}

export const revalidate = 86400;

export default async function PricingPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const relatedPages = tools
    .filter((t) => t.slug !== slug && t.category === tool.category && t.hasPricingPage)
    .slice(0, 6)
    .map((t) => ({ title: `${t.name} Pricing`, href: `/pricing/${t.slug}`, category: t.category }));

  const faq = [
    { question: `How much does ${tool.name} cost?`, answer: `${tool.name} pricing starts at ${tool.pricingDetail}. Plans vary by features and usage limits.` },
    { question: `Is there a free plan for ${tool.name}?`, answer: `${tool.pricing === "Freemium" || tool.pricing === "Free" ? `Yes, ${tool.name} offers a free plan with limited features.` : `${tool.name} does not currently offer a free plan, but may offer a free trial.`}` },
    { question: `Is ${tool.name} worth the price?`, answer: `${tool.name} is a strong choice for ${tool.category.toLowerCase()}. Whether it's worth the price depends on your needs. Consider the features you'll actually use and compare with alternatives.` },
    { question: `How does ShipSquad pricing compare?`, answer: "ShipSquad is $99/mo + your Claude subscription for an entire AI squad of 10 agents. Instead of paying for individual tools, you get a full team working together." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.name,
    description: tool.description,
    offers: { "@type": "Offer", priceCurrency: "USD", price: tool.pricingDetail, description: `${tool.name} pricing` },
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Pricing", href: "/pricing/chatgpt" },
        { label: `${tool.name} Pricing` },
      ]}
      relatedPages={relatedPages}
      tocItems={[
        { id: "overview", title: "Pricing Overview", level: 2 },
        { id: "plans", title: "Plans & Features", level: 2 },
        { id: "comparison", title: "vs ShipSquad Pricing", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {tool.name} Pricing 2026: Complete Cost Breakdown
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        Everything you need to know about {tool.name} pricing in 2026 — plans, features, and how it compares.
      </p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Pricing Overview</h2>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-text-primary">{tool.pricingDetail}</span>
            <span className="text-sm text-text-muted">{tool.pricing}</span>
          </div>
          <p className="text-text-secondary mb-4">{tool.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Rating:</span>
            <span className="text-sm text-accent-blue font-medium">{tool.rating}/5</span>
          </div>
        </div>
      </section>

      <section id="plans" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Features Included</h2>
        <ul className="space-y-2">
          {tool.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-text-secondary">
              <span className="text-accent-blue mt-0.5">&#10003;</span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section id="comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {tool.name} vs ShipSquad: Pricing Comparison
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-4 py-3 text-sm text-text-secondary">Feature</th>
                <th className="px-4 py-3 text-sm text-text-secondary">{tool.name}</th>
                <th className="px-4 py-3 text-sm text-accent-blue">ShipSquad</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/[0.03]">
                <td className="px-4 py-3 text-sm text-text-primary">Price</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{tool.pricingDetail}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">$99/mo + BYOC</td>
              </tr>
              <tr className="border-b border-white/[0.03]">
                <td className="px-4 py-3 text-sm text-text-primary">AI Agents</td>
                <td className="px-4 py-3 text-sm text-text-secondary">Single tool</td>
                <td className="px-4 py-3 text-sm text-green-400">10 specialized agents</td>
              </tr>
              <tr className="border-b border-white/[0.03]">
                <td className="px-4 py-3 text-sm text-text-primary">Customization</td>
                <td className="px-4 py-3 text-sm text-text-secondary">Limited</td>
                <td className="px-4 py-3 text-sm text-green-400">Fully customizable</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-text-primary">Communication</td>
                <td className="px-4 py-3 text-sm text-text-secondary">Web/app</td>
                <td className="px-4 py-3 text-sm text-green-400">Telegram</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
