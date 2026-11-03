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
} from "recharts";
import { useTheme } from "@/lib/theme-context";

interface DemandDistributionChartProps {
  data: Array<{
    bin_start: number;
    bin_end: number;
    count: number;
  }>;
}

export function DemandDistributionChart({ data }: DemandDistributionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  const formattedData = data.map((d) => ({
    range: `${d.bin_start}-${d.bin_end}`,
    count: d.count,
  }));

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
          Historical Demand Distribution Histogram
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Frequency of observed daily demand levels across 498 records
        </p>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="range" stroke={textColor} fontSize={10} minTickGap={20} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} unit=" days" />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number) => [`${val} days`, "Frequency"]}
              labelFormatter={(label) => `Range: ${label} MU`}
            />
            <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

