import { addGems } from "./gems";
import { LEVELS } from "./levels";

export type RewardRarity = "common" | "rare" | "epic" | "legendary";

export interface ChestReward {
  type: "stars" | "gems" | "cosmetic" | "head";
  stars?: number;
  gems?: number;
  cosmeticId?: string;
  headId?: string;
  emoji: string;
  name: string;
  rarity: RewardRarity;
}

export interface Chest {
  id: string;
  levelId: number;
  rewards: ChestReward[];
  revealedCount: number;
}

export interface AvatarCosmetic {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: RewardRarity;
}

export interface HeadSkin {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;   // Tailwind gradient classes
  hairColor: string;  // CSS color for hair
  rarity: RewardRarity;
}

export const AVATAR_COSMETICS: AvatarCosmetic[] = [
  { id: "flower",    name: "Fleur",              emoji: "🌸", description: "Des pétales dansent autour de toi",       rarity: "common"    },
  { id: "clover",    name: "Trèfle",              emoji: "🍀", description: "Porte-bonheur pour les codeurs",          rarity: "common"    },
  { id: "butterfly", name: "Papillon",            emoji: "🦋", description: "Papillons colorés qui virevoltent",       rarity: "common"    },
  { id: "flame",     name: "Flamme",              emoji: "🔥", description: "Flammes ardentes de passion",             rarity: "rare"      },
  { id: "comet",     name: "Comète",              emoji: "💫", description: "Traînée de comète brillante",              rarity: "rare"      },
  { id: "crystal",   name: "Cristal",             emoji: "🔮", description: "Cristaux de magie pure",                   rarity: "rare"      },
  { id: "dragon",    name: "Dragon",              emoji: "🐲", description: "Un dragon gardien légendaire",             rarity: "epic"      },
  { id: "lightning", name: "Éclair",              emoji: "⚡", description: "Éclairs d'énergie déchaînée",             rarity: "epic"      },
  { id: "rainbow",   name: "Arc-en-ciel",         emoji: "🌈", description: "Couleurs arc-en-ciel magiques",           rarity: "epic"      },
  { id: "galaxy",    name: "Galaxie",             emoji: "🌌", description: "Un univers entier tourne autour de toi",  rarity: "legendary" },
  { id: "crown",     name: "Couronne Légendaire", emoji: "👑", description: "La couronne du vrai Maître Python",       rarity: "legendary" },
  { id: "diamond",   name: "Diamant",             emoji: "💎", description: "Pure brillance, pur génie",               rarity: "legendary" },
];

export const HEAD_SKINS: HeadSkin[] = [
  // ── Communs ──
  {
    id: "head_sandy",
    name: "Sableux", emoji: "🏖️",
    description: "Teintes chaudes du désert",
    gradient: "from-amber-200 via-yellow-300 to-amber-500",
    hairColor: "#d97706",
    rarity: "common",
  },
  {
    id: "head_frost",
    name: "Givré", emoji: "❄️",
    description: "Froid comme la glace",
    gradient: "from-slate-200 via-blue-100 to-sky-300",
    hairColor: "#7dd3fc",
    rarity: "common",
  },
  {
    id: "head_meadow",
    name: "Prairie", emoji: "🌿",
    description: "Douceur de la nature",
    gradient: "from-lime-200 via-green-300 to-emerald-500",
    hairColor: "#15803d",
    rarity: "common",
  },
  {
    id: "head_blush",
    name: "Rosé", emoji: "🌸",
    description: "Tout en douceur",
    gradient: "from-pink-100 via-rose-200 to-pink-400",
    hairColor: "#db2777",
    rarity: "common",
  },
  // ── Rares ──
  {
    id: "head_ocean",
    name: "Océan", emoji: "🌊",
    description: "Profondeurs marines",
    gradient: "from-blue-300 via-cyan-400 to-teal-600",
    hairColor: "#0369a1",
    rarity: "rare",
  },
  {
    id: "head_lava",
    name: "Lave", emoji: "🌋",
    description: "Puissance volcanique",
    gradient: "from-red-400 via-orange-400 to-yellow-500",
    hairColor: "#c2410c",
    rarity: "rare",
  },
  {
    id: "head_forest",
    name: "Forêt", emoji: "🌲",
    description: "Mystères de la forêt noire",
    gradient: "from-emerald-600 via-green-700 to-teal-700",
    hairColor: "#064e3b",
    rarity: "rare",
  },
  {
    id: "head_dusk",
    name: "Crépuscule", emoji: "🌆",
    description: "Magie du soir",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
    hairColor: "#6d28d9",
    rarity: "rare",
  },
  // ── Épiques ──
  {
    id: "head_neon",
    name: "Néon", emoji: "⚡",
    description: "Éclat électrique",
    gradient: "from-fuchsia-400 via-pink-400 to-cyan-500",
    hairColor: "#c026d3",
    rarity: "epic",
  },
  {
    id: "head_midnight",
    name: "Minuit", emoji: "🌑",
    description: "Maîtrise de l'obscurité",
    gradient: "from-slate-700 via-indigo-800 to-violet-900",
    hairColor: "#3730a3",
    rarity: "epic",
  },
  {
    id: "head_aurora",
    name: "Aurore", emoji: "🌌",
    description: "Lumières nordiques",
    gradient: "from-teal-400 via-cyan-300 to-violet-500",
    hairColor: "#0f766e",
    rarity: "epic",
  },
  {
    id: "head_inferno",
    name: "Inferno", emoji: "🔥",
    description: "Flammes dévorantes",
    gradient: "from-red-600 via-red-500 to-orange-400",
    hairColor: "#991b1b",
    rarity: "epic",
  },
  // ── Légendaires ──
  {
    id: "head_cosmic",
    name: "Cosmique", emoji: "🚀",
    description: "Voyage au cœur des étoiles",
    gradient: "from-indigo-950 via-violet-700 to-blue-500",
    hairColor: "#312e81",
    rarity: "legendary",
  },
  {
    id: "head_prism",
    name: "Prisme", emoji: "🌈",
    description: "Toutes les couleurs à la fois",
    gradient: "from-rose-400 via-yellow-300 to-blue-500",
    hairColor: "#7c3aed",
    rarity: "legendary",
  },
  {
    id: "head_soleil",
    name: "Soleil", emoji: "☀️",
    description: "Pure lumière dorée",
    gradient: "from-yellow-100 via-amber-300 to-orange-500",
    hairColor: "#92400e",
    rarity: "legendary",
  },
  {
    id: "head_crystal",
    name: "Cristal", emoji: "💎",
    description: "Brillance cristalline absolue",
    gradient: "from-sky-100 via-cyan-200 to-violet-400",
    hairColor: "#0c4a6e",
    rarity: "legendary",
  },
];

const STARS_BY_LEVEL = [
  [60, 100], [120, 200], [200, 350], [300, 500], [450, 700], [700, 1100],
] as const;

const GEMS_BY_LEVEL = [
  [5, 15], [10, 25], [20, 40], [35, 65], [60, 100], [100, 180],
] as const;

const RARITY_BY_LEVEL: RewardRarity[] = ["common", "common", "rare", "rare", "epic", "legendary"];

export const CHEST_EMOJI_BY_RARITY: Record<RewardRarity, string> = {
  common:    "📦",
  rare:      "💎",
  epic:      "✨",
  legendary: "🌟",
};

export const CHEST_GLOW_BY_RARITY: Record<RewardRarity, string> = {
  common:    "shadow-[0_0_30px_rgba(156,163,175,0.6)]",
  rare:      "shadow-[0_0_40px_rgba(96,165,250,0.7)]",
  epic:      "shadow-[0_0_50px_rgba(168,85,247,0.8)]",
  legendary: "shadow-[0_0_60px_rgba(251,191,36,0.9)]",
};

export const RARITY_COLORS: Record<RewardRarity, string> = {
  common:    "from-gray-400 to-slate-500",
  rare:      "from-blue-500 to-cyan-500",
  epic:      "from-purple-500 to-violet-600",
  legendary: "from-yellow-400 to-orange-500",
};

export const RARITY_BORDER: Record<RewardRarity, string> = {
  common:    "border-gray-400",
  rare:      "border-blue-400",
  epic:      "border-purple-500",
  legendary: "border-yellow-400",
};

export const RARITY_LABELS: Record<RewardRarity, string> = {
  common:    "Commun",
  rare:      "Rare",
  epic:      "Épique",
  legendary: "Légendaire",
};

export const RARITY_BG: Record<RewardRarity, string> = {
  common:    "rgba(156,163,175,0.15)",
  rare:      "rgba(96,165,250,0.15)",
  epic:      "rgba(168,85,247,0.15)",
  legendary: "rgba(251,191,36,0.15)",
};

export const RARITY_GLOW: Record<RewardRarity, string> = {
  common:    "rgba(156,163,175,0.25)",
  rare:      "rgba(96,165,250,0.3)",
  epic:      "rgba(168,85,247,0.35)",
  legendary: "rgba(251,191,36,0.45)",
};

export function getLevelRarity(levelId: number): RewardRarity {
  return RARITY_BY_LEVEL[Math.min(levelId, 5)];
}

function rand(min: number, max: number, step = 5): number {
  return Math.round((Math.random() * (max - min) + min) / step) * step;
}

export function generateChestRewards(levelId: number): ChestReward[] {
  const lvl = Math.min(levelId, 5);
  const [min, max] = STARS_BY_LEVEL[lvl];
  const rarity = RARITY_BY_LEVEL[lvl];

  const cosPool = AVATAR_COSMETICS.filter((c) => c.rarity === rarity);
  const cosmetic = cosPool[Math.floor(Math.random() * cosPool.length)];

  const headPool = HEAD_SKINS.filter((h) => h.rarity === rarity);
  const head = headPool[Math.floor(Math.random() * headPool.length)];

  const s1 = rand(min, max);
  const [gemMin, gemMax] = GEMS_BY_LEVEL[lvl];
  const g1 = rand(gemMin, gemMax, 1);

  return [
    { type: "stars",    stars: s1,               emoji: "⭐", name: `+${s1} étoiles`,  rarity: "common" },
    { type: "gems",     gems: g1,                emoji: "💎", name: `+${g1} gemmes`,    rarity: "common" },
    { type: "cosmetic", cosmeticId: cosmetic.id, emoji: cosmetic.emoji, name: cosmetic.name, rarity },
    { type: "head",     headId: head.id,          emoji: head.emoji,    name: head.name,     rarity },
  ];
}

const KEY_CHESTS     = "pythonkids_chests";
const KEY_GIVEN      = "pythonkids_chests_given";
export const KEY_BONUS = "pythonkids_chest_stars";
const KEY_COSMETICS  = "pythonkids_cosmetics";
const KEY_HEADS      = "pythonkids_heads";

function getGivenLevels(): number[] {
  try { return JSON.parse(localStorage.getItem(KEY_GIVEN) ?? "[]"); } catch { return []; }
}

function markLevelGiven(levelId: number): void {
  const given = getGivenLevels();
  if (!given.includes(levelId)) {
    given.push(levelId);
    localStorage.setItem(KEY_GIVEN, JSON.stringify(given));
  }
}

export function getPendingChests(): Chest[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_CHESTS) ?? "[]"); } catch { return []; }
}

function saveChests(chests: Chest[]): void {
  localStorage.setItem(KEY_CHESTS, JSON.stringify(chests));
}

export function addChest(levelId: number): void {
  if (typeof window === "undefined") return;
  const chests = getPendingChests();
  chests.push({
    id: `chest_${levelId}_${Date.now()}`,
    levelId,
    rewards: generateChestRewards(levelId),
    revealedCount: 0,
  });
  saveChests(chests);
  markLevelGiven(levelId);
  window.dispatchEvent(new Event("pythonkids:chests"));
}

/** Ajoute un coffre de quête sans affecter les niveaux. */
export function addQuestChest(levelId: number = 0): void {
  if (typeof window === "undefined") return;
  const chests = getPendingChests();
  chests.push({
    id: `chest_quest_${Date.now()}`,
    levelId,
    rewards: generateChestRewards(levelId),
    revealedCount: 0,
  });
  saveChests(chests);
  window.dispatchEvent(new Event("pythonkids:chests"));
}

export function retroactiveChests(
  earnedBadges: string[],
  completedLessons: Record<string, number[]>,
): void {
  if (typeof window === "undefined") return;
  const given = getGivenLevels();

  const totalLessons = Object.values(completedLessons).flat().length;
  if (totalLessons >= 1 && !given.includes(-1)) {
    addChest(0);
    markLevelGiven(-1);
  }

  for (const { id: lvl } of LEVELS) {
    if (earnedBadges.includes(`level_${lvl}`) && !given.includes(lvl)) {
      addChest(lvl);
    }
  }
}

export function saveRevealedCount(chestId: string, count: number): void {
  const chests = getPendingChests();
  const chest = chests.find((c) => c.id === chestId);
  if (chest) { chest.revealedCount = count; saveChests(chests); }
}

export function claimChest(chestId: string): void {
  const chests = getPendingChests();
  const chest = chests.find((c) => c.id === chestId);
  if (!chest) return;

  let bonus = parseInt(localStorage.getItem(KEY_BONUS) ?? "0");
  const cosmetics: string[] = JSON.parse(localStorage.getItem(KEY_COSMETICS) ?? "[]");
  const heads: string[] = JSON.parse(localStorage.getItem(KEY_HEADS) ?? "[]");

  for (const r of chest.rewards) {
    if (r.type === "stars"    && r.stars)     bonus += r.stars;
    if (r.type === "gems"     && r.gems)      addGems(r.gems);
    if (r.type === "cosmetic" && r.cosmeticId && !cosmetics.includes(r.cosmeticId)) {
      cosmetics.push(r.cosmeticId);
    }
    if (r.type === "head" && r.headId && !heads.includes(r.headId)) {
      heads.push(r.headId);
    }
  }

  localStorage.setItem(KEY_BONUS, String(bonus));
  localStorage.setItem(KEY_COSMETICS, JSON.stringify(cosmetics));
  localStorage.setItem(KEY_HEADS, JSON.stringify(heads));
  saveChests(chests.filter((c) => c.id !== chestId));
  window.dispatchEvent(new Event("pythonkids:progress"));
  window.dispatchEvent(new Event("pythonkids:chests"));
}

export function getChestBonusStars(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY_BONUS) ?? "0");
}

export function getUnlockedCosmetics(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_COSMETICS) ?? "[]"); } catch { return []; }
}

export function getUnlockedHeads(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_HEADS) ?? "[]"); } catch { return []; }
}

const KEY_EQUIPPED_COSMETIC = "pythonkids_equipped_cosmetic";
const KEY_EQUIPPED_HEAD     = "pythonkids_equipped_head";

export function getEquippedCosmetic(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_EQUIPPED_COSMETIC);
}

export function equipCosmetic(id: string | null): void {
  if (id === null) localStorage.removeItem(KEY_EQUIPPED_COSMETIC);
  else localStorage.setItem(KEY_EQUIPPED_COSMETIC, id);
  window.dispatchEvent(new Event("pythonkids:chests"));
}

export function getEquippedHead(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_EQUIPPED_HEAD);
}

export function equipHead(id: string | null): void {
  if (id === null) localStorage.removeItem(KEY_EQUIPPED_HEAD);
  else localStorage.setItem(KEY_EQUIPPED_HEAD, id);
  window.dispatchEvent(new Event("pythonkids:chests"));
}
