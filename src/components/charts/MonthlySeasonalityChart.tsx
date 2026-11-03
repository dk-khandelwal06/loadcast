"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import { useTheme } from "@/lib/theme-context";

interface MonthlySeasonalityChartProps {
  data: Array<{
    month_name: string;
    average_demand: number;
    count: number;
  }>;
}

export function MonthlySeasonalityChart({ data }: MonthlySeasonalityChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
          Monthly Demand Seasonality (MU)
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Monthly consumption variations demonstrating summer agricultural & air conditioning peaks
        </p>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month_name" stroke={textColor} fontSize={11} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} unit=" MU" domain={["dataMin - 20", "dataMax + 20"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number) => [`${val.toFixed(1)} MU`, "Monthly Mean"]}
            />
            <Bar dataKey="average_demand" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                // Highlight peak summer months (May/June/July/Oct)
                const isPeak = entry.month_name === "Jul" || entry.month_name === "Aug" || entry.month_name === "Oct";
                return <Cell key={`cell-${index}`} fill={isPeak ? "#d97706" : isDark ? "#38bdf8" : "#0284c7"} opacity={0.85} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

