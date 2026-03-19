"use client";

import { useState, useCallback } from "react";
import { tools } from "@/data/tools";
import type { Tool } from "@/types";

/* ------------------------------------------------------------------ */
/*  Quiz questions                                                     */
/* ------------------------------------------------------------------ */

interface Option {
  label: string;
  value: string;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: "useCase",
    question: "What\u2019s your primary use case?",
    options: [
      { label: "Coding & Development", value: "coding" },
      { label: "Writing & Content", value: "writing" },
      { label: "Design & Creative", value: "design" },
      { label: "Data & Analytics", value: "analytics" },
      { label: "Customer Service", value: "customer" },
      { label: "Sales & Marketing", value: "marketing" },
      { label: "HR & Recruiting", value: "hr" },
      { label: "General Productivity", value: "general" },
    ],
  },
  {
    id: "teamSize",
    question: "What\u2019s your team size?",
    options: [
      { label: "Solo / Freelancer", value: "solo" },
      { label: "Small team (2\u201310)", value: "small" },
      { label: "Medium (11\u201350)", value: "medium" },
      { label: "Enterprise (50+)", value: "enterprise" },
    ],
  },
  {
    id: "budget",
    question: "What\u2019s your budget?",
    options: [
      { label: "Free only", value: "free" },
      { label: "Under $50/mo", value: "under50" },
      { label: "Under $200/mo", value: "under200" },
      { label: "No budget limit", value: "unlimited" },
    ],
  },
  {
    id: "priority",
    question: "What matters most?",
    options: [
      { label: "Ease of use", value: "ease" },
      { label: "Advanced features", value: "features" },
      { label: "Integration ecosystem", value: "integrations" },
      { label: "Price-to-value ratio", value: "value" },
    ],
  },
  {
    id: "techLevel",
    question: "What\u2019s your technical level?",
    options: [
      { label: "Non-technical", value: "non-tech" },
      { label: "Some technical", value: "some-tech" },
      { label: "Developer", value: "developer" },
      { label: "Technical team", value: "tech-team" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Category mapping: use-case -> relevant tool categories             */
/* ------------------------------------------------------------------ */

const useCaseCategoryMap: Record<string, string[]> = {
  coding: ["AI Coding", "AI Development", "AI Agent Framework"],
  writing: ["AI Writing", "AI Chatbot"],
  design: ["AI Image Generation", "AI Video"],
  analytics: ["AI Analytics", "AI API", "AI Development"],
  customer: ["AI Chatbot", "AI Transcription", "AI Audio"],
  marketing: ["AI Writing", "AI Image Generation", "AI Chatbot", "AI Video"],
  hr: ["AI Chatbot", "AI Writing", "AI Transcription"],
  general: ["AI Chatbot", "AI Search", "AI Development", "AI Writing"],
};

/* ------------------------------------------------------------------ */
/*  Scoring & recommendation logic                                     */
/* ------------------------------------------------------------------ */

function extractMinPrice(pricingDetail: string, pricingModel: string): number {
  if (
    pricingModel === "Free" ||
    pricingModel === "Open Source" ||
    pricingModel === "Freemium"
  ) {
    return 0;
  }
  const matches = pricingDetail.match(/\$(\d+(?:\.\d+)?)/g);
  if (!matches || matches.length === 0) return 0;
  const prices = matches
    .map((m) => parseFloat(m.replace("$", "")))
    .filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

interface ScoredTool {
  tool: Tool;
  score: number;
  reasons: string[];
}

function getRecommendations(answers: Record<string, string>): ScoredTool[] {
  const { useCase, teamSize, budget, priority, techLevel } = answers;

  /* 1. category filter */
  const relevantCategories = useCaseCategoryMap[useCase] || useCaseCategoryMap.general;
  let pool = tools.filter((t) => relevantCategories.includes(t.category));

  /* If pool too small, include chatbots as fallback */
  if (pool.length < 8) {
    const chatbots = tools.filter(
      (t) => t.category === "AI Chatbot" && !pool.some((p) => p.slug === t.slug)
    );
    pool = [...pool, ...chatbots];
  }

  /* 2. budget filter */
  const budgetMax: Record<string, number> = {
    free: 0,
    under50: 50,
    under200: 200,
    unlimited: Infinity,
  };
  const maxPrice = budgetMax[budget] ?? Infinity;

  pool = pool.filter((t) => {
    if (maxPrice === Infinity) return true;
    if (maxPrice === 0) {
      return (
        t.pricing === "Free" ||
        t.pricing === "Freemium" ||
        t.pricing === "Open Source"
      );
    }
    const minP = extractMinPrice(t.pricingDetail, t.pricing);
    return minP <= maxPrice;
  });

  /* 3. score each remaining tool */
  const scored: ScoredTool[] = pool.map((tool) => {
    let score = 0;
    const reasons: string[] = [];

    /* Base: rating contributes heavily */
    score += tool.rating * 10;

    /* Category match bonus */
    if (relevantCategories[0] === tool.category) {
      score += 15;
      reasons.push(`Top match for your ${useCase.replace(/-/g, " ")} use case`);
    } else if (relevantCategories.includes(tool.category)) {
      score += 8;
      reasons.push(`Relevant to your ${useCase.replace(/-/g, " ")} workflow`);
    }

    /* Team size alignment */
    if (teamSize === "solo" || teamSize === "small") {
      if (
        tool.pricing === "Freemium" ||
        tool.pricing === "Free" ||
        tool.pricing === "Open Source"
      ) {
        score += 5;
        reasons.push("Great for small teams with flexible pricing");
      }
    }
    if (teamSize === "enterprise") {
      if (tool.pricingDetail.toLowerCase().includes("enterprise")) {
        score += 8;
        reasons.push("Enterprise-ready with team features");
      }
    }

    /* Priority alignment */
    if (priority === "ease") {
      if (
        tool.pros.some(
          (p) =>
            p.toLowerCase().includes("easy") ||
            p.toLowerCase().includes("intuitive") ||
            p.toLowerCase().includes("simple") ||
            p.toLowerCase().includes("beginner")
        )
      ) {
        score += 10;
        if (!reasons.some((r) => r.includes("ease"))) {
          reasons.push("Known for its intuitive, easy-to-use interface");
        }
      }
    }
    if (priority === "features") {
      if (tool.features.length >= 5) {
        score += 5;
      }
      if (tool.rating >= 4.5) {
        score += 5;
        if (!reasons.some((r) => r.includes("feature"))) {
          reasons.push("Feature-rich with high user satisfaction");
        }
      }
    }
    if (priority === "integrations") {
      if (
        tool.features.some(
          (f) =>
            f.toLowerCase().includes("integration") ||
            f.toLowerCase().includes("plugin") ||
            f.toLowerCase().includes("ecosystem")
        ) ||
        tool.pros.some(
          (p) =>
            p.toLowerCase().includes("integration") ||
            p.toLowerCase().includes("ecosystem")
        )
      ) {
        score += 10;
        if (!reasons.some((r) => r.includes("integration"))) {
          reasons.push("Strong integration ecosystem for your stack");
        }
      }
    }
    if (priority === "value") {
      const minP = extractMinPrice(tool.pricingDetail, tool.pricing);
      if (minP === 0) {
        score += 10;
        if (!reasons.some((r) => r.includes("value"))) {
          reasons.push("Excellent value with a free tier available");
        }
      } else if (minP <= 20) {
        score += 6;
        if (!reasons.some((r) => r.includes("value"))) {
          reasons.push("Strong price-to-value ratio");
        }
      }
    }

    /* Technical level alignment */
    if (techLevel === "non-tech" || techLevel === "some-tech") {
      if (
        tool.pricing !== "Open Source" &&
        !tool.cons.some(
          (c) =>
            c.toLowerCase().includes("technical") ||
            c.toLowerCase().includes("setup") ||
            c.toLowerCase().includes("learning curve")
        )
      ) {
        score += 5;
      }
    }
    if (techLevel === "developer" || techLevel === "tech-team") {
      if (
        tool.pricing === "Open Source" ||
        tool.features.some(
          (f) =>
            f.toLowerCase().includes("api") ||
            f.toLowerCase().includes("code") ||
            f.toLowerCase().includes("self-host")
        )
      ) {
        score += 8;
        if (!reasons.some((r) => r.includes("technical"))) {
          reasons.push("Built for technical users with developer-friendly tools");
        }
      }
    }

    /* Has deep content pages (more useful to recommend) */
    if (tool.hasReviewPage) score += 2;
    if (tool.hasPricingPage) score += 1;
    if (tool.hasAlternativePage) score += 1;
    if (tool.longDescription) score += 3;

    /* Ensure at least one reason */
    if (reasons.length === 0) {
      reasons.push(
        `Highly rated ${tool.category.replace("AI ", "")} tool (${tool.rating}/5)`
      );
    }

    return { tool, score, reasons };
  });

  /* 4. sort by score, take top 5 */
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}

/* ------------------------------------------------------------------ */
/*  Star rating helper                                                 */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5 text-yellow-400 text-sm">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 1l2.39 4.84L17.3 6.9l-3.65 3.56.86 5.03L10 13.14l-4.51 2.37.86-5.03L2.7 6.92l4.91-.08L10 1z" />
        </svg>
      ))}
      {half && (
        <svg className="w-4 h-4" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M10 1l2.39 4.84L17.3 6.9l-3.65 3.56.86 5.03L10 13.14l-4.51 2.37.86-5.03L2.7 6.92l4.91-.08L10 1z"
            fill="url(#halfGrad)"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 fill-none stroke-current opacity-40" viewBox="0 0 20 20">
          <path d="M10 1l2.39 4.84L17.3 6.9l-3.65 3.56.86 5.03L10 13.14l-4.51 2.37.86-5.03L2.7 6.92l4.91-.08L10 1z" strokeWidth="1" />
        </svg>
      ))}
      <span className="ml-1 text-text-secondary text-xs">{rating}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function ToolFinderClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ScoredTool[] | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleAnswer = useCallback(
    (value: string) => {
      if (animating) return;
      const newAnswers = { ...answers, [questions[step].id]: value };
      setAnswers(newAnswers);
      setAnimating(true);

      setTimeout(() => {
        if (step < questions.length - 1) {
          setStep(step + 1);
        } else {
          setResults(getRecommendations(newAnswers));
        }
        setAnimating(false);
      }, 300);
    },
    [step, answers, animating]
  );

  const reset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setResults(null);
  }, []);

  /* ----- Results view ----- */
  if (results) {
    return (
      <div>
        <div className="rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Your Recommended AI Tools
          </h2>
          <p className="text-text-secondary mb-6">
            Based on your answers, here are the top 5 tools we recommend for
            your workflow:
          </p>

          <div className="space-y-4 mb-8">
            {results.map(({ tool, reasons }, idx) => (
              <div
                key={tool.slug}
                className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-5 sm:p-6 transition-all hover:border-accent-blue/20"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue font-bold text-sm">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-text-primary text-lg">
                        {tool.name}
                      </h3>
                      <span className="text-xs text-text-muted">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={tool.rating} />
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary mb-3">
                  {tool.description}
                </p>

                {/* Pricing badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block rounded-full bg-white/[0.06] px-3 py-0.5 text-xs font-medium text-text-secondary">
                    {tool.pricing}
                  </span>
                  <span className="text-xs text-text-muted">
                    {tool.pricingDetail.length > 80
                      ? tool.pricingDetail.slice(0, 80) + "..."
                      : tool.pricingDetail}
                  </span>
                </div>

                {/* Why recommended */}
                <div className="rounded-lg bg-accent-blue/5 border border-accent-blue/10 p-3 mb-4">
                  <p className="text-xs font-medium text-accent-blue mb-1">
                    Why we recommend it
                  </p>
                  <p className="text-sm text-text-secondary">
                    {reasons.join(". ")}.
                  </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {tool.hasReviewPage && (
                    <a
                      href={`/review/${tool.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent-blue/30 transition-colors"
                    >
                      Read Review
                    </a>
                  )}
                  {tool.hasPricingPage && (
                    <a
                      href={`/pricing/${tool.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent-blue/30 transition-colors"
                    >
                      View Pricing
                    </a>
                  )}
                  {tool.hasAlternativePage && (
                    <a
                      href={`/alternative/${tool.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent-blue/30 transition-colors"
                    >
                      Alternatives
                    </a>
                  )}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-accent-blue/20 bg-accent-blue/5 px-3 py-1.5 text-xs font-medium text-accent-blue hover:bg-accent-blue/10 transition-colors"
                  >
                    Visit Site &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-6 py-3 rounded-full border border-white/[0.10] text-text-secondary hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Bottom tip */}
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
          <h3 className="font-semibold text-text-primary mb-2">
            Need a deeper comparison?
          </h3>
          <p className="text-sm text-text-secondary">
            Visit our{" "}
            <a
              href="/compare"
              className="text-accent-blue hover:underline"
            >
              comparison pages
            </a>{" "}
            to see head-to-head tool matchups, or check out our{" "}
            <a
              href="/alternative"
              className="text-accent-blue hover:underline"
            >
              alternatives directory
            </a>{" "}
            for more options.
          </p>
        </div>
      </div>
    );
  }

  /* ----- Quiz view ----- */
  const currentQuestion = questions[step];

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8">
      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-accent-blue" : "bg-white/[0.05]"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-text-muted mb-2">
        Question {step + 1} of {questions.length}
      </p>
      <h2 className="text-xl font-bold text-text-primary mb-6">
        {currentQuestion.question}
      </h2>

      <div
        className={`grid sm:grid-cols-2 gap-3 transition-opacity duration-200 ${
          animating ? "opacity-0" : "opacity-100"
        }`}
      >
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="text-left rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all cursor-pointer"
          >
            <span className="text-sm font-medium text-text-primary">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* Back button (only after first question) */}
      {step > 0 && (
        <button
          onClick={() => {
            setStep(step - 1);
            const newAnswers = { ...answers };
            delete newAnswers[currentQuestion.id];
            setAnswers(newAnswers);
          }}
          className="mt-6 text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          &larr; Back
        </button>
      )}
    </div>
  );
}
