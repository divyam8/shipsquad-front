"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/icons/Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.05] bg-bg-primary/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <button
          onClick={scrollToWaitlist}
          className="cursor-pointer rounded-full border border-white/[0.08] bg-white/[0.08] px-5 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-white/[0.12] hover:border-white/[0.15]"
        >
          Get Early Access
        </button>
      </div>
    </header>
  );
}
