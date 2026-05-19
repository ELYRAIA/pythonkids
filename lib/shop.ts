import { spendGems } from "./gems";

export type ShopRarity = "common" | "rare" | "epic" | "legendary";
export type ShopItemType = "skin" | "sticker";

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  type: ShopItemType;
  rarity: ShopRarity;
  price: number;
  description: string;
  gradient?: string;
}

export const SHOP_SKINS: ShopItem[] = [
  { id: "skin_sunset",    name: "Coucher de soleil", emoji: "🌅", type: "skin", rarity: "common",    price: 50,   description: "Teintes chaudes du soir",    gradient: "from-orange-400 to-pink-500"   },
  { id: "skin_ocean",     name: "Océan",             emoji: "🌊", type: "skin", rarity: "common",    price: 50,   description: "Vagues bleues infinies",     gradient: "from-blue-400 to-cyan-500"     },
  { id: "skin_forest",    name: "Forêt",             emoji: "🌿", type: "skin", rarity: "common",    price: 50,   description: "Verdure apaisante",          gradient: "from-green-400 to-emerald-600" },
  { id: "skin_volcano",   name: "Volcan",            emoji: "🌋", type: "skin", rarity: "rare",      price: 150,  description: "Énergie bouillonnante",      gradient: "from-red-500 to-orange-600"    },
  { id: "skin_aurora",    name: "Aurore boréale",    emoji: "🌌", type: "skin", rarity: "rare",      price: 150,  description: "Lumières nordiques",         gradient: "from-teal-400 to-purple-600"   },
  { id: "skin_midnight",  name: "Minuit",            emoji: "🌙", type: "skin", rarity: "rare",      price: 150,  description: "Mystères de la nuit",        gradient: "from-slate-600 to-indigo-900"  },
  { id: "skin_neon",      name: "Néon",              emoji: "⚡", type: "skin", rarity: "epic",      price: 400,  description: "Éclat électrique",           gradient: "from-fuchsia-500 to-cyan-500"  },
  { id: "skin_cosmic",    name: "Cosmique",          emoji: "🚀", type: "skin", rarity: "epic",      price: 400,  description: "Voyage dans l'univers",      gradient: "from-violet-600 to-blue-900"   },
  { id: "skin_inferno",   name: "Enfer",             emoji: "🔥", type: "skin", rarity: "legendary", price: 1000, description: "Flammes légendaires",        gradient: "from-red-600 to-yellow-400"    },
  { id: "skin_celestial", name: "Céleste",           emoji: "✨", type: "skin", rarity: "legendary", price: 1000, description: "Lumière divine",             gradient: "from-amber-300 to-purple-600"  },
];

export const SHOP_STICKERS: ShopItem[] = [
  { id: "sticker_pizza",   name: "Pizza",    emoji: "🍕", type: "sticker", rarity: "common",    price: 30,  description: "Pour les gourmands"    },
  { id: "sticker_cat",     name: "Chat",     emoji: "🐱", type: "sticker", rarity: "common",    price: 30,  description: "Miaou !"               },
  { id: "sticker_robot",   name: "Robot",    emoji: "🤖", type: "sticker", rarity: "common",    price: 30,  description: "Bip bop !"             },
  { id: "sticker_alien",   name: "Alien",    emoji: "👽", type: "sticker", rarity: "rare",      price: 100, description: "Venu d'ailleurs"       },
  { id: "sticker_wizard",  name: "Sorcier",  emoji: "🧙", type: "sticker", rarity: "rare",      price: 100, description: "Maître de la magie"    },
  { id: "sticker_ninja",   name: "Ninja",    emoji: "🥷", type: "sticker", rarity: "rare",      price: 100, description: "Discret et rapide"     },
  { id: "sticker_dragon",  name: "Dragon",   emoji: "🐉", type: "sticker", rarity: "epic",      price: 300, description: "Gardien des trésors"   },
  { id: "sticker_unicorn", name: "Licorne",  emoji: "🦄", type: "sticker", rarity: "epic",      price: 300, description: "Magie arc-en-ciel"     },
  { id: "sticker_phoenix", name: "Phénix",   emoji: "🦅", type: "sticker", rarity: "legendary", price: 800, description: "Renaît de ses cendres" },
  { id: "sticker_titan",   name: "Titan",    emoji: "⚔️", type: "sticker", rarity: "legendary", price: 800, description: "Puissance infinie"     },
];

const KEY_OWNED    = "pythonkids_shop_owned";
const KEY_SKIN     = "pythonkids_equipped_skin";
const KEY_STICKERS = "pythonkids_equipped_stickers";

export function getOwnedShopItems(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_OWNED) ?? "[]"); } catch { return []; }
}

export function getEquippedSkin(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_SKIN);
}

export function getEquippedStickers(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_STICKERS) ?? "[]"); } catch { return []; }
}

export function purchaseItem(itemId: string): boolean {
  const item = [...SHOP_SKINS, ...SHOP_STICKERS].find((i) => i.id === itemId);
  if (!item) return false;
  const owned = getOwnedShopItems();
  if (owned.includes(itemId)) return false;
  if (!spendGems(item.price)) return false;
  owned.push(itemId);
  localStorage.setItem(KEY_OWNED, JSON.stringify(owned));
  window.dispatchEvent(new Event("pythonkids:shop"));
  return true;
}

export function equipSkin(skinId: string | null): void {
  if (skinId === null) localStorage.removeItem(KEY_SKIN);
  else localStorage.setItem(KEY_SKIN, skinId);
  window.dispatchEvent(new Event("pythonkids:shop"));
}

export function toggleSticker(stickerId: string): void {
  const stickers = getEquippedStickers();
  const idx = stickers.indexOf(stickerId);
  if (idx === -1) {
    if (stickers.length >= 3) stickers.shift();
    stickers.push(stickerId);
  } else {
    stickers.splice(idx, 1);
  }
  localStorage.setItem(KEY_STICKERS, JSON.stringify(stickers));
  window.dispatchEvent(new Event("pythonkids:shop"));
}

export const RARITY_COLORS_SHOP: Record<ShopRarity, string> = {
  common:    "from-gray-400 to-slate-500",
  rare:      "from-blue-500 to-cyan-500",
  epic:      "from-purple-500 to-violet-600",
  legendary: "from-yellow-400 to-orange-500",
};

export const RARITY_LABELS_SHOP: Record<ShopRarity, string> = {
  common:    "Commun",
  rare:      "Rare",
  epic:      "Épique",
  legendary: "Légendaire",
};

export const RARITY_BORDER_SHOP: Record<ShopRarity, string> = {
  common:    "border-gray-300 dark:border-slate-600",
  rare:      "border-blue-400",
  epic:      "border-purple-500",
  legendary: "border-yellow-400",
};
