import React from "react";
import { getHistoricalData } from "@/lib/data-service";
import { KPICard } from "@/components/kpi-card";
import { DailyDemandChart } from "@/components/charts/DailyDemandChart";
import { WeeklyDemandChart } from "@/components/charts/WeeklyDemandChart";
import { MonthlySeasonalityChart } from "@/components/charts/MonthlySeasonalityChart";
import { DayOfWeekChart } from "@/components/charts/DayOfWeekChart";
import { DemandDistributionChart } from "@/components/charts/DemandDistributionChart";
import { 
  Activity, 
  TrendingUp, 
  Calendar, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  Layers 
} from "lucide-react";

export const metadata = {
  title: "Energy Dashboard | LOADCAST",
  description: "Comprehensive electricity demand analytics for Rajasthan based on genuine historical POSOCO records.",
};

export default function DashboardPage() {
  const historical = getHistoricalData();
  const kpis = historical.kpis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Prominent Ground Truth Notice */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
                Rajasthan Energy Analytics Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Time-series electricity consumption telemetry from 2019 to 2020 (498 clean daily observations)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-neutral-600 dark:text-neutral-300">
              Coverage: {historical.date_range.start} to {historical.date_range.end}
            </span>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/40 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p>
            <strong>HISTORICAL DATA — NOT LIVE GRID TELEMETRY:</strong> All metrics displayed originate from the verified POSOCO power consumption dataset. Date range spans Jan 2, 2019 through Dec 5, 2020.
          </p>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Latest Demand"
          value={kpis.latest_demand.toFixed(1)}
          unit="MU"
          subtitle={`Recorded on ${kpis.latest_date}`}
          icon={Zap}
          highlight={true}
        />
        <KPICard
          title="Average Demand"
          value={kpis.average_demand.toFixed(1)}
          unit="MU"
          subtitle="498-day historical mean"
          icon={Activity}
        />
        <KPICard
          title="Peak Demand"
          value={kpis.peak_demand.toFixed(1)}
          unit="MU"
          subtitle={`Recorded on ${kpis.peak_date}`}
          icon={ArrowUpRight}
        />
        <KPICard
          title="Lowest Demand"
          value={kpis.lowest_demand.toFixed(1)}
          unit="MU"
          subtitle={`Recorded on ${kpis.lowest_date}`}
          icon={ArrowDownRight}
        />
        <KPICard
          title="Week-over-Week"
          value={`${kpis.week_over_week_change_pct > 0 ? "+" : ""}${kpis.week_over_week_change_pct.toFixed(1)}%`}
          subtitle="vs. 7 days prior"
          trend={{ value: kpis.week_over_week_change_pct, isPositiveGood: true }}
          icon={TrendingUp}
        />
        <KPICard
          title="Dataset Freshness"
          value={kpis.latest_date}
          subtitle="Latest verified read"
          icon={Calendar}
        />
      </div>

      {/* Main Daily Demand Chart */}
      <section className="space-y-4">
        <DailyDemandChart data={historical.daily} showCovidLockdown={true} />
      </section>

      {/* Aggregated Analytics: Weekly & Monthly Seasonality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyDemandChart data={historical.weekly} />
        <MonthlySeasonalityChart data={historical.monthly} />
      </div>

      {/* Cyclical Analytics: Day of Week & Demand Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DayOfWeekChart data={historical.day_of_week} />
        <DemandDistributionChart data={historical.distribution} />
      </div>

      {/* COVID-19 Structural Break & Grid Insights Callout */}
      <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
            Key Grid Dynamics & Structural Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <div>
            <strong className="text-neutral-800 dark:text-neutral-200 block mb-1">
              COVID-19 Lockdown Shock (Mar–May 2020)
            </strong>
            On March 25, 2020, India instituted a strict nationwide lockdown. Industrial and commercial demand dropped drastically, plunging Rajasthan demand from ~230 MU down to 105.8 MU (recorded lowest day), representing an unprecedented structural break.
          </div>
          <div>
            <strong className="text-neutral-800 dark:text-neutral-200 block mb-1">
              Agricultural Monsoon Seasonality
            </strong>
            Rajasthan experiences peak electricity consumption during July, August, and October (~240–270 MU) driven by tube-well irrigation pump loads for Kharif crops and intense summer heatwave cooling requirements.
          </div>
          <div>
            <strong className="text-neutral-800 dark:text-neutral-200 block mb-1">
              Weekly Cyclical Stability
            </strong>
            Unlike heavily industrial states where Sunday demand drops steeply, Rajasthan maintains relatively uniform daily consumption (~218 MU) due to continuous domestic refrigeration and uninterrupted agrarian pump cycles.
          </div>
        </div>
      </div>

    </div>
  );
}

