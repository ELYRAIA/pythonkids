"use client";

import { useEffect, useRef, useState } from "react";

const HEARTBEAT_INTERVAL = 30_000;
const ACTIVITY_INTERVAL  = 4_500;
const BASE_COUNT = 2; // plancher pour ne jamais afficher 0 ou 1

const ACTIVITIES = [
  { name: "Yasmine", action: "résout un défi Python 🐍" },
  { name: "Lucas",   action: "vient d'ouvrir un coffre ✨" },
  { name: "Emma",    action: "apprend les boucles 🔄" },
  { name: "Théo",    action: "gagne un duel ⚔️" },
  { name: "Léa",     action: "complète une série 🔥" },
  { name: "Noah",    action: "débloque un achievement 🏆" },
  { name: "Chloé",   action: "achète un skin légendaire 💎" },
  { name: "Axel",    action: "code son Robot 🤖" },
  { name: "Jade",    action: "monte au classement 📈" },
  { name: "Romain",  action: "finit une leçon ✅" },
  { name: "Inès",    action: "enchaîne 7 jours de streak 🔥" },
  { name: "Mattéo",  action: "bat son record de XP ⚡" },
];

const AVATAR_COLORS = [
  "from-pink-400 to-rose-500",
  "from-violet-400 to-purple-500",
  "from-teal-400 to-cyan-500",
  "from-orange-400 to-amber-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-green-500",
];

function getSessionId(): string {
  const key = "pk_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function hashName(name: string): number {
  return [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
}

export default function OnlineCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [activityIdx, setActivityIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(true);
  const sessionId = useRef<string | null>(null);

  async function heartbeat() {
    if (!sessionId.current) return;
    try {
      const res = await fetch("/api/online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current }),
      });
      if (res.ok) {
        const data = await res.json() as { count: number };
        setCount(data.count);
      }
    } catch {
      // réseau indisponible
    }
  }

  useEffect(() => {
    sessionId.current = getSessionId();
    heartbeat();
    const heartbeatTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL);

    // Rotation des messages d'activité avec fondu
    const activityTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActivityIdx(i => (i + 1) % ACTIVITIES.length);
        setFade(true);
      }, 300);
    }, ACTIVITY_INTERVAL);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(activityTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (count === null || !visible) return null;

  const displayCount = Math.max(count, BASE_COUNT + 1);
  const activity = ACTIVITIES[activityIdx];
  const avatarColor = AVATAR_COLORS[hashName(activity.name) % AVATAR_COLORS.length];
  const initials = activity.name.slice(0, 1);

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 px-3 py-2.5 flex flex-col gap-1.5 min-w-[200px] max-w-[240px]">

        {/* Bouton fermer */}
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-slate-300 text-[10px] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors pointer-events-auto"
          aria-label="Fermer"
        >
          ×
        </button>

        {/* Ligne compteur */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-extrabold text-gray-700 dark:text-slate-200">
            {displayCount} joueur{displayCount > 1 ? "s" : ""} actif{displayCount > 1 ? "s" : ""}
          </span>
        </div>

        {/* Ligne activité en rotation */}
        <div
          className="flex items-center gap-2 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          <div className={`shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-[10px] font-extrabold text-white shadow-sm`}>
            {initials}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">
            <span className="font-bold text-gray-700 dark:text-slate-200">{activity.name}</span>{" "}
            {activity.action}
          </p>
        </div>
      </div>
    </div>
  );
}
