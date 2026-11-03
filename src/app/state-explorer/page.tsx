import React from "react";
import { getStatesData } from "@/lib/data-service";
import { IndiaMap } from "@/components/india-map";
import { MapPin, Zap, Info, ShieldAlert, BarChart3 } from "lucide-react";

export const metadata = {
  title: "State Explorer | LOADCAST",
  description: "Geographical exploration of state-wise power consumption and model availability across India.",
};

export default function StateExplorerPage() {
  const states = getStatesData();
  const stateList = Object.values(states).sort((a, b) => b.mean_demand_mu - a.mean_demand_mu);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
            National State Explorer & Coverage Map
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Inspect genuine historical consumption telemetry and model availability across 33 Indian states and Union Territories.
        </p>
      </div>

      {/* Primary Map Interface */}
      <IndiaMap states={states} />

      {/* State-Level Demand Comparative Table */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
              All 33 States & UTs Historical Telemetry Benchmark
            </h3>
            <p className="text-xs text-neutral-500">
              Ranked by mean daily consumption recorded in POSOCO weekly reports (2019–2020)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <span>Primary Focus:</span>
            <span className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Rajasthan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark text-neutral-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">State / UT</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Model Status</th>
                <th className="py-2.5 px-3 text-right">Mean Demand (MU)</th>
                <th className="py-2.5 px-3 text-right">Min Demand (MU)</th>
                <th className="py-2.5 px-3 text-right">Peak Demand (MU)</th>
                <th className="py-2.5 px-3 text-right">Record Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {stateList.map((st) => {
                const isTarget = st.state === "Rajasthan";
                return (
                  <tr
                    key={st.state}
                    className={`transition-colors ${
                      isTarget
                        ? "bg-amber-500/10 font-bold text-amber-900 dark:text-amber-200"
                        : "hover:bg-surface-light-alt dark:hover:bg-surface-dark-alt text-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      {isTarget && <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      <span>{st.state}</span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500">{st.region}</td>
                    <td className="py-2.5 px-3">
                      {isTarget ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          Active Ridge Model
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                          Telemetry Ingested
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">{st.mean_demand_mu.toFixed(1)} MU</td>
                    <td className="py-2.5 px-3 text-right text-neutral-500">{st.min_demand_mu.toFixed(1)} MU</td>
                    <td className="py-2.5 px-3 text-right text-neutral-500">{st.max_demand_mu.toFixed(1)} MU</td>
                    <td className="py-2.5 px-3 text-right text-neutral-500">{st.record_count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

