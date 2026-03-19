import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ToolFinderClient } from "./finder-client";

export const metadata: Metadata = {
  title:
    "AI Tool Finder: Get Personalized Recommendations in 60 Seconds",
  description:
    "Answer 5 questions and get a personalized AI tool stack recommendation. Compare features, pricing, and find the perfect tools for your team.",
  alternates: { canonical: "/tools/ai-tool-finder" },
  openGraph: {
    title: "AI Tool Finder: Get Personalized Recommendations in 60 Seconds",
    description:
      "Answer 5 questions and get a personalized AI tool stack recommendation. Compare features, pricing, and find the perfect tools for your team.",
    url: "https://shipsquad.ai/tools/ai-tool-finder",
  },
};

const faq = [
  {
    question: "How does the AI Tool Finder work?",
    answer:
      "The AI Tool Finder asks you 5 quick questions about your use case, team size, budget, priorities, and technical level. It then scores over 100 AI tools in our database and recommends the top 5 that best match your needs.",
  },
  {
    question: "How many tools does the finder analyze?",
    answer:
      "Our database includes 150+ AI tools across categories like AI chatbots, coding assistants, writing tools, image generators, video tools, analytics platforms, and developer tools. Every recommendation is drawn from real, verified tools.",
  },
  {
    question: "Is the AI Tool Finder free?",
    answer:
      "Yes, the AI Tool Finder is completely free with no signup required. You can retake the quiz as many times as you want to explore recommendations for different use cases.",
  },
  {
    question: "Can I compare the recommended tools?",
    answer:
      "Each recommendation includes links to our in-depth review, detailed pricing breakdown, and alternatives pages so you can do a thorough comparison before choosing.",
  },
  {
    question: "What if I need tools for multiple use cases?",
    answer:
      "Simply retake the quiz with a different primary use case selected. The recommendations adapt to each scenario, so you can build a complete AI tool stack across all your needs.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Tool Finder",
  applicationCategory: "BusinessApplication",
  description:
    "Answer 5 questions and get a personalized AI tool stack recommendation. Compare features, pricing, and find the perfect tools for your team.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: {
    "@type": "Organization",
    name: "ShipSquad",
    url: "https://shipsquad.ai",
  },
};

export default function AIToolFinderPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Tools" },
            { label: "AI Tool Finder" },
          ]}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          AI Tool Finder
        </h1>
        <p className="text-lg text-text-secondary mb-10">
          Answer 5 quick questions and get personalized AI tool
          recommendations in under 60 seconds. No signup required.
        </p>

        <ToolFinderClient />

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            How the AI Tool Finder Works
          </h2>
          <p className="text-text-secondary mb-4">
            Finding the right AI tools can be overwhelming with hundreds of
            options across dozens of categories. Our recommendation engine
            narrows the field in three steps:
          </p>
          <ul className="space-y-2 text-text-secondary ml-2">
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">1.</span>{" "}
              <strong className="text-text-primary">Category Matching</strong>{" "}
              &mdash; We filter our database to the tool categories most
              relevant to your primary use case.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">2.</span>{" "}
              <strong className="text-text-primary">Budget & Fit Scoring</strong>{" "}
              &mdash; Tools are scored on pricing fit, team-size alignment,
              integration depth, and user ratings.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">3.</span>{" "}
              <strong className="text-text-primary">
                Personalized Ranking
              </strong>{" "}
              &mdash; Your priority (ease of use, features, value, or
              integrations) and technical level determine the final ranking.
            </li>
          </ul>
        </section>

        <FAQSchema items={faq} />
      </main>
      <Footer />
    </div>
  );
}
