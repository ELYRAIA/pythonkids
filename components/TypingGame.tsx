"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { addGems } from "@/lib/gems";

type Difficulty = "facile" | "moyen" | "difficile";

const SNIPPETS: Record<Difficulty, Array<{ title: string; code: string }>> = {
  facile: [
    { title: "Afficher du texte",  code: 'print("Bonjour Python !")' },
    { title: "Variable et calcul", code: 'age = 12\nprint(f"J\'ai {age} ans")' },
    { title: "Boucle for",         code: 'for i in range(5):\n    print(i)' },
    { title: "Condition simple",   code: 'x = 7\nif x > 5:\n    print("Grand !")' },
    { title: "Liste courte",       code: 'fruits = ["pomme", "kiwi"]\nprint(fruits)' },
  ],
  moyen: [
    { title: "Fonction salutation", code: 'def saluer(nom):\n    return f"Bonjour {nom} !"\n\nprint(saluer("Alice"))' },
    { title: "Boucle et liste",     code: 'fruits = ["pomme", "kiwi", "cerise"]\nfor f in fruits:\n    print(f)' },
    { title: "Condition if/else",   code: 'note = 15\nif note >= 10:\n    print("Reçu !")\nelse:\n    print("Recalé")' },
    { title: "Fonction avec return",code: 'def carre(n):\n    return n * n\n\nfor i in range(1, 6):\n    print(carre(i))' },
  ],
  difficile: [
    { title: "Fibonacci",           code: 'def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a)\n        a, b = b, a + b\nfibonacci(7)' },
    { title: "Compréhension liste", code: 'nombres = [1, 2, 3, 4, 5, 6]\npairs = [x * 2 for x in nombres\n         if x % 2 == 0]\nprint(pairs)' },
    { title: "Classe simple",       code: 'class Chat:\n    def __init__(self, nom):\n        self.nom = nom\n    def parler(self):\n        return f"{self.nom} dit Miaou"\n\nc = Chat("Felix")\nprint(c.parler())' },
    { title: "Dict et boucle",      code: 'scores = {"Alice": 95, "Bob": 72, "Charlie": 88}\nfor nom, s in scores.items():\n    print(f"{nom} : {s}/100")' },
  ],
};

const DIFF_CONFIG: Record<Difficulty, { label: string; color: string; emoji: string; baseGems: number }> = {
  facile:    { label: "Facile",    color: "from-green-400 to-emerald-500", emoji: "🌱", baseGems: 3 },
  moyen:     { label: "Moyen",     color: "from-yellow-400 to-orange-400", emoji: "🚀", baseGems: 5 },
  difficile: { label: "Difficile", color: "from-pink-500 to-rose-600",     emoji: "🏆", baseGems: 8 },
};

const BEST_KEY = "pythonkids_typing_best";

function getBest(): Record<Difficulty, number | null> {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? JSON.parse(raw) : { facile: null, moyen: null, difficile: null };
  } catch { return { facile: null, moyen: null, difficile: null }; }
}

function saveBest(diff: Difficulty, wpm: number) {
  try {
    const b = getBest();
    if (b[diff] === null || wpm > b[diff]!) {
      b[diff] = wpm;
      localStorage.setItem(BEST_KEY, JSON.stringify(b));
    }
  } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TypingGame() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [snippet, setSnippet]       = useState<{ title: string; code: string } | null>(null);
  const [typed, setTyped]           = useState("");
  const [startTime, setStartTime]   = useState<number | null>(null);
  const [liveWpm, setLiveWpm]       = useState(0);
  const [finalWpm, setFinalWpm]     = useState(0);
  const [done, setDone]             = useState(false);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [countdown, setCountdown]   = useState<number | null>(null);
  const [best, setBest]             = useState<Record<Difficulty, number | null>>({ facile: null, moyen: null, difficile: null });
  const [newRecord, setNewRecord]   = useState(false);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setBest(getBest()); }, []);

  const startGame = useCallback((diff: Difficulty) => {
    const s = shuffle(SNIPPETS[diff])[0];
    setDifficulty(diff);
    setSnippet(s);
    setTyped("");
    setStartTime(null);
    setLiveWpm(0);
    setFinalWpm(0);
    setDone(false);
    setGemsEarned(0);
    setNewRecord(false);
    setCountdown(3);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Countdown 3 → 2 → 1 → 0 → start
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      setStartTime(Date.now());
      setTimeout(() => textareaRef.current?.focus(), 50);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Live WPM ticker
  useEffect(() => {
    if (!startTime || done) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const mins = (Date.now() - startTime) / 60000;
      if (mins > 0 && typed.length > 0) setLiveWpm(Math.round((typed.length / 5) / mins));
    }, 300);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startTime, done, typed.length]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!snippet || done || !startTime) return;
    const val = e.target.value;
    const target = snippet.code;
    if (val.length > target.length) return;
    setTyped(val);

    if (val === target) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const mins = (Date.now() - startTime) / 60000;
      const wpm = Math.round((target.length / 5) / Math.max(mins, 0.01));
      setFinalWpm(wpm);
      setDone(true);

      let errCount = 0;
      for (let i = 0; i < val.length; i++) if (val[i] !== target[i]) errCount++;
      const accuracy = Math.round(((target.length - errCount) / target.length) * 100);

      const cfg = DIFF_CONFIG[difficulty!];
      const wpmBonus = Math.floor(wpm / 20);
      const accBonus = accuracy === 100 ? 3 : accuracy >= 95 ? 1 : 0;
      const gems = cfg.baseGems + wpmBonus + accBonus;
      setGemsEarned(gems);
      addGems(gems);

      // Check record
      const prev = getBest()[difficulty!];
      if (prev === null || wpm > prev) {
        setNewRecord(true);
        saveBest(difficulty!, wpm);
        setBest(getBest());
      }
    }
  }, [snippet, done, startTime, difficulty]);

  // ── Difficulty picker ──────────────────────────────────────────────────────
  if (!difficulty && countdown === null) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
          Tape le code Python affiché aussi vite et précisément que possible !
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(DIFF_CONFIG) as [Difficulty, (typeof DIFF_CONFIG)[Difficulty]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => startGame(key)}
              className={`bg-gradient-to-r ${cfg.color} text-white rounded-2xl p-4 text-center hover:opacity-90 transition-opacity shadow-sm`}
            >
              <div className="text-2xl mb-1">{cfg.emoji}</div>
              <div className="font-bold text-sm">{cfg.label}</div>
              <div className="text-xs opacity-90 mt-1">+{cfg.baseGems}💎</div>
              {best[key] !== null && (
                <div className="text-xs opacity-80 mt-0.5">Record : {best[key]} mpm</div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-center text-gray-400 dark:text-slate-500">
          mpm = mots par minute (1 mot = 5 caractères)
        </p>
      </div>
    );
  }

  // ── Countdown ─────────────────────────────────────────────────────────────
  if (countdown !== null) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 select-none">
        <div
          key={countdown}
          className="text-8xl font-extrabold text-indigo-500 animate-bounce"
          style={{ animationDuration: "0.5s" }}
        >
          {countdown === 0 ? "🚀" : countdown}
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500">Prépare tes doigts…</p>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (done && snippet) {
    const target = snippet.code;
    let errCount = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] !== target[i]) errCount++;
    const accuracy = Math.round(((target.length - errCount) / target.length) * 100);
    const cfg = DIFF_CONFIG[difficulty!];

    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-5xl">{accuracy === 100 ? "🏆" : accuracy >= 90 ? "⭐" : "👍"}</div>
        <div>
          <span className="text-4xl font-extrabold text-gray-800 dark:text-white">{finalWpm}</span>
          <span className="text-base text-gray-400 dark:text-slate-500 ml-2">mots/min</span>
        </div>
        {newRecord && (
          <p className="text-sm font-bold text-green-600 dark:text-green-400">🏅 Nouveau record !</p>
        )}
        <div className="flex justify-center gap-8 text-sm">
          <div>
            <div className="font-bold text-gray-800 dark:text-white">{accuracy}%</div>
            <div className="text-xs text-gray-400 dark:text-slate-500">Précision</div>
          </div>
          <div>
            <div className="font-bold text-gray-800 dark:text-white">{errCount}</div>
            <div className="text-xs text-gray-400 dark:text-slate-500">Erreurs</div>
          </div>
          <div>
            <div className="font-bold text-yellow-500">+{gemsEarned} 💎</div>
            <div className="text-xs text-gray-400 dark:text-slate-500">Gagnées</div>
          </div>
        </div>
        <div className="flex gap-3 justify-center flex-wrap mt-2">
          <button
            onClick={() => startGame(difficulty!)}
            className={`bg-gradient-to-r ${cfg.color} text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity text-sm`}
          >
            Rejouer
          </button>
          <button
            onClick={() => { setDifficulty(null); setSnippet(null); }}
            className="bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Changer de niveau
          </button>
        </div>
      </div>
    );
  }

  // ── Game ──────────────────────────────────────────────────────────────────
  if (!snippet) return null;
  const target = snippet.code;
  const progress = target.length > 0 ? (typed.length / target.length) * 100 : 0;
  const cfg = DIFF_CONFIG[difficulty!];

  // Build per-char display
  const charElements: React.ReactNode[] = [];
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    let cls: string;
    if (i < typed.length) {
      cls = typed[i] === ch
        ? "text-green-400"
        : "bg-red-500/30 text-red-300 rounded-sm";
    } else if (i === typed.length) {
      cls = "border-l-2 border-indigo-400 text-slate-300";
    } else {
      cls = "text-slate-500";
    }
    if (ch === "\n") {
      charElements.push(
        <span key={i} className={cls}>
          {i === typed.length ? <span className="opacity-50 text-xs">↵</span> : ""}
          <br />
        </span>
      );
    } else {
      charElements.push(<span key={i} className={cls}>{ch}</span>);
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${cfg.color} text-white`}>
            {cfg.label}
          </span>
          <span className="text-sm text-gray-500 dark:text-slate-400">{snippet.title}</span>
        </div>
        <span className="text-sm font-bold text-indigo-400">
          {liveWpm > 0 ? `${liveWpm} mpm` : "…"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-200`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Code display — click to focus textarea */}
      <div
        className="relative bg-slate-900 rounded-xl p-4 cursor-text min-h-[80px]"
        onClick={() => textareaRef.current?.focus()}
      >
        <pre className="font-mono text-sm leading-6 whitespace-pre-wrap select-none pointer-events-none">
          {charElements}
        </pre>
        <textarea
          ref={textareaRef}
          value={typed}
          onChange={handleInput}
          className="absolute inset-0 w-full h-full opacity-0 resize-none font-mono text-sm cursor-text focus:outline-none"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          autoComplete="off"
          tabIndex={0}
        />
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-slate-500">
        Touche le code pour activer le clavier · Backspace pour corriger
      </p>
    </div>
  );
}
