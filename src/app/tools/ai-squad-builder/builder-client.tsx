"use client";

import { useState } from "react";

interface Agent {
  name: string;
  codename: string;
  emoji: string;
  role: string;
}

const allAgents: Agent[] = [
  { name: "Jarvis", codename: "Research", emoji: "\u{1F50D}", role: "Deep research, analysis, and knowledge synthesis" },
  { name: "Loki", codename: "Strategy", emoji: "\u{1F3AF}", role: "Strategic planning, competitive analysis, and positioning" },
  { name: "Fury", codename: "Execution", emoji: "\u26A1", role: "Task execution, project management, and delivery" },
  { name: "Vision", codename: "Analytics", emoji: "\u{1F4CA}", role: "Data analysis, metrics tracking, and insights" },
  { name: "Wanda", codename: "Creative", emoji: "\u{1F3A8}", role: "Content creation, design direction, and branding" },
  { name: "Friday", codename: "Automation", emoji: "\u{1F916}", role: "Workflow automation, integrations, and triggers" },
  { name: "Pepper", codename: "Communication", emoji: "\u{1F4AC}", role: "Client communication, reports, and stakeholder updates" },
  { name: "Quill", codename: "Content", emoji: "\u270D\uFE0F", role: "Writing, editing, SEO content, and copywriting" },
  { name: "Shuri", codename: "Engineering", emoji: "\u{1F528}", role: "Code development, technical architecture, and debugging" },
  { name: "Wong", codename: "Knowledge", emoji: "\u{1F4DA}", role: "Knowledge management, documentation, and training" },
];

const questions = [
  {
    id: "goal",
    question: "What's your primary goal?",
    options: [
      { label: "Build a product/app", value: "build" },
      { label: "Grow my business", value: "grow" },
      { label: "Automate operations", value: "automate" },
      { label: "Create content at scale", value: "content" },
      { label: "Improve customer experience", value: "customer" },
      { label: "Analyze data & make decisions", value: "analyze" },
    ],
  },
  {
    id: "industry",
    question: "What industry are you in?",
    options: [
      { label: "Tech / SaaS", value: "tech" },
      { label: "E-commerce", value: "ecommerce" },
      { label: "Marketing / Agency", value: "marketing" },
      { label: "Finance", value: "finance" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "team",
    question: "How big is your current team?",
    options: [
      { label: "Just me (solo)", value: "solo" },
      { label: "2-5 people", value: "small" },
      { label: "6-20 people", value: "medium" },
      { label: "20+ people", value: "large" },
    ],
  },
];

function getRecommendation(answers: Record<string, string>): Agent[] {
  const goal = answers.goal;
  const base: string[] = ["Fury", "Pepper"]; // Always include execution + comms

  const goalAgents: Record<string, string[]> = {
    build: ["Shuri", "Jarvis", "Vision", "Friday"],
    grow: ["Loki", "Quill", "Wanda", "Vision"],
    automate: ["Friday", "Shuri", "Vision", "Wong"],
    content: ["Quill", "Wanda", "Loki", "Jarvis"],
    customer: ["Friday", "Wong", "Vision", "Jarvis"],
    analyze: ["Vision", "Jarvis", "Wong", "Loki"],
  };

  const selected = [...new Set([...base, ...(goalAgents[goal] || goalAgents.build)])];
  // Fill to 6 agents
  const remaining = allAgents.filter(a => !selected.includes(a.name));
  while (selected.length < 6 && remaining.length > 0) {
    selected.push(remaining.shift()!.name);
  }

  return selected.map(name => allAgents.find(a => a.name === name)!).filter(Boolean);
}

export function SquadBuilderClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Agent[] | null>(null);

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getRecommendation(newAnswers));
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  if (result) {
    return (
      <div>
        <div className="rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Your AI Squad</h2>
          <p className="text-text-secondary mb-6">Based on your answers, here&apos;s your recommended squad composition:</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {result.map((agent) => (
              <div key={agent.name} className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4 flex items-start gap-3">
                <span className="text-2xl">{agent.emoji}</span>
                <div>
                  <p className="font-semibold text-text-primary">{agent.name}</p>
                  <p className="text-xs text-accent-blue mb-1">{agent.codename}</p>
                  <p className="text-sm text-text-secondary">{agent.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 mb-6">
            <p className="text-text-primary font-medium mb-1">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-green-400">$99<span className="text-lg text-text-muted">/mo</span></p>
            <p className="text-sm text-text-secondary mt-1">+ your Claude subscription (BYOC model)</p>
          </div>

          <div className="flex gap-3">
            <a href="/#waitlist" className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
              Deploy This Squad
            </a>
            <button onClick={reset} className="px-6 py-3 rounded-full border border-white/[0.10] text-text-secondary hover:bg-white/[0.05] transition-colors cursor-pointer">
              Start Over
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
          <h3 className="font-semibold text-text-primary mb-2">Want all 10 agents?</h3>
          <p className="text-sm text-text-secondary">
            Your $99/mo subscription includes access to all 10 specialist agents plus unlimited custom agents. The squad above is our recommended starting lineup for your specific mission.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8">
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-accent-blue" : "bg-white/[0.05]"}`} />
        ))}
      </div>

      <p className="text-sm text-text-muted mb-2">Question {step + 1} of {questions.length}</p>
      <h2 className="text-xl font-bold text-text-primary mb-6">{currentQuestion.question}</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="text-left rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all cursor-pointer"
          >
            <span className="text-sm font-medium text-text-primary">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
