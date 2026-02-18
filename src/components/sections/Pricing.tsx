"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { GlowButton } from "@/components/ui/GlowButton";
import { PRICING } from "@/lib/constants";

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative px-4 py-20 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-purple-500/[0.05] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/20"
        >
          Pricing
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          One plan. Full squad. No surprises.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 max-w-lg"
        >
          {/* Animated gradient border wrapper */}
          <div
            className="relative rounded-2xl p-[1px]"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)",
              backgroundSize: "300% 300%",
              animation: "gradient-shift 6s ease infinite",
            }}
          >
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Most Popular
              </span>
            </div>

            <div className="rounded-2xl bg-[#06060B] p-8 pt-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                {PRICING.planName}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
                  {PRICING.price}
                </span>
                <span className="text-lg text-white/40">
                  {PRICING.period}
                </span>
              </div>

              <ul className="mt-8 space-y-4">
                {PRICING.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    </span>
                    <span className="text-sm text-white/50">
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

          <p className="mt-4 text-center text-sm text-white/20">
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
