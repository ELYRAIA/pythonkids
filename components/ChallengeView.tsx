"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab, historyKeymap, history } from "@codemirror/commands";
import { getPyodide } from "@/lib/pyodide";
import { useIsMobile } from "@/lib/useIsMobile";
import { parsePythonError } from "@/lib/pythonErrors";
import { playChallengeWinSound, playErrorSound } from "@/lib/sounds";
import { markChallengeComplete, getCompletedChallenges, type Challenge } from "@/lib/challenges";
import { trackChallengeWeek, refreshWeeklyQuests } from "@/lib/weeklyQuests";
import { BADGES, type Badge } from "@/lib/progress";
import { updateStreak } from "@/lib/streak";
import { spendGems } from "@/lib/gems";
import { recordFailure, clearMistake } from "@/lib/mistakes";
import { addXP } from "@/lib/xp";
import { addBattlePassXP } from "@/lib/battlePass";
import { calculateScore } from "@/lib/score";
import Confetti from "./Confetti";
import BadgeCelebration from "./BadgeCelebration";

interface ChallengeViewProps {
  challenge: Challenge;
  challengeIndex: number;
  totalChallenges: number;
  prevChallenge: Challenge | null;
  nextChallenge: Challenge | null;
}

type Status = "idle" | "running" | "success" | "error";

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ChallengeView({
  challenge,
  challengeIndex,
  totalChallenges,
  prevChallenge,
  nextChallenge,
}: ChallengeViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [actualOutput, setActualOutput] = useState("");
  const [hintLevel, setHintLevel] = useState(0); // 0 = caché, 1/2/3 = indices révélés
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState(false);
  const [toastBadge, setToastBadge] = useState<Badge | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const getSavedCode = () => {
    if (typeof window === "undefined") return challenge.starterCode;
    return localStorage.getItem(`pythonkids_code_challenge_${challenge.id}`) ?? challenge.starterCode;
  };
  const codeRef = useRef<string>(getSavedCode());
  const isMobile = useIsMobile();
  const [mobileCode, setMobileCode] = useState(codeRef.current);
  const [showSolution, setShowSolution] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<() => void>(() => {});
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Best time + already done
  useEffect(() => {
    const stored = localStorage.getItem(`pythonkids_best_time_${challenge.id}`);
    if (stored) setBestTime(parseInt(stored));
  }, [challenge.id]);

  // Editor
  useEffect(() => {
    if (!editorContainerRef.current) return;
    const runCmd = () => { runRef.current(); return true; };
    const view = new EditorView({
      state: EditorState.create({
        doc: codeRef.current,
        extensions: [
          history(),
          lineNumbers(),
          python(),
          oneDark,
          EditorView.theme({
            "&": { fontSize: "14px", fontFamily: "monospace" },
            ".cm-content": { padding: "12px" },
            ".cm-gutters": { backgroundColor: "#1a1b26", borderRight: "1px solid #2d2e3a" },
          }),
          EditorView.lineWrapping,
          keymap.of([
            { key: "Ctrl-Enter", run: runCmd },
            { key: "Mod-Enter", run: runCmd },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              const val = u.state.doc.toString();
              codeRef.current = val;
              saveCode(val);
            }
          }),
        ],
      }),
      parent: editorContainerRef.current,
    });
    editorViewRef.current = view;
    return () => { view.destroy(); editorViewRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pyodide
  useEffect(() => {
    getPyodide()
      .then((py) => { pyodideRef.current = py; setPyodideReady(true); })
      .catch(() => setPyodideError(true));
  }, []);

  const saveCode = (val: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(`pythonkids_code_challenge_${challenge.id}`, val);
    }, 500);
  };

  const resetCode = () => {
    codeRef.current = challenge.starterCode;
    setMobileCode(challenge.starterCode);
    setStatus("idle");
    setActualOutput("");
    setShowSolution(false);
    localStorage.removeItem(`pythonkids_code_challenge_${challenge.id}`);
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: challenge.starterCode } });
    }
  };

  const runTests = async () => {
    if (!pyodideRef.current || status === "running" || status === "success") return;
    setStatus("running");
    setActualOutput("");
    setAttempts((a) => a + 1);

    try {
      const py = pyodideRef.current;
      let output = "";
      py.setStdout({ batched: (t: string) => { output += (output ? "\n" : "") + t; } });
      py.setStderr({ batched: () => {} });
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("⏱️ Temps dépassé (5s). Tu as peut-être une boucle infinie !")), 5000)
      );
      await Promise.race([py.runPythonAsync(codeRef.current), timeout]);

      const normalise = (s: string) => s.replace(/\r\n/g, "\n").trim();
      const pass = normalise(output) === normalise(challenge.expectedOutput);
      setActualOutput(output);

      if (pass) {
        if (timerRef.current) clearInterval(timerRef.current);
        const time = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setFinalTime(time);
        setStatus("success");
        playChallengeWinSound();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 100);

        // Save best time
        const key = `pythonkids_best_time_${challenge.id}`;
        const existing = localStorage.getItem(key);
        if (!existing || time < parseInt(existing)) {
          localStorage.setItem(key, String(time));
          setBestTime(time);
        }

        // Effacer des erreurs car réussi
        clearMistake(challenge.id);
        // Récompenses
        addXP(30);
        addBattlePassXP(75);
        const streakBadges = updateStreak();
        trackChallengeWeek();
        refreshWeeklyQuests();
        const challengeBadges = markChallengeComplete(challenge.id);
        // Mise à jour classement
        const newScore = calculateScore();
        const storedUser = localStorage.getItem("pythonkids_username");
        if (storedUser) {
          fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: storedUser, score: newScore }),
          }).catch(() => {});
        }
        const allNewBadges = [...streakBadges, ...challengeBadges];
        if (allNewBadges.length > 0) {
          const badge = BADGES.find((b) => b.id === allNewBadges[0]);
          if (badge) {
            setTimeout(() => setToastBadge(badge), 600);
          }
        }
      } else {
        setStatus("error");
        playErrorSound();
        recordFailure(challenge.id);
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || "Erreur Python";
      setActualOutput(msg.startsWith("⏱️") ? msg : parsePythonError(msg));
      setStatus("error");
      playErrorSound();
      recordFailure(challenge.id);
    }
  };

  runRef.current = runTests;

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Colonne gauche : énoncé */}
          <div className="space-y-4">

            {/* Carte énoncé */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-purple-100 dark:border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    Défi #{challengeIndex + 1} / {totalChallenges}
                  </span>
                  <h1 className="text-xl font-extrabold text-gray-800 dark:text-white mt-1">
                    {challenge.emoji} {challenge.title}
                  </h1>
                </div>
                <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-bold text-white bg-gradient-to-r ${challenge.difficultyColor}`}>
                  {challenge.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                {challenge.description}
              </p>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-1 font-medium">Sortie attendue :</p>
                <pre className="text-sm font-mono text-green-700 dark:text-green-400 whitespace-pre-wrap">{challenge.expectedOutput}</pre>
              </div>
            </div>

            {/* Stats : timer, tentatives, meilleur temps */}
            <div className="flex gap-3">
              <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 flex items-center gap-2">
                <span className="text-xl">⏱</span>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Temps</p>
                  <p className={`text-sm font-bold tabular-nums ${status === "success" ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white"}`}>
                    {status === "success" ? formatTime(finalTime) : formatTime(elapsed)}
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Tentatives</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{attempts}</p>
                </div>
              </div>
              {bestTime !== null && (
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-3 flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Meilleur</p>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400 tabular-nums">{formatTime(bestTime)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Indices progressifs */}
            <div className="space-y-2">
              {/* Indices révélés */}
              {hintLevel > 0 && (
                <div className="space-y-2">
                  {challenge.hints.slice(0, hintLevel).map((h, i) => (
                    <div key={i} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 text-xs text-yellow-800 dark:text-yellow-300 whitespace-pre-wrap">
                      {"💡".repeat(i + 1)} {h}
                    </div>
                  ))}
                </div>
              )}
              {/* Bouton pour révéler l'indice suivant */}
              {hintLevel < 3 && status !== "success" && (
                <button
                  onClick={() => {
                    const nextLevel = hintLevel + 1;
                    if (nextLevel === 2) spendGems(5);
                    if (nextLevel === 3) spendGems(10);
                    setHintLevel(nextLevel);
                  }}
                  className="text-xs text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  {"💡".repeat(hintLevel + 1)}{" "}
                  {hintLevel === 0
                    ? "Voir un indice (gratuit)"
                    : hintLevel === 1
                    ? "Indice plus précis (-5 💎)"
                    : "Dernier indice (-10 💎)"}
                </button>
              )}

              {attempts >= 5 && status !== "success" && (
                <div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    {showSolution ? "▾ Cacher la solution" : "🔓 Voir une solution (après 5 essais)"}
                  </button>
                  {showSolution && (
                    <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3">
                      <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-2">Une solution possible :</p>
                      <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{challenge.solutionCode}</pre>
                      <button
                        onClick={() => {
                          codeRef.current = challenge.solutionCode;
                          setMobileCode(challenge.solutionCode);
                          const view = editorViewRef.current;
                          if (view) {
                            view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: challenge.solutionCode } });
                          }
                        }}
                        className="mt-2 text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors font-medium"
                      >
                        Copier dans l'éditeur →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation précédent / suivant */}
            <div className="flex gap-3 pt-2">
              {prevChallenge ? (
                <Link
                  href={`/challenges/${prevChallenge.id}`}
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold border-2 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-300 transition-all"
                >
                  ← {prevChallenge.title}
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextChallenge && (
                <Link
                  href={`/challenges/${nextChallenge.id}`}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${nextChallenge.difficultyColor} hover:opacity-90 transition-opacity`}
                >
                  {nextChallenge.title} →
                </Link>
              )}
            </div>
          </div>

          {/* Colonne droite : éditeur */}
          <div className="space-y-4">

            {/* Éditeur */}
            <div className="rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-slate-600 shadow-lg">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-gray-400 text-xs font-mono">solution.py</span>
                <div className="flex items-center gap-2">
                  {!pyodideReady && !pyodideError && (
                    <span className="text-yellow-400 text-xs animate-pulse">⏳ Chargement…</span>
                  )}
                  {pyodideError && (
                    <span className="text-red-400 text-xs">⚠️ Python indisponible</span>
                  )}
                  <button
                    onClick={resetCode}
                    className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    title="Réinitialiser le code"
                  >
                    ↺ Reset
                  </button>
                  <button
                    onClick={runTests}
                    disabled={!pyodideReady || status === "running" || status === "success"}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    {status === "running" ? "⏳ Test…" : "▶ Tester"}
                  </button>
                </div>
              </div>
              {isMobile ? (
                <textarea
                  value={mobileCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMobileCode(val);
                    codeRef.current = val;
                    saveCode(val);
                  }}
                  style={{ height: "440px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6" }}
                  className="w-full bg-[#282c34] text-gray-100 p-3 resize-none outline-none"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              ) : (
                <div ref={editorContainerRef} style={{ height: "440px" }} className="overflow-auto bg-[#282c34]" />
              )}
              <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-500">
                {isMobile ? "Appuie sur ▶ Tester pour vérifier ton code" : "Ctrl+Entrée pour tester · Tab pour indenter"}
              </div>
            </div>

            {/* Résultat */}
            {status !== "idle" && status !== "running" && (
              <div className={`rounded-2xl p-5 border-2 transition-all ${
                status === "success"
                  ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                  : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
              }`}>
                {status === "success" && (
                  <div className="text-center">
                    <p className="text-4xl mb-2">🎉</p>
                    <p className="text-xl font-extrabold text-green-700 dark:text-green-400 mb-3">Défi réussi !</p>
                    <div className="flex justify-center gap-3 text-sm mb-4 flex-wrap">
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-500">⏱ <span className="font-bold tabular-nums">{formatTime(finalTime)}</span></span>
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-500">🎯 <span className="font-bold">{attempts}</span> tentative{attempts > 1 ? "s" : ""}</span>
                      <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-300">+200 ⭐</span>
                      <span className="flex items-center gap-1 font-bold text-blue-500 dark:text-blue-400">+30 XP</span>
                      <span className="flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400">+75 🎖️</span>
                    </div>
                    {nextChallenge && (
                      <button
                        onClick={() => router.push(`/challenges/${nextChallenge.id}`)}
                        className={`bg-gradient-to-r ${nextChallenge.difficultyColor} text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-md`}
                      >
                        Défi suivant : {nextChallenge.title} →
                      </button>
                    )}
                    {!nextChallenge && (
                      <Link
                        href="/challenges"
                        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-md"
                      >
                        Voir tous les défis 🏆
                      </Link>
                    )}
                  </div>
                )}
                {status === "error" && (
                  <div>
                    <p className="font-bold text-red-600 dark:text-red-400 text-sm mb-3">❌ Pas encore…</p>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <p className="text-gray-500 dark:text-slate-400 mb-1 font-medium">Ta sortie :</p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-red-700 dark:text-red-400 whitespace-pre-wrap min-h-8">{actualOutput || "(rien)"}</pre>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400 mb-1 font-medium">Attendu :</p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-green-700 dark:text-green-400 whitespace-pre-wrap min-h-8">{challenge.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Confetti active={confetti} />
      <BadgeCelebration badge={toastBadge} onDismiss={() => setToastBadge(null)} />
    </div>
  );
}
