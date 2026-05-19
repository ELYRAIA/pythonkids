import { addGems } from "./gems";
import { addQuestChest } from "./chests";

export interface WeeklyQuestDef {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  reward: number;
  rewardType?: "gems" | "chest";
  chestLevel?: number;
  target: number;
  type: "lessons_week" | "challenges_week" | "streak" | "lessons_total";
}

export interface WeeklyQuestProgress {
  id: string;
  completed: boolean;
  claimed: boolean;
}

interface WeeklyState {
  weekKey: string;
  quests: WeeklyQuestProgress[];
}

const WEEKLY_QUEST_POOL: WeeklyQuestDef[] = [
  { id: "wq_5lessons",         emoji: "📖", title: "Assidu",             desc: "Termine 5 leçons cette semaine",   reward: 100, target: 5,  type: "lessons_week"    },
  { id: "wq_10lessons",        emoji: "📚", title: "Bosseur Pro",        desc: "Termine 10 leçons cette semaine",  reward: 200, target: 10, type: "lessons_week"    },
  { id: "wq_3challenges",      emoji: "🎯", title: "Challenger",         desc: "Réussis 3 défis cette semaine",    reward: 120, target: 3,  type: "challenges_week" },
  { id: "wq_5challenges",      emoji: "🏆", title: "Champion",           desc: "Réussis 5 défis cette semaine",    reward: 200, target: 5,  type: "challenges_week" },
  { id: "wq_streak5",          emoji: "🔥", title: "Inarrêtable",        desc: "Maintiens un streak de 5 jours",   reward: 150, target: 5,  type: "streak"          },
  { id: "wq_30lessons",        emoji: "🚀", title: "Marathon",           desc: "Atteins 30 leçons au total",       reward: 150, target: 30, type: "lessons_total"   },
  { id: "wq_50lessons",        emoji: "💫", title: "Légende",            desc: "Atteins 50 leçons au total",       reward: 300, target: 50, type: "lessons_total"   },
  // Quêtes à coffre (rare)
  { id: "wq_chest_12lessons",  emoji: "📦", title: "Semaine de code",    desc: "Termine 12 leçons cette semaine",  reward: 0, rewardType: "chest", chestLevel: 2, target: 12, type: "lessons_week"    },
  { id: "wq_chest_7challenges",emoji: "📦", title: "Maître des défis",   desc: "Réussis 7 défis cette semaine",    reward: 0, rewardType: "chest", chestLevel: 2, target: 7,  type: "challenges_week" },
  { id: "wq_chest_streak10",   emoji: "📦", title: "Streak légendaire",  desc: "Maintiens un streak de 10 jours",  reward: 0, rewardType: "chest", chestLevel: 3, target: 10, type: "streak"          },
];

const STORAGE_KEY = "pythonkids_weekly_quests";
const LESSONS_WEEK_KEY = "pythonkids_lessons_week";
const CHALLENGES_WEEK_KEY = "pythonkids_challenges_week";

export function getWeekKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

export function getWeekDaysLeft(): number {
  const now = new Date();
  const day = now.getDay();
  return day === 0 ? 0 : 7 - day;
}

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  hash = ((hash << 5) - hash + index) | 0;
  return Math.abs(hash) / 2147483647;
}

function getWeekQuestDefs(weekKey: string): WeeklyQuestDef[] {
  const available = [...Array(WEEKLY_QUEST_POOL.length).keys()];
  const picked: number[] = [];
  for (let i = 0; i < 3; i++) {
    const r = seededRandom(weekKey, i);
    const idx = Math.floor(r * available.length);
    picked.push(available.splice(idx, 1)[0]);
  }
  return picked.map((i) => WEEKLY_QUEST_POOL[i]);
}

function loadState(): WeeklyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WeeklyState) : { weekKey: "", quests: [] };
  } catch {
    return { weekKey: "", quests: [] };
  }
}

function saveState(state: WeeklyState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getWeeklyQuestState(): { defs: WeeklyQuestDef[]; progress: WeeklyQuestProgress[] } {
  if (typeof window === "undefined") return { defs: [], progress: [] };
  const weekKey = getWeekKey();
  const defs = getWeekQuestDefs(weekKey);
  let state = loadState();

  if (state.weekKey !== weekKey) {
    state = { weekKey, quests: defs.map((d) => ({ id: d.id, completed: false, claimed: false })) };
    saveState(state);
  }
  return { defs, progress: state.quests };
}

export function computeWeeklyQuestProgress(def: WeeklyQuestDef): number {
  if (typeof window === "undefined") return 0;

  if (def.type === "lessons_week") {
    try {
      const raw = localStorage.getItem(LESSONS_WEEK_KEY);
      const data: { weekKey: string; count: number } = raw ? JSON.parse(raw) : { weekKey: "", count: 0 };
      return data.weekKey === getWeekKey() ? data.count : 0;
    } catch { return 0; }
  }

  if (def.type === "challenges_week") {
    try {
      const raw = localStorage.getItem(CHALLENGES_WEEK_KEY);
      const data: { weekKey: string; count: number } = raw ? JSON.parse(raw) : { weekKey: "", count: 0 };
      return data.weekKey === getWeekKey() ? data.count : 0;
    } catch { return 0; }
  }

  if (def.type === "streak") {
    try {
      const raw = localStorage.getItem("pythonkids_streak");
      if (!raw) return 0;
      return (JSON.parse(raw) as { currentStreak?: number }).currentStreak ?? 0;
    } catch { return 0; }
  }

  if (def.type === "lessons_total") {
    try {
      const raw = localStorage.getItem("pythonkids_progress");
      if (!raw) return 0;
      const p = JSON.parse(raw) as { completedLessons: Record<string, number[]> };
      return Object.values(p.completedLessons).flat().length;
    } catch { return 0; }
  }

  return 0;
}

export function refreshWeeklyQuests(): string[] {
  if (typeof window === "undefined") return [];
  const { defs, progress } = getWeeklyQuestState();
  const newlyCompleted: string[] = [];

  const updated = progress.map((p, i) => {
    if (p.completed) return p;
    const def = defs[i];
    if (!def) return p;
    if (computeWeeklyQuestProgress(def) >= def.target) {
      newlyCompleted.push(def.id);
      return { ...p, completed: true };
    }
    return p;
  });

  saveState({ weekKey: getWeekKey(), quests: updated });
  return newlyCompleted;
}

export function claimWeeklyQuest(questId: string): number {
  if (typeof window === "undefined") return 0;
  const { defs, progress } = getWeeklyQuestState();
  const idx = progress.findIndex((p) => p.id === questId);
  if (idx === -1 || !progress[idx].completed || progress[idx].claimed) return 0;

  const def = defs[idx];
  progress[idx].claimed = true;
  saveState({ weekKey: getWeekKey(), quests: progress });

  if (def?.rewardType === "chest") {
    addQuestChest(def.chestLevel ?? 0);
    return -1; // indique qu'un coffre a été donné
  }

  const reward = def?.reward ?? 0;
  if (reward > 0) addGems(reward);
  return reward;
}

export function trackLessonWeek(): void {
  if (typeof window === "undefined") return;
  try {
    const weekKey = getWeekKey();
    const raw = localStorage.getItem(LESSONS_WEEK_KEY);
    let data: { weekKey: string; count: number } = raw ? JSON.parse(raw) : { weekKey: "", count: 0 };
    data = data.weekKey !== weekKey ? { weekKey, count: 1 } : { ...data, count: data.count + 1 };
    localStorage.setItem(LESSONS_WEEK_KEY, JSON.stringify(data));
  } catch {}
}

export function trackChallengeWeek(): void {
  if (typeof window === "undefined") return;
  try {
    const weekKey = getWeekKey();
    const raw = localStorage.getItem(CHALLENGES_WEEK_KEY);
    let data: { weekKey: string; count: number } = raw ? JSON.parse(raw) : { weekKey: "", count: 0 };
    data = data.weekKey !== weekKey ? { weekKey, count: 1 } : { ...data, count: data.count + 1 };
    localStorage.setItem(CHALLENGES_WEEK_KEY, JSON.stringify(data));
  } catch {}
}
