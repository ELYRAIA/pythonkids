"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { LEVELS_DATA, type QuizQuestion } from "@/lib/lessons";
import { getProgress } from "@/lib/progress";
import { addGems } from "@/lib/gems";
import { addXP } from "@/lib/xp";
import { LEVELS } from "@/lib/levels";

interface QuizEntry {
  levelId: number;
  levelName: string;
  levelColor: string;
  levelEmoji: string;
  lessonIndex: number;
  lessonTitle: string;
  questions: QuizQuestion[];
}

type Phase = "list" | "quiz" | "result";

export default function QuizReviewPage() {
  const t = useTranslations("Quiz");
  const [mounted, setMounted] = useState(false);
  const [available, setAvailable] = useState<QuizEntry[]>([]);
  const [phase, setPhase] = useState<Phase>("list");
  const [active, setActive] = useState<QuizEntry | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [gemReward, setGemReward] = useState(0);

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    const completedLessons = progress.completedLessons;

    const entries: QuizEntry[] = [];
    for (const [lvlStr, lvlData] of Object.entries(LEVELS_DATA)) {
      const lvlId = parseInt(lvlStr);
      const done = completedLessons[lvlStr] ?? [];
      const lvlMeta = LEVELS.find((l) => l.id === lvlId);
      lvlData.lessons.forEach((lesson, i) => {
        if (lesson.quiz && done.includes(i)) {
          entries.push({
            levelId: lvlId,
            levelName: lvlData.name,
            levelColor: lvlData.color,
            levelEmoji: lvlData.emoji,
            lessonIndex: i,
            lessonTitle: lesson.title,
            questions: lesson.quiz!.questions,
          });
        }
      });
    }
    setAvailable(entries);
  }, []);

  const startQuiz = (entry: QuizEntry) => {
    setActive(entry);
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setWrong(0);
    setGemReward(0);
    setPhase("quiz");
  };

  const confirm = () => {
    if (selected === null || !active) return;
    setConfirmed(true);
    if (selected !== active.questions[current].correct) setWrong((w) => w + 1);
  };

  const next = () => {
    if (!active) return;
    const isLast = current + 1 >= active.questions.length;
    if (isLast) {
      const totalWrong = confirmed && selected !== active.questions[current].correct ? wrong : wrong;
      const score = active.questions.length - totalWrong;
      const gems = score * 5;
      addGems(gems);
      addXP(score * 3);
      setGemReward(gems);
      setPhase("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const question = active?.questions[current];
  const totalWrongFinal = wrong;
  const scoreFinal = active ? active.questions.length - totalWrongFinal : 0;
  const starsFinal = totalWrongFinal === 0 ? 3 : totalWrongFinal === 1 ? 2 : 1;

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 ${mounted ? "fade-in" : "invisible"}`}>
      <AppHeader />

      <div className="max-w-xl mx-auto px-4 py-6">

        {/* ── LISTE ── */}
        {phase === "list" && (
          <>
            <div className="mb-6">
              <Link href="/profile" className="text-sm text-gray-400 dark:text-slate-500 hover:text-purple-500 transition-colors">
                {t("back_to_profile")}
              </Link>
              <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mt-2">{t("title")}</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                {t("subtitle")}
              </p>
            </div>

            {available.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-4xl mb-3">📖</p>
                <p className="text-base font-bold text-gray-700 dark:text-slate-200">{t("no_quizzes")}</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{t("no_quizzes_desc")}</p>
                <Link href="/" className="mt-4 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90">
                  {t("start_learning")}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {available.map((entry) => (
                  <button
                    key={`${entry.levelId}-${entry.lessonIndex}`}
                    onClick={() => startQuiz(entry)}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all group text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${entry.levelColor}`}>
                      {entry.levelEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                        {t("level_lesson", { level: entry.levelId, name: entry.levelName })}
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate mt-0.5">{entry.lessonTitle}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                        {entry.questions.length > 1
                          ? t("questions_plural", { count: entry.questions.length, gems: entry.questions.length * 5 })
                          : t("questions", { count: entry.questions.length, gems: entry.questions.length * 5 })}
                      </p>
                    </div>
                    <span className="text-gray-300 dark:text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all text-lg shrink-0">→</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── QUIZ ── */}
        {phase === "quiz" && active && question && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${active.levelColor} px-5 py-4`}>
              <div className="flex items-center justify-between mb-1">
                <button onClick={() => setPhase("list")} className="text-white/70 hover:text-white text-xs">{t("quit")}</button>
                <span className="text-white/80 text-xs font-semibold">
                  {current + 1} / {active.questions.length}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                <div
                  className="h-1.5 bg-white rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / active.questions.length) * 100}%` }}
                />
              </div>
              <p className="text-white text-xs font-semibold mt-2 opacity-80">{active.lessonTitle}</p>
            </div>

            <div className="p-5">
              <p className="text-base font-bold text-gray-800 dark:text-white mb-5 leading-snug">
                {question.question}
              </p>

              <div className="space-y-2 mb-5">
                {question.options.map((opt, i) => {
                  let cls = "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-purple-300 text-gray-700 dark:text-slate-200";
                  if (selected === i && !confirmed) cls = "bg-purple-50 dark:bg-purple-900/30 border-purple-400 text-purple-700 dark:text-purple-300";
                  if (confirmed && i === question.correct) cls = "bg-green-50 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-300";
                  if (confirmed && selected === i && i !== question.correct) cls = "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300";

                  return (
                    <button
                      key={i}
                      onClick={() => !confirmed && setSelected(i)}
                      disabled={confirmed}
                      className={`w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all font-medium ${cls}`}
                    >
                      <span className="mr-2 text-gray-400 dark:text-slate-500 font-mono text-xs">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                      {confirmed && i === question.correct && " ✓"}
                      {confirmed && selected === i && i !== question.correct && " ✗"}
                    </button>
                  );
                })}
              </div>

              {confirmed && selected !== question.correct && question.explanation && (
                <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 mb-4">
                  💡 {question.explanation}
                </p>
              )}

              <div className="flex justify-end">
                {!confirmed ? (
                  <button
                    onClick={confirm}
                    disabled={selected === null}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all disabled:opacity-40 bg-gradient-to-r ${active.levelColor} hover:opacity-90`}
                  >
                    {t("validate_button")}
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all bg-gradient-to-r ${active.levelColor} hover:opacity-90`}
                  >
                    {current + 1 < active.questions.length ? t("next_button") : t("see_score")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── RÉSULTAT ── */}
        {phase === "result" && active && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 text-center">
            <div className="text-5xl mb-3">
              {starsFinal === 3 ? "🌟🌟🌟" : starsFinal === 2 ? "⭐⭐" : "⭐"}
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-1">
              {starsFinal === 3 ? t("result_perfect") : starsFinal === 2 ? t("result_great") : t("result_continue")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              {scoreFinal}/{active.questions.length} {scoreFinal > 1 ? t("correct_answers_plural") : t("correct_answers")}
            </p>

            <div className="flex justify-center gap-1 mb-5">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`text-3xl transition-all ${s <= starsFinal ? "scale-110" : "opacity-20 grayscale"}`}>⭐</span>
              ))}
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl px-5 py-3 mb-6 inline-block">
              <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400">+{gemReward} 💎</p>
              <p className="text-xs text-teal-500 dark:text-teal-500">{t("gems_earned")}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => startQuiz(active)}
                className={`w-full py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r ${active.levelColor} hover:opacity-90`}
              >
                {t("restart_quiz")}
              </button>
              <button
                onClick={() => setPhase("list")}
                className="w-full py-3 rounded-full text-sm font-bold text-gray-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                {t("choose_another")}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
