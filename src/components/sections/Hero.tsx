"use client";

import { motion } from "motion/react";
import { GradientText } from "@/components/ui/GradientText";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { HERO } from "@/lib/constants";

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section
      id="waitlist"
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8"
    >
      {/* Radial glow background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(59,130,246,0.10)_0%,transparent_60%)]" />

      {/* Animated background orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-accent-blue/[0.08] blur-[120px]"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent-purple/[0.06] blur-[120px]"
        animate={{ x: [0, -25, 15, 0], y: [0, 15, -25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div custom={0} initial="hidden" animate="visible" variants={stagger}>
          <GradientText
            as="h1"
            className="text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-bold leading-tight tracking-[-0.02em]"
          >
            {HERO.headline}
          </GradientText>
        </motion.div>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
        >
          {HERO.subhead}
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-10 w-full max-w-md"
        >
          <WaitlistForm />
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-8 flex flex-col items-center gap-3 text-sm sm:flex-row sm:gap-4"
        >
          <span className="flex items-center gap-2 text-text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {HERO.socialProof}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-text-muted/50 sm:block" />
          <span className="font-medium text-accent-purple">
            {HERO.urgency}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
