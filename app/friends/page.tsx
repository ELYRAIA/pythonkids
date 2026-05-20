"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { CHALLENGES } from "@/lib/challenges";
import type { LeaderboardEntry } from "@/app/api/leaderboard/route";
import type { ActivityEvent } from "@/app/api/activity/route";

interface FriendEntry extends LeaderboardEntry {
  rank: number;
}

const ACTIVITY_LABELS: Record<ActivityEvent["type"], { emoji: string; verb: string }> = {
  lesson:    { emoji: "📖", verb: "a terminé une leçon" },
  badge:     { emoji: "🏅", verb: "a obtenu le badge" },
  challenge: { emoji: "🎯", verb: "a réussi le défi" },
  streak:    { emoji: "🔥", verb: "maintient son streak" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

export default function FriendsPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [friendNames, setFriendNames] = useState<string[]>([]);
  const [friendEntries, setFriendEntries] = useState<FriendEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [addInput, setAddInput] = useState("");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [tab, setTab] = useState<"friends" | "activity">("friends");

  // Duel modal state
  const [duelFriend, setDuelFriend] = useState<string | null>(null);
  const [duelChallenge, setDuelChallenge] = useState(CHALLENGES[0].id);
  const [duelLoading, setDuelLoading] = useState(false);
  const [duelCode, setDuelCode] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("pythonkids_username");
    setUsername(name);
    if (!name) { setLoading(false); return; }
    loadAll(name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setDuelFriend(null); setDuelCode(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function loadAll(name: string) {
    setLoading(true);
    try {
      const [friendsRes, lbRes] = await Promise.all([
        fetch(`/api/friends?username=${encodeURIComponent(name)}`),
        fetch("/api/leaderboard"),
      ]);
      const friends: string[] = await friendsRes.json();
      const lb: LeaderboardEntry[] = await lbRes.json();
      const sorted = [...lb].sort((a, b) => b.score - a.score);

      setFriendNames(friends);

      const entries: FriendEntry[] = friends.map((f) => {
        const idx = sorted.findIndex((e) => e.username === f);
        if (idx >= 0) return { ...sorted[idx], rank: idx + 1 };
        return { username: f, score: 0, updatedAt: "", rank: -1 };
      });
      entries.sort((a, b) => b.score - a.score);
      setFriendEntries(entries);

      if (friends.length > 0) {
        const actRes = await fetch(`/api/activity?friends=${friends.map(encodeURIComponent).join(",")}`);
        const act: ActivityEvent[] = await actRes.json();
        setActivities(act);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const friend = addInput.trim();
    if (!friend || !username) return;
    if (friend.toLowerCase() === username.toLowerCase()) {
      setAddError("Tu ne peux pas t'ajouter toi-même !");
      return;
    }
    if (friendNames.map((f) => f.toLowerCase()).includes(friend.toLowerCase())) {
      setAddError("Cet ami est déjà dans ta liste !");
      return;
    }
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", username, friend }),
      });
      if (!res.ok) throw new Error();
      setAddInput("");
      window.dispatchEvent(new CustomEvent("pythonkids:toast", {
        detail: { msg: `${friend} ajouté à tes amis !`, emoji: "👥", type: "normal" },
      }));
      await loadAll(username);
    } catch {
      setAddError("Erreur lors de l'ajout.");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemove(friend: string) {
    if (!username) return;
    await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", username, friend }),
    });
    await loadAll(username);
  }

  async function startDuel() {
    if (!username || !duelFriend) return;
    setDuelLoading(true);
    try {
      const res = await fetch("/api/duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", username, challengeId: duelChallenge }),
      });
      const room = await res.json();
      setDuelCode(room.roomId);
    } catch {
      setDuelCode(null);
    } finally {
      setDuelLoading(false);
    }
  }

  if (!username) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Crée un pseudo pour accéder aux amis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">Mes amis 👥</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Tes amis sur d'autres appareils</p>
        </div>

        {/* Add friend */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 p-4 mb-6 shadow-sm">
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Ajouter un ami par pseudo
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={addInput}
              onChange={(e) => { setAddInput(e.target.value); setAddError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Pseudo exact de l'ami…"
              maxLength={20}
              className="flex-1 border-2 border-purple-200 dark:border-slate-600 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-purple-400 dark:bg-slate-700 dark:text-white"
            />
            <button
              onClick={handleAdd}
              disabled={addLoading || !addInput.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {addLoading ? "…" : "Ajouter"}
            </button>
          </div>
          {addError && <p className="text-red-500 text-xs mt-1">{addError}</p>}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["friends", "activity"] as const).map((t) => {
            const labels = { friends: "👥 Amis", activity: "⚡ Activité" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  tab === t
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-white dark:bg-slate-800 border-purple-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-purple-400"
                }`}
              >
                {labels[t]}
                {t === "activity" && activities.length > 0 && (
                  <span className="ml-1.5 bg-orange-500 text-white rounded-full px-1.5 text-[10px]">
                    {activities.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-5 py-4">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-32 rounded" />
                  <div className="skeleton h-3 w-48 rounded" />
                </div>
                <div className="skeleton h-8 w-20 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        ) : tab === "friends" ? (
          friendEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🙈</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                Aucun ami pour l'instant. Ajoute le pseudo d'un ami !
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-purple-50 dark:border-slate-700 overflow-hidden shadow-sm">
              {friendEntries.map((entry) => (
                <div
                  key={entry.username}
                  className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 dark:border-slate-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {entry.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                      {entry.username}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-slate-500">
                      {entry.rank > 0 ? `Rang #${entry.rank} · ${entry.score.toLocaleString()} pts` : "Pas encore dans le classement"}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setDuelFriend(entry.username);
                        setDuelCode(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      ⚔️ Défier
                    </button>
                    <button
                      onClick={() => handleRemove(entry.username)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 text-xs hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">😴</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                Aucune activité récente de tes amis.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activities.map((event, i) => {
                const label = ACTIVITY_LABELS[event.type];
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-purple-50 dark:border-slate-700 px-4 py-3 flex items-center gap-3 shadow-sm"
                  >
                    <span className="text-2xl shrink-0">{label.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-gray-800 dark:text-white">{event.username}</span>
                      <span className="text-sm text-gray-500 dark:text-slate-400"> {label.verb} </span>
                      {event.type !== "streak" && (
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 truncate">
                          {event.detail}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">
                      {timeAgo(event.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Local profiles link */}
        <div className="mt-10 text-center">
          <Link
            href="/profiles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            👤 Changer de profil (même appareil)
          </Link>
        </div>
      </div>

      {/* Duel modal */}
      {duelFriend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            {!duelCode ? (
              <>
                <h2 className="text-lg font-extrabold text-gray-800 dark:text-white mb-1">
                  ⚔️ Défier {duelFriend}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                  Crée un duel, puis partage le code à ton ami
                </p>
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                  Choisis un défi
                </label>
                <select
                  value={duelChallenge}
                  onChange={(e) => setDuelChallenge(e.target.value)}
                  className="w-full border-2 border-purple-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 mb-4"
                >
                  {CHALLENGES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.title}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDuelFriend(null)}
                    className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-sm font-bold text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={startDuel}
                    disabled={duelLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
                  >
                    {duelLoading ? "⏳ Création…" : "Créer le duel"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-4xl mb-3">🎉</p>
                  <h2 className="text-lg font-extrabold text-gray-800 dark:text-white mb-1">
                    Duel créé !
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                    Partage ce code à <strong>{duelFriend}</strong>
                  </p>
                  <div className="bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-700 rounded-2xl py-4 px-6 mb-4">
                    <p className="text-4xl font-mono font-black tracking-widest text-purple-700 dark:text-purple-300">
                      {duelCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDuelFriend(null)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-sm font-bold text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => router.push(`/duel/${duelCode}`)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90"
                    >
                      Rejoindre ⚔️
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
