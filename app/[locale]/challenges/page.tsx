"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { CHALLENGES, getCompletedChallenges } from "@/lib/challenges";
import { getPlayerLevel } from "@/lib/progress";
import { LEVELS } from "@/lib/levels";
import { lf } from "@/lib/localize";

type Filter = "Pour toi" | "Tous" | "Facile" | "Moyen" | "Difficile";
type Sort = "defaut" | "non_faits";

const LEVEL_EMOJIS = LEVELS.reduce<Record<number, string>>((acc, l) => { acc[l.id] = l.emoji; return acc; }, {});

export default function ChallengesPage() {
  const t = useTranslations("Challenges");
  const locale = useLocale();
  const [completed, setCompleted] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("Pour toi");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("defaut");
  const [playerLevel, setPlayerLevel] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompleted(getCompletedChallenges());
    setPlayerLevel(getPlayerLevel());
    setMounted(true);

    const refresh = () => {
      setCompleted(getCompletedChallenges());
      setPlayerLevel(getPlayerLevel());
    };
    window.addEventListener("pythonkids:progress", refresh);
    return () => window.removeEventListener("pythonkids:progress", refresh);
  }, []);

  const total = CHALLENGES.length;
  const doneCount = mounted ? completed.length : 0;
  const percent = Math.round((doneCount / total) * 100);

  const diffLabel = (d: string) =>
    d === "Facile" ? t("difficulty_easy") : d === "Moyen" ? t("difficulty_medium") : d === "Difficile" ? t("difficulty_hard") : d;

  const statsPerDiff: Record<string, { done: number; total: number }> = {};
  for (const c of CHALLENGES) {
    if (!statsPerDiff[c.difficulty]) statsPerDiff[c.difficulty] = { done: 0, total: 0 };
    statsPerDiff[c.difficulty].total++;
    if (mounted && completed.includes(c.id)) statsPerDiff[c.difficulty].done++;
  }

  const isForMe = (minLevel: number) => Math.abs(minLevel - playerLevel) <= 1;

  const searchLower = search.toLowerCase().trim();
  let visible = CHALLENGES.filter((c) => {
    const matchFilter = filter === "Pour toi" ? isForMe(c.minLevel)
      : filter === "Tous" ? true
      : c.difficulty === filter;
    const matchSearch = !searchLower
      || lf(c, "title", locale).toLowerCase().includes(searchLower)
      || lf(c, "description", locale).toLowerCase().includes(searchLower);
    return matchFilter && matchSearch;
  });
  if (sort === "non_faits" && mounted) {
    visible = [...visible].sort((a, b) => {
      const aDone = completed.includes(a.id) ? 1 : 0;
      const bDone = completed.includes(b.id) ? 1 : 0;
      return aDone - bDone;
    });
  }

  const FILTER_ACTIVE: Record<Filter, string> = {
    "Pour toi": "bg-purple-600 text-white",
    Tous:       "bg-purple-600 text-white",
    Facile:     "bg-green-500 text-white",
    Moyen:      "bg-yellow-500 text-white",
    Difficile:  "bg-purple-500 text-white",
  };
  const FILTER_IDLE: Record<Filter, string> = {
    "Pour toi": "border-purple-200 dark:border-slate-600 text-gray-600 dark:text-slate-300",
    Tous:       "border-purple-200 dark:border-slate-600 text-gray-600 dark:text-slate-300",
    Facile:     "border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
    Moyen:      "border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400",
    Difficile:  "border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400",
  };

  return (
    <div className="min-h-screen">
      <AppHeader right={
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-300">{doneCount}/{total}</span>
          <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      } />

      <div className="w-full px-6 py-8 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
            {t("subtitle")}
          </p>

          {/* Stats par difficulté */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {(["Facile", "Moyen", "Difficile"] as const).map((diff) => {
              const s = statsPerDiff[diff] ?? { done: 0, total: 0 };
              const colors = {
                Facile:    "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
                Moyen:     "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400",
                Difficile: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400",
              }[diff];
              return (
                <div key={diff} className={`border rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 ${colors}`}>
                  <span>{diffLabel(diff)}</span>
                  <span className="opacity-70">{s.done}/{s.total}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {mounted && (
              <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 text-sm text-purple-700 dark:text-purple-300 font-semibold">
                <span>{LEVEL_EMOJIS[playerLevel]}</span>
                <span>{t("player_level", { name: lf(LEVELS.find(l => l.id === playerLevel) ?? LEVELS[0], "name", locale) })}</span>
              </div>
            )}
            <Link
              href="/mistakes"
              className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-full px-4 py-2 text-sm text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
            >
              {t("my_mistakes")}
            </Link>
          </div>
        </div>

        {/* Recherche + tri */}
        <div className="flex gap-2 mb-4 max-w-lg mx-auto">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full pl-9 pr-4 py-2 rounded-full border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>
          <button
            onClick={() => setSort(sort === "defaut" ? "non_faits" : "defaut")}
            title={sort === "defaut" ? t("sort_default") : t("sort_incomplete")}
            className={`shrink-0 px-3 py-2 rounded-full border-2 text-sm font-bold transition-all ${sort === "non_faits" ? "bg-purple-600 border-purple-600 text-white" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-purple-300"}`}
          >
            {sort === "non_faits" ? t("sort_incomplete_label") : t("sort_button")}
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {(["Pour toi", "Tous", "Facile", "Moyen", "Difficile"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                filter === f
                  ? FILTER_ACTIVE[f]
                  : `bg-white dark:bg-slate-800 ${FILTER_IDLE[f]} hover:opacity-80`
              }`}
            >
              {f === "Pour toi"
                ? t("filter_for_you", { count: CHALLENGES.filter((c) => isForMe(c.minLevel)).length })
                : f === "Tous"
                ? t("filter_all", { count: total })
                : `${diffLabel(f)} (${statsPerDiff[f]?.total ?? 0})`}
            </button>
          ))}
        </div>

        {/* Message vide */}
        {visible.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-slate-500">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-bold">{t("no_more")}</p>
            <button onClick={() => setFilter("Tous")} className="mt-4 text-purple-600 dark:text-purple-400 text-sm font-semibold hover:underline">
              {t("see_all")}
            </button>
          </div>
        )}

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((challenge) => {
            const isDone = mounted && completed.includes(challenge.id);
            const isLocked = mounted && challenge.minLevel > playerLevel + 1;
            const globalIndex = CHALLENGES.indexOf(challenge);
            const bestTimeKey = `pythonkids_best_time_${challenge.id}`;
            const bestTime = mounted ? localStorage.getItem(bestTimeKey) : null;
            const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

            const card = (
              <div className={`group relative rounded-2xl border-2 p-5 h-full transition-all ${
                isDone
                  ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                  : isLocked
                  ? "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-60"
                  : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-600 cursor-pointer"
              }`}>
                {isDone && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow">
                    ✓
                  </div>
                )}
                {isLocked && !isDone && (
                  <div className="absolute top-3 right-3 text-gray-400 text-lg">🔒</div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{challenge.emoji}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold text-white bg-gradient-to-r ${challenge.difficultyColor}`}>
                    {diffLabel(challenge.difficulty)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    {t("challenge_label", { number: globalIndex + 1 })}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {t("recommended_level", { emoji: LEVEL_EMOJIS[challenge.minLevel], level: challenge.minLevel })}
                  </span>
                </div>

                <h2 className={`text-base font-bold mb-2 ${isDone ? "text-green-700 dark:text-green-400" : isLocked ? "text-gray-400 dark:text-slate-500" : "text-gray-800 dark:text-white"}`}>
                  {lf(challenge, "title", locale)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {isLocked
                    ? t("unlocked_message", { level: challenge.minLevel, name: lf(LEVELS.find(l => l.id === challenge.minLevel) ?? LEVELS[0], "name", locale) })
                    : lf(challenge, "description", locale).split("\n")[0]}
                </p>

                {isDone && bestTime && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
                    <span>⏱</span>
                    <span>{t("best_time", { time: formatTime(parseInt(bestTime)) })}</span>
                  </div>
                )}

                {!isDone && !isLocked && (
                  <div className="mt-3 flex items-center justify-end">
                    <span className={`text-xs font-bold bg-gradient-to-r ${challenge.difficultyColor} bg-clip-text text-transparent group-hover:opacity-80`}>
                      {t("take_on")}
                    </span>
                  </div>
                )}
              </div>
            );

            return isLocked ? (
              <div key={challenge.id}>{card}</div>
            ) : (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`}>{card}</Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
