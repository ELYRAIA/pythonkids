import { getProgress, saveProgress } from "./progress";
import { notifyProgress } from "./events";
import { spendGems } from "./gems";

export interface StreakData {
  currentStreak: number;
  lastPlayDate: string; // "YYYY-MM-DD"
  longestStreak: number;
  playDates?: string[]; // dernières dates jouées "YYYY-MM-DD", max 30
}

const KEY = "pythonkids_streak";

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getStreak(): StreakData {
  if (typeof window === "undefined") return { currentStreak: 0, lastPlayDate: "", longestStreak: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { currentStreak: 0, lastPlayDate: "", longestStreak: 0 };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { currentStreak: 0, lastPlayDate: "", longestStreak: 0 };
  }
}

const FREEZE_KEY = "pythonkids_streak_freeze";

export function getStreakFreezeCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(FREEZE_KEY) ?? "0");
}

export function addStreakFreeze(count: number = 1): void {
  const cur = getStreakFreezeCount();
  localStorage.setItem(FREEZE_KEY, String(cur + count));
}

function consumeStreakFreeze(): boolean {
  const cur = getStreakFreezeCount();
  if (cur <= 0) return false;
  localStorage.setItem(FREEZE_KEY, String(cur - 1));
  return true;
}

export function buyStreakFreeze(): boolean {
  if (!spendGems(50)) return false;
  addStreakFreeze();
  return true;
}

/** Met à jour le streak et retourne les nouveaux badges gagnés. */
export function updateStreak(): string[] {
  const data = getStreak();
  const today = todayStr();

  if (data.lastPlayDate === today) return [];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStr = yesterday.toISOString().split("T")[0];

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

  let newStreak: number;
  if (data.lastPlayDate === yestStr) {
    newStreak = data.currentStreak + 1;
  } else if (data.lastPlayDate === twoDaysAgoStr && data.currentStreak > 0 && consumeStreakFreeze()) {
    newStreak = data.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  const prevDates = data.playDates ?? [];
  const playDates = [...new Set([...prevDates, today])].sort().slice(-30);

  const updated: StreakData = {
    currentStreak: newStreak,
    lastPlayDate: today,
    longestStreak: Math.max(data.longestStreak, newStreak),
    playDates,
  };
  localStorage.setItem(KEY, JSON.stringify(updated));

  // Badges streak
  const newBadges: string[] = [];
  const progress = getProgress();
  if (newStreak >= 3 && !progress.earnedBadges.includes("streak_3")) {
    newBadges.push("streak_3");
  }
  if (newStreak >= 7 && !progress.earnedBadges.includes("streak_7")) {
    newBadges.push("streak_7");
  }
  if (newBadges.length > 0) {
    saveProgress({ ...progress, earnedBadges: [...progress.earnedBadges, ...newBadges] });
  }

  notifyProgress();
  return newBadges;
}
