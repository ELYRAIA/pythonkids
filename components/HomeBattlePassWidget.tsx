"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBattlePassState, getBPXPInfo, BP_MAX_LEVEL, BP_LEVELS, BP_SEASON_END, type BPReward } from "@/lib/battlePass";

function rewardIcon(r: BPReward) {
  if (r.type === "gems") return `💎 +${r.gems}`;
  if (r.type === "chest") return ["📦", "📫", "💜", "✨"][r.chestLevel ?? 0] + " Coffre";
  return `${r.itemEmoji} ${r.itemName}`;
}

export default function HomeBattlePassWidget() {
  const [level, setLevel] = useState(0);
  const [xpInfo, setXpInfo] = useState({ levelXP: 0, xpToNext: 200, progress: 0, currentLevel: 0 });
  const [isPremium, setIsPremium] = useState(false);
  const [unclaimedCount, setUnclaimedCount] = useState(0);

  const refresh = () => {
    const state = getBattlePassState();
    const info = getBPXPInfo();
    setLevel(state.currentLevel);
    setXpInfo(info);
    setIsPremium(state.isPremium);
    // Compte les récompenses réclamables
    let count = 0;
    for (let l = 1; l <= state.currentLevel; l++) {
      if (!state.claimedFree.includes(l)) count++;
      if (state.isPremium && !state.claimedPremium.includes(l)) count++;
    }
    setUnclaimedCount(count);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("pythonkids:battlepass", refresh);
    return () => window.removeEventListener("pythonkids:battlepass", refresh);
  }, []);

  const nextLevel = BP_LEVELS[level]; // level est 0-indexed pour BP_LEVELS (level 0 → index 0 → level 1)
  const nextFreeReward = nextLevel?.freeReward;
  const daysLeft = Math.max(0, Math.ceil((new Date(BP_SEASON_END).getTime() - Date.now()) / 86400000));

  return (
    <section className="w-full px-6 py-4">
      <Link href="/battle-pass" className="block max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-yellow-500/10 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚔️</span>
              <div>
                <div className="font-bold text-white text-sm">Pass de Combat</div>
                <div className="text-xs text-gray-500">Saison 1</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {daysLeft <= 14 && daysLeft > 0 && (
                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${daysLeft <= 7 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
                  J-{daysLeft}
                </span>
              )}
              {unclaimedCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unclaimedCount > 9 ? "9+" : unclaimedCount}
                </span>
              )}
              {isPremium && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5 font-bold">✨ Premium</span>
              )}
              <span className="text-gray-400 text-xs">→</span>
            </div>
          </div>

          {/* Niveau + barre */}
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl font-black text-white w-8 text-center">{level}</div>
            <div className="flex-1">
              <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: level >= BP_MAX_LEVEL ? "100%" : `${xpInfo.progress}%` }}
                />
              </div>
            </div>
            <div className="text-gray-600 font-bold text-sm w-8 text-right">{BP_MAX_LEVEL}</div>
          </div>

          {/* Prochaine récompense */}
          {level < BP_MAX_LEVEL && nextFreeReward && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Prochain :</span>
              <span className="font-semibold text-gray-300">{rewardIcon(nextFreeReward)}</span>
              <span className="text-gray-600">dans {xpInfo.xpToNext} XP</span>
            </div>
          )}
          {level >= BP_MAX_LEVEL && (
            <div className="text-xs text-yellow-400 font-bold text-center">🏆 Pass terminé !</div>
          )}
        </div>
      </Link>
    </section>
  );
}
