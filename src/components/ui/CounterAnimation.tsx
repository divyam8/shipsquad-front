"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "motion/react";

interface CounterAnimationProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function CounterAnimation({
  end,
  prefix = "",
  suffix = "",
  duration = 2000,
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [end, duration]);

  useEffect(() => {
    if (isInView) animate();
  }, [isInView, animate]);

  return (
    <span ref={ref}>
      {prefix}{value}{suffix}
    </span>
  );
}
