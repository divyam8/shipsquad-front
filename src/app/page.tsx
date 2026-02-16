import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { EarlyAccessCTA } from "@/components/sections/EarlyAccessCTA";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <EarlyAccessCTA />
      </main>
      <Footer />
    </>
  );
}
