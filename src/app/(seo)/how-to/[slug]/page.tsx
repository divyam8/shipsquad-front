import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: `${guide.title} (${guide.difficulty} Guide)`,
    description: guide.description,
    alternates: { canonical: `/how-to/${slug}` },
  };
}

export const revalidate = 86400;

export default async function HowToPage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const relatedGuides = guides.filter((g) => g.slug !== slug && g.category === guide.category).slice(0, 6).map((g) => ({ title: g.title, href: `/how-to/${g.slug}`, category: g.category }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    totalTime: guide.timeToRead,
    step: guide.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "How-To Guides", href: "/how-to/build-ai-agent" },
        { label: guide.title },
      ]}
      relatedPages={relatedGuides}
      tocItems={[
        { id: "overview", title: "Overview", level: 2 },
        ...guide.steps.map((s, i) => ({ id: `step-${i + 1}`, title: `Step ${i + 1}: ${s.title}`, level: 2 })),
        { id: "faq", title: "FAQ", level: 2 },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{guide.title}</h1>
      <div className="flex gap-3 mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{guide.difficulty}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{guide.timeToRead}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{guide.category}</span>
      </div>
      <p className="text-lg text-text-secondary mb-8">{guide.description}</p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">What You&apos;ll Learn</h2>
        <p className="text-text-secondary">
          This {guide.difficulty}-level guide walks you through {guide.title.toLowerCase()} step by step. Estimated time: {guide.timeToRead}.
        </p>
      </section>

      {guide.steps.map((step, i) => (
        <section key={i} id={`step-${i + 1}`} className="mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-3">
            Step {i + 1}: {step.title}
          </h2>
          <p className="text-text-secondary">{step.description}</p>
        </section>
      ))}

      <FAQSchema items={guide.faq} />
    </SEOPageLayout>
  );
}
