"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Constellation } from "@/components/sections/Constellation";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SocialProof } from "@/components/sections/SocialProof";
import { Pricing } from "@/components/sections/Pricing";
import { EarlyAccessCTA } from "@/components/sections/EarlyAccessCTA";
import { Footer } from "@/components/layout/Footer";
import { GradientDivider } from "@/components/ui/GradientDivider";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState("Engineering");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <GradientDivider />
        <Constellation
          selectedDomain={selectedDomain}
          onDomainChange={setSelectedDomain}
        />
        <GradientDivider />
        <HowItWorks selectedDomain={selectedDomain} />
        <GradientDivider />
        <SocialProof />
        <GradientDivider />
        <Pricing />
        <GradientDivider />
        <EarlyAccessCTA />
      </main>
      <Footer />
    </>
  );
}
