"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { getProgress, BADGES } from "@/lib/progress";
import { getStreak } from "@/lib/streak";
import { getCompletedChallenges, CHALLENGES } from "@/lib/challenges";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";
import { getLevelAvgStars } from "@/lib/mastery";
import { getPlayerRank } from "@/lib/ranks";

interface SharedData {
  username: string;
  earnedBadges: string[];
  completedLessons: Record<string, number[]>;
  completedChallenges: string[];
  streak: { currentStreak: number; longestStreak: number; playDates: string[] };
}

export default function ParentPage() {
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({});
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, playDates: [] as string[] });
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Vérifier si un hash de partage est présent dans l'URL
    const hash = window.location.hash;
    if (hash.startsWith("#share=")) {
      try {
        const encoded = hash.slice(7);
        const data: SharedData = JSON.parse(atob(encoded));
        setUsername(data.username);
        setEarnedBadges(data.earnedBadges ?? []);
        setCompletedLessons(data.completedLessons ?? {});
        setCompletedChallenges(data.completedChallenges ?? []);
        setStreak(data.streak ?? { currentStreak: 0, longestStreak: 0, playDates: [] });
        setIsReadOnly(true);
        return;
      } catch { /* hash invalide, on ignore */ }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(localStorage.getItem("pythonkids_username") ?? "Votre enfant");
    const p = getProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEarnedBadges(p.earnedBadges);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedLessons(p.completedLessons);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedChallenges(getCompletedChallenges());
    const s = getStreak();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak({ currentStreak: s.currentStreak, longestStreak: s.longestStreak, playDates: s.playDates ?? [] });
  }, []);

  const handleExport = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("pythonkids_")) data[key] = localStorage.getItem(key) ?? "";
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pythonkids_sauvegarde_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data: Record<string, string> = JSON.parse(ev.target?.result as string);
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith("pythonkids_")) localStorage.setItem(key, value);
        }
        window.location.reload();
      } catch { alert("Fichier de sauvegarde invalide."); }
    };
    reader.readAsText(file);
  };

  const handleShare = () => {
    const data: SharedData = { username, earnedBadges, completedLessons, completedChallenges, streak };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/parent#share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  const totalLessons = Object.values(LEVELS_DATA).reduce((a, l) => a + l.lessons.length, 0);
  const doneLessons = Object.values(completedLessons).flat().length;
  const totalChallenges = CHALLENGES.length;
  const levelsCompleted = LEVELS.filter((l) => earnedBadges.includes(`level_${l.id}`)).length;

  // Prochaine leçon recommandée
  const nextLesson = (() => {
    for (const level of LEVELS) {
      const levelData = LEVELS_DATA[level.id];
      if (!levelData) continue;
      const done = completedLessons[String(level.id)] ?? [];
      for (let i = 0; i < levelData.lessons.length; i++) {
        if (!done.includes(i)) {
          return { level, lessonIndex: i, lesson: levelData.lessons[i] };
        }
      }
    }
    return null;
  })();

  // Prochain défi recommandé
  const nextChallenge = mounted
    ? CHALLENGES.find((c) => !completedChallenges.includes(c.id) && c.minLevel <= levelsCompleted + 1)
    : null;

  // Estimation de temps : ~10 min par leçon, ~15 min par défi
  const timeMinutes = doneLessons * 10 + completedChallenges.length * 15;
  const timeHours = Math.floor(timeMinutes / 60);
  const timeMin = timeMinutes % 60;

  // Activité des 14 derniers jours
  const today = new Date();
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className={`min-h-screen ${mounted ? "fade-in" : "invisible"}`}>
      <AppHeader />
      <div className="w-full px-6 py-8 max-w-2xl mx-auto space-y-6">

        {/* Bannière lecture seule */}
        {isReadOnly && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-xl shrink-0">👁️</span>
            <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">
              Vous consultez la progression partagée de <strong>{username}</strong> (lecture seule).
            </p>
          </div>
        )}

        {/* En-tête */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white text-center">
          <p className="text-4xl mb-2">👨‍👩‍👦</p>
          <h1 className="text-2xl font-extrabold mb-1">Tableau de bord parent</h1>
          <p className="text-blue-200 text-sm">Progression de <strong>{username}</strong></p>
          {mounted && (() => {
            const rank = getPlayerRank(earnedBadges);
            return (
              <div className="inline-flex items-center gap-1.5 mt-3 bg-white/15 rounded-full px-4 py-1.5 text-sm font-bold">
                <span>{rank.emoji}</span>
                <span>{rank.title}</span>
              </div>
            );
          })()}
          {!isReadOnly && mounted && (
            <div className="mt-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-bold px-4 py-2 rounded-full"
              >
                {shareCopied ? "✓ Lien copié !" : "📤 Partager la progression"}
              </button>
              {shareCopied && (
                <p className="text-blue-200 text-xs mt-2">Envoyez ce lien à un autre appareil pour consulter la progression.</p>
              )}
            </div>
          )}
        </div>

        {/* Prochaine étape recommandée */}
        {mounted && (nextLesson || nextChallenge) && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
              🎯 Prochaine étape recommandée
            </h2>
            <div className="space-y-2">
              {nextLesson && (
                <Link href={`/levels/${nextLesson.level.id}/lessons/${nextLesson.lessonIndex}`}
                  className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors group">
                  <span className="text-2xl">{nextLesson.level.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{nextLesson.lesson.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Niveau {nextLesson.level.id} — Leçon {nextLesson.lessonIndex + 1}</p>
                  </div>
                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform text-sm">→</span>
                </Link>
              )}
              {nextChallenge && (
                <Link href={`/challenges/${nextChallenge.id}`}
                  className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors group">
                  <span className="text-2xl">{nextChallenge.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{nextChallenge.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Défi {nextChallenge.difficulty}</p>
                  </div>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform text-sm">→</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Résumé rapide */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: "📖", value: `${doneLessons}/${totalLessons}`, label: "Leçons" },
            { emoji: "🎯", value: `${completedChallenges.length}/${totalChallenges}`, label: "Défis" },
            { emoji: "🏆", value: `${levelsCompleted}/6`, label: "Niveaux" },
            { emoji: "🔥", value: `${streak.currentStreak}j`, label: "Streak" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-xl font-extrabold text-gray-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Temps passé */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">⏱️ Temps d&apos;apprentissage estimé</h2>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {timeHours > 0 ? `${timeHours}h ${timeMin}min` : `${timeMinutes} min`}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            Estimation basée sur {doneLessons} leçon{doneLessons > 1 ? "s" : ""} et {completedChallenges.length} défi{completedChallenges.length > 1 ? "s" : ""} réussis
          </p>
        </div>

        {/* Activité 14 jours */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">📅 Activité des 2 dernières semaines</h2>
            <span className="text-xs text-orange-500 font-semibold">Record : {streak.longestStreak}j</span>
          </div>
          <div className="flex gap-1">
            {last14.map((date) => {
              const played = streak.playDates.includes(date);
              const isToday = date === today.toISOString().split("T")[0];
              return (
                <div
                  key={date}
                  title={date}
                  className={`flex-1 h-8 rounded transition-all ${
                    played ? "bg-orange-400 dark:bg-orange-500" : "bg-gray-100 dark:bg-slate-700"
                  } ${isToday ? "ring-2 ring-orange-300" : ""}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">il y a 14 jours</span>
            <span className="text-xs text-gray-400">aujourd&apos;hui</span>
          </div>
        </div>

        {/* Progression par niveau */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">📚 Progression par niveau</h2>
          <div className="space-y-2">
            {LEVELS.map((level) => {
              const done = mounted ? (completedLessons[String(level.id)] ?? []).length : 0;
              const total = level.lessons;
              const pct = Math.round((done / total) * 100);
              const avgStars = mounted ? getLevelAvgStars(level.id, total) : 0;
              const complete = earnedBadges.includes(`level_${level.id}`);
              return (
                <div key={level.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{level.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
                          Niveau {level.id} — {level.name}
                          <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{level.ages}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          {avgStars > 0 && (
                            <span className="text-xs text-yellow-500">
                              {"⭐".repeat(Math.round(avgStars))} {avgStars.toFixed(1)}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{done}/{total}</span>
                          {complete && <span className="text-green-500 text-xs font-bold">✓</span>}
                        </div>
                      </div>
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

        {/* Badges */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">🏅 Badges obtenus ({earnedBadges.length}/{BADGES.length})</h2>
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500">Aucun badge encore — continuez à apprendre !</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {BADGES.filter((b) => earnedBadges.includes(b.id)).map((badge) => (
                <div key={badge.id} className={`flex items-center gap-2 bg-gradient-to-r ${badge.color} text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-sm`}>
                  <span>{badge.emoji}</span>
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note pédagogique */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">💡 À savoir</h2>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5">
            <li>• Chaque leçon dure environ 10 minutes — idéal pour une courte session quotidienne</li>
            <li>• Le streak encourage la régularité : même 1 leçon par jour fait une grande différence</li>
            <li>• Les défis (🎯) peuvent être tentés à tout moment pour réviser et gagner des badges</li>
            <li>• La progression est sauvegardée dans le navigateur — évitez de vider le cache</li>
          </ul>
        </div>

        {/* Export / Import */}
        {!isReadOnly && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">💾 Sauvegarde de la progression</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
              Sauvegarde toute la progression dans un fichier pour éviter de la perdre si le cache du navigateur est vidé.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleExport}
                className="flex-1 min-w-0 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
              >
                💾 Télécharger la sauvegarde
              </button>
              <label className="flex-1 min-w-0 cursor-pointer">
                <span className="block bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center">
                  📂 Restaurer une sauvegarde
                </span>
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-center pb-6">
          <Link href="/" className="text-sm text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
