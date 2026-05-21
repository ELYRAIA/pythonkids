"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getXPInfo } from "@/lib/xp";

export default function HomeRankWidget() {
  const [info, setInfo] = useState<ReturnType<typeof getXPInfo> | null>(null);

  useEffect(() => {
    const load = () => setInfo(getXPInfo());
    load();
    window.addEventListener("pythonkids:xp", load);
    window.addEventListener("pythonkids:progress", load);
    return () => {
      window.removeEventListener("pythonkids:xp", load);
      window.removeEventListener("pythonkids:progress", load);
    };
  }, []);

  if (!info || info.xp === 0) return null;

  const { rank, nextRank, xp, progress, xpToNext } = info;

  return (
    <section className="w-full px-6 pb-4">
      <Link href="/profile">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div
            className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
            style={{ background: `linear-gradient(135deg, ${rank.bgGradient})` }}
          >
            {rank.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-extrabold text-gray-800 dark:text-white">{rank.title}</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">{xp} XP</span>
            </div>
            {nextRank ? (
              <>
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: `linear-gradient(to right, ${rank.bgGradient})` }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  {xpToNext} XP pour {nextRank.emoji} {nextRank.title}
                </p>
              </>
            ) : (
              <p className="text-xs text-yellow-500 font-semibold">Rang maximum atteint !</p>
            )}
          </div>
          <span className="text-gray-300 dark:text-slate-600 text-sm shrink-0">›</span>
        </div>
      </Link>
    </section>
  );
}
