"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import AppHeader from "@/components/AppHeader";
import {
  getBattlePassState,
  getBPXPInfo,
  activatePremium,
  claimFreeReward,
  claimPremiumReward,
  BP_LEVELS,
  BP_XP_PER_LEVEL,
  BP_MAX_LEVEL,
  BP_SEASON,
  BP_SEASON_END,
  type BPReward,
  type BattlePassState,
} from "@/lib/battlePass";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { RARITY_COLORS_SHOP } from "@/lib/shop";
import { apiFetch } from "@/lib/api";
import { PAYMENTS_ENABLED } from "@/lib/features";

const CHEST_EMOJIS = ["📦", "📫", "💜", "✨"];

function RewardCard({ reward, claimed, locked }: { reward: BPReward; claimed: boolean; locked: boolean }) {
  const t = useTranslations("BattlePass");
  const rarityGradient = reward.itemRarity ? RARITY_COLORS_SHOP[reward.itemRarity] : null;

  const content = () => {
    if (reward.type === "gems") return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-2xl">💎</span>
        <span className="text-xs font-bold text-cyan-400">+{reward.gems}</span>
      </div>
    );
    if (reward.type === "chest") return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-2xl">{CHEST_EMOJIS[reward.chestLevel ?? 0]}</span>
        <span className="text-[10px] font-bold text-gray-400">{t(`chest_${reward.chestLevel ?? 0}`)}</span>
      </div>
    );
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-2xl">{reward.itemEmoji}</span>
        <span className="text-[10px] font-semibold text-center leading-tight text-gray-300 max-w-[56px] truncate">{reward.itemName}</span>
      </div>
    );
  };

  return (
    <div className={`relative w-[72px] h-[72px] rounded-xl flex items-center justify-center border-2 transition-all
      ${claimed
        ? "bg-gray-800/60 border-gray-700 opacity-50"
        : locked
        ? "bg-gray-900/60 border-gray-700 opacity-40"
        : rarityGradient
        ? `bg-gradient-to-br ${rarityGradient} border-transparent shadow-lg`
        : "bg-slate-700/80 border-slate-600 shadow-md"
      }`}
    >
      {content()}
      {claimed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
          <span className="text-green-400 text-xl font-black">✓</span>
        </div>
      )}
      {locked && !claimed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <span className="text-gray-500 text-lg">🔒</span>
        </div>
      )}
    </div>
  );
}

export default function BattlePassPage() {
  const t = useTranslations("BattlePass");
  const [state, setState] = useState<BattlePassState | null>(null);
  const [xpInfo, setXpInfo] = useState({ levelXP: 0, xpToNext: BP_XP_PER_LEVEL, progress: 0, currentLevel: 0 });
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  const daysLeft = Math.max(0, Math.ceil((new Date(BP_SEASON_END).getTime() - Date.now()) / 86400000));

  const refresh = () => {
    setState(getBattlePassState());
    setXpInfo(getBPXPInfo());
  };

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("pythonkids:battlepass", onUpdate);
    return () => {
      window.removeEventListener("pythonkids:battlepass", onUpdate);
    };
  }, []);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state?.currentLevel]);

  if (!state) return null;

  const currentLevel = state.currentLevel;

  const handleClaimFree = (level: number) => { claimFreeReward(level); };
  const handleClaimPremium = (level: number) => { claimPremiumReward(level); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <AppHeader />

      {/* Header du pass */}
      <div className="w-full px-4 py-8 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold">
            ⚔️ {t("season")}
          </div>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${
            daysLeft <= 7
              ? "bg-red-500/10 border-red-500/40 text-red-400"
              : daysLeft <= 30
              ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
              : "bg-slate-700/60 border-slate-600 text-gray-400"
          }`}>
            ⏳ {daysLeft > 0 ? t("days_left", { days: daysLeft }) : t("season_ended")}
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {t("title").split(" ").map((word, i) =>
            i === 2 ? <span key={i} className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{word}</span> : <span key={i}>{word} </span>
          )}
        </h1>
        <p className="text-sm text-gray-400 mb-6">{t("subtitle")}</p>

        {/* Niveau + XP bar */}
        <div className="max-w-lg mx-auto bg-slate-800/80 rounded-2xl p-5 border border-slate-700 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{currentLevel}</div>
              <div className="text-xs text-gray-500">{t("current_level")}</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{xpInfo.levelXP} XP</span>
                <span>{BP_XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${xpInfo.progress}%` }}
                />
              </div>
              {currentLevel < BP_MAX_LEVEL && (
                <div className="text-xs text-gray-500 mt-1 text-center">{t("xp_to_next", { xp: xpInfo.xpToNext, level: currentLevel + 1 })}</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-gray-500">{BP_MAX_LEVEL}</div>
              <div className="text-xs text-gray-600">{t("max_level")}</div>
            </div>
          </div>
        </div>

        {/* Sources d'XP */}
        <div className="max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs text-gray-400">
          {[
            { label: t("xp_source_lesson"), xp: 50 }, { label: t("xp_source_challenge"), xp: 75 },
            { label: t("xp_source_quest"), xp: 100 }, { label: t("xp_source_duel"), xp: 100 },
          ].map((src) => (
            <div key={src.label} className="bg-slate-800/60 rounded-lg px-2 py-1.5 border border-slate-700 flex items-center justify-between gap-1">
              <span>{src.label}</span>
              <span className="font-bold text-yellow-400">+{src.xp} XP</span>
            </div>
          ))}
        </div>

        {/* Bouton premium (masqué en mode « tout gratuit » sans PayPal) */}
        {!state.isPremium && PAYMENTS_ENABLED && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">
              {t("premium_price")}
            </p>
            {paypalError && (
              <p className="text-xs text-red-400">{paypalError}</p>
            )}
            <div className="w-72">
              <PayPalScriptProvider
                options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "EUR" }}
              >
                <PayPalButtons
                  style={{ layout: "horizontal", color: "gold", shape: "pill", label: "pay", height: 40 }}
                  createOrder={async () => {
                    setPaypalError(null);
                    const res = await apiFetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ packId: "premium_bp" }),
                    });
                    const data = await res.json() as { id?: string; error?: string };
                    if (!data.id) throw new Error(data.error ?? t("premium_error"));
                    return data.id;
                  }}
                  onApprove={async (data) => {
                    const res = await apiFetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderID: data.orderID }),
                    });
                    const result = await res.json() as { premium?: boolean; error?: string };
                    if (result.premium) {
                      activatePremium();
                    } else {
                      setPaypalError(result.error ?? "Paiement non confirmé");
                    }
                  }}
                  onError={() => setPaypalError(t("premium_retry"))}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}
        {state.isPremium && (
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold">
            {t("premium_activated")}
          </div>
        )}
      </div>

      {/* Légende des tracks */}
      <div className="max-w-4xl mx-auto px-4 mb-4 flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-600" /> {t("legend_free")}</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-500 to-orange-500" /> {t("legend_premium")}</div>
        <div className="flex items-center gap-1.5"><span className="text-green-400">✓</span> {t("legend_claimed")}</div>
        <div className="flex items-center gap-1.5"><span>🔒</span> {t("legend_locked")}</div>
      </div>

      {/* Liste des niveaux */}
      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-2">
        {BP_LEVELS.map(({ level, freeReward, premiumReward }) => {
          const isUnlocked = level <= currentLevel;
          const isCurrentLevel = level === currentLevel + 1;
          const freeClaimed = state.claimedFree.includes(level);
          const premClaimed = state.claimedPremium.includes(level);
          const canClaimFree = isUnlocked && !freeClaimed;
          const canClaimPrem = isUnlocked && state.isPremium && !premClaimed;

          return (
            <div
              key={level}
              ref={isCurrentLevel ? currentRef : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all
                ${isUnlocked
                  ? "bg-slate-800/60 border-slate-700"
                  : isCurrentLevel
                  ? "bg-slate-800/80 border-yellow-500/50 shadow-yellow-500/10 shadow-lg"
                  : "bg-slate-900/40 border-slate-800"
                }`}
            >
              {/* Numéro de niveau */}
              <div className={`w-10 text-center shrink-0 font-black text-lg
                ${isUnlocked ? "text-white" : isCurrentLevel ? "text-yellow-400" : "text-gray-600"}`}
              >
                {level}
              </div>

              {/* Barre XP (niveau courant) */}
              {isCurrentLevel && (
                <div className="hidden sm:block w-12 shrink-0">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      style={{ width: `${xpInfo.progress}%` }}
                    />
                  </div>
                </div>
              )}
              {!isCurrentLevel && <div className="hidden sm:block w-12 shrink-0" />}

              {/* Track gratuite */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">{t("legend_free")}</div>
                {freeReward && (
                  <div className="flex items-center gap-2">
                    <RewardCard reward={freeReward} claimed={freeClaimed} locked={!isUnlocked} />
                    {canClaimFree && (
                      <button
                        onClick={() => handleClaimFree(level)}
                        className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow"
                      >
                        {t("claim_free")}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div className="w-px h-16 bg-slate-700 shrink-0 hidden sm:block" />

              {/* Track premium */}
              <div className="flex-1 flex flex-col gap-1">
                <div className={`text-[10px] font-semibold uppercase tracking-wide ${state.isPremium ? "text-yellow-500" : "text-gray-600"}`}>
                  {state.isPremium ? "✨ Premium" : `🔒 ${t("legend_premium")}`}
                </div>
                {premiumReward && (
                  <div className="flex items-center gap-2">
                    <RewardCard reward={premiumReward} claimed={premClaimed} locked={!isUnlocked || !state.isPremium} />
                    {canClaimPrem && (
                      <button
                        onClick={() => handleClaimPremium(level)}
                        className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow"
                      >
                        {t("claim_free")}
                      </button>
                    )}
                    {isUnlocked && !state.isPremium && (
                      <span className="text-[10px] text-gray-600 italic">{t("premium_required")}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
