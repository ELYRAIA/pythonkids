"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getMastery, lessonKey } from "@/lib/mastery";
import { getProgress } from "@/lib/progress";
import { LEVELS_DATA } from "@/lib/lessons";

interface RevisionLesson {
  levelId: number;
  lessonIndex: number;
  title: string;
  stars: number;
}

function getRevisionLessons(): RevisionLesson[] {
  const mastery = getMastery();
  const { completedLessons } = getProgress();
  const result: RevisionLesson[] = [];

  for (const [levelIdStr, levelData] of Object.entries(LEVELS_DATA)) {
    const levelId = parseInt(levelIdStr);
    const done = completedLessons[levelIdStr] ?? [];
    levelData.lessons.forEach((lesson, i) => {
      if (!done.includes(i)) return;
      const stars = mastery[lessonKey(levelId, i)] ?? 0;
      if (stars < 3) {
        result.push({ levelId, lessonIndex: i, title: lesson.title, stars });
      }
    });
  }

  // Sort by stars ascending (weakest first), limit to 3
  result.sort((a, b) => a.stars - b.stars);
  return result.slice(0, 3);
}

export default function HomeRevisionWidget() {
  const t = useTranslations("HomeRevisionWidget");
  const [lessons, setLessons] = useState<RevisionLesson[]>([]);

  useEffect(() => {
    const load = () => setLessons(getRevisionLessons());
    load();
    window.addEventListener("pythonkids:progress", load);
    return () => window.removeEventListener("pythonkids:progress", load);
  }, []);

  if (lessons.length === 0) return null;

  return (
    <section className="w-full px-6 pb-4">
      <div className="max-w-2xl mx-auto bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔄</span>
          <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm">{t("title")}</span>
          <span className="ml-auto text-xs text-amber-500 dark:text-amber-500">{lessons.length > 1 ? t("suggested_plural", { count: lessons.length }) : t("suggested", { count: lessons.length })}</span>
        </div>
        <div className="flex flex-col gap-2">
          {lessons.map(({ levelId, lessonIndex, title, stars }) => (
            <Link
              key={`${levelId}_${lessonIndex}`}
              href={`/levels/${levelId}/lessons/${lessonIndex}`}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-amber-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm shrink-0">
                {levelId}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 dark:text-white truncate">{title}</p>
                <p className="text-xs text-amber-500">
                  {"⭐".repeat(stars)}{"☆".repeat(3 - stars)}
                </p>
              </div>
              <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform text-sm shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
