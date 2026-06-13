"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { addGems } from "@/lib/gems";

interface Card {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  question_en?: string;
  options_en?: string[];
  answer_en?: string;
  explanation_en?: string;
}

const CARDS: Card[] = [
  { question: "Quel mot-clé définit une fonction en Python ?", options: ["func", "def", "function", "define"], answer: "def", explanation: "def nomFonction(): est la syntaxe pour déclarer une fonction.",
    question_en: "Which keyword defines a function in Python?", options_en: ["func", "def", "function", "define"], answer_en: "def", explanation_en: "def functionName(): is the syntax to declare a function." },
  { question: "Que retourne len([1, 2, 3]) ?", options: ["2", "3", "4", "1"], answer: "3", explanation: "len() compte le nombre d'éléments : [1, 2, 3] en a 3.",
    question_en: "What does len([1, 2, 3]) return?", options_en: ["2", "3", "4", "1"], answer_en: "3", explanation_en: "len() counts the number of elements: [1, 2, 3] has 3." },
  { question: "Quel signe sert à commenter en Python ?", options: ["//", "/*", "#", "--"], answer: "#", explanation: "# texte permet d'écrire un commentaire sur une ligne.",
    question_en: "Which symbol is used for comments in Python?", options_en: ["//", "/*", "#", "--"], answer_en: "#", explanation_en: "# text writes a single-line comment." },
  { question: "Comment accéder au dernier élément d'une liste ?", options: ["liste[0]", "liste[-1]", "liste[last]", "liste.end()"], answer: "liste[-1]", explanation: "Les indices négatifs commencent par la fin : -1 = dernier élément.",
    question_en: "How do you access the last element of a list?", options_en: ["list[0]", "list[-1]", "list[last]", "list.end()"], answer_en: "list[-1]", explanation_en: "Negative indices start from the end: -1 = last element." },
  { question: "Quelle est la sortie de print(2 ** 3) ?", options: ["6", "5", "8", "9"], answer: "8", explanation: "** est l'opérateur puissance : 2³ = 8.",
    question_en: "What is the output of print(2 ** 3)?", options_en: ["6", "5", "8", "9"], answer_en: "8", explanation_en: "** is the power operator: 2³ = 8." },
  { question: "Quel type est True en Python ?", options: ["int", "str", "bool", "float"], answer: "bool", explanation: "True et False sont des booléens (bool).",
    question_en: "What type is True in Python?", options_en: ["int", "str", "bool", "float"], answer_en: "bool", explanation_en: "True and False are booleans (bool)." },
  { question: "Comment convertir '42' en entier ?", options: ["integer('42')", "int('42')", "num('42')", "to_int('42')"], answer: "int('42')", explanation: "int() convertit une chaîne en entier.",
    question_en: "How do you convert '42' to an integer?", options_en: ["integer('42')", "int('42')", "num('42')", "to_int('42')"], answer_en: "int('42')", explanation_en: "int() converts a string to an integer." },
  { question: "Que fait range(5) ?", options: ["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "[5]"], answer: "[0,1,2,3,4]", explanation: "range(5) génère 0, 1, 2, 3, 4 — 5 est exclu.",
    question_en: "What does range(5) produce?", options_en: ["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "[5]"], answer_en: "[0,1,2,3,4]", explanation_en: "range(5) generates 0, 1, 2, 3, 4 — 5 is excluded." },
  { question: "Quel mot-clé arrête une boucle ?", options: ["stop", "exit", "break", "end"], answer: "break", explanation: "break sort immédiatement de la boucle en cours.",
    question_en: "Which keyword stops a loop immediately?", options_en: ["stop", "exit", "break", "end"], answer_en: "break", explanation_en: "break exits the current loop immediately." },
  { question: "Que vaut type([]) ?", options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"], answer: "<class 'list'>", explanation: "[] crée une liste vide, de type list.",
    question_en: "What is the value of type([])?", options_en: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"], answer_en: "<class 'list'>", explanation_en: "[] creates an empty list, of type list." },
  { question: "Comment créer un dictionnaire vide ?", options: ["[]", "()", "{}", "dict[]"], answer: "{}", explanation: "{} crée un dictionnaire vide.",
    question_en: "How do you create an empty dictionary?", options_en: ["[]", "()", "{}", "dict[]"], answer_en: "{}", explanation_en: "{} creates an empty dictionary." },
  { question: "Que retourne 'python'.upper() ?", options: ["Python", "PYTHON", "python", "PYTHON!"], answer: "PYTHON", explanation: ".upper() met toute la chaîne en majuscules.",
    question_en: "What does 'python'.upper() return?", options_en: ["Python", "PYTHON", "python", "PYTHON!"], answer_en: "PYTHON", explanation_en: ".upper() converts the entire string to uppercase." },
  { question: "Quel opérateur vérifie l'égalité ?", options: ["=", "===", "==", "!="], answer: "==", explanation: "== compare deux valeurs. = est l'affectation.",
    question_en: "Which operator checks for equality?", options_en: ["=", "===", "==", "!="], answer_en: "==", explanation_en: "== compares two values. = is assignment." },
  { question: "Que fait append() ?", options: ["Supprime un élément", "Ajoute à la fin", "Insère au début", "Trie la liste"], answer: "Ajoute à la fin", explanation: "liste.append(x) ajoute x à la fin de la liste.",
    question_en: "What does append() do?", options_en: ["Removes an element", "Adds to the end", "Inserts at the start", "Sorts the list"], answer_en: "Adds to the end", explanation_en: "list.append(x) adds x to the end of the list." },
  { question: "Que vaut 10 % 3 ?", options: ["3", "1", "0", "2"], answer: "1", explanation: "% est le modulo : 10 = 3×3 + 1, donc 10%3 = 1.",
    question_en: "What is 10 % 3?", options_en: ["3", "1", "0", "2"], answer_en: "1", explanation_en: "% is the modulo operator: 10 = 3×3 + 1, so 10%3 = 1." },
  { question: "Quel mot-clé retourne une valeur depuis une fonction ?", options: ["give", "send", "return", "output"], answer: "return", explanation: "return valeur termine la fonction et renvoie la valeur.",
    question_en: "Which keyword returns a value from a function?", options_en: ["give", "send", "return", "output"], answer_en: "return", explanation_en: "return value ends the function and returns the value." },
  { question: "Comment ouvrir un fichier en lecture ?", options: ["open('f', 'w')", "open('f', 'r')", "open('f', 'a')", "open('f', 'x')"], answer: "open('f', 'r')", explanation: "'r' = read (lecture), 'w' = write, 'a' = append.",
    question_en: "How do you open a file for reading?", options_en: ["open('f', 'w')", "open('f', 'r')", "open('f', 'a')", "open('f', 'x')"], answer_en: "open('f', 'r')", explanation_en: "'r' = read, 'w' = write, 'a' = append." },
  { question: "Que fait isinstance(42, int) ?", options: ["False", "True", "42", "int"], answer: "True", explanation: "isinstance vérifie si 42 est bien un entier — c'est le cas.",
    question_en: "What does isinstance(42, int) return?", options_en: ["False", "True", "42", "int"], answer_en: "True", explanation_en: "isinstance checks whether 42 is an integer — it is." },
  { question: "Quelle méthode joint les éléments d'une liste en chaîne ?", options: ["concat()", "join()", "merge()", "glue()"], answer: "join()", explanation: "', '.join(['a','b']) donne 'a, b'.",
    question_en: "Which method joins list elements into a string?", options_en: ["concat()", "join()", "merge()", "glue()"], answer_en: "join()", explanation_en: "', '.join(['a','b']) gives 'a, b'." },
  { question: "Que vaut not True ?", options: ["True", "None", "False", "0"], answer: "False", explanation: "not inverse un booléen : not True = False.",
    question_en: "What is the value of not True?", options_en: ["True", "None", "False", "0"], answer_en: "False", explanation_en: "not inverts a boolean: not True = False." },
  { question: "Comment créer un tuple à un seul élément ?", options: ["(42)", "(42,)", "[42]", "{42}"], answer: "(42,)", explanation: "La virgule finale est obligatoire : (42) est juste 42 entre parenthèses.",
    question_en: "How do you create a single-element tuple?", options_en: ["(42)", "(42,)", "[42]", "{42}"], answer_en: "(42,)", explanation_en: "The trailing comma is required: (42) is just 42 in parentheses." },
  { question: "Que fait sorted([3,1,2]) ?", options: ["[3,1,2]", "[1,2,3]", "[3,2,1]", "None"], answer: "[1,2,3]", explanation: "sorted() retourne une nouvelle liste triée en ordre croissant.",
    question_en: "What does sorted([3,1,2]) return?", options_en: ["[3,1,2]", "[1,2,3]", "[3,2,1]", "None"], answer_en: "[1,2,3]", explanation_en: "sorted() returns a new list sorted in ascending order." },
  { question: "Quel type est {'a': 1} ?", options: ["list", "tuple", "set", "dict"], answer: "dict", explanation: "{'clé': valeur} est un dictionnaire.",
    question_en: "What type is {'a': 1}?", options_en: ["list", "tuple", "set", "dict"], answer_en: "dict", explanation_en: "{'key': value} is a dictionary." },
  { question: "Que vaut len('Bonjour') ?", options: ["6", "7", "8", "5"], answer: "7", explanation: "B-o-n-j-o-u-r = 7 caractères.",
    question_en: "What is len('Hello') equal to?", options_en: ["4", "5", "6", "3"], answer_en: "5", explanation_en: "H-e-l-l-o = 5 characters." },
  { question: "Comment répéter 'abc' 3 fois ?", options: ["'abc' + 3", "'abc' * 3", "repeat('abc', 3)", "'abc'.times(3)"], answer: "'abc' * 3", explanation: "En Python, chaîne * n répète la chaîne n fois.",
    question_en: "How do you repeat 'abc' 3 times?", options_en: ["'abc' + 3", "'abc' * 3", "repeat('abc', 3)", "'abc'.times(3)"], answer_en: "'abc' * 3", explanation_en: "In Python, string * n repeats the string n times." },
];

type Difficulty = "debutant" | "standard" | "expert";

const DIFF_CONFIG: Record<Difficulty, { labelFr: string; labelEn: string; cards: number; timer: number; gemsPerCorrect: number; bonus: number; color: string; emoji: string }> = {
  debutant: { labelFr: "Débutant", labelEn: "Beginner", cards: 5,  timer: 20, gemsPerCorrect: 1, bonus: 2,  color: "from-green-400 to-emerald-500", emoji: "🌱" },
  standard: { labelFr: "Standard", labelEn: "Standard", cards: 10, timer: 15, gemsPerCorrect: 2, bonus: 5,  color: "from-indigo-500 to-purple-600",  emoji: "⭐" },
  expert:   { labelFr: "Expert",   labelEn: "Expert",   cards: 15, timer: 10, gemsPerCorrect: 3, bonus: 10, color: "from-pink-500 to-rose-600",       emoji: "🏆" },
};

interface QuestionResult {
  card: Card;
  chosen: string | null;
  correct: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardGame() {
  const locale = useLocale();
  const t = useTranslations("FlashcardGame");

  const [difficulty, setDifficulty]   = useState<Difficulty | null>(null);
  const [cards, setCards]             = useState<Card[]>([]);
  const [index, setIndex]             = useState(0);
  const [selected, setSelected]       = useState<string | null>(null);
  const [timeLeft, setTimeLeft]       = useState(0);
  const [results, setResults]         = useState<QuestionResult[]>([]);
  const [done, setDone]               = useState(false);
  const [gemsEarned, setGemsEarned]   = useState(0);
  const [showRecap, setShowRecap]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((diff: Difficulty) => {
    const cfg = DIFF_CONFIG[diff];
    setDifficulty(diff);
    setCards(shuffle(CARDS).slice(0, cfg.cards));
    setIndex(0);
    setSelected(null);
    setTimeLeft(cfg.timer);
    setResults([]);
    setDone(false);
    setGemsEarned(0);
    setShowRecap(false);
  }, []);

  const finishGame = useCallback((finalResults: QuestionResult[], diff: Difficulty) => {
    const cfg = DIFF_CONFIG[diff];
    const correct = finalResults.filter((r) => r.correct).length;
    const allCorrect = correct === finalResults.length;
    const gems = correct * cfg.gemsPerCorrect + (allCorrect ? cfg.bonus : 0);
    if (gems > 0) addGems(gems);
    setGemsEarned(gems);
    setDone(true);
  }, []);

  const goNext = useCallback(() => {
    if (!difficulty) return;
    const cfg = DIFF_CONFIG[difficulty];
    const card = cards[index];
    const effectiveAnswer = locale === "en" ? (card?.answer_en ?? card?.answer) : card?.answer;
    const correct = selected === effectiveAnswer;
    const newResult: QuestionResult = { card, chosen: selected, correct };
    const newResults = [...results, newResult];
    setResults(newResults);

    if (index + 1 >= cards.length) {
      finishGame(newResults, difficulty);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(cfg.timer);
    }
  }, [difficulty, cards, index, selected, results, finishGame, locale]);

  const handleAnswer = useCallback((opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [selected]);

  // Timer
  useEffect(() => {
    if (!difficulty || done || selected !== null) return;
    if (timeLeft <= 0) {
      setSelected("__timeout__");
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [difficulty, done, selected, timeLeft]);

  // ── Difficulty picker ──────────────────────────────────────────────────────
  if (!difficulty) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
          {t("pick_level_hint")}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(DIFF_CONFIG) as [Difficulty, (typeof DIFF_CONFIG)[Difficulty]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => startGame(key)}
              className={`bg-gradient-to-r ${cfg.color} text-white rounded-2xl p-4 text-center hover:opacity-90 transition-opacity shadow-sm`}
            >
              <div className="text-2xl mb-1">{cfg.emoji}</div>
              <div className="font-bold text-sm">{locale === "en" ? cfg.labelEn : cfg.labelFr}</div>
              <div className="text-xs opacity-90 mt-1">{cfg.cards} {t("questions_count")} · {cfg.timer}s</div>
              <div className="text-xs opacity-80">+{cfg.gemsPerCorrect}💎/{t("per_correct")}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const cfg = DIFF_CONFIG[difficulty];

  // ── Recap (wrong answers) ─────────────────────────────────────────────────
  if (done && showRecap) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-gray-800 dark:text-white text-sm">{t("recap_title")}</h3>
          <button
            onClick={() => setShowRecap(false)}
            className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
          >
            {t("back")}
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {results.map((r, i) => {
            const displayQ = locale === "en" ? (r.card.question_en ?? r.card.question) : r.card.question;
            const displayAnswer = locale === "en" ? (r.card.answer_en ?? r.card.answer) : r.card.answer;
            const displayExplanation = locale === "en" ? (r.card.explanation_en ?? r.card.explanation) : r.card.explanation;
            return (
              <div
                key={i}
                className={`rounded-xl px-3 py-2.5 border text-xs ${
                  r.correct
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">{r.correct ? "✅" : "❌"}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white leading-snug">{displayQ}</p>
                    {!r.correct && (
                      <p className="mt-1 text-gray-500 dark:text-slate-400">
                        {t("correct_answer")} : <span className="font-bold text-green-600 dark:text-green-400">{displayAnswer}</span>
                        {r.chosen && r.chosen !== "__timeout__" && (
                          <span> · {t("your_answer")} : <span className="font-bold text-red-500">{r.chosen}</span></span>
                        )}
                        {r.chosen === "__timeout__" && (
                          <span> · <span className="text-orange-500">{t("timed_out")}</span></span>
                        )}
                      </p>
                    )}
                    <p className="mt-1 text-gray-400 dark:text-slate-500 italic">{displayExplanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => startGame(difficulty)}
          className={`w-full bg-gradient-to-r ${cfg.color} text-white py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity text-sm`}
        >
          {t("play_again")}
        </button>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (done) {
    const correct = results.filter((r) => r.correct).length;
    const total = results.length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="text-center py-4 space-y-4">
        <div className="text-5xl">{correct === total ? "🏆" : correct >= total / 2 ? "👍" : "😅"}</div>
        <h3 className="text-xl font-extrabold text-gray-800 dark:text-white">
          {correct}/{total} {t("correct_answers")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">{pct}% {t("success_rate")}</p>
        {gemsEarned > 0 && (
          <p className="text-base font-bold text-yellow-500">+{gemsEarned} 💎 {t("gems_earned")} !</p>
        )}
        {correct === total && (
          <p className="text-sm font-bold text-green-600 dark:text-green-400">
            ⭐ {t("perfect_score")} +{cfg.bonus}💎 {t("bonus")}
          </p>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => startGame(difficulty)}
            className={`bg-gradient-to-r ${cfg.color} text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity text-sm`}
          >
            {t("play_again")}
          </button>
          <button
            onClick={() => setShowRecap(true)}
            className="bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            {t("see_mistakes")}
          </button>
          <button
            onClick={() => setDifficulty(null)}
            className="bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            {t("change_level")}
          </button>
        </div>
      </div>
    );
  }

  // ── Game ──────────────────────────────────────────────────────────────────
  const card = cards[index];
  if (!card) return null;
  const timedOut = selected === "__timeout__";
  const displayAnswer = locale === "en" ? (card.answer_en ?? card.answer) : card.answer;
  const isCorrect = selected !== null && !timedOut && selected === displayAnswer;
  const timerPct = (timeLeft / cfg.timer) * 100;

  const displayQuestion = locale === "en" ? (card.question_en ?? card.question) : card.question;
  const displayOptions = locale === "en" ? (card.options_en ?? card.options) : card.options;
  const displayExplanation = locale === "en" ? (card.explanation_en ?? card.explanation) : card.explanation;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${cfg.color} rounded-full transition-all duration-700`}
            style={{ width: `${(index / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">{index + 1}/{cards.length}</span>
        {/* Timer bar */}
        <div className="w-10 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timerPct > 40 ? "bg-green-400" : timerPct > 20 ? "bg-yellow-400" : "bg-red-500"}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
        <span className={`text-sm font-bold w-6 text-right transition-colors ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-500 dark:text-slate-400"}`}>
          {selected !== null ? "" : timeLeft}
        </span>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 text-center">
        <p className="font-bold text-gray-800 dark:text-white text-base leading-snug">{displayQuestion}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {displayOptions.map((opt) => {
          let cls = "w-full py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all text-left ";
          if (selected === null) {
            cls += "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-white hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30";
          } else if (opt === displayAnswer) {
            cls += "bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300";
          } else if (opt === selected) {
            cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-300";
          } else {
            cls += "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 opacity-40";
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} className={cls} disabled={selected !== null}>
              {selected !== null && opt === displayAnswer && "✓ "}
              {selected !== null && opt === selected && opt !== displayAnswer && "✗ "}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback + Next */}
      {selected !== null && (
        <>
          <div className={`rounded-xl px-4 py-3 text-sm ${timedOut ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300" : isCorrect ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>
            <span className="font-bold">{timedOut ? `⏰ ${t("time_up")} ` : isCorrect ? `✅ ${t("bravo")} ` : "❌ "}</span>
            <span className="text-gray-600 dark:text-slate-300">{displayExplanation}</span>
          </div>
          <button
            onClick={goNext}
            className={`bg-gradient-to-r ${cfg.color} text-white px-8 py-2.5 rounded-full font-extrabold hover:opacity-90 transition-opacity self-center`}
          >
            {index + 1 >= cards.length ? t("see_score") : t("next")}
          </button>
        </>
      )}
    </div>
  );
}
