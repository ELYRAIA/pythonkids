"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { calculateScore } from "@/lib/score";
import { getXP, getWeeklyXP } from "@/lib/xp";
import type { LeaderboardEntry } from "@/app/api/leaderboard/route";

type Period = "all" | "month" | "week";

const RANK_COLORS = [
  "bg-yellow-300 text-yellow-900",
  "bg-gray-200 text-gray-700",
  "bg-orange-200 text-orange-800",
];

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

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

    // Soumet le score si l'utilisateur a un pseudo
    if (name && score > 0) {
      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, score }),
      })
        .then(() => setSubmitted(true))
        .catch(() => {});
    }

    // Charge le classement
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
            Hall of Fame 🏆
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Les meilleurs codeurs de PythonKids !</p>

          {/* Mon score */}
          {/* Onglets période */}
          <div className="flex justify-center gap-2 mt-5 mb-2">
            {(["all", "month", "week"] as const).map((p) => {
              const labels = { all: "🏆 Tout temps", month: "📅 Ce mois", week: "🔥 Cette semaine" };
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
                <p className="text-xs text-gray-500 dark:text-slate-400">Ton score</p>
                <p className="font-extrabold text-purple-600 dark:text-purple-300 text-lg">{myScore.toLocaleString()} pts</p>
              </div>
              {myRank > 0 && (
                <div className="text-left border-l border-purple-200 dark:border-purple-700 pl-3">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Ton rang</p>
                  <p className="font-extrabold text-purple-600 dark:text-purple-300 text-lg">#{myRank}</p>
                </div>
              )}
              <div className="text-left border-l border-purple-200 dark:border-purple-700 pl-3">
                <p className="text-xs text-gray-500 dark:text-slate-400">XP total</p>
                <p className="font-extrabold text-indigo-600 dark:text-indigo-300 text-lg">{myXP.toLocaleString()} XP</p>
              </div>
              {myWeeklyXP > 0 && (
                <div className="text-left border-l border-purple-200 dark:border-purple-700 pl-3">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Cette semaine</p>
                  <p className="font-extrabold text-orange-500 dark:text-orange-400 text-lg">+{myWeeklyXP} XP 🔥</p>
                </div>
              )}
              {submitted && <span className="text-green-500 text-xs font-bold">✓ Soumis</span>}
            </div>
          )}
        </div>

        {loading ? (
          <div className="max-w-2xl mx-auto space-y-2">
            {/* Podium skeleton */}
            <div className="flex justify-center items-end gap-6 mb-8 mt-4">
              {[80, 112, 64].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="skeleton w-14 h-3 rounded" />
                  <div className="skeleton rounded-t-xl w-14" style={{ height: h }} />
                </div>
              ))}
            </div>
            {/* Rows skeleton */}
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
                ? <>Personne n&apos;est encore dans le classement.<br />Sois le premier !</>
                : <>Personne n&apos;a joué {period === "week" ? "cette semaine" : "ce mois"} encore.<br />Sois le premier !</>}
            </p>
            <Link
              href="/levels/0"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Commencer maintenant 🚀
            </Link>
          </div>
        ) : (
          <>
            {/* Podium top 3 */}
            {filteredEntries.length >= 3 && (
              <div className="flex justify-center items-end gap-4 mb-10">
                {[filteredEntries[1], filteredEntries[0], filteredEntries[2]].map((player, i) => {
                  const heights = ["h-20", "h-28", "h-16"];
                  const isMe = player.username === username;
                  return (
                    <div key={player.username} className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{RANK_EMOJIS[[1, 0, 2][i]]}</span>
                      <span className={`font-bold text-sm ${isMe ? "text-purple-600 dark:text-purple-300" : "text-gray-700 dark:text-slate-300"}`}>
                        {player.username}{isMe ? " 👤" : ""}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs">
                        {player.score.toLocaleString()} pts
                      </span>
                      <div className={`w-16 ${heights[i]} ${RANK_COLORS[[1, 0, 2][i]]} rounded-t-xl flex items-end justify-center pb-2`}>
                        <span className="text-xl font-black">{[2, 1, 3][i]}</span>
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
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${isMe ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-purple-400 to-pink-400"}`}>
                      {player.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${isMe ? "text-purple-700 dark:text-purple-300" : "text-gray-800 dark:text-white"}`}>
                        {player.username}{isMe ? " 👤" : ""}
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
            <h3 className="text-sm font-bold text-gray-600 dark:text-slate-300 mb-3">Comment sont calculés les points ?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              {[
                { emoji: "📖", label: "Leçon terminée", pts: "+100" },
                { emoji: "🏅", label: "Niveau terminé", pts: "+500" },
                { emoji: "🎯", label: "Défi réussi", pts: "+200" },
                { emoji: "🔥", label: "Jour de streak", pts: "+50" },
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
            Améliore ton score 🚀
          </Link>
        </div>
      </div>
    </div>
  );
}
