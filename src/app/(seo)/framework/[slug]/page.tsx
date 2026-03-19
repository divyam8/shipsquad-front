import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { frameworks } from "@/data/frameworks";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LastUpdated } from "@/components/seo/LastUpdated";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return frameworks.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const framework = frameworks.find((f) => f.slug === slug);
  if (!framework) return {};
  const year = new Date().getFullYear();
  return {
    title: `${framework.name} + AI: Ship Faster in ${year} (Guide & Review)`,
    description: `${framework.description.slice(0, 100)} See how teams combine ${framework.name} with AI tools for faster development.`,
    alternates: { canonical: `/framework/${slug}` },
  };
}

export const revalidate = 86400;

export default async function FrameworkPage({ params }: Props) {
  const { slug } = await params;
  const framework = frameworks.find((f) => f.slug === slug);
  if (!framework) notFound();

  const relatedFrameworks = frameworks.filter((f) => f.slug !== slug && f.category === framework.category).slice(0, 6).map((f) => ({ title: `${f.name} Guide`, href: `/framework/${f.slug}`, category: f.category }));
  const learnLinks = getLearnPillarLinks(framework.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: framework.name,
    applicationCategory: framework.category,
    programmingLanguage: framework.language,
    description: framework.description,
  };

  const faq = [
    { question: `What is ${framework.name}?`, answer: framework.description },
    { question: `What language is ${framework.name} built in?`, answer: `${framework.name} is primarily built in ${framework.language}.` },
    { question: `Is ${framework.name} good for production?`, answer: `${framework.name} has ${framework.stars} GitHub stars. ${framework.pros[0] || "It's a solid choice"} for ${framework.useCases[0]?.toLowerCase() || "AI applications"}.` },
  ];

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Frameworks", href: "/framework/crewai" },
        { label: framework.name },
      ]}
      relatedPages={relatedFrameworks}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        { id: "features", title: "Features", level: 2 },
        { id: "use-cases", title: "Use Cases", level: 2 },
        { id: "pros-cons", title: "Pros & Cons", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{framework.name}: Complete Guide 2026</h1>
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{framework.language}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{framework.category}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{framework.stars} stars</span>
      </div>
      <LastUpdated />

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Overview</h2>
        <p className="text-text-secondary">{framework.description}</p>
      </section>

      <section id="features" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Key Features</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {framework.features.map((f, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 flex items-start gap-2">
              <span className="text-accent-blue mt-0.5">&#10003;</span>
              <span className="text-sm text-text-secondary">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="use-cases" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Use Cases</h2>
        <ul className="space-y-2">
          {framework.useCases.map((uc, i) => (
            <li key={i} className="flex items-start gap-2 text-text-secondary"><span className="text-accent-purple mt-0.5">&rarr;</span> {uc}</li>
          ))}
        </ul>
      </section>

      <section id="pros-cons" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Pros & Cons</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-3">Pros</h3>
            <ul className="space-y-2">{framework.pros.map((p, i) => (<li key={i} className="text-sm text-text-secondary flex items-start gap-1.5"><span className="text-green-400">+</span>{p}</li>))}</ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-3">Cons</h3>
            <ul className="space-y-2">{framework.cons.map((c, i) => (<li key={i} className="text-sm text-text-secondary flex items-start gap-1.5"><span className="text-red-400">-</span>{c}</li>))}</ul>
          </div>
        </div>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
