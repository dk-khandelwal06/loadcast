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

interface DayOfWeekChartProps {
  data: Array<{
    day_name: string;
    average_demand: number;
    is_weekend: boolean;
  }>;
}

export function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
          Day-of-Week Demand Pattern (MU)
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Comparing typical weekday industrial loads versus weekend consumption
        </p>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="day_name" stroke={textColor} fontSize={11} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} unit=" MU" domain={["dataMin - 15", "dataMax + 15"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number) => [`${val.toFixed(1)} MU`, "Avg Demand"]}
            />
            <Bar dataKey="average_demand" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`dow-${index}`}
                  fill={entry.is_weekend ? "#d97706" : isDark ? "#38bdf8" : "#0284c7"}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 pt-2 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-sky-600 inline-block" />
          <span>Weekday (Mon–Fri)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-600 inline-block" />
          <span>Weekend (Sat–Sun)</span>
        </div>
      </div>
    </div>
  );
}

