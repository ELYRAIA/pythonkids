"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getStreak } from "@/lib/streak";
import { calculateScore } from "@/lib/score";
import { getPyodide } from "@/lib/pyodide";
import { getPlayerRank, type Rank } from "@/lib/ranks";
import { playToastSound, playRankUpSound, isAudioEnabled, toggleAudio } from "@/lib/sounds";
import { startSession, endSession } from "@/lib/sessionTime";
import { scheduleSync } from "@/lib/account";

interface Toast {
  id: number;
  msg: string;
  emoji: string;
  type: string;
  exiting: boolean;
}

export default function GlobalUI() {
  const t = useTranslations("GlobalUI");
  const [username, setUsername] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [streakAtRisk, setStreakAtRisk] = useState(false);
  const [rank, setRank] = useState<Rank | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounterRef = useRef(0);
  const [audioOn, setAudioOn] = useState(true);

  const refreshStats = () => {
    const s = getStreak();
    setStreak(s.currentStreak);
    setScore(calculateScore());
    const today = new Date().toISOString().split("T")[0];
    setStreakAtRisk(s.currentStreak > 0 && s.lastPlayDate !== today);
    setRank(getPlayerRank());
  };

  // Filtre le warning dev-only de Next.js 16 / React 19 sur les scripts RSC internes
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const orig = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
      orig(...args);
    };
    return () => { console.error = orig; };
  }, []);

  // useLayoutEffect s'exécute avant le premier rendu navigateur → pas de flash
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("pythonkids_theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    setAudioOn(isAudioEnabled());
    getPyodide().catch(() => {});
    startSession();
    const onUnload = () => endSession();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") endSession();
      else startSession();
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onVisibility);
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      } else {
        // En dev : désinstalle le SW + purge les caches pour éviter de servir d'anciennes versions buggées
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
        if ("caches" in window) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
      }
    }
    const saved = localStorage.getItem("pythonkids_username");
    setUsername(saved);
    refreshStats();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemTheme = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("pythonkids_theme")) {
        setIsDark(e.matches);
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onSystemTheme);


    const onToast = (e: Event) => {
      const { msg, emoji, type } = (e as CustomEvent).detail as { msg: string; emoji: string; type: string };
      const id = ++toastCounterRef.current;
      if (type === "rank") { playRankUpSound(); } else { playToastSound(); }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToasts((t) => [...t, { id, msg, emoji, type, exiting: false }]);
      setTimeout(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToasts((t) => t.map((x) => x.id === id ? { ...x, exiting: true } : x));
        setTimeout(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setToasts((t) => t.filter((x) => x.id !== id));
        }, 350);
      }, 3000);
    };
    window.addEventListener("pythonkids:toast", onToast);

    // Mise à jour temps réel (même onglet)
    window.addEventListener("pythonkids:progress", refreshStats);
    // Sauvegarde en ligne (débouncée) à chaque progression si un compte est lié
    window.addEventListener("pythonkids:progress", scheduleSync);
    scheduleSync();
    // Mise à jour inter-onglets
    window.addEventListener("storage", refreshStats);
    const onAudioToggle = () => setAudioOn(isAudioEnabled());
    window.addEventListener("pythonkids:audio_toggle", onAudioToggle);
    return () => {
      window.removeEventListener("pythonkids:toast", onToast);
      window.removeEventListener("pythonkids:progress", refreshStats);
      window.removeEventListener("pythonkids:progress", scheduleSync);
      window.removeEventListener("storage", refreshStats);
      window.removeEventListener("pythonkids:audio_toggle", onAudioToggle);
      mq.removeEventListener("change", onSystemTheme);
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onVisibility);
      endSession();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  const saveUsername = () => {
    const name = inputVal.trim();
    if (!name) return;
    localStorage.setItem("pythonkids_username", name);
    setUsername(name);
  };

  const startEditName = () => {
    setNameInput(username ?? "");
    setEditingName(true);
  };

  const saveName = () => {
    const name = nameInput.trim();
    if (name) {
      localStorage.setItem("pythonkids_username", name);
      setUsername(name);
    }
    setEditingName(false);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("pythonkids_theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-20 right-4 z-[500] flex flex-col gap-2 items-end pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 shadow-lg transition-all duration-300 ${
                toast.exiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <span className="text-lg">{toast.emoji}</span>
              <span className="text-sm font-bold text-gray-700 dark:text-slate-200 whitespace-nowrap">{toast.msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Modal username — première visite */}
      {username === null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-6xl mb-4">🐍</div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
              {t("welcome_title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-300 mb-6">
              {t("welcome_question")}
            </p>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveUsername()}
              placeholder={t("welcome_placeholder")}
              maxLength={20}
              autoFocus
              className="w-full border-2 border-purple-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-3 text-base outline-none focus:border-purple-500 mb-4"
            />
            <button
              onClick={saveUsername}
              disabled={!inputVal.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-base hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {t("welcome_button")}
            </button>
          </div>
        </div>
      )}

      {/* Flottant bas-gauche */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 flex-wrap max-w-xs">
        {/* Toggle dark mode */}
        <button
          onClick={toggleTheme}
          title={isDark ? t("dark_mode") : t("light_mode")}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
        {/* Toggle sons */}
        <button
          onClick={() => { const next = toggleAudio(); setAudioOn(next); }}
          title={audioOn ? t("sound_on") : t("sound_off")}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform"
        >
          {audioOn ? "🔊" : "🔇"}
        </button>

        {/* Streak */}
        {streak > 0 && (
          <div
            className={`border-2 rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5 transition-colors ${
              streakAtRisk
                ? "bg-orange-50 dark:bg-orange-950/50 border-orange-400 animate-pulse"
                : "bg-white dark:bg-slate-700 border-orange-300"
            }`}
            title={streakAtRisk ? t("streak_continue", { streak }) : streak < 5 ? t("streak_continue", { streak }) : streak < 10 ? t("streak_unstoppable", { streak }) : t("streak_legendary", { streak })}
          >
            <span
              className="text-base"
              style={{ animation: streak >= 3 ? "streak-pulse 1.5s ease-in-out infinite" : undefined }}
            >
              🔥
            </span>
            <span className="text-sm font-bold text-orange-500">{streak}</span>
            {streakAtRisk && (
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">!</span>
            )}
          </div>
        )}

        {/* Score */}
        {score > 0 && (
          <div
            className="bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5"
            title="Ton score total"
          >
            <span className="text-base">⭐</span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-300">
              {score.toLocaleString()}
            </span>
          </div>
        )}

        {/* Pseudo — mode lecture */}
        {username && !editingName && (
          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              title={t("profile_link")}
              className="bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 rounded-2xl px-3 py-1.5 shadow-md flex flex-col hover:border-purple-400 dark:hover:border-purple-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">👤</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{username}</span>
              </div>
              {rank && (
                <span className={`text-[10px] font-semibold ${rank.color} leading-tight`}>
                  {rank.emoji} {rank.title}
                </span>
              )}
            </Link>
            <button
              onClick={startEditName}
              title={t("edit_name")}
              className="w-7 h-7 rounded-full bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 shadow-md flex items-center justify-center text-xs hover:border-purple-400 transition-colors"
            >
              ✏️
            </button>
          </div>
        )}

        {/* Pseudo — mode édition */}
        {editingName && (
          <div className="bg-white dark:bg-slate-700 border-2 border-purple-400 rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
            <span className="text-sm">👤</span>
            <input
              ref={nameInputRef}
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") setEditingName(false);
              }}
              maxLength={20}
              className="w-20 text-sm font-bold text-purple-600 dark:text-purple-300 bg-transparent outline-none"
            />
            <button onClick={saveName} className="text-xs text-green-500 font-bold hover:text-green-600">✓</button>
            <button onClick={() => setEditingName(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}
      </div>
    </>
  );
}
