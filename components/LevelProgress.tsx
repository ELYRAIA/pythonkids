"use client";

import { useState, useEffect, useCallback } from "react";
import PythonEditor from "./PythonEditor";
import {
  getProgress,
  markLessonComplete,
  markLevelComplete,
  BADGES,
  type Badge,
} from "@/lib/progress";
import { playBadgeSound, playLessonDoneSound } from "@/lib/sounds";
import { updateStreak } from "@/lib/streak";
import { getLessonStars } from "@/lib/mastery";
import { trackLessonToday, refreshQuests } from "@/lib/quests";
import { checkAchievements } from "@/lib/achievements";
import Confetti from "./Confetti";

interface Lesson {
  title: string;
  description: string;
  code: string;
}

interface LevelProgressProps {
  levelId: number;
  totalLessons: number;
  levelColor: string;
  lessons: Lesson[];
}

export default function LevelProgress({ levelId, totalLessons, levelColor, lessons }: LevelProgressProps) {
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);
  const [toastBadge, setToastBadge] = useState<Badge | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    setCompletedIndexes(progress.completedLessons[String(levelId)] ?? []);
  }, [levelId]);

  const showToast = useCallback((badge: Badge) => {
    setToastBadge(badge);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 100); // reset for re-trigger
    setTimeout(() => setToastBadge(null), 4500);
  }, []);

  const handleComplete = (lessonIndex: number) => {
    const alreadyDone = completedIndexes.includes(lessonIndex);
    if (alreadyDone) {
      // Décocher
      const progress = getProgress();
      const key = String(levelId);
      const updated = (progress.completedLessons[key] ?? []).filter((i) => i !== lessonIndex);
      progress.completedLessons[key] = updated;
      localStorage.setItem("pythonkids_progress", JSON.stringify(progress));
      setCompletedIndexes(updated);
      return;
    }

    // Marquer comme terminée
    playLessonDoneSound();
    trackLessonToday();
    const streakBadges = updateStreak();
    const newBadges = [...streakBadges, ...markLessonComplete(levelId, lessonIndex)];
    const updatedIndexes = [...completedIndexes, lessonIndex];
    setCompletedIndexes(updatedIndexes);

    // Vérifier si le niveau est complet
    if (updatedIndexes.length >= totalLessons) {
      const levelBadges = markLevelComplete(levelId, totalLessons);
      newBadges.push(...levelBadges);
    }

    refreshQuests();
    checkAchievements();

    // Afficher le premier nouveau badge avec son
    if (newBadges.length > 0) {
      const badge = BADGES.find((b) => b.id === newBadges[0]);
      if (badge) { playBadgeSound(); showToast(badge); }
    }
  };

  const completedCount = completedIndexes.length;
  const percent = Math.round((completedCount / totalLessons) * 100);

  return (
    <>
      {/* Barre de progression */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-purple-50 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">Progression du niveau</span>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{completedCount}/{totalLessons} leçons</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${levelColor} transition-all duration-500`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {completedCount === totalLessons && (
          <p className="text-center text-sm font-bold text-green-600 dark:text-green-400 mt-2">
            🎉 Niveau terminé ! Tu as gagné un badge !
          </p>
        )}
      </div>

      {/* Leçons */}
      <div className="space-y-8">
        {lessons.map((lesson, index) => {
          const done = completedIndexes.includes(index);
          const stars = done ? getLessonStars(levelId, index) : 0;
          return (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${done ? "border-green-300 dark:border-green-700" : "border-purple-50 dark:border-slate-700"}`}
            >
              <div className={`bg-gradient-to-r ${levelColor} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0 ${done ? "bg-green-400 text-white" : "bg-white/20"}`}>
                      {done ? "✓" : index + 1}
                    </span>
                    <h2 className="text-lg font-bold">{lesson.title}</h2>
                  </div>
                  {done && (
                    <div className="flex items-center gap-2">
                      {stars > 0 && (
                        <span className="text-yellow-300 text-sm">
                          {"⭐".repeat(stars)}
                        </span>
                      )}
                      <span className="bg-green-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Terminée ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed whitespace-pre-line">{lesson.description}</p>
                <PythonEditor defaultCode={lesson.code} height="320px" />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleComplete(index)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      done
                        ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
                        : `bg-gradient-to-r ${levelColor} text-white hover:opacity-90`
                    }`}
                  >
                    {done ? "✓ Terminée (annuler)" : "Marquer comme terminée ✓"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confetti */}
      <Confetti active={confetti} />

      {/* Toast badge */}
      {toastBadge && (
        <div className="fixed bottom-6 right-6 z-50 badge-toast">
          <div className={`bg-gradient-to-r ${toastBadge.color} text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-xs`}>
            <span className="text-4xl">{toastBadge.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide opacity-80">Nouveau badge !</p>
              <p className="font-bold text-base">{toastBadge.name}</p>
              <p className="text-xs opacity-90">{toastBadge.desc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
