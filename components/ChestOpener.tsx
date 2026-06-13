"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Chest, ChestReward,
  getLevelRarity, CHEST_EMOJI_BY_RARITY, CHEST_GLOW_BY_RARITY,
  RARITY_COLORS, RARITY_LABELS, RARITY_BORDER,
  saveRevealedCount, claimChest,
} from "@/lib/chests";
import Confetti from "./Confetti";
import { playChestOpenSound, playGemSound } from "@/lib/sounds";

interface Props {
  chest: Chest;
  onClose: () => void;
}

function RewardSlot({ reward, revealed, t }: { reward: ChestReward; revealed: boolean; t: ReturnType<typeof useTranslations> }) {
  if (!revealed) {
    return (
      <div className="w-24 h-28 rounded-2xl bg-gray-800 border-2 border-gray-600 flex flex-col items-center justify-center gap-1 shrink-0">
        <span className="text-3xl">❓</span>
        <span className="text-xs text-gray-400 font-medium">{t("mystery")}</span>
      </div>
    );
  }

  const isStars = reward.type === "stars";
  const isGems  = reward.type === "gems";
  const gradient = isStars ? "from-yellow-400 to-amber-500" : isGems ? "from-teal-400 to-cyan-500" : RARITY_COLORS[reward.rarity];
  const border   = isStars ? "border-yellow-300"            : isGems ? "border-teal-300"            : RARITY_BORDER[reward.rarity];

  return (
    <div className={`w-24 h-28 rounded-2xl bg-gradient-to-br ${gradient} border-2 ${border} flex flex-col items-center justify-center gap-1 shrink-0 slot-reveal-anim shadow-lg`}>
      <span className="text-3xl">{reward.emoji}</span>
      <span className="text-xs font-bold text-white text-center leading-tight px-1">{reward.name}</span>
      {!isStars && !isGems && (
        <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold text-white">
          {reward.type === "head" ? t("head_label") : RARITY_LABELS[reward.rarity]}
        </span>
      )}
    </div>
  );
}

export default function ChestOpener({ chest, onClose }: Props) {
  const t = useTranslations("ChestOpener");
  const [revealedCount, setRevealedCount] = useState(chest.revealedCount);
  const [slotRevealKeys, setSlotRevealKeys] = useState<number[]>(() => chest.rewards.map((_, i) => (i < chest.revealedCount ? 1 : 0)));
  const [confetti, setConfetti] = useState(false);
  const chestRef = useRef<HTMLDivElement>(null);
  const totalRewards = chest.rewards.length;
  const allRevealed = revealedCount >= totalRewards;
  const rarity = getLevelRarity(chest.levelId);
  const chestEmoji = CHEST_EMOJI_BY_RARITY[rarity];
  const chestGlow = CHEST_GLOW_BY_RARITY[rarity];

  // Init idle float on mount
  useEffect(() => {
    const el = chestRef.current;
    if (el) el.style.animation = "chest-idle-float 2.5s ease-in-out infinite";
  }, []);

  const triggerBounce = useCallback((done: boolean) => {
    const el = chestRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth; // force reflow
    el.style.animation = "chest-bounce 0.5s cubic-bezier(0.34,1.56,0.64,1)";
    setTimeout(() => {
      if (el) el.style.animation = done ? "none" : "chest-idle-float 2.5s ease-in-out infinite";
    }, 520);
  }, []);

  const handleChestClick = () => {
    if (allRevealed) return;
    const newCount = revealedCount + 1;
    const done = newCount >= totalRewards;
    triggerBounce(done);
    setRevealedCount(newCount);
    setSlotRevealKeys((keys) => keys.map((k, i) => (i === newCount - 1 ? k + 1 : k)));
    saveRevealedCount(chest.id, newCount);
    const reward = chest.rewards[newCount - 1];
    if (reward?.type === "gems") {
      playGemSound();
    } else {
      playChestOpenSound();
    }
    if (done) {
      setTimeout(() => {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 100);
      }, 200);
    }
  };

  const handleClaim = () => {
    claimChest(chest.id);
    onClose();
  };

  const remaining = totalRewards - revealedCount;

  const cardGradient: Record<string, string> = {
    common:    "from-gray-700 to-slate-800",
    rare:      "from-blue-900 to-cyan-900",
    epic:      "from-purple-900 to-violet-900",
    legendary: "from-yellow-900 to-amber-900",
  };

  return (
    <>
      <div className="fixed inset-0 z-[350] flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={allRevealed ? undefined : handleChestClick} />

        {/* Modal card */}
        <div className={`relative z-10 bg-gradient-to-br ${cardGradient[rarity]} rounded-3xl p-8 shadow-2xl text-white text-center max-w-sm w-full mx-4 border border-white/10`}>

          {/* Header */}
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
            {t("header", { level: chest.levelId })}
          </p>
          <p className={`text-sm font-extrabold mb-6 bg-gradient-to-r ${RARITY_COLORS[rarity]} bg-clip-text text-transparent`}>
            {RARITY_LABELS[rarity]}
          </p>

          {/* Chest */}
          <div
            ref={chestRef}
            className={`text-8xl mb-3 inline-block cursor-pointer select-none ${chestGlow} rounded-full`}
            onClick={handleChestClick}
            title={allRevealed ? t("all_revealed_title") : t("click_to_open")}
          >
            {allRevealed ? "🎁" : chestEmoji}
          </div>

          {/* Status text */}
          <p className="text-sm font-semibold opacity-80 mb-6 h-5">
            {allRevealed
              ? t("all_revealed")
              : remaining === totalRewards
                ? t("click_to_open")
                : remaining > 1
                  ? t("clicks_remaining_plural", { count: remaining })
                  : t("clicks_remaining", { count: remaining })}
          </p>

          {/* Reward slots */}
          <div className="flex gap-3 justify-center mb-6">
            {chest.rewards.map((reward, i) => (
              // key inclut slotRevealKeys[i] pour remonter le composant à chaque révélation → animation rejoue
              <RewardSlot
                key={`${i}-${slotRevealKeys[i]}`}
                reward={reward}
                revealed={i < revealedCount}
                t={t}
              />
            ))}
          </div>

          {/* Claim button */}
          {allRevealed ? (
            <button
              onClick={handleClaim}
              className={`w-full py-3 rounded-full text-sm font-extrabold bg-gradient-to-r ${RARITY_COLORS[rarity]} hover:opacity-90 transition-opacity shadow-lg`}
            >
              {t("claim_all")}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              {t("close_without_opening")}
            </button>
          )}
        </div>
      </div>

      <Confetti active={confetti} />
    </>
  );
}
