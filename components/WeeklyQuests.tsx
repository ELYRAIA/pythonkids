"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  getWeeklyQuestState, refreshWeeklyQuests, claimWeeklyQuest,
  computeWeeklyQuestProgress, getWeekDaysLeft,
  type WeeklyQuestDef, type WeeklyQuestProgress,
} from "@/lib/weeklyQuests";
import { getPendingChests, type Chest } from "@/lib/chests";
import ChestOpener from "./ChestOpener";

interface QuestWithProgress {
  def: WeeklyQuestDef;
  progress: WeeklyQuestProgress;
  current: number;
}

export default function WeeklyQuests() {
  const t = useTranslations("WeeklyQuests");
  const [quests, setQuests] = useState<QuestWithProgress[]>([]);
  const [mounted, setMounted] = useState(false);
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [activeChest, setActiveChest] = useState<Chest | null>(null);

  const load = useCallback(() => {
    refreshWeeklyQuests();
    const { defs, progress } = getWeeklyQuestState();
    setQuests(
      defs.map((def, i) => ({
        def,
        progress: progress[i] ?? { id: def.id, completed: false, claimed: false },
        current: Math.min(computeWeeklyQuestProgress(def), def.target),
      }))
    );
    setDaysLeft(getWeekDaysLeft());
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

  const handleClaim = (questId: string) => {
    const reward = claimWeeklyQuest(questId);
    if (reward !== 0) {
      setClaimedId(questId);
      setTimeout(() => setClaimedId(null), 2500);
      load();
      if (reward === -1) {
        const chests = getPendingChests();
        const newest = chests[chests.length - 1];
        if (newest) setTimeout(() => setActiveChest(newest), 300);
      }
    }
  };

  if (!mounted || quests.length === 0) return null;

  const allClaimed = quests.every((q) => q.progress.claimed);

  if (activeChest) {
    return (
      <ChestOpener
        chest={activeChest}
        onClose={() => setActiveChest(null)}
      />
    );
  }
  const completedCount = quests.filter((q) => q.progress.completed).length;

  return (
    <section className="w-full px-6 pb-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-white font-bold text-sm block leading-tight">{t("header")}</span>
              <span className="text-indigo-200 text-[11px]">{daysLeft === 0 ? t("last_day") : daysLeft > 1 ? t("days_remaining_plural", { days: daysLeft }) : t("days_remaining", { days: daysLeft })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">
              {completedCount}/{quests.length}
              {allClaimed && " ✓"}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-slate-700">
          {quests.map(({ def, progress, current }) => {
            const pct = Math.min(100, Math.round((current / def.target) * 100));
            const isJustClaimed = claimedId === def.id;

            return (
              <div key={def.id} className="px-5 py-3 flex items-center gap-3">
                <span className="text-2xl shrink-0">{def.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-800 dark:text-white truncate">{def.title}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0 ml-2">
                      {current}/{def.target}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 truncate">{def.desc}</p>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        progress.completed
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gradient-to-r from-indigo-400 to-purple-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {progress.claimed ? (
                  <span className="shrink-0 text-xs text-green-500 font-bold">✓</span>
                ) : progress.completed ? (
                  <button
                    onClick={() => handleClaim(def.id)}
                    className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      isJustClaimed
                        ? "bg-green-100 text-green-600"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 animate-pulse"
                    }`}
                  >
                    {isJustClaimed
                      ? (def.rewardType === "chest" ? "📦 Coffre !" : `+${def.reward} 💎`)
                      : (def.rewardType === "chest" ? t("claim_chest") : t("claim", { type: `${def.reward} 💎` }))}
                  </button>
                ) : (
                  <span className="shrink-0 text-xs text-gray-300 dark:text-slate-600 font-semibold">
                    {def.rewardType === "chest" ? "📦" : `+${def.reward}💎`}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
