"use client";

import { useState } from "react";

interface Results {
  traditional: number;
  freelancer: number;
  agency: number;
  shipsquad: number;
}

export function AICostCalculatorClient() {
  const [teamSize, setTeamSize] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [weeks, setWeeks] = useState(4);
  const [projectType, setProjectType] = useState("web-app");
  const [results, setResults] = useState<Results | null>(null);

  const projectMultiplier: Record<string, number> = {
    "web-app": 1,
    "mobile-app": 1.3,
    "saas-platform": 1.5,
    "ecommerce": 1.2,
    "api-backend": 0.8,
    "ai-integration": 1.4,
    "marketing-automation": 0.9,
    "data-pipeline": 1.1,
  };

  function calculate() {
    const multiplier = projectMultiplier[projectType] || 1;
    const hoursPerWeek = 40;
    const totalHours = teamSize * hoursPerWeek * weeks;

    const traditional = Math.round(totalHours * hourlyRate * 1.4 * multiplier); // 1.4x for benefits/overhead
    const freelancer = Math.round(totalHours * hourlyRate * 1.15 * multiplier); // 1.15x for platform fees
    const agency = Math.round(totalHours * (hourlyRate * 1.8) * multiplier); // agencies charge 1.8x
    const shipsquad = 99 * Math.ceil(weeks / 4) + 20; // $99/mo + ~$20 Claude sub

    setResults({ traditional, freelancer, agency, shipsquad });
  }

  const savings = results ? Math.round(((results.traditional - results.shipsquad) / results.traditional) * 100) : 0;

  return (
    <div>
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8 mb-8">
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Team Size</label>
            <input
              type="range" min={1} max={20} value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>1 person</span>
              <span className="text-accent-blue font-medium text-sm">{teamSize} people</span>
              <span>20 people</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Avg Hourly Rate ($)</label>
            <input
              type="range" min={25} max={250} step={5} value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>$25/hr</span>
              <span className="text-accent-blue font-medium text-sm">${hourlyRate}/hr</span>
              <span>$250/hr</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Project Duration (weeks)</label>
            <input
              type="range" min={1} max={26} value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>1 week</span>
              <span className="text-accent-blue font-medium text-sm">{weeks} weeks</span>
              <span>26 weeks</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-text-primary"
            >
              <option value="web-app">Web Application</option>
              <option value="mobile-app">Mobile App</option>
              <option value="saas-platform">SaaS Platform</option>
              <option value="ecommerce">E-commerce Store</option>
              <option value="api-backend">API / Backend</option>
              <option value="ai-integration">AI Integration</option>
              <option value="marketing-automation">Marketing Automation</option>
              <option value="data-pipeline">Data Pipeline</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full sm:w-auto px-8 py-3 font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 transition-all duration-300 cursor-pointer"
        >
          Calculate Costs
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Cost Comparison</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <CostCard label="Traditional Team" cost={results.traditional} color="text-text-secondary" />
            <CostCard label="Freelancers" cost={results.freelancer} color="text-text-secondary" />
            <CostCard label="Agency" cost={results.agency} color="text-text-secondary" isHighest />
            <CostCard label="ShipSquad AI Squad" cost={results.shipsquad} color="text-green-400" isLowest savings={savings} />
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center mt-6">
            <p className="text-3xl font-bold text-green-400">{savings}% savings</p>
            <p className="text-text-secondary mt-1">vs traditional team — save ${(results.traditional - results.shipsquad).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CostCard({ label, cost, color, isHighest, isLowest, savings }: {
  label: string; cost: number; color: string; isHighest?: boolean; isLowest?: boolean; savings?: number;
}) {
  return (
    <div className={`rounded-xl border p-5 ${isLowest ? "border-green-500/30 bg-green-500/5" : isHighest ? "border-red-500/20 bg-red-500/5" : "border-white/[0.05] bg-white/[0.02]"}`}>
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>${cost.toLocaleString()}</p>
      {isLowest && savings && <p className="text-xs text-green-400 mt-1">{savings}% less than traditional</p>}
      {isHighest && <p className="text-xs text-red-400 mt-1">Most expensive option</p>}
    </div>
  );
}
