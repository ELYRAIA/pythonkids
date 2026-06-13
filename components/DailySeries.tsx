"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  getDailySeries, canClaimNext, msUntilNext, claimSeriesChest,
  SERIES_MAX, SLOT_LEVELS,
} from "@/lib/dailySeries";
import {
  addChest, getPendingChests, getLevelRarity,
  CHEST_EMOJI_BY_RARITY, RARITY_COLORS, RARITY_LABELS, type Chest,
} from "@/lib/chests";

interface Props {
  onChestReady?: (chest: Chest) => void;
}

function formatMs(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function DailySeries({ onChestReady }: Props) {
  const t = useTranslations("DailySeries");
  const [claimed, setClaimed] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [msLeft, setMsLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    const s = getDailySeries();
    setClaimed(s.claimed);
    setCanClaim(canClaimNext());
    setMsLeft(msUntilNext());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleClaim = useCallback(() => {
    const levelId = claimSeriesChest();
    if (levelId === -1) return;
    addChest(levelId);
    refresh();
    if (onChestReady) {
      const chests = getPendingChests();
      const newest = chests[chests.length - 1];
      if (newest) onChestReady(newest);
    }
  }, [refresh, onChestReady]);

  if (!mounted) return null;

  const allDone = claimed >= SERIES_MAX;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="min-w-0">
          <p className="text-base font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
            {t("title")}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {allDone
              ? t("come_back_tomorrow")
              : t("chests_today", { claimed, total: SERIES_MAX })}
          </p>
        </div>

        {!allDone && canClaim && (
          <button
            onClick={handleClaim}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90 transition-opacity shadow-md daily-claim-pulse"
          >
            {t("claim_button")}
          </button>
        )}

        {!allDone && !canClaim && msLeft > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wide font-semibold">{t("next_in")}</p>
            <p className="text-xl font-extrabold text-orange-500 tabular-nums leading-none">{formatMs(msLeft)}</p>
          </div>
        )}
      </div>

      {/* 10 slots */}
      <div className="flex gap-1.5">
        {Array.from({ length: SERIES_MAX }, (_, i) => {
          const levelId = SLOT_LEVELS[i];
          const rarity = getLevelRarity(levelId);
          const chestEmoji = CHEST_EMOJI_BY_RARITY[rarity];
          const isClaimed = i < claimed;
          const isAvailable = i === claimed && canClaim && !allDone;
          const isNext = i === claimed && !canClaim && !allDone;

          return (
            <div
              key={i}
              onClick={isAvailable ? handleClaim : undefined}
              title={
                isClaimed
                  ? t("chest_claimed", { n: i + 1, rarity: RARITY_LABELS[rarity] })
                  : isAvailable
                    ? t("chest_available", { n: i + 1 })
                    : isNext
                      ? t("chest_next", { n: i + 1, time: formatMs(msLeft) })
                      : t("chest_locked", { n: i + 1 })
              }
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border-2 transition-all ${
                isClaimed
                  ? `bg-gradient-to-br ${RARITY_COLORS[rarity]} border-transparent`
                  : isAvailable
                    ? "bg-yellow-50 dark:bg-yellow-900/25 border-yellow-400 dark:border-yellow-500 cursor-pointer daily-slot-available"
                    : isNext
                      ? "bg-gray-50 dark:bg-slate-700/50 border-gray-300 dark:border-slate-500"
                      : "bg-gray-50 dark:bg-slate-800/60 border-gray-100 dark:border-slate-700 opacity-45"
              }`}
            >
              <span className="text-base leading-none">
                {isClaimed ? "✅" : isAvailable ? chestEmoji : isNext ? chestEmoji : "🔒"}
              </span>
              <span className={`text-[9px] font-extrabold tabular-nums ${
                isClaimed ? "text-white/90" : "text-gray-400 dark:text-slate-500"
              }`}>
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>

      {allDone && (
        <p className="text-center text-sm font-bold text-yellow-600 dark:text-yellow-400 mt-3">
          {t("all_done")}
        </p>
      )}
    </div>
  );
}
