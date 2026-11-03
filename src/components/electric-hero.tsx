"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, ShieldAlert, Cpu, BarChart3 } from "lucide-react";
import { useAudio } from "@/lib/audio-context";

interface ElectricHeroProps {
  latestDemand: number;
  latestDate: string;
  nextDayPrediction: number;
  nextDayDate: string;
  ridgeRMSE: number;
  beatsBaseline: boolean;
}

export function ElectricHero({
  latestDemand,
  latestDate,
  nextDayPrediction,
  nextDayDate,
  ridgeRMSE,
  beatsBaseline
}: ElectricHeroProps) {
  const { playSparkSound } = useAudio();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-border-light dark:border-border-dark bg-gradient-to-b from-bg-light via-surface-light-alt to-bg-light dark:from-bg-dark dark:via-surface-dark-alt dark:to-bg-dark">
      {/* Background Animated Power Grid Lines SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-neutral-400 dark:text-neutral-600" />
            </pattern>
            <linearGradient id="transmissionGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          {/* Animated Electrical High Voltage Lines */}
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#transmissionGlow)" strokeWidth="1.5" strokeDasharray="8 6" className="animate-flow-line" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#transmissionGlow)" strokeWidth="2" strokeDasharray="12 8" className="animate-flow-line" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="url(#transmissionGlow)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-flow-line" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand, Headline, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Rajasthan Grid Modeling &bull; 498 Historical Days</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              Teaching a regression model to see tomorrow’s{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-400">
                electricity demand
              </span>{" "}
              using yesterday’s patterns.
            </h1>

            {/* Short Project Explanation */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
              LoadCast explores time-series feature engineering and L2-regularized Ridge Regression to predict next-day state-level power consumption. 
              Grounded in genuine historical grid records, temporal holdout splits, and transparent error benchmarks.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                onClick={playSparkSound}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-amber-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <span>Explore Energy Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/model-intelligence"
                onClick={playSparkSound}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-neutral-800 dark:text-neutral-200 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>Understand the Model</span>
              </Link>
            </div>

            {/* Historical Disclaimer Banner */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-xs text-neutral-600 dark:text-neutral-400">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                <strong>HISTORICAL DATA — NOT LIVE GRID TELEMETRY:</strong> Sourced from official POSOCO energy reports covering 2019 to 2020.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Live Telemetry / Forecast Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-xl space-y-6">
              
              {/* Card Header with Glowing Electricity Indicator */}
              <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Forecast Synthesis Node
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                  State: Rajasthan
                </span>
              </div>

              {/* Main Demand Telemetry Comparison */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Last Historical Day Recorded */}
                <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark">
                  <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Last Recorded ({latestDate})
                  </div>
                  <div className="mt-2 text-2xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                    {latestDemand.toFixed(1)} <span className="text-xs font-normal text-neutral-500">MU</span>
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-500">
                    Historical Ground Truth
                  </div>
                </div>

                {/* Model Next-Day Forecast */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider font-semibold">
                    Next-Day Forecast ({nextDayDate})
                  </div>
                  <div className="mt-2 text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                    {nextDayPrediction.toFixed(1)} <span className="text-xs font-normal text-amber-700 dark:text-amber-300">MU</span>
                  </div>
                  <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    Ridge Regression (L2)
                  </div>
                </div>
              </div>

              {/* Pipeline Step Flow Diagram */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  ML Pipeline Flow
                </div>
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] sm:text-[10px]">
                  <div className="p-1.5 rounded bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-neutral-700 dark:text-neutral-300">
                    RAW DATA
                  </div>
                  <div className="p-1.5 rounded bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-neutral-700 dark:text-neutral-300">
                    LAGS 1, 7
                  </div>
                  <div className="p-1.5 rounded bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-neutral-700 dark:text-neutral-300">
                    ROLLING 7
                  </div>
                  <div className="p-1.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold">
                    RIDGE L2
                  </div>
                  <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold">
                    PREDICT
                  </div>
                </div>
              </div>

              {/* Bottom Quick Benchmark */}
              <div className="border-t border-border-light dark:border-border-dark pt-4 flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <span>Holdout RMSE: <strong className="text-neutral-900 dark:text-neutral-100">{ridgeRMSE.toFixed(2)} MU</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {beatsBaseline ? "✓ Outperforms Naive Persistence" : "Evaluated vs Baseline"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
