"use client";

import { useState } from "react";

interface ROIResults {
  annualTimeSaved: number;
  annualCostSaved: number;
  errorReduction: number;
  aiCost: number;
  netSavings: number;
  roi: number;
  paybackDays: number;
}

export function ROICalculatorClient() {
  const [manualHours, setManualHours] = useState(40);
  const [hourlyCost, setHourlyCost] = useState(50);
  const [errorRate, setErrorRate] = useState(5);
  const [automationPercent, setAutomationPercent] = useState(60);
  const [results, setResults] = useState<ROIResults | null>(null);

  function calculate() {
    const weeklyHoursSaved = manualHours * (automationPercent / 100);
    const annualTimeSaved = Math.round(weeklyHoursSaved * 52);
    const annualCostSaved = Math.round(annualTimeSaved * hourlyCost);
    const errorReduction = Math.round(annualCostSaved * (errorRate / 100) * 0.7); // 70% error reduction
    const aiCost = 99 * 12; // $99/mo annual
    const netSavings = annualCostSaved + errorReduction - aiCost;
    const roi = Math.round((netSavings / aiCost) * 100);
    const paybackDays = Math.max(1, Math.round((aiCost / (netSavings / 365))));

    setResults({ annualTimeSaved, annualCostSaved, errorReduction, aiCost, netSavings, roi, paybackDays });
  }

  return (
    <div>
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 sm:p-8 mb-8">
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Manual Hours Per Week</label>
            <input
              type="range" min={5} max={200} value={manualHours}
              onChange={(e) => setManualHours(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>5 hrs</span>
              <span className="text-accent-blue font-medium text-sm">{manualHours} hrs/week</span>
              <span>200 hrs</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Hourly Cost ($)</label>
            <input
              type="range" min={15} max={200} step={5} value={hourlyCost}
              onChange={(e) => setHourlyCost(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>$15/hr</span>
              <span className="text-accent-blue font-medium text-sm">${hourlyCost}/hr</span>
              <span>$200/hr</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Current Error/Rework Rate (%)</label>
            <input
              type="range" min={1} max={30} value={errorRate}
              onChange={(e) => setErrorRate(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>1%</span>
              <span className="text-accent-blue font-medium text-sm">{errorRate}%</span>
              <span>30%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Estimated AI Automation (%)</label>
            <input
              type="range" min={10} max={90} step={5} value={automationPercent}
              onChange={(e) => setAutomationPercent(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>10%</span>
              <span className="text-accent-blue font-medium text-sm">{automationPercent}%</span>
              <span>90%</span>
            </div>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full sm:w-auto px-8 py-3 font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 transition-all duration-300 cursor-pointer"
        >
          Calculate ROI
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Your AI ROI Projection</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 text-center">
              <p className="text-3xl font-bold text-green-400">{results.roi}%</p>
              <p className="text-sm text-text-secondary mt-1">Annual ROI</p>
            </div>
            <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-5 text-center">
              <p className="text-3xl font-bold text-accent-blue">${results.netSavings.toLocaleString()}</p>
              <p className="text-sm text-text-secondary mt-1">Net Annual Savings</p>
            </div>
            <div className="rounded-xl border border-accent-purple/20 bg-accent-purple/5 p-5 text-center">
              <p className="text-3xl font-bold text-accent-purple">{results.paybackDays}</p>
              <p className="text-sm text-text-secondary mt-1">Days to Payback</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
            <h3 className="font-semibold text-text-primary mb-4">Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Annual hours saved</span>
                <span className="text-text-primary font-medium">{results.annualTimeSaved.toLocaleString()} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Labor cost savings</span>
                <span className="text-green-400 font-medium">+${results.annualCostSaved.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Error reduction savings</span>
                <span className="text-green-400 font-medium">+${results.errorReduction.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/[0.05] my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">ShipSquad cost (annual)</span>
                <span className="text-red-400 font-medium">-${results.aiCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/[0.05] my-2" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-text-primary">Net annual savings</span>
                <span className="text-green-400">${results.netSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="/#waitlist" className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
              Start Saving with ShipSquad — $99/mo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
