"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getQuestState, refreshQuests } from "@/lib/quests";

export default function HomeQuestsWidget() {
  const t = useTranslations("HomeQuestsWidget");
  const [mounted, setMounted] = useState(false);
  const [claimable, setClaimable] = useState(0);
  const [claimed, setClaimed] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      refreshQuests();
      const { defs, progress } = getQuestState();
      let c = 0, d = 0;
      progress.forEach((p) => {
        if (p.claimed) d++;
        else if (p.completed) c++;
      });
      setClaimable(c);
      setClaimed(d);
      setTotal(defs.length);
    };
    load();
    window.addEventListener("pythonkids:progress", load);
    return () => window.removeEventListener("pythonkids:progress", load);
  }, []);

  if (!mounted || total === 0 || claimed === total) return null;

  return (
    <section className="w-full px-6 pb-4">
      <div className="max-w-2xl mx-auto">
        {claimable > 0 ? (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">📋</span>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">
                {claimable > 1 ? t("ready_plural", { count: claimable }) : t("ready", { count: claimable })}
              </p>
              <p className="text-orange-100 text-xs">{t("claim_hint")}</p>
            </div>
            <span className="text-white font-bold text-xl animate-bounce">↓</span>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700/40 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
            <span className="text-xl">📋</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 dark:text-white font-bold text-sm">
                {t("daily", { done: claimed, total })}
              </p>
              <div className="flex gap-1 mt-1.5">
                {Array.from({ length: total }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      i < claimed ? "bg-amber-400" : "bg-gray-100 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
