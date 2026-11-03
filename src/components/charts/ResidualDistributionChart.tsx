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

interface ResidualDistributionChartProps {
  data: Array<{
    bin_start: number;
    bin_end: number;
    count: number;
  }>;
}

export function ResidualDistributionChart({ data }: ResidualDistributionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  const chartData = data.map((d) => ({
    range: `${d.bin_start}`,
    bin_center: (d.bin_start + d.bin_end) / 2,
    count: d.count,
  }));

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
          Residual Error Distribution: (y - ŷ)
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Gaussian-like symmetry centered near zero indicates unbiased regularized predictions
        </p>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="range" stroke={textColor} fontSize={10} minTickGap={20} tickLine={false} unit=" MU" />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number) => [`${val} samples`, "Frequency"]}
              labelFormatter={(l) => `Residual Bin: ~${l} MU`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => {
                const isCenter = Math.abs(entry.bin_center) < 10;
                return (
                  <Cell
                    key={`res-${index}`}
                    fill={isCenter ? "#0284c7" : "#d97706"}
                    opacity={0.85}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-border-light dark:border-border-dark">
        <span>Ideal residuals: Mean zero, constant variance</span>
        <span className="text-sky-600 dark:text-sky-400 font-semibold">Center Bins (|e| &lt; 10 MU)</span>
      </div>
    </div>
  );
}

