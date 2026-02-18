import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AICostCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "AI Cost Calculator — How Much Does an AI Team Cost? (Free Tool)",
  description: "Calculate how much an AI squad would save your business. Compare costs: traditional team vs freelancers vs agency vs AI squad. Free calculator, no signup required.",
  alternates: { canonical: "/tools/ai-cost-calculator" },
  openGraph: {
    title: "AI Cost Calculator — How Much Does an AI Team Cost?",
    description: "Free calculator: Compare traditional team vs freelancers vs agency vs AI squad costs.",
    url: "https://shipsquad.ai/tools/ai-cost-calculator",
  },
};

const faq = [
  { question: "How accurate is this AI cost calculator?", answer: "The calculator uses industry-average rates and typical project timelines. Your actual costs may vary based on location, complexity, and specific requirements. It provides directional guidance for budgeting." },
  { question: "What's included in the AI squad cost?", answer: "ShipSquad's AI squad costs $99/mo + your Claude subscription (BYOC model). This includes 10 specialized AI agents, Telegram-based communication, and custom agent creation." },
  { question: "How do AI squads reduce costs?", answer: "AI agents work 24/7, don't need benefits or office space, and can handle multiple tasks simultaneously. One human expert + 10 AI agents produces the output of a much larger traditional team." },
  { question: "Can I share my results?", answer: "Yes! After calculating, you can copy your results URL to share with teammates or stakeholders." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Cost Calculator",
  applicationCategory: "BusinessApplication",
  description: "Calculate how much an AI squad would save your business compared to traditional teams, freelancers, and agencies.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", name: "ShipSquad", url: "https://shipsquad.ai" },
};

export default function AICostCalculatorPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "AI Cost Calculator" }]} />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">AI Cost Calculator</h1>
        <p className="text-lg text-text-secondary mb-10">
          How much would an AI squad save your business? Compare costs across hiring models.
        </p>

        <AICostCalculatorClient />

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-4">How This Calculator Works</h2>
          <p className="text-text-secondary mb-4">
            Enter your current team size, average hourly rates, project type, and timeline. The calculator compares four approaches:
          </p>
          <ul className="space-y-2 text-text-secondary ml-2">
            <li className="flex items-start gap-2"><span className="text-accent-blue">1.</span> <strong className="text-text-primary">Traditional Team</strong> — Full-time employees with salaries, benefits, and overhead</li>
            <li className="flex items-start gap-2"><span className="text-accent-blue">2.</span> <strong className="text-text-primary">Freelancers</strong> — Contract developers on platforms like Upwork and Toptal</li>
            <li className="flex items-start gap-2"><span className="text-accent-blue">3.</span> <strong className="text-text-primary">Agency</strong> — Traditional development agency with project-based pricing</li>
            <li className="flex items-start gap-2"><span className="text-accent-blue">4.</span> <strong className="text-text-primary">ShipSquad AI Squad</strong> — 10 AI agents + human expert for $99/mo</li>
          </ul>
        </section>

        <FAQSchema items={faq} />
      </main>
      <Footer />
    </div>
  );
}
