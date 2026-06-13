"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab, historyKeymap } from "@codemirror/commands";
import { history } from "@codemirror/commands";
import { getPyodide } from "@/lib/pyodide";
import { useIsMobile } from "@/lib/useIsMobile";
import { parsePythonError } from "@/lib/pythonErrors";

interface PythonEditorProps {
  defaultCode?: string;
  height?: string;
  storageKey?: string;
}

// Transforme le code pour que input() fonctionne dans le navigateur :
// - enveloppe tout dans une fonction async
// - remplace input() par await _async_input()
function wrapCode(code: string): string {
  const wrapped = code.replace(/\binput\s*\(/g, "await _async_input(");
  const indented = wrapped.split("\n").map((line) => "    " + line).join("\n");
  return `async def _main():\n${indented}\nawait _main()`;
}

export default function PythonEditor({
  defaultCode = 'print("Bonjour le monde !")',
  height = "200px",
  storageKey,
}: PythonEditorProps) {
  const t = useTranslations("LessonExercise");
  const getInitialCode = () => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(`pythonkids_code_${storageKey}`);
      if (saved !== null) return saved;
    }
    return defaultCode;
  };

  const codeRef = useRef<string>(getInitialCode());
  const isMobile = useIsMobile();
  const [mobileCode, setMobileCode] = useState(codeRef.current);

  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("pythonkids_editor_fontsize") ?? "14");
    }
    return 14;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  const [lines, setLines] = useState<{ type: "output" | "input-echo" | "error"; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [setupError, setSetupError] = useState("");

  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputResolverRef = useRef<((value: string) => void) | null>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialise CodeMirror
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const runCodeCmd = () => { runCodeRef.current(); return true; };

    const view = new EditorView({
      state: EditorState.create({
        doc: codeRef.current,
        extensions: [
          history(),
          lineNumbers(),
          python(),
          oneDark,
          EditorView.theme({
            "&": { fontSize: "inherit", fontFamily: "'Geist Mono', monospace" },
            ".cm-content": { padding: "12px" },
            ".cm-gutters": { backgroundColor: "#1a1b26", borderRight: "1px solid #2d2e3a" },
          }),
          EditorView.lineWrapping,
          keymap.of([
            { key: "Ctrl-Enter", run: runCodeCmd },
            { key: "Mod-Enter", run: runCodeCmd },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newCode = update.state.doc.toString();
              codeRef.current = newCode;
              if (storageKey) {
                if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                saveTimerRef.current = setTimeout(() => {
                  localStorage.setItem(`pythonkids_code_${storageKey}`, newCode);
                }, 500);
              }
            }
          }),
        ],
      }),
      parent: editorContainerRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Met à jour l'éditeur si defaultCode change (changement de leçon ou exemple rapide)
  useEffect(() => {
    if (storageKey) return;
    const view = editorViewRef.current;
    if (view) {
      const current = view.state.doc.toString();
      if (current !== defaultCode) {
        view.dispatch({ changes: { from: 0, to: current.length, insert: defaultCode } });
        codeRef.current = defaultCode;
        setLines([]);
      }
    } else {
      setMobileCode(defaultCode);
      codeRef.current = defaultCode;
      setLines([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCode, storageKey]);

  // Référence stable vers runCode pour l'utiliser dans le keymap
  const runCodeRef = useRef<() => void>(() => {});

  useEffect(() => {
    getPyodide()
      .then((py) => {
        window._pythonInputRequest = (msg: string): Promise<string> => {
          return new Promise((resolve) => {
            setInputPrompt(msg);
            inputResolverRef.current = resolve;
          });
        };

        py.runPython(`
from js import _pythonInputRequest

async def _async_input(msg=""):
    result = await _pythonInputRequest(str(msg))
    return str(result)
`);
        pyodideRef.current = py;
        setPyodideReady(true);
      })
      .catch(() => setSetupError("Impossible de charger Python. Vérifie ta connexion."));
  }, []);

  useEffect(() => {
    if (inputPrompt !== null) {
      setTimeout(() => inputFieldRef.current?.focus(), 50);
    }
  }, [inputPrompt]);

  const addLine = (type: "output" | "input-echo" | "error", text: string) => {
    setLines((prev) => [...prev, { type, text }]);
  };

  const submitInput = () => {
    if (!inputResolverRef.current) return;
    const val = inputValue;
    addLine("input-echo", (inputPrompt ?? "") + val);
    inputResolverRef.current(val);
    inputResolverRef.current = null;
    setInputValue("");
    setInputPrompt(null);
  };

  const runCode = async () => {
    if (!pyodideRef.current) return;
    setIsLoading(true);
    setLines([]);

    try {
      const py = pyodideRef.current;
      const code = codeRef.current;

      py.setStdout({ batched: (text: string) => addLine("output", text) });
      py.setStderr({ batched: (text: string) => addLine("error", text) });

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("⏱️ Temps dépassé (5s). Tu as peut-être une boucle infinie !")), 5000)
      );
      await Promise.race([py.runPythonAsync(wrapCode(code)), timeout]);
    } catch (err: unknown) {
      const msg = (err as Error).message || "Erreur inconnue";
      addLine("error", msg.startsWith("⏱️") ? msg : parsePythonError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  // Garde runCodeRef à jour
  runCodeRef.current = runCode;

  const hasOutput = lines.length > 0 || inputPrompt !== null;

  return (
    <div className={`overflow-hidden border-2 border-purple-200 shadow-lg ${isFullscreen ? "fixed inset-0 z-[100] flex flex-col border-0 rounded-none" : "rounded-2xl"}`}>
      {/* Toolbar */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex gap-3">
          <span className="w-5 h-5 rounded-full bg-red-400" />
          <span className="w-5 h-5 rounded-full bg-yellow-400" />
          <span className="w-5 h-5 rounded-full bg-green-400" />
        </div>
        <span className="text-gray-400 text-sm font-mono">main.py</span>
        <div className="flex items-center gap-4">
          {!pyodideReady && !setupError && (
            <span className="text-yellow-400 text-xs animate-pulse">{t("loading")}</span>
          )}
          {setupError && (
            <span className="text-red-400 text-xs">{setupError}</span>
          )}
          {pyodideReady && (
            <span className="text-green-400 text-xs font-semibold">✅ Python prêt</span>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { const s = Math.max(10, fontSize - 2); setFontSize(s); localStorage.setItem("pythonkids_editor_fontsize", String(s)); }}
              className="text-gray-400 hover:text-white text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 transition-colors font-bold"
              title="Réduire la police"
            >A-</button>
            <button
              onClick={() => { const s = Math.min(22, fontSize + 2); setFontSize(s); localStorage.setItem("pythonkids_editor_fontsize", String(s)); }}
              className="text-gray-400 hover:text-white text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 transition-colors font-bold"
              title="Agrandir la police"
            >A+</button>
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="text-gray-400 hover:text-white text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
              title={isFullscreen ? "Quitter le plein écran (Échap)" : "Plein écran"}
            >{isFullscreen ? "⊡" : "⛶"}</button>
          </div>
          <button
            onClick={runCode}
            disabled={!pyodideReady || isLoading || inputPrompt !== null}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? "⏳ En cours..." : "▶ Exécuter"}
          </button>
        </div>
      </div>

      {/* Erreur chargement Pyodide */}
      {setupError && (
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800 px-4 py-3 flex items-start gap-3">
          <span className="text-xl mt-0.5 shrink-0">🚫</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Python n&apos;a pas pu se charger</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{setupError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="shrink-0 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Éditeur */}
      {isMobile ? (
        <textarea
          value={mobileCode}
          onChange={(e) => {
            const val = e.target.value;
            setMobileCode(val);
            codeRef.current = val;
            if (storageKey) {
              if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
              saveTimerRef.current = setTimeout(() => {
                localStorage.setItem(`pythonkids_code_${storageKey}`, val);
              }, 500);
            }
          }}
          style={isFullscreen ? { flex: 1, minHeight: 0, fontFamily: "'Geist Mono', monospace", fontSize: `${fontSize}px`, lineHeight: "1.6" } : { height, fontFamily: "'Geist Mono', monospace", fontSize: `${fontSize}px`, lineHeight: "1.6" }}
          className="w-full bg-[#282c34] text-gray-100 p-3 resize-none outline-none"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      ) : (
        <div ref={editorContainerRef} style={isFullscreen ? { flex: 1, fontSize: `${fontSize}px`, minHeight: 0 } : { height, fontSize: `${fontSize}px` }} className="overflow-auto bg-[#282c34]" />
      )}

      {/* Terminal */}
      {hasOutput && (
        <div className={`bg-gray-950 p-4 font-mono text-sm shrink-0 ${isFullscreen ? "max-h-52 overflow-y-auto" : ""}`}>
          <div className="text-gray-500 text-xs mb-2">📤 Résultat</div>

          {lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap leading-relaxed ${
                line.type === "error" ? "text-red-400" :
                line.type === "input-echo" ? "text-yellow-300" :
                "text-gray-100"
              }`}
            >
              {line.text}
            </div>
          ))}

          {inputPrompt !== null && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-yellow-300 whitespace-pre">{inputPrompt}</span>
              <input
                ref={inputFieldRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitInput()}
                className="bg-gray-800 text-white font-mono text-sm px-3 py-1.5 rounded-lg border-2 border-yellow-400 outline-none flex-1"
                placeholder="Tape ta réponse ici..."
              />
              <button
                onClick={submitInput}
                className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors"
              >
                OK ↵
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-500 shrink-0">
        {isMobile ? "Appuie sur ▶ Exécuter pour lancer ton code" : "Ctrl+Entrée pour exécuter • Tab pour indenter"}
        {isFullscreen && <span className="ml-3 text-gray-600">· Échap pour quitter le plein écran</span>}
      </div>
    </div>
  );
}
