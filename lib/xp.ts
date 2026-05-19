const KEY = "pythonkids_xp";
const KEY_WEEKLY = "pythonkids_xp_weekly";

export interface XPRank {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgGradient: string;
  minXP: number;
}

export const XP_RANKS: XPRank[] = [
  { id: "novice",      title: "Novice",      emoji: "🌱", color: "text-gray-400",   bgGradient: "#9ca3af, #64748b",  minXP: 0    },
  { id: "apprenti",    title: "Apprenti",    emoji: "📝", color: "text-green-400",  bgGradient: "#4ade80, #10b981",  minXP: 100  },
  { id: "codeur",      title: "Codeur",      emoji: "💻", color: "text-blue-400",   bgGradient: "#60a5fa, #06b6d4",  minXP: 300  },
  { id: "explorateur", title: "Explorateur", emoji: "🔭", color: "text-cyan-400",   bgGradient: "#22d3ee, #14b8a6",  minXP: 600  },
  { id: "expert",      title: "Expert",      emoji: "⚡", color: "text-purple-400", bgGradient: "#a855f7, #7c3aed",  minXP: 1000 },
  { id: "maitre",      title: "Maître",      emoji: "🐍", color: "text-orange-400", bgGradient: "#fb923c, #f59e0b",  minXP: 2000 },
  { id: "legende",     title: "Légende",     emoji: "🌟", color: "text-yellow-400", bgGradient: "#facc15, #f97316",  minXP: 5000 },
];

function getWeekKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

export function getXP(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) ?? "0");
}

export function getWeeklyXP(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(KEY_WEEKLY);
    const data: { weekKey: string; xp: number } = raw ? JSON.parse(raw) : { weekKey: "", xp: 0 };
    return data.weekKey === getWeekKey() ? data.xp : 0;
  } catch { return 0; }
}

export function addXP(amount: number): void {
  if (typeof window === "undefined") return;
  const prevXP = getXP();
  const newXP = prevXP + amount;
  localStorage.setItem(KEY, String(newXP));

  // Weekly XP
  try {
    const weekKey = getWeekKey();
    const raw = localStorage.getItem(KEY_WEEKLY);
    const data: { weekKey: string; xp: number } = raw ? JSON.parse(raw) : { weekKey: "", xp: 0 };
    const weeklyXP = data.weekKey === weekKey ? data.xp + amount : amount;
    localStorage.setItem(KEY_WEEKLY, JSON.stringify({ weekKey, xp: weeklyXP }));
  } catch {}

  // Detect rank-up and dispatch toast
  const prevRankIdx = XP_RANKS.findLastIndex((r) => prevXP >= r.minXP);
  const newRankIdx  = XP_RANKS.findLastIndex((r) => newXP  >= r.minXP);
  if (newRankIdx > prevRankIdx && XP_RANKS[newRankIdx]) {
    const rank = XP_RANKS[newRankIdx];
    window.dispatchEvent(new CustomEvent("pythonkids:toast", {
      detail: { msg: `Nouveau rang : ${rank.title} !`, emoji: rank.emoji, type: "rank" },
    }));
  }

  window.dispatchEvent(new Event("pythonkids:xp"));
}

export function getXPInfo(): {
  rank: XPRank;
  nextRank: XPRank | null;
  xp: number;
  progress: number;
  xpToNext: number;
} {
  const xp = getXP();
  let rankIdx = 0;
  for (let i = 0; i < XP_RANKS.length; i++) {
    if (xp >= XP_RANKS[i].minXP) rankIdx = i;
    else break;
  }
  const rank = XP_RANKS[rankIdx];
  const nextRank = XP_RANKS[rankIdx + 1] ?? null;
  const xpToNext = nextRank ? nextRank.minXP - xp : 0;
  const progress = nextRank
    ? Math.round(((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)
    : 100;
  return { rank, nextRank, xp, progress, xpToNext };
}
