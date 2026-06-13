"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { lf } from "@/lib/localize";
import { getProgress } from "@/lib/progress";
import { getStreak } from "@/lib/streak";
import { getXPInfo } from "@/lib/xp";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";

export default function HomeBanner() {
  const t = useTranslations("HomeBanner");
  const tg = useTranslations("GlobalUI");
  const locale = useLocale();

  const streakMessage = (streak: number): { msg: string; emoji: string } => {
    if (streak === 0) return { msg: tg("start_series"), emoji: "💤" };
    if (streak === 1) return { msg: tg("first_day"), emoji: "🌱" };
    if (streak < 5)  return { msg: tg("streak_continue", { streak }), emoji: "🔥" };
    if (streak < 10) return { msg: tg("streak_unstoppable", { streak }), emoji: "⚡" };
    return { msg: tg("streak_legendary", { streak }), emoji: "🌟" };
  };

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState(0);
  const [nextLesson, setNextLesson] = useState<{ levelId: number; lessonIdx: number; title: string; levelColor: string; levelEmoji: string } | null>(null);
  const [levelProgress, setLevelProgress] = useState({ done: 0, total: 1, levelName: "", levelId: 0 });
  const [xpRank, setXpRank] = useState("");

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem("pythonkids_username") ?? "";
    setUsername(name);

    const s = getStreak();
    setStreak(s.currentStreak);

    const progress = getProgress();
    const { rank } = getXPInfo();
    setXpRank(`${rank.emoji} ${rank.title}`);

    // Find current level and next lesson
    let found = false;
    for (const level of LEVELS) {
      const done = progress.completedLessons[String(level.id)] ?? [];
      const lvlData = LEVELS_DATA[String(level.id)];
      if (!lvlData) continue;
      const total = lvlData.lessons.length;

      setLevelProgress({ done: done.length, total, levelName: level.name, levelId: level.id });

      // Find first incomplete lesson
      if (!found) {
        for (let i = 0; i < total; i++) {
          if (!done.includes(i)) {
            setNextLesson({
              levelId: level.id,
              lessonIdx: i,
              title: lvlData.lessons[i].title,
              levelColor: lvlData.color,
              levelEmoji: level.emoji,
            });
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
  }, []);

  if (!mounted) return null;

  const { msg: streakMsg, emoji: streakEmoji } = streakMessage(streak);
  const pct = Math.round((levelProgress.done / levelProgress.total) * 100);

  return (
    <section className="w-full px-6 pb-2">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Header greeting */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-gray-800 dark:text-white leading-tight truncate">
              {username ? t("greeting", { name: username }) : t("welcome")}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{xpRank}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-orange-50 dark:bg-orange-900/20 rounded-full px-3 py-1.5">
            <span className="text-base">{streakEmoji}</span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streakMsg}</span>
          </div>
        </div>

        {/* Niveau actuel */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
              {t("level_name", { id: levelProgress.levelId, name: lf(LEVELS.find(l => l.id === levelProgress.levelId) ?? { name: levelProgress.levelName }, "name", locale) })}
            </span>
            <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">
              {t("level_progress", { done: levelProgress.done, total: levelProgress.total, percent: pct })}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Prochaine leçon */}
        {nextLesson && (
          <div className="px-5 pb-4">
            <Link
              href={`/levels/${nextLesson.levelId}/lessons/${nextLesson.lessonIdx}`}
              className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl px-4 py-3 border border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${nextLesson.levelColor} shrink-0`}>
                {nextLesson.levelEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">{t("next_lesson")}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{nextLesson.title}</p>
              </div>
              <span className="text-purple-400 group-hover:translate-x-1 transition-transform shrink-0">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
