import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities } from "@/data/cities";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { getLearnPillarLinks } from "@/lib/pillar-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};
  return {
    title: `AI Agents & Services in ${city.name}, ${city.country} (2026)`,
    description: `Deploy AI agents for businesses in ${city.name}. ShipSquad provides managed AI squads — 10 specialized agents for $99/mo. Serving ${city.name} and ${city.region}.`,
    alternates: { canonical: `/location/${slug}` },
  };
}

export const revalidate = 86400;

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const relatedCities = cities.filter((c) => c.slug !== slug && c.country === city.country).slice(0, 6).map((c) => ({ title: `AI Services in ${c.name}`, href: `/location/${c.slug}` }));
  const learnLinks = getLearnPillarLinks("agents");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `AI Agent Services in ${city.name}`,
    description: `Managed AI squad services for businesses in ${city.name}, ${city.country}.`,
    areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: city.country } },
    provider: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
  };

  const faq = [
    { question: `Does ShipSquad serve businesses in ${city.name}?`, answer: `Yes! ShipSquad is a remote-first AI squad service. We serve businesses in ${city.name} and everywhere else. Your AI squad works 24/7 regardless of timezone.` },
    { question: `How much do AI services cost in ${city.name}?`, answer: `ShipSquad is $99/mo + your Claude subscription — the same price regardless of location. Traditional AI development in ${city.name} can cost $50-200/hour.` },
    { question: `What industries in ${city.name} use AI agents?`, answer: `Businesses in ${city.name} across all industries — tech, marketing, e-commerce, finance, healthcare, legal, and more — are adopting AI agents for automation and growth.` },
  ];

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Locations", href: "/location/new-york" },
        { label: city.name },
      ]}
      relatedPages={relatedCities}
      furtherReading={learnLinks}
      tocItems={[
        { id: "overview", title: `AI in ${city.name}`, level: 2 },
        { id: "services", title: "Services", level: 2 },
        { id: "get-started", title: "Get Started", level: 2 },
        { id: "faq", title: "FAQ", level: 2 },
      ]}
      ctaHeadline={`Deploy your AI squad in ${city.name}`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        AI Agents & Services in {city.name}, {city.country}
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        Deploy managed AI squads for your {city.name}-based business. 10 specialized agents, $99/mo.
      </p>

      <section id="overview" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">AI Scene in {city.name}</h2>
        <p className="text-text-secondary mb-4">{city.description}</p>
        <p className="text-text-secondary mb-4">{city.techScene}</p>
        {city.longDescription && (
          <div className="text-text-secondary leading-relaxed space-y-4 mt-4">
            {city.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 mt-4 grid sm:grid-cols-3 gap-4">
          <div><span className="text-xs text-text-muted block">City</span><span className="text-sm text-text-primary font-medium">{city.name}</span></div>
          <div><span className="text-xs text-text-muted block">Region</span><span className="text-sm text-text-primary font-medium">{city.region}</span></div>
          <div><span className="text-xs text-text-muted block">Population</span><span className="text-sm text-text-primary font-medium">{city.population}</span></div>
        </div>
      </section>

      <section id="services" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">AI Services Available</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {["AI Squad for Marketing", "AI Squad for Engineering", "AI Squad for E-commerce", "AI Squad for Customer Support", "AI Squad for Operations", "Custom AI Agent Setup"].map((service, i) => (
            <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-sm text-text-secondary">{service}</div>
          ))}
        </div>
      </section>

      <section id="get-started" className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Get Started in {city.name}</h2>
        <p className="text-text-secondary">
          ShipSquad works remotely — your AI squad is deployed instantly regardless of your location. Sign up, describe your mission, and your squad starts working within 24 hours.
        </p>
      </section>

      <FAQSchema items={faq} />
    </SEOPageLayout>
  );
}
