"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { calculateScore } from "@/lib/score";
import { getXP, getWeeklyXP } from "@/lib/xp";
import { getEquippedSkin } from "@/lib/shop";
import { SHOP_SKINS } from "@/lib/shop";
import type { LeaderboardEntry } from "@/app/api/leaderboard/route";

type Period = "all" | "month" | "week";

const RANK_COLORS = [
  "bg-yellow-300 text-yellow-900",
  "bg-gray-200 text-gray-700",
  "bg-orange-200 text-orange-800",
];

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

const PODIUM_GRADIENTS = [
  "from-yellow-300 to-amber-500",   // #1 or
  "from-slate-300 to-gray-500",     // #2 argent
  "from-orange-300 to-amber-600",   // #3 bronze
];

const PODIUM_GLOWS = [
  "0 0 24px rgba(251,191,36,0.7), 0 0 48px rgba(251,191,36,0.3)",
  "0 0 16px rgba(148,163,184,0.6)",
  "0 0 16px rgba(251,146,60,0.6)",
];

const RANK_FROM_SCORE = (score: number): { emoji: string; label: string; color: string } => {
  if (score >= 20000) return { emoji: "🌟", label: "Légendaire", color: "text-yellow-500 dark:text-yellow-400" };
  if (score >= 10000) return { emoji: "🐍", label: "Maître",     color: "text-orange-500 dark:text-orange-400" };
  if (score >= 5000)  return { emoji: "⚡", label: "Expert",     color: "text-pink-500 dark:text-pink-400"   };
  if (score >= 2000)  return { emoji: "💻", label: "Bâtisseur",  color: "text-purple-500 dark:text-purple-400" };
  if (score >= 500)   return { emoji: "📝", label: "Débutant",   color: "text-blue-500 dark:text-blue-400"   };
  return               { emoji: "🌱", label: "Novice",     color: "text-green-500 dark:text-green-400"  };
};

function playerGradient(name: string): string {
  const gradients = [
    "from-sky-400 to-blue-600", "from-violet-400 to-purple-600",
    "from-pink-400 to-rose-600", "from-orange-400 to-amber-600",
    "from-emerald-400 to-teal-600", "from-fuchsia-400 to-pink-600",
    "from-cyan-400 to-sky-600", "from-yellow-400 to-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return gradients[hash % gradients.length];
}

function getWeekStart(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getMonthStart(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function filterByPeriod(entries: LeaderboardEntry[], period: Period): LeaderboardEntry[] {
  if (period === "all") return entries;
  const cutoff = period === "week" ? getWeekStart() : getMonthStart();
  return entries.filter((e) => new Date(e.updatedAt) >= cutoff);
}

export default function LeaderboardPage() {
  const t = useTranslations("Leaderboard");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [myXP, setMyXP] = useState(0);
  const [myWeeklyXP, setMyWeeklyXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [period, setPeriod] = useState<Period>("all");

  useEffect(() => {
    const name = localStorage.getItem("pythonkids_username");
    const score = calculateScore();
    setUsername(name);
    setMyScore(score);
    setMyXP(getXP());
    setMyWeeklyXP(getWeeklyXP());

    if (name && score > 0) {
      const equippedSkinId = getEquippedSkin();
      const skinGradient = equippedSkinId ? SHOP_SKINS.find((s) => s.id === equippedSkinId)?.gradient : undefined;
      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, score, skinGradient }),
      })
        .then(() => setSubmitted(true))
        .catch(() => {});
    }

    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data: LeaderboardEntry[]) => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredEntries = filterByPeriod(entries, period);
  const myRank = filteredEntries.findIndex((e) => e.username === username) + 1;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="w-full px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t("subtitle")}</p>

          {/* Onglets période */}
          <div className="flex justify-center gap-2 mt-5 mb-2">
            {(["all", "month", "week"] as const).map((p) => {
              const labels = { all: t("all_time"), month: t("month"), week: t("week") };
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                    period === p
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white dark:bg-slate-800 border-purple-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-purple-400"
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>

          {username && myScore > 0 && (
            <div className="inline-flex items-center gap-3 mt-4 bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-700 rounded-2xl px-5 py-3 flex-wrap justify-center">
              <span className="text-2xl">👤</span>
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-slate-400">{t("my_score")}</p>
                <p className="font-extrabold text-purple-600 dark:text-purple-300 text-lg">{myScore.toLocaleString()} pts</p>
              </div>
              {myRank > 0 && (
                <div className="text-left border-l border-purple-200 dark:border-purple-700 pl-3">
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t("my_rank")}</p>
                  <p className="font-extrabold text-purple-600 dark:text-purple-300 text-lg">#{myRank}</p>
                </div>
              )}
              <div className="text-left border-l border-purple-200 dark:border-purple-700 pl-3">
                <p className="text-xs text-gray-500 dark:text-slate-400">{t("xp_total")}</p>
                <p className="font-extrabold text-indigo-600 dark:text-indigo-300 text-lg">{myXP.toLocaleString()} XP</p>
              </div>
              {myWeeklyXP > 0 && (
                <div className="text-left border-l border-purple-200 dark:border-purple-700 pl-3">
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t("weekly_xp")}</p>
                  <p className="font-extrabold text-orange-500 dark:text-orange-400 text-lg">+{myWeeklyXP} XP 🔥</p>
                </div>
              )}
              {submitted && <span className="text-green-500 text-xs font-bold">{t("submitted")}</span>}
            </div>
          )}
        </div>

        {loading ? (
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="flex justify-center items-end gap-6 mb-8 mt-4">
              {[80, 112, 64].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="skeleton w-14 h-3 rounded" />
                  <div className="skeleton rounded-t-xl w-14" style={{ height: h }} />
                </div>
              ))}
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 bg-white dark:bg-slate-800 rounded-xl">
                <div className="skeleton w-8 h-4 rounded" />
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="skeleton flex-1 h-4 rounded" />
                <div className="skeleton w-16 h-4 rounded" />
              </div>
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">{period === "all" ? "🏁" : "😴"}</p>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
              {period === "all"
                ? t("no_entries")
                : t("no_entries_period", { period: period === "week" ? "cette semaine" : "ce mois" })}
            </p>
            <Link
              href="/levels/0"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {t("start_now")}
            </Link>
          </div>
        ) : (
          <>
            {/* Podium top 3 */}
            {filteredEntries.length >= 3 && (
              <div className="flex justify-center items-end gap-3 mb-12 px-2">
                {([1, 0, 2] as const).map((rankIdx, colIdx) => {
                  const player = filteredEntries[rankIdx];
                  const rank = rankIdx + 1;
                  const isMe = player.username === username;
                  const barHeights = [96, 132, 72];
                  const barH = barHeights[colIdx];
                  const grad = PODIUM_GRADIENTS[colIdx];
                  const glow = PODIUM_GLOWS[colIdx];
                  const avatarGrad = player.skinGradient ?? playerGradient(player.username);
                  const rankInfo = RANK_FROM_SCORE(player.score);

                  return (
                    <div key={player.username} className="flex flex-col items-center gap-2 flex-1 max-w-[110px]">
                      {rank === 1 && (
                        <span className="text-3xl avatar-badge-bounce select-none">👑</span>
                      )}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-black text-lg shadow-lg ${isMe ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900" : ""}`}
                        style={{ boxShadow: glow }}
                      >
                        {player.username[0].toUpperCase()}
                      </div>
                      <p className={`text-xs font-bold text-center leading-tight truncate w-full ${isMe ? "text-purple-600 dark:text-purple-300" : "text-gray-700 dark:text-slate-200"}`}>
                        {player.username}
                      </p>
                      <p className={`text-xs font-bold ${rankInfo.color}`}>
                        {rankInfo.emoji} {rankInfo.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold">
                        {player.score.toLocaleString()} pts
                      </p>
                      <div
                        className={`w-full rounded-t-2xl bg-gradient-to-t ${grad} flex items-center justify-center shadow-lg podium-bar`}
                        style={{ height: barH, boxShadow: glow, animationDelay: `${colIdx * 0.12}s` }}
                      >
                        <span className="text-2xl font-black text-white/80">{rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Liste complète */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-purple-50 dark:border-slate-700 overflow-hidden max-w-2xl mx-auto">
              {filteredEntries.map((player, idx) => {
                const rank = idx + 1;
                const isMe = player.username === username;
                const avatarGrad = player.skinGradient ?? playerGradient(player.username);
                const rankInfo = RANK_FROM_SCORE(player.score);
                return (
                  <div
                    key={player.username}
                    className={`flex items-center gap-4 px-5 py-3 border-b border-gray-50 dark:border-slate-700 transition-colors
                      ${isMe ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-l-purple-400" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"}
                      ${rank <= 3 ? "bg-gradient-to-r from-yellow-50 dark:from-yellow-900/10 to-white dark:to-transparent" : ""}`}
                  >
                    <span className="w-8 text-center font-bold text-gray-400 dark:text-slate-500 text-sm">
                      {rank <= 3 ? RANK_EMOJIS[rank - 1] : `#${rank}`}
                    </span>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold text-sm ${isMe ? "ring-2 ring-purple-400 ring-offset-1 dark:ring-offset-slate-800" : ""}`}>
                      {player.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${isMe ? "text-purple-700 dark:text-purple-300" : "text-gray-800 dark:text-white"}`}>
                        {player.username}{isMe ? " 👤" : ""}
                      </div>
                      <div className={`text-xs font-semibold ${rankInfo.color}`}>
                        {rankInfo.emoji} {rankInfo.label}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${isMe ? "text-purple-600 dark:text-purple-300" : "text-purple-600 dark:text-purple-400"}`}>
                        {player.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-slate-500">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Détail des points */}
        {username && (
          <div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-purple-50 dark:border-slate-700 p-5">
            <h3 className="text-sm font-bold text-gray-600 dark:text-slate-300 mb-3">{t("points_calculation")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              {[
                { emoji: "📖", label: t("lesson_completed"), pts: "+100" },
                { emoji: "🏅", label: t("level_completed"), pts: "+500" },
                { emoji: "🎯", label: t("challenge_completed"), pts: "+200" },
                { emoji: "🔥", label: t("streak_day"), pts: "+50" },
              ].map((item) => (
                <div key={item.label} className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="font-bold text-purple-600 dark:text-purple-300">{item.pts}</div>
                  <div className="text-gray-500 dark:text-slate-400 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/levels/0"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
          >
            {t("improve_score")}
          </Link>
        </div>
      </div>
    </div>
  );
}
