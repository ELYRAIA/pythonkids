"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab, historyKeymap } from "@codemirror/commands";
import { history } from "@codemirror/commands";
import { getPyodide } from "@/lib/pyodide";
import { parsePythonError } from "@/lib/pythonErrors";
import { BUG_EXERCISES, type BugExercise } from "@/lib/bugHunt";
import { lf } from "@/lib/localize";
import { addXP } from "@/lib/xp";
import { fireToast } from "@/lib/toast";

type Status = "idle" | "wrong_output" | "error" | "success";

function wrapCode(code: string): string {
  const indented = code.split("\n").map((l) => "    " + l).join("\n");
  return `async def _main():\n${indented}\nawait _main()`;
}

function BugEditor({
  exercise,
  onSolved,
}: {
  exercise: BugExercise;
  onSolved: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("BugHunt");

  const buggyCode = lf(exercise, "buggyCode", locale) || exercise.buggyCode;
  const expectedOutput = exercise.expectedOutput;

  const codeRef = useRef(buggyCode);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);
  const runCodeRef = useRef<() => void>(() => {});

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    getPyodide()
      .then((py) => { pyodideRef.current = py; setPyodideReady(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!editorContainerRef.current) return;
    const runCmd = () => { runCodeRef.current(); return true; };
    const view = new EditorView({
      state: EditorState.create({
        doc: buggyCode,
        extensions: [
          history(),
          lineNumbers(),
          python(),
          oneDark,
          EditorView.theme({
            "&": { fontSize: "14px", fontFamily: "'Geist Mono', monospace" },
            ".cm-content": { padding: "10px" },
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
          EditorView.updateListener.of((upd) => {
            if (upd.docChanged) codeRef.current = upd.state.doc.toString();
          }),
        ],
      }),
      parent: editorContainerRef.current,
    });
    editorViewRef.current = view;
    return () => { view.destroy(); editorViewRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const runCode = async () => {
    if (!pyodideRef.current) return;
    setIsLoading(true);
    setOutput("");
    setStatus("idle");
    let captured = "";
    try {
      const py = pyodideRef.current;
      py.setStdout({ batched: (t: string) => { captured += t + "\n"; } });
      py.setStderr({ batched: (t: string) => { captured += t + "\n"; } });
      await py.runPythonAsync(wrapCode(codeRef.current));
      const trimmed = captured.trim();
      setOutput(trimmed);
      if (trimmed === expectedOutput.trim()) {
        setStatus("success");
        addXP(30);
        fireToast("🐛 Bug corrigé ! +30 XP", "🐛", "success");
        setTimeout(onSolved, 1200);
      } else {
        setStatus("wrong_output");
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || "Erreur inconnue";
      setOutput(parsePythonError(msg));
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  runCodeRef.current = runCode;

  const showSolutionInEditor = () => {
    const fixed = lf(exercise, "fixedCode", locale) || exercise.fixedCode;
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: fixed } });
      codeRef.current = fixed;
    }
    setShowSolution(true);
  };

  const hint = lf(exercise, "hint", locale) || exercise.hint;
  const explanation = lf(exercise, "explanation", locale) || exercise.explanation;

  return (
    <div className="space-y-4">
      {/* Éditeur */}
      <div className="overflow-hidden rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-sm">
        <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
            <span className="w-3.5 h-3.5 rounded-full bg-green-400" />
          </div>
          <span className="text-gray-400 text-xs font-mono">bug.py</span>
          <div className="flex items-center gap-3">
            {!pyodideReady && <span className="text-yellow-400 text-xs animate-pulse">{t("loading_python")}</span>}
            {pyodideReady && <span className="text-green-400 text-xs">✅ Python prêt</span>}
            <button
              onClick={runCode}
              disabled={!pyodideReady || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {isLoading ? "⏳..." : "▶ " + t("run_button")}
            </button>
          </div>
        </div>
        <div ref={editorContainerRef} style={{ height: "180px", fontSize: "14px" }} className="overflow-auto bg-[#282c34]" />
      </div>

      {/* Résultat */}
      {output && (
        <div className={`rounded-2xl p-4 border-2 font-mono text-sm ${
          status === "success"
            ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300"
            : status === "error"
            ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
            : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300"
        }`}>
          {status === "success" && <p className="font-bold mb-1 not-italic">🎉 {t("success_message")}</p>}
          {status === "wrong_output" && (
            <div className="mb-2 not-italic">
              <p className="font-bold text-orange-600 dark:text-orange-400 font-sans text-xs mb-1">{t("wrong_output")}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-sans">{t("expected")}: <strong>{expectedOutput}</strong></p>
            </div>
          )}
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {/* Aide */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 transition-colors"
        >
          💡 {showHint ? t("hide_hint") : t("show_hint")}
        </button>
        {!showSolution && (
          <button
            onClick={showSolutionInEditor}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:bg-gray-100 transition-colors"
          >
            🔑 {t("show_solution")}
          </button>
        )}
        {showSolution && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
          >
            📖 {t("explain")}
          </button>
        )}
      </div>

      {showHint && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">💡 {hint}</p>
        </div>
      )}

      {showExplanation && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
          <p className="text-sm text-blue-800 dark:text-blue-300">📖 {explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function BugHuntView() {
  const t = useTranslations("BugHunt");
  const locale = useLocale();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Facile" | "Moyen" | "Difficile">("Tous");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pythonkids_bughunt_solved");
      if (saved) setSolvedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const filteredExercises = filter === "Tous"
    ? BUG_EXERCISES
    : BUG_EXERCISES.filter((e) => e.difficulty === filter);

  const exercise = filteredExercises[currentIdx] ?? BUG_EXERCISES[0];

  const handleSolved = () => {
    setSolvedIds((prev) => {
      const next = prev.includes(exercise.id) ? prev : [...prev, exercise.id];
      localStorage.setItem("pythonkids_bughunt_solved", JSON.stringify(next));
      return next;
    });
    setTimeout(() => {
      if (currentIdx < filteredExercises.length - 1) setCurrentIdx((i) => i + 1);
    }, 1500);
  };

  const FILTERS: Array<"Tous" | "Facile" | "Moyen" | "Difficile"> = ["Tous", "Facile", "Moyen", "Difficile"];
  const FILTER_COLORS: Record<string, string> = {
    Tous: "from-purple-500 to-pink-500",
    Facile: "from-green-400 to-emerald-500",
    Moyen: "from-yellow-400 to-orange-500",
    Difficile: "from-red-400 to-rose-500",
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700 rounded-xl px-3 py-1.5">
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              🐛 {solvedIds.length}/{BUG_EXERCISES.length} {t("solved")}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentIdx(0); }}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                filter === f
                  ? `bg-gradient-to-r ${FILTER_COLORS[f]} text-white shadow-sm`
                  : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              {t(`filter_${f.toLowerCase()}` as "filter_tous" | "filter_facile" | "filter_moyen" | "filter_difficile")}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation exercices */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filteredExercises.map((ex, idx) => {
          const isSolved = solvedIds.includes(ex.id);
          const isCurrent = idx === currentIdx;
          return (
            <button
              key={ex.id}
              onClick={() => setCurrentIdx(idx)}
              title={lf(ex, "title", locale) || ex.title}
              className={`flex-shrink-0 w-9 h-9 rounded-xl text-base font-bold transition-all border-2 ${
                isCurrent
                  ? "border-purple-400 bg-purple-100 dark:bg-purple-900/40 scale-110"
                  : isSolved
                  ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30"
                  : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-purple-300"
              }`}
            >
              {isSolved ? "✅" : ex.emoji}
            </button>
          );
        })}
      </div>

      {/* Exercice courant */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* En-tête */}
        <div className={`bg-gradient-to-r ${exercise.difficultyColor} px-5 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exercise.emoji}</span>
              <div>
                <h2 className="font-extrabold text-white">{lf(exercise, "title", locale) || exercise.title}</h2>
                <span className="text-xs text-white/80">{exercise.difficulty}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-bold disabled:opacity-40 transition-colors flex items-center justify-center"
              >
                ‹
              </button>
              <span className="text-white/80 text-xs font-bold">{currentIdx + 1}/{filteredExercises.length}</span>
              <button
                onClick={() => setCurrentIdx((i) => Math.min(filteredExercises.length - 1, i + 1))}
                disabled={currentIdx === filteredExercises.length - 1}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-bold disabled:opacity-40 transition-colors flex items-center justify-center"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Description */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <span>🔍</span>
              {t("find_the_bug")}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 whitespace-pre-line">
              {lf(exercise, "description", locale) || exercise.description}
            </p>
          </div>

          {/* Éditeur interactif */}
          <BugEditor
            key={`${exercise.id}-${currentIdx}`}
            exercise={exercise}
            onSolved={handleSolved}
          />
        </div>
      </div>
    </div>
  );
}
