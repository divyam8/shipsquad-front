"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { industryStats } from "@/data/industry-stats";
import { tools } from "@/data/tools";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; score: number }[];
}

interface Answers {
  [questionId: string]: string;
}

type Category = "AI Pioneer" | "AI Ready" | "AI Curious" | "AI Beginner";

/* ------------------------------------------------------------------ */
/*  Questions                                                          */
/* ------------------------------------------------------------------ */

const questions: Question[] = [
  {
    id: "industry",
    text: "What industry are you in?",
    options: [
      { label: "Healthcare", value: "healthcare", score: 8 },
      { label: "Legal", value: "legal", score: 7 },
      { label: "Finance", value: "finance", score: 9 },
      { label: "Marketing", value: "marketing", score: 10 },
      { label: "Retail", value: "retail", score: 8 },
      { label: "Education", value: "education", score: 7 },
      { label: "Manufacturing", value: "manufacturing", score: 6 },
      { label: "Technology", value: "technology", score: 10 },
      { label: "Other", value: "other", score: 7 },
    ],
  },
  {
    id: "team-size",
    text: "How large is your team?",
    options: [
      { label: "1\u20135", value: "1-5", score: 10 },
      { label: "6\u201320", value: "6-20", score: 12 },
      { label: "21\u2013100", value: "21-100", score: 9 },
      { label: "100+", value: "100+", score: 7 },
    ],
  },
  {
    id: "repetitive-tasks",
    text: "How much of your work involves repetitive tasks?",
    options: [
      { label: "Very little (<10%)", value: "very-little", score: 4 },
      { label: "Some (10\u201330%)", value: "some", score: 8 },
      { label: "Significant (30\u201360%)", value: "significant", score: 12 },
      { label: "Mostly (60%+)", value: "mostly", score: 15 },
    ],
  },
  {
    id: "current-ai",
    text: "Are you currently using any AI tools?",
    options: [
      { label: "None", value: "none", score: 3 },
      { label: "1\u20132 tools casually", value: "casual", score: 8 },
      { label: "Several tools regularly", value: "regular", score: 13 },
      { label: "AI is core to our workflow", value: "core", score: 15 },
    ],
  },
  {
    id: "bottleneck",
    text: "What\u2019s your biggest operational bottleneck?",
    options: [
      { label: "Content creation", value: "content-creation", score: 13 },
      { label: "Data analysis", value: "data-analysis", score: 12 },
      { label: "Customer support", value: "customer-support", score: 11 },
      { label: "Project management", value: "project-management", score: 9 },
      { label: "Sales outreach", value: "sales-outreach", score: 12 },
      { label: "Manual processes", value: "manual-processes", score: 14 },
    ],
  },
  {
    id: "tech-savvy",
    text: "How tech-savvy is your team?",
    options: [
      { label: "Basic (email/docs)", value: "basic", score: 4 },
      { label: "Moderate (SaaS tools)", value: "moderate", score: 9 },
      { label: "Advanced (APIs/automation)", value: "advanced", score: 13 },
      { label: "Expert (custom development)", value: "expert", score: 15 },
    ],
  },
  {
    id: "budget",
    text: "What\u2019s your monthly software budget per person?",
    options: [
      { label: "Under $50", value: "under-50", score: 6 },
      { label: "$50\u2013200", value: "50-200", score: 10 },
      { label: "$200\u2013500", value: "200-500", score: 13 },
      { label: "$500+", value: "500+", score: 15 },
    ],
  },
  {
    id: "concern",
    text: "What\u2019s your top concern about AI adoption?",
    options: [
      { label: "Cost", value: "cost", score: 8 },
      { label: "Learning curve", value: "learning-curve", score: 7 },
      { label: "Data privacy", value: "data-privacy", score: 9 },
      { label: "Job displacement", value: "job-displacement", score: 6 },
      { label: "Quality/accuracy", value: "quality", score: 10 },
      { label: "Don\u2019t know where to start", value: "dont-know", score: 5 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Scoring helpers                                                    */
/* ------------------------------------------------------------------ */

const MAX_SCORE = 15 + 12 + 15 + 15 + 14 + 15 + 15 + 10; // 111

function computeScore(answers: Answers): number {
  let raw = 0;
  for (const q of questions) {
    const selected = answers[q.id];
    const opt = q.options.find((o) => o.value === selected);
    if (opt) raw += opt.score;
  }
  return Math.min(100, Math.round((raw / MAX_SCORE) * 100));
}

function getCategory(score: number): Category {
  if (score >= 80) return "AI Pioneer";
  if (score >= 60) return "AI Ready";
  if (score >= 40) return "AI Curious";
  return "AI Beginner";
}

function getCategoryColor(cat: Category) {
  switch (cat) {
    case "AI Pioneer":
      return "text-green-400";
    case "AI Ready":
      return "text-blue-400";
    case "AI Curious":
      return "text-yellow-400";
    case "AI Beginner":
      return "text-orange-400";
  }
}

/* ------------------------------------------------------------------ */
/*  Recommendation engine                                              */
/* ------------------------------------------------------------------ */

function getNextSteps(score: number, answers: Answers): string[] {
  const steps: string[] = [];
  const cat = getCategory(score);

  if (cat === "AI Beginner") {
    steps.push("Start with a free AI chatbot like ChatGPT or Claude to explore basic capabilities.");
    steps.push("Identify your top 3 most time-consuming repetitive tasks and research AI solutions for each.");
    steps.push("Set aside 30 minutes per day for one week to experiment with AI tools \u2014 no commitment, just exploration.");
    if (answers["concern"] === "learning-curve" || answers["concern"] === "dont-know") {
      steps.push("Watch beginner-friendly AI tutorials on YouTube to build confidence before investing.");
    }
    steps.push("Consider a low-cost AI squad to handle the heavy lifting while you learn.");
  } else if (cat === "AI Curious") {
    steps.push("Upgrade from casual AI use to structured workflows \u2014 create documented processes for AI-assisted tasks.");
    steps.push("Calculate the ROI of automating your biggest bottleneck using our AI ROI Calculator.");
    if (answers["bottleneck"] === "content-creation") {
      steps.push("Test an AI writing tool like Jasper or Copy.ai alongside your current workflow for two weeks.");
    } else if (answers["bottleneck"] === "data-analysis") {
      steps.push("Try Claude or ChatGPT\u2019s data analysis features with your actual business data.");
    } else if (answers["bottleneck"] === "customer-support") {
      steps.push("Pilot an AI customer support agent on a low-stakes channel (e.g., FAQ chatbot on your website).");
    }
    steps.push("Train your team: organize a 1-hour AI tools workshop focused on your specific use cases.");
    steps.push("Set measurable goals \u2014 e.g., \u201Creduce content creation time by 40% in 30 days.\u201D");
  } else if (cat === "AI Ready") {
    steps.push("Scale AI across departments \u2014 what works for one team can likely benefit others.");
    steps.push("Audit your current AI tools: are you getting maximum value from each subscription?");
    steps.push("Consider an AI squad to coordinate multiple AI agents under one managed workflow.");
    if (answers["tech-savvy"] === "advanced" || answers["tech-savvy"] === "expert") {
      steps.push("Build custom AI automations connecting your existing tools via APIs (Zapier, Make, or custom code).");
    }
    steps.push("Document your AI playbook \u2014 capture what works so new team members can hit the ground running.");
  } else {
    steps.push("You\u2019re already ahead \u2014 focus on AI governance: establish usage policies, data handling rules, and quality standards.");
    steps.push("Explore agentic AI workflows where AI agents autonomously handle multi-step processes end-to-end.");
    steps.push("Mentor other teams or departments on AI adoption \u2014 your experience is valuable.");
    steps.push("Evaluate emerging AI tools monthly to stay ahead of the curve and maintain your competitive edge.");
    if (answers["budget"] === "500+") {
      steps.push("Consider building proprietary AI capabilities (fine-tuned models, custom agents) for strategic advantage.");
    }
  }

  return steps.slice(0, 5);
}

/* ------------------------------------------------------------------ */
/*  Tool recommendations                                               */
/* ------------------------------------------------------------------ */

interface ToolRec {
  slug: string;
  name: string;
  category: string;
  pricing: string;
  description: string;
  hasReviewPage: boolean;
}

function getRecommendedTools(answers: Answers): ToolRec[] {
  const bottleneck = answers["bottleneck"];
  const budget = answers["budget"];
  const techLevel = answers["tech-savvy"];

  // Map bottleneck to relevant tool categories
  const categoryMap: Record<string, string[]> = {
    "content-creation": ["AI Writing", "AI Image Generation"],
    "data-analysis": ["AI Chatbot", "AI Data"],
    "customer-support": ["AI Chatbot", "AI Customer Service"],
    "project-management": ["AI Productivity", "AI Automation"],
    "sales-outreach": ["AI Writing", "AI Sales"],
    "manual-processes": ["AI Automation", "AI Coding"],
  };

  const targetCategories = categoryMap[bottleneck] || ["AI Chatbot", "AI Automation"];

  // Budget filter
  const isLowBudget = budget === "under-50";
  const isTechnical = techLevel === "advanced" || techLevel === "expert";

  // Score each tool
  const scored = tools
    .map((t) => {
      let relevance = 0;
      if (targetCategories.includes(t.category)) relevance += 10;
      if (isLowBudget && (t.pricing === "Freemium" || t.pricing === "Open Source")) relevance += 5;
      if (!isLowBudget) relevance += 2;
      if (isTechnical && (t.category === "AI Coding" || t.pricing === "Open Source")) relevance += 3;
      if (t.rating >= 4.5) relevance += 2;
      if (t.hasReviewPage) relevance += 1;
      return { tool: t, relevance };
    })
    .filter((s) => s.relevance > 5)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);

  // Fallback: if fewer than 3, add top-rated chatbots
  if (scored.length < 3) {
    const fallbacks = tools
      .filter(
        (t) =>
          t.category === "AI Chatbot" &&
          t.rating >= 4.5 &&
          !scored.some((s) => s.tool.slug === t.slug),
      )
      .slice(0, 3 - scored.length);
    for (const fb of fallbacks) {
      scored.push({ tool: fb, relevance: 5 });
    }
  }

  return scored.map((s) => ({
    slug: s.tool.slug,
    name: s.tool.name,
    category: s.tool.category,
    pricing: s.tool.pricing,
    description: s.tool.description,
    hasReviewPage: s.tool.hasReviewPage,
  }));
}

/* ------------------------------------------------------------------ */
/*  Industry stat helper                                               */
/* ------------------------------------------------------------------ */

function getIndustryStatForQuiz(industry: string) {
  const mapping: Record<string, string> = {
    healthcare: "healthcare",
    legal: "legal",
    finance: "finance",
    marketing: "marketing",
    retail: "retail",
    education: "education",
    manufacturing: "manufacturing",
    technology: "saas",
    other: "globalai",
  };
  const domain = mapping[industry] || "globalai";
  return industryStats.find((s) => s.domain === domain);
}

/* ------------------------------------------------------------------ */
/*  Industry page slug helper                                          */
/* ------------------------------------------------------------------ */

function getIndustryPageSlug(industry: string): string | null {
  const mapping: Record<string, string> = {
    healthcare: "healthcare",
    legal: "legal",
    finance: "finance",
    marketing: "marketing",
    retail: "retail",
    education: "education",
    manufacturing: "operations",
    technology: "saas",
  };
  return mapping[industry] || null;
}

/* ------------------------------------------------------------------ */
/*  CSS-only Score Ring                                                */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, category }: { score: number; category: Category }) {
  const circumference = 2 * Math.PI * 54; // r=54
  const filled = (score / 100) * circumference;
  const colorClass = getCategoryColor(category);

  const strokeColor = (() => {
    switch (category) {
      case "AI Pioneer": return "#22c55e";
      case "AI Ready": return "#3b82f6";
      case "AI Curious": return "#eab308";
      case "AI Beginner": return "#f97316";
    }
  })();

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-xs text-text-muted mt-1">out of 100</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Quiz Component                                                */
/* ------------------------------------------------------------------ */

export function AIReadinessQuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const totalQuestions = questions.length;
  const progress = showResults ? 100 : Math.round((currentStep / totalQuestions) * 100);

  const selectAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));

      // Auto-advance after a short delay
      setTimeout(() => {
        if (currentStep < totalQuestions - 1) {
          setCurrentStep((s) => s + 1);
        } else {
          // Show results
          setShowResults(true);
          // Animate score counting up
          setTimeout(() => setAnimateScore(true), 100);
        }
      }, 300);
    },
    [currentStep, totalQuestions],
  );

  const finalScore = useMemo(() => computeScore(answers), [answers]);
  const category = useMemo(() => getCategory(finalScore), [finalScore]);
  const nextSteps = useMemo(() => getNextSteps(finalScore, answers), [finalScore, answers]);
  const recommendedTools = useMemo(() => getRecommendedTools(answers), [answers]);
  const industryStat = useMemo(
    () => getIndustryStatForQuiz(answers["industry"] || "other"),
    [answers],
  );
  const industryPageSlug = useMemo(
    () => getIndustryPageSlug(answers["industry"] || ""),
    [answers],
  );

  // Animate score counter on results reveal
  useEffect(() => {
    if (!animateScore) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= finalScore) {
        current = finalScore;
        clearInterval(interval);
      }
      setDisplayScore(current);
    }, 15);
    return () => clearInterval(interval);
  }, [animateScore, finalScore]);

  const scoreToShow = animateScore ? displayScore : 0;

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const startOver = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setAnimateScore(false);
    setDisplayScore(0);
    setCopied(false);
  }, []);

  const shareScore = useCallback(async () => {
    const text = `I scored ${finalScore}/100 on the AI Readiness Assessment \u2014 I\u2019m an "${category}"! Take the free quiz: https://shipsquad.ai/tools/ai-readiness-assessment`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "AI Readiness Score", text, url: "https://shipsquad.ai/tools/ai-readiness-assessment" });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [finalScore, category]);

  /* ---- Quiz view ---- */
  if (!showResults) {
    const q = questions[currentStep];
    return (
      <div>
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span>Question {currentStep + 1} of {totalQuestions}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">{q.text}</h2>

          <div className="grid gap-3">
            {q.options.map((opt) => {
              const isSelected = answers[q.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(q.id, opt.value)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-blue-500/50 bg-blue-500/10 text-text-primary"
                      : "border-white/[0.05] bg-white/[0.02] text-text-secondary hover:border-white/[0.15] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Back button */}
          {currentStep > 0 && (
            <button
              onClick={goBack}
              className="mt-6 text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            >
              &larr; Back to previous question
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---- Results view ---- */
  const categoryColor = getCategoryColor(category);

  return (
    <div className="space-y-8">
      {/* Score card */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-10 text-center">
        <p className="text-sm text-text-muted mb-4 uppercase tracking-wider">Your AI Readiness Score</p>

        <ScoreRing score={scoreToShow} category={category} />

        <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${categoryColor}`}>{category}</h2>
        <p className="text-text-secondary max-w-lg mx-auto">
          {category === "AI Pioneer" &&
            "You\u2019re already leveraging AI at an advanced level. Focus on governance, cutting-edge tools, and sharing your expertise."}
          {category === "AI Ready" &&
            "Your team is well-positioned for AI adoption. Scale your current AI use across departments for maximum impact."}
          {category === "AI Curious" &&
            "You\u2019re exploring AI but haven\u2019t fully committed. Structured workflows and clear goals will accelerate your journey."}
          {category === "AI Beginner" &&
            "You\u2019re early in the AI journey \u2014 that\u2019s okay! Start with one low-risk use case and build from there."}
        </p>
      </div>

      {/* Industry stat */}
      {industryStat && (
        <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Industry Insight \u2014{" "}
            {answers["industry"]
              ? answers["industry"].charAt(0).toUpperCase() + answers["industry"].slice(1)
              : "Your Industry"}
          </p>
          <p className="text-lg font-semibold text-text-primary">{industryStat.stat}</p>
          <p className="text-xs text-text-muted mt-2">
            Source:{" "}
            <a
              href={industryStat.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              {industryStat.source}
            </a>
          </p>
        </div>
      )}

      {/* Recommended next steps */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8">
        <h3 className="text-xl font-bold text-text-primary mb-4">Your Recommended Next Steps</h3>
        <ol className="space-y-3">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-text-secondary text-sm sm:text-base leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        {/* Link to ROI calculator */}
        <div className="mt-6 pt-4 border-t border-white/[0.05]">
          <Link
            href="/tools/roi-calculator"
            className="text-sm text-accent-blue hover:underline"
          >
            Calculate your potential AI ROI &rarr;
          </Link>
        </div>
      </div>

      {/* Recommended tools */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8">
        <h3 className="text-xl font-bold text-text-primary mb-4">Recommended Tools for You</h3>
        <div className="grid gap-4">
          {recommendedTools.map((tool) => (
            <div
              key={tool.slug}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text-primary">{tool.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-text-muted">
                    {tool.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-text-muted">
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">{tool.description}</p>
              </div>
              {tool.hasReviewPage && (
                <Link
                  href={`/review/${tool.slug}`}
                  className="flex-shrink-0 text-sm px-4 py-2 rounded-lg border border-white/[0.10] bg-white/[0.02] text-text-primary hover:bg-white/[0.05] transition-colors"
                >
                  Read Review
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Industry page link */}
      {industryPageSlug && (
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-text-secondary mb-3">
            See how AI squads can transform your industry
          </p>
          <Link
            href={`/ai-squad-for/${industryPageSlug}`}
            className="inline-block px-6 py-2.5 text-sm font-medium rounded-full border border-accent-blue/30 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
          >
            AI Squad for{" "}
            {answers["industry"]
              ? answers["industry"].charAt(0).toUpperCase() + answers["industry"].slice(1)
              : "Your Industry"}{" "}
            &rarr;
          </Link>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={shareScore}
          className="px-8 py-3 font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 transition-all duration-300 cursor-pointer"
        >
          {copied ? "Copied to clipboard!" : "Share Your Score"}
        </button>
        <button
          onClick={startOver}
          className="px-8 py-3 font-semibold rounded-full border border-white/[0.10] bg-white/[0.02] text-text-primary hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
