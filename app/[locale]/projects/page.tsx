"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { GUIDED_PROJECTS, getProjectStepsDone } from "@/lib/projects";
import { LEVELS } from "@/lib/levels";
import { lf } from "@/lib/localize";

export default function ProjectsPage() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p: Record<string, number> = {};
    for (const proj of GUIDED_PROJECTS) p[proj.id] = getProjectStepsDone(proj.id);
    setProgress(p);
  }, []);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-6 py-8 max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {t("label")}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">{t("title")}</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {GUIDED_PROJECTS.map((project) => {
            const level = LEVELS.find((l) => l.id === project.levelId);
            const done = mounted ? (progress[project.id] ?? 0) : 0;
            const total = project.steps.length;
            const pct = Math.round((done / total) * 100);
            const isComplete = done >= total;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.levelId}`}
                className="block bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-2xl shrink-0`}>
                    {project.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {level?.emoji} {t("level_badge", { id: project.levelId, name: level ? lf(level, "name", locale) : project.levelId })}
                      </span>
                      {isComplete && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">{t("completed")}</span>
                      )}
                    </div>
                    <h2 className="font-extrabold text-gray-800 dark:text-white text-base">{project.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${project.color} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 dark:text-slate-500 tabular-nums shrink-0">{t("steps", { done, total })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center pb-6">
          <Link href="/" className="text-sm text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
            {t("back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
