"use client";

import { useState, useEffect } from "react";
import { getStreak } from "@/lib/streak";

const MILESTONES = [3, 7, 14, 30, 60, 100];

function getStreakMessage(streak: number, atRisk: boolean): { title: string; subtitle: string } {
  if (atRisk) return { title: "Ton streak est en danger !", subtitle: "Fais une leçon aujourd'hui pour ne pas tout perdre !" };
  if (streak >= 100) return { title: "Légendaire !", subtitle: "100 jours de suite — tu es un vrai Maître Python !" };
  if (streak >= 60) return { title: "Phénomène !", subtitle: "2 mois de coding quotidien — impressionnant !" };
  if (streak >= 30) return { title: "Un mois de feu !", subtitle: "30 jours consécutifs — tu es invincible !" };
  if (streak >= 14) return { title: "Deux semaines !", subtitle: "La régularité, c'est la clé du succès !" };
  if (streak >= 7) return { title: "Une semaine complète !", subtitle: "7 jours d'affilée — tu déchires !" };
  if (streak >= 3) return { title: "En feu !", subtitle: `${streak} jours de suite — continue comme ça !` };
  return { title: `${streak} jour de suite !`, subtitle: "Tu as commencé ta série — ne t'arrête pas !" };
}

function getFlameSize(streak: number): string {
  if (streak >= 30) return "text-6xl";
  if (streak >= 7) return "text-5xl";
  return "text-4xl";
}

export default function StreakBanner() {
  const [streak, setStreak] = useState(0);
  const [atRisk, setAtRisk] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const refresh = () => {
      const s = getStreak();
      setStreak(s.currentStreak);
      const today = new Date().toISOString().split("T")[0];
      setAtRisk(s.currentStreak > 0 && s.lastPlayDate !== today);
    };
    refresh();
    window.addEventListener("pythonkids:progress", refresh);
    return () => window.removeEventListener("pythonkids:progress", refresh);
  }, []);

  if (!mounted || streak === 0) return null;

  const nextMilestone = MILESTONES.find((m) => m > streak) ?? null;
  const prevMilestone = MILESTONES.filter((m) => m <= streak).at(-1) ?? 0;
  const progressPct = nextMilestone
    ? Math.round(((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
    : 100;

  const { title, subtitle } = getStreakMessage(streak, atRisk);

  const bgGradient = atRisk
    ? "from-orange-500 to-red-600"
    : streak >= 30
    ? "from-yellow-500 to-orange-500"
    : streak >= 7
    ? "from-orange-500 to-red-500"
    : "from-orange-400 to-amber-500";

  return (
    <section className="w-full px-6 pb-6">
      <div className={`max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r ${bgGradient} ${atRisk ? "animate-pulse" : ""}`}>
        <div className="relative px-5 py-4 flex items-center gap-4">
          {/* Flame */}
          <div className={`${getFlameSize(streak)} select-none`}
               style={{ animation: "streak-pulse 1.5s ease-in-out infinite", filter: "drop-shadow(0 0 8px rgba(255,160,0,0.8))" }}>
            🔥
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-extrabold text-lg leading-tight">{title}</span>
            </div>
            <p className="text-orange-100 text-xs leading-snug">{subtitle}</p>

            {/* Progress vers le prochain milestone */}
            {nextMilestone && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-orange-200 mb-1">
                  <span>{streak} jours</span>
                  <span>Prochain objectif : {nextMilestone} jours</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-black/20">
                  <div
                    className="h-full rounded-full bg-white/70 transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="shrink-0 text-center">
            <div className="text-4xl font-extrabold text-white leading-none">{streak}</div>
            <div className="text-xs text-orange-200 font-medium">jours</div>
          </div>
        </div>
      </div>
    </section>
  );
}
