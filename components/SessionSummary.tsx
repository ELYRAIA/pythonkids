"use client";

import { useState, useEffect } from "react";
import { getStreak } from "@/lib/streak";
import { getGems } from "@/lib/gems";

const SHOWN_KEY = "pythonkids_summary_shown";
const LESSONS_KEY = "pythonkids_lessons_today";

interface SummaryData {
  lessonsToday: number;
  streak: number;
  gems: number;
}

function readSummary(): SummaryData | null {
  try {
    const raw = localStorage.getItem(LESSONS_KEY);
    const data: { date: string; count: number } = raw ? JSON.parse(raw) : { date: "", count: 0 };
    const today = new Date().toISOString().split("T")[0];
    const lessonsToday = data.date === today ? data.count : 0;
    if (lessonsToday < 1) return null;
    return {
      lessonsToday,
      streak: getStreak().currentStreak,
      gems: getGems(),
    };
  } catch {
    return null;
  }
}

function getMessage(lessons: number, streak: number): string {
  if (streak >= 7) return `🔥 ${streak} jours de suite — tu es en feu !`;
  if (lessons >= 5) return "🚀 Incroyable, 5 leçons aujourd'hui !";
  if (lessons >= 3) return "💪 Super session, continue comme ça !";
  if (lessons === 2) return "👏 Deux leçons, belle journée !";
  return "✅ Bonne session, reviens demain !";
}

export default function SessionSummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only once per browser session
    const alreadyShown = sessionStorage.getItem(SHOWN_KEY);
    if (alreadyShown) return;

    const summary = readSummary();
    if (!summary) return;

    setData(summary);
    setVisible(true);
    sessionStorage.setItem(SHOWN_KEY, "1");

    // Auto-dismiss after 8s
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!visible || !data) return null;

  return (
    <div className="w-full px-6 pb-4">
      <div
        className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg"
        style={{ animation: "badge-pop 0.4s ease-out" }}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-4 flex items-center gap-4">
          <div className="text-3xl select-none">🎉</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-sm leading-tight">
              {getMessage(data.lessonsToday, data.streak)}
            </p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-green-100 text-xs">📖 {data.lessonsToday} leçon{data.lessonsToday > 1 ? "s" : ""} aujourd&apos;hui</span>
              {data.streak > 0 && <span className="text-green-100 text-xs">🔥 Streak {data.streak}j</span>}
              <span className="text-green-100 text-xs">💎 {data.gems} gemmes</span>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-green-200 hover:text-white transition-colors text-lg shrink-0"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
