"use client";

import { useState, useEffect } from "react";
import { canClaimDailyReward, claimDailyReward } from "@/lib/dailyReward";

export default function DailyReward() {
  const [visible, setVisible] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [gems, setGems] = useState(0);

  useEffect(() => {
    if (canClaimDailyReward()) setVisible(true);
  }, []);

  const claim = () => {
    const earned = claimDailyReward();
    setGems(earned);
    setClaimed(true);
    setTimeout(() => setVisible(false), 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl p-7 max-w-xs w-full shadow-2xl text-center"
        style={{ animation: "badge-pop 0.3s ease-out" }}
      >
        {!claimed ? (
          <>
            <div className="text-5xl mb-3 select-none">🎁</div>
            <h2 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">Récompense du jour !</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
              Tu es de retour ! Gagne <strong className="text-teal-600 dark:text-teal-400">+{5} 💎</strong> chaque jour en ouvrant l&apos;appli.
            </p>
            <button
              onClick={claim}
              className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-md"
            >
              Récupérer +5 💎
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-3 select-none">✨</div>
            <p className="text-lg font-extrabold text-green-700 dark:text-green-400 mb-1">+{gems} 💎 récupérés !</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Reviens demain pour en gagner plus !</p>
          </>
        )}
      </div>
    </div>
  );
}
