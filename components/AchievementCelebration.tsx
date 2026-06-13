"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Confetti from "./Confetti";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { lf } from "@/lib/localize";

const MAJOR_IDS = new Set([
  "first_lesson", "lessons_all",
  "streak_7", "streak_30",
  "first_challenge", "challenges_all",
  "first_duel_win", "duel_wins_10",
  "secret_code", "score_10000",
]);

export default function AchievementCelebration() {
  const t = useTranslations("AchievementCelebration");
  const locale = useLocale();
  const [active, setActive] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      if (!MAJOR_IDS.has(id)) return;
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (!ach) return;
      setActive(ach);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
      setTimeout(() => setActive(null), 4500);
    };
    window.addEventListener("pythonkids:achievement", handler);
    return () => window.removeEventListener("pythonkids:achievement", handler);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setActive(null)}
      />
      <Confetti active={confetti} />
      <div className="relative achievement-popup bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 p-8 text-center max-w-xs mx-4 z-10">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl`}>
          {active.emoji}
        </div>
        <p className="text-xs font-extrabold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1">
          {t("unlocked")}
        </p>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">{lf(active, "name", locale)}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">{lf(active, "desc", locale)}</p>
        <button
          onClick={() => setActive(null)}
          className="mt-6 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
