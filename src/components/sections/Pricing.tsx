"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { GradientText } from "@/components/ui/GradientText";
import { GlowButton } from "@/components/ui/GlowButton";
import { PRICING } from "@/lib/constants";

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-bg-primary px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <GradientText
            as="h2"
            className="text-[clamp(2rem,3vw+0.5rem,3rem)] font-semibold"
          >
            Simple Pricing
          </GradientText>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            One plan. Full squad. No surprises.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-lg"
        >
          <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.03] p-8 shadow-lg shadow-accent-blue/5">
            {/* Subtle border glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-accent-blue/10 via-transparent to-accent-purple/10 opacity-50" />

            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
                {PRICING.planName}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <GradientText
                  as="span"
                  className="text-5xl font-bold tracking-tight"
                >
                  {PRICING.price}
                </GradientText>
                <span className="text-lg text-text-secondary">
                  {PRICING.period}
                </span>
              </div>

              <ul className="mt-8 space-y-3">
                {PRICING.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-cyan"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <GlowButton
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    document
                      .getElementById("waitlist")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {PRICING.cta}
                </GlowButton>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-text-muted"
        >
          <span className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            NDA protected
          </span>
        </motion.div>
      </div>
    </section>
  );
}
