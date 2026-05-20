export interface Profile {
  name: string;
  emoji: string;
  createdAt: string;
}

const PROFILES_KEY = "pythonkids_profiles";
const SNAPSHOT_PREFIX = "pythonkids_snapshot_";

// Toutes les clés localStorage spécifiques à un profil (exclut les préférences globales)
const PROFILE_KEYS = [
  "pythonkids_progress",
  "pythonkids_challenges",
  "pythonkids_gems",
  "pythonkids_mastery",
  "pythonkids_streak",
  "pythonkids_streak_freeze",
  "pythonkids_quests",
  "pythonkids_weekly_quests",
  "pythonkids_daily_series",
  "pythonkids_daily_reward",
  "pythonkids_failed_challenges",
  "pythonkids_lessons_today",
  "pythonkids_xp",
  "pythonkids_xp_weekly",
  "pythonkids_chests",
  "pythonkids_chests_given",
  "pythonkids_chest_stars",
  "pythonkids_cosmetics",
  "pythonkids_heads",
  "pythonkids_equipped_cosmetic",
  "pythonkids_equipped_head",
  "pythonkids_shop_owned",
  "pythonkids_equipped_skin",
  "pythonkids_equipped_stickers",
  "pythonkids_owned_themes",
  "pythonkids_color_theme",
];

export function getProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Profile[]) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: Profile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getCurrentProfileName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pythonkids_username");
}

function snapshotProfile(name: string): void {
  const snapshot: Record<string, string> = {};
  for (const key of PROFILE_KEYS) {
    const val = localStorage.getItem(key);
    if (val !== null) snapshot[key] = val;
  }
  localStorage.setItem(SNAPSHOT_PREFIX + name, JSON.stringify(snapshot));
}

function restoreProfile(name: string): void {
  const raw = localStorage.getItem(SNAPSHOT_PREFIX + name);
  for (const key of PROFILE_KEYS) {
    localStorage.removeItem(key);
  }
  if (!raw) return;
  const snapshot = JSON.parse(raw) as Record<string, string>;
  for (const [key, val] of Object.entries(snapshot)) {
    localStorage.setItem(key, val);
  }
}

// Si l'utilisateur courant n'est pas encore dans la liste, l'ajouter automatiquement
export function ensureCurrentProfileListed(): void {
  const name = getCurrentProfileName();
  if (!name) return;
  const profiles = getProfiles();
  if (!profiles.find((p) => p.name === name)) {
    profiles.unshift({ name, emoji: "🐍", createdAt: new Date().toISOString() });
    saveProfiles(profiles);
  }
}

export function addProfile(name: string, emoji: string): boolean {
  const profiles = getProfiles();
  if (profiles.find((p) => p.name.toLowerCase() === name.toLowerCase())) return false;
  profiles.push({ name, emoji, createdAt: new Date().toISOString() });
  saveProfiles(profiles);
  return true;
}

export function switchProfile(name: string): void {
  const current = getCurrentProfileName();
  if (current) snapshotProfile(current);
  restoreProfile(name);
  localStorage.setItem("pythonkids_username", name);
  window.location.href = "/";
}

export function deleteProfile(name: string): void {
  const profiles = getProfiles().filter((p) => p.name !== name);
  saveProfiles(profiles);
  localStorage.removeItem(SNAPSHOT_PREFIX + name);
}
