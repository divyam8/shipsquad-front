"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { GradientText } from "@/components/ui/GradientText";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { CTA, HERO } from "@/lib/constants";

export function EarlyAccessCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-bg-primary px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Purple glow from bottom */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(139,92,246,0.15)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-accent-purple/30 bg-accent-purple/10 px-4 py-1.5 text-sm font-medium text-accent-purple">
            {CTA.badge}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GradientText
            as="h2"
            className="mt-6 text-[clamp(2rem,3vw+0.5rem,3rem)] font-semibold"
          >
            {CTA.headline}
          </GradientText>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg text-text-secondary"
        >
          {CTA.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 w-full max-w-md"
        >
          <WaitlistForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex items-center gap-2 text-sm text-text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {HERO.socialProof}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-text-muted"
        >
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            NDA protected
          </span>
        </motion.div>
      </div>
    </section>
  );
}
