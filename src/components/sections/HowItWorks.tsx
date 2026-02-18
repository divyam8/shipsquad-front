"use client";

import { useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { getHowItWorksSteps } from "@/lib/constants";

interface HowItWorksProps {
  selectedDomain: string;
}

export function HowItWorks({ selectedDomain }: HowItWorksProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const steps = getHowItWorksSteps(selectedDomain);

  return (
    <section ref={ref} className="relative px-4 py-20 sm:px-6 lg:px-8">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[150px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/20"
        >
          How it works
        </motion.p>

        <div className="relative mt-16">
          {/* Vertical connector line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="absolute left-0 top-0 hidden h-full w-px origin-top sm:left-[4.5rem] sm:block"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.2) 20%, rgba(59,130,246,0.2) 80%, transparent)",
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
            >
              {i > 0 && <div className="border-t border-white/[0.05]" />}
              <div className="relative py-12 sm:py-16">
                {/* Oversized step number */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[8rem] font-bold leading-none text-white/[0.04] sm:text-[10rem]">
                  {step.number}
                </span>

                {/* Step dot on connector line */}
                <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 sm:left-[4.5rem] sm:block">
                  <div className="flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/80" />
                  </div>
                </div>

                <div className="relative ml-4 sm:ml-28">
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    {step.title}
                  </h3>
                  {step.number === "02" ? (
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={selectedDomain}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 max-w-lg text-base text-white/40 leading-relaxed"
                      >
                        {step.description}
                      </motion.p>
                    </AnimatePresence>
                  ) : (
                    <p className="mt-3 max-w-lg text-base text-white/40 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
