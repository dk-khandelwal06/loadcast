import React from "react";
import { getEvaluationMetrics } from "@/lib/data-service";
import { ActualVsPredictedChart } from "@/components/charts/ActualVsPredictedChart";
import { ResidualDistributionChart } from "@/components/charts/ResidualDistributionChart";
import { ErrorOverTimeChart } from "@/components/charts/ErrorOverTimeChart";
import { 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Layers,
  Scale
} from "lucide-react";

export const metadata = {
  title: "Forecast Evaluation | LOADCAST",
  description: "Honest empirical evaluation comparing Ridge Regression against the Naive Persistence baseline on chronological holdout data.",
};

export default function ForecastEvaluationPage() {
  const evalMetrics = getEvaluationMetrics();
  const metrics = evalMetrics.metrics;
  const ridge = metrics.ridge;
  const naive = metrics.naive;
  const comp = metrics.comparison;
  const covid = evalMetrics.covid_sensitivity;

  const errorPoints = evalMetrics.holdout_predictions.map((p) => ({
    date: p.date,
    residual: p.residual,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
            Forecast Evaluation & Benchmarks
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Rigorous out-of-sample holdout benchmarking comparing L2-regularized Ridge Regression against the naive persistence baseline.
        </p>
      </div>

      {/* Chronological Split Summary Bar */}
      <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>
            <strong>Train Period:</strong> {evalMetrics.train_range.start} &rarr; {evalMetrics.train_range.end} ({evalMetrics.train_range.count} days / {evalMetrics.train_range.percentage}%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <strong>Holdout Test Period:</strong> {evalMetrics.test_range.start} &rarr; {evalMetrics.test_range.end} ({evalMetrics.test_range.count} days / {evalMetrics.test_range.percentage}%)
          </span>
        </div>
      </div>

      {/* Primary Benchmark Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* RMSE Comparison Card */}
        <div className="p-6 rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-neutral-500">Root Mean Squared Error (RMSE)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              +{comp.rmse_improvement_pct}% Better
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <div>
              <span className="text-xs text-neutral-500 font-mono">Ridge Model</span>
              <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {ridge.rmse} <span className="text-xs font-normal text-neutral-500">MU</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 font-mono">Naive Baseline</span>
              <div className="text-2xl font-bold font-mono text-neutral-400 dark:text-neutral-500">
                {naive.rmse} <span className="text-xs font-normal">MU</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-border-light dark:border-border-dark pt-2">
            Penalizes large outlier forecast errors heavily. Ridge achieves a 1.08 MU error reduction over persistence.
          </p>
        </div>

        {/* MAE Comparison Card */}
        <div className="p-6 rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-neutral-500">Mean Absolute Error (MAE)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              +{comp.mae_improvement_pct}% Better
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <div>
              <span className="text-xs text-neutral-500 font-mono">Ridge Model</span>
              <div className="text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
                {ridge.mae} <span className="text-xs font-normal text-neutral-500">MU</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 font-mono">Naive Baseline</span>
              <div className="text-2xl font-bold font-mono text-neutral-400 dark:text-neutral-500">
                {naive.mae} <span className="text-xs font-normal">MU</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-border-light dark:border-border-dark pt-2">
            Average absolute deviation per day. On average, Ridge predictions are within ~11.25 MU of actual consumption.
          </p>
        </div>

        {/* MAPE Comparison Card */}
        <div className="p-6 rounded-xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-neutral-500">Mean Abs % Error (MAPE)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              +{comp.mape_improvement_pct}% Better
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <div>
              <span className="text-xs text-neutral-500 font-mono">Ridge Model</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {ridge.mape}%
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 font-mono">Naive Baseline</span>
              <div className="text-2xl font-bold font-mono text-neutral-400 dark:text-neutral-500">
                {naive.mape}%
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-border-light dark:border-border-dark pt-2">
            Relative error percentage across holdout. Excludes risk of division by zero as Rajasthan demand never reaches zero (min = 105.8 MU).
          </p>
        </div>

      </div>

      {/* Actual vs Predicted Holdout Chart */}
      <section className="space-y-4">
        <ActualVsPredictedChart data={evalMetrics.holdout_predictions} />
      </section>

      {/* Residual Diagnostics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResidualDistributionChart data={evalMetrics.residual_distribution} />
        <ErrorOverTimeChart data={errorPoints} />
      </div>

      {/* COVID-19 Lockdown Sensitivity Analysis */}
      <div className="p-6 sm:p-8 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-surface-light dark:bg-surface-dark shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
            COVID-19 Lockdown Sensitivity Analysis (Structural Break)
          </h3>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The chronological test period (Feb 29 – Dec 5, 2020) directly intersected the unprecedented nationwide COVID-19 lockdown (March 25 – May 31, 2020). Here is the empirical breakdown of model performance during vs outside the lockdown shock:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-2">
            <div className="font-bold text-red-900 dark:text-red-300 flex items-center justify-between">
              <span>During Lockdown (Mar 25 – May 31)</span>
              <span>{covid.lockdown_points_in_test} test days</span>
            </div>
            {covid.lockdown_metrics_ridge && (
              <div className="grid grid-cols-3 gap-2 pt-1 text-neutral-800 dark:text-neutral-200">
                <div>
                  <span className="text-[10px] text-neutral-500 block">RMSE</span>
                  <strong>{covid.lockdown_metrics_ridge.rmse} MU</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">MAE</span>
                  <strong>{covid.lockdown_metrics_ridge.mae} MU</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">MAPE</span>
                  <strong>{covid.lockdown_metrics_ridge.mape}%</strong>
                </div>
              </div>
            )}
            <p className="text-[10px] text-neutral-500">
              Higher variance caused by sudden industrial shutdown and stay-at-home consumption shifts.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <span>Normal Grid Periods (Pre & Post Lockdown)</span>
              <span>{evalMetrics.test_range.count - covid.lockdown_points_in_test} test days</span>
            </div>
            {covid.non_lockdown_metrics_ridge && (
              <div className="grid grid-cols-3 gap-2 pt-1 text-neutral-800 dark:text-neutral-200">
                <div>
                  <span className="text-[10px] text-neutral-500 block">RMSE</span>
                  <strong>{covid.non_lockdown_metrics_ridge.rmse} MU</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">MAE</span>
                  <strong>{covid.non_lockdown_metrics_ridge.mae} MU</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">MAPE</span>
                  <strong>{covid.non_lockdown_metrics_ridge.mape}%</strong>
                </div>
              </div>
            )}
            <p className="text-[10px] text-neutral-500">
              During regular operation, the Ridge model achieves improved tracking accuracy (~10.5 MU MAE).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
