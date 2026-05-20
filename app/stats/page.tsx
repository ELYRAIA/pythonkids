"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { getProgress } from "@/lib/progress";
import { getStreak } from "@/lib/streak";
import { getGems } from "@/lib/gems";
import { getCompletedChallenges, CHALLENGES } from "@/lib/challenges";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";
import { getLevelAvgStars } from "@/lib/mastery";
import { getXPInfo, getWeeklyXP } from "@/lib/xp";

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState({ earnedBadges: [] as string[], completedLessons: {} as Record<string, number[]> });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, playDates: [] as string[] });
  const [gems, setGems] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [xpInfo, setXpInfo] = useState({ xp: 0, weeklyXp: 0, rank: { emoji: "🌱", title: "Novice", bgGradient: "#9ca3af, #64748b" }, nextRank: null as { title: string; minXP: number } | null, progress: 0, xpToNext: 0 });

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
    const s = getStreak();
    setStreak({ currentStreak: s.currentStreak, longestStreak: s.longestStreak, playDates: s.playDates ?? [] });
    setGems(getGems());
    setCompletedChallenges(getCompletedChallenges());
    const info = getXPInfo();
    setXpInfo({ ...info, weeklyXp: getWeeklyXP() });
  }, []);

  const totalLessons = Object.values(LEVELS_DATA).reduce((a, l) => a + l.lessons.length, 0);
  const doneLessons = Object.values(progress.completedLessons).flat().length;
  const totalChallenges = CHALLENGES.length;

  // Heatmap 12 semaines
  const HEATMAP_WEEKS = 12;
  const HEATMAP_DAYS = HEATMAP_WEEKS * 7;
  const todayHeatmap = new Date();
  const heatmapCells = Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const d = new Date(todayHeatmap);
    d.setDate(todayHeatmap.getDate() - (HEATMAP_DAYS - 1 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      date: dateStr,
      active: streak.playDates.includes(dateStr),
      isToday: i === HEATMAP_DAYS - 1,
      weekday: d.getDay(), // 0=dim, 1=lun...
    };
  });
  // Grouper par colonnes de 7 (semaine = colonne)
  const heatmapWeeks = Array.from({ length: HEATMAP_WEEKS }, (_, w) =>
    heatmapCells.slice(w * 7, (w + 1) * 7)
  );
  // Étiquettes de mois pour les colonnes
  const monthLabels = heatmapWeeks.map((week) => {
    const firstDay = new Date(week[0].date);
    return firstDay.getDate() <= 7
      ? firstDay.toLocaleDateString("fr-FR", { month: "short" })
      : "";
  });
  const DAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];

  // Challenge breakdown by difficulty
  const diffStats = {
    Facile:    { total: 0, done: 0 },
    Moyen:     { total: 0, done: 0 },
    Difficile: { total: 0, done: 0 },
  } as Record<string, { total: number; done: number }>;

  for (const c of CHALLENGES) {
    diffStats[c.difficulty].total++;
    if (completedChallenges.includes(c.id)) diffStats[c.difficulty].done++;
  }

  const timeMinutes = doneLessons * 10 + completedChallenges.length * 15;
  const timeHours = Math.floor(timeMinutes / 60);
  const timeMin = timeMinutes % 60;

  return (
    <div className={`min-h-screen ${mounted ? "fade-in" : "invisible"}`}>
      <AppHeader />
      <div className="w-full px-6 py-8 max-w-2xl mx-auto space-y-6">

        <div className="flex items-center gap-3 mb-2">
          <Link href="/profile" className="text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 text-sm">
            ← Profil
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">📊 Mes statistiques</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Visualise ta progression dans le temps</p>
        </div>

        {/* Chiffres clés */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: "📖", value: `${doneLessons}/${totalLessons}`, label: "Leçons" },
            { emoji: "🎯", value: `${completedChallenges.length}/${totalChallenges}`, label: "Défis" },
            { emoji: "🔥", value: `${streak.currentStreak}j`, label: "Streak" },
            { emoji: "💎", value: `${gems}`, label: "Gemmes" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-xl font-extrabold text-gray-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* XP et rang */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-4">⚡ XP et rang</h2>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${xpInfo.rank.bgGradient})` }}
            >
              {xpInfo.rank.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-extrabold text-gray-800 dark:text-white">{xpInfo.rank.title}</p>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400">{xpInfo.xp.toLocaleString()} XP</p>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${xpInfo.progress}%`, background: `linear-gradient(to right, ${xpInfo.rank.bgGradient})` }}
                />
              </div>
              {xpInfo.nextRank ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{xpInfo.xpToNext} XP pour atteindre <span className="font-semibold">{xpInfo.nextRank.title}</span></p>
              ) : (
                <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1 font-semibold">🌟 Rang maximum atteint !</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold text-gray-800 dark:text-white">{xpInfo.xp.toLocaleString()}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">XP total</p>
            </div>
            <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold text-orange-600 dark:text-orange-400">+{xpInfo.weeklyXp}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">XP cette semaine</p>
            </div>
            <div className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400">{progress.earnedBadges.length}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Badges</p>
            </div>
          </div>
        </div>

        {/* Heatmap calendrier 12 semaines */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">📅 Calendrier d'activité</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400 dark:text-slate-500">Record : {streak.longestStreak}j</span>
              <span className="text-orange-500 font-bold">Streak : {streak.currentStreak}j 🔥</span>
            </div>
          </div>

          {/* Étiquettes de mois */}
          <div className="flex gap-0.5 mb-1 pl-5">
            {monthLabels.map((label, i) => (
              <div key={i} className="flex-1 text-[9px] text-gray-400 dark:text-slate-500 font-semibold">
                {label}
              </div>
            ))}
          </div>

          {/* Grille heatmap */}
          <div className="flex gap-0.5">
            {/* Étiquettes jours */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="h-3.5 flex items-center">
                  <span className="text-[8px] text-gray-300 dark:text-slate-600 w-4 text-right">{i % 2 === 1 ? d : ""}</span>
                </div>
              ))}
            </div>

            {/* Colonnes semaines */}
            {heatmapWeeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5 flex-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}${day.active ? " — Joué !" : ""}`}
                    className={`h-3.5 rounded-sm transition-all ${
                      day.isToday
                        ? "ring-1 ring-orange-400 dark:ring-orange-500"
                        : ""
                    } ${
                      day.active
                        ? "bg-orange-400 dark:bg-orange-500"
                        : "bg-gray-100 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Légende */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-gray-400 dark:text-slate-500">Moins</span>
            {["bg-gray-100 dark:bg-slate-700", "bg-orange-200 dark:bg-orange-800", "bg-orange-400 dark:bg-orange-500"].map((cls, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
            ))}
            <span className="text-[10px] text-gray-400 dark:text-slate-500">Plus</span>
          </div>
        </div>

        {/* Progression par niveau */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-4">📚 Niveaux</h2>
          <div className="space-y-3">
            {LEVELS.map((level) => {
              const done = (progress.completedLessons[String(level.id)] ?? []).length;
              const total = level.lessons;
              const pct = Math.round((done / total) * 100);
              const avgStars = getLevelAvgStars(level.id, total);
              return (
                <div key={level.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{level.emoji}</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Niv. {level.id} — {level.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {avgStars > 0 && (
                        <span className="text-xs text-yellow-500">{"⭐".repeat(Math.round(avgStars))}</span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-slate-500">{done}/{total}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${level.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Défis par difficulté */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-4">🎯 Défis par difficulté</h2>
          <div className="space-y-3">
            {([
              { diff: "Facile", color: "from-green-400 to-emerald-500", textColor: "text-green-600 dark:text-green-400" },
              { diff: "Moyen", color: "from-yellow-400 to-orange-500", textColor: "text-yellow-600 dark:text-yellow-400" },
              { diff: "Difficile", color: "from-purple-500 to-violet-600", textColor: "text-purple-600 dark:text-purple-400" },
            ] as const).map(({ diff, color, textColor }) => {
              const s = diffStats[diff];
              const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <div key={diff}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${textColor}`}>{diff}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">{s.done}/{s.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temps estimé */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-5 text-white text-center">
          <p className="text-4xl font-extrabold mb-1">
            {timeHours > 0 ? `${timeHours}h ${timeMin}min` : `${timeMinutes} min`}
          </p>
          <p className="text-purple-100 text-sm">de code appris 🚀</p>
        </div>

        <div className="flex justify-center pb-6">
          <Link href="/profile" className="text-sm text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
            ← Retour au profil
          </Link>
        </div>
      </div>
    </div>
  );
}
