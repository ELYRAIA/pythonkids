"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { CHALLENGES } from "@/lib/challenges";
import { getFailedChallenges, clearMistake } from "@/lib/mistakes";
import { getCompletedChallenges } from "@/lib/challenges";

export default function MistakesPage() {
  const t = useTranslations("Mistakes");
  const [failures, setFailures] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = () => {
    setFailures(getFailedChallenges());
    setCompleted(getCompletedChallenges());
  };

  useEffect(() => {
    setMounted(true);
    refresh();
  }, []);

  const failedChallenges = mounted
    ? CHALLENGES.filter((c) => !completed.includes(c.id) && (failures[c.id] ?? 0) > 0)
    : [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-6 py-8 max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/challenges" className="text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 text-sm">
            {t("back")}
          </Link>
        </div>

        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🔴</p>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">{t("title")}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {!mounted && (
          <p className="text-center text-gray-400 animate-pulse">{t("loading")}</p>
        )}

        {mounted && failedChallenges.length === 0 && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-bold text-green-700 dark:text-green-400 text-lg mb-1">{t("none")}</p>
            <p className="text-sm text-green-600 dark:text-green-500">
              {t("none_desc")}
            </p>
            <Link
              href="/challenges"
              className="inline-block mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {t("see_all")}
            </Link>
          </div>
        )}

        {mounted && failedChallenges.length > 0 && (
          <>
            {/* Résumé */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              {(["Facile", "Moyen", "Difficile"] as const).map((d) => {
                const count = failedChallenges.filter((c) => c.difficulty === d).length;
                const colors: Record<string, string> = { Facile: "text-green-600 dark:text-green-400", Moyen: "text-yellow-600 dark:text-yellow-400", Difficile: "text-purple-600 dark:text-purple-400" };
                return (
                  <div key={d} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 text-center">
                    <p className={`text-xl font-extrabold ${colors[d]}`}>{count}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{d}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {failedChallenges.map((challenge) => {
                const count = failures[challenge.id] ?? 0;
                const showHint = count >= 3;
                return (
                  <div
                    key={challenge.id}
                    className="bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/40 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl shrink-0 mt-0.5">{challenge.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-800 dark:text-white text-sm">{challenge.title}</p>
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${challenge.difficultyColor}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 leading-relaxed">{challenge.description}</p>
                        {showHint && (
                          <div className="flex items-start gap-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-2.5 py-1.5 mb-2">
                            <span className="text-xs">💡</span>
                            <p className="text-xs text-amber-700 dark:text-amber-400">{challenge.hint}</p>
                          </div>
                        )}
                        <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                          {count > 1 ? t("attempts_plural", { count }) : t("attempts", { count })}
                          {showHint ? "" : t("hint_available", { n: 3 - count })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => { clearMistake(challenge.id); refresh(); }}
                          className="text-xs text-gray-300 dark:text-slate-600 hover:text-red-400 transition-colors"
                          title={t("remove_from_list")}
                        >
                          ✕
                        </button>
                        <Link
                          href={`/challenges/${challenge.id}`}
                          className={`bg-gradient-to-r ${challenge.difficultyColor} text-white px-4 py-2 rounded-full text-xs font-bold hover:opacity-90 transition-opacity`}
                        >
                          {t("retry")}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    failedChallenges.forEach((c) => clearMistake(c.id));
                    refresh();
                  }}
                  className="text-xs text-gray-400 dark:text-slate-500 hover:text-red-400 transition-colors"
                >
                  {t("clear_all")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
