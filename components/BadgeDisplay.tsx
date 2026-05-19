"use client";

import { useState, useEffect } from "react";
import { BADGES, getProgress, type Badge } from "@/lib/progress";

export default function BadgeDisplay() {
  const [earned, setEarned] = useState<Badge[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    const progress = getProgress();
    setEarned(BADGES.filter((b) => progress.earnedBadges.includes(b.id)));
  }, []);

  if (earned.length === 0) return null;

  return (
    <section className="w-full px-6 py-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          🏅 Mes badges{" "}
          <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold">
            {earned.length}/{BADGES.length}
          </span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {BADGES.map((badge) => {
            const isEarned = earned.some((b) => b.id === badge.id);
            const isOpen = tooltip === badge.id;
            return (
              <div key={badge.id} className="relative">
                <button
                  onMouseEnter={() => setTooltip(badge.id)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => setTooltip(isOpen ? null : badge.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    isEarned
                      ? `border-transparent bg-gradient-to-br ${badge.color} text-white shadow-md hover:scale-105`
                      : "border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all"
                  }`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-xs font-bold text-center leading-tight max-w-16">{badge.name}</span>
                </button>

                {/* Tooltip */}
                {isOpen && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-44 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl pointer-events-none">
                    <p className="font-bold mb-0.5">{isEarned ? "✓ Badge obtenu !" : "🔒 Pas encore…"}</p>
                    <p className="opacity-80 leading-snug">{badge.desc}</p>
                    {/* Flèche */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 text-center">
          Clique sur un badge pour voir comment l&apos;obtenir
        </p>
      </div>
    </section>
  );
}
