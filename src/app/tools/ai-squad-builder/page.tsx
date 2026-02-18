import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { SquadBuilderClient } from "./builder-client";

export const metadata: Metadata = {
  title: "AI Squad Builder — Build Your Perfect AI Team (Free Quiz)",
  description: "Build your perfect AI squad in 60 seconds. Tell us your goal, industry, and tasks — we'll recommend the ideal agent composition. Free, no signup required.",
  alternates: { canonical: "/tools/ai-squad-builder" },
  openGraph: {
    title: "AI Squad Builder — Build Your Perfect AI Team",
    description: "Free quiz: Build your perfect AI squad in 60 seconds.",
  },
};

const faq = [
  { question: "How does the AI Squad Builder work?", answer: "Answer a few questions about your goal, industry, and tasks. Our algorithm recommends the ideal squad composition from ShipSquad's roster of specialist agents." },
  { question: "Can I customize my squad after building it?", answer: "Absolutely! The builder gives you a starting point. With ShipSquad, you can create custom agents tailored to your exact needs." },
  { question: "What agents are available?", answer: "ShipSquad includes 10 pre-built specialists: Jarvis (research), Loki (strategy), Fury (execution), Vision (analytics), Wanda (creative), Friday (automation), Pepper (communication), Quill (content), Shuri (engineering), and Wong (knowledge). Plus custom agents." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Squad Builder",
  applicationCategory: "BusinessApplication",
  description: "Build your perfect AI agent squad. Interactive quiz that recommends the ideal agent composition for your specific needs.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function AISquadBuilderPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "AI Squad Builder" }]} />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">AI Squad Builder</h1>
        <p className="text-lg text-text-secondary mb-10">
          Build your perfect AI squad in 60 seconds. Tell us your mission — we&apos;ll assemble the right team.
        </p>

        <SquadBuilderClient />

        <FAQSchema items={faq} />
      </main>
      <Footer />
    </div>
  );
}
