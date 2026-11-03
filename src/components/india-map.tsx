"use client";

import React, { useState } from "react";
import { StateMetadata } from "@/lib/data-service";
import { MapPin, Zap, CheckCircle2, AlertCircle, TrendingUp, Layers } from "lucide-react";
import { useAudio } from "@/lib/audio-context";

interface IndiaMapProps {
  states: Record<string, StateMetadata>;
  onSelectState?: (stateName: string) => void;
}

export function IndiaMap({ states, onSelectState }: IndiaMapProps) {
  const [selectedState, setSelectedState] = useState<string>("Rajasthan");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const { playSparkSound } = useAudio();

  const stateList = Object.values(states);
  const activeState = states[selectedState] || states["Rajasthan"];

  // Geo bounds of India for projection
  // Lat: 8.0 to 37.0 N, Lon: 68.0 to 97.0 E
  const projectCoords = (lat: number, lon: number) => {
    const minLat = 8.0;
    const maxLat = 36.5;
    const minLon = 68.0;
    const maxLon = 97.5;

    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const handleStateClick = (name: string) => {
    setSelectedState(name);
    playSparkSound();
    if (onSelectState) onSelectState(name);
  };

  const filteredStates = regionFilter === "ALL" 
    ? stateList 
    : stateList.filter(s => s.region === regionFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Map Interactive Canvas */}
      <div className="lg:col-span-7 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-light dark:border-border-dark pb-3">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              State-Wise Dataset Geographic Grid
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive map of 33 Indian states and UTs with historical telemetry
            </p>
          </div>

          {/* Region Filters */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {["ALL", "NR", "WR", "SR", "ER", "NER"].map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  regionFilter === reg
                    ? "bg-amber-600 text-white font-semibold"
                    : "bg-surface-light-alt dark:bg-surface-dark-alt text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-96 sm:h-[460px] bg-surface-light-alt dark:bg-neutral-950/70 rounded-lg overflow-hidden border border-border-light dark:border-border-dark p-4">
          
          {/* Subtle Background Outline of India */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-neutral-500">
              <path d="M45,10 Q50,5 55,10 Q65,20 60,35 Q75,35 85,38 Q90,45 85,55 Q75,60 65,70 Q55,85 50,95 Q45,85 35,70 Q25,60 20,45 Q25,30 35,25 Z" />
            </svg>
          </div>

          {/* Interactive State Pins */}
          {filteredStates.map((st) => {
            const { x, y } = projectCoords(st.latitude, st.longitude);
            const isSelected = selectedState === st.state;
            const isRajasthan = st.state === "Rajasthan";

            return (
              <button
                key={st.state}
                onClick={() => handleStateClick(st.state)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 group ${
                  isSelected ? "scale-125 z-20" : "hover:scale-110"
                }`}
                title={`${st.state} (${st.mean_demand_mu} MU)`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isRajasthan
                      ? "bg-amber-500 text-white ring-4 ring-amber-500/30 ring-offset-1"
                      : isSelected
                      ? "bg-sky-500 text-white ring-2 ring-sky-400"
                      : "bg-surface-light dark:bg-surface-dark border border-neutral-400 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {isRajasthan ? (
                    <Zap className="w-2.5 h-2.5" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>

                {/* State Label Tooltip */}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -top-6 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none transition-opacity ${
                    isSelected || isRajasthan
                      ? "opacity-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm"
                      : "opacity-0 group-hover:opacity-100 bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
                  }`}
                >
                  {st.state}
                </span>
              </button>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 p-2.5 rounded-lg bg-surface-light/95 dark:bg-surface-dark/95 border border-border-light dark:border-border-dark text-[11px] font-mono shadow-md space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px]">
                <Zap className="w-2 h-2" />
              </span>
              <span>Rajasthan (Primary ML Model Target)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Other Monitored States</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected State Details Sidebar */}
      <div className="lg:col-span-5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="border-b border-border-light dark:border-border-dark pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              Region: {activeState?.region || "N/A"}
            </span>
            {activeState?.has_trained_model ? (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Model (Ridge v1.0)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Telemetry Only (No Model Fitted)
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2 font-sans">
            {activeState?.state}
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Coordinates: {activeState?.latitude.toFixed(2)}° N, {activeState?.longitude.toFixed(2)}° E
          </p>
        </div>

        {/* State Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark">
            <div className="text-[10px] text-neutral-500 uppercase">Mean Daily Demand</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {activeState?.mean_demand_mu.toFixed(1)} <span className="text-xs font-normal">MU</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark">
            <div className="text-[10px] text-neutral-500 uppercase">Std Deviation</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              &plusmn;{activeState?.std_demand_mu.toFixed(1)} <span className="text-xs font-normal">MU</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark">
            <div className="text-[10px] text-neutral-500 uppercase">Min Recorded</div>
            <div className="text-base font-bold text-neutral-800 dark:text-neutral-200 mt-1">
              {activeState?.min_demand_mu.toFixed(1)} MU
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-light-alt dark:bg-surface-dark-alt border border-border-light dark:border-border-dark">
            <div className="text-[10px] text-neutral-500 uppercase">Peak Recorded</div>
            <div className="text-base font-bold text-neutral-800 dark:text-neutral-200 mt-1">
              {activeState?.max_demand_mu.toFixed(1)} MU
            </div>
          </div>
        </div>

        {/* Status Callout */}
        {activeState?.has_trained_model ? (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs space-y-2">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              Target Forecasting State
            </div>
            <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              Rajasthan was chosen as the inaugural model focus due to its high agricultural-industrial load variance and major renewable energy capacity (Bhadla Solar Park).
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
            <div className="font-semibold text-neutral-800 dark:text-neutral-200">
              Future Expansion Candidate
            </div>
            <p className="leading-relaxed">
              Historical readings exist in POSOCO reports ({activeState?.record_count} observations). State-specific Ridge pipelines can be trained via the Python pipeline scripts.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

