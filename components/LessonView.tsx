"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { lf } from "@/lib/localize";
import PythonEditor from "./PythonEditor";
import LessonExercise from "./LessonExercise";
import {
  getProgress,
  markLessonComplete,
  markLevelComplete,
  BADGES,
  type Badge,
} from "@/lib/progress";
import { playBadgeSound, playLessonDoneSound } from "@/lib/sounds";
import { updateStreak } from "@/lib/streak";
import { addChest } from "@/lib/chests";
import { setLessonStars } from "@/lib/mastery";
import { trackLessonToday, refreshQuests } from "@/lib/quests";
import { trackLessonWeek, refreshWeeklyQuests } from "@/lib/weeklyQuests";
import { addXP } from "@/lib/xp";
import { addBattlePassXP } from "@/lib/battlePass";
import { calculateScore } from "@/lib/score";
import { incrementCombo, type ComboResult } from "@/lib/combo";
import { checkSecretBadges } from "@/lib/progress";
import { checkAchievements } from "@/lib/achievements";
import { notifyProgress } from "@/lib/events";
import Confetti from "./Confetti";
import BadgeCelebration from "./BadgeCelebration";
import LessonQuiz from "./LessonQuiz";
import LevelComplete from "./LevelComplete";
import LessonConceptCards from "./LessonConceptCards";

import type { Lesson } from "@/lib/lessons";
import { apiFetch } from "@/lib/api";

interface LessonViewProps {
  levelId: number;
  levelColor: string;
  levelName: string;
  lessonIndex: number;
  totalLessons: number;
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}

export default function LessonView({
  levelId,
  levelColor,
  levelName,
  lessonIndex,
  totalLessons,
  lesson,
  prevLesson,
  nextLesson,
}: LessonViewProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("LessonView");
  const [done, setDone] = useState(false);
  const [toastBadge, setToastBadge] = useState<Badge | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exerciseAttempted, setExerciseAttempted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [exercisePassedFirstTry, setExercisePassedFirstTry] = useState(true);
  const [comboResult, setComboResult] = useState<ComboResult | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const hasExercise = !!lesson.exercise;

  useEffect(() => {
    const progress = getProgress();
    const completedInLevel = progress.completedLessons[String(levelId)] ?? [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(completedInLevel.includes(lessonIndex));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [levelId, lessonIndex]);

  const showToast = useCallback((badge: Badge) => {
    setToastBadge(badge);
  }, []);

  const handleComplete = () => {
    if (done) {
      // Décocher
      const progress = getProgress();
      const key = String(levelId);
      const updated = (progress.completedLessons[key] ?? []).filter((i) => i !== lessonIndex);
      progress.completedLessons[key] = updated;
      localStorage.setItem("pythonkids_progress", JSON.stringify(progress));
      setDone(false);
      notifyProgress();
      return;
    }

    // Si la leçon a un quiz, l'afficher d'abord
    if (lesson.quiz && !done) {
      setShowQuiz(true);
      return;
    }
    completeLessonNow(exercisePassedFirstTry ? 3 : 2);
  };

  const completeLessonNow = (stars: number) => {
    setShowQuiz(false);
    playLessonDoneSound();
    addXP(15);
    addBattlePassXP(50);
    trackLessonToday();
    trackLessonWeek();
    const combo = incrementCombo();
    if (combo.milestone) {
      setComboResult(combo);
      setTimeout(() => setComboResult(null), 3000);
    }
    const streakBadges = updateStreak();
    const newBadges = [...streakBadges, ...markLessonComplete(levelId, lessonIndex)];
    const secretBadges = checkSecretBadges({});
    newBadges.push(...secretBadges);

    const progress = getProgress();
    const completedInLevel = progress.completedLessons[String(levelId)] ?? [];
    if (completedInLevel.length >= totalLessons) {
      const levelBadges = markLevelComplete(levelId, totalLessons);
      newBadges.push(...levelBadges);
      if (levelBadges.length > 0) {
        addChest(levelId);
        setTimeout(() => setShowLevelComplete(true), 1200);
      }
    }

    setLessonStars(levelId, lessonIndex, stars);
    refreshQuests();
    refreshWeeklyQuests();
    checkAchievements();
    // Mise à jour classement
    const newScore = calculateScore();
    const storedUser = localStorage.getItem("pythonkids_username");
    if (storedUser) {
      apiFetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: storedUser, score: newScore }),
      }).catch(() => {});
    }
    setDone(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 100);

    if (newBadges.length > 0) {
      const badge = BADGES.find((b) => b.id === newBadges[0]);
      if (badge) { playBadgeSound(); showToast(badge); }
    }
  };

  const goNext = () => {
    if (nextLesson !== null) {
      router.push(`/levels/${levelId}/lessons/${lessonIndex + 1}`);
    } else {
      router.push(`/levels/${levelId}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-8">
      {/* Écran de félicitations niveau complet */}
      {showLevelComplete && (
        <LevelComplete
          levelId={levelId}
          totalLessons={totalLessons}
          onClose={() => setShowLevelComplete(false)}
        />
      )}

      {/* Toast combo */}
      {comboResult && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
            <span className="text-2xl">🔥</span>
            <div>
              <div>{t("combo_title", { combo: comboResult.combo })}</div>
              <div className="text-xs font-normal opacity-90">+{comboResult.bonusGems} 💎 bonus</div>
            </div>
          </div>
        </div>
      )}

      {/* Indicateur de position */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
          {t("lesson_position", { index: lessonIndex + 1, total: totalLessons, name: levelName })}
        </span>
        {mounted && done && (
          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold">
            {t("done_badge")}
          </span>
        )}
      </div>

      {/* Titre + description */}
      <div className={`bg-gradient-to-r ${levelColor} rounded-2xl p-6 text-white mb-6 shadow-lg`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm`}>
            {lessonIndex + 1}
          </span>
          <h1 className="text-xl font-extrabold">{lf(lesson, 'title', locale)}</h1>
        </div>
        <p className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
          {lf(lesson, 'description', locale)}
        </p>
      </div>

      {/* Cartes de théorie */}
      {lesson.concepts && lesson.concepts.length > 0 && (
        <LessonConceptCards concepts={lesson.concepts} levelColor={levelColor} locale={locale} />
      )}

      {/* Éditeur */}
      <PythonEditor
        defaultCode={lf(lesson, 'code', locale) || lesson.code}
        height="380px"
        storageKey={`lesson_${levelId}_${lessonIndex}`}
      />

      {/* Exercice */}
      {lesson.exercise && (
        <LessonExercise
          exercise={lesson.exercise}
          levelColor={levelColor}
          onAttempted={() => setExerciseAttempted(true)}
          onFirstFailure={() => setExercisePassedFirstTry(false)}
        />
      )}

      {/* Bouton terminée */}
      <div className="mt-6 flex flex-col items-end gap-2">
        {hasExercise && !exerciseAttempted && !done && (
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {t("attempt_hint")}
          </p>
        )}
        <button
          onClick={handleComplete}
          disabled={hasExercise && !exerciseAttempted && !done}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            done
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
              : `bg-gradient-to-r ${levelColor} text-white hover:opacity-90 shadow-md`
          }`}
        >
          {done ? t("unmark_done") : t("mark_done")}
        </button>
      </div>

      {/* Navigation précédent / suivant */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {prevLesson !== null ? (
          <Link
            href={`/levels/${levelId}/lessons/${lessonIndex - 1}`}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            ← {lf(prevLesson, 'title', locale)}
          </Link>
        ) : (
          <Link
            href={`/levels/${levelId}`}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            {t("back_to_level")}
          </Link>
        )}

        {nextLesson !== null ? (
          <button
            onClick={goNext}
            className={`bg-gradient-to-r ${levelColor} text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-md`}
          >
            {lf(nextLesson, 'title', locale)} →
          </button>
        ) : (
          <button
            onClick={goNext}
            className={`bg-gradient-to-r ${levelColor} text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-md`}
          >
            {t("finish_level")}
          </button>
        )}
      </div>

      <Confetti active={confetti} />
      <BadgeCelebration badge={toastBadge} onDismiss={() => setToastBadge(null)} />

      {showQuiz && lesson.quiz && (
        <LessonQuiz
          quiz={lesson.quiz}
          levelColor={levelColor}
          onDone={(stars) => completeLessonNow(stars)}
        />
      )}
    </div>
  );
}
