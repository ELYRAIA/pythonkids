"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LEVELS } from "@/lib/levels";
import { getProgress } from "@/lib/progress";

export default function AdventureMap() {
  const t = useTranslations("AdventureMap");
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const p = getProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedLessons(p.completedLessons);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEarnedBadges(p.earnedBadges);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const refresh = () => {
      const pr = getProgress();
      setCompletedLessons(pr.completedLessons);
      setEarnedBadges(pr.earnedBadges);
    };
    window.addEventListener("pythonkids:progress", refresh);
    return () => window.removeEventListener("pythonkids:progress", refresh);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Chemin zigzag */}
      <div className="relative">
        {LEVELS.map((level, idx) => {
          const done = mounted ? (completedLessons[String(level.id)]?.length ?? 0) : 0;
          const total = level.lessons;
          const pct = Math.round((done / total) * 100);
          const isComplete = mounted && done >= total;
          const isLocked = mounted && level.id > 0 && !earnedBadges.includes(`level_${level.id - 1}`);
          const isCurrent = mounted && !isComplete && !isLocked;
          const isRight = idx % 2 === 1;

          return (
            <div key={level.id} className="relative">
              {/* Connecteur vertical (sauf dernier) */}
              {idx < LEVELS.length - 1 && (
                <div className={`absolute ${isRight ? "right-12" : "left-12"} bottom-0 translate-y-full w-0.5 h-8 z-0 ${
                  isComplete ? "bg-gradient-to-b from-green-400 to-green-200" : "bg-gray-200 dark:bg-slate-700"
                }`} />
              )}

              {/* Carte niveau */}
              <div className={`flex items-center gap-4 mb-8 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
                {/* Node circulaire */}
                <Link href={isLocked ? "#" : `/levels/${level.id}`} className={isLocked ? "pointer-events-none" : ""}>
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg shrink-0 transition-all duration-300 ${
                      isComplete
                        ? `bg-gradient-to-br ${level.color} ring-4 ring-green-300 dark:ring-green-600 ring-offset-2`
                        : isCurrent
                        ? `bg-gradient-to-br ${level.color} ring-4 ring-white dark:ring-slate-700 ring-offset-2 hover:scale-110 animate-[pulse_3s_ease-in-out_infinite]`
                        : isLocked
                        ? "bg-gray-200 dark:bg-slate-700 grayscale"
                        : `bg-gradient-to-br ${level.color} hover:scale-110`
                    }`}
                  >
                    {isLocked ? "🔒" : level.emoji}
                    {isComplete && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                        ✓
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce" />
                    )}
                  </div>
                </Link>

                {/* Infos */}
                <Link
                  href={isLocked ? "#" : `/levels/${level.id}`}
                  className={`flex-1 ${isLocked ? "pointer-events-none opacity-50" : "group"}`}
                >
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 shadow-sm transition-all duration-200 ${
                    isComplete
                      ? "border-green-200 dark:border-green-700"
                      : isCurrent
                      ? "border-purple-200 dark:border-purple-700 group-hover:shadow-md group-hover:-translate-y-0.5"
                      : "border-gray-100 dark:border-slate-700"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Niveau {level.id}</span>
                        <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{level.ages}</span>
                      </div>
                      {isComplete && <span className="text-xs font-bold text-green-500">{t("completed")}</span>}
                      {isCurrent && done > 0 && <span className="text-xs font-bold text-purple-500">{pct}%</span>}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{level.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mb-2 line-clamp-2 leading-relaxed">{level.description}</p>

                    {/* Barre de progression */}
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mb-2">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${level.color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Étoiles par leçon (petits points) */}
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: total }, (_, i) => {
                        const lessonDone = mounted && (completedLessons[String(level.id)] ?? []).includes(i);
                        return (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              lessonDone
                                ? `bg-gradient-to-br ${level.color}`
                                : "bg-gray-200 dark:bg-slate-600"
                            }`}
                          />
                        );
                      })}
                      <span className="text-xs text-gray-400 dark:text-slate-500 ml-1 self-center">
                        {done}/{total}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA si tout terminé */}
      {mounted && earnedBadges.includes("all_levels") && (
        <div className="text-center py-4">
          <p className="text-2xl mb-2">🏆</p>
          <p className="font-bold text-gray-800 dark:text-white">{t("all_complete")}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t("completion_message")}</p>
        </div>
      )}
    </div>
  );
}
