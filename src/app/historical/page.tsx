"use client";

import React, { useState } from "react";
import { getHistoricalData, DailyRecord } from "@/lib/data-service";
import { DailyDemandChart } from "@/components/charts/DailyDemandChart";
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap 
} from "lucide-react";
import { useAudio } from "@/lib/audio-context";

export default function HistoricalAnalyticsPage() {
  const historical = getHistoricalData();
  const allDaily = historical.daily;
  const { playSparkSound } = useAudio();

  const [startDate, setStartDate] = useState<string>("2019-01-09");
  const [endDate, setEndDate] = useState<string>("2020-12-05");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  // Filter daily records
  const filtered = allDaily.filter((r) => {
    const withinDate = r.date >= startDate && r.date <= endDate;
    const matchesSearch = searchTerm ? r.date.includes(searchTerm) : true;
    return withinDate && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Peak & Lowest in filtered subset
  let peakRecord = filtered[0];
  let lowestRecord = filtered[0];
  for (const r of filtered) {
    if (!peakRecord || r.demand > peakRecord.demand) peakRecord = r;
    if (!lowestRecord || r.demand < lowestRecord.demand) lowestRecord = r;
  }

  const handleDownloadCSV = () => {
    playSparkSound();
    window.location.href = `/api/demand/history?format=csv&start=${startDate}&end=${endDate}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
              Historical Consumption Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Query, filter, and export the cleaned daily Rajasthan electricity dataset (2019–2020).
          </p>
        </div>

        {/* Download CSV CTA */}
        <button
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-semibold shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="text-neutral-500 block mb-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            min="2019-01-09"
            max="2020-12-05"
            className="w-full px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt text-neutral-800 dark:text-neutral-200"
          />
        </div>

        <div>
          <label className="text-neutral-500 block mb-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            min="2019-01-09"
            max="2020-12-05"
            className="w-full px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt text-neutral-800 dark:text-neutral-200"
          />
        </div>

        <div>
          <label className="text-neutral-500 block mb-1">Search Date:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 2020-04"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt text-neutral-800 dark:text-neutral-200"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="flex items-end">
          <div className="p-2 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark w-full text-center text-neutral-600 dark:text-neutral-300">
            Matching: <strong>{filtered.length}</strong> records
          </div>
        </div>
      </div>

      {/* Extreme Records Callout */}
      {peakRecord && lowestRecord && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-surface-light dark:bg-surface-dark flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase">Peak Demand in Filter</span>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                {peakRecord.demand} MU
              </div>
              <div className="text-neutral-500 text-[11px]">{peakRecord.date}</div>
            </div>
            <ArrowUpRight className="w-6 h-6 text-amber-500" />
          </div>

          <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-700/60 bg-surface-light dark:bg-surface-dark flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase">Lowest Demand in Filter</span>
              <div className="text-xl font-extrabold text-sky-600 dark:text-sky-400">
                {lowestRecord.demand} MU
              </div>
              <div className="text-neutral-500 text-[11px]">{lowestRecord.date}</div>
            </div>
            <ArrowDownRight className="w-6 h-6 text-sky-500" />
          </div>
        </div>
      )}

      {/* Filtered Chart */}
      <section className="space-y-4">
        <DailyDemandChart data={filtered} showCovidLockdown={true} />
      </section>

      {/* Tabular Browser */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
            Cleaned Historical Time-Series Record Table
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark text-neutral-500 uppercase tracking-wider">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3 text-right">Demand (MU)</th>
                <th className="py-2 px-3 text-right">Lag-1 (MU)</th>
                <th className="py-2 px-3 text-right">Lag-7 (MU)</th>
                <th className="py-2 px-3 text-right">Rolling-7 Mean</th>
                <th className="py-2 px-3 text-center">Day of Week</th>
                <th className="py-2 px-3 text-center">Lockdown Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:border-border-dark">
              {pagedData.map((row) => (
                <tr key={row.date} className="hover:bg-surface-light-alt dark:hover:bg-surface-dark-alt">
                  <td className="py-2 px-3 font-bold text-neutral-800 dark:text-neutral-200">{row.date}</td>
                  <td className="py-2 px-3 text-right font-extrabold text-amber-600 dark:text-amber-400">
                    {row.demand.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right text-neutral-500">{row.lag_1.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right text-neutral-500">{row.lag_7.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right text-neutral-500">{row.rolling_mean_7.toFixed(1)}</td>
                  <td className="py-2 px-3 text-center text-neutral-500">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][row.day_of_week]}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {row.is_covid ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                        COVID Lockdown
                      </span>
                    ) : (
                      <span className="text-neutral-400">&minus;</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-border-light dark:border-border-dark text-xs font-mono">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-border-light dark:border-border-dark disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 rounded border border-border-light dark:border-border-dark disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
