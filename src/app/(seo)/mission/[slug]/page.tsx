import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { missions } from "@/data/missions";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return missions.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mission = missions.find((m) => m.slug === slug);
  if (!mission) return {};
  return {
    title: `${mission.title} — Deploy AI Agents (2026 Guide)`,
    description: mission.description,
    alternates: { canonical: `/mission/${slug}` },
  };
}

export const revalidate = 86400;

export default async function MissionPage({ params }: Props) {
  const { slug } = await params;
  const mission = missions.find((m) => m.slug === slug);
  if (!mission) notFound();

  const relatedMissions = missions.filter((m) => m.slug !== slug && m.category === mission.category).slice(0, 6).map((m) => ({ title: m.title, href: `/mission/${m.slug}`, category: m.category }));
  const learnLinks = getLearnPillarLinks(mission.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: mission.title,
    description: mission.description,
    serviceType: mission.category,
    provider: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
    offers: { "@type": "Offer", price: "99", priceCurrency: "USD" },
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Missions", href: "/mission/building-mvp" },
        { label: mission.title },
      ]}
      relatedPages={relatedMissions}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        { id: "deliverables", title: "Deliverables", level: 2 },
        { id: "squad", title: "Your AI Squad", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
      ctaHeadline={`Start your ${mission.name.toLowerCase()} mission today`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{mission.title}</h1>
      <div className="flex gap-3 mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{mission.category}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{mission.timeline}</span>
      </div>
      <p className="text-lg text-text-secondary mb-8">{mission.description}</p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Mission Overview</h2>
        <p className="text-text-secondary mb-4">
          This mission deploys a specialized AI squad to handle {mission.name.toLowerCase()}. Your squad of {mission.agentRoles.length} specialized agents works in parallel, delivering results in {mission.timeline}.
        </p>
        {mission.longDescription && (
          <div className="text-text-secondary leading-relaxed space-y-4 mt-4">
            {mission.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </section>

      <section id="deliverables" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">What You Get</h2>
        <ul className="space-y-2">
          {mission.deliverables.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-text-secondary">
              <span className="text-accent-blue mt-0.5">&#10003;</span> {d}
            </li>
          ))}
        </ul>
      </section>

      <section id="squad" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Your AI Squad</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {mission.agentRoles.map((role, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-sm text-text-primary font-medium">{role}</div>
          ))}
        </div>
      </section>

      <FAQSchema items={mission.faq} />
    </SEOPageLayout>
  );
}
