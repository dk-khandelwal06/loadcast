"use client";

import React, { useState } from "react";
import { 
  getModelArtifact, 
  getHistoricalData, 
  getEvaluationMetrics, 
  getNextDayForecast, 
  getForecastForHistoricalDate 
} from "@/lib/data-service";
import { predictElectricityDemand, FeatureInput, ForecastResult } from "@/lib/ml-engine";
import { ActualVsPredictedChart } from "@/components/charts/ActualVsPredictedChart";
import { 
  TrendingUp, 
  Zap, 
  Calendar, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { useAudio } from "@/lib/audio-context";

export default function ForecastCentrePage() {
  const artifact = getModelArtifact();
  const historical = getHistoricalData();
  const evalMetrics = getEvaluationMetrics();
  const { playSparkSound } = useAudio();

  // Mode: "next-day" | "backtest" | "simulator"
  const [activeMode, setActiveMode] = useState<"next-day" | "backtest" | "simulator">("next-day");
  
  // Selected date for backtest mode
  const [backtestDate, setBacktestDate] = useState<string>("2020-05-15");

  // State selection
  const [selectedState, setSelectedState] = useState<string>("Rajasthan");

  // Custom Simulator state
  const seedFeatures = artifact.next_day_inference_seed.seed_features;
  const [simFeatures, setSimFeatures] = useState<FeatureInput>({
    lag_1: seedFeatures.lag_1,
    lag_7: seedFeatures.lag_7,
    rolling_mean_7: seedFeatures.rolling_mean_7,
    day_of_week: seedFeatures.day_of_week,
    month: seedFeatures.month,
    is_weekend: seedFeatures.is_weekend
  });

  // Calculate current active forecast result
  let currentForecast: ForecastResult;
  if (activeMode === "next-day") {
    currentForecast = getNextDayForecast();
  } else if (activeMode === "backtest") {
    const res = getForecastForHistoricalDate(backtestDate);
    currentForecast = res || getNextDayForecast();
  } else {
    // Simulator mode
    currentForecast = predictElectricityDemand(
      artifact.deployment_model,
      simFeatures,
      "What-If Scenario",
      artifact.version
    );
  }

  // Available backtest dates (skip first 7 days for lags)
  const validDates = historical.daily.slice(7).map(d => d.date);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
            Interactive Forecast Centre
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Compute next-day electricity demand projections using fitted Ridge Regression (L2) coefficients and strictly pre-shifted temporal features.
        </p>
      </div>

      {/* Top Configuration & Mode Switcher Bar */}
      <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-xs font-mono">
          <button
            onClick={() => {
              setActiveMode("next-day");
              playSparkSound();
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeMode === "next-day"
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            PRODUCTION NEXT-DAY
          </button>
          <button
            onClick={() => {
              setActiveMode("backtest");
              playSparkSound();
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeMode === "backtest"
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            HISTORICAL BACKTEST
          </button>
          <button
            onClick={() => {
              setActiveMode("simulator");
              playSparkSound();
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeMode === "simulator"
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            WHAT-IF SIMULATOR
          </button>
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-500">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-amber-500"
          >
            <option value="Rajasthan">Rajasthan (Fitted Ridge Model)</option>
            <option value="Punjab" disabled>Punjab (Telemetry Only)</option>
            <option value="Haryana" disabled>Haryana (Telemetry Only)</option>
            <option value="Delhi" disabled>Delhi (Telemetry Only)</option>
            <option value="Maharashtra" disabled>Maharashtra (Telemetry Only)</option>
          </select>
        </div>
      </div>

      {/* Mode Specific Controls */}
      {activeMode === "backtest" && (
        <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-800/80 bg-sky-50/50 dark:bg-sky-950/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-sky-900 dark:text-sky-200">
            <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Select any verified historical observation date to evaluate step-ahead backtesting:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-sky-900 dark:text-sky-200 font-semibold">Test Date:</label>
            <select
              value={backtestDate}
              onChange={(e) => {
                setBacktestDate(e.target.value);
                playSparkSound();
              }}
              className="px-3 py-1.5 rounded-lg border border-sky-300 dark:border-sky-700 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-800 dark:text-neutral-200"
            >
              {validDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeMode === "simulator" && (
        <div className="p-5 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-surface-light dark:bg-surface-dark space-y-4">
          <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Live Parameter Stress Tester
              </h3>
            </div>
            <button
              onClick={() => {
                setSimFeatures({
                  lag_1: seedFeatures.lag_1,
                  lag_7: seedFeatures.lag_7,
                  rolling_mean_7: seedFeatures.rolling_mean_7,
                  day_of_week: seedFeatures.day_of_week,
                  month: seedFeatures.month,
                  is_weekend: seedFeatures.is_weekend
                });
                playSparkSound();
              }}
              className="flex items-center gap-1 text-xs font-mono text-amber-600 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Actual Seed
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-neutral-500 block mb-1">
                Yesterday Demand (lag_1): {simFeatures.lag_1} MU
              </label>
              <input
                type="range"
                min="100"
                max="320"
                step="0.5"
                value={simFeatures.lag_1}
                onChange={(e) => setSimFeatures({ ...simFeatures, lag_1: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 block mb-1">
                Same Day Last Week (lag_7): {simFeatures.lag_7} MU
              </label>
              <input
                type="range"
                min="100"
                max="320"
                step="0.5"
                value={simFeatures.lag_7}
                onChange={(e) => setSimFeatures({ ...simFeatures, lag_7: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 block mb-1">
                Prior 7-Day Rolling Mean: {simFeatures.rolling_mean_7} MU
              </label>
              <input
                type="range"
                min="100"
                max="320"
                step="0.5"
                value={simFeatures.rolling_mean_7}
                onChange={(e) => setSimFeatures({ ...simFeatures, rolling_mean_7: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 block mb-1">
                Day of Week: {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][simFeatures.day_of_week]}
              </label>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={simFeatures.day_of_week}
                onChange={(e) => {
                  const dow = parseInt(e.target.value, 10);
                  setSimFeatures({ ...simFeatures, day_of_week: dow, is_weekend: dow >= 5 ? 1 : 0 });
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 block mb-1">
                Month: {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][simFeatures.month - 1]}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={simFeatures.month}
                onChange={(e) => setSimFeatures({ ...simFeatures, month: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="text-xs font-mono text-neutral-700 dark:text-neutral-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simFeatures.is_weekend === 1}
                  onChange={(e) => setSimFeatures({ ...simFeatures, is_weekend: e.target.checked ? 1 : 0 })}
                  className="rounded text-amber-600 accent-amber-600 w-4 h-4"
                />
                Is Weekend Indicator
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Forecast Results Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-amber-400/80 dark:border-amber-600/80 bg-surface-light dark:bg-surface-dark shadow-lg relative overflow-hidden space-y-6">
        
        {/* Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-sky-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
                {activeMode === "next-day" ? "Production Next-Day Prediction" : activeMode === "backtest" ? "Historical Day-Ahead Evaluation" : "What-If Scenario Simulation"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans mt-1">
              Target Date: <span className="text-amber-600 dark:text-amber-400">{currentForecast.targetDate}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold">
              Ridge (α=1.0)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-neutral-600 dark:text-neutral-400">
              State: Rajasthan
            </span>
          </div>
        </div>

        {/* Prediction Figures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <span className="text-xs uppercase text-amber-700 dark:text-amber-400 font-semibold">Predicted Demand</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">
              {currentForecast.predictedDemandMU.toFixed(1)} <span className="text-xs font-normal">MU</span>
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-300">
              Ridge L2 Inferred Output
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-1">
            <span className="text-xs uppercase text-neutral-500">Yesterday Baseline (Lag-1)</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
              {currentForecast.baselineDemandMU.toFixed(1)} <span className="text-xs font-normal text-neutral-500">MU</span>
            </div>
            <div className="text-[11px] text-neutral-500">
              Naive Persistence Benchmark
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-1">
            <span className="text-xs uppercase text-neutral-500">Model vs. Yesterday Delta</span>
            <div className={`text-3xl sm:text-4xl font-extrabold flex items-center gap-1 ${
              currentForecast.deltaFromBaselineMU >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-sky-600 dark:text-sky-400"
            }`}>
              {currentForecast.deltaFromBaselineMU >= 0 ? "+" : ""}{currentForecast.deltaFromBaselineMU.toFixed(1)}
              <span className="text-xs font-normal text-neutral-500">MU</span>
            </div>
            <div className="text-[11px] text-neutral-500">
              {currentForecast.deltaPercentage >= 0 ? "+" : ""}{currentForecast.deltaPercentage.toFixed(2)}% expected shift
            </div>
          </div>

          {currentForecast.actualDemandMU !== undefined ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <span className="text-xs uppercase text-emerald-700 dark:text-emerald-400 font-semibold">Actual Recorded Demand</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentForecast.actualDemandMU.toFixed(1)} <span className="text-xs font-normal">MU</span>
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Residual: {currentForecast.residualMU! > 0 ? "+" : ""}{currentForecast.residualMU} MU
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark space-y-1">
              <span className="text-xs uppercase text-neutral-500">Target Freshness</span>
              <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                {artifact.next_day_inference_seed.target_forecast_date}
              </div>
              <div className="text-[11px] text-neutral-500">
                Zero forward-looking leakage
              </div>
            </div>
          )}

        </div>

        {/* Feature Contribution Waterfall Breakdown */}
        <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Feature Influence Waterfall (Standardized Coefficients &times; Feature z-Scores)
              </h3>
              <p className="text-xs text-neutral-500">
                How each engineered feature pushes the base model intercept ({currentForecast.intercept} MU) up or down.
              </p>
            </div>
            <div className="text-xs font-mono text-neutral-500">
              Base Intercept: <strong className="text-neutral-800 dark:text-neutral-200">{currentForecast.intercept} MU</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentForecast.contributions.map((c) => {
              const isPositive = c.impactMU >= 0;
              return (
                <div
                  key={c.feature}
                  className="p-3.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {c.label}
                    </span>
                    <span className={`font-mono font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-sky-600 dark:text-sky-400"}`}>
                      {isPositive ? "+" : ""}{c.impactMU.toFixed(2)} MU
                    </span>
                  </div>

                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPositive ? "bg-emerald-500" : "bg-sky-500"}`}
                      style={{ width: `${Math.min(100, c.percentageImpact * 1.5)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>Raw: {c.rawValue} (z: {c.standardizedValue})</span>
                    <span>Coef: {c.coefficient}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Historical Holdout Chart Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
              Model Holdout Performance Track Record
            </h3>
            <p className="text-xs text-neutral-500">
              Chronological backtest across the holdout split demonstrating regularized tracking vs actual consumption.
            </p>
          </div>
        </div>
        <ActualVsPredictedChart data={evalMetrics.holdout_predictions} />
      </section>

    </div>
  );
}
