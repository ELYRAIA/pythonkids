"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getWeeklyQuestState, refreshWeeklyQuests, computeWeeklyQuestProgress, getWeekDaysLeft } from "@/lib/weeklyQuests";
import { Link } from "@/i18n/navigation";

export default function HomeWeeklyWidget() {
  const t = useTranslations("HomeWeeklyWidget");
  const [mounted, setMounted]       = useState(false);
  const [claimed, setClaimed]       = useState(0);
  const [claimable, setClaimable]   = useState(0);
  const [total, setTotal]           = useState(0);
  const [daysLeft, setDaysLeft]     = useState(0);
  // avg progress on uncompleted quests, 0-100
  const [avgProgress, setAvgProgress] = useState(0);

  const load = useCallback(() => {
    refreshWeeklyQuests();
    const { defs, progress } = getWeeklyQuestState();
    let d = 0, c = 0, sumPct = 0, pending = 0;
    defs.forEach((def, i) => {
      const p = progress[i];
      if (p?.claimed) { d++; return; }
      if (p?.completed) { c++; return; }
      const cur = computeWeeklyQuestProgress(def);
      sumPct += Math.min(100, (cur / def.target) * 100);
      pending++;
    });
    setClaimed(d);
    setClaimable(c);
    setTotal(defs.length);
    setDaysLeft(getWeekDaysLeft());
    setAvgProgress(pending > 0 ? Math.round(sumPct / pending) : 0);
  }, []);

  useEffect(() => {
    setMounted(true);
    load();
    window.addEventListener("pythonkids:progress", load);
    window.addEventListener("pythonkids:gems", load);
    return () => {
      window.removeEventListener("pythonkids:progress", load);
      window.removeEventListener("pythonkids:gems", load);
    };
  }, [load]);

  if (!mounted || total === 0) return null;
  // Hide if all done
  if (claimed === total && claimable === 0) return null;

  const done = claimed + claimable;

  return (
    <section className="w-full px-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" scroll={false}>
          {claimable > 0 ? (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:opacity-95 transition-opacity">
              <span className="text-2xl">📅</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">
                  {claimable > 1 ? t("ready_plural", { count: claimable }) : t("ready", { count: claimable })}
                </p>
                <p className="text-indigo-100 text-xs">{t("claim_hint")}</p>
              </div>
              <span className="text-white font-bold text-xl animate-bounce">↓</span>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700/40 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="text-xl">📅</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-800 dark:text-white font-bold text-sm">
                    {t("quests", { done, total })}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0 ml-2">
                    {daysLeft === 0 ? t("last_day") : t("days_left", { days: daysLeft })}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.round((done / total) * 100)}%` }}
                  />
                </div>
                {avgProgress > 0 && done < total && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    {t("progress_avg", { percent: avgProgress })}
                  </p>
                )}
              </div>
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}
