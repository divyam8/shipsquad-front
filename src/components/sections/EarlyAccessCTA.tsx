"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SpaceDust } from "@/components/ui/SpaceDust";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { CTA } from "@/lib/constants";

export function EarlyAccessCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      <SpaceDust />

      {/* Multi-layer spotlight gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18)_0%,rgba(59,130,246,0.06)_35%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(236,72,153,0.06)_0%,transparent_50%)]" />

      {/* Radial rings for depth */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[400, 600].map((size) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.02]"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
        >
          {CTA.headline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 w-full max-w-md"
        >
          <WaitlistForm variant="full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-sm text-white/30"
        >
          {CTA.subtext}
        </motion.p>
      </div>
    </section>
  );
}
