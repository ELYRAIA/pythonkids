"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CHALLENGES } from "@/lib/challenges";
import { getPyodide } from "@/lib/pyodide";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab, historyKeymap, history } from "@codemirror/commands";
import { playChallengeWinSound, playErrorSound } from "@/lib/sounds";
import { addXP } from "@/lib/xp";
import { postActivity } from "@/lib/activity";
import type { DuelRoom } from "@/app/api/duel/route";
import Confetti from "@/components/Confetti";
import { useIsMobile } from "@/lib/useIsMobile";
import { parsePythonError } from "@/lib/pythonErrors";

export default function DuelRoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const roomId = params.roomId;

  const [room, setRoom] = useState<DuelRoom | null>(null);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [actualOutput, setActualOutput] = useState("");
  const [pyodideReady, setPyodideReady] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);

  const codeRef = useRef<string>("");
  const pyodideRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<() => void>(() => {});
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rewardedRef = useRef(false);
  const prevTheysolvedRef = useRef(false);
  const isMobile = useIsMobile();
  const [mobileCode, setMobileCode] = useState("");

  const challenge = room ? CHALLENGES.find((c) => c.id === room.challengeId) : null;

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/duel?roomId=${roomId}`);
      if (!res.ok) { setError("Room introuvable."); return; }
      const data: DuelRoom = await res.json();
      setRoom(data);
    } catch { /* ignore */ }
  }, [roomId]);

  useEffect(() => {
    const name = localStorage.getItem("pythonkids_username") ?? "";
    setUsername(name);
    fetchRoom();

    pollingRef.current = setInterval(fetchRoom, 2000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchRoom]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (challenge) { codeRef.current = challenge.starterCode; setMobileCode(challenge.starterCode); }
  }, [challenge?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // CodeMirror
  useEffect(() => {
    if (!editorContainerRef.current || !challenge || isMobile) return;
    codeRef.current = challenge.starterCode;
    const runCmd = () => { runRef.current(); return true; };
    const view = new EditorView({
      state: EditorState.create({
        doc: challenge.starterCode,
        extensions: [
          history(), lineNumbers(), python(), oneDark,
          EditorView.theme({
            "&": { fontSize: "14px", fontFamily: "monospace" },
            ".cm-content": { padding: "12px" },
            ".cm-gutters": { backgroundColor: "#1a1b26", borderRight: "1px solid #2d2e3a" },
          }),
          EditorView.lineWrapping,
          keymap.of([
            { key: "Ctrl-Enter", run: runCmd }, { key: "Mod-Enter", run: runCmd },
            indentWithTab, ...defaultKeymap, ...historyKeymap,
          ]),
          EditorView.updateListener.of((u) => { if (u.docChanged) codeRef.current = u.state.doc.toString(); }),
        ],
      }),
      parent: editorContainerRef.current,
    });
    return () => view.destroy();
  }, [challenge]);

  useEffect(() => {
    getPyodide()
      .then((py) => { pyodideRef.current = py; setPyodideReady(true); })
      .catch(() => {});
  }, []);

  const me = room?.players.find((p) => p.username === username);
  const opponent = room?.players.find((p) => p.username !== username);
  const iSolved = me?.status === "solved";
  const theySolved = opponent?.status === "solved";
  const iWon = iSolved && !theySolved && (room?.players.length ?? 0) >= 2;
  const iLost = (theySolved ?? false) && !iSolved;
  const bothSolved = iSolved && (theySolved ?? false);

  // Arrêter le timer quand la partie est terminée
  useEffect(() => {
    if ((iSolved || theySolved) && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [iSolved, theySolved]);

  // Récompenser la victoire + toast défaite
  useEffect(() => {
    if (theySolved && !prevTheysolvedRef.current && !iSolved) {
      playErrorSound();
      window.dispatchEvent(new CustomEvent("pythonkids:toast", {
        detail: { msg: "Ton adversaire a résolu en premier !", emoji: "😅", type: "normal" },
      }));
    }
    prevTheysolvedRef.current = theySolved ?? false;

    if (iWon && !rewardedRef.current) {
      rewardedRef.current = true;
      addXP(150);
      window.dispatchEvent(new CustomEvent("pythonkids:toast", {
        detail: { msg: "Duel gagné ! +150 XP", emoji: "🏆", type: "rank" },
      }));
      postActivity("challenge", "Duel gagné ⚔️");
    }
  }, [iWon, iSolved, theySolved]);

  const runTests = async () => {
    if (!pyodideRef.current || !challenge) return;
    setStatus("running");
    setActualOutput("");
    try {
      const py = pyodideRef.current;
      let output = "";
      py.setStdout({ batched: (t: string) => { output += (output ? "\n" : "") + t; } });
      py.setStderr({ batched: () => {} });
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("⏱️ Temps dépassé (5s). Boucle infinie ?")), 5000)
      );
      await Promise.race([py.runPythonAsync(codeRef.current), timeout]);
      const normalise = (s: string) => s.replace(/\r\n/g, "\n").trim();
      const pass = normalise(output) === normalise(challenge.expectedOutput);
      setActualOutput(output);
      if (pass) {
        setStatus("success");
        playChallengeWinSound();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 100);
        // Notifier le serveur
        await fetch("/api/duel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "solve", roomId, username }),
        });
        fetchRoom();
      } else {
        setStatus("error");
        playErrorSound();
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || "Erreur";
      setActualOutput(msg.startsWith("⏱️") ? msg : parsePythonError(msg));
      setStatus("error");
      playErrorSound();
    }
  };
  runRef.current = runTests;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-4xl mb-4">😕</p>
      <p className="text-gray-600 dark:text-slate-400 mb-6">{error}</p>
      <Link href="/duel" className="text-purple-600 font-bold hover:underline">← Retour aux duels</Link>
    </div>
  );

  if (!room || !challenge) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Chargement du duel…</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Confetti active={confetti} />

      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-purple-100 dark:border-slate-700 sticky top-0 z-50">
        <div className="w-full px-6 py-3 flex items-center gap-3">
          <Link href="/duel" className="text-gray-500 dark:text-slate-400 hover:text-purple-600 text-sm font-medium">
            ← Duels
          </Link>
          <span className="text-gray-300 dark:text-slate-600">|</span>
          <span className="text-base font-bold text-gray-800 dark:text-white">⚔️ Duel #{roomId}</span>
          <span className="ml-auto font-mono text-sm text-gray-500 dark:text-slate-400">⏱ {formatTime(elapsed)}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Status joueurs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { player: me, label: "Toi", isMe: true },
            { player: opponent, label: opponent?.username ?? "En attente…", isMe: false },
          ].map(({ player, label, isMe }) => (
            <div
              key={label}
              className={`rounded-2xl p-4 border-2 text-center ${
                player?.status === "solved"
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : isMe
                  ? "border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700"
                  : "border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
              }`}
            >
              <div className="text-2xl mb-1">
                {player?.status === "solved" ? "🏆" : isMe ? "👤" : player ? "🎮" : "⏳"}
              </div>
              <div className={`font-bold text-sm ${isMe ? "text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-slate-300"}`}>
                {isMe ? (username || "Toi") : label}
              </div>
              <div className={`text-xs mt-1 ${
                player?.status === "solved" ? "text-green-600 dark:text-green-400 font-bold" :
                player ? "text-gray-400 dark:text-slate-500" : "text-gray-300 animate-pulse"
              }`}>
                {player?.status === "solved" ? "✓ Résolu !" : player ? "En train de coder…" : "Attend un adversaire"}
              </div>
            </div>
          ))}
        </div>

        {/* Résultat final */}
        {(iWon || iLost || bothSolved) && (
          <div className={`rounded-2xl p-5 mb-6 text-center border-2 ${
            iWon ? "border-green-300 bg-green-50 dark:bg-green-900/20" : "border-orange-300 bg-orange-50 dark:bg-orange-900/20"
          }`}>
            <p className="text-4xl mb-2">{iWon ? "🏆" : bothSolved ? "🤝" : "😅"}</p>
            <p className="font-extrabold text-xl text-gray-800 dark:text-white">
              {iWon ? "Tu as gagné le duel !" : bothSolved ? "Égalité !" : "Ton adversaire a gagné…"}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {iWon ? "Bravo ! +150 XP" : bothSolved ? "Vous avez résolu en même temps !" : "Bien tenté, réessaie !"}
            </p>
            <div className="flex gap-3 mt-4 justify-center">
              <Link
                href="/duel"
                className="px-5 py-2 rounded-full border-2 border-gray-200 dark:border-slate-600 text-sm font-bold text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                ← Retour
              </Link>
              <Link
                href="/duel"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Rejouer ⚔️
              </Link>
            </div>
          </div>
        )}

        {/* Partage du code de room */}
        {room.players.length < 2 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              En attente d&apos;un adversaire… Partage ce code !
            </p>
            <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400 tracking-widest mb-3">
              {roomId}
            </div>
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              {copied ? "✓ Lien copié !" : "📋 Copier le lien"}
            </button>
          </div>
        )}

        {/* Défi */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-purple-50 dark:border-slate-700 p-5 mb-5">
          <h2 className="font-extrabold text-gray-800 dark:text-white mb-2">
            {challenge.emoji} {challenge.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 whitespace-pre-line mb-3">{challenge.description}</p>
          <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
            <p className="text-xs text-gray-400 mb-1">Sortie attendue :</p>
            <pre className="text-sm font-mono text-green-700 dark:text-green-400 whitespace-pre-wrap">{challenge.expectedOutput}</pre>
          </div>
        </div>

        {/* Éditeur */}
        <div className="rounded-2xl overflow-hidden border-2 border-purple-200 shadow-lg mb-4">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-gray-400 text-xs font-mono">solution.py</span>
            <div className="flex items-center gap-3">
              {!pyodideReady && <span className="text-yellow-400 text-xs animate-pulse">⏳ Chargement…</span>}
              <button
                onClick={runTests}
                disabled={!pyodideReady || status === "running" || iSolved}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {status === "running" ? "⏳ Test…" : iSolved ? "✓ Résolu !" : "▶ Tester"}
              </button>
            </div>
          </div>
          {isMobile ? (
            <textarea
              value={mobileCode}
              onChange={(e) => { setMobileCode(e.target.value); codeRef.current = e.target.value; }}
              style={{ height: "260px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6" }}
              className="w-full bg-[#282c34] text-gray-100 p-3 resize-none outline-none"
              spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
            />
          ) : (
            <div ref={editorContainerRef} style={{ height: "260px" }} className="overflow-auto bg-[#282c34]" />
          )}
          <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-500">
            {isMobile ? "Appuie sur ▶ Tester" : "Ctrl+Entrée pour tester"}
          </div>
        </div>

        {/* Résultat du test */}
        {status !== "idle" && (
          <div className={`rounded-xl p-4 border-2 ${
            status === "success" ? "border-green-300 bg-green-50 dark:bg-green-900/20" :
            status === "error" ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-gray-200"
          }`}>
            {status === "success" && (
              <p className="font-bold text-green-700 dark:text-green-400 text-sm text-center">🎉 Bonne réponse !</p>
            )}
            {status === "error" && (
              <div>
                <p className="font-bold text-red-600 dark:text-red-400 text-sm mb-2">❌ Pas encore…</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <p className="text-gray-500 mb-1">Ta sortie :</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-red-700 dark:text-red-400 whitespace-pre-wrap">{actualOutput || "(rien)"}</pre>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Attendu :</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-green-700 dark:text-green-400 whitespace-pre-wrap">{challenge.expectedOutput}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
