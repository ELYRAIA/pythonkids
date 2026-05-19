import { getProgress } from "./progress";

export interface Rank {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  minBadge: string | null;
}

export const RANKS: Rank[] = [
  { id: "padawan",     title: "Padawan Python",    emoji: "🌱", color: "text-green-400",  bgColor: "rgba(74,222,128,0.15)",  minBadge: null },
  { id: "apprenti",   title: "Apprenti Codeur",   emoji: "📝", color: "text-blue-400",   bgColor: "rgba(96,165,250,0.15)",  minBadge: "level_0" },
  { id: "explorateur",title: "Explorateur",        emoji: "🔭", color: "text-cyan-400",   bgColor: "rgba(34,211,238,0.15)",  minBadge: "level_1" },
  { id: "batisseur",  title: "Bâtisseur",          emoji: "🔨", color: "text-purple-400", bgColor: "rgba(192,132,252,0.15)", minBadge: "level_2" },
  { id: "architecte", title: "Architecte Python",  emoji: "🏛️", color: "text-indigo-400", bgColor: "rgba(129,140,248,0.15)", minBadge: "level_3" },
  { id: "expert",     title: "Expert Python",      emoji: "⚡", color: "text-pink-400",   bgColor: "rgba(244,114,182,0.15)", minBadge: "level_4" },
  { id: "maitre",     title: "Maître Python",      emoji: "🐍", color: "text-orange-400", bgColor: "rgba(251,146,60,0.15)",  minBadge: "all_levels" },
  { id: "legende",    title: "Légende Python",     emoji: "🌟", color: "text-yellow-400", bgColor: "rgba(250,204,21,0.15)",  minBadge: "challenge_all" },
];

export function getPlayerRank(badges?: string[]): Rank {
  const b = badges ?? (typeof window !== "undefined" ? getProgress().earnedBadges : []);
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (RANKS[i].minBadge === null || b.includes(RANKS[i].minBadge!)) return RANKS[i];
  }
  return RANKS[0];
}
