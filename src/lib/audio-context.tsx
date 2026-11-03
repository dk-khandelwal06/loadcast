"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (val: number) => void;
  playSparkSound: () => void;
}

const ElectricityAudioContext = createContext<AudioContextType>({
  isPlaying: false,
  volume: 0.2,
  toggleAudio: () => {},
  setVolume: () => {},
  playSparkSound: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.2);

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null); // 50 Hz Indian Grid AC hum
  const osc2Ref = useRef<OscillatorNode | null>(null); // 100 Hz harmonic

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 50 Hz Indian Grid Fundamental Frequency
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(50, ctx.currentTime);

      // Low-pass filter to make the hum soothing and subtle
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.35, ctx.currentTime);

      osc1.connect(filter);
      filter.connect(humGain);
      humGain.connect(masterGain);
      osc1.start();
      osc1Ref.current = osc1;

      // 100 Hz 2nd Harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(100, ctx.currentTime);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc2.connect(filter);
      osc2Gain.connect(masterGain);
      osc2.start();
      osc2Ref.current = osc2;
    } catch (e) {
      console.warn("Web Audio API not supported in this environment", e);
    }
  };

  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      if (isPlaying) {
        masterGainRef.current?.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        setIsPlaying(false);
      } else {
        masterGainRef.current?.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
        setIsPlaying(true);
      }
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (masterGainRef.current && audioCtxRef.current && isPlaying) {
      masterGainRef.current.gain.setValueAtTime(clamped, audioCtxRef.current.currentTime);
    }
  };

  const playSparkSound = () => {
    if (!isPlaying || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Ignore audio interaction errors
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <ElectricityAudioContext.Provider
      value={{
        isPlaying,
        volume,
        toggleAudio,
        setVolume,
        playSparkSound,
      }}
    >
      {children}
    </ElectricityAudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(ElectricityAudioContext);
}
