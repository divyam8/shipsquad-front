"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface WordCyclerProps {
  words: readonly string[];
  holdDuration?: number;
  className?: string;
  active?: boolean;
}

export function WordCycler({
  words,
  holdDuration = 600,
  className,
  active = false,
}: WordCyclerProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const lastIndex = words.length - 1;
  const longestWord = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  useEffect(() => {
    if (!active || index >= lastIndex || shouldReduceMotion) return;

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, holdDuration);

    return () => clearTimeout(timer);
  }, [active, index, lastIndex, holdDuration, shouldReduceMotion]);

  // Reduced motion: show final word immediately
  const displayIndex = shouldReduceMotion ? lastIndex : active ? index : 0;
  const currentWord = words[displayIndex];

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      {/* Width reservation — invisible longest word */}
      <span className="invisible" aria-hidden="true">
        {longestWord}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={shouldReduceMotion ? false : { opacity: 0, y: "40%", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: "-40%", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] }}
          className={`absolute inset-0 ${className ?? ""}`}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
