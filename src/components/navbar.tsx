"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  MapPin, 
  Brain, 
  CheckCircle2, 
  History, 
  Database, 
  Info, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Menu, 
  X 
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useAudio } from "@/lib/audio-context";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: Zap },
  { href: "/dashboard", label: "Energy Dashboard", icon: Activity },
  { href: "/forecast", label: "Forecast Centre", icon: TrendingUp },
  { href: "/state-explorer", label: "State Explorer", icon: MapPin },
  { href: "/model-intelligence", label: "Model Intelligence", icon: Brain },
  { href: "/evaluation", label: "Evaluation", icon: CheckCircle2 },
  { href: "/historical", label: "Historical", icon: History },
  { href: "/data-lab", label: "Data Lab", icon: Database },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, volume, toggleAudio, setVolume, playSparkSound } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
            onClick={playSparkSound}
          >
            <div className="relative w-9 h-9 rounded-md overflow-hidden bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center shadow-sm group-hover:border-amber-500 transition-colors">
              <Image 
                src="/images/logo.png" 
                alt="LoadCast Logo" 
                width={32} 
                height={32}
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight font-sans text-neutral-900 dark:text-neutral-100">
                  LOAD<span className="text-amber-600 dark:text-amber-400">CAST</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  ML v1.0
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tracking-tight hidden sm:inline">
                Rajasthan Grid Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={playSparkSound}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-600 dark:text-amber-400" : "text-neutral-400 dark:text-neutral-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Audio & Theme */}
          <div className="flex items-center gap-2">
            
            {/* Audio Toggle & Volume Slider */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={toggleAudio}
                onMouseEnter={() => setShowVolumeSlider(true)}
                title={isPlaying ? "Mute 50Hz Grid Audio Ambience" : "Enable 50Hz Grid Audio Ambience"}
                aria-label={isPlaying ? "Mute Grid Audio" : "Enable Grid Audio"}
                className={`p-2 rounded-md border text-xs flex items-center gap-1.5 transition-all ${
                  isPlaying 
                    ? "bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-300 shadow-sm"
                    : "bg-surface-light-alt dark:bg-surface-dark-alt border-border-light dark:border-border-dark text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                {isPlaying ? <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden xl:inline text-[11px] font-mono">
                  {isPlaying ? "50Hz ON" : "AUDIO"}
                </span>
              </button>

              {/* Volume Slider Flyout */}
              {showVolumeSlider && isPlaying && (
                <div 
                  className="absolute right-0 top-11 p-2 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark shadow-lg rounded-md flex items-center gap-2 z-50 w-36"
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    aria-label="Grid Ambience Volume"
                  />
                </div>
              )}
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                playSparkSound();
              }}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle visual theme"
              className="p-2 rounded-md border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt text-neutral-700 dark:text-neutral-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-neutral-700 hover:text-amber-600 transition-colors" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md border border-border-light dark:border-border-dark bg-surface-light-alt dark:bg-surface-dark-alt text-neutral-700 dark:text-neutral-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 pt-2 pb-4 space-y-1 shadow-md">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  playSparkSound();
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

