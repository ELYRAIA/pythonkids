"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { lf } from "@/lib/localize";
import { Link } from "@/i18n/navigation";
import { getProgress, BADGES } from "@/lib/progress";
import { LEVELS } from "@/lib/levels";
import { LEVELS_DATA } from "@/lib/lessons";
import { getStreak } from "@/lib/streak";

const TOTAL_LESSONS = LEVELS.reduce((sum, l) => sum + l.lessons, 0);

interface NextLesson {
  levelId: number;
  lessonIndex: number;
  levelEmoji: string;
  levelName: string;
  levelColor: string;
  lessonTitle: string;
}

interface LastBadge {
  emoji: string;
  name: string;
  color: string;
}

export default function HomeResume() {
  const t = useTranslations("HomeResume");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [lastBadge, setLastBadge] = useState<LastBadge | null>(null);
  const [doneLessons, setDoneLessons] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      const progress = getProgress();
      setStreak(getStreak().currentStreak);
      setDoneLessons(Object.values(progress.completedLessons).flat().length);

      let found: NextLesson | null = null;
      for (const level of LEVELS) {
        const done = progress.completedLessons[String(level.id)] ?? [];
        if (done.length < level.lessons) {
          for (let i = 0; i < level.lessons; i++) {
            if (!done.includes(i)) {
              found = {
                levelId: level.id,
                lessonIndex: i,
                levelEmoji: level.emoji,
                levelName: lf(level, "name", locale),
                levelColor: level.color,
                lessonTitle: lf(LEVELS_DATA[String(level.id)]?.lessons[i] ?? { title: `${i + 1}` }, "title", locale),
              };
              break;
            }
          }
          if (found) break;
        }
      }
      setNextLesson(found);

      const earned = progress.earnedBadges;
      if (earned.length > 0) {
        const badge = BADGES.find((b) => b.id === earned[earned.length - 1]);
        if (badge) setLastBadge({ emoji: badge.emoji, name: badge.name, color: badge.color });
      }
    };
    load();
    window.addEventListener("pythonkids:progress", load);
    return () => window.removeEventListener("pythonkids:progress", load);
  }, []);

  if (!mounted || doneLessons === 0 || !nextLesson) return null;

  return (
    <section className="w-full px-6 pb-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
            {t("resume")}
          </h2>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-orange-500 font-bold text-sm">
              🔥 {streak} jour{streak > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Barre de progression globale */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{t("overall")}</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {t("lessons_count", { done: doneLessons, total: TOTAL_LESSONS })}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${Math.round((doneLessons / TOTAL_LESSONS) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/levels/${nextLesson.levelId}/lessons/${nextLesson.lessonIndex}`} className="flex-1">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-slate-600 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${nextLesson.levelColor} flex items-center justify-center text-xl shadow-sm shrink-0`}
                >
                  {nextLesson.levelEmoji}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    {t("level_lesson_badge", { level: nextLesson.levelId, lesson: nextLesson.lessonIndex + 1 })}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white leading-snug">
                    {nextLesson.lessonTitle}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                    {nextLesson.levelName} · {t("continue")}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="flex-1 sm:flex-none bg-purple-50 dark:bg-purple-900/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{doneLessons}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{doneLessons > 1 ? t("lesson_plural") : t("lesson_single")}</p>
            </div>
            {lastBadge && (
              <div
                className={`flex-1 sm:flex-none bg-gradient-to-br ${lastBadge.color} rounded-xl px-4 py-3 text-center min-w-[80px]`}
              >
                <p className="text-xl">{lastBadge.emoji}</p>
                <p className="text-xs text-white font-bold leading-tight">{lastBadge.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
