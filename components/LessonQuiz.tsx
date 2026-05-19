"use client";

import { useState } from "react";
import type { LessonQuiz as QuizData } from "@/lib/lessons";

interface Props {
  quiz: QuizData;
  levelColor: string;
  onDone: (stars: number) => void;
}

export default function LessonQuiz({ quiz, levelColor, onDone }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [totalWrong, setTotalWrong] = useState(0);

  const question = quiz.questions[current];

  const confirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    const isWrong = selected !== question.correct;
    if (isWrong) setWrongCount((w) => w + 1);
  };

  const next = () => {
    const newWrong = selected !== question.correct ? wrongCount + (confirmed ? 0 : 1) : wrongCount;
    if (current + 1 >= quiz.questions.length) {
      setAllDone(true);
      setTotalWrong(newWrong);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const finish = () => {
    const stars = totalWrong === 0 ? 3 : totalWrong === 1 ? 2 : 1;
    onDone(stars);
  };

  if (allDone) {
    const stars = totalWrong === 0 ? 3 : totalWrong === 1 ? 2 : 1;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-5xl mb-3">
            {stars === 3 ? "🌟🌟🌟" : stars === 2 ? "⭐⭐" : "⭐"}
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">
            {stars === 3 ? "Parfait !" : stars === 2 ? "Bien joué !" : "Continue comme ça !"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
            {stars === 3
              ? "Toutes les réponses sont correctes !"
              : `${quiz.questions.length - totalWrong}/${quiz.questions.length} bonnes réponses.`}
          </p>
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`text-3xl transition-all ${s <= stars ? "scale-110" : "opacity-20 grayscale"}`}>
                ⭐
              </span>
            ))}
          </div>
          <button
            onClick={finish}
            className={`w-full bg-gradient-to-r ${levelColor} text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity`}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${levelColor} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-sm">❓ Quiz rapide</span>
            <span className="text-white/80 text-xs">{current + 1}/{quiz.questions.length}</span>
          </div>
          {/* Barre de progression */}
          <div className="mt-2 w-full bg-white/20 rounded-full h-1">
            <div
              className="h-1 bg-white rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Question */}
          <p className="text-base font-bold text-gray-800 dark:text-white mb-5 leading-snug">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2 mb-5">
            {question.options.map((opt, i) => {
              let variant = "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-purple-300";
              if (selected === i && !confirmed) variant = "bg-purple-50 dark:bg-purple-900/30 border-purple-400";
              if (confirmed && i === question.correct) variant = "bg-green-50 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-400";
              if (confirmed && selected === i && i !== question.correct) variant = "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400";

              return (
                <button
                  key={i}
                  onClick={() => !confirmed && setSelected(i)}
                  disabled={confirmed}
                  className={`w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all font-medium ${variant}`}
                >
                  <span className="mr-2 text-gray-400 dark:text-slate-500 font-mono">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                  {confirmed && i === question.correct && " ✓"}
                  {confirmed && selected === i && i !== question.correct && " ✗"}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {confirmed && selected !== question.correct && question.explanation && (
            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 mb-4">
              💡 {question.explanation}
            </p>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3">
            {!confirmed ? (
              <button
                onClick={confirm}
                disabled={selected === null}
                className={`px-5 py-2 rounded-full text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r ${levelColor} hover:opacity-90`}
              >
                Valider
              </button>
            ) : (
              <button
                onClick={next}
                className={`px-5 py-2 rounded-full text-sm font-bold text-white transition-all bg-gradient-to-r ${levelColor} hover:opacity-90`}
              >
                {current + 1 < quiz.questions.length ? "Suivant →" : "Voir mon score"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
