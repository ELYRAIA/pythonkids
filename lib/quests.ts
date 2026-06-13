import { addGems } from "./gems";
import { addQuestChest } from "./chests";
import { addBattlePassXP } from "./battlePass";

export interface QuestDef {
  id: string;
  emoji: string;
  title: string;
  title_en?: string;
  desc: string;
  desc_en?: string;
  reward: number;
  rewardType?: "gems" | "chest";
  chestLevel?: number;
  target: number;
  type: "lessons_today" | "challenges_total" | "streak" | "lessons_total";
}

export interface QuestProgress {
  id: string;
  completed: boolean;
  claimed: boolean;
}

interface QuestState {
  date: string;
  quests: QuestProgress[];
}

const QUEST_POOL: QuestDef[] = [
  { id: "q_2lessons",        emoji: "📖", title: "Studieux !",        title_en: "Studious!",          desc: "Termine 2 leçons aujourd'hui",      desc_en: "Complete 2 lessons today",       reward: 30,  target: 2,  type: "lessons_today"    },
  { id: "q_3lessons",        emoji: "📚", title: "Bosseur",           title_en: "Hard Worker",        desc: "Termine 3 leçons aujourd'hui",      desc_en: "Complete 3 lessons today",       reward: 50,  target: 3,  type: "lessons_today"    },
  { id: "q_1challenge",      emoji: "🎯", title: "Relevé !",          title_en: "Challenger!",        desc: "Réussis 1 défi",                    desc_en: "Complete 1 challenge",           reward: 40,  target: 1,  type: "challenges_total" },
  { id: "q_3challenges",     emoji: "🏆", title: "Champion",          title_en: "Champion",           desc: "Réussis 3 défis",                   desc_en: "Complete 3 challenges",          reward: 80,  target: 3,  type: "challenges_total" },
  { id: "q_streak3",         emoji: "🔥", title: "Chaud devant",      title_en: "Heating Up",         desc: "Maintiens un streak de 3 jours",    desc_en: "Keep a 3-day streak",            reward: 60,  target: 3,  type: "streak"           },
  { id: "q_streak5",         emoji: "⚡", title: "Inarrêtable",       title_en: "Unstoppable",        desc: "Maintiens un streak de 5 jours",    desc_en: "Keep a 5-day streak",            reward: 100, target: 5,  type: "streak"           },
  { id: "q_5lessons",        emoji: "🌟", title: "Curieux",           title_en: "Curious",            desc: "Atteins 5 leçons au total",         desc_en: "Reach 5 lessons in total",       reward: 40,  target: 5,  type: "lessons_total"    },
  { id: "q_10lessons",       emoji: "💫", title: "Assidu",            title_en: "Dedicated",          desc: "Atteins 10 leçons au total",        desc_en: "Reach 10 lessons in total",      reward: 60,  target: 10, type: "lessons_total"    },
  { id: "q_20lessons",       emoji: "🚀", title: "Productif",         title_en: "Productive",         desc: "Atteins 20 leçons au total",        desc_en: "Reach 20 lessons in total",      reward: 80,  target: 20, type: "lessons_total"    },
  // Quêtes à coffre
  { id: "q_chest_4lessons",  emoji: "📦", title: "Coffre surprise !",  title_en: "Surprise Chest!",   desc: "Termine 4 leçons aujourd'hui",     desc_en: "Complete 4 lessons today",        reward: 0, rewardType: "chest", chestLevel: 0, target: 4,  type: "lessons_today" },
  { id: "q_chest_streak7",   emoji: "📦", title: "Gardien du streak",  title_en: "Streak Guardian",   desc: "Maintiens un streak de 7 jours",   desc_en: "Keep a 7-day streak",             reward: 0, rewardType: "chest", chestLevel: 1, target: 7,  type: "streak"        },
  { id: "q_chest_lessons30", emoji: "📦", title: "Explorateur",        title_en: "Explorer",          desc: "Atteins 30 leçons au total",       desc_en: "Reach 30 lessons in total",       reward: 0, rewardType: "chest", chestLevel: 1, target: 30, type: "lessons_total" },
];

const STORAGE_KEY = "pythonkids_quests";
const LESSONS_TODAY_KEY = "pythonkids_lessons_today";

function dateKey(): string {
  return new Date().toDateString();
}

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  hash = ((hash << 5) - hash + index) | 0;
  return Math.abs(hash) / 2147483647;
}

function getTodayQuestDefs(): QuestDef[] {
  const seed = dateKey();
  const available = [...Array(QUEST_POOL.length).keys()];
  const picked: number[] = [];
  for (let i = 0; i < 3; i++) {
    const r = seededRandom(seed, i);
    const idx = Math.floor(r * available.length);
    picked.push(available.splice(idx, 1)[0]);
  }
  return picked.map((i) => QUEST_POOL[i]);
}

function loadState(): QuestState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuestState) : { date: "", quests: [] };
  } catch {
    return { date: "", quests: [] };
  }
}

function saveState(state: QuestState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getQuestState(): { defs: QuestDef[]; progress: QuestProgress[] } {
  if (typeof window === "undefined") return { defs: [], progress: [] };
  const defs = getTodayQuestDefs();
  let state = loadState();

  if (state.date !== dateKey()) {
    state = {
      date: dateKey(),
      quests: defs.map((d) => ({ id: d.id, completed: false, claimed: false })),
    };
    saveState(state);
  }

  return { defs, progress: state.quests };
}

export function computeQuestProgress(def: QuestDef): number {
  if (typeof window === "undefined") return 0;

  if (def.type === "lessons_today") {
    try {
      const raw = localStorage.getItem(LESSONS_TODAY_KEY);
      const data: { date: string; count: number } = raw ? JSON.parse(raw) : { date: "", count: 0 };
      return data.date === todayKey() ? data.count : 0;
    } catch {
      return 0;
    }
  }

  if (def.type === "challenges_total") {
    try {
      const raw = localStorage.getItem("pythonkids_challenges");
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch {
      return 0;
    }
  }

  if (def.type === "streak") {
    try {
      const raw = localStorage.getItem("pythonkids_streak");
      if (!raw) return 0;
      return (JSON.parse(raw) as { currentStreak?: number }).currentStreak ?? 0;
    } catch {
      return 0;
    }
  }

  if (def.type === "lessons_total") {
    try {
      const raw = localStorage.getItem("pythonkids_progress");
      if (!raw) return 0;
      const p = JSON.parse(raw) as { completedLessons: Record<string, number[]> };
      return Object.values(p.completedLessons).flat().length;
    } catch {
      return 0;
    }
  }

  return 0;
}

export function refreshQuests(): string[] {
  if (typeof window === "undefined") return [];
  const { defs, progress } = getQuestState();
  const newlyCompleted: string[] = [];

  const updated = progress.map((p, i) => {
    if (p.completed) return p;
    const def = defs[i];
    if (!def) return p;
    if (computeQuestProgress(def) >= def.target) {
      newlyCompleted.push(def.id);
      return { ...p, completed: true };
    }
    return p;
  });

  saveState({ date: dateKey(), quests: updated });
  return newlyCompleted;
}

export function claimQuest(questId: string): number {
  if (typeof window === "undefined") return 0;
  const { defs, progress } = getQuestState();
  const idx = progress.findIndex((p) => p.id === questId);
  if (idx === -1 || !progress[idx].completed || progress[idx].claimed) return 0;

  const def = defs[idx];
  progress[idx].claimed = true;
  saveState({ date: dateKey(), quests: progress });

  if (def?.rewardType === "chest") {
    addQuestChest(def.chestLevel ?? 0);
    return -1; // indique qu'un coffre a été donné
  }

  addBattlePassXP(100);
  const reward = def?.reward ?? 0;
  if (reward > 0) addGems(reward);
  return reward;
}

export function trackLessonToday(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LESSONS_TODAY_KEY);
    let data: { date: string; count: number } = raw ? JSON.parse(raw) : { date: "", count: 0 };
    if (data.date !== todayKey()) {
      data = { date: todayKey(), count: 1 };
    } else {
      data.count++;
    }
    localStorage.setItem(LESSONS_TODAY_KEY, JSON.stringify(data));
  } catch {}
}
