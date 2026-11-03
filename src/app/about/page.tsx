import React from "react";
import Link from "next/link";
import { 
  Zap, 
  BookOpen, 
  Target, 
  Users, 
  Code2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Github,
  Layers,
  Sparkles
} from "lucide-react";

export const metadata = {
  title: "About LoadCast | Energy Intelligence & ML Forecasting",
  description: "Mission, methodology, tech stack, and educational goals of the LoadCast electricity demand forecasting project.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>About The LoadCast Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
          Teaching a regression model to see tomorrow’s electricity demand using yesterday’s patterns.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          LoadCast is an open-source energy intelligence and day-ahead electricity demand forecasting platform. 
          It demonstrates how time-series feature engineering and L2-regularized Ridge Regression forecast state-level power consumption in India.
        </p>
      </div>

      {/* Target Audience & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              Our Core Purpose
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Machine learning education often skips the subtle complexities of time-series data: autocorrelation, data leakage, lookahead bias, and non-stationary structural shocks.
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            LoadCast was designed to be an honest, mathematically transparent, and genuinely functional case study. 
            By avoiding complex black-box neural networks, we show how a well-regularized linear model with thoughtful feature engineering outperforms naive persistence heuristics on real grid data.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              Designed For
            </h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Energy Analysts:</strong> Exploring day-ahead grid variance and renewable ramp requirements.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Data Science Students:</strong> Learning leakage-free feature engineering and chronological validation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Climate-Tech Enthusiasts:</strong> Understanding how predictive intelligence enables clean grid transitions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Grid Researchers:</strong> Investigating the impact of macroeconomic shocks like COVID-19 on electricity load.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Tech Stack Details */}
      <div className="p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans">
            Full-Stack Technology Architecture
          </h2>
          <p className="text-xs text-neutral-500">
            Modular architecture designed for reproducible offline Python training and sub-millisecond edge deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              Frontend & UI
            </div>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>&bull; Next.js 14 (App Router)</li>
              <li>&bull; React 18 & TypeScript</li>
              <li>&bull; Tailwind CSS (Design System)</li>
              <li>&bull; Recharts Data Visualizations</li>
              <li>&bull; Web Audio API Synthesizer</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              Machine Learning Engine
            </div>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>&bull; Python 3.13 ML Pipeline</li>
              <li>&bull; Scikit-Learn Ridge Regression</li>
              <li>&bull; StandardScaler Preprocessing</li>
              <li>&bull; Pure TypeScript Inference Engine</li>
              <li>&bull; Automated Unit Test Suite</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              Deployment & Security
            </div>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>&bull; Ready for Vercel Edge</li>
              <li>&bull; Zero Python Process Overhead</li>
              <li>&bull; In-Memory Rate Limiting</li>
              <li>&bull; Zero Committed Secrets / Keys</li>
              <li>&bull; Safe CSP Security Headers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt space-y-3">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
          Operational Disclaimer
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          LoadCast is an educational and academic project demonstrating statistical time-series forecasting principles. 
          Its forecasts are experimental regression estimates and are not intended for physical utility grid balancing, 
          merit order dispatch, or safety-critical operations.
        </p>
      </div>

    </div>
  );
}

