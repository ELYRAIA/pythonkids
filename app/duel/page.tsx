"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { CHALLENGES } from "@/lib/challenges";

export default function DuelPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGES[0].id);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem("pythonkids_username") ?? "";
    setUsername(name);
  }, []);

  const createRoom = async () => {
    if (!username) { setError("Tu dois avoir un pseudo pour jouer en duel !"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", username, challengeId: selectedChallenge }),
      });
      const room = await res.json();
      router.push(`/duel/${room.roomId}`);
    } catch {
      setError("Erreur lors de la création du duel.");
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!username) { setError("Tu dois avoir un pseudo pour jouer en duel !"); return; }
    if (!joinCode.trim()) { setError("Entre un code de duel."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", username, roomId: joinCode.trim().toUpperCase() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur");
        setLoading(false);
        return;
      }
      router.push(`/duel/${joinCode.trim().toUpperCase()}`);
    } catch {
      setError("Erreur lors de la connexion au duel.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Mode Duel</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Affronte un ami en temps réel sur le même défi Python !
          </p>
          {username && (
            <p className="text-sm text-purple-600 dark:text-purple-400 font-bold mt-2">
              Tu joues en tant que : {username}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            ❌ {error}
          </div>
        )}

        <div className="grid gap-6">
          {/* Créer un duel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-purple-100 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              🆕 Créer un duel
            </h2>
            <div className="mb-4">
              <label className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-2 block">
                Choisis un défi
              </label>
              <select
                value={selectedChallenge}
                onChange={(e) => setSelectedChallenge(e.target.value)}
                className="w-full border-2 border-purple-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500"
              >
                {CHALLENGES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.title} ({c.difficulty})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={createRoom}
              disabled={loading || !username}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "⏳ Création..." : "Créer le duel ⚔️"}
            </button>
          </div>

          {/* Rejoindre un duel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-orange-100 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              🔗 Rejoindre un duel
            </h2>
            <div className="mb-4">
              <label className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-2 block">
                Code du duel
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Ex : AB1C2D"
                maxLength={6}
                className="w-full border-2 border-orange-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-orange-400 uppercase tracking-widest"
              />
            </div>
            <button
              onClick={joinRoom}
              disabled={loading || !username || !joinCode.trim()}
              className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "⏳ Connexion..." : "Rejoindre ⚔️"}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-xs text-blue-700 dark:text-blue-300">
          <p className="font-bold mb-1">Comment ça marche ?</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-600 dark:text-blue-400">
            <li>Crée un duel et partage le code à ton ami</li>
            <li>Ton ami rejoint avec le code</li>
            <li>Vous codez la solution du même défi en même temps</li>
            <li>Le premier à réussir les tests gagne ! 🏆</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
