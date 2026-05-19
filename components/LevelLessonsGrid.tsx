"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getProgress } from "@/lib/progress";
import type { LevelData } from "@/lib/lessons";
import Confetti from "./Confetti";

interface Props {
  level: LevelData;
}

export default function LevelLessonsGrid({ level }: Props) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const prevDoneRef = useRef<number | null>(null);

  useEffect(() => {
    const p = getProgress();
    const done = p.completedLessons[String(level.id)] ?? [];
    setCompleted(done);

    if (level.id > 0) {
      setLocked(!p.earnedBadges.includes(`level_${level.id - 1}`));
    }

    setMounted(true);
    prevDoneRef.current = done.length;

    const refresh = () => {
      const newP = getProgress();
      const newDone = newP.completedLessons[String(level.id)] ?? [];
      setCompleted(newDone);

      if (prevDoneRef.current !== null && prevDoneRef.current < level.lessons.length && newDone.length >= level.lessons.length) {
        const key = `pythonkids_celebrated_${level.id}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          setConfetti(true);
          setTimeout(() => setConfetti(false), 100);
          setShowCelebration(true);
        }
      }
      prevDoneRef.current = newDone.length;
    };
    window.addEventListener("pythonkids:progress", refresh);
    return () => window.removeEventListener("pythonkids:progress", refresh);
  }, [level.id, level.lessons.length]);

  const total = level.lessons.length;
  const doneCount = mounted ? completed.length : 0;
  const percent = Math.round((doneCount / total) * 100);
  const [animPercent, setAnimPercent] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setAnimPercent(percent), 80);
    return () => clearTimeout(t);
  }, [mounted, percent]);

  if (mounted && locked) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-3">
          Niveau verrouillé
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          Termine le niveau {level.id - 1} en complétant toutes ses leçons pour débloquer celui-ci !
        </p>
        <Link
          href={`/levels/${level.id - 1}`}
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
        >
          Aller au niveau {level.id - 1} →
        </Link>
      </div>
    );
  }

  return (
    <>
      <Confetti active={confetti} />

      {/* Modal de félicitations */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-6xl mb-3">{level.emoji}</div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
              Niveau terminé ! 🎉
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-300 mb-6">
              Bravo ! Tu as complété toutes les leçons du niveau{" "}
              <strong className="text-purple-600 dark:text-purple-400">{level.name}</strong> !
              Tu viens de gagner un badge.
            </p>
            <div className="flex flex-col gap-3">
              {level.id < 5 && (
                <Link
                  href={`/levels/${level.id + 1}`}
                  onClick={() => setShowCelebration(false)}
                  className={`bg-gradient-to-r ${level.color} text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-md`}
                >
                  Niveau suivant →
                </Link>
              )}
              {level.id === 5 && (
                <Link
                  href="/certificate"
                  onClick={() => setShowCelebration(false)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
                >
                  🎓 Obtenir mon certificat
                </Link>
              )}
              <button
                onClick={() => setShowCelebration(false)}
                className="text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
              >
                Rester sur ce niveau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de progression globale du niveau */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-purple-50 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">Progression du niveau</span>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{doneCount}/{total} leçons</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${level.color} transition-all duration-700`}
            style={{ width: `${animPercent}%` }}
          />
        </div>
        {mounted && doneCount === total && (
          <p className="text-center text-sm font-bold text-green-600 dark:text-green-400 mt-2">
            🎉 Niveau terminé ! Tu as gagné un badge !
          </p>
        )}
      </div>

      {/* Grille de leçons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {level.lessons.map((lesson, index) => {
          const isDone = mounted && completed.includes(index);
          const isMiniProject = lesson.title.toLowerCase().includes("mini-projet");

          return (
            <Link key={index} href={`/levels/${level.id}/lessons/${index}`}>
              <div
                className={`group relative rounded-2xl border-2 p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full ${
                  isDone
                    ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                    : "bg-white dark:bg-slate-800 border-purple-50 dark:border-slate-700"
                }`}
              >
                {/* Numéro + état */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                      isDone
                        ? "bg-green-500 text-white"
                        : `bg-gradient-to-br ${level.color} text-white`
                    }`}
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {isMiniProject && (
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-bold">
                        Projet
                      </span>
                    )}
                    {isDone && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
                        Terminée
                      </span>
                    )}
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-2 ${isDone ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-white"}`}>
                  {lesson.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {lesson.description.split("\n")[0]}
                </p>

                <div className="mt-3 flex items-center justify-end">
                  <span className={`text-xs font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent group-hover:opacity-80 transition-opacity`}>
                    {isDone ? "Revoir →" : "Commencer →"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
