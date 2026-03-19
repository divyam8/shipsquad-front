import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries } from "@/data/industries";
import { getIndustryStat } from "@/data/industry-stats";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  const year = new Date().getFullYear();
  const stat = getIndustryStat(industry.slug);
  const title = `AI Squad for ${industry.name}: ${stat?.statShort || "Deploy AI Agents"} (${year})`;
  const description = `${stat?.stat || industry.description} See the AI tools and workflows leading ${industry.name} teams use.`;
  return {
    title,
    description,
    alternates: { canonical: `/ai-squad-for/${slug}` },
    openGraph: { title, description },
  };
}

export const revalidate = 86400;

export default async function AISquadForPage({ params }: Props) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const relatedIndustries = industries
    .filter((i) => i.slug !== slug)
    .slice(0, 6)
    .map((i) => ({ title: i.title, href: `/ai-squad-for/${i.slug}`, category: "Industry" }));
  const learnLinks = getLearnPillarLinks("agents");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: industry.title,
    description: industry.description,
    serviceType: `AI Squad for ${industry.name}`,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "AI Squads", href: "/ai-squad-for/healthcare" },
        { label: industry.title },
      ]}
      relatedPages={relatedIndustries}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        { id: "sub-niches", title: `${industry.name} Sub-Niches`, level: 2 },
        { id: "agents", title: "Your AI Squad", level: 2 },
        { id: "benefits", title: "Benefits", level: 2 },
        { id: "get-started", title: "Get Started", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
      ctaHeadline={`Deploy your AI squad for ${industry.name.toLowerCase()} today`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{industry.title}</h1>
      <p className="text-lg text-text-secondary mb-8">{industry.description}</p>
      <LastUpdated />

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">AI Agents for {industry.name} in 2026</h2>
        <p className="text-text-secondary mb-4">
          The {industry.name.toLowerCase()} industry is being transformed by AI agents. From automating routine operations to delivering data-driven insights, AI squads are helping {industry.name.toLowerCase()} businesses operate faster, cheaper, and smarter.
        </p>
        <p className="text-text-secondary">
          ShipSquad deploys a specialized squad of AI agents configured specifically for {industry.name.toLowerCase()} — including compliance requirements, industry terminology, and domain-specific workflows.
        </p>
      </section>

      <section id="sub-niches" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">{industry.name} Sub-Niches We Serve</h2>
        <div className="flex flex-wrap gap-2">
          {industry.subNiches.map((niche, i) => (
            <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-white/[0.05] text-text-secondary border border-white/[0.05]">
              {niche}
            </span>
          ))}
        </div>
      </section>

      <section id="agents" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Your {industry.name} AI Squad</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {industry.agentRoles.map((role, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
              <span className="text-sm font-medium text-text-primary">{role}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Benefits of AI for {industry.name}</h2>
        <ul className="space-y-3">
          {industry.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-text-secondary">
              <span className="text-accent-blue font-bold">&#10003;</span>
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      <section id="get-started" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Get Started with AI for {industry.name}</h2>
        <p className="text-text-secondary mb-4">
          Deploy your {industry.name.toLowerCase()} AI squad in three steps:
        </p>
        <ol className="space-y-4">
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="font-medium text-text-primary">1. Describe your mission</span>
            <p className="text-sm text-text-secondary mt-1">Tell us what you want to automate or build in {industry.name.toLowerCase()}.</p>
          </li>
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="font-medium text-text-primary">2. We configure your squad</span>
            <p className="text-sm text-text-secondary mt-1">We deploy specialized AI agents trained on {industry.name.toLowerCase()} workflows and terminology.</p>
          </li>
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
            <span className="font-medium text-text-primary">3. Your squad starts working</span>
            <p className="text-sm text-text-secondary mt-1">Agents begin executing on your mission. You review, iterate, and scale.</p>
          </li>
        </ol>
      </section>

      <FAQSchema items={industry.faq} />
    </SEOPageLayout>
  );
}
