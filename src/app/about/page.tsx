import type { Metadata } from "next";
import { AuthorCard } from "@/components/seo/AuthorCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";

export const metadata: Metadata = {
  title: "About ShipSquad — The Team Behind Your AI Squad",
  description:
    "Meet the team building ShipSquad — managed AI squads that ship production software. Learn about our mission, our approach, and why we believe in AI-powered teams.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ShipSquad — The Team Behind Your AI Squad",
    description:
      "Meet the team building ShipSquad — managed AI squads that ship production software.",
    url: "https://shipsquad.ai/about",
  },
};

const founders = [
  {
    name: "ShipSquad Team",
    role: "Founders & Operators",
    bio: "We're solo founders and engineers who got tired of the gap between AI prototypes and production software. ShipSquad exists because we believe one expert + AI agents can outperform traditional teams at a fraction of the cost.",
    twitterUrl: "https://x.com/shipsquad_ai",
    linkedinUrl: "https://linkedin.com/company/shipsquad",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
          ]}
        />

        <h1 className="text-4xl font-bold mb-6">About ShipSquad</h1>

        <div className="prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
          <p className="text-lg">
            ShipSquad builds managed AI squads that ship production software.
            We combine one human expert (the Squad Lead) with 8 specialized AI
            agents to deliver working software in 1-2 weeks at a fraction of
            traditional costs.
          </p>

          <h2 className="text-2xl font-bold text-text-primary mt-10">
            Our Mission
          </h2>
          <p>
            The software industry is broken. Hiring developers takes months.
            Agencies charge $50K+ for simple projects. Freelancers are
            unreliable. And AI chatbots can&apos;t ship production code alone.
          </p>
          <p>
            ShipSquad fixes this by deploying managed AI squads &mdash; teams of
            specialized AI agents coordinated by a domain expert &mdash; that
            deliver production-ready software for $99/month.
          </p>

          <h2 className="text-2xl font-bold text-text-primary mt-10">
            How It Works
          </h2>
          <p>
            Every mission gets a full squad of 8 AI agents: a Decomposer to
            break down tasks, an Architect for system design, Frontend and
            Backend builders, a QA agent for testing, DevOps for deployment, a
            Reviewer for code quality, and Comms to keep you updated.
          </p>
          <p>
            The Squad Lead &mdash; a real human expert in your domain &mdash;
            makes the hard decisions, resolves ambiguity, and ensures everything
            meets production standards. You own 100% of the IP.
          </p>

          <h2 className="text-2xl font-bold text-text-primary mt-10">
            Why AI Squads?
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong className="text-text-primary">10x faster</strong> than
              traditional teams
            </li>
            <li>
              <strong className="text-text-primary">90% cheaper</strong> than
              agencies
            </li>
            <li>
              <strong className="text-text-primary">Always available</strong>{" "}
              &mdash; AI agents work 24/7
            </li>
            <li>
              <strong className="text-text-primary">Expert-led</strong> &mdash;
              real humans make the hard calls
            </li>
            <li>
              <strong className="text-text-primary">Full ownership</strong>{" "}
              &mdash; you own every line of code
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-text-primary mt-10">
            The Team
          </h2>
        </div>

        {founders.map((founder) => (
          <AuthorCard key={founder.name} {...founder} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
