import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositiveGood?: boolean;
    label?: string;
  };
  highlight?: boolean;
}

export function KPICard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  highlight = false,
}: KPICardProps) {
  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 relative overflow-hidden group ${
        highlight
          ? "bg-gradient-to-br from-amber-500/10 via-surface-light to-surface-light dark:from-amber-950/30 dark:via-surface-dark dark:to-surface-dark border-amber-400 dark:border-amber-600 shadow-md"
          : "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark hover:border-amber-400 dark:hover:border-amber-600 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt text-amber-600 dark:text-amber-400 border border-border-light dark:border-border-dark group-hover:scale-110 transition-transform">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
            {unit}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-neutral-500 dark:text-neutral-400 truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 font-mono font-semibold ${
                trend.value > 0
                  ? trend.isPositiveGood
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                  : trend.value < 0
                  ? trend.isPositiveGood
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                  : "text-neutral-500"
              }`}
            >
              {trend.value > 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : trend.value < 0 ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
