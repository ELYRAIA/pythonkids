import { PROFILE_KEYS } from "./profiles";

/**
 * Compte en ligne : lie le profil local à un compte serveur (pseudo + PIN)
 * et synchronise la progression (snapshot des clés localStorage du profil).
 *
 * Le PIN est conservé en localStorage pour signer les synchronisations —
 * acceptable pour cette plateforme (pas de donnée sensible, anti-bruteforce serveur).
 */

const ACCOUNT_KEY = "pythonkids_account";

export interface LinkedAccount {
  username: string;
  pin: string;
  lastSync: string | null;
}

export function getLinkedAccount(): LinkedAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as LinkedAccount) : null;
  } catch {
    return null;
  }
}

function saveLinkedAccount(account: LinkedAccount): void {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

/** Délie le compte localement (les données serveur restent intactes). */
export function unlinkAccount(): void {
  localStorage.removeItem(ACCOUNT_KEY);
}

// Le snapshot envoyé au serveur : tout le profil sauf le compte lui-même (contient le PIN)
const SYNC_KEYS = PROFILE_KEYS.filter((k) => k !== ACCOUNT_KEY);

function collectSnapshot(): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const key of SYNC_KEYS) {
    const val = localStorage.getItem(key);
    if (val !== null) snapshot[key] = val;
  }
  return snapshot;
}

function applySnapshot(data: Record<string, string>): void {
  for (const key of SYNC_KEYS) {
    localStorage.removeItem(key);
  }
  for (const [key, val] of Object.entries(data)) {
    if ((SYNC_KEYS as readonly string[]).includes(key)) localStorage.setItem(key, val);
  }
}

async function post(payload: object): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
  const res = await fetch("/api/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, body };
}

/** Crée un compte serveur avec la progression locale actuelle, puis le lie. */
export async function registerAccount(username: string, pin: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { ok, body } = await post({ action: "register", username, pin, data: collectSnapshot() });
  if (!ok) return { ok: false, error: String(body.error ?? "Erreur serveur") };
  saveLinkedAccount({ username, pin, lastSync: new Date().toISOString() });
  return { ok: true };
}

/**
 * Se connecte à un compte existant : restaure la progression serveur
 * dans le profil local et lie le compte. Recharger la page ensuite.
 */
export async function loginAccount(username: string, pin: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { ok, body } = await post({ action: "login", username, pin });
  if (!ok) return { ok: false, error: String(body.error ?? "Erreur serveur") };
  applySnapshot((body.data ?? {}) as Record<string, string>);
  localStorage.setItem("pythonkids_username", String(body.username ?? username));
  saveLinkedAccount({ username: String(body.username ?? username), pin, lastSync: new Date().toISOString() });
  return { ok: true };
}

/** Envoie la progression locale vers le serveur. */
export async function syncAccount(): Promise<{ ok: true } | { ok: false; error: string }> {
  const account = getLinkedAccount();
  if (!account) return { ok: false, error: "Aucun compte lié" };
  const { ok, body } = await post({
    action: "sync",
    username: account.username,
    pin: account.pin,
    data: collectSnapshot(),
  });
  if (!ok) return { ok: false, error: String(body.error ?? "Erreur serveur") };
  saveLinkedAccount({ ...account, lastSync: new Date().toISOString() });
  return { ok: true };
}

// ── Synchronisation automatique (déclenchée par GlobalUI) ──────────────────

let syncTimer: ReturnType<typeof setTimeout> | null = null;

/** Programme une synchro dans 15 s (débouncée) si un compte est lié. */
export function scheduleSync(): void {
  if (typeof window === "undefined" || !getLinkedAccount()) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    void syncAccount();
  }, 15_000);
}
