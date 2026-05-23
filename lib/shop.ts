import { spendGems } from "./gems";

export type ShopRarity = "common" | "rare" | "epic" | "legendary";
export type ShopItemType = "skin" | "sticker" | "title";

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  type: ShopItemType;
  rarity: ShopRarity;
  price: number;
  description: string;
  gradient?: string;
  tagText?: string;
  secret?: boolean;
  battlePass?: boolean;
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
  // Commun (suite)
  { id: "skin_peach",     name: "Pêche",              emoji: "🍑", type: "skin", rarity: "common",    price: 50,   description: "Douceur fruitée",               gradient: "from-orange-300 to-rose-300"    },
  { id: "skin_lavender",  name: "Lavande",             emoji: "💜", type: "skin", rarity: "common",    price: 50,   description: "Sérénité violette",             gradient: "from-purple-300 to-indigo-300"  },
  { id: "skin_slate",     name: "Ardoise",             emoji: "🪨", type: "skin", rarity: "common",    price: 50,   description: "Élégance sobre",                gradient: "from-slate-400 to-gray-500"     },
  { id: "skin_coral",     name: "Corail",              emoji: "🪸", type: "skin", rarity: "common",    price: 50,   description: "Récif coloré",                  gradient: "from-red-300 to-orange-300"     },
  // Rare (suite)
  { id: "skin_arctic",    name: "Arctique",            emoji: "🧊", type: "skin", rarity: "rare",      price: 150,  description: "Froid polaire",                 gradient: "from-sky-200 to-blue-400"       },
  { id: "skin_swamp",     name: "Marécage",            emoji: "🌿", type: "skin", rarity: "rare",      price: 150,  description: "Profondeurs mystérieuses",      gradient: "from-green-700 to-teal-900"     },
  { id: "skin_molten",    name: "Métal fondu",         emoji: "⚙️", type: "skin", rarity: "rare",      price: 150,  description: "Fusion métallique",             gradient: "from-zinc-400 to-slate-600"     },
  { id: "skin_rose_gold", name: "Or rose",             emoji: "✨", type: "skin", rarity: "rare",      price: 150,  description: "Luxe nacré",                    gradient: "from-rose-300 to-amber-300"     },
  // Épique (suite)
  { id: "skin_abyssal",   name: "Abyssal",             emoji: "🌊", type: "skin", rarity: "epic",      price: 400,  description: "Profondeurs insondables",       gradient: "from-blue-900 to-cyan-900"      },
  { id: "skin_glitch",    name: "Glitch",              emoji: "📺", type: "skin", rarity: "epic",      price: 400,  description: "Bug stylisé",                   gradient: "from-red-500 via-green-500 to-blue-500" },
  // Légendaire (suite)
  { id: "skin_prism",     name: "Prisme",              emoji: "🔷", type: "skin", rarity: "legendary", price: 1000, description: "Arc-en-ciel pur",               gradient: "from-violet-500 via-cyan-400 to-rose-400" },
  { id: "skin_eclipse",   name: "Éclipse",             emoji: "🌑", type: "skin", rarity: "legendary", price: 1000, description: "Soleil et lune fusionnés",      gradient: "from-yellow-300 via-gray-900 to-indigo-900" },
  // Skin secret — uniquement via code promo
  { id: "skin_serpent",   name: "Écailles de Serpent", emoji: "🐍", type: "skin", rarity: "legendary", price: 0, description: "Le skin légendaire des vrais Pythonistes", gradient: "from-green-900 via-emerald-600 to-lime-400", secret: true },
  // Skins exclusifs Pass de Combat
  { id: "bp_skin_storm",    name: "Tempête",   emoji: "🌪️", type: "skin", rarity: "rare",      price: 0, description: "Les vents du pass",        gradient: "from-slate-500 to-blue-600",              battlePass: true },
  { id: "bp_skin_frost",    name: "Givre",     emoji: "❄️", type: "skin", rarity: "rare",      price: 0, description: "Froid du pass premium",    gradient: "from-sky-300 to-blue-500",                battlePass: true },
  { id: "bp_skin_ember",    name: "Braise",    emoji: "🔥", type: "skin", rarity: "epic",      price: 0, description: "Flammes du pass",          gradient: "from-orange-600 to-red-900",              battlePass: true },
  { id: "bp_skin_spectral", name: "Spectral",  emoji: "👻", type: "skin", rarity: "epic",      price: 0, description: "Ombre du pass premium",    gradient: "from-violet-400 to-slate-700",            battlePass: true },
  { id: "bp_skin_absolute", name: "Absolu",    emoji: "⚡", type: "skin", rarity: "legendary", price: 0, description: "La récompense ultime",     gradient: "from-yellow-500 via-purple-500 to-cyan-500", battlePass: true },
  { id: "bp_skin_eternal",  name: "Éternel",   emoji: "🌌", type: "skin", rarity: "legendary", price: 0, description: "Récompense ultime premium", gradient: "from-indigo-900 via-purple-700 to-pink-600", battlePass: true },
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
  { id: "sticker_phoenix", name: "Phénix",       emoji: "🦅", type: "sticker", rarity: "legendary", price: 800, description: "Renaît de ses cendres"    },
  { id: "sticker_titan",   name: "Titan",        emoji: "⚔️", type: "sticker", rarity: "legendary", price: 800, description: "Puissance infinie"        },
  { id: "sticker_crown",   name: "Couronne",     emoji: "👑", type: "sticker", rarity: "legendary", price: 800, description: "Le roi du Python"         },
  { id: "sticker_galaxy",  name: "Galaxie",      emoji: "🌌", type: "sticker", rarity: "legendary", price: 800, description: "Maître de l'univers"      },
  // Commun (suite)
  { id: "sticker_frog",    name: "Grenouille",   emoji: "🐸", type: "sticker", rarity: "common",    price: 30,  description: "Coâ coâ !"                },
  { id: "sticker_fire",    name: "Feu",          emoji: "🔥", type: "sticker", rarity: "common",    price: 30,  description: "En feu !"                 },
  { id: "sticker_rainbow", name: "Arc-en-ciel",  emoji: "🌈", type: "sticker", rarity: "common",    price: 30,  description: "Après la pluie"           },
  { id: "sticker_sun",     name: "Soleil",       emoji: "☀️", type: "sticker", rarity: "common",    price: 30,  description: "Rayonnant"                },
  { id: "sticker_bug",     name: "Bug",          emoji: "🐛", type: "sticker", rarity: "common",    price: 30,  description: "Débogueur en chef"        },
  { id: "sticker_heart",   name: "Coeur",        emoji: "❤️", type: "sticker", rarity: "common",    price: 30,  description: "Code avec amour"          },
  // Rare (suite)
  { id: "sticker_owl",     name: "Hibou",        emoji: "🦉", type: "sticker", rarity: "rare",      price: 100, description: "Sage et discret"          },
  { id: "sticker_crystal2",name: "Gemme bleue",  emoji: "💠", type: "sticker", rarity: "rare",      price: 100, description: "Précieux et rare"         },
  { id: "sticker_thunder", name: "Foudre",       emoji: "⚡", type: "sticker", rarity: "rare",      price: 100, description: "Vitesse éclair"           },
  { id: "sticker_fox",     name: "Renard",       emoji: "🦊", type: "sticker", rarity: "rare",      price: 100, description: "Rusé et malin"            },
  // Épique (suite)
  { id: "sticker_wolf",    name: "Loup",         emoji: "🐺", type: "sticker", rarity: "epic",      price: 300, description: "Solitaire et puissant"    },
  { id: "sticker_saturn",  name: "Saturne",      emoji: "🪐", type: "sticker", rarity: "epic",      price: 300, description: "Planète mystérieuse"      },
  // Légendaire (suite)
  { id: "sticker_angel",   name: "Ange",         emoji: "👼", type: "sticker", rarity: "legendary", price: 800, description: "Messager céleste"         },
  { id: "sticker_infinity", name: "Infini",      emoji: "♾️", type: "sticker", rarity: "legendary", price: 800, description: "Sans limites"             },
  // Stickers exclusifs Pass de Combat
  { id: "bp_sticker_shield",      name: "Bouclier",         emoji: "🛡️", type: "sticker", rarity: "common",    price: 0, description: "Défense du pass",        battlePass: true },
  { id: "bp_sticker_blade",       name: "Lame",             emoji: "🗡️", type: "sticker", rarity: "rare",      price: 0, description: "Attaque du pass",        battlePass: true },
  { id: "bp_sticker_star_gold",   name: "Étoile d'or",      emoji: "🌟", type: "sticker", rarity: "epic",      price: 0, description: "Éclat du pass",          battlePass: true },
  { id: "bp_sticker_champion",    name: "Champion",         emoji: "🏆", type: "sticker", rarity: "legendary", price: 0, description: "Gloire du pass",         battlePass: true },
  { id: "bp_sticker_thunder_bp",  name: "Foudre de Guerre", emoji: "⚡", type: "sticker", rarity: "epic",      price: 0, description: "Puissance premium",      battlePass: true },
];

export const SHOP_TITLES: ShopItem[] = [
  // Commun
  { id: "title_coder",       name: "Codeur en herbe",      emoji: "🌱", type: "title", rarity: "common",    price: 60,   description: "Pour les débutants motivés",          gradient: "from-green-400 to-emerald-500",     tagText: "Codeur en herbe"     },
  { id: "title_explorer",    name: "Explorateur",          emoji: "🔭", type: "title", rarity: "common",    price: 60,   description: "Curieux de nature",                   gradient: "from-cyan-400 to-blue-500",         tagText: "Explorateur"         },
  { id: "title_bug_hunter",  name: "Chasseur de bugs",     emoji: "🐛", type: "title", rarity: "common",    price: 60,   description: "Tu débogues comme un pro !",           gradient: "from-orange-400 to-amber-500",      tagText: "Chasseur de bugs"    },
  { id: "title_collector",   name: "Collectionneur",       emoji: "🏅", type: "title", rarity: "common",    price: 60,   description: "Accumule les badges et stickers",     gradient: "from-yellow-400 to-orange-400",     tagText: "Collectionneur"      },
  { id: "title_night_coder", name: "Codeur nocturne",      emoji: "🌙", type: "title", rarity: "common",    price: 60,   description: "La nuit appartient aux coders",        gradient: "from-indigo-500 to-slate-600",      tagText: "Codeur nocturne"     },
  // Rare
  { id: "title_pythoniste",  name: "Pythoniste",           emoji: "🐍", type: "title", rarity: "rare",      price: 180,  description: "Tu maîtrises le serpent !",            gradient: "from-green-500 to-teal-600",        tagText: "Pythoniste"          },
  { id: "title_loop_master", name: "Maître des boucles",   emoji: "🔄", type: "title", rarity: "rare",      price: 180,  description: "Aucune boucle ne te résiste",          gradient: "from-blue-500 to-indigo-600",       tagText: "Maître des boucles"  },
  { id: "title_streak",      name: "Gardien du streak",    emoji: "🔥", type: "title", rarity: "rare",      price: 180,  description: "La régularité, c'est ton truc",        gradient: "from-orange-500 to-red-500",        tagText: "Gardien du streak"   },
  { id: "title_challenger",  name: "Champion des défis",   emoji: "🎯", type: "title", rarity: "rare",      price: 180,  description: "Les défis n'ont aucun secret pour toi", gradient: "from-pink-500 to-rose-500",         tagText: "Champion des défis"  },
  { id: "title_architect",   name: "Architecte Python",    emoji: "🏗️", type: "title", rarity: "rare",      price: 180,  description: "Tu structures ton code comme un bâtisseur", gradient: "from-violet-500 to-purple-600",  tagText: "Architecte Python"   },
  // Épique
  { id: "title_ninja",       name: "Ninja du clavier",     emoji: "🥷", type: "title", rarity: "epic",      price: 450,  description: "Discret, rapide, mortel",              gradient: "from-gray-700 to-slate-800",        tagText: "Ninja du clavier"    },
  { id: "title_algo",        name: "Seigneur des algos",   emoji: "🧠", type: "title", rarity: "epic",      price: 450,  description: "Complexité O(1) dans les yeux",        gradient: "from-fuchsia-500 to-violet-700",    tagText: "Seigneur des algos"  },
  { id: "title_dragon",      name: "Dompteur de dragons",  emoji: "🐉", type: "title", rarity: "epic",      price: 450,  description: "Le code n'a aucun secret pour toi",    gradient: "from-red-600 to-orange-700",        tagText: "Dompteur de dragons" },
  // Légendaire
  { id: "title_legend",      name: "Légende Vivante",      emoji: "🌟", type: "title", rarity: "legendary", price: 1200, description: "On raconte des histoires sur toi",      gradient: "from-yellow-400 to-amber-500",      tagText: "Légende Vivante"     },
  { id: "title_god",         name: "Dieu du Code",         emoji: "⚡", type: "title", rarity: "legendary", price: 1200, description: "Python n'a plus aucun secret pour toi", gradient: "from-purple-600 to-pink-600",       tagText: "Dieu du Code"        },
  // Titres exclusifs Pass de Combat
  { id: "bp_title_fighter",       name: "Combattant",        emoji: "⚔️",  type: "title", rarity: "common",    price: 0, description: "Guerrier du pass",         gradient: "from-red-400 to-orange-500",       tagText: "Combattant",         battlePass: true },
  { id: "bp_title_veteran",       name: "Vétéran",           emoji: "🎖️",  type: "title", rarity: "rare",      price: 0, description: "Expérimenté du pass",      gradient: "from-teal-500 to-cyan-600",        tagText: "Vétéran",            battlePass: true },
  { id: "bp_title_champion_pass", name: "Champion du Pass",  emoji: "🏆",  type: "title", rarity: "epic",      price: 0, description: "Élite des combattants",    gradient: "from-yellow-500 to-amber-600",     tagText: "Champion du Pass",   battlePass: true },
  { id: "bp_title_conqueror",     name: "Conquérant",        emoji: "👑",  type: "title", rarity: "legendary", price: 0, description: "Maître absolu du pass",    gradient: "from-purple-600 to-pink-700",      tagText: "Conquérant",         battlePass: true },
  { id: "bp_title_elite",         name: "Élite du Pass",     emoji: "💎",  type: "title", rarity: "legendary", price: 0, description: "Légende premium du pass",  gradient: "from-sky-400 to-indigo-600",       tagText: "Élite du Pass",      battlePass: true },
];

const KEY_OWNED    = "pythonkids_shop_owned";
const KEY_SKIN     = "pythonkids_equipped_skin";
const KEY_STICKERS = "pythonkids_equipped_stickers";
const KEY_TITLE    = "pythonkids_equipped_title";

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

export function grantItem(itemId: string): boolean {
  const owned = getOwnedShopItems();
  if (owned.includes(itemId)) return false;
  owned.push(itemId);
  localStorage.setItem(KEY_OWNED, JSON.stringify(owned));
  window.dispatchEvent(new Event("pythonkids:shop"));
  return true;
}

export function getEquippedTitle(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_TITLE);
}

export function equipTitle(titleId: string | null): void {
  if (titleId === null) localStorage.removeItem(KEY_TITLE);
  else localStorage.setItem(KEY_TITLE, titleId);
  window.dispatchEvent(new Event("pythonkids:shop"));
}

export function purchaseItem(itemId: string): boolean {
  const item = [...SHOP_SKINS, ...SHOP_STICKERS, ...SHOP_TITLES].find((i) => i.id === itemId);
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

export function toggleTitle(titleId: string): void {
  const current = getEquippedTitle();
  equipTitle(current === titleId ? null : titleId);
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
