import React from "react";
import Link from "next/link";
import { 
  getHistoricalData, 
  getEvaluationMetrics, 
  getNextDayForecast 
} from "@/lib/data-service";
import { ElectricHero } from "@/components/electric-hero";
import { PowerGridCanvas } from "@/components/power-grid-canvas";
import { DailyDemandChart } from "@/components/charts/DailyDemandChart";
import { ActualVsPredictedChart } from "@/components/charts/ActualVsPredictedChart";
import { 
  ArrowRight, 
  Cpu, 
  Layers, 
  GitBranch, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Zap, 
  Database,
  BarChart2
} from "lucide-react";

export default function HomePage() {
  const historical = getHistoricalData();
  const evalMetrics = getEvaluationMetrics();
  const nextDay = getNextDayForecast();

  const kpis = historical.kpis;
  const metrics = evalMetrics.metrics;

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Electric Transmission Hero */}
      <ElectricHero
        latestDemand={kpis.latest_demand}
        latestDate={kpis.latest_date}
        nextDayPrediction={nextDay.predictedDemandMU}
        nextDayDate={nextDay.targetDate}
        ridgeRMSE={metrics.ridge.rmse}
        beatsBaseline={metrics.comparison.beats_baseline}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">
        
        {/* 2. Project Introduction & Key Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
              The LoadCast Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans">
              Rigorous Time-Series Intelligence Without Data Leakage
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Forecasting electricity grid demand requires respecting chronological causality. LoadCast implements strict temporal lag features, rolling past-window statistics, and regularized linear regression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                1. Genuine POSOCO Data
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Derived directly from India&apos;s National Load Despatch Centre reports. Covers daily consumption across 33 states with explicit handling of structural breaks.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                2. Leakage-Free Lag Engineering
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Prior-day demand (lag-1), weekly periodicity (lag-7), and 7-day rolling statistics computed strictly using observations available prior to the forecast day.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                3. Honest Baseline Benchmarking
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We evaluate on an 80/20 chronological holdout split against a naive persistence baseline (y&#770;&#8348; = y&#8348;&#8331;&#8321;), reporting exact RMSE, MAE, and MAPE gains.
              </p>
            </div>
          </div>
        </section>

        {/* 3. The 5-Step Forecasting Pipeline Flow */}
        <section className="p-6 sm:p-8 rounded-2xl border border-border-strong dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Transparent Pipeline
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans mt-0.5">
                From Raw Readings to Tomorrow&apos;s Forecast
              </h3>
            </div>
            <Link
              href="/model-intelligence"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Inspect Mathematical Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Historical Ingestion",
                desc: "POSOCO daily state-wise records (Jan 2019 – May 2020), cleaned of duplicate reads.",
                badge: "498 Days"
              },
              {
                step: "02",
                title: "Lag Engineering",
                desc: "Lag-1, Lag-7, and 7-day rolling mean strictly shifted to prevent future leakage.",
                badge: "6 Features"
              },
              {
                step: "03",
                title: "Temporal Holdout",
                desc: "First 80% train, final 20% test. Chronological order strictly preserved.",
                badge: "80 / 20 Split"
              },
              {
                step: "04",
                title: "Ridge L2 Training",
                desc: "StandardScaler fitted on train only; L2-regularized Ridge regression (α=1.0).",
                badge: "RMSE 18.28"
              },
              {
                step: "05",
                title: "Next-Day Inference",
                desc: "Exported JSON parameters computed in pure TypeScript with zero lag.",
                badge: "Exact Math"
              }
            ].map((st) => (
              <div
                key={st.step}
                className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {st.step}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-neutral-600 dark:text-neutral-300">
                    {st.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {st.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Interactive Power Grid Canvas */}
        <section className="space-y-4">
          <PowerGridCanvas />
        </section>

        {/* 5. Historical Demand Preview Chart */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Telemetry Preview
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans">
                Rajasthan Historical Demand Curve
              </h3>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>View Full Analytics Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DailyDemandChart data={historical.daily} showCovidLockdown={true} />
        </section>

        {/* 6. Model Evaluation Benchmark Summary */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Holdout Validation
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans">
                Ridge Regression vs. Naive Persistence Baseline
              </h3>
            </div>
            <Link
              href="/evaluation"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Detailed Evaluation Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase">Ridge RMSE</span>
              <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {metrics.ridge.rmse} <span className="text-xs font-normal text-neutral-500">MU</span>
              </div>
              <div className="text-xs text-neutral-500">
                Baseline RMSE: {metrics.naive.rmse} MU ({metrics.comparison.rmse_improvement_pct}% gain)
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase">Ridge MAE</span>
              <div className="text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
                {metrics.ridge.mae} <span className="text-xs font-normal text-neutral-500">MU</span>
              </div>
              <div className="text-xs text-neutral-500">
                Baseline MAE: {metrics.naive.mae} MU ({metrics.comparison.mae_improvement_pct}% gain)
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase">Ridge MAPE</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {metrics.ridge.mape}%
              </div>
              <div className="text-xs text-neutral-500">
                Mean Absolute Percentage Error on test observations
              </div>
            </div>
          </div>

          <ActualVsPredictedChart data={evalMetrics.holdout_predictions.slice(-60)} />
        </section>

        {/* 7. Why Forecasting Matters */}
        <section className="p-8 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-500/10 via-surface-light to-surface-light dark:from-amber-950/20 dark:via-surface-dark dark:to-surface-dark shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              Why Day-Ahead Electricity Demand Forecasting Matters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <div>
              <strong className="text-neutral-900 dark:text-neutral-200 block mb-1">
                Thermal Unit Commitment
              </strong>
              Coal and gas generators require 6 to 18 hours of notice to fire up boilers. Accurate day-ahead forecasts prevent expensive spinning reserve waste and blackouts.
            </div>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-200 block mb-1">
                Renewable Solar Integration
              </strong>
              With Rajasthan hosting massive solar parks (Bhadla), grid dispatchers need dependable demand projections to balance variable solar generation during sunset ramps.
            </div>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-200 block mb-1">
                Market Balancing & Merit Order
              </strong>
              State utilities purchase marginal power from power exchanges. Accurate forecasting saves crores of rupees by avoiding penalty rates on deviation settlement mechanisms (DSM).
            </div>
          </div>
        </section>

        {/* 8. Tech Stack */}
        <section className="border-t border-border-light dark:border-border-dark pt-12 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-sans">
              Production-Grade Machine Learning & Web Architecture
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Built for reproducible training in Python and zero-dependency execution in Vercel serverless functions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center font-mono text-xs">
            <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">Next.js 14</div>
              <div className="text-[10px] text-neutral-500">App Router</div>
            </div>
            <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">TypeScript</div>
              <div className="text-[10px] text-neutral-500">Type-Safe Inference</div>
            </div>
            <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">Python 3</div>
              <div className="text-[10px] text-neutral-500">Scikit-Learn Pipeline</div>
            </div>
            <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">Ridge (L2)</div>
              <div className="text-[10px] text-neutral-500">Regularized Model</div>
            </div>
            <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">Tailwind CSS</div>
              <div className="text-[10px] text-neutral-500">Energy Design System</div>
            </div>
            <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">Vercel</div>
              <div className="text-[10px] text-neutral-500">Global Edge Deploy</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
