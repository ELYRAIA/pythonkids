"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getPyodide } from "@/lib/pyodide";
import { parsePythonError } from "@/lib/pythonErrors";
import type { LessonExercise as ExerciseData } from "@/lib/lessons";
import { apiFetch } from "@/lib/api";
import { lf, lfa } from "@/lib/localize";

interface Props {
  exercise: ExerciseData;
  levelColor: string;
  levelName?: string;
  onAttempted: () => void;
  onFirstFailure?: () => void;
}

export default function LessonExercise({ exercise, levelColor, levelName, onAttempted, onFirstFailure }: Props) {
  const t = useTranslations("LessonExercise");
  const locale = useLocale();
  const hints = lfa(exercise, 'hints', locale);
  const [code, setCode] = useState(() => lf(exercise, 'starterCode', locale) || exercise.starterCode);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [pyodideReady, setPyodideReady] = useState(false);
  const [hintLevel, setHintLevel] = useState(0); // 0 = caché, 1-3 = indice révélé
  const [aiHint, setAiHint] = useState("");
  const [aiHintLoading, setAiHintLoading] = useState(false);
  const [aiHintCount, setAiHintCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyRef = useRef<any>(null);
  const attemptedRef = useRef(false);

  useEffect(() => {
    getPyodide()
      .then((py) => { pyRef.current = py; setPyodideReady(true); })
      .catch(() => {});
  }, []);

  const askAiHint = async () => {
    setAiHintLoading(true);
    setAiHint("");
    try {
      const res = await apiFetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          instruction: exercise.instruction,
          expectedOutput: exercise.expectedOutput,
          currentOutput: output || undefined,
          levelName,
          hintCount: aiHintCount,
        }),
      });
      const data = await res.json() as { hint?: string; error?: string };
      setAiHint(data.hint ?? data.error ?? t("ai_help"));
      setAiHintCount((c) => c + 1);
    } catch {
      setAiHint(t("ai_help"));
    }
    setAiHintLoading(false);
  };

  const run = async () => {
    if (!pyRef.current || status === "running" || status === "success") return;
    setStatus("running");
    try {
      const py = pyRef.current;
      let out = "";
      py.setStdout({ batched: (t: string) => { out += (out ? "\n" : "") + t; } });
      py.setStderr({ batched: () => {} });
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(t("timeout"))), 5000)
      );
      await Promise.race([py.runPythonAsync(code), timeout]);
      const normalise = (s: string) => s.replace(/\r\n/g, "\n").trim();
      const pass = normalise(out) === normalise(lf(exercise, 'expectedOutput', locale) || exercise.expectedOutput);
      setOutput(out);
      setStatus(pass ? "success" : "error");
      if (!pass && !attemptedRef.current) onFirstFailure?.();
    } catch (err: unknown) {
      const msg = (err as Error).message || "Erreur";
      setOutput(msg.startsWith("⏱️") ? msg : parsePythonError(msg));
      setStatus("error");
    }
    if (!attemptedRef.current) {
      attemptedRef.current = true;
      onAttempted();
    }
  };

  return (
    <div className="mt-6 rounded-2xl border-2 border-purple-100 dark:border-purple-900/40 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${levelColor} px-5 py-3 flex items-center gap-2`}>
        <span className="text-white font-bold text-sm">{t("header")}</span>
        {status === "success" && (
          <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {t("success")}
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-5">
        {/* Instruction */}
        <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-line mb-4 leading-relaxed">
          {lf(exercise, 'instruction', locale)}
        </p>

        {/* Mini éditeur */}
        <textarea
          value={code}
          onChange={(e) => {
            if (status === "success") return;
            setCode(e.target.value);
            setStatus("idle");
            setOutput("");
          }}
          rows={Math.max(3, code.split("\n").length + 1)}
          className="w-full bg-[#1e1e2e] text-gray-100 p-3 rounded-xl font-mono text-sm resize-none outline-none border border-gray-700 focus:border-purple-400 transition-colors"
          style={{ lineHeight: "1.6" }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Bouton + résultat */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={run}
            disabled={!pyodideReady || status === "running" || status === "success"}
            className={`px-4 py-2 rounded-full text-xs font-bold text-white transition-all disabled:opacity-50 bg-gradient-to-r ${levelColor} hover:opacity-90 shadow-sm`}
          >
            {status === "running" ? t("running") : status === "success" ? t("success_badge") : t("verify")}
          </button>
          {!pyodideReady && (
            <span className="text-xs text-gray-400 animate-pulse">{t("loading")}</span>
          )}
          {hints.length > 0 && status !== "success" && (
            <button
              onClick={() => setHintLevel((h) => Math.min(h + 1, hints.length))}
              disabled={hintLevel >= hints.length}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {hintLevel === 0 ? t("hint_button") : hintLevel >= hints.length ? t("no_hint") : t("next_hint")}
            </button>
          )}
          {status === "error" && (
            <button
              onClick={askAiHint}
              disabled={aiHintLoading}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors disabled:opacity-60"
            >
              {aiHintLoading ? t("ai_loading") : t("ai_help")}
            </button>
          )}
        </div>

        {/* Indice IA */}
        {aiHint && (
          <div className="mt-3 flex gap-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl px-3 py-2">
            <span className="text-violet-500 shrink-0">🤖</span>
            <p className="text-xs text-violet-800 dark:text-violet-300">{aiHint}</p>
          </div>
        )}

        {/* Indices progressifs */}
        {hintLevel > 0 && hints.length > 0 && (
          <div className="mt-3 space-y-2">
            {hints.slice(0, hintLevel).map((h, i) => (
              <div key={i} className="flex gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2">
                <span className="text-amber-500 shrink-0">💡</span>
                <p className="text-xs text-amber-800 dark:text-amber-300">{h}</p>
              </div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {status === "success" && (
          <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3 text-sm text-green-700 dark:text-green-400 font-semibold">
            {t("success_message")}
          </div>
        )}
        {status === "error" && output && (
          <div className="mt-3 space-y-2">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-xs font-mono text-red-700 dark:text-red-400 whitespace-pre-wrap">
              {output || "(rien)"}
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {t("expected")} <span className="font-mono text-green-600 dark:text-green-400">{lf(exercise, 'expectedOutput', locale) || exercise.expectedOutput}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
