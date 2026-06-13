"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LEVELS } from "@/lib/levels";
import { getProgress } from "@/lib/progress";
import { lf } from "@/lib/localize";

export default function HomeLevelCards() {
  const locale = useLocale();
  const t = useTranslations("HomeLevelCards");
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [animPercentMap, setAnimPercentMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const p = getProgress();
    setCompletedLessons(p.completedLessons);
    setEarnedBadges(p.earnedBadges);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const map: Record<number, number> = {};
    for (const level of LEVELS) {
      const done = completedLessons[String(level.id)]?.length ?? 0;
      map[level.id] = Math.round((done / level.lessons) * 100);
    }
    const t = setTimeout(() => setAnimPercentMap(map), 80);
    return () => clearTimeout(t);
  }, [mounted, completedLessons]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {LEVELS.map((level) => {
        const done = mounted ? (completedLessons[String(level.id)]?.length ?? 0) : 0;
        const total = level.lessons;
        const percent = Math.round((done / total) * 100);
        const isComplete = mounted && done >= total;
        const isLocked = mounted && level.id > 0 && !earnedBadges.includes(`level_${level.id - 1}`);

        return (
          <Link key={level.id} href={`/levels/${level.id}`}>
            <div
              className={`${level.bg} ${level.darkBg} ${level.border} ${level.darkBorder} border-2 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full relative`}
            >
              {/* Badge complété */}
              {isComplete && (
                <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow">
                  ✓
                </div>
              )}
              {/* Badge verrouillé */}
              {!isComplete && isLocked && (
                <div className="absolute top-3 right-3 text-gray-400 dark:text-slate-500 rounded-full w-7 h-7 flex items-center justify-center text-base">
                  🔒
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                {level.emoji}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  {t("level_prefix")} {level.id}
                </span>
                <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-full text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 font-medium">
                  {lf(level, "ages", locale)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{lf(level, "name", locale)}</h3>
              <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">{lf(level, "description", locale)}</p>

              {/* Barre de progression */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-400 dark:text-slate-500">{done}/{total} {t("lessons")}</span>
                  {done > 0 && (
                    <span className="text-gray-400 dark:text-slate-500">{percent}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${level.color} transition-all duration-700`}
                    style={{ width: `${animPercentMap[level.id] ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <span className={`text-sm font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                  {isComplete ? t("review") : done > 0 ? t("continue_cta") : t("start")}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
