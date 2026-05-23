"use client";

import { useEffect, useState } from "react";
import type { PetAction, PetState } from "@/lib/pet";

interface Particle {
  id: number;
  emoji: string;
  x: number;
}

type Cfg = {
  face: string;
  eyeGlow: string;
  eyeBg: string;
  chestEmoji: string;
  antennaBg: string;
  screenGlow: string;
  robotGlow: string;
  particles: string[];
  anim: string;
};

const CONFIG: Record<PetAction, Cfg> = {
  idle: {
    face: "😐",
    eyeBg: "bg-blue-400",
    eyeGlow: "0 0 8px #60a5fa, 0 0 18px rgba(96,165,250,0.5)",
    chestEmoji: "💙",
    antennaBg: "bg-blue-400",
    screenGlow: "inset 0 0 10px rgba(96,165,250,0.25)",
    robotGlow: "drop-shadow(0 0 10px rgba(96,165,250,0.4))",
    particles: [],
    anim: "pet-bob 2.5s ease-in-out infinite",
  },
  manger: {
    face: "😋",
    eyeBg: "bg-green-400",
    eyeGlow: "0 0 8px #4ade80, 0 0 18px rgba(74,222,128,0.5)",
    chestEmoji: "🍕",
    antennaBg: "bg-green-400",
    screenGlow: "inset 0 0 10px rgba(74,222,128,0.3)",
    robotGlow: "drop-shadow(0 0 14px rgba(74,222,128,0.55))",
    particles: ["🍕", "🍔", "🌮", "🍩"],
    anim: "pet-shake 0.25s ease-in-out infinite",
  },
  jouer: {
    face: "😄",
    eyeBg: "bg-cyan-400",
    eyeGlow: "0 0 8px #22d3ee, 0 0 18px rgba(34,211,238,0.5)",
    chestEmoji: "⚽",
    antennaBg: "bg-cyan-400",
    screenGlow: "inset 0 0 10px rgba(34,211,238,0.3)",
    robotGlow: "drop-shadow(0 0 14px rgba(34,211,238,0.55))",
    particles: ["⚽", "🎮", "🏀", "🎯"],
    anim: "pet-jump 0.65s ease-in-out infinite",
  },
  dormir: {
    face: "😴",
    eyeBg: "bg-purple-400",
    eyeGlow: "0 0 6px #c084fc, 0 0 14px rgba(192,132,252,0.35)",
    chestEmoji: "💤",
    antennaBg: "bg-purple-300",
    screenGlow: "inset 0 0 8px rgba(192,132,252,0.2)",
    robotGlow: "drop-shadow(0 0 8px rgba(192,132,252,0.3))",
    particles: ["💤", "😴", "🌙"],
    anim: "pet-bob 4s ease-in-out infinite",
  },
  danser: {
    face: "🥳",
    eyeBg: "bg-pink-400",
    eyeGlow: "0 0 10px #f472b6, 0 0 22px rgba(244,114,182,0.55)",
    chestEmoji: "🎵",
    antennaBg: "bg-pink-400",
    screenGlow: "inset 0 0 12px rgba(244,114,182,0.35)",
    robotGlow: "drop-shadow(0 0 18px rgba(244,114,182,0.65))",
    particles: ["🎵", "🎶", "✨", "⭐", "🎉"],
    anim: "pet-dance 0.5s ease-in-out infinite",
  },
  triste: {
    face: "😢",
    eyeBg: "bg-red-400",
    eyeGlow: "0 0 6px #f87171, 0 0 14px rgba(248,113,113,0.35)",
    chestEmoji: "💔",
    antennaBg: "bg-red-400",
    screenGlow: "inset 0 0 8px rgba(248,113,113,0.2)",
    robotGlow: "drop-shadow(0 0 8px rgba(248,113,113,0.3))",
    particles: ["😢", "💧"],
    anim: "pet-bob 3s ease-in-out infinite",
  },
};

function Rivet() {
  return (
    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 border border-slate-300/30 shadow-sm" />
  );
}

interface Props {
  state: PetState;
  skinGradient?: string;
}

export default function PetRobot({ state, skinGradient = "from-blue-500 to-cyan-400" }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const cfg = CONFIG[state.action] ?? CONFIG.idle;
  const isSleeping = state.action === "dormir";

  useEffect(() => {
    if (cfg.particles.length === 0) return;
    const emojis = cfg.particles;
    const batch: Particle[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 8 + Math.random() * 84,
    }));
    setParticles(batch);
    const t = setTimeout(() => setParticles([]), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.action]);

  return (
    <div className="relative flex flex-col items-center select-none py-6 min-h-[340px]">
      {/* Skin aura */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${skinGradient} blur-3xl pointer-events-none`}
        style={{ opacity: 0.13 }}
      />

      {/* Floor reflection glow */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full blur-xl pointer-events-none"
        style={{ background: "rgba(96,165,250,0.2)", filter: cfg.robotGlow }}
      />

      {/* Particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute text-2xl pointer-events-none z-20"
          style={{ left: `${p.x}%`, top: "12%", animation: "pet-float-up 1.4s ease-out forwards" }}
        >
          {p.emoji}
        </span>
      ))}

      {/* ─── Robot ─── */}
      <div
        className="z-10 flex flex-col items-center"
        style={{ animation: cfg.anim, filter: cfg.robotGlow }}
      >
        {/* Antenna */}
        <div className="flex flex-col items-center mb-0.5">
          <div className="relative flex items-center justify-center w-7 h-7">
            <div
              className={`absolute w-7 h-7 rounded-full ${cfg.antennaBg} opacity-25 animate-ping`}
            />
            <div
              className={`w-5 h-5 rounded-full ${cfg.antennaBg} z-10`}
              style={{ boxShadow: cfg.eyeGlow }}
            />
          </div>
          <div className="w-2.5 h-6 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full" />
        </div>

        {/* Head */}
        <div className="relative w-36 h-[88px] bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 rounded-2xl border border-slate-400/40 shadow-2xl overflow-hidden">
          {/* Sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent pointer-events-none" />
          {/* Rivets */}
          <div className="absolute top-2 left-2"><Rivet /></div>
          <div className="absolute top-2 right-2"><Rivet /></div>
          <div className="absolute bottom-2 left-2"><Rivet /></div>
          <div className="absolute bottom-2 right-2"><Rivet /></div>
          {/* Eyes */}
          <div className="flex justify-center gap-5 pt-4">
            {[0, 1].map(i => (
              <div
                key={i}
                className={`w-9 h-7 rounded-lg ${cfg.eyeBg} flex items-center justify-center shadow-md`}
                style={{ boxShadow: cfg.eyeGlow }}
              >
                {isSleeping
                  ? <div className="w-7 h-1.5 rounded-full bg-slate-900/70" />
                  : <div className="w-3 h-3 rounded-full bg-slate-900/50" />
                }
              </div>
            ))}
          </div>
          {/* Mouth */}
          <div className="flex justify-center mt-2 text-xl leading-none">
            {cfg.face}
          </div>
        </div>

        {/* Neck connector */}
        <div className="w-10 h-2 bg-gradient-to-b from-slate-600 to-slate-700 border-x border-slate-500/40" />

        {/* Body + Arms */}
        <div className="flex items-start">
          {/* Left shoulder + arm */}
          <div className="flex items-start mt-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-slate-400 to-slate-600 border border-slate-300/30 shadow mt-0.5 z-10 shrink-0" />
            <div className="w-6 h-20 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 rounded-full border border-slate-400/30 -ml-1 shadow-lg overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </div>

          {/* Body */}
          <div className="relative w-32 h-28 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 rounded-2xl border border-slate-400/40 shadow-2xl flex flex-col items-center justify-center gap-2">
            {/* Sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-2xl pointer-events-none" />
            {/* Body rivets */}
            <div className="absolute top-2 left-2"><Rivet /></div>
            <div className="absolute top-2 right-2"><Rivet /></div>
            {/* Chest screen */}
            <div
              className="w-16 h-14 rounded-xl bg-slate-950/90 border border-slate-500/40 flex items-center justify-center text-3xl relative overflow-hidden shadow-inner"
              style={{ boxShadow: cfg.screenGlow }}
            >
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)" }}
              />
              <span className="relative z-10">{cfg.chestEmoji}</span>
            </div>
            {/* Speaker grill */}
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-1 h-2.5 rounded-full bg-slate-500/70" />
              ))}
            </div>
          </div>

          {/* Right arm + shoulder */}
          <div className="flex items-start mt-2">
            <div className="w-6 h-20 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 rounded-full border border-slate-400/30 -mr-1 shadow-lg overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-slate-400 to-slate-600 border border-slate-300/30 shadow mt-0.5 z-10 shrink-0" />
          </div>
        </div>

        {/* Legs */}
        <div className="flex gap-4 mt-1.5">
          {[0, 1].map(i => (
            <div key={i} className="flex flex-col items-center">
              {/* Upper leg */}
              <div className="w-10 h-9 bg-gradient-to-b from-slate-500 to-slate-700 rounded-t-xl border border-slate-400/30 shadow overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              {/* Knee joint */}
              <div className="w-6 h-2.5 bg-gradient-to-b from-slate-400 to-slate-600 border-x border-slate-300/20" />
              {/* Lower leg + foot */}
              <div className="w-10 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded-b-xl border border-slate-400/30 shadow overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Name */}
      <p className="mt-5 text-base font-bold tracking-widest uppercase text-slate-300 z-10">
        {state.nom}
      </p>
    </div>
  );
}
