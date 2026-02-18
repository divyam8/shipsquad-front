"use client";

import { useRef } from "react";
import { useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { SpaceDust } from "@/components/ui/SpaceDust";
import { SQUAD_LEAD, DOMAIN_SQUADS, DOMAIN_VERTICALS } from "@/lib/constants";

function getNodePositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const baseAngle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const jitter = ((i * 7 + 3) % 11 - 5) * 0.04;
    const angle = baseAngle + jitter;
    const radius = 35 + (i % 3) * 3;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius * 0.8;
    return { x, y, angle };
  });
}

function getGlowColor(icon: string) {
  const technical = ["puzzle", "blueprint", "layout", "server"];
  return technical.includes(icon)
    ? "rgba(59, 130, 246, 0.4)"
    : "rgba(139, 92, 246, 0.4)";
}

interface ConstellationProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

export function Constellation({ selectedDomain, onDomainChange }: ConstellationProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const activeAgents = DOMAIN_SQUADS[selectedDomain] ?? DOMAIN_SQUADS.Engineering;
  const positions = getNodePositions(activeAgents.length);

  return (
    <section ref={ref} className="relative min-h-screen px-4 py-20 sm:px-6 lg:px-8">
      <SpaceDust />

      {/* Background glow behind constellation */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[600px] w-[600px] rounded-full opacity-20 blur-[150px]"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, #3B82F6 50%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/20"
        >
          The Squad
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          One lead. Eight agents. Zero bottlenecks.
        </motion.h2>

        {/* Constellation visualization */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0.3 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 aspect-square max-w-3xl"
        >
          <div className="relative h-full w-full">
            {/* SVG connection lines + orbit rings */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id="center-glow">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Center glow */}
              <circle cx="50" cy="50" r="20" fill="url(#center-glow)" />

              {/* Orbit rings */}
              <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="0.15" opacity="0.1" strokeDasharray="2 3" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="0.1" opacity="0.08" strokeDasharray="1 4" />

              {/* Orbiting particle on outer ring */}
              <circle r="0.6" fill="white" opacity="0.4">
                <animateMotion
                  dur="20s"
                  repeatCount="indefinite"
                  path="M88,50 A38,38 0 1,1 87.99,50"
                />
              </circle>
              <circle r="0.4" fill="white" opacity="0.3">
                <animateMotion
                  dur="15s"
                  repeatCount="indefinite"
                  path="M75,50 A25,25 0 1,0 74.99,50"
                />
              </circle>

              <AnimatePresence mode="wait">
                <motion.g
                  key={selectedDomain}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {positions.map((pos, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={hoveredNode === i ? "rgba(139, 92, 246, 0.6)" : "url(#line-gradient)"}
                      strokeWidth={hoveredNode === i ? "0.4" : "0.2"}
                      className="transition-all duration-300"
                    />
                  ))}
                </motion.g>
              </AnimatePresence>
            </svg>

            {/* Central node — Squad Lead */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                {/* Pulsing glow ring */}
                <div
                  className="absolute -inset-2 rounded-full border border-purple-500/20"
                  style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
                />
                <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-15" style={{ animationDuration: "3s" }} />
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="mt-2 text-center text-xs font-semibold text-white/60">{SQUAD_LEAD.title}</p>
            </motion.div>

            {/* Agent nodes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDomain}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {activeAgents.map((agent, i) => {
                  const pos = positions[i];
                  const isHovered = hoveredNode === i;
                  return (
                    <motion.div
                      key={agent.codename}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: isHovered ? 1.15 : 1 }}
                      transition={{
                        delay: 0.1 * i,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div
                        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-xl backdrop-blur-sm transition-all duration-300"
                        style={{
                          boxShadow: isHovered
                            ? `0 0 30px ${getGlowColor(agent.icon)}, 0 0 60px ${getGlowColor(agent.icon).replace("0.4", "0.15")}`
                            : `0 0 15px ${getGlowColor(agent.icon).replace("0.4", "0.1")}`,
                        }}
                      >
                        {agent.emoji}
                        {/* Active indicator dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success/80" />
                      </div>

                      {/* Tooltip */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/[0.08] bg-bg-primary/95 px-4 py-2 shadow-xl backdrop-blur-md"
                        >
                          <p className="text-xs font-bold text-white">{agent.name}</p>
                          <p className="mt-0.5 text-[10px] text-white/40">{agent.role}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Domain selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
        >
          {DOMAIN_VERTICALS.map((vertical, i) => (
            <span key={vertical.name} className="flex items-center">
              <button
                type="button"
                onClick={() => onDomainChange(vertical.name)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                  vertical.name === selectedDomain
                    ? "bg-white/[0.08] text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {vertical.name}
              </button>
              {i < DOMAIN_VERTICALS.length - 1 && (
                <span className="mx-1 h-1 w-1 rounded-full bg-white/10" />
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
