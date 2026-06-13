"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { addGems } from "@/lib/gems";

const WORD_LIST = [
  { word: "print", hint: "Affiche du texte à l'écran", hint_en: "Displays text on the screen" },
  { word: "while", hint: "Boucle qui répète tant qu'une condition est vraie", hint_en: "Loop that repeats while a condition is true" },
  { word: "break", hint: "Sort immédiatement d'une boucle", hint_en: "Exits a loop immediately" },
  { word: "class", hint: "Crée un nouveau type d'objet (POO)", hint_en: "Creates a new object type (OOP)" },
  { word: "raise", hint: "Lance une exception / erreur", hint_en: "Raises an exception / error" },
  { word: "yield", hint: "Transforme une fonction en générateur", hint_en: "Turns a function into a generator" },
  { word: "input", hint: "Lit une saisie de l'utilisateur", hint_en: "Reads user input" },
  { word: "range", hint: "Génère une suite de nombres", hint_en: "Generates a sequence of numbers" },
  { word: "false", hint: "Valeur booléenne « faux » (False)", hint_en: "Boolean value for false (False)" },
  { word: "bytes", hint: "Séquence d'octets immuable", hint_en: "Immutable sequence of bytes" },
  { word: "slice", hint: "Objet qui découpe une séquence", hint_en: "Object that slices a sequence" },
  { word: "float", hint: "Nombre décimal (ex : 3.14)", hint_en: "Decimal number (e.g. 3.14)" },
  { word: "tuple", hint: "Liste immuable de valeurs", hint_en: "Immutable list of values" },
  { word: "super", hint: "Accède à la classe parente", hint_en: "Accesses the parent class" },
  { word: "round", hint: "Arrondit un nombre décimal", hint_en: "Rounds a decimal number" },
  { word: "upper", hint: "Méthode : met une chaîne en majuscules", hint_en: "Method: converts a string to uppercase" },
  { word: "lower", hint: "Méthode : met une chaîne en minuscules", hint_en: "Method: converts a string to lowercase" },
  { word: "strip", hint: "Supprime les espaces en début et fin", hint_en: "Removes leading and trailing whitespace" },
  { word: "split", hint: "Découpe une chaîne en liste", hint_en: "Splits a string into a list" },
  { word: "count", hint: "Compte les occurrences dans une séquence", hint_en: "Counts occurrences in a sequence" },
  { word: "index", hint: "Retourne la position d'un élément", hint_en: "Returns the position of an element" },
  { word: "items", hint: "Méthode de dict : retourne les paires clé-valeur", hint_en: "Dict method: returns key-value pairs" },
  { word: "await", hint: "Attend la fin d'une coroutine (async)", hint_en: "Waits for a coroutine to finish (async)" },
  { word: "async", hint: "Définit une fonction asynchrone", hint_en: "Defines an asynchronous function" },
  { word: "match", hint: "Structure de correspondance (Python 3.10+)", hint_en: "Pattern matching structure (Python 3.10+)" },
  { word: "error", hint: "Classe de base des erreurs Python", hint_en: "Base class for Python errors" },
  { word: "ascii", hint: "Retourne la représentation ASCII d'un objet", hint_en: "Returns the ASCII representation of an object" },
  { word: "local", hint: "Variable définie dans une fonction", hint_en: "Variable defined inside a function" },
];

const MAX_GUESSES = 6;
const WORD_LEN = 5;

function getDailyWord() {
  const epoch = Math.floor(Date.now() / 86_400_000);
  return WORD_LIST[epoch % WORD_LIST.length];
}

function scoreGuess(guess: string, target: string): ("correct" | "present" | "absent")[] {
  const result: ("correct" | "present" | "absent")[] = Array(WORD_LEN).fill("absent");
  const targetLeft = target.split("");
  // First pass: correct
  for (let i = 0; i < WORD_LEN; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetLeft[i] = "";
    }
  }
  // Second pass: present
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === "correct") continue;
    const pos = targetLeft.indexOf(guess[i]);
    if (pos >= 0) {
      result[i] = "present";
      targetLeft[pos] = "";
    }
  }
  return result;
}

type LetterState = "correct" | "present" | "absent" | "unused";

const KEYBOARD_ROWS = [
  ["a","z","e","r","t","y","u","i","o","p"],
  ["q","s","d","f","g","h","j","k","l","m"],
  ["↵","w","x","c","v","b","n","←"],
];

const TILE_COLORS: Record<string, string> = {
  correct: "bg-green-500 border-green-500 text-white",
  present: "bg-yellow-400 border-yellow-400 text-white",
  absent:  "bg-slate-500 border-slate-500 text-white dark:bg-slate-600 dark:border-slate-600",
  pending: "bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white",
  empty:   "bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700",
};

const KEY_COLORS: Record<LetterState, string> = {
  correct: "bg-green-500 text-white border-green-500",
  present: "bg-yellow-400 text-white border-yellow-400",
  absent:  "bg-slate-400 dark:bg-slate-600 text-white border-slate-400",
  unused:  "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white border-gray-200 dark:border-slate-600",
};

const GEMS_BY_ATTEMPT = [15, 10, 7, 5, 3, 2];
const HISTORY_KEY = "pythonkids_wordle_history";

type HistoryEntry = { date: string; won: boolean; attempts: number; word: string };

function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToHistory(date: string, won: boolean, attempts: number, word: string) {
  try {
    const h = getHistory().filter((e) => e.date !== date);
    h.push({ date, won, attempts, word });
    // keep last 30 days
    h.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-30)));
  } catch {}
}

export default function WordlePython() {
  const t = useTranslations("WordlePython");
  const locale = useLocale();
  const { word: target, hint: hintFr, hint_en: hintEn } = getDailyWord();
  const hint = locale === "en" ? (hintEn ?? hintFr) : hintFr;
  const storageKey = `pythonkids_wordle_${target}`;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [scores, setScores]   = useState<("correct" | "present" | "absent")[][]>([]);
  const [current, setCurrent] = useState("");
  const [won, setWon]         = useState(false);
  const [lost, setLost]       = useState(false);
  const [shake, setShake]     = useState(false);
  const [reveal, setReveal]   = useState<number | null>(null);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [loaded, setLoaded]   = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const todayDate = new Date().toISOString().split("T")[0];

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { guesses: g, scores: s, won: w, lost: l, gems } = JSON.parse(saved);
        setGuesses(g); setScores(s); setWon(w); setLost(l);
        if (gems) setGemsEarned(gems);
      }
    } catch { /* ignore */ }
    setHistory(getHistory());
    setLoaded(true);
  }, [storageKey]);

  const save = useCallback((g: string[], s: ("correct"|"present"|"absent")[][], w: boolean, l: boolean, gems: number) => {
    try { localStorage.setItem(storageKey, JSON.stringify({ guesses: g, scores: s, won: w, lost: l, gems })); } catch { /* ignore */ }
  }, [storageKey]);

  // Build key states from scores
  const keyStates: Record<string, LetterState> = {};
  guesses.forEach((g, gi) => {
    g.split("").forEach((ch, ci) => {
      const prev = keyStates[ch] ?? "unused";
      const next = scores[gi]?.[ci];
      if (!next) return;
      if (prev === "correct") return;
      if (next === "correct") { keyStates[ch] = "correct"; return; }
      if (prev === "present") return;
      if (next === "present") { keyStates[ch] = "present"; return; }
      keyStates[ch] = "absent";
    });
  });

  const submitGuess = useCallback(() => {
    if (current.length !== WORD_LEN || won || lost) return;
    if (reveal !== null) return;

    const s = scoreGuess(current, target);
    const newGuesses = [...guesses, current];
    const newScores  = [...scores, s];
    const isWon  = current === target;
    const isLost = !isWon && newGuesses.length >= MAX_GUESSES;

    let gems = 0;
    if (isWon) {
      gems = GEMS_BY_ATTEMPT[guesses.length] ?? 2;
      addGems(gems);
      setGemsEarned(gems);
    }

    setReveal(newGuesses.length - 1);
    setTimeout(() => {
      setGuesses(newGuesses);
      setScores(newScores);
      setCurrent("");
      setWon(isWon);
      setLost(isLost);
      setReveal(null);
      save(newGuesses, newScores, isWon, isLost, gems);
      if (isWon || isLost) {
        saveToHistory(todayDate, isWon, newGuesses.length, target);
        setHistory(getHistory());
      }
    }, WORD_LEN * 300 + 200);

    // Optimistic state for animation
    setGuesses(newGuesses);
    setScores(newScores);
    setCurrent("");
  }, [current, guesses, scores, target, won, lost, reveal, save]);

  const pressKey = useCallback((key: string) => {
    if (won || lost || reveal !== null) return;
    if (key === "↵") { submitGuess(); return; }
    if (key === "←") { setCurrent(p => p.slice(0, -1)); return; }
    if (/^[a-z]$/.test(key) && current.length < WORD_LEN) {
      setCurrent(p => p + key);
    }
  }, [won, lost, reveal, current, submitGuess]);

  // Physical keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") pressKey("↵");
      else if (e.key === "Backspace") pressKey("←");
      else if (/^[a-zA-Z]$/.test(e.key)) pressKey(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pressKey]);

  if (!loaded) return null;

  // ── Render grid ───────────────────────────────────────────────────────
  const rows: React.ReactElement[] = [];
  for (let r = 0; r < MAX_GUESSES; r++) {
    const isCurrentRow = r === guesses.length && !won && !lost;
    const isRevealRow  = r === reveal;
    const guess = guesses[r] ?? (isCurrentRow ? current : "");
    const row: React.ReactElement[] = [];
    for (let c = 0; c < WORD_LEN; c++) {
      const ch = guess[c] ?? "";
      let colorClass = TILE_COLORS.empty;
      let style: React.CSSProperties = {};
      if (isRevealRow && ch) {
        const state = scores[r]?.[c];
        if (state) {
          colorClass = TILE_COLORS[state];
          style = { animationDelay: `${c * 300}ms`, animation: "flip 0.6s ease forwards" };
        }
      } else if (!isCurrentRow && !isRevealRow && ch) {
        const state = scores[r]?.[c];
        colorClass = state ? TILE_COLORS[state] : TILE_COLORS.pending;
      } else if (ch) {
        colorClass = TILE_COLORS.pending;
        style = { animation: "pop 0.1s ease" };
      }
      row.push(
        <div
          key={c}
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl font-extrabold rounded-lg uppercase select-none transition-colors ${colorClass}`}
          style={style}
        >
          {ch}
        </div>
      );
    }
    rows.push(
      <div key={r} className={`flex gap-1.5 ${shake && isCurrentRow ? "animate-[shake_0.4s_ease]" : ""}`}>
        {row}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Grid */}
      <div className="flex flex-col gap-1.5">
        {rows}
      </div>

      {/* Result banner */}
      {(won || lost) && (
        <div className={`w-full max-w-xs rounded-2xl px-5 py-4 text-center ${won ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"}`}>
          {won ? (
            <>
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-extrabold text-green-700 dark:text-green-400">
                {t("won_in", { count: guesses.length })}
              </p>
              {gemsEarned > 0 && (
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">+{gemsEarned} 💎</p>
              )}
            </>
          ) : (
            <>
              <p className="text-2xl mb-1">😅</p>
              <p className="font-extrabold text-red-700 dark:text-red-400">
                {t("the_word_was")} <span className="uppercase">{target}</span>
              </p>
            </>
          )}
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            💡 {hint}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            {t("new_word_tomorrow")}
          </p>
        </div>
      )}

      {/* History — last 7 days */}
      {history.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="text-xs text-gray-400 dark:text-slate-500 text-center mb-2">{t("history_label")}</p>
          <div className="flex justify-center gap-1.5 flex-wrap">
            {(() => {
              const days: string[] = [];
              for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                days.push(d.toISOString().split("T")[0]);
              }
              return days.map((day) => {
                const entry = history.find((h) => h.date === day);
                let emoji = "⬜";
                let title = t("history_not_played");
                if (entry) {
                  emoji = entry.won ? "🟩" : "🟥";
                  title = entry.won
                    ? t("history_won", { word: entry.word.toUpperCase(), attempts: entry.attempts })
                    : t("history_lost", { word: entry.word.toUpperCase() });
                }
                return (
                  <span key={day} title={`${day} · ${title}`} className="text-lg cursor-default select-none">{emoji}</span>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((key) => {
              const state: LetterState = key === "↵" || key === "←" ? "unused" : (keyStates[key] ?? "unused");
              const isWide = key === "↵" || key === "←";
              return (
                <button
                  key={key}
                  onClick={() => pressKey(key)}
                  className={`${isWide ? "px-3 text-xs" : "w-8 sm:w-9"} h-12 rounded-lg font-bold uppercase text-sm border transition-colors active:scale-90 ${KEY_COLORS[state]}`}
                >
                  {key === "←" ? "⌫" : key === "↵" ? "OK" : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes flip {
          0%   { transform: rotateX(0deg); }
          49%  { transform: rotateX(90deg); }
          50%  { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
