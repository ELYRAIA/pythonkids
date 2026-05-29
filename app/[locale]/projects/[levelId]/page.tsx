"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppHeader from "@/components/AppHeader";
import { GUIDED_PROJECTS, completeProjectStep, getProjectStepsDone } from "@/lib/projects";
import { getPyodide } from "@/lib/pyodide";
import { parsePythonError } from "@/lib/pythonErrors";

export default function ProjectPage() {
  const t = useTranslations("Projects");
  const params = useParams();
  const levelId = parseInt(params.levelId as string);
  const project = GUIDED_PROJECTS.find((p) => p.levelId === levelId);

  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [pyodideReady, setPyodideReady] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [stepsDone, setStepsDone] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyRef = useRef<any>(null);

  useEffect(() => {
    getPyodide().then((py) => { pyRef.current = py; setPyodideReady(true); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!project) return;
    const done = getProjectStepsDone(project.id);
    setStepsDone(done);
    const startStep = Math.min(done, project.steps.length - 1);
    setCurrentStep(startStep);
    setCode(project.steps[startStep].starterCode);
    setOutput("");
    setStatus("idle");
    setAiHint("");
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">Projet introuvable pour le niveau {levelId}.</p>
        <Link href="/projects" className="mt-4 text-purple-600 hover:underline text-sm">← Retour aux projets</Link>
      </div>
    );
  }

  const step = project.steps[currentStep];

  const goToStep = (idx: number) => {
    if (idx < 0 || idx >= project.steps.length) return;
    setCurrentStep(idx);
    setCode(project.steps[idx].starterCode);
    setOutput("");
    setStatus("idle");
    setAiHint("");
  };

  const run = async () => {
    if (!pyRef.current || status === "running") return;
    setStatus("running");
    try {
      const py = pyRef.current;
      let out = "";
      py.setStdout({ batched: (text: string) => { out += (out ? "\n" : "") + text; } });
      py.setStderr({ batched: () => {} });
      const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("⏱️ Temps dépassé.")), 5000));
      await Promise.race([py.runPythonAsync(code), timeout]);
      const norm = (s: string) => s.replace(/\r\n/g, "\n").trim();
      const pass = norm(out) === norm(step.expectedOutput);
      setOutput(out);
      setStatus(pass ? "success" : "error");
      if (pass) {
        completeProjectStep(project.id, currentStep);
        setStepsDone(Math.max(stepsDone, currentStep + 1));
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || "Erreur";
      setOutput(msg.startsWith("⏱️") ? msg : parsePythonError(msg));
      setStatus("error");
    }
  };

  const askAi = async () => {
    setAiLoading(true);
    setAiHint("");
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          instruction: step.description,
          expectedOutput: step.expectedOutput,
          currentOutput: output || undefined,
          levelName: project.title,
        }),
      });
      const data = await res.json() as { hint?: string };
      setAiHint(data.hint ?? "");
    } catch {
      setAiHint("Impossible de contacter l'IA.");
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-4 py-6 max-w-3xl mx-auto space-y-5">

        {/* Header projet */}
        <div className={`bg-gradient-to-br ${project.color} rounded-3xl p-6 text-white`}>
          <Link href="/projects" className="text-white/70 text-xs hover:text-white mb-3 inline-block">← Projets</Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{project.emoji}</span>
            <div>
              <h1 className="text-xl font-extrabold">{project.title}</h1>
              <p className="text-white/80 text-xs mt-0.5">{project.description}</p>
            </div>
          </div>
          {/* Progression étapes */}
          <div className="mt-4 flex gap-2">
            {project.steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i < stepsDone ? "bg-white" :
                  i === currentStep ? "bg-white/60" :
                  "bg-white/20"
                }`}
                title={s.title}
              />
            ))}
          </div>
          <p className="text-white/70 text-xs mt-2">Étape {currentStep + 1}/{project.steps.length} — {step.title}</p>
        </div>

        {/* Description de l'étape */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="font-extrabold text-gray-800 dark:text-white mb-2">📝 {step.title}</h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{step.description}</p>
        </div>

        {/* Éditeur */}
        <div className="rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="text-gray-400 text-xs font-mono">projet.py</span>
            <div className="flex items-center gap-3">
              {!pyodideReady && <span className="text-yellow-400 text-xs animate-pulse">⏳ Chargement Python…</span>}
              <button
                onClick={run}
                disabled={!pyodideReady || status === "running"}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 hover:opacity-90"
              >
                {status === "running" ? "⏳ Test…" : "▶ Vérifier"}
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => { if (status !== "success") { setCode(e.target.value); setStatus("idle"); setOutput(""); } }}
            rows={Math.max(6, code.split("\n").length + 1)}
            className="w-full bg-[#1e1e2e] text-gray-100 p-4 font-mono text-sm resize-none outline-none"
            style={{ lineHeight: "1.6" }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {/* Résultat */}
        {status === "success" && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-5 text-center">
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-extrabold text-green-700 dark:text-green-400">Étape réussie !</p>
            {currentStep < project.steps.length - 1 ? (
              <button
                onClick={() => goToStep(currentStep + 1)}
                className={`mt-3 bg-gradient-to-r ${project.color} text-white px-6 py-2 rounded-full text-sm font-bold`}
              >
                Étape suivante →
              </button>
            ) : (
              <div className="mt-3">
                <p className="font-bold text-green-600 dark:text-green-400">Projet terminé ! 🏆</p>
                <Link href="/projects" className="mt-2 inline-block text-sm text-purple-600 hover:underline">Voir tous les projets</Link>
              </div>
            )}
          </div>
        )}
        {status === "error" && output && (
          <div className="space-y-2">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-xs font-mono text-red-700 dark:text-red-400 whitespace-pre-wrap">
              {output}
            </div>
            <p className="text-xs text-gray-400">Attendu : <span className="font-mono text-green-600 dark:text-green-400">{step.expectedOutput}</span></p>
          </div>
        )}

        {/* Aides */}
        <div className="flex gap-3 flex-wrap">
          <details className="text-xs">
            <summary className="text-amber-600 dark:text-amber-400 cursor-pointer font-medium">💡 Voir un indice</summary>
            <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-amber-800 dark:text-amber-300">
              {step.hint}
            </div>
          </details>
          {status === "error" && (
            <button onClick={askAi} disabled={aiLoading} className="text-xs text-violet-600 dark:text-violet-400 font-medium disabled:opacity-60">
              {aiLoading ? "⏳ IA…" : "🤖 Aide IA"}
            </button>
          )}
        </div>
        {aiHint && (
          <div className="flex gap-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl p-3">
            <span className="shrink-0">🤖</span>
            <p className="text-xs text-violet-800 dark:text-violet-300">{aiHint}</p>
          </div>
        )}

        {/* Navigation entre étapes */}
        <div className="flex justify-between pb-6">
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="text-sm text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-30 transition-colors"
          >
            ← Étape précédente
          </button>
          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep >= project.steps.length - 1 || currentStep >= stepsDone}
            className="text-sm text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-30 transition-colors"
          >
            Étape suivante →
          </button>
        </div>
      </div>
    </div>
  );
}
