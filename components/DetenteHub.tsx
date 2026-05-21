"use client";

import { useState, useEffect } from "react";
import SnakeGame from "./SnakeGame";
import MemoryGame from "./MemoryGame";
import WordlePython from "./WordlePython";
import FlashcardGame from "./FlashcardGame";
import TypingGame from "./TypingGame";
import { getGems } from "@/lib/gems";
import Link from "next/link";

type GameId = "snake" | "memory" | "wordle" | "flashcards" | "typing";

const GAMES: { id: GameId; label: string; emoji: string; desc: string; color: string }[] = [
  { id: "snake",      label: "Snake",      emoji: "🐍", desc: "Score → 💎",           color: "from-green-500 to-emerald-600" },
  { id: "memory",     label: "Memory",     emoji: "🧩", desc: "Paires → 💎",          color: "from-indigo-500 to-blue-600" },
  { id: "wordle",     label: "Wordle",     emoji: "🟩", desc: "Mot du jour · +💎",    color: "from-teal-500 to-cyan-600" },
  { id: "flashcards", label: "Flashcards", emoji: "🃏", desc: "Quiz chrono · +💎",    color: "from-purple-500 to-violet-600" },
  { id: "typing",     label: "Typing",     emoji: "⌨️", desc: "Vitesse · +💎",        color: "from-orange-500 to-amber-500" },
];

function getWordleStatus(): { played: boolean; won: boolean } {
  try {
    const today = new Date().toISOString().split("T")[0];
    const raw = localStorage.getItem("pythonkids_wordle_history");
    if (!raw) return { played: false, won: false };
    const history: Array<{ date: string; won: boolean }> = JSON.parse(raw);
    const entry = history.find((e) => e.date === today);
    return entry ? { played: true, won: entry.won } : { played: false, won: false };
  } catch { return { played: false, won: false }; }
}

const STORAGE_KEY = "pythonkids_detente_tab";

export default function DetenteHub() {
  const [activeGame, setActiveGame] = useState<GameId>("snake");
  const [gems, setGems]             = useState(0);
  const [wordle, setWordle]         = useState<{ played: boolean; won: boolean }>({ played: false, won: false });
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as GameId | null;
    if (saved && GAMES.find((g) => g.id === saved)) setActiveGame(saved);
    setGems(getGems());
    setWordle(getWordleStatus());
    setMounted(true);

    const onGems = () => setGems(getGems());
    window.addEventListener("pythonkids:gems", onGems);
    return () => window.removeEventListener("pythonkids:gems", onGems);
  }, []);

  const switchGame = (id: GameId) => {
    setActiveGame(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const current = GAMES.find((g) => g.id === activeGame)!;

  return (
    <div className="w-full px-4 py-6 max-w-2xl mx-auto">
      {/* Back link */}
      <div className="mb-5">
        <Link href="/" className="text-sm text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
          ← Accueil
        </Link>
      </div>

      {/* Header + stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">🎮 Espace Détente</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Joue et gagne des 💎 !</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold text-yellow-500">{mounted ? gems : "—"} 💎</div>
            <div className="text-xs text-gray-400 dark:text-slate-500">Total</div>
          </div>
        </div>

        {/* Quick stats bar */}
        {mounted && (
          <div className="flex gap-2 flex-wrap">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              wordle.played
                ? wordle.won
                  ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
                : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400"
            }`}>
              <span>🟩</span>
              <span>Wordle : {wordle.played ? (wordle.won ? "Gagné ✓" : "Perdu") : "Pas encore joué"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Game tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => switchGame(g.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              activeGame === g.id
                ? `bg-gradient-to-r ${g.color} text-white shadow-md scale-105`
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600"
            }`}
          >
            <span>{g.emoji}</span>
            <span className="hidden sm:inline">{g.label}</span>
          </button>
        ))}
      </div>

      {/* Active game card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Game header */}
        <div className={`bg-gradient-to-r ${current.color} px-5 py-3 flex items-center gap-2`}>
          <span className="text-xl">{current.emoji}</span>
          <div>
            <h2 className="font-extrabold text-white text-sm">{current.label}</h2>
            <p className="text-xs text-white/80">{current.desc}</p>
          </div>
        </div>

        {/* Game content */}
        <div className="p-5">
          {activeGame === "snake"      && <SnakeGame />}
          {activeGame === "memory"     && <MemoryGame />}
          {activeGame === "wordle"     && <WordlePython />}
          {activeGame === "flashcards" && <FlashcardGame />}
          {activeGame === "typing"     && <TypingGame />}
        </div>
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/levels/0"
          className="text-sm text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
        >
          Retour aux leçons 📚
        </Link>
      </div>
    </div>
  );
}
