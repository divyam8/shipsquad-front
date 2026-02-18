"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { GridPattern } from "@/components/ui/GridPattern";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { WordCycler } from "@/components/ui/WordCycler";
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
  const [headlineReady, setHeadlineReady] = useState(false);

  return (
    <section
      id="waitlist"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8"
    >
      <AuroraBackground />
      <GridPattern className="opacity-40" />

      {/* Radial concentric rings behind headline */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[300, 500, 700].map((size, i) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
            style={{ width: size, height: size, opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>

      {/* Top-center radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(139,92,246,0.08)_0%,transparent_50%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={stagger}
          onAnimationComplete={() => setHeadlineReady(true)}
          className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
        >
          {"Your AI squad, ready to "}
          <WordCycler
            words={HERO.cycleWords}
            holdDuration={1800}
            active={headlineReady}
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          />
          {"."}
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-6 max-w-2xl text-lg text-white/50 sm:text-xl"
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
          <WaitlistForm variant="inline" />
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-8 flex items-center gap-2 text-sm text-white/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {HERO.socialProof}
        </motion.div>

        {/* Constellation teaser — animated with glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16"
        >
          <svg width="320" height="100" viewBox="0 0 320 100" className="opacity-30">
            <defs>
              <radialGradient id="teaser-glow">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Central glow */}
            <circle cx="160" cy="50" r="30" fill="url(#teaser-glow)" />
            {/* Central node */}
            <circle cx="160" cy="50" r="5" fill="white" opacity="0.5" />
            {/* Orbit ring */}
            <circle cx="160" cy="50" r="35" fill="none" stroke="white" strokeWidth="0.3" opacity="0.15" />
            {/* Surrounding nodes with lines */}
            {[
              { cx: 40, cy: 30 },
              { cx: 80, cy: 70 },
              { cx: 125, cy: 20 },
              { cx: 195, cy: 20 },
              { cx: 240, cy: 70 },
              { cx: 280, cy: 30 },
            ].map((node, i) => (
              <g key={i}>
                <line
                  x1="160"
                  y1="50"
                  x2={node.cx}
                  y2={node.cy}
                  stroke="white"
                  strokeWidth="0.4"
                  opacity="0.2"
                  strokeDasharray="4 2"
                />
                <circle cx={node.cx} cy={node.cy} r="2.5" fill="white" opacity="0.35" />
                <circle cx={node.cx} cy={node.cy} r="5" fill="white" opacity="0.05" />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Bottom fade gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#06060B] to-transparent" />
    </section>
  );
}
