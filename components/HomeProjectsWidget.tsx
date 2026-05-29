"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GUIDED_PROJECTS, getProjectStepsDone } from "@/lib/projects";

export default function HomeProjectsWidget() {
  const t = useTranslations("HomeProjectsWidget");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p: Record<string, number> = {};
    for (const proj of GUIDED_PROJECTS) p[proj.id] = getProjectStepsDone(proj.id);
    setProgress(p);
  }, []);

  const nextProject = GUIDED_PROJECTS.find((p) => (progress[p.id] ?? 0) < p.steps.length);
  const totalDone = GUIDED_PROJECTS.filter((p) => (progress[p.id] ?? 0) >= p.steps.length).length;

  return (
    <section className="w-full px-6 pb-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-gray-800 dark:text-white">{t("title")}</h2>
          </div>
          <Link href="/projects" className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline">
            {t("all_link")}
          </Link>
        </div>

        {mounted && nextProject ? (
          <Link href={`/projects/${nextProject.levelId}`} className="flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${nextProject.color} flex items-center justify-center text-xl shrink-0`}>
              {nextProject.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{nextProject.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${nextProject.color} transition-all`}
                    style={{ width: `${Math.round(((progress[nextProject.id] ?? 0) / nextProject.steps.length) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">
                  {progress[nextProject.id] ?? 0}/{nextProject.steps.length}
                </span>
              </div>
            </div>
            <span className="text-purple-400 group-hover:translate-x-1 transition-transform text-sm shrink-0">→</span>
          </Link>
        ) : (
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {totalDone === GUIDED_PROJECTS.length ? t("completed_all") : t("start")}
          </p>
        )}

        {mounted && (
          <div className="mt-3 flex items-center gap-1.5">
            {GUIDED_PROJECTS.map((p) => {
              const done = progress[p.id] ?? 0;
              const isComplete = done >= p.steps.length;
              const isInProgress = done > 0 && !isComplete;
              return (
                <div
                  key={p.id}
                  title={p.title}
                  className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center transition-all
                    ${isComplete ? "bg-green-100 dark:bg-green-900/30" : isInProgress ? "bg-purple-100 dark:bg-purple-900/30" : "bg-gray-100 dark:bg-slate-700"}`}
                >
                  {isComplete ? "✓" : p.emoji}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
