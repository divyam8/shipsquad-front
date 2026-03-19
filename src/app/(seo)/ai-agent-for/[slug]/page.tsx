import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useCases } from "@/data/use-cases";
import { getIndustryStat } from "@/data/industry-stats";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const useCase = useCases.find((u) => u.slug === slug);
  if (!useCase) return {};
  const year = new Date().getFullYear();
  const stat = getIndustryStat(useCase.category || useCase.slug);
  const description = stat
    ? `${stat.statShort} — and AI agents make it possible. ${useCase.description}`
    : useCase.description;
  return {
    title: `AI Agent for ${useCase.name}: Automate & Save Hours (${year})`,
    description,
    alternates: { canonical: `/ai-agent-for/${slug}` },
    openGraph: {
      title: `AI Agent for ${useCase.name}: Automate & Save Hours (${year})`,
      description,
    },
  };
}

export const revalidate = 86400;

export default async function AIAgentForPage({ params }: Props) {
  const { slug } = await params;
  const useCase = useCases.find((u) => u.slug === slug);
  if (!useCase) notFound();

  const relatedUseCases = useCases
    .filter((u) => u.slug !== slug && u.category === useCase.category)
    .slice(0, 6)
    .map((u) => ({ title: `AI Agent for ${u.name}`, href: `/ai-agent-for/${u.slug}`, category: u.category }));
  const learnLinks = getLearnPillarLinks(useCase.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `AI Agent for ${useCase.name}`,
    description: useCase.description,
    serviceType: `AI ${useCase.name} Automation`,
    provider: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
    offers: { "@type": "Offer", price: "99", priceCurrency: "USD", description: "$99/mo + your Claude subscription" },
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "AI Agents", href: "/ai-agent-for/lead-generation" },
        { label: `AI Agent for ${useCase.name}` },
      ]}
      relatedPages={relatedUseCases}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        { id: "benefits", title: "Key Benefits", level: 2 },
        { id: "agents", title: "Agent Roles", level: 2 },
        { id: "how-it-works", title: "How It Works", level: 2 },
        { id: "shipsquad", title: "ShipSquad for " + useCase.name, level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
      ctaHeadline={`Ready to automate ${useCase.name.toLowerCase()} with AI?`}
      ctaDescription={`Deploy a squad of AI agents for ${useCase.name.toLowerCase()} — $99/mo + your Claude subscription.`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        {useCase.title}
      </h1>
      <p className="text-lg text-text-secondary mb-8">{useCase.description}</p>
      <LastUpdated />

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Why Use AI Agents for {useCase.name}?
        </h2>
        <p className="text-text-secondary mb-4">
          AI agents are transforming {useCase.name.toLowerCase()} by automating repetitive tasks, working 24/7, and delivering consistent results at a fraction of the cost of human teams. In 2026, the AI agent market has exploded with a 1,445% surge in search interest — and {useCase.name.toLowerCase()} is one of the hottest use cases.
        </p>
        <p className="text-text-secondary">
          Whether you&apos;re a solo founder, SMB, or enterprise team, deploying AI agents for {useCase.name.toLowerCase()} lets you scale output without scaling headcount. Here&apos;s how it works.
        </p>
      </section>

      <section id="benefits" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Key Benefits</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {useCase.benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
              <span className="text-accent-blue mt-0.5 font-bold">{i + 1}</span>
              <span className="text-text-secondary text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="agents" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          AI Agent Roles for {useCase.name}
        </h2>
        <p className="text-text-secondary mb-4">
          A complete AI squad for {useCase.name.toLowerCase()} typically includes these specialized agents:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {useCase.agentRoles.map((role, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
              <span className="text-sm text-text-primary font-medium">{role}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">How AI {useCase.name} Works</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <h3 className="font-medium text-text-primary mb-1">Step 1: Define Your Mission</h3>
            <p className="text-sm text-text-secondary">Tell your AI squad what you want to achieve with {useCase.name.toLowerCase()}. Be specific about goals, constraints, and success metrics.</p>
          </div>
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <h3 className="font-medium text-text-primary mb-1">Step 2: Squad Deploys</h3>
            <p className="text-sm text-text-secondary">Specialized AI agents are assigned to their roles. Each agent handles a specific aspect of {useCase.name.toLowerCase()}, working in parallel.</p>
          </div>
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <h3 className="font-medium text-text-primary mb-1">Step 3: Review & Iterate</h3>
            <p className="text-sm text-text-secondary">Review outputs, provide feedback, and iterate. Your AI squad improves with each cycle, learning your preferences and standards.</p>
          </div>
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <h3 className="font-medium text-text-primary mb-1">Step 4: Scale</h3>
            <p className="text-sm text-text-secondary">Once your AI {useCase.name.toLowerCase()} workflow is dialed in, scale output without additional cost or headcount.</p>
          </div>
        </div>
      </section>

      <section id="shipsquad" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          ShipSquad: Your AI Squad for {useCase.name}
        </h2>
        <p className="text-text-secondary mb-4">
          ShipSquad gives you a full AI squad of 10 specialized agents — including agents purpose-built for {useCase.name.toLowerCase()}. For $99/mo + your Claude subscription, you get:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-2">
          <li>Pre-built specialist agents: Jarvis, Loki, Fury, Vision, Wanda, Friday, Pepper, Quill, Shuri, Wong</li>
          <li>Custom agents tailored to your {useCase.name.toLowerCase()} workflow</li>
          <li>Telegram-based communication — manage your squad from your phone</li>
          <li>BYOC model — bring your own Claude subscription for unlimited usage</li>
        </ul>
      </section>

      <FAQSchema items={useCase.faq} />
    </SEOPageLayout>
  );
}
