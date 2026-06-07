import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readData, updateData } from "@/lib/serverStorage";
import { isValidUsername } from "@/lib/usernames";

/**
 * Comptes joueurs : pseudo + code PIN (hashé scrypt), avec sauvegarde
 * de la progression (snapshot des clés localStorage du profil).
 *
 * Anti-bruteforce : verrouillage du compte 15 min après 10 PIN erronés.
 */

const FILE = "accounts.json";
const PIN_RE = /^\d{4,8}$/;
const MAX_SNAPSHOT_BYTES = 256 * 1024;
const MAX_FAILED_ATTEMPTS = 10;
const LOCK_MS = 15 * 60 * 1000;

interface Account {
  username: string; // casse d'affichage
  pinHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
  failedAttempts: number;
  lockedUntil: string | null;
  data: Record<string, string>;
}

// Clé = pseudo en minuscules (unicité insensible à la casse)
type Accounts = Record<string, Account>;

function hashPin(pin: string, salt: string): string {
  return scryptSync(pin, salt, 32).toString("hex");
}

function pinMatches(pin: string, account: Account): boolean {
  const candidate = Buffer.from(hashPin(pin, account.salt), "hex");
  const stored = Buffer.from(account.pinHash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

function isLocked(account: Account): boolean {
  return account.lockedUntil !== null && new Date(account.lockedUntil).getTime() > Date.now();
}

function isValidSnapshot(data: unknown): data is Record<string, string> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const entries = Object.entries(data);
  if (!entries.every(([k, v]) => k.startsWith("pythonkids_") && typeof v === "string")) return false;
  return JSON.stringify(data).length <= MAX_SNAPSHOT_BYTES;
}

export async function POST(request: Request) {
  const body = await request.json() as {
    action?: "register" | "login" | "sync";
    username?: string;
    pin?: string;
    data?: unknown;
  };

  if (!isValidUsername(body.username) || typeof body.pin !== "string" || !PIN_RE.test(body.pin)) {
    return Response.json({ error: "Pseudo ou code PIN invalide" }, { status: 400 });
  }
  const username = body.username;
  const pin = body.pin;
  const key = username.toLowerCase();

  if (body.action === "register") {
    const data = body.data === undefined ? {} : body.data;
    if (!isValidSnapshot(data)) {
      return Response.json({ error: "Données invalides" }, { status: 400 });
    }
    let created = false;
    await updateData<Accounts>(FILE, {}, (accounts) => {
      if (accounts[key]) return accounts;
      const salt = randomBytes(16).toString("hex");
      const now = new Date().toISOString();
      accounts[key] = {
        username,
        pinHash: hashPin(pin, salt),
        salt,
        createdAt: now,
        updatedAt: now,
        failedAttempts: 0,
        lockedUntil: null,
        data,
      };
      created = true;
      return accounts;
    });
    if (!created) return Response.json({ error: "Ce pseudo a déjà un compte" }, { status: 409 });
    return Response.json({ ok: true });
  }

  if (body.action === "login") {
    let result: { status: number; payload: unknown } = { status: 500, payload: { error: "Erreur" } };
    await updateData<Accounts>(FILE, {}, (accounts) => {
      const account = accounts[key];
      if (!account) {
        result = { status: 404, payload: { error: "Compte introuvable" } };
        return accounts;
      }
      if (isLocked(account)) {
        result = { status: 429, payload: { error: "Trop d'essais — réessaie dans 15 minutes" } };
        return accounts;
      }
      if (!pinMatches(pin, account)) {
        account.failedAttempts += 1;
        if (account.failedAttempts >= MAX_FAILED_ATTEMPTS) {
          account.lockedUntil = new Date(Date.now() + LOCK_MS).toISOString();
          account.failedAttempts = 0;
        }
        result = { status: 401, payload: { error: "Code PIN incorrect" } };
        return accounts;
      }
      account.failedAttempts = 0;
      account.lockedUntil = null;
      result = {
        status: 200,
        payload: { ok: true, username: account.username, data: account.data, updatedAt: account.updatedAt },
      };
      return accounts;
    });
    return Response.json(result.payload, { status: result.status });
  }

  if (body.action === "sync") {
    if (!isValidSnapshot(body.data)) {
      return Response.json({ error: "Données invalides" }, { status: 400 });
    }
    const data = body.data;
    let result: { status: number; payload: unknown } = { status: 500, payload: { error: "Erreur" } };
    await updateData<Accounts>(FILE, {}, (accounts) => {
      const account = accounts[key];
      if (!account) {
        result = { status: 404, payload: { error: "Compte introuvable" } };
        return accounts;
      }
      if (isLocked(account)) {
        result = { status: 429, payload: { error: "Trop d'essais — réessaie dans 15 minutes" } };
        return accounts;
      }
      if (!pinMatches(pin, account)) {
        account.failedAttempts += 1;
        if (account.failedAttempts >= MAX_FAILED_ATTEMPTS) {
          account.lockedUntil = new Date(Date.now() + LOCK_MS).toISOString();
          account.failedAttempts = 0;
        }
        result = { status: 401, payload: { error: "Code PIN incorrect" } };
        return accounts;
      }
      account.failedAttempts = 0;
      account.data = data;
      account.updatedAt = new Date().toISOString();
      result = { status: 200, payload: { ok: true, updatedAt: account.updatedAt } };
      return accounts;
    });
    return Response.json(result.payload, { status: result.status });
  }

  return Response.json({ error: "Action inconnue" }, { status: 400 });
}

/** Vérifie si un pseudo a déjà un compte (pour l'UI). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!isValidUsername(username)) {
    return Response.json({ error: "Pseudo invalide" }, { status: 400 });
  }
  const accounts = await readData<Accounts>(FILE, {});
  return Response.json({ exists: Boolean(accounts[username.toLowerCase()]) });
}
