import { addGems } from "./gems";
import { grantItem } from "./shop";
import { addQuestChest } from "./chests";

const KEY = "pythonkids_battle_pass";

export const BP_XP_PER_LEVEL = 200;
export const BP_MAX_LEVEL = 100;
export const BP_PREMIUM_COST = 2000;
export const BP_SEASON = 1;
export const BP_SEASON_END = "2026-08-31";

export type BPRewardType = "gems" | "chest" | "item";
export type BPItemRarity = "common" | "rare" | "epic" | "legendary";

export interface BPReward {
  type: BPRewardType;
  gems?: number;
  chestLevel?: number; // 0=commun 1=rare 2=épique 3=légendaire
  itemId?: string;
  itemName?: string;
  itemEmoji?: string;
  itemRarity?: BPItemRarity;
}

export interface BPLevel {
  level: number;
  freeReward: BPReward | null;
  premiumReward: BPReward | null;
}

export interface BattlePassState {
  season: number;
  currentXP: number;
  currentLevel: number;
  isPremium: boolean;
  claimedFree: number[];
  claimedPremium: number[];
}

function defaultState(): BattlePassState {
  return { season: BP_SEASON, currentXP: 0, currentLevel: 0, isPremium: false, claimedFree: [], claimedPremium: [] };
}

export function getBattlePassState(): BattlePassState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Reset si nouvelle saison
    if (parsed.season !== BP_SEASON) return defaultState();
    return { ...defaultState(), ...parsed };
  } catch { return defaultState(); }
}

function saveBattlePassState(state: BattlePassState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("pythonkids:battlepass"));
}

export function addBattlePassXP(amount: number): number {
  if (typeof window === "undefined") return 0;
  const state = getBattlePassState();
  if (state.currentLevel >= BP_MAX_LEVEL) return 0;
  const prevLevel = state.currentLevel;
  state.currentXP += amount;
  const newLevel = Math.min(Math.floor(state.currentXP / BP_XP_PER_LEVEL), BP_MAX_LEVEL);
  state.currentLevel = newLevel;
  saveBattlePassState(state);
  const levelsGained = newLevel - prevLevel;
  if (levelsGained > 0) {
    window.dispatchEvent(new CustomEvent("pythonkids:toast", {
      detail: { msg: `Pass de Combat : Niveau ${newLevel} atteint !`, emoji: "🎖️", type: "normal" },
    }));
  }
  return levelsGained;
}

export function activatePremium(): boolean {
  if (typeof window === "undefined") return false;
  const state = getBattlePassState();
  if (state.isPremium) return false;
  state.isPremium = true;
  saveBattlePassState(state);
  return true;
}

export function claimFreeReward(level: number): boolean {
  if (typeof window === "undefined") return false;
  const state = getBattlePassState();
  if (level > state.currentLevel) return false;
  if (state.claimedFree.includes(level)) return false;
  const def = BP_LEVELS[level - 1];
  if (!def?.freeReward) return false;
  grantBPReward(def.freeReward);
  state.claimedFree.push(level);
  saveBattlePassState(state);
  return true;
}

export function claimPremiumReward(level: number): boolean {
  if (typeof window === "undefined") return false;
  const state = getBattlePassState();
  if (!state.isPremium) return false;
  if (level > state.currentLevel) return false;
  if (state.claimedPremium.includes(level)) return false;
  const def = BP_LEVELS[level - 1];
  if (!def?.premiumReward) return false;
  grantBPReward(def.premiumReward);
  state.claimedPremium.push(level);
  saveBattlePassState(state);
  return true;
}

function grantBPReward(reward: BPReward): void {
  if (reward.type === "gems" && reward.gems) {
    addGems(reward.gems);
  } else if (reward.type === "chest") {
    addQuestChest(reward.chestLevel ?? 0);
  } else if (reward.type === "item" && reward.itemId) {
    grantItem(reward.itemId);
    window.dispatchEvent(new CustomEvent("pythonkids:toast", {
      detail: { msg: `${reward.itemName} débloqué !`, emoji: reward.itemEmoji ?? "🎁", type: "normal" },
    }));
  }
}

export function getBPXPInfo(): { levelXP: number; xpToNext: number; progress: number; currentLevel: number } {
  const state = getBattlePassState();
  if (state.currentLevel >= BP_MAX_LEVEL) {
    return { levelXP: BP_XP_PER_LEVEL, xpToNext: 0, progress: 100, currentLevel: BP_MAX_LEVEL };
  }
  const levelXP = state.currentXP % BP_XP_PER_LEVEL;
  return {
    levelXP,
    xpToNext: BP_XP_PER_LEVEL - levelXP,
    progress: Math.round((levelXP / BP_XP_PER_LEVEL) * 100),
    currentLevel: state.currentLevel,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function g(amount: number): BPReward { return { type: "gems", gems: amount }; }
function c(level: number): BPReward { return { type: "chest", chestLevel: level }; }
function it(id: string, name: string, emoji: string, rarity: BPItemRarity): BPReward {
  return { type: "item", itemId: id, itemName: name, itemEmoji: emoji, itemRarity: rarity };
}

// ─── 100 niveaux — track GRATUITE ──────────────────────────────────────────
// Mélange : gems, coffres, stickers boutique (communs→légendaires), items BP exclusifs

const FREE_REWARDS: BPReward[] = [
  // 1-10
  g(50),
  c(0),                                                                    // 2
  g(75),
  it("sticker_pizza",   "Pizza",          "🍕", "common"),                // 4
  it("bp_sticker_shield","Bouclier",      "🛡️", "common"),               // 5 ★ BP
  g(50),
  c(0),                                                                    // 7
  g(75),
  it("sticker_cat",     "Chat",           "🐱", "common"),                // 9
  it("bp_title_fighter","Combattant",     "⚔️", "common"),               // 10 ★ BP
  // 11-20
  g(75),
  c(0),                                                                    // 12
  g(100),
  it("sticker_robot",   "Robot",          "🤖", "common"),                // 14
  it("bp_sticker_blade","Lame",           "🗡️", "rare"),                  // 15 ★ BP
  g(75),
  c(1),                                                                    // 17
  g(100),
  it("sticker_dino",    "Dinosaure",      "🦕", "common"),                // 19
  c(1),                                                                    // 20
  // 21-30
  g(75),
  g(100),
  c(0),                                                                    // 23
  it("sticker_panda",   "Panda",          "🐼", "common"),                // 24
  it("bp_skin_storm",   "Tempête",        "🌪️", "rare"),                  // 25 ★ BP
  g(100),
  c(1),                                                                    // 27
  g(125),
  it("sticker_alien",   "Alien",          "👽", "rare"),                   // 29
  c(1),                                                                    // 30
  // 31-40
  g(100),
  g(125),
  c(1),                                                                    // 33
  it("sticker_ninja",   "Ninja",          "🥷", "rare"),                   // 34
  it("bp_sticker_star_gold","Étoile d'or","🌟", "epic"),                  // 35 ★ BP
  g(125),
  c(2),                                                                    // 37
  g(150),
  it("sticker_snake",   "Serpent",        "🐍", "rare"),                   // 39
  c(2),                                                                    // 40
  // 41-50
  g(125),
  c(1),                                                                    // 42
  g(150),
  it("sticker_trophy",  "Trophée",        "🏆", "rare"),                   // 44
  it("bp_title_veteran","Vétéran",        "🎖️", "rare"),                  // 45 ★ BP
  g(150),
  c(2),                                                                    // 47
  g(175),
  it("sticker_ghost",   "Fantôme",        "👻", "rare"),                   // 49
  g(300),                                                                  // 50 ★ jackpot
  // 51-60
  g(150),
  c(2),                                                                    // 52
  g(175),
  it("sticker_dragon",  "Dragon",         "🐉", "epic"),                   // 54
  it("bp_sticker_champion","Champion",    "🏆", "legendary"),             // 55 ★ BP
  g(150),
  c(3),                                                                    // 57
  g(175),
  it("sticker_unicorn", "Licorne",        "🦄", "epic"),                   // 59
  c(3),                                                                    // 60
  // 61-70
  g(175),
  c(2),                                                                    // 62
  g(200),
  it("sticker_meteor",  "Météorite",      "☄️", "epic"),                  // 64
  it("bp_title_champion_pass","Champion du Pass","🏆","epic"),            // 65 ★ BP
  g(175),
  c(3),                                                                    // 67
  g(200),
  it("sticker_wolf",    "Loup",           "🐺", "epic"),                   // 69
  c(3),                                                                    // 70
  // 71-80
  g(200),
  c(3),                                                                    // 72
  g(225),
  it("sticker_phoenix", "Phénix",         "🦅", "legendary"),              // 74
  it("bp_skin_ember",   "Braise",         "🔥", "epic"),                   // 75 ★ BP
  g(200),
  c(3),                                                                    // 77
  g(225),
  it("sticker_crown",   "Couronne",       "👑", "legendary"),              // 79
  c(3),                                                                    // 80
  // 81-90
  g(225),
  c(3),                                                                    // 82
  g(250),
  it("sticker_titan",   "Titan",          "⚔️", "legendary"),              // 84
  it("bp_title_conqueror","Conquérant",   "👑", "legendary"),             // 85 ★ BP
  g(225),
  c(3),                                                                    // 87
  g(250),
  it("sticker_galaxy",  "Galaxie",        "🌌", "legendary"),              // 89
  g(400),                                                                  // 90 ★ jackpot
  // 91-100
  g(250),
  c(3),                                                                    // 92
  g(275),
  it("sticker_angel",   "Ange",           "👼", "legendary"),              // 94
  g(500),                                                                  // 95 ★ jackpot
  g(250),
  c(3),                                                                    // 97
  g(300),
  it("sticker_infinity","Infini",         "♾️", "legendary"),              // 99
  it("bp_skin_absolute","Absolu",         "⚡", "legendary"),              // 100 ★ ULTIME
];

// ─── 100 niveaux — track PREMIUM ──────────────────────────────────────────
// Plus de coffres, skins de la boutique, gems plus élevées

const PREM_REWARDS: BPReward[] = [
  // 1-10
  g(100),
  c(1),                                                                    // 2
  it("sticker_cactus",  "Cactus",         "🌵", "common"),                // 3
  g(100),
  c(1),                                                                    // 5
  g(100),
  it("sticker_burger",  "Burger",         "🍔", "common"),                // 7
  c(1),                                                                    // 8
  g(125),
  it("bp_skin_frost",   "Givre",          "❄️", "rare"),                   // 10 ★ BP
  // 11-20
  g(125),
  c(2),                                                                    // 12
  it("sticker_star",    "Étoile",         "⭐", "common"),                // 13
  g(125),
  c(1),                                                                    // 15
  g(150),
  c(2),                                                                    // 17
  it("sticker_rocket",  "Fusée",          "🚀", "rare"),                   // 18
  g(150),
  g(200),                                                                  // 20 ★ jackpot
  // 21-30
  c(2),                                                                    // 21
  g(150),
  it("sticker_frog",    "Grenouille",     "🐸", "common"),                // 23
  c(2),                                                                    // 24
  it("bp_sticker_thunder_bp","Foudre de Guerre","⚡","epic"),             // 25 ★ BP
  g(150),
  c(2),                                                                    // 27
  it("skin_volcano",    "Volcan",         "🌋", "rare"),                   // 28 ★ skin boutique
  g(175),
  g(200),                                                                  // 30 ★ jackpot
  // 31-40
  c(2),                                                                    // 31
  g(175),
  it("skin_sakura",     "Sakura",         "🌸", "rare"),                   // 33 ★ skin boutique
  g(175),
  c(2),                                                                    // 35
  g(200),
  c(3),                                                                    // 37
  it("skin_aurora",     "Aurore boréale", "🌌", "rare"),                  // 38 ★ skin boutique
  g(200),
  c(2),                                                                    // 40
  // 41-50
  g(200),
  c(3),                                                                    // 42
  it("skin_neon",       "Néon",           "🔮", "epic"),                   // 43 ★ skin boutique
  g(200),
  c(3),                                                                    // 45
  g(225),
  c(3),                                                                    // 47
  it("skin_cosmic",     "Cosmique",       "🚀", "epic"),                   // 48 ★ skin boutique
  g(225),
  it("bp_skin_spectral","Spectral",       "👻", "epic"),                   // 50 ★ BP
  // 51-60
  g(225),
  c(3),                                                                    // 52
  it("skin_toxic",      "Toxique",        "☢️", "epic"),                   // 53 ★ skin boutique
  g(250),
  c(3),                                                                    // 55
  g(250),
  c(3),                                                                    // 57
  it("skin_rainbow",    "Arc-en-ciel",    "🌈", "epic"),                   // 58 ★ skin boutique
  g(275),
  g(300),                                                                  // 60 ★ jackpot
  // 61-70
  c(3),                                                                    // 61
  g(300),
  it("skin_inferno",    "Enfer",          "🔥", "legendary"),              // 63 ★ skin boutique
  g(300),
  c(3),                                                                    // 65
  g(300),
  c(3),                                                                    // 67
  it("skin_celestial",  "Céleste",        "✨", "legendary"),              // 68 ★ skin boutique
  g(325),
  c(3),                                                                    // 70
  // 71-80
  g(325),
  c(3),                                                                    // 72
  it("skin_diamond",    "Diamant",        "💎", "legendary"),              // 73 ★ skin boutique
  g(350),
  it("bp_title_elite",  "Élite du Pass",  "💎", "legendary"),             // 75 ★ BP
  g(350),
  c(3),                                                                    // 77
  it("skin_void",       "Néant",          "🌑", "legendary"),              // 78 ★ skin boutique
  g(375),
  g(400),                                                                  // 80 ★ jackpot
  // 81-90
  c(3),                                                                    // 81
  g(400),
  it("skin_prism",      "Prisme",         "🔷", "legendary"),              // 83 ★ skin boutique
  g(400),
  c(3),                                                                    // 85
  g(400),
  c(3),                                                                    // 87
  it("skin_eclipse",    "Éclipse",        "🌑", "legendary"),              // 88 ★ skin boutique
  g(425),
  c(3),                                                                    // 90
  // 91-100
  g(450),
  c(3),                                                                    // 92
  g(450),
  c(3),                                                                    // 94
  g(500),                                                                  // 95 ★ jackpot
  g(475),
  c(3),                                                                    // 97
  g(500),
  c(3),                                                                    // 99
  it("bp_skin_eternal", "Éternel",        "🌌", "legendary"),              // 100 ★ ULTIME
];

export const BP_LEVELS: BPLevel[] = Array.from({ length: BP_MAX_LEVEL }, (_, i) => ({
  level: i + 1,
  freeReward: FREE_REWARDS[i] ?? g(50),
  premiumReward: PREM_REWARDS[i] ?? g(75),
}));
