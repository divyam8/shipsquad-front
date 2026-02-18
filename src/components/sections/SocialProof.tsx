"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CounterAnimation } from "@/components/ui/CounterAnimation";
import { SOCIAL_PROOF_METRICS } from "@/lib/constants";

export function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/20"
        >
          Trusted by founders
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {SOCIAL_PROOF_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]" />

              <p className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                <CounterAnimation
                  end={metric.value}
                  prefix={"prefix" in metric ? metric.prefix : ""}
                  suffix={"suffix" in metric ? metric.suffix : ""}
                />
              </p>
              <p className="mt-2 text-sm text-white/30">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
