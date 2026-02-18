import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { workflows } from "@/data/workflows";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return workflows.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = workflows.find((w) => w.slug === slug);
  if (!workflow) return {};
  return {
    title: `${workflow.title}: Step-by-Step Guide (2026)`,
    description: workflow.description,
    alternates: { canonical: `/ai-workflow/${slug}` },
  };
}

export const revalidate = 86400;

export default async function AIWorkflowPage({ params }: Props) {
  const { slug } = await params;
  const workflow = workflows.find((w) => w.slug === slug);
  if (!workflow) notFound();

  const relatedWorkflows = workflows.filter((w) => w.slug !== slug && w.category === workflow.category).slice(0, 6).map((w) => ({ title: w.title, href: `/ai-workflow/${w.slug}`, category: w.category }));

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "AI Workflows", href: "/ai-workflow/content-marketing" },
        { label: workflow.title },
      ]}
      relatedPages={relatedWorkflows}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        { id: "steps", title: "Workflow Steps", level: 2 },
        { id: "tools", title: "Recommended Tools", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{workflow.title}</h1>
      <p className="text-lg text-text-secondary mb-8">{workflow.description}</p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">How This AI Workflow Works</h2>
        <p className="text-text-secondary">
          This workflow automates {workflow.name.toLowerCase()} using AI agents. Each step is handled by a specialized agent, allowing the entire process to run with minimal human intervention. Category: {workflow.category}.
        </p>
      </section>

      <section id="steps" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Step-by-Step Workflow</h2>
        <div className="space-y-4">
          {workflow.steps.map((step, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-blue/10 text-accent-blue flex items-center justify-center font-bold text-sm">{i + 1}</span>
              <span className="text-text-secondary text-sm">{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Recommended Tools</h2>
        <div className="flex flex-wrap gap-2">
          {workflow.tools.map((tool, i) => (
            <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-white/[0.05] text-text-secondary border border-white/[0.05]">{tool}</span>
          ))}
        </div>
      </section>

      <FAQSchema items={workflow.faq} />
    </SEOPageLayout>
  );
}
