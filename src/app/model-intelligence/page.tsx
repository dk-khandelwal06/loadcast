import React from "react";
import { getModelArtifact, getEvaluationMetrics } from "@/lib/data-service";
import { 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  Info
} from "lucide-react";

export const metadata = {
  title: "Model Intelligence | LOADCAST",
  description: "Mathematical formulation, feature engineering, and coefficient breakdown of the LoadCast Ridge Regression pipeline.",
};

export default function ModelIntelligencePage() {
  const artifact = getModelArtifact();
  const evalMetrics = getEvaluationMetrics();
  const deploy = artifact.deployment_model;
  const coefs = deploy.coefficients;
  const scaler = deploy.scaler;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
            Model Intelligence & Mathematical Architecture
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          A transparent examination of the feature transformations, temporal splitting, L2 regularization, and fitted coefficients.
        </p>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="p-6 sm:p-8 rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-6">
        <div className="border-b border-border-light dark:border-border-dark pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            End-to-End Pipeline
          </span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-sans mt-0.5">
            Sequential Dataflow Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600">01. INGESTION</span>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">POSOCO Reports</h3>
            <p className="text-xs text-neutral-500">
              498 daily records for Rajasthan. Cleaned of duplicate reads by daily mean calculation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600">02. FEATURES</span>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Causal Lags</h3>
            <p className="text-xs text-neutral-500">
              Lag-1, Lag-7, and 7-day rolling mean shifted by 1 day so day t is never observed.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600">03. CHRONO SPLIT</span>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">80% Train / 20% Test</h3>
            <p className="text-xs text-neutral-500">
              No random shuffling. Scaler fit on training set only to eliminate test data leakage.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600">04. RIDGE L2</span>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">L2 Regularization</h3>
            <p className="text-xs text-neutral-500">
              Ridge penalty (alpha=1.0) shrinks collinear lag coefficients, preventing variance inflation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">05. INFERENCE</span>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">JSON Artifact</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Pure TypeScript prediction engine identical to Python down to machine precision.
            </p>
          </div>
        </div>
      </div>

      {/* Sections A - D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* A. Problem Formulation */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Section A</span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Problem Formulation: One-Step-Ahead Forecasting
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Let y&#8348; represent the total electricity consumed in Rajasthan on calendar day t (in Mega Units). Our objective is to predict y&#8348;&#8330;&#8321; using only information available up to and including day t:
          </p>
          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt font-mono text-xs text-neutral-800 dark:text-neutral-200 border border-border-light dark:border-border-dark">
            {"ŷ_t+1 = β_0 + ∑_{i=1}^p β_i * ((x_{i,t} - μ_i) / σ_i)"}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The target is state-level daily energy volume. In grid operations, this is essential for day-ahead generation scheduling, fuel logistics, and power exchange bidding.
          </p>
        </div>

        {/* B. Feature Engineering & Strict Leakage Prevention */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Section B</span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Leakage-Free Feature Engineering
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Data leakage is the fatal flaw of amateur time-series projects. In LoadCast, rolling aggregations explicitly shift observations before calculating statistics:
          </p>
          <ul className="space-y-1 text-xs font-mono text-neutral-700 dark:text-neutral-300">
            <li>&bull; <strong>lag_1:</strong> y&#8348;&#8331;&#8321; (Prior day demand)</li>
            <li>&bull; <strong>lag_7:</strong> y&#8348;&#8331;&#8327; (Same day last week demand)</li>
            <li>&bull; <strong>rolling_mean_7:</strong> Mean of prior 7 days (days t-7 through t-1)</li>
            <li>&bull; <strong>day_of_week:</strong> Integer 0..6 (Monday to Sunday)</li>
            <li>&bull; <strong>month:</strong> Integer 1..12 (Annual seasonality)</li>
            <li>&bull; <strong>is_weekend:</strong> Binary 1 if day &ge; 5 else 0</li>
          </ul>
        </div>

        {/* C. Temporal Splitting */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Section C</span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Why Temporal Splitting is Mandatory
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Random k-fold cross-validation or train_test_split(shuffle=True) is completely invalid for time-series. Shuffling leaks future observations into past training sets, artificially inflating metrics.
          </p>
          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt font-mono text-xs text-neutral-800 dark:text-neutral-200 border border-border-light dark:border-border-dark">
            Train Split: {evalMetrics.train_range.start} &rarr; {evalMetrics.train_range.end} ({evalMetrics.train_range.count} obs)<br />
            Holdout Test: {evalMetrics.test_range.start} &rarr; {evalMetrics.test_range.end} ({evalMetrics.test_range.count} obs)
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The test period strictly follows the training window chronologically, simulating genuine deployment conditions.
          </p>
        </div>

        {/* D. Baseline Benchmark */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Section D</span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            The Naive Persistence Baseline
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            No machine learning model should be judged in a vacuum. A model that cannot beat a simple heuristic provides negative value. Our primary benchmark is naive persistence:
          </p>
          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt font-mono text-xs text-neutral-800 dark:text-neutral-200 border border-border-light dark:border-border-dark">
            {"ŷ_t^{naive} = y_{t-1} = lag_1"}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            In power systems, yesterday&apos;s demand is a surprisingly formidable baseline because grid loads exhibit high autocorrelation (r &gt; 0.85).
          </p>
        </div>

      </div>

      {/* Section E: Ridge Regression Regularization */}
      <div className="p-6 sm:p-8 rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Section E</span>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-sans">
          Ridge Regression (L2 Regularization) Mathematics
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Because autoregressive features (y&#8348;&#8331;&#8321;, y&#8348;&#8331;&#8327;, rolling mean) are strongly correlated with each other, standard Ordinary Least Squares (OLS) regression suffers from severe multicollinearity, leading to inflated parameter variances and unstable out-of-sample predictions. Ridge Regression introduces an L2 penalty on coefficient magnitudes:
        </p>

        <div className="p-4 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 border border-border-light dark:border-border-dark text-center">
          {"min_β ∑_{i=1}^n (y_i - β_0 - ∑_{j=1}^p β_j x_{ij})^2 + α ∑_{j=1}^p β_j^2"}
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The closed-form analytical solution is given by {"β̂ = (X^T X + α I)^{-1} X^T y"}. By adding {"α I"} to the diagonal, the matrix inversion is always well-conditioned, shrinking coefficients towards zero and stabilizing predictions against transient spikes.
        </p>
      </div>

      {/* Section G: Actual Fitted Coefficients Table */}
      <div className="p-6 sm:p-8 rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-bold">Section G</span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-light dark:border-border-dark pb-3">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              Actual Fitted Model Parameters (Exported v1.0.0 Artifact)
            </h3>
            <p className="text-xs text-neutral-500">
              Trained on all 491 eligible historical observations. Scaler parameters fitted strictly without lookahead bias.
            </p>
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Intercept (&beta;<sub>0</sub>): <strong className="text-amber-600 dark:text-amber-400">{deploy.intercept.toFixed(4)} MU</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark text-neutral-500 uppercase tracking-wider">
                <th className="py-2 px-3">Feature Key</th>
                <th className="py-2 px-3">Semantic Description</th>
                <th className="py-2 px-3 text-right">StandardScaler Mean (&mu;)</th>
                <th className="py-2 px-3 text-right">StandardScaler Scale (&sigma;)</th>
                <th className="py-2 px-3 text-right">Fitted Weight (&beta;)</th>
                <th className="py-2 px-3 text-right">Directional Influence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:border-border-dark">
              {artifact.feature_names.map((feat) => {
                const coef = coefs[feat];
                const mean = scaler.mean[feat];
                const scale = scaler.scale[feat];
                const isPositive = coef >= 0;

                return (
                  <tr key={feat} className="hover:bg-surface-light-alt dark:hover:bg-surface-dark-alt">
                    <td className="py-2.5 px-3 font-bold text-neutral-800 dark:text-neutral-200">{feat}</td>
                    <td className="py-2.5 px-3 text-neutral-500">
                      {feat === "lag_1" && "Immediate persistence from prior day"}
                      {feat === "lag_7" && "Weekly cyclical demand anchor"}
                      {feat === "rolling_mean_7" && "7-day trend mean-reversion dampener"}
                      {feat === "day_of_week" && "Weekday schedule effect"}
                      {feat === "month" && "Monsoon and temperature seasonality"}
                      {feat === "is_weekend" && "Saturday / Sunday operational baseline"}
                    </td>
                    <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-400">{mean.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-400">{scale.toFixed(2)}</td>
                    <td className={`py-2.5 px-3 text-right font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-sky-600 dark:text-sky-400"}`}>
                      {isPositive ? "+" : ""}{coef.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isPositive ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+ Positive Load Push</span>
                      ) : (
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">&minus; Dampening Pull</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section H: Model Limitations */}
      <div className="p-6 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-base text-amber-900 dark:text-amber-200">
            Section H: Real-World Limitations & Model Scope
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
          <div>
            <strong className="block mb-1 font-bold">1. Limited Historical Coverage</strong>
            The publicly available POSOCO series covers ~1.5 years (503 rows). Multiple years of historical data are required to fully model annual multi-year meteorological cycles and long-term economic growth trends.
          </div>
          <div>
            <strong className="block mb-1 font-bold">2. Missing Meteorological Telemetry</strong>
            Ambient temperature, relative humidity, and solar irradiance are primary physical drivers of air conditioning and pump loads. The current model relies purely on date and autoregressive proxies.
          </div>
          <div>
            <strong className="block mb-1 font-bold">3. Structural Break Sensitivity</strong>
            The March 2020 COVID-19 lockdown altered industrial operational baselines. Linear models fit purely on pre-lockdown data face residual spikes during abrupt macroeconomic lockdowns.
          </div>
        </div>
      </div>

    </div>
  );
}
