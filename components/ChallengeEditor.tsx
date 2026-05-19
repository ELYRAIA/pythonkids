"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab, historyKeymap, history } from "@codemirror/commands";
import { getPyodide } from "@/lib/pyodide";
import { playChallengeWinSound, playErrorSound } from "@/lib/sounds";
import { markChallengeComplete } from "@/lib/challenges";
import { trackChallengeWeek, refreshWeeklyQuests } from "@/lib/weeklyQuests";
import { BADGES, type Badge } from "@/lib/progress";
import { updateStreak } from "@/lib/streak";
import Confetti from "./Confetti";

interface ChallengeEditorProps {
  challengeId: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
  onSuccess?: () => void;
}

type Status = "idle" | "running" | "success" | "error";

export default function ChallengeEditor({
  challengeId,
  starterCode,
  expectedOutput,
  hint,
  onSuccess,
}: ChallengeEditorProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [actualOutput, setActualOutput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [toastBadge, setToastBadge] = useState<Badge | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [lives, setLives] = useState(3);
  const [cooldown, setCooldown] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const codeRef = useRef<string>(starterCode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<() => void>(() => {});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
            if (u.docChanged) codeRef.current = u.state.doc.toString();
          }),
        ],
      }),
      parent: editorContainerRef.current,
    });
    return () => view.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPyodide()
      .then((py) => { pyodideRef.current = py; setPyodideReady(true); })
      .catch(() => {});
  }, []);

  const formatTime = useCallback((s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, []);

  useEffect(() => {
    const saved = localStorage.getItem(`pythonkids_best_time_${challengeId}`);
    if (saved) setBestTime(parseInt(saved));
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [challengeId]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const runTests = async () => {
    if (!pyodideRef.current || cooldown > 0) return;
    setStatus("running");
    setActualOutput("");

    try {
      const py = pyodideRef.current;
      let output = "";
      py.setStdout({ batched: (t: string) => { output += (output ? "\n" : "") + t; } });
      py.setStderr({ batched: () => {} });
      await py.runPythonAsync(codeRef.current);

      const normalise = (s: string) => s.replace(/\r\n/g, "\n").trim();
      const pass = normalise(output) === normalise(expectedOutput);
      setActualOutput(output);

      if (pass) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus("success");
        playChallengeWinSound();
        const streakBadges = updateStreak();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 100);
        trackChallengeWeek();
        refreshWeeklyQuests();
        const challengeBadges = markChallengeComplete(challengeId);
        const allNewBadges = [...streakBadges, ...challengeBadges];
        if (allNewBadges.length > 0) {
          const badge = BADGES.find((b) => b.id === allNewBadges[0]);
          if (badge) {
            setTimeout(() => { setToastBadge(badge); setTimeout(() => setToastBadge(null), 4500); }, 400);
          }
        }
        // Meilleur temps
        const key = `pythonkids_best_time_${challengeId}`;
        const prev = localStorage.getItem(key);
        if (!prev || elapsed < parseInt(prev)) {
          localStorage.setItem(key, String(elapsed));
          setBestTime(elapsed);
          setIsNewRecord(true);
        }
        onSuccess?.();
      } else {
        setStatus("error");
        playErrorSound();
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          // Plus de vies : cooldown 30s + indice forcé
          setCooldown(30);
          setLives(3); // réinitialise pour la prochaine tentative
          setShowHint(true);
        }
      }
    } catch (err: unknown) {
      setActualOutput((err as Error).message || "Erreur");
      setStatus("error");
      playErrorSound();
    }
  };

  runRef.current = runTests;

  return (
    <div className="space-y-4">
      {/* Vies */}
      {status !== "success" && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-xl transition-all ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}>
                ❤️
              </span>
            ))}
            <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{lives} vie{lives > 1 ? "s" : ""}</span>
          </div>
          {cooldown > 0 && (
            <span className="text-xs text-orange-500 font-bold animate-pulse">
              ⏳ Pause {cooldown}s — lis l&apos;indice !
            </span>
          )}
        </div>
      )}

      {/* Éditeur */}
      <div className="rounded-2xl overflow-hidden border-2 border-purple-200 shadow-lg">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-gray-400 text-xs font-mono">solution.py</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs font-mono tabular-nums">
              ⏱ {formatTime(elapsed)}
              {bestTime !== null && status !== "success" && (
                <span className="text-gray-600 ml-1">· record {formatTime(bestTime)}</span>
              )}
            </span>
            {!pyodideReady && <span className="text-yellow-400 text-xs animate-pulse">⏳ Chargement...</span>}
            <button
              onClick={runTests}
              disabled={!pyodideReady || status === "running" || cooldown > 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {status === "running" ? "⏳ Test..." : cooldown > 0 ? `⏳ ${cooldown}s` : "▶ Tester ma solution"}
            </button>
          </div>
        </div>
        <div ref={editorContainerRef} style={{ height: "260px" }} className="overflow-auto bg-[#282c34]" />
        <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-500">
          Ctrl+Entrée pour tester • Tab pour indenter
        </div>
      </div>

      {/* Résultat du test */}
      {status !== "idle" && (
        <div className={`rounded-xl p-4 border-2 ${status === "success" ? "border-green-300 bg-green-50 dark:bg-green-900/20" : status === "error" ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-gray-200 bg-gray-50"}`}>
          {status === "success" && (
            <div className="text-center">
              <p className="text-2xl mb-1">{isNewRecord ? "🏆" : "🎉"}</p>
              <p className="font-bold text-green-700 dark:text-green-400">Bravo ! Défi réussi !</p>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-sm font-mono font-bold text-green-600 dark:text-green-400">
                  ⏱ {formatTime(elapsed)}
                </span>
                {isNewRecord ? (
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                    🏆 Nouveau record !
                  </span>
                ) : bestTime !== null && (
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    Record : {formatTime(bestTime)}
                  </span>
                )}
              </div>
            </div>
          )}
          {status === "error" && (
            <div>
              <p className="font-bold text-red-600 dark:text-red-400 text-sm mb-2">❌ Pas tout à fait…</p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <p className="text-gray-500 mb-1">Ta sortie :</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-red-700 dark:text-red-400 whitespace-pre-wrap">{actualOutput || "(rien)"}</pre>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Sortie attendue :</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-green-700 dark:text-green-400 whitespace-pre-wrap">{expectedOutput}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Indice */}
      <div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors"
        >
          {showHint ? "▾ Cacher l'indice" : "💡 Voir un indice"}
        </button>
        {showHint && (
          <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 text-xs text-yellow-800 dark:text-yellow-300">
            💡 {hint}
          </div>
        )}
      </div>

      {/* Confetti */}
      <Confetti active={confetti} />

      {/* Toast badge */}
      {toastBadge && (
        <div className="fixed bottom-6 right-6 z-50 badge-toast">
          <div className={`bg-gradient-to-r ${toastBadge.color} text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3`}>
            <span className="text-4xl">{toastBadge.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide opacity-80">Nouveau badge !</p>
              <p className="font-bold text-base">{toastBadge.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
