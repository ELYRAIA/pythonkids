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
  // Commun
  { id: "skin_sunset",    name: "Coucher de soleil", emoji: "🌅", type: "skin", rarity: "common",    price: 50,   description: "Teintes chaudes du soir",       gradient: "from-orange-400 to-pink-500"    },
  { id: "skin_ocean",     name: "Océan",             emoji: "🌊", type: "skin", rarity: "common",    price: 50,   description: "Vagues bleues infinies",        gradient: "from-blue-400 to-cyan-500"      },
  { id: "skin_forest",    name: "Forêt",             emoji: "🌿", type: "skin", rarity: "common",    price: 50,   description: "Verdure apaisante",             gradient: "from-green-400 to-emerald-600"  },
  { id: "skin_candy",     name: "Bonbon",            emoji: "🍬", type: "skin", rarity: "common",    price: 50,   description: "Douceur sucrée",                gradient: "from-pink-300 to-rose-400"      },
  { id: "skin_thunder",   name: "Tonnerre",          emoji: "⚡", type: "skin", rarity: "common",    price: 50,   description: "Énergie électrisante",          gradient: "from-yellow-300 to-amber-500"   },
  { id: "skin_mint",      name: "Menthe",            emoji: "🌱", type: "skin", rarity: "common",    price: 50,   description: "Fraîcheur mentholée",           gradient: "from-emerald-300 to-teal-400"   },
  // Rare
  { id: "skin_volcano",   name: "Volcan",            emoji: "🌋", type: "skin", rarity: "rare",      price: 150,  description: "Énergie bouillonnante",         gradient: "from-red-500 to-orange-600"     },
  { id: "skin_aurora",    name: "Aurore boréale",    emoji: "🌌", type: "skin", rarity: "rare",      price: 150,  description: "Lumières nordiques",            gradient: "from-teal-400 to-purple-600"    },
  { id: "skin_midnight",  name: "Minuit",            emoji: "🌙", type: "skin", rarity: "rare",      price: 150,  description: "Mystères de la nuit",           gradient: "from-slate-600 to-indigo-900"   },
  { id: "skin_sakura",    name: "Sakura",            emoji: "🌸", type: "skin", rarity: "rare",      price: 150,  description: "Fleurs de cerisier japonaises", gradient: "from-pink-400 to-fuchsia-500"   },
  { id: "skin_galaxy",    name: "Galaxie",           emoji: "🌠", type: "skin", rarity: "rare",      price: 150,  description: "Étoiles filantes",              gradient: "from-indigo-500 to-purple-800"  },
  { id: "skin_lava",      name: "Lave",              emoji: "🔴", type: "skin", rarity: "rare",      price: 150,  description: "Roche en fusion",               gradient: "from-rose-600 to-red-800"       },
  // Épique
  { id: "skin_neon",      name: "Néon",              emoji: "🔮", type: "skin", rarity: "epic",      price: 400,  description: "Éclat électrique",              gradient: "from-fuchsia-500 to-cyan-500"   },
  { id: "skin_cosmic",    name: "Cosmique",          emoji: "🚀", type: "skin", rarity: "epic",      price: 400,  description: "Voyage dans l'univers",         gradient: "from-violet-600 to-blue-900"    },
  { id: "skin_toxic",     name: "Toxique",           emoji: "☢️", type: "skin", rarity: "epic",      price: 400,  description: "Vert radioactif",               gradient: "from-lime-400 to-green-700"     },
  { id: "skin_rainbow",   name: "Arc-en-ciel",       emoji: "🌈", type: "skin", rarity: "epic",      price: 400,  description: "Toutes les couleurs",           gradient: "from-red-400 via-yellow-400 to-blue-500" },
  // Légendaire
  { id: "skin_inferno",   name: "Enfer",             emoji: "🔥", type: "skin", rarity: "legendary", price: 1000, description: "Flammes légendaires",           gradient: "from-red-600 to-yellow-400"     },
  { id: "skin_celestial", name: "Céleste",           emoji: "✨", type: "skin", rarity: "legendary", price: 1000, description: "Lumière divine",                gradient: "from-amber-300 to-purple-600"   },
  { id: "skin_diamond",   name: "Diamant",           emoji: "💎", type: "skin", rarity: "legendary", price: 1000, description: "Pureté cristalline",            gradient: "from-sky-200 to-indigo-400"     },
  { id: "skin_void",      name: "Néant",             emoji: "🌑", type: "skin", rarity: "legendary", price: 1000, description: "L'obscurité absolue",           gradient: "from-gray-900 to-slate-950"     },
];

export const SHOP_STICKERS: ShopItem[] = [
  // Commun
  { id: "sticker_pizza",   name: "Pizza",      emoji: "🍕", type: "sticker", rarity: "common",    price: 30,  description: "Pour les gourmands"       },
  { id: "sticker_cat",     name: "Chat",       emoji: "🐱", type: "sticker", rarity: "common",    price: 30,  description: "Miaou !"                  },
  { id: "sticker_robot",   name: "Robot",      emoji: "🤖", type: "sticker", rarity: "common",    price: 30,  description: "Bip bop !"                },
  { id: "sticker_dino",    name: "Dinosaure",  emoji: "🦕", type: "sticker", rarity: "common",    price: 30,  description: "RAWR !"                   },
  { id: "sticker_panda",   name: "Panda",      emoji: "🐼", type: "sticker", rarity: "common",    price: 30,  description: "Trop mignon"              },
  { id: "sticker_cactus",  name: "Cactus",     emoji: "🌵", type: "sticker", rarity: "common",    price: 30,  description: "Piquant mais cool"        },
  { id: "sticker_burger",  name: "Burger",     emoji: "🍔", type: "sticker", rarity: "common",    price: 30,  description: "Miam !"                   },
  { id: "sticker_star",    name: "Étoile",     emoji: "⭐", type: "sticker", rarity: "common",    price: 30,  description: "Tu brilles"               },
  // Rare
  { id: "sticker_alien",   name: "Alien",      emoji: "👽", type: "sticker", rarity: "rare",      price: 100, description: "Venu d'ailleurs"          },
  { id: "sticker_wizard",  name: "Sorcier",    emoji: "🧙", type: "sticker", rarity: "rare",      price: 100, description: "Maître de la magie"       },
  { id: "sticker_ninja",   name: "Ninja",      emoji: "🥷", type: "sticker", rarity: "rare",      price: 100, description: "Discret et rapide"        },
  { id: "sticker_snake",   name: "Serpent",    emoji: "🐍", type: "sticker", rarity: "rare",      price: 100, description: "Le symbole de Python !"   },
  { id: "sticker_trophy",  name: "Trophée",    emoji: "🏆", type: "sticker", rarity: "rare",      price: 100, description: "Pour les champions"       },
  { id: "sticker_ghost",   name: "Fantôme",    emoji: "👻", type: "sticker", rarity: "rare",      price: 100, description: "Bouh !"                   },
  { id: "sticker_rocket",  name: "Fusée",      emoji: "🚀", type: "sticker", rarity: "rare",      price: 100, description: "Vers l'infini"            },
  // Épique
  { id: "sticker_dragon",  name: "Dragon",     emoji: "🐉", type: "sticker", rarity: "epic",      price: 300, description: "Gardien des trésors"      },
  { id: "sticker_unicorn", name: "Licorne",    emoji: "🦄", type: "sticker", rarity: "epic",      price: 300, description: "Magie arc-en-ciel"        },
  { id: "sticker_sword",   name: "Épée",       emoji: "⚔️", type: "sticker", rarity: "epic",      price: 300, description: "Guerrier du code"         },
  { id: "sticker_crystal", name: "Cristal",    emoji: "🔮", type: "sticker", rarity: "epic",      price: 300, description: "Voit l'avenir"            },
  { id: "sticker_meteor",  name: "Météorite",  emoji: "☄️", type: "sticker", rarity: "epic",      price: 300, description: "Impact cosmique"          },
  // Légendaire
  { id: "sticker_phoenix", name: "Phénix",     emoji: "🦅", type: "sticker", rarity: "legendary", price: 800, description: "Renaît de ses cendres"    },
  { id: "sticker_titan",   name: "Titan",      emoji: "⚔️", type: "sticker", rarity: "legendary", price: 800, description: "Puissance infinie"        },
  { id: "sticker_crown",   name: "Couronne",   emoji: "👑", type: "sticker", rarity: "legendary", price: 800, description: "Le roi du Python"         },
  { id: "sticker_galaxy",  name: "Galaxie",    emoji: "🌌", type: "sticker", rarity: "legendary", price: 800, description: "Maître de l'univers"      },
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
