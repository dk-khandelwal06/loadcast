"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import { useTheme } from "@/lib/theme-context";

interface ErrorPoint {
  date: string;
  residual: number;
}

interface ErrorOverTimeChartProps {
  data: ErrorPoint[];
}

export function ErrorOverTimeChart({ data }: ErrorOverTimeChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
          Forecast Residuals Across Time (e_t = y_t - ŷ_t)
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tracking prediction errors day-by-day across the chronological holdout test period
        </p>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="date" stroke={textColor} fontSize={11} minTickGap={30} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} unit=" MU" />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number) => [`${val.toFixed(2)} MU`, "Residual"]}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="residual"
              name="Residual Error"
              stroke="#0284c7"
              strokeWidth={1.5}
              dot={{ r: 2, fill: "#0284c7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-border-light dark:border-border-dark">
        <span>Zero Line: Perfect Prediction</span>
        <span className="text-red-500">Red dashed reference</span>
      </div>
    </div>
  );
}

