"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend
} from "recharts";
import { DailyRecord } from "@/lib/data-service";
import { useTheme } from "@/lib/theme-context";

interface DailyDemandChartProps {
  data: DailyRecord[];
  showCovidLockdown?: boolean;
}

export function DailyDemandChart({
  data,
  showCovidLockdown = true,
}: DailyDemandChartProps) {
  const { theme } = useTheme();
  const [range, setRange] = useState<"30d" | "90d" | "1y" | "all">("all");

  const filterData = () => {
    if (range === "30d") return data.slice(-30);
    if (range === "90d") return data.slice(-90);
    if (range === "1y") return data.slice(-365);
    return data;
  };

  const chartData = filterData();

  const isDark = theme === "dark";
  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
            Daily Electricity Demand (MU)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Historical consumption time series for Rajasthan (2019–2020)
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-xs font-mono">
          {(["30d", "90d", "1y", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded transition-colors ${
                range === r
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              domain={["dataMin - 10", "dataMax + 10"]}
              unit=" MU"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number) => [`${val.toFixed(1)} MU`, "Demand"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
            />

            {/* COVID Lockdown Reference Area */}
            {showCovidLockdown && (
              <ReferenceArea
                x1="2020-03-25"
                x2="2020-05-31"
                fill="#ef4444"
                fillOpacity={isDark ? 0.12 : 0.08}
                stroke="#ef4444"
                strokeOpacity={0.4}
                strokeDasharray="3 3"
                label={{
                  value: "COVID Lockdown",
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 10,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="demand"
              name="Actual Demand (MU)"
              stroke="#d97706"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#d97706" }}
            />
            <Line
              type="monotone"
              dataKey="rolling_mean_7"
              name="Rolling 7-Day Mean"
              stroke="#0284c7"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-border-light dark:border-border-dark font-mono">
        <span>Units: Mega Units (MU = Million kWh)</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500/20 border border-red-500/40 inline-block" />
          Shaded area indicates Mar 25 – May 31, 2020 lockdown
        </span>
      </div>
    </div>
  );
}
