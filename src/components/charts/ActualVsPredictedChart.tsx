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
  Legend,
  ReferenceArea
} from "recharts";
import { useTheme } from "@/lib/theme-context";

interface HoldoutPoint {
  date: string;
  actual: number;
  predicted_ridge: number;
  predicted_naive: number;
  residual: number;
  is_covid: boolean;
}

interface ActualVsPredictedChartProps {
  data: HoldoutPoint[];
  title?: string;
  subtitle?: string;
  showCovidShading?: boolean;
}

export function ActualVsPredictedChart({
  data,
  title = "Actual vs. Predicted Holdout Demand (MU)",
  subtitle = "Chronological 80/20 test split comparing Ridge Regression vs. Naive Baseline",
  showCovidShading = true
}: ActualVsPredictedChartProps) {
  const { theme } = useTheme();
  const [showNaive, setShowNaive] = useState<boolean>(true);
  const isDark = theme === "dark";

  const gridColor = isDark ? "#262c3a" : "#eae7de";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
            {title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        {/* Toggle Naive Baseline */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
          <input
            type="checkbox"
            checked={showNaive}
            onChange={(e) => setShowNaive(e.target.checked)}
            className="rounded border-border-strong text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 accent-purple-600"
          />
          <span className="text-neutral-600 dark:text-neutral-300">
            {"Show Naive Baseline (y_{t-1})"}
          </span>
        </label>
      </div>

      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="date" stroke={textColor} fontSize={11} minTickGap={30} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} unit=" MU" domain={["dataMin - 15", "dataMax + 15"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#181c24" : "#ffffff",
                borderColor: isDark ? "#363e52" : "#d5d1c4",
                borderRadius: "8px",
                fontSize: "12px",
                color: isDark ? "#f8fafc" : "#18191d",
              }}
              formatter={(val: number, name: string) => [`${val.toFixed(2)} MU`, name]}
              labelFormatter={(label) => `Test Date: ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} iconType="circle" />

            {showCovidShading && (
              <ReferenceArea
                x1="2020-03-25"
                x2="2020-05-31"
                fill="#ef4444"
                fillOpacity={isDark ? 0.12 : 0.08}
                stroke="#ef4444"
                strokeOpacity={0.4}
                strokeDasharray="3 3"
                label={{
                  value: "Lockdown Structural Break",
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 10
                }}
              />
            )}

            {/* Actual Ground Truth */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Demand (Ground Truth)"
              stroke="#d97706"
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: "#d97706" }}
              activeDot={{ r: 6 }}
            />

            {/* Ridge Prediction */}
            <Line
              type="monotone"
              dataKey="predicted_ridge"
              name="Ridge Prediction"
              stroke="#0284c7"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#0284c7" }}
            />

            {/* Naive Baseline */}
            {showNaive && (
              <Line
                type="monotone"
                dataKey="predicted_naive"
                name="Naive Persistence (Lag-1)"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-2 border-t border-border-light dark:border-border-dark font-mono">
        <span>Test Set Observations: {data.length} days</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Actual
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block ml-2" /> Ridge
          {showNaive && (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block ml-2" /> Naive
            </>
          )}
        </span>
      </div>
    </div>
  );
}
