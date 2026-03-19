import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roles } from "@/data/roles";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);
  if (!role) return {};
  const year = new Date().getFullYear();
  const toolCount = role.tools?.length || "Top";
  return {
    title: `AI Tools for ${role.name}: ${toolCount} Tools Ranked (${year})`,
    description: `The best AI tools for ${role.name} in ${year}, ranked by real-world fit. ${role.description.slice(0, 100)}`,
    alternates: { canonical: `/ai-tools-for/${slug}` },
  };
}

export const revalidate = 86400;

export default async function AIToolsForPage({ params }: Props) {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);
  if (!role) notFound();

  const relatedRoles = roles.filter((r) => r.slug !== slug).slice(0, 6).map((r) => ({ title: r.title, href: `/ai-tools-for/${r.slug}` }));
  const learnLinks = getLearnPillarLinks("development");

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "AI Tools by Role", href: "/ai-tools-for/software-developer" },
        { label: role.title },
      ]}
      relatedPages={relatedRoles}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        { id: "tools", title: "Recommended Tools", level: 2 },
        { id: "tasks", title: "What AI Can Automate", level: 2 },
        { id: "shipsquad", title: "ShipSquad Approach", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{role.title}</h1>
      <p className="text-lg text-text-secondary mb-8">{role.description}</p>
      <LastUpdated />

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">AI Tools Every {role.name} Needs in 2026</h2>
        <p className="text-text-secondary mb-4">
          The {role.name.toLowerCase()} role is being augmented (not replaced) by AI. The right AI tools can save you 10-20 hours per week, improve output quality, and let you focus on high-value strategic work.
        </p>
        {role.longDescription && (
          <div className="text-text-secondary leading-relaxed space-y-4 mt-4">
            {role.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </section>

      <section id="tools" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Top AI Tools for {role.name}s</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {role.tools.map((tool, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 flex items-center gap-3">
              <span className="text-accent-blue font-bold text-lg">{i + 1}</span>
              <span className="text-sm text-text-primary font-medium">{tool}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="tasks" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Tasks AI Can Automate for {role.name}s</h2>
        <ul className="space-y-2">
          {role.tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2 text-text-secondary">
              <span className="text-accent-blue mt-0.5">&#10003;</span> {task}
            </li>
          ))}
        </ul>
      </section>

      <section id="shipsquad" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">ShipSquad: Your Complete AI Squad</h2>
        <p className="text-text-secondary mb-4">
          Instead of juggling multiple tools, ShipSquad gives {role.name.toLowerCase()}s a complete AI squad of 10 specialized agents — all working together for $99/mo. Manage your squad from Telegram and focus on what you do best.
        </p>
      </section>

      <FAQSchema items={role.faq} />
    </SEOPageLayout>
  );
}
