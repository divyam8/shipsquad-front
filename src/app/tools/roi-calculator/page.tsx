import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ROICalculatorClient } from "./roi-client";

export const metadata: Metadata = {
  title: "AI ROI Calculator — Is AI Worth It for Your Business? (Free Tool)",
  description: "Calculate the ROI of AI automation for your business. Input your current manual hours, costs, and error rates — see projected savings. Free, no signup required.",
  alternates: { canonical: "/tools/roi-calculator" },
  openGraph: {
    title: "AI ROI Calculator — Is AI Worth It for Your Business?",
    description: "Free calculator: See exactly how much AI automation would save your business.",
  },
};

const faq = [
  { question: "How is AI ROI calculated?", answer: "We calculate ROI based on time savings (hours freed up × hourly cost), error reduction (fewer mistakes = less rework), and productivity gains (AI amplifies output). The formula accounts for the cost of AI tools." },
  { question: "What's a good AI ROI?", answer: "Most businesses see 200-500% ROI on AI investments within the first year. ShipSquad customers typically see positive ROI within the first month due to the low $99/mo price point." },
  { question: "How quickly does AI pay for itself?", answer: "With ShipSquad at $99/mo, the breakeven point is often reached by saving just 2-3 hours of work per month. Most users save 10-20+ hours in the first month." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI ROI Calculator",
  applicationCategory: "BusinessApplication",
  description: "Calculate the return on investment of AI automation for your business.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "AI ROI Calculator" }]} />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">AI ROI Calculator</h1>
        <p className="text-lg text-text-secondary mb-10">
          Is AI worth it for your business? Enter your numbers and see the projected return on investment.
        </p>

        <ROICalculatorClient />

        <FAQSchema items={faq} />
      </main>
      <Footer />
    </div>
  );
}
