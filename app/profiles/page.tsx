"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getProfiles,
  getCurrentProfileName,
  ensureCurrentProfileListed,
  addProfile,
  switchProfile,
  deleteProfile,
  type Profile,
} from "@/lib/profiles";

const EMOJIS = ["🐍", "🦊", "🐼", "🦁", "🐸", "🦉", "🐧", "🐬", "🦄", "🐉", "🤖", "🦸", "🧙", "👾", "🚀", "🎮", "🐯", "🦝"];

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🐍");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ensureCurrentProfileListed();
    setProfiles(getProfiles());
    setCurrentName(getCurrentProfileName());
  }, []);

  function handleAdd() {
    const name = newName.trim();
    if (name.length < 2) {
      setError("Pseudo trop court (min 2 caractères)");
      return;
    }
    if (!addProfile(name, newEmoji)) {
      setError("Ce pseudo existe déjà !");
      return;
    }
    setProfiles(getProfiles());
    setAdding(false);
    setNewName("");
    setNewEmoji("🐍");
    setError("");
  }

  function handleSwitch(profile: Profile) {
    if (editMode) return;
    if (profile.name === currentName) {
      window.location.href = "/";
      return;
    }
    switchProfile(profile.name);
  }

  function handleDelete(name: string) {
    deleteProfile(name);
    setProfiles(getProfiles());
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Link href="/" className="absolute top-6 left-6 text-sm text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
        ← Retour
      </Link>

      <div className="text-5xl mb-4">🐍</div>
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Qui joue ?</h1>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-10">
        Choisis ton profil pour continuer
      </p>

      <div className="flex flex-wrap justify-center gap-5 mb-8 max-w-2xl">
        {profiles.map((profile) => {
          const isActive = profile.name === currentName;
          return (
            <div key={profile.name} className="relative">
              <button
                onClick={() => handleSwitch(profile)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl transition-all w-28 cursor-pointer ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-400 shadow-md"
                    : "bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:scale-105 hover:bg-purple-50 dark:hover:bg-slate-700"
                }`}
              >
                <div className="text-5xl">{profile.emoji}</div>
                <span
                  className={`text-sm font-bold truncate w-full text-center ${
                    isActive ? "text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-white"
                  }`}
                >
                  {profile.name}
                </span>
                {isActive && (
                  <span className="text-xs text-purple-500 dark:text-purple-400 font-semibold">✓ Actif</span>
                )}
              </button>

              {editMode && !isActive && (
                <button
                  onClick={() => handleDelete(profile.name)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 flex items-center justify-center shadow"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {!editMode && (
          <button
            onClick={() => setAdding(true)}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl w-28 bg-white dark:bg-slate-800 border-2 border-dashed border-purple-200 dark:border-slate-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <div className="text-4xl text-purple-300 dark:text-slate-500">+</div>
            <span className="text-sm font-semibold text-gray-400 dark:text-slate-500">Ajouter</span>
          </button>
        )}
      </div>

      {profiles.length > 1 && (
        <button
          onClick={() => setEditMode((v) => !v)}
          className="text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors underline"
        >
          {editMode ? "✓ Terminé" : "Gérer les profils"}
        </button>
      )}

      {adding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-extrabold text-gray-800 dark:text-white mb-4 text-center">
              Nouveau profil
            </h2>

            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2 font-semibold uppercase tracking-wide text-center">
              Choisis un emoji
            </p>
            <div className="flex flex-wrap gap-2 mb-5 justify-center">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  className={`text-2xl p-1.5 rounded-xl transition-all ${
                    newEmoji === e
                      ? "bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-400 scale-110"
                      : "hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Prénom ou pseudo…"
              maxLength={20}
              autoFocus
              className="w-full border-2 border-purple-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-purple-400 dark:bg-slate-700 dark:text-white mb-1"
            />
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setAdding(false);
                  setError("");
                  setNewName("");
                }}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-sm font-bold text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={newName.trim().length < 2}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Créer le profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
