"use client";

import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import AppHeader from "@/components/AppHeader";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";
import LevelLessonsGrid from "@/components/LevelLessonsGrid";

export default function LevelPage() {
  const t = useTranslations("LevelPage");
  const params = useParams();
  const id = params.id as string;
  const level = LEVELS_DATA[id];

  if (!level) notFound();

  const levelMeta = LEVELS.find((l) => l.id === level.id);
  const hasNext = LEVELS.some((l) => l.id === level.id + 1);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-6 py-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
            {level.emoji}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            {t("title", { id: level.id, name: level.name })}
          </h1>
          {levelMeta && (
            <p className="text-sm text-gray-600 dark:text-slate-300 max-w-lg mx-auto mb-2">
              {levelMeta.description}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {t("lessons_count", { count: level.lessons.length })} · {levelMeta?.ages ?? ""} · {t("lesson_start_hint")}
          </p>
        </div>

        <div className={`rounded-2xl p-5 mb-8 bg-gradient-to-r ${level.color}`}>
          <h2 className="font-bold text-sm text-white mb-3 opacity-90">{t("what_you_learn")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {level.lessons.map((lesson, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white opacity-90">
                <span className="mt-0.5 shrink-0 font-bold">{i + 1}.</span>
                <span>{lesson.title}</span>
              </div>
            ))}
          </div>
        </div>

        <LevelLessonsGrid level={level} />

        <div className="mt-12 text-center">
          {hasNext ? (
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                {t("level_done", { id: level.id })}
              </p>
              <Link
                href={`/levels/${level.id + 1}`}
                className={`inline-block bg-gradient-to-r ${level.color} text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg`}
              >
                {t("next_level", { next: level.id + 1 })}
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-5xl mb-4">🏆</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t("congrats")}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{t("all_done")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/certificate"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  {t("get_certificate")}
                </Link>
                <Link
                  href="/leaderboard"
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  {t("see_leaderboard")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
