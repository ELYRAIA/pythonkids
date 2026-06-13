"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { getProgress, BADGES } from "@/lib/progress";
import { getStreak } from "@/lib/streak";
import { getCompletedChallenges, CHALLENGES } from "@/lib/challenges";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";
import { getLevelAvgStars } from "@/lib/mastery";
import { getPlayerRank } from "@/lib/ranks";
import { getBattlePassState, getBPXPInfo, BP_MAX_LEVEL, BP_SEASON_END } from "@/lib/battlePass";
import { getFailedChallenges } from "@/lib/mistakes";
import { getSessionHistory, getTotalSeconds, getSecondsForDate, formatDuration } from "@/lib/sessionTime";
import { lf } from "@/lib/localize";

interface SharedData {
  username: string;
  earnedBadges: string[];
  completedLessons: Record<string, number[]>;
  completedChallenges: string[];
  streak: { currentStreak: number; longestStreak: number; playDates: string[] };
}

export default function ParentPage() {
  const t = useTranslations("Parent");
  const locale = useLocale();
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({});
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, playDates: [] as string[] });
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [reportEmail, setReportEmail] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState("");
  const [bpLevel, setBpLevel] = useState(0);
  const [bpProgress, setBpProgress] = useState(0);
  const [bpPremium, setBpPremium] = useState(false);
  const [failedChallenges, setFailedChallenges] = useState<Record<string, number>>({});
  const [totalRealSeconds, setTotalRealSeconds] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<{ date: string; seconds: number }[]>([]);

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
    const bp = getBattlePassState();
    const bpInfo = getBPXPInfo();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBpLevel(bp.currentLevel);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBpProgress(bpInfo.progress);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBpPremium(bp.isPremium);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailedChallenges(getFailedChallenges());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalRealSeconds(getTotalSeconds());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionHistory(getSessionHistory());
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

  const handleSendReport = async () => {
    if (!reportEmail.includes("@")) return;
    setReportSending(true);
    setReportError("");
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: reportEmail,
          username,
          stats: {
            doneLessons,
            totalLessons,
            completedChallenges: completedChallenges.length,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            earnedBadges: earnedBadges.length,
            totalBadges: BADGES.length,
            bpLevel,
            timeMinutes,
          },
        }),
      });
      if (res.ok) { setReportSent(true); setTimeout(() => setReportSent(false), 4000); }
      else setReportError("Erreur lors de l'envoi. Vérifiez votre clé Resend.");
    } catch { setReportError("Erreur réseau."); }
    finally { setReportSending(false); }
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

  // Activité des 28 derniers jours
  const today = new Date();
  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split("T")[0];
  });

  // Graphique hebdo : 8 semaines, nb de jours joués par semaine
  const weeklyData = Array.from({ length: 8 }, (_, weekIdx) => {
    const days: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - ((7 - weekIdx - 1) * 7 + (6 - d)));
      days.push(date.toISOString().split("T")[0]);
    }
    const played = days.filter((dt) => streak.playDates.includes(dt)).length;
    const label = (() => { const d = new Date(days[0]); return `${d.getDate()}/${d.getMonth() + 1}`; })();
    return { label, played, days };
  });
  const maxWeekPlayed = Math.max(...weeklyData.map((w) => w.played), 1);

  // Sujets difficiles : défis échoués le plus souvent
  const hardChallenges = Object.entries(failedChallenges)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => ({ challenge: CHALLENGES.find((c) => c.id === id), count }))
    .filter((x) => x.challenge);

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
                {shareCopied ? `✓ ${t("share_copied")}` : "📤 Partager la progression"}
              </button>
              {shareCopied && (
                <p className="text-blue-200 text-xs mt-2">{t("share_tooltip")}</p>
              )}
            </div>
          )}
        </div>

        {/* Prochaine étape recommandée */}
        {mounted && (nextLesson || nextChallenge) && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
              {t("next_step_title")}
            </h2>
            <div className="space-y-2">
              {nextLesson && (
                <Link href={`/levels/${nextLesson.level.id}/lessons/${nextLesson.lessonIndex}`}
                  className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors group">
                  <span className="text-2xl">{nextLesson.level.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{nextLesson.lesson.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t("level_lesson", { level: nextLesson.level.id, lesson: nextLesson.lessonIndex + 1 })}</p>
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
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t("difficulty", { difficulty: nextChallenge.difficulty })}</p>
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
            { emoji: "📖", value: `${doneLessons}/${totalLessons}`, label: t("lessons_label") },
            { emoji: "🎯", value: `${completedChallenges.length}/${totalChallenges}`, label: t("challenges_label") },
            { emoji: "🏆", value: `${levelsCompleted}/6`, label: t("levels_label") },
            { emoji: "🔥", value: `${streak.currentStreak}j`, label: t("streak_label") },
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
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("learning_time")}</h2>
          {mounted && totalRealSeconds > 0 ? (
            <>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{formatDuration(totalRealSeconds)}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Temps réel mesuré sur {sessionHistory.length} jour{sessionHistory.length > 1 ? "s" : ""} de connexion</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {timeHours > 0 ? `${timeHours}h ${timeMin}min` : `${timeMinutes} min`}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {t("time_estimate", { lessons: doneLessons, s: doneLessons > 1 ? "s" : "", challenges: completedChallenges.length, s2: completedChallenges.length > 1 ? "s" : "" })}
              </p>
            </>
          )}
        </div>

        {/* Graphique temps par jour (28 jours) */}
        {mounted && sessionHistory.length > 0 && (() => {
          const maxSec = Math.max(...last28.map((d) => getSecondsForDate(d)), 1);
          return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
              <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("time_daily_label")}</h2>
              <div className="flex items-end gap-1 h-16">
                {last28.map((date) => {
                  const sec = getSecondsForDate(date);
                  const barH = sec > 0 ? Math.max(4, Math.round((sec / maxSec) * 60)) : 2;
                  const isToday = date === today.toISOString().split("T")[0];
                  return (
                    <div key={date} className="flex-1 flex flex-col justify-end" style={{ height: 60 }}>
                      <div
                        title={sec > 0 ? `${date} : ${formatDuration(sec)}` : date}
                        className={`w-full rounded-sm transition-all ${sec > 0 ? (isToday ? "bg-blue-500" : "bg-blue-300 dark:bg-blue-700") : "bg-gray-100 dark:bg-slate-700"}`}
                        style={{ height: barH }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{t("time_28_days_ago")}</span>
                <span className="text-xs text-gray-400">{t("time_today")}</span>
              </div>
            </div>
          );
        })()}

        {/* Graphique hebdomadaire */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{t("weekly_activity")}</h2>
            <span className="text-xs text-orange-500 font-semibold">{t("longest_streak", { days: streak.longestStreak })}</span>
          </div>
          <div className="flex items-end gap-1 h-20">
            {weeklyData.map((week, i) => {
              const barH = maxWeekPlayed > 0 ? Math.round((week.played / maxWeekPlayed) * 72) : 0;
              const isCurrentWeek = i === weeklyData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: 72 }}>
                    <div
                      title={`${week.played} jour${week.played > 1 ? "s" : ""} joués`}
                      className={`w-full rounded-t transition-all ${isCurrentWeek ? "bg-orange-400 dark:bg-orange-500" : "bg-orange-200 dark:bg-orange-800/50"}`}
                      style={{ height: barH || 3 }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 leading-none">{week.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">8 semaines ago</span>
            <span className="text-xs text-gray-400">cette semaine</span>
          </div>
        </div>

        {/* Heatmap 28 jours */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("heatmap_title")}</h2>
          <div className="flex gap-1 flex-wrap">
            {last28.map((date) => {
              const played = streak.playDates.includes(date);
              const isToday = date === today.toISOString().split("T")[0];
              return (
                <div
                  key={date}
                  title={date}
                  className={`h-6 rounded transition-all ${
                    played ? "bg-orange-400 dark:bg-orange-500" : "bg-gray-100 dark:bg-slate-700"
                  } ${isToday ? "ring-2 ring-orange-300" : ""}`}
                  style={{ width: "calc((100% - 27 * 4px) / 28)" }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{t("time_28_days_ago")}</span>
            <span className="text-xs text-gray-400">{t("time_today")}</span>
          </div>
        </div>

        {/* Progression par niveau */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("level_progress")}</h2>
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
                          {t("level_heading", { id: level.id, name: lf(level, "name", locale) })}
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
          <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("badge_count", { count: earnedBadges.length, total: BADGES.length })}</h2>
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500">{t("no_badges")}</p>
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

        {/* Sujets difficiles */}
        {mounted && hardChallenges.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("hard_challenges")}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">{t("hard_challenges_desc")}</p>
            <div className="space-y-2">
              {hardChallenges.map(({ challenge, count }) => challenge && (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.id}`}
                  className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                >
                  <span className="text-xl">{challenge.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{challenge.title}</p>
                    <p className="text-xs text-red-500 dark:text-red-400">{count > 1 ? t("challenge_attempt_plural", { count }) : t("challenge_attempt", { count })}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${challenge.difficultyColor} text-white`}>
                    {challenge.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pass de Combat */}
        {mounted && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{t("battle_pass")}</h2>
              {bpPremium && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700 rounded-full px-2 py-0.5 font-bold">{t("bp_premium")}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center shrink-0">
                <div className="text-3xl font-black text-gray-800 dark:text-white">{bpLevel}</div>
                <div className="text-xs text-gray-400 dark:text-slate-500">/ {BP_MAX_LEVEL}</div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 mb-1">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                    style={{ width: `${bpProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {bpLevel >= BP_MAX_LEVEL
                    ? t("bp_completed")
                    : t("bp_season_end", { level: bpLevel, date: new Date(BP_SEASON_END).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) })}
                </p>
              </div>
            </div>
            {!bpPremium && (
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                {t("bp_premium_price")}
              </p>
            )}
          </div>
        )}

        {/* Note pédagogique */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">{t("tips_title")}</h2>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5">
            <li>• {t("tip_1")}</li>
            <li>• {t("tip_2")}</li>
            <li>• {t("tip_3")}</li>
            <li>• {t("tip_4")}</li>
          </ul>
        </div>

        {/* Rapport par email */}
        {!isReadOnly && mounted && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">📧 Rapport par email</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
              Recevez un résumé de la progression de {username} directement dans votre boîte mail.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={reportEmail}
                onChange={(e) => setReportEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 min-w-0 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleSendReport}
                disabled={reportSending || !reportEmail.includes("@")}
                className="shrink-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {reportSending ? "⏳" : reportSent ? "✓ Envoyé !" : "Envoyer"}
              </button>
            </div>
            {reportError && <p className="text-xs text-red-500 mt-2">{reportError}</p>}
          </div>
        )}

        {/* Export / Import */}
        {!isReadOnly && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h2 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t("backup_title")}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
              {t("backup_desc")}
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleExport}
                className="flex-1 min-w-0 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
              >
                {t("export_button")}
              </button>
              <label className="flex-1 min-w-0 cursor-pointer">
                <span className="block bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center">
                  {t("import_button")}
                </span>
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-center pb-6">
          <Link href="/" className="text-sm text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
            {t("back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
