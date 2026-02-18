"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { GradientDivider } from "./GradientDivider";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  animation?: "fade-up" | "scale-in" | "none";
  showDivider?: boolean;
}

const animationVariants = {
  "fade-up": {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  "scale-in": {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  none: {
    initial: {},
    animate: {},
  },
};

export function SectionWrapper({
  children,
  className = "",
  id,
  animation = "fade-up",
  showDivider = false,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const variant = animationVariants[animation];

  return (
    <>
      {showDivider && <GradientDivider />}
      <section ref={ref} id={id} className={`px-4 py-20 sm:px-6 lg:px-8 ${className}`}>
        <motion.div
          className="mx-auto max-w-6xl"
          initial={variant.initial}
          animate={isInView ? variant.animate : variant.initial}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </section>
    </>
  );
}
