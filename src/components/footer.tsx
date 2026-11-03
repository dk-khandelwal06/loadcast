import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, ExternalLink, ShieldCheck, Cpu, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-md overflow-hidden bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center">
                <Image src="/images/logo.png" alt="LoadCast" width={28} height={28} className="object-contain" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
                LOAD<span className="text-amber-600 dark:text-amber-400">CAST</span>
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              Teaching a regression model to see tomorrow&apos;s electricity demand using yesterday&apos;s patterns. 
              An educational time-series intelligence platform for Rajasthan and Indian power grids.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ridge Regression (L2) &bull; alpha=1.0 &bull; Chronological Holdout</span>
            </div>
          </div>

          {/* Core Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/dashboard" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Energy Dashboard
                </Link>
              </li>
              <li>
                <Link href="/forecast" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Forecast Centre
                </Link>
              </li>
              <li>
                <Link href="/state-explorer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  State Explorer
                </Link>
              </li>
              <li>
                <Link href="/historical" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Historical Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Machine Learning Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Intelligence
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/model-intelligence" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Model Intelligence
                </Link>
              </li>
              <li>
                <Link href="/evaluation" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Evaluation & Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/data-lab" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Data Laboratory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Methodology & Learnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Attribution & Stack
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Data sourced from POSOCO (Power System Operation Corporation of India) historical reports curated by twinkle0705 on Kaggle.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Next.js 14", "TypeScript", "Python 3", "Scikit-Learn", "Tailwind CSS", "Recharts"].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-border-light dark:border-border-dark mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl text-center md:text-left leading-relaxed">
            <strong className="text-neutral-700 dark:text-neutral-300">Disclaimer:</strong> LoadCast is an educational electricity-demand forecasting project based on historical data. Its predictions are experimental and must not be used as operational grid-control or electricity-dispatch instructions.
          </p>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} LOADCAST</span>
            <span>&bull;</span>
            <span className="font-mono">Ready for Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
