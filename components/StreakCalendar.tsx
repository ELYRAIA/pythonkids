"use client";

import { useState } from "react";
import type { StreakData } from "@/lib/streak";

interface Props {
  streakData: StreakData;
}

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export default function StreakCalendar({ streakData }: Props) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const { year, month } = view;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Convert Sunday=0 to Mon-first (Mon=0 … Sun=6)
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const playDates = streakData.playDates ?? [];
  const todayStr = today.toISOString().split("T")[0];
  const monthLabel = firstDay.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const cells: (number | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };
  const nextMonth = () => {
    if (isCurrentMonth) return;
    const d = new Date(year, month + 1, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  // Count played days this month
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const playedThisMonth = playDates.filter((d) => d.startsWith(monthPrefix)).length;

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-lg font-bold"
        >
          ‹
        </button>
        <div className="text-center">
          <span className="text-sm font-bold text-gray-700 dark:text-slate-200 capitalize">{monthLabel}</span>
          {playedThisMonth > 0 && (
            <span className="block text-[10px] text-orange-500 dark:text-orange-400 font-semibold">
              {playedThisMonth} jour{playedThisMonth > 1 ? "s" : ""} joué{playedThisMonth > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={nextMonth}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
            isCurrentMonth
              ? "text-gray-200 dark:text-slate-700 cursor-default"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-400 dark:text-slate-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const played = playDates.includes(dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold transition-all select-none ${
                played
                  ? "bg-orange-400 dark:bg-orange-500 text-white shadow-sm"
                  : isToday
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 ring-2 ring-orange-300 dark:ring-orange-600"
                    : "bg-slate-50 dark:bg-slate-700/40 text-gray-400 dark:text-slate-500"
              }`}
            >
              {played ? "🔥" : day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
