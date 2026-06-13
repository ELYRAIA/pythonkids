"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import AppHeader from "@/components/AppHeader";
import { Link } from "@/i18n/navigation";
import { getProgress } from "@/lib/progress";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";
import { CHALLENGES, getCompletedChallenges } from "@/lib/challenges";
import { lf } from "@/lib/localize";
import { addXP } from "@/lib/xp";
import { fireToast } from "@/lib/toast";

const SESSION_SECONDS = 5 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function QuickSessionPage() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [nextLesson, setNextLesson] = useState<{
    levelId: number;
    lessonIndex: number;
    levelEmoji: string;
    levelName: string;
    lessonTitle: string;
    levelColor: string;
  } | null>(null);

  const [nextChallenge, setNextChallenge] = useState<{
    id: string;
    emoji: string;
    title: string;
    difficulty: string;
    difficultyColor: string;
  } | null>(null);

  const [lessonDone, setLessonDone] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = getProgress();
    const completedChallenges = getCompletedChallenges();

    // Prochaine leçon non faite
    for (const level of LEVELS) {
      const levelData = LEVELS_DATA[level.id];
      if (!levelData) continue;
      const done = p.completedLessons[String(level.id)] ?? [];
      for (let i = 0; i < levelData.lessons.length; i++) {
        if (!done.includes(i)) {
          const lesson = levelData.lessons[i];
          setNextLesson({
            levelId: level.id,
            lessonIndex: i,
            levelEmoji: level.emoji,
            levelName: lf(level, "name", locale) || level.name,
            lessonTitle: lf(lesson, "title", locale) || lesson.title,
            levelColor: level.color,
          });
          break;
        }
      }
      if (nextLesson) break;
    }

    // Prochain défi non fait
    const nextC = CHALLENGES.find((c) => !completedChallenges.includes(c.id));
    if (nextC) {
      setNextChallenge({
        id: nextC.id,
        emoji: nextC.emoji,
        title: lf(nextC, "title", locale) || nextC.title,
        difficulty: nextC.difficulty,
        difficultyColor: nextC.difficultyColor,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [started]);

  useEffect(() => {
    if (!started || bonusClaimed) return;
    if (lessonDone && challengeDone && timeLeft > 0) {
      addXP(50);
      fireToast("⚡ Bonus Express ! +50 XP", "⚡", "success");
      setBonusClaimed(true);
      clearInterval(timerRef.current!);
    }
  }, [lessonDone, challengeDone, timeLeft, started, bonusClaimed]);

  // Écouter la progression réelle via l'event progress
  useEffect(() => {
    const checkProgress = () => {
      if (!nextLesson) return;
      const p = getProgress();
      const done = p.completedLessons[String(nextLesson.levelId)] ?? [];
      if (done.includes(nextLesson.lessonIndex)) setLessonDone(true);

      if (!nextChallenge) return;
      const completedC = getCompletedChallenges();
      if (completedC.includes(nextChallenge.id)) setChallengeDone(true);
    };
    window.addEventListener("pythonkids:progress", checkProgress);
    return () => window.removeEventListener("pythonkids:progress", checkProgress);
  }, [nextLesson, nextChallenge]);

  const allDone = lessonDone && challengeDone;
  const timerWarning = timeLeft < 60 && timeLeft > 0;
  const timerDanger = timeLeft === 0;

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-4 py-8 max-w-lg mx-auto">

        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
            Session Express
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            1 leçon + 1 défi en 5 minutes. Bonus XP si tu y arrives !
          </p>
        </div>

        {/* Timer */}
        {started && (
          <div className={`text-center mb-6 transition-colors ${
            timerDanger ? "text-red-500" : timerWarning ? "text-orange-500" : "text-purple-600 dark:text-purple-400"
          }`}>
            <div className={`text-5xl font-black tabular-nums ${timerWarning && !timerDanger ? "animate-pulse" : ""}`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs mt-1 font-semibold opacity-70">
              {timerDanger ? "⏰ Temps écoulé !" : "⏱️ Temps restant"}
            </p>
          </div>
        )}

        {/* Carte bonus */}
        {!started && (
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-5 text-white text-center mb-6 shadow-lg">
            <p className="text-3xl mb-2">🎁</p>
            <p className="font-extrabold text-lg">+50 XP bonus</p>
            <p className="text-sm text-white/80 mt-1">si tu termines les 2 objectifs dans le temps imparti</p>
          </div>
        )}

        {allDone && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-5 text-white text-center mb-6 shadow-lg">
            <p className="text-4xl mb-2">🏆</p>
            <p className="font-extrabold text-xl">Mission accomplie !</p>
            {bonusClaimed && <p className="text-sm text-white/80 mt-1">+50 XP bonus remportés ! 🎉</p>}
          </div>
        )}

        {/* Objectifs */}
        <div className="space-y-3 mb-6">
          {/* Leçon */}
          {nextLesson ? (
            <div className={`bg-white dark:bg-slate-800 rounded-2xl border-2 p-4 transition-all ${
              lessonDone
                ? "border-green-300 dark:border-green-700 opacity-75"
                : "border-purple-200 dark:border-slate-600"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${
                  lessonDone
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-purple-100 dark:bg-purple-900/40"
                }`}>
                  {lessonDone ? "✅" : "📖"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    Leçon — Niveau {nextLesson.levelId} {nextLesson.levelEmoji}
                  </p>
                  <p className={`text-sm font-bold truncate ${
                    lessonDone ? "line-through text-gray-400" : "text-gray-800 dark:text-white"
                  }`}>
                    {nextLesson.lessonTitle}
                  </p>
                </div>
                {!lessonDone && (
                  <Link
                    href={`/levels/${nextLesson.levelId}/lessons/${nextLesson.lessonIndex}`}
                    className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${nextLesson.levelColor} text-white hover:opacity-90 transition-opacity`}
                  >
                    Commencer →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-700 rounded-2xl p-4">
              <p className="text-sm font-bold text-green-700 dark:text-green-400">🎉 Toutes les leçons sont terminées !</p>
            </div>
          )}

          {/* Défi */}
          {nextChallenge ? (
            <div className={`bg-white dark:bg-slate-800 rounded-2xl border-2 p-4 transition-all ${
              challengeDone
                ? "border-green-300 dark:border-green-700 opacity-75"
                : "border-orange-200 dark:border-slate-600"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${
                  challengeDone
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-orange-100 dark:bg-orange-900/40"
                }`}>
                  {challengeDone ? "✅" : nextChallenge.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    Défi — {nextChallenge.difficulty}
                  </p>
                  <p className={`text-sm font-bold truncate ${
                    challengeDone ? "line-through text-gray-400" : "text-gray-800 dark:text-white"
                  }`}>
                    {nextChallenge.title}
                  </p>
                </div>
                {!challengeDone && (
                  <Link
                    href={`/challenges/${nextChallenge.id}`}
                    className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${nextChallenge.difficultyColor} text-white hover:opacity-90 transition-opacity`}
                  >
                    Relever →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-700 rounded-2xl p-4">
              <p className="text-sm font-bold text-green-700 dark:text-green-400">🎉 Tous les défis sont relevés !</p>
            </div>
          )}
        </div>

        {/* Bouton démarrer / retour */}
        {!started ? (
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl font-extrabold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            ⚡ Lancer la session express !
          </button>
        ) : (
          <Link
            href="/"
            className="block text-center text-sm text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        )}
      </div>
    </div>
  );
}
