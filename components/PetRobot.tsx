"use client";

import { useEffect, useState } from "react";
import type { PetAction, PetState } from "@/lib/pet";

interface Particle {
  id: number;
  emoji: string;
  x: number;
}

const CONFIG: Record<PetAction, {
  face: string;
  border: string;
  antenna: string;
  chest: string;
  particles: string[];
  anim: string;
}> = {
  idle:   { face: "😐", border: "border-slate-500",  antenna: "bg-blue-400",   chest: "💙", particles: [],                      anim: "pet-bob 2.5s ease-in-out infinite"  },
  manger: { face: "😋", border: "border-green-400",  antenna: "bg-green-400",  chest: "🍕", particles: ["🍕","🍔","🌮","🍩"],  anim: "pet-shake 0.25s ease-in-out infinite" },
  jouer:  { face: "😄", border: "border-cyan-400",   antenna: "bg-cyan-400",   chest: "⚽", particles: ["⚽","🎮","🏀","🎯"],  anim: "pet-jump 0.65s ease-in-out infinite" },
  dormir: { face: "😴", border: "border-purple-400", antenna: "bg-purple-300", chest: "💤", particles: ["💤","😴","🌙"],        anim: "pet-bob 4s ease-in-out infinite"    },
  danser: { face: "🥳", border: "border-pink-400",   antenna: "bg-pink-400",   chest: "🎵", particles: ["🎵","🎶","✨","⭐","🎉"], anim: "pet-dance 0.5s ease-in-out infinite" },
  triste: { face: "😢", border: "border-red-400",    antenna: "bg-red-400",    chest: "💔", particles: ["😢","💧"],              anim: "pet-bob 3s ease-in-out infinite"    },
};

interface Props {
  state: PetState;
  skinGradient?: string;
}

export default function PetRobot({ state, skinGradient = "from-blue-500 to-cyan-400" }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const cfg = CONFIG[state.action] ?? CONFIG.idle;
  const isDim = state.action === "dormir" || state.action === "triste";
  const bodyBg = isDim ? "bg-slate-800" : "bg-slate-700";
  const eyeChar = state.action === "dormir" ? "━" : "◉";

  useEffect(() => {
    if (cfg.particles.length === 0) return;
    const emojis = cfg.particles;
    const batch: Particle[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 10 + Math.random() * 80,
    }));
    setParticles(batch);
    const t = setTimeout(() => setParticles([]), 1600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.action]);

  return (
    <div className="relative flex flex-col items-center select-none py-6 min-h-[280px]">
      {/* Skin aura */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${skinGradient} blur-3xl opacity-15 pointer-events-none`}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute text-2xl pointer-events-none z-20"
          style={{ left: `${p.x}%`, top: "25%", animation: "pet-float-up 1.4s ease-out forwards" }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Robot */}
      <div className="z-10 flex flex-col items-center" style={{ animation: cfg.anim }}>
        {/* Antenna */}
        <div className="flex flex-col items-center">
          <div className={`w-5 h-5 rounded-full ${cfg.antenna} shadow-lg animate-pulse`} />
          <div className="w-2 h-7 bg-slate-500 rounded-full" />
        </div>

        {/* Head */}
        <div className={`w-32 h-24 ${bodyBg} rounded-2xl border-2 ${cfg.border} flex flex-col items-center justify-center gap-2 shadow-xl`}>
          <div className="flex gap-6">
            <div className={`w-7 h-7 rounded-full bg-slate-900 border-2 ${cfg.border} flex items-center justify-center text-xs font-black text-white`}>
              {eyeChar}
            </div>
            <div className={`w-7 h-7 rounded-full bg-slate-900 border-2 ${cfg.border} flex items-center justify-center text-xs font-black text-white`}>
              {eyeChar}
            </div>
          </div>
          <div className="text-xl leading-none">{cfg.face}</div>
        </div>

        {/* Body + arms */}
        <div className="relative flex items-center mt-1.5">
          {/* Left arm */}
          <div className={`w-6 h-16 ${bodyBg} rounded-full border-2 ${cfg.border} mr-1.5 shadow`} />

          {/* Body */}
          <div className={`w-28 h-24 ${bodyBg} rounded-2xl border-2 ${cfg.border} flex items-center justify-center shadow-xl`}>
            <div className={`w-14 h-14 rounded-xl bg-slate-900 border-2 ${cfg.border} flex items-center justify-center text-3xl`}>
              {cfg.chest}
            </div>
          </div>

          {/* Right arm */}
          <div className={`w-6 h-16 ${bodyBg} rounded-full border-2 ${cfg.border} ml-1.5 shadow`} />
        </div>

        {/* Legs */}
        <div className="flex gap-3 mt-1.5">
          <div className={`w-10 h-14 ${bodyBg} rounded-b-2xl border-2 ${cfg.border} border-t-0 shadow`} />
          <div className={`w-10 h-14 ${bodyBg} rounded-b-2xl border-2 ${cfg.border} border-t-0 shadow`} />
        </div>
      </div>

      {/* Name */}
      <p className="mt-4 text-lg font-bold text-white z-10 tracking-wide">{state.nom}</p>
    </div>
  );
}
