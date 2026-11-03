"use client";

import React, { useState } from "react";
import { Zap, Radio, Sun, Flame, Building2 } from "lucide-react";
import { useAudio } from "@/lib/audio-context";

interface GridNode {
  id: string;
  name: string;
  type: "solar" | "thermal" | "substation" | "load_center";
  x: number; // percentage
  y: number; // percentage
  capacityMW: string;
  loadMU: string;
  status: "active" | "standby";
}

const NODES: GridNode[] = [
  { id: "bhadla", name: "Bhadla Solar Park", type: "solar", x: 22, y: 32, capacityMW: "2,245 MW", loadMU: "18.4 MU/day", status: "active" },
  { id: "suratgarh", name: "Suratgarh Super Thermal", type: "thermal", x: 38, y: 18, capacityMW: "2,820 MW", loadMU: "46.2 MU/day", status: "active" },
  { id: "kota", name: "Kota Thermal Station", type: "thermal", x: 74, y: 78, capacityMW: "1,240 MW", loadMU: "24.8 MU/day", status: "active" },
  { id: "chhabra", name: "Chhabra Thermal Power", type: "thermal", x: 84, y: 86, capacityMW: "2,320 MW", loadMU: "38.1 MU/day", status: "active" },
  { id: "jaipur", name: "Jaipur Central Load Substation", type: "load_center", x: 62, y: 44, capacityMW: "400 kV Ring", loadMU: "64.5 MU/day", status: "active" },
  { id: "jodhpur", name: "Jodhpur Grid Dispatch", type: "substation", x: 34, y: 56, capacityMW: "400 kV Hub", loadMU: "32.0 MU/day", status: "active" },
  { id: "bikaner", name: "Bikaner Inverter Station", type: "substation", x: 32, y: 38, capacityMW: "765 kV Pool", loadMU: "21.6 MU/day", status: "active" }
];

const CONNECTIONS = [
  { from: "bhadla", to: "bikaner" },
  { from: "bikaner", to: "jodhpur" },
  { from: "suratgarh", to: "bikaner" },
  { from: "suratgarh", to: "jaipur" },
  { from: "jodhpur", to: "jaipur" },
  { from: "jaipur", to: "kota" },
  { from: "kota", to: "chhabra" }
];

export function PowerGridCanvas() {
  const [selectedNode, setSelectedNode] = useState<GridNode | null>(NODES[4]);
  const { playSparkSound } = useAudio();

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-border-light dark:border-border-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-sans">
              Interactive Grid Topology & Transmission Network
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Representative transmission hierarchy linking major Rajasthan generation hubs to regional load dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            SYNCHRONIZED (50 Hz)
          </span>
        </div>
      </div>

      <div className="relative w-full h-80 sm:h-96 bg-surface-light-alt dark:bg-neutral-950/70 p-4">
        
        {/* SVG Transmission Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="linePulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {CONNECTIONS.map((c, idx) => {
            const n1 = NODES.find(n => n.id === c.from)!;
            const n2 = NODES.find(n => n.id === c.to)!;
            return (
              <g key={idx}>
                {/* Background static line */}
                <line
                  x1={`${n1.x}%`}
                  y1={`${n1.y}%`}
                  x2={`${n2.x}%`}
                  y2={`${n2.y}%`}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-neutral-300 dark:text-neutral-700/80"
                />
                {/* Animated transmission pulse */}
                <line
                  x1={`${n1.x}%`}
                  y1={`${n1.y}%`}
                  x2={`${n2.x}%`}
                  y2={`${n2.y}%`}
                  stroke="url(#linePulse)"
                  strokeWidth="2.5"
                  strokeDasharray="6 12"
                  className="animate-flow-line opacity-90"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes Overlay */}
        {NODES.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => {
                setSelectedNode(node);
                playSparkSound();
              }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all z-10 ${
                isSelected
                  ? "bg-amber-600 text-white border-amber-400 shadow-lg scale-110 ring-4 ring-amber-500/20"
                  : "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-neutral-800 dark:text-neutral-200 hover:border-amber-400 hover:scale-105 shadow-sm"
              }`}
              title={`${node.name} (${node.capacityMW})`}
            >
              {node.type === "solar" && <Sun className="w-3.5 h-3.5 text-amber-400" />}
              {node.type === "thermal" && <Flame className="w-3.5 h-3.5 text-orange-500" />}
              {node.type === "substation" && <Radio className="w-3.5 h-3.5 text-sky-500" />}
              {node.type === "load_center" && <Building2 className="w-3.5 h-3.5 text-emerald-500" />}
              <span className="font-mono text-[11px] font-semibold hidden md:inline">
                {node.name.split(" ")[0]}
              </span>
            </button>
          );
        })}

        {/* Active Node Flyout Card */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 p-3.5 rounded-lg border border-amber-300 dark:border-amber-700/80 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm shadow-xl z-20">
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2">
              <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                {selectedNode.name}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {selectedNode.type}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-mono">
              <div>
                <span className="text-neutral-500 text-[10px]">Capacity</span>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedNode.capacityMW}</div>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px]">Throughput</span>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedNode.loadMU}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

