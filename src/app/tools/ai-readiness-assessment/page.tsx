import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AIReadinessQuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "AI Readiness Assessment: Is Your Team Ready for AI? (Free Quiz)",
  description:
    "Take this 2-minute assessment to discover your AI readiness score. Get personalized recommendations for your industry and team size.",
  alternates: { canonical: "/tools/ai-readiness-assessment" },
  openGraph: {
    title: "AI Readiness Assessment: Is Your Team Ready for AI?",
    description:
      "Free 2-minute quiz: Discover your AI readiness score and get personalized recommendations.",
    url: "https://shipsquad.ai/tools/ai-readiness-assessment",
  },
};

const faq = [
  {
    question: "How long does the AI Readiness Assessment take?",
    answer:
      "The assessment takes about 2 minutes. It consists of 8 multiple-choice questions about your industry, team, current AI usage, and goals.",
  },
  {
    question: "What does the AI Readiness Score measure?",
    answer:
      "The score (0\u2013100) evaluates your organization\u2019s preparedness for AI adoption based on factors like current tool usage, team technical proficiency, budget allocation, repetitive task volume, and operational bottlenecks.",
  },
  {
    question: "Is this assessment free?",
    answer:
      "Yes, the AI Readiness Assessment is completely free. No signup, no email required. Your answers are processed entirely in your browser \u2014 we don\u2019t store any data.",
  },
  {
    question: "How accurate is the AI Readiness Score?",
    answer:
      "The score provides directional guidance based on common AI adoption factors. It\u2019s designed to highlight strengths and gaps in your AI readiness, not to be a definitive audit. Use it as a starting point for your AI strategy.",
  },
  {
    question: "Can I share my results with my team?",
    answer:
      "Yes! After completing the assessment, you can share your score and category via the \u201CShare Your Score\u201D button, which copies a shareable message to your clipboard or triggers your device\u2019s native share dialog.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Readiness Assessment",
  applicationCategory: "BusinessApplication",
  description:
    "A free 2-minute quiz that assesses how ready your business or team is for AI adoption, providing a personalized readiness score and recommendations.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: {
    "@type": "Organization",
    name: "ShipSquad",
    url: "https://shipsquad.ai",
  },
  featureList: [
    "AI readiness scoring (0-100)",
    "Personalized industry insights",
    "Tool recommendations based on your needs",
    "Actionable next steps for AI adoption",
  ],
};

export default function AIReadinessAssessmentPage() {
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
            { label: "AI Readiness Assessment" },
          ]}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          AI Readiness Assessment
        </h1>
        <p className="text-lg text-text-secondary mb-10">
          Is your team ready for AI? Answer 8 quick questions to get your
          personalized readiness score, industry insights, and recommended next
          steps.
        </p>

        <AIReadinessQuizClient />

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            How the AI Readiness Score Works
          </h2>
          <p className="text-text-secondary mb-4">
            Your score is calculated from a weighted analysis of eight factors
            that determine how prepared your organization is for AI adoption:
          </p>
          <ul className="space-y-2 text-text-secondary ml-2">
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">1.</span>{" "}
              <strong className="text-text-primary">Industry AI maturity</strong>{" "}
              &mdash; Some industries have more established AI use cases and
              tooling
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">2.</span>{" "}
              <strong className="text-text-primary">Team size</strong> &mdash;
              Smaller teams often adopt AI faster, but larger teams benefit more
              at scale
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">3.</span>{" "}
              <strong className="text-text-primary">Automation potential</strong>{" "}
              &mdash; More repetitive work means higher ROI from AI tools
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">4.</span>{" "}
              <strong className="text-text-primary">Current AI usage</strong>{" "}
              &mdash; Existing experience with AI tools reduces adoption friction
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">5.</span>{" "}
              <strong className="text-text-primary">Bottleneck type</strong>{" "}
              &mdash; Some bottlenecks are easier to solve with AI than others
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">6.</span>{" "}
              <strong className="text-text-primary">
                Technical proficiency
              </strong>{" "}
              &mdash; Tech-savvy teams can leverage more advanced AI capabilities
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">7.</span>{" "}
              <strong className="text-text-primary">Budget readiness</strong>{" "}
              &mdash; Higher budgets unlock premium tools, but great free options
              exist
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">8.</span>{" "}
              <strong className="text-text-primary">Adoption mindset</strong>{" "}
              &mdash; Your concerns shape the best approach to AI integration
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Score Categories
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
              <p className="font-bold text-green-400 mb-1">
                AI Pioneer (80&ndash;100)
              </p>
              <p className="text-sm text-text-secondary">
                AI is central to your operations. Focus on governance,
                cutting-edge tools, and mentoring others.
              </p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
              <p className="font-bold text-blue-400 mb-1">
                AI Ready (60&ndash;79)
              </p>
              <p className="text-sm text-text-secondary">
                You have strong foundations. Scale AI across departments and
                optimize your existing tools.
              </p>
            </div>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
              <p className="font-bold text-yellow-400 mb-1">
                AI Curious (40&ndash;59)
              </p>
              <p className="text-sm text-text-secondary">
                You are exploring AI but need structured workflows and clear
                goals to accelerate adoption.
              </p>
            </div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
              <p className="font-bold text-orange-400 mb-1">
                AI Beginner (0&ndash;39)
              </p>
              <p className="text-sm text-text-secondary">
                You are early in the journey. Start with one use case and build
                confidence from there.
              </p>
            </div>
          </div>
        </section>

        <FAQSchema items={faq} />
      </main>
      <Footer />
    </div>
  );
}
