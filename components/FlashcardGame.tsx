"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { addGems } from "@/lib/gems";

interface Card {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const CARDS: Card[] = [
  { question: "Quel mot-clé définit une fonction en Python ?", options: ["func", "def", "function", "define"], answer: "def", explanation: "def nomFonction(): est la syntaxe pour déclarer une fonction." },
  { question: "Que retourne len([1, 2, 3]) ?", options: ["2", "3", "4", "1"], answer: "3", explanation: "len() compte le nombre d'éléments : [1, 2, 3] en a 3." },
  { question: "Quel signe sert à commenter en Python ?", options: ["//", "/*", "#", "--"], answer: "#", explanation: "# texte permet d'écrire un commentaire sur une ligne." },
  { question: "Comment accéder au dernier élément d'une liste ?", options: ["liste[0]", "liste[-1]", "liste[last]", "liste.end()"], answer: "liste[-1]", explanation: "Les indices négatifs commencent par la fin : -1 = dernier élément." },
  { question: "Quelle est la sortie de print(2 ** 3) ?", options: ["6", "5", "8", "9"], answer: "8", explanation: "** est l'opérateur puissance : 2³ = 8." },
  { question: "Quel type est True en Python ?", options: ["int", "str", "bool", "float"], answer: "bool", explanation: "True et False sont des booléens (bool)." },
  { question: "Comment convertir '42' en entier ?", options: ["integer('42')", "int('42')", "num('42')", "to_int('42')"], answer: "int('42')", explanation: "int() convertit une chaîne en entier." },
  { question: "Que fait range(5) ?", options: ["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "[5]"], answer: "[0,1,2,3,4]", explanation: "range(5) génère 0, 1, 2, 3, 4 — 5 est exclu." },
  { question: "Quel mot-clé arrête une boucle ?", options: ["stop", "exit", "break", "end"], answer: "break", explanation: "break sort immédiatement de la boucle en cours." },
  { question: "Que vaut type([]) ?", options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"], answer: "<class 'list'>", explanation: "[] crée une liste vide, de type list." },
  { question: "Comment créer un dictionnaire vide ?", options: ["[]", "()", "{}", "dict[]"], answer: "{}", explanation: "{} crée un dictionnaire vide (et aussi un set si on y met des valeurs)." },
  { question: "Que retourne 'python'.upper() ?", options: ["Python", "PYTHON", "python", "PYTHON!"], answer: "PYTHON", explanation: ".upper() met toute la chaîne en majuscules." },
  { question: "Quel opérateur vérifie l'égalité ?", options: ["=", "===", "==", "!="], answer: "==", explanation: "== compare deux valeurs. = est l'affectation, != est différent de." },
  { question: "Que fait append() ?", options: ["Supprime un élément", "Ajoute à la fin", "Insère au début", "Trie la liste"], answer: "Ajoute à la fin", explanation: "liste.append(x) ajoute x à la fin de la liste." },
  { question: "Que vaut 10 % 3 ?", options: ["3", "1", "0", "2"], answer: "1", explanation: "% est le modulo : 10 = 3×3 + 1, donc 10%3 = 1." },
  { question: "Quel mot-clé retourne une valeur depuis une fonction ?", options: ["give", "send", "return", "output"], answer: "return", explanation: "return valeur termine la fonction et renvoie la valeur." },
  { question: "Comment ouvrir un fichier en lecture ?", options: ["open('f', 'w')", "open('f', 'r')", "open('f', 'a')", "open('f', 'x')"], answer: "open('f', 'r')", explanation: "'r' = read (lecture), 'w' = write, 'a' = append." },
  { question: "Que fait isinstance(42, int) ?", options: ["False", "True", "42", "int"], answer: "True", explanation: "isinstance vérifie si 42 est bien un entier (int) — c'est le cas." },
  { question: "Quelle méthode joint les éléments d'une liste en chaîne ?", options: ["concat()", "join()", "merge()", "glue()"], answer: "join()", explanation: "', '.join(['a','b']) donne 'a, b'." },
  { question: "Que vaut not True ?", options: ["True", "None", "False", "0"], answer: "False", explanation: "not inverse un booléen : not True = False." },
  { question: "Comment créer un tuple à un seul élément ?", options: ["(42)", "(42,)", "[42]", "{42}"], answer: "(42,)", explanation: "La virgule finale est obligatoire : (42) est juste 42 entre parenthèses." },
  { question: "Que fait sorted([3,1,2]) ?", options: ["[3,1,2]", "[1,2,3]", "[3,2,1]", "None"], answer: "[1,2,3]", explanation: "sorted() retourne une nouvelle liste triée en ordre croissant." },
  { question: "Quel type est {'a': 1} ?", options: ["list", "tuple", "set", "dict"], answer: "dict", explanation: "{'clé': valeur} est un dictionnaire." },
  { question: "Que vaut len('Bonjour') ?", options: ["6", "7", "8", "5"], answer: "7", explanation: "B-o-n-j-o-u-r = 7 caractères." },
  { question: "Comment répéter 'abc' 3 fois ?", options: ["'abc' + 3", "'abc' * 3", "repeat('abc', 3)", "'abc'.times(3)"], answer: "'abc' * 3", explanation: "En Python, chaîne * n répète la chaîne n fois : 'abcabcabc'." },
];

const TIMER_SECONDS = 15;
const GEMS_PER_CORRECT = 2;
const BONUS_GEMS_ALL_CORRECT = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback(() => {
    setCards(shuffle(CARDS).slice(0, 10));
    setIndex(0);
    setSelected(null);
    setTimeLeft(TIMER_SECONDS);
    setScore(0);
    setDone(false);
    setGemsEarned(0);
    setStarted(true);
  }, []);

  const handleAnswer = useCallback((opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [selected]);

  const next = useCallback(() => {
    const card = cards[index];
    const correct = selected === card?.answer;
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);

    if (index + 1 >= cards.length) {
      const gems = newScore * GEMS_PER_CORRECT + (newScore === cards.length ? BONUS_GEMS_ALL_CORRECT : 0);
      if (gems > 0) addGems(gems);
      setGemsEarned(gems);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(TIMER_SECONDS);
    }
  }, [cards, index, selected, score]);

  // Timer
  useEffect(() => {
    if (!started || done || selected !== null) return;
    if (timeLeft <= 0) {
      setSelected("__timeout__");
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [started, done, selected, timeLeft]);

  if (!started) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">🃏</div>
        <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">Flashcards Python</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">10 questions · {TIMER_SECONDS}s par question · +{GEMS_PER_CORRECT}💎 par bonne réponse</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-extrabold hover:opacity-90 transition-opacity shadow-lg"
        >
          Jouer !
        </button>
      </div>
    );
  }

  if (done) {
    const total = cards.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">{score === total ? "🏆" : score >= total / 2 ? "👍" : "😅"}</div>
        <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-1">{score}/{total} bonnes réponses</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{pct}% de réussite</p>
        {gemsEarned > 0 && (
          <p className="text-base font-bold text-purple-600 dark:text-purple-400 mb-4">+{gemsEarned} 💎 gagnées !</p>
        )}
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-extrabold hover:opacity-90 transition-opacity shadow-lg"
        >
          Rejouer
        </button>
      </div>
    );
  }

  const card = cards[index];
  const timedOut = selected === "__timeout__";
  const isCorrect = selected !== null && !timedOut && selected === card.answer;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress + timer */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700"
            style={{ width: `${((index) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">{index + 1}/{cards.length}</span>
        <span
          className={`text-sm font-bold w-7 text-right transition-colors ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-500 dark:text-slate-400"}`}
        >
          {selected !== null ? "" : timeLeft}
        </span>
      </div>

      {/* Question */}
      <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 text-center">
        <p className="font-bold text-gray-800 dark:text-white text-base leading-snug">{card.question}</p>
      </div>

      {/* Options */}
      <div className="w-full grid grid-cols-1 gap-2">
        {card.options.map((opt) => {
          let cls = "w-full py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all text-left ";
          if (selected === null) {
            cls += "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-white hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 active:scale-98";
          } else if (opt === card.answer) {
            cls += "bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300";
          } else if (opt === selected) {
            cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-300";
          } else {
            cls += "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 opacity-50";
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} className={cls} disabled={selected !== null}>
              {selected !== null && opt === card.answer && "✓ "}
              {selected !== null && opt === selected && opt !== card.answer && "✗ "}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div className={`w-full rounded-xl px-4 py-3 text-sm text-center ${timedOut ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300" : isCorrect ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>
          {timedOut ? "⏰ Temps écoulé ! " : isCorrect ? "✅ Bravo ! " : "❌ Pas tout à fait. "}
          <span className="text-gray-600 dark:text-slate-300">{card.explanation}</span>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={next}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-2.5 rounded-full font-extrabold hover:opacity-90 transition-opacity"
        >
          {index + 1 >= cards.length ? "Voir le score" : "Suivant →"}
        </button>
      )}
    </div>
  );
}
