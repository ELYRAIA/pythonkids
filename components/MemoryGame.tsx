"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { addGems } from "@/lib/gems";

const PAIRS = [
  { keyword: "print()", definition: "Afficher du texte", definition_en: "Display text" },
  { keyword: "def", definition: "Définir une fonction", definition_en: "Define a function" },
  { keyword: "for", definition: "Boucle d'itération", definition_en: "Iteration loop" },
  { keyword: "if", definition: "Condition", definition_en: "Condition" },
  { keyword: "len()", definition: "Longueur d'une liste", definition_en: "Length of a list" },
  { keyword: "import", definition: "Charger un module", definition_en: "Load a module" },
  { keyword: "return", definition: "Renvoyer une valeur", definition_en: "Return a value" },
  { keyword: "while", definition: "Boucle conditionnelle", definition_en: "Conditional loop" },
  { keyword: "list()", definition: "Créer une liste", definition_en: "Create a list" },
  { keyword: "True/False", definition: "Valeur booléenne", definition_en: "Boolean value" },
  { keyword: "dict()", definition: "Créer un dictionnaire", definition_en: "Create a dictionary" },
  { keyword: "input()", definition: "Lire une saisie", definition_en: "Read user input" },
];

type Difficulty = "facile" | "moyen" | "difficile";

const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; labelFr: string; labelEn: string; gems: number; color: string }> = {
  facile:    { pairs: 4,  labelFr: "Facile",    labelEn: "Easy",   gems: 3,  color: "from-green-400 to-emerald-500" },
  moyen:     { pairs: 6,  labelFr: "Moyen",     labelEn: "Medium", gems: 5,  color: "from-yellow-400 to-orange-400" },
  difficile: { pairs: 12, labelFr: "Difficile", labelEn: "Hard",   gems: 10, color: "from-pink-500 to-rose-600" },
};

interface Card {
  id: number;
  text: string;
  pairId: number;
  type: "keyword" | "definition";
  matched: boolean;
  flipped: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(pairs: typeof PAIRS, locale: string): Card[] {
  const cards: Card[] = [];
  pairs.forEach((p, i) => {
    const def = locale === "en" ? (p.definition_en ?? p.definition) : p.definition;
    cards.push({ id: i * 2,     text: p.keyword, pairId: i, type: "keyword",    matched: false, flipped: false });
    cards.push({ id: i * 2 + 1, text: def,        pairId: i, type: "definition", matched: false, flipped: false });
  });
  return shuffle(cards);
}

export default function MemoryGame() {
  const locale = useLocale();
  const t = useTranslations("MemoryGame");

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards]           = useState<Card[]>([]);
  const [selected, setSelected]     = useState<number[]>([]);
  const [moves, setMoves]           = useState(0);
  const [matched, setMatched]       = useState(0);
  const [won, setWon]               = useState(false);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [shake, setShake]           = useState<number[]>([]);
  const [bestMoves, setBestMoves]   = useState<Record<Difficulty, number | null>>({ facile: null, moyen: null, difficile: null });
  const lockRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pythonkids_memory_best");
      if (saved) setBestMoves(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    const cfg = DIFFICULTY_CONFIG[diff];
    const selectedPairs = shuffle(PAIRS).slice(0, cfg.pairs);
    setDifficulty(diff);
    setCards(buildCards(selectedPairs, locale));
    setSelected([]);
    setMoves(0);
    setMatched(0);
    setWon(false);
    setGemsEarned(0);
    setShake([]);
    lockRef.current = false;
  }, [locale]);

  const handleFlip = useCallback((cardId: number) => {
    if (lockRef.current) return;
    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.matched || card.flipped) return prev;
      return prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
    });

    setSelected(prev => {
      if (prev.length === 1 && prev[0] === cardId) return prev;
      const next = [...prev, cardId];
      if (next.length === 2) {
        lockRef.current = true;
        setTimeout(() => {
          setCards(cur => {
            const [a, b] = [cur.find(c => c.id === next[0])!, cur.find(c => c.id === next[1])!];
            if (a.pairId === b.pairId && a.type !== b.type) {
              // Match!
              const updated = cur.map(c =>
                c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
              );
              setMatched(m => {
                const newMatched = m + 1;
                if (difficulty && newMatched === DIFFICULTY_CONFIG[difficulty].pairs) {
                  const cfg = DIFFICULTY_CONFIG[difficulty];
                  setWon(true);
                  // Gems: more gems for fewer moves
                  const totalPairs = cfg.pairs;
                  const bonus = Math.max(0, totalPairs - (moves + 1 - totalPairs));
                  const earned = cfg.gems + Math.floor(bonus / 2);
                  setGemsEarned(earned);
                  addGems(earned);
                  // Save best
                  setBestMoves(bm => {
                    const currentBest = bm[difficulty];
                    const newMoves = moves + 1;
                    if (currentBest === null || newMoves < currentBest) {
                      const updated = { ...bm, [difficulty]: newMoves };
                      localStorage.setItem("pythonkids_memory_best", JSON.stringify(updated));
                      return updated;
                    }
                    return bm;
                  });
                }
                return newMatched;
              });
              setMoves(m => m + 1);
              lockRef.current = false;
              return updated;
            } else {
              // No match — shake and flip back
              setShake([a.id, b.id]);
              setTimeout(() => {
                setCards(c => c.map(card =>
                  card.id === a.id || card.id === b.id ? { ...card, flipped: false } : card
                ));
                setShake([]);
                lockRef.current = false;
              }, 600);
              setMoves(m => m + 1);
              return cur;
            }
          });
          setSelected([]);
        }, 700);
        return next;
      }
      return next;
    });
  }, [difficulty, moves]);

  // ── Difficulty picker ─────────────────────────────────────────────
  if (!difficulty) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">🃏 Memory Python</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.facile][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => startGame(key)}
              className={`bg-gradient-to-r ${cfg.color} text-white rounded-2xl p-5 text-center hover:opacity-90 transition-opacity shadow-sm`}
            >
              <div className="text-2xl mb-1">
                {key === "facile" ? "🌱" : key === "moyen" ? "🚀" : "🏆"}
              </div>
              <div className="font-bold">{locale === "en" ? cfg.labelEn : cfg.labelFr}</div>
              <div className="text-xs opacity-90 mt-1">{cfg.pairs} {t("pairs")} · +{cfg.gems} 💎</div>
              {bestMoves[key] !== null && (
                <div className="text-xs opacity-80 mt-1">{t("record")} : {bestMoves[key]} {t("moves")}</div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500">{t("adapt_hint")}</p>
      </div>
    );
  }

  const cfg = DIFFICULTY_CONFIG[difficulty];
  const cols = cfg.pairs <= 4 ? "grid-cols-4" : cfg.pairs <= 6 ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-4 sm:grid-cols-6";

  // ── Win screen ────────────────────────────────────────────────────
  if (won) {
    return (
      <div className="text-center space-y-5 py-6">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">{t("bravo")}</h2>
        <p className="text-gray-600 dark:text-slate-400">
          {t("found_all_pairs", { moves })}
        </p>
        <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl px-6 py-3">
          <span className="text-2xl">💎</span>
          <span className="text-xl font-extrabold text-yellow-600 dark:text-yellow-400">+{gemsEarned}</span>
        </div>
        {bestMoves[difficulty] === moves && (
          <p className="text-sm text-green-600 dark:text-green-400 font-bold">🏆 {t("new_record")}</p>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => startGame(difficulty)}
            className={`bg-gradient-to-r ${cfg.color} text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity text-sm`}
          >
            {t("play_again")}
          </button>
          <button
            onClick={() => setDifficulty(null)}
            className="bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 px-6 py-2.5 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            {t("change_level")}
          </button>
        </div>
      </div>
    );
  }

  // ── Game board ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${cfg.color} text-white`}>
            {locale === "en" ? cfg.labelEn : cfg.labelFr}
          </span>
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {matched}/{cfg.pairs} {t("pairs")} · {moves} {t("moves")}
          </span>
        </div>
        <button
          onClick={() => setDifficulty(null)}
          className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
        >
          ✕ {t("quit")}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-500`}
          style={{ width: `${(matched / cfg.pairs) * 100}%` }}
        />
      </div>

      <div className={`grid ${cols} gap-2`}>
        {cards.map(card => {
          const isShaking = shake.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={card.matched || card.flipped}
              className={`
                aspect-square rounded-xl text-xs font-bold transition-all duration-300 select-none
                ${card.matched
                  ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700 scale-95 cursor-default"
                  : card.flipped
                    ? "bg-white dark:bg-slate-700 text-gray-800 dark:text-white border-2 border-purple-300 dark:border-purple-600 shadow-md"
                    : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-2 border-purple-400 hover:scale-105 hover:shadow-lg cursor-pointer"
                }
                ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}
              `}
            >
              {card.matched || card.flipped ? (
                <span className="px-1 leading-tight">{card.text}</span>
              ) : (
                <span className="text-2xl">🐍</span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
