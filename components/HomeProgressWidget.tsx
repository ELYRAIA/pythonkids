"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProgress } from "@/lib/progress";
import { LEVELS } from "@/lib/levels";

const TOTAL_LESSONS = LEVELS.reduce((sum, l) => sum + l.lessons, 0);

export default function HomeProgressWidget() {
  const t = useTranslations("HomeProgressWidget");
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      const p = getProgress();
      setDone(Object.values(p.completedLessons).flat().length);
    };
    load();
    window.addEventListener("pythonkids:progress", load);
    return () => window.removeEventListener("pythonkids:progress", load);
  }, []);

  if (!mounted || done === 0) return null;

  const pct = Math.round((done / TOTAL_LESSONS) * 100);

  return (
    <section className="w-full px-6 pb-4">
      <Link href="/stats">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
              {t("label")}
            </span>
            <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
              {t("lessons_pct", { done, total: TOTAL_LESSONS, pct })}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          {done === TOTAL_LESSONS && (
            <p className="text-xs text-yellow-500 dark:text-yellow-400 font-bold mt-1.5 text-center">
              {t("completion")}
            </p>
          )}
        </div>
      </Link>
    </section>
  );
}
