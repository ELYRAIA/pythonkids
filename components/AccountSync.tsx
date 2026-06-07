"use client";

import { useState, useEffect } from "react";
import {
  getLinkedAccount, registerAccount, loginAccount, syncAccount, unlinkAccount,
  type LinkedAccount,
} from "@/lib/account";

/**
 * Carte « Sauvegarde en ligne » de la page profil :
 * créer un compte (pseudo + PIN), se connecter depuis un autre appareil,
 * synchroniser manuellement, délier.
 */
export default function AccountSync({ username }: { username: string }) {
  const [account, setAccount] = useState<LinkedAccount | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [nameInput, setNameInput] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [syncedFlash, setSyncedFlash] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setAccount(getLinkedAccount());
  }, []);

  // Pré-remplit le pseudo avec celui du profil dès qu'il est connu (ajustement pendant le rendu)
  const [seenUsername, setSeenUsername] = useState("");
  if (username !== seenUsername) {
    setSeenUsername(username);
    if (!nameInput) setNameInput(username);
  }

  const submit = async () => {
    setError(null);
    const name = nameInput.trim();
    if (name.length < 2) { setError("Choisis un pseudo (2 lettres minimum)"); return; }
    if (!/^\d{4,8}$/.test(pin)) { setError("Le code PIN doit faire 4 à 8 chiffres"); return; }
    setBusy(true);
    const result = mode === "register"
      ? await registerAccount(name, pin)
      : await loginAccount(name, pin);
    setBusy(false);
    if (!result.ok) { setError(result.error); return; }
    if (mode === "login") {
      // La progression serveur vient d'être restaurée : tout recharger
      window.location.reload();
      return;
    }
    setPin("");
    setAccount(getLinkedAccount());
  };

  const manualSync = async () => {
    setBusy(true);
    setError(null);
    const result = await syncAccount();
    setBusy(false);
    if (!result.ok) { setError(result.error); return; }
    setAccount(getLinkedAccount());
    setSyncedFlash(true);
    setTimeout(() => setSyncedFlash(false), 2000);
  };

  const unlink = () => {
    unlinkAccount();
    setAccount(null);
  };

  if (!mounted) return null;

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg relative"
         style={{ background: "linear-gradient(135deg, #0f0c29 0%, #102540 60%, #0f1a26 100%)", border: "1px solid rgba(56,189,248,0.2)" }}>
      <div className="relative z-10 p-5">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          ☁️ Sauvegarde en ligne
        </h2>

        {account ? (
          <>
            <p className="text-xs text-white/50 mt-1">
              Compte <span className="font-bold text-white/80">{account.username}</span> lié — ta progression est sauvegardée automatiquement.
            </p>
            {account.lastSync && (
              <p className="text-[11px] text-white/35 mt-1">
                Dernière synchro : {new Date(account.lastSync).toLocaleString("fr-FR")}
              </p>
            )}
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            <div className="flex gap-2 mt-3">
              <button
                onClick={manualSync}
                disabled={busy}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 text-white"
                style={{ background: syncedFlash ? "rgba(74,222,128,0.25)" : "rgba(56,189,248,0.2)", border: "1px solid rgba(56,189,248,0.4)" }}
              >
                {syncedFlash ? "✓ Synchronisé !" : busy ? "…" : "🔄 Synchroniser maintenant"}
              </button>
              <button
                onClick={unlink}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white/60 transition-all hover:text-white/90 active:scale-95"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                title="Délier ce compte de cet appareil (les données en ligne sont conservées)"
              >
                Délier
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-white/50 mt-1">
              Sauvegarde ta progression et retrouve-la sur n&apos;importe quel appareil avec un pseudo et un code PIN.
            </p>
            <div className="flex gap-1 mt-3 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
              {([["register", "Créer mon compte"], ["login", "J'ai déjà un compte"]] as const).map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === m ? "text-white" : "text-white/40 hover:text-white/70"}`}
                  style={mode === m ? { background: "rgba(56,189,248,0.25)", border: "1px solid rgba(56,189,248,0.4)" } : {}}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Pseudo"
                maxLength={20}
                className="flex-1 bg-slate-800/80 border border-slate-600 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                onKeyDown={(e) => { if (e.key === "Enter") void submit(); }}
                placeholder="Code PIN (4-8 chiffres)"
                className="flex-1 bg-slate-800/80 border border-slate-600 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                onClick={() => void submit()}
                disabled={busy}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                {busy ? "…" : mode === "register" ? "Créer" : "Se connecter"}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            {mode === "register" && (
              <p className="text-[11px] text-white/35 mt-2">
                💡 Choisis un code PIN facile à retenir (et note-le quelque part avec un parent !)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
