"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CHALLENGES, getCompletedChallenges } from "@/lib/challenges";

function getDailyChallenge() {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
  }
  return CHALLENGES[Math.abs(hash) % CHALLENGES.length];
}

function timeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h${String(minutes).padStart(2, "0")}`;
}

export default function DailyChallenge() {
  const t = useTranslations("DailyChallenge");
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const challenge = getDailyChallenge();

  useEffect(() => {
    setMounted(true);
    const refresh = () => setIsDone(getCompletedChallenges().includes(challenge.id));
    refresh();
    setTimeLeft(timeUntilMidnight());

    window.addEventListener("pythonkids:progress", refresh);
    const timer = setInterval(() => setTimeLeft(timeUntilMidnight()), 60000);
    return () => {
      window.removeEventListener("pythonkids:progress", refresh);
      clearInterval(timer);
    };
  }, [challenge.id]);

  if (!mounted) return null;

  return (
    <section className="w-full px-6 pb-8">
      <div className="max-w-2xl mx-auto">
        <div
          className={`rounded-2xl border-2 p-5 ${
            isDone
              ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
              : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                isDone
                  ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                  : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-500"
              }`}
            >
              {t("label")}
            </span>
            {isDone ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                {t("completed")}
              </span>
            ) : (
              timeLeft && (
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {t("changes_in", { timeLeft })}
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl shrink-0">{challenge.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-bold text-base mb-0.5 ${
                  isDone ? "text-green-800 dark:text-green-300" : "text-gray-800 dark:text-white"
                }`}
              >
                {challenge.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">
                {challenge.description.split("\n")[0]}
              </p>
              <span
                className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-bold text-white bg-gradient-to-r ${challenge.difficultyColor}`}
              >
                {challenge.difficulty}
              </span>
            </div>
            <div className="shrink-0">
              {isDone ? (
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-xl shadow-md">
                  ✓
                </div>
              ) : (
                <Link
                  href={`/challenges/${challenge.id}`}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                >
                  {t("take_on")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
