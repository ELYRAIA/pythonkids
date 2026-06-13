import { spendGems } from "./gems";

export type ShopRarity = "common" | "rare" | "epic" | "legendary";
export type ShopItemType = "skin" | "sticker" | "title";

export interface ShopItem {
  id: string;
  name: string;
  name_en?: string;
  emoji: string;
  type: ShopItemType;
  rarity: ShopRarity;
  price: number;
  description: string;
  description_en?: string;
  gradient?: string;
  tagText?: string;
  tagText_en?: string;
  secret?: boolean;
  battlePass?: boolean;
}

export const SHOP_SKINS: ShopItem[] = [
  // Commun
  { id: "skin_sunset",    name: "Coucher de soleil", name_en: "Sunset",          emoji: "🌅", type: "skin", rarity: "common",    price: 50,   description: "Teintes chaudes du soir",       description_en: "Warm evening hues",                    gradient: "from-orange-400 to-pink-500"    },
  { id: "skin_ocean",     name: "Océan",             name_en: "Ocean",           emoji: "🌊", type: "skin", rarity: "common",    price: 50,   description: "Vagues bleues infinies",        description_en: "Infinite blue waves",                  gradient: "from-blue-400 to-cyan-500"      },
  { id: "skin_forest",    name: "Forêt",             name_en: "Forest",          emoji: "🌿", type: "skin", rarity: "common",    price: 50,   description: "Verdure apaisante",             description_en: "Soothing greenery",                    gradient: "from-green-400 to-emerald-600"  },
  { id: "skin_candy",     name: "Bonbon",            name_en: "Candy",           emoji: "🍬", type: "skin", rarity: "common",    price: 50,   description: "Douceur sucrée",                description_en: "Sweet sugary softness",                gradient: "from-pink-300 to-rose-400"      },
  { id: "skin_thunder",   name: "Tonnerre",          name_en: "Thunder",         emoji: "⚡", type: "skin", rarity: "common",    price: 50,   description: "Énergie électrisante",          description_en: "Electrifying energy",                  gradient: "from-yellow-300 to-amber-500"   },
  { id: "skin_mint",      name: "Menthe",            name_en: "Mint",            emoji: "🌱", type: "skin", rarity: "common",    price: 50,   description: "Fraîcheur mentholée",           description_en: "Cool menthol freshness",               gradient: "from-emerald-300 to-teal-400"   },
  // Rare
  { id: "skin_volcano",   name: "Volcan",            name_en: "Volcano",         emoji: "🌋", type: "skin", rarity: "rare",      price: 150,  description: "Énergie bouillonnante",         description_en: "Boiling energy",                       gradient: "from-red-500 to-orange-600"     },
  { id: "skin_aurora",    name: "Aurore boréale",    name_en: "Aurora Borealis", emoji: "🌌", type: "skin", rarity: "rare",      price: 150,  description: "Lumières nordiques",            description_en: "Northern lights",                      gradient: "from-teal-400 to-purple-600"    },
  { id: "skin_midnight",  name: "Minuit",            name_en: "Midnight",        emoji: "🌙", type: "skin", rarity: "rare",      price: 150,  description: "Mystères de la nuit",           description_en: "Night mysteries",                      gradient: "from-slate-600 to-indigo-900"   },
  { id: "skin_sakura",    name: "Sakura",            name_en: "Sakura",          emoji: "🌸", type: "skin", rarity: "rare",      price: 150,  description: "Fleurs de cerisier japonaises", description_en: "Japanese cherry blossoms",             gradient: "from-pink-400 to-fuchsia-500"   },
  { id: "skin_galaxy",    name: "Galaxie",           name_en: "Galaxy",          emoji: "🌠", type: "skin", rarity: "rare",      price: 150,  description: "Étoiles filantes",              description_en: "Shooting stars",                       gradient: "from-indigo-500 to-purple-800"  },
  { id: "skin_lava",      name: "Lave",              name_en: "Lava",            emoji: "🔴", type: "skin", rarity: "rare",      price: 150,  description: "Roche en fusion",               description_en: "Molten rock",                          gradient: "from-rose-600 to-red-800"       },
  // Épique
  { id: "skin_neon",      name: "Néon",              name_en: "Neon",            emoji: "🔮", type: "skin", rarity: "epic",      price: 400,  description: "Éclat électrique",              description_en: "Electric glow",                        gradient: "from-fuchsia-500 to-cyan-500"   },
  { id: "skin_cosmic",    name: "Cosmique",          name_en: "Cosmic",          emoji: "🚀", type: "skin", rarity: "epic",      price: 400,  description: "Voyage dans l'univers",         description_en: "Journey through the universe",         gradient: "from-violet-600 to-blue-900"    },
  { id: "skin_toxic",     name: "Toxique",           name_en: "Toxic",           emoji: "☢️", type: "skin", rarity: "epic",      price: 400,  description: "Vert radioactif",               description_en: "Radioactive green",                    gradient: "from-lime-400 to-green-700"     },
  { id: "skin_rainbow",   name: "Arc-en-ciel",       name_en: "Rainbow",         emoji: "🌈", type: "skin", rarity: "epic",      price: 400,  description: "Toutes les couleurs",           description_en: "All the colors",                       gradient: "from-red-400 via-yellow-400 to-blue-500" },
  // Légendaire
  { id: "skin_inferno",   name: "Enfer",             name_en: "Inferno",         emoji: "🔥", type: "skin", rarity: "legendary", price: 1000, description: "Flammes légendaires",           description_en: "Legendary flames",                     gradient: "from-red-600 to-yellow-400"     },
  { id: "skin_celestial", name: "Céleste",           name_en: "Celestial",       emoji: "✨", type: "skin", rarity: "legendary", price: 1000, description: "Lumière divine",                description_en: "Divine light",                         gradient: "from-amber-300 to-purple-600"   },
  { id: "skin_diamond",   name: "Diamant",           name_en: "Diamond",         emoji: "💎", type: "skin", rarity: "legendary", price: 1000, description: "Pureté cristalline",            description_en: "Crystal purity",                       gradient: "from-sky-200 to-indigo-400"     },
  { id: "skin_void",      name: "Néant",             name_en: "Void",            emoji: "🌑", type: "skin", rarity: "legendary", price: 1000, description: "L'obscurité absolue",           description_en: "Absolute darkness",                    gradient: "from-gray-900 to-slate-950"     },
  // Commun (suite)
  { id: "skin_peach",     name: "Pêche",             name_en: "Peach",           emoji: "🍑", type: "skin", rarity: "common",    price: 50,   description: "Douceur fruitée",               description_en: "Fruity softness",                      gradient: "from-orange-300 to-rose-300"    },
  { id: "skin_lavender",  name: "Lavande",           name_en: "Lavender",        emoji: "💜", type: "skin", rarity: "common",    price: 50,   description: "Sérénité violette",             description_en: "Purple serenity",                      gradient: "from-purple-300 to-indigo-300"  },
  { id: "skin_slate",     name: "Ardoise",           name_en: "Slate",           emoji: "🪨", type: "skin", rarity: "common",    price: 50,   description: "Élégance sobre",                description_en: "Understated elegance",                 gradient: "from-slate-400 to-gray-500"     },
  { id: "skin_coral",     name: "Corail",            name_en: "Coral",           emoji: "🪸", type: "skin", rarity: "common",    price: 50,   description: "Récif coloré",                  description_en: "Colorful reef",                        gradient: "from-red-300 to-orange-300"     },
  // Rare (suite)
  { id: "skin_arctic",    name: "Arctique",          name_en: "Arctic",          emoji: "🧊", type: "skin", rarity: "rare",      price: 150,  description: "Froid polaire",                 description_en: "Polar cold",                           gradient: "from-sky-200 to-blue-400"       },
  { id: "skin_swamp",     name: "Marécage",          name_en: "Swamp",           emoji: "🌿", type: "skin", rarity: "rare",      price: 150,  description: "Profondeurs mystérieuses",      description_en: "Mysterious depths",                    gradient: "from-green-700 to-teal-900"     },
  { id: "skin_molten",    name: "Métal fondu",       name_en: "Molten Metal",    emoji: "⚙️", type: "skin", rarity: "rare",      price: 150,  description: "Fusion métallique",             description_en: "Metallic fusion",                      gradient: "from-zinc-400 to-slate-600"     },
  { id: "skin_rose_gold", name: "Or rose",           name_en: "Rose Gold",       emoji: "✨", type: "skin", rarity: "rare",      price: 150,  description: "Luxe nacré",                    description_en: "Pearly luxury",                        gradient: "from-rose-300 to-amber-300"     },
  // Épique (suite)
  { id: "skin_abyssal",   name: "Abyssal",           name_en: "Abyssal",         emoji: "🌊", type: "skin", rarity: "epic",      price: 400,  description: "Profondeurs insondables",       description_en: "Unfathomable depths",                  gradient: "from-blue-900 to-cyan-900"      },
  { id: "skin_glitch",    name: "Glitch",            name_en: "Glitch",          emoji: "📺", type: "skin", rarity: "epic",      price: 400,  description: "Bug stylisé",                   description_en: "Stylized bug",                         gradient: "from-red-500 via-green-500 to-blue-500" },
  // Légendaire (suite)
  { id: "skin_prism",     name: "Prisme",            name_en: "Prism",           emoji: "🔷", type: "skin", rarity: "legendary", price: 1000, description: "Arc-en-ciel pur",               description_en: "Pure rainbow",                         gradient: "from-violet-500 via-cyan-400 to-rose-400" },
  { id: "skin_eclipse",   name: "Éclipse",           name_en: "Eclipse",         emoji: "🌑", type: "skin", rarity: "legendary", price: 1000, description: "Soleil et lune fusionnés",      description_en: "Sun and moon fused",                   gradient: "from-yellow-300 via-gray-900 to-indigo-900" },
  // Skin secret — uniquement via code promo
  { id: "skin_serpent",   name: "Écailles de Serpent", name_en: "Serpent Scales", emoji: "🐍", type: "skin", rarity: "legendary", price: 0, description: "Le skin légendaire des vrais Pythonistes", description_en: "The legendary skin for true Pythonistas", gradient: "from-green-900 via-emerald-600 to-lime-400", secret: true },
  // Skins exclusifs Pass de Combat
  { id: "bp_skin_storm",    name: "Tempête",   name_en: "Storm",    emoji: "🌪️", type: "skin", rarity: "rare",      price: 0, description: "Les vents du pass",         description_en: "Pass winds",                gradient: "from-slate-500 to-blue-600",              battlePass: true },
  { id: "bp_skin_frost",    name: "Givre",     name_en: "Frost",    emoji: "❄️", type: "skin", rarity: "rare",      price: 0, description: "Froid du pass premium",     description_en: "Premium pass cold",         gradient: "from-sky-300 to-blue-500",                battlePass: true },
  { id: "bp_skin_ember",    name: "Braise",    name_en: "Ember",    emoji: "🔥", type: "skin", rarity: "epic",      price: 0, description: "Flammes du pass",           description_en: "Pass flames",               gradient: "from-orange-600 to-red-900",              battlePass: true },
  { id: "bp_skin_spectral", name: "Spectral",  name_en: "Spectral", emoji: "👻", type: "skin", rarity: "epic",      price: 0, description: "Ombre du pass premium",     description_en: "Premium pass shadow",       gradient: "from-violet-400 to-slate-700",            battlePass: true },
  { id: "bp_skin_absolute", name: "Absolu",    name_en: "Absolute", emoji: "⚡", type: "skin", rarity: "legendary", price: 0, description: "La récompense ultime",      description_en: "The ultimate reward",       gradient: "from-yellow-500 via-purple-500 to-cyan-500", battlePass: true },
  { id: "bp_skin_eternal",  name: "Éternel",   name_en: "Eternal",  emoji: "🌌", type: "skin", rarity: "legendary", price: 0, description: "Récompense ultime premium", description_en: "Ultimate premium reward",   gradient: "from-indigo-900 via-purple-700 to-pink-600", battlePass: true },
];

export const SHOP_STICKERS: ShopItem[] = [
  // Commun
  { id: "sticker_pizza",   name: "Pizza",      name_en: "Pizza",      emoji: "🍕", type: "sticker", rarity: "common",    price: 30,  description: "Pour les gourmands",      description_en: "For the foodies"       },
  { id: "sticker_cat",     name: "Chat",       name_en: "Cat",        emoji: "🐱", type: "sticker", rarity: "common",    price: 30,  description: "Miaou !",                 description_en: "Meow!"                 },
  { id: "sticker_robot",   name: "Robot",      name_en: "Robot",      emoji: "🤖", type: "sticker", rarity: "common",    price: 30,  description: "Bip bop !",               description_en: "Beep boop!"            },
  { id: "sticker_dino",    name: "Dinosaure",  name_en: "Dinosaur",   emoji: "🦕", type: "sticker", rarity: "common",    price: 30,  description: "RAWR !",                  description_en: "RAWR!"                 },
  { id: "sticker_panda",   name: "Panda",      name_en: "Panda",      emoji: "🐼", type: "sticker", rarity: "common",    price: 30,  description: "Trop mignon",             description_en: "So cute"               },
  { id: "sticker_cactus",  name: "Cactus",     name_en: "Cactus",     emoji: "🌵", type: "sticker", rarity: "common",    price: 30,  description: "Piquant mais cool",       description_en: "Spiky but cool"        },
  { id: "sticker_burger",  name: "Burger",     name_en: "Burger",     emoji: "🍔", type: "sticker", rarity: "common",    price: 30,  description: "Miam !",                  description_en: "Yum!"                  },
  { id: "sticker_star",    name: "Étoile",     name_en: "Star",       emoji: "⭐", type: "sticker", rarity: "common",    price: 30,  description: "Tu brilles",              description_en: "You shine"             },
  // Rare
  { id: "sticker_alien",   name: "Alien",      name_en: "Alien",      emoji: "👽", type: "sticker", rarity: "rare",      price: 100, description: "Venu d'ailleurs",         description_en: "From another world"    },
  { id: "sticker_wizard",  name: "Sorcier",    name_en: "Wizard",     emoji: "🧙", type: "sticker", rarity: "rare",      price: 100, description: "Maître de la magie",      description_en: "Master of magic"       },
  { id: "sticker_ninja",   name: "Ninja",      name_en: "Ninja",      emoji: "🥷", type: "sticker", rarity: "rare",      price: 100, description: "Discret et rapide",       description_en: "Stealthy and fast"     },
  { id: "sticker_snake",   name: "Serpent",    name_en: "Snake",      emoji: "🐍", type: "sticker", rarity: "rare",      price: 100, description: "Le symbole de Python !",  description_en: "The Python symbol!"    },
  { id: "sticker_trophy",  name: "Trophée",    name_en: "Trophy",     emoji: "🏆", type: "sticker", rarity: "rare",      price: 100, description: "Pour les champions",      description_en: "For champions"         },
  { id: "sticker_ghost",   name: "Fantôme",    name_en: "Ghost",      emoji: "👻", type: "sticker", rarity: "rare",      price: 100, description: "Bouh !",                  description_en: "Boo!"                  },
  { id: "sticker_rocket",  name: "Fusée",      name_en: "Rocket",     emoji: "🚀", type: "sticker", rarity: "rare",      price: 100, description: "Vers l'infini",           description_en: "To infinity"           },
  // Épique
  { id: "sticker_dragon",  name: "Dragon",     name_en: "Dragon",     emoji: "🐉", type: "sticker", rarity: "epic",      price: 300, description: "Gardien des trésors",     description_en: "Guardian of treasures" },
  { id: "sticker_unicorn", name: "Licorne",    name_en: "Unicorn",    emoji: "🦄", type: "sticker", rarity: "epic",      price: 300, description: "Magie arc-en-ciel",       description_en: "Rainbow magic"         },
  { id: "sticker_sword",   name: "Épée",       name_en: "Sword",      emoji: "⚔️", type: "sticker", rarity: "epic",      price: 300, description: "Guerrier du code",        description_en: "Code warrior"          },
  { id: "sticker_crystal", name: "Cristal",    name_en: "Crystal",    emoji: "🔮", type: "sticker", rarity: "epic",      price: 300, description: "Voit l'avenir",           description_en: "Sees the future"       },
  { id: "sticker_meteor",  name: "Météorite",  name_en: "Meteor",     emoji: "☄️", type: "sticker", rarity: "epic",      price: 300, description: "Impact cosmique",         description_en: "Cosmic impact"         },
  // Légendaire
  { id: "sticker_phoenix", name: "Phénix",       name_en: "Phoenix",   emoji: "🦅", type: "sticker", rarity: "legendary", price: 800, description: "Renaît de ses cendres",   description_en: "Rises from the ashes"  },
  { id: "sticker_titan",   name: "Titan",        name_en: "Titan",     emoji: "⚔️", type: "sticker", rarity: "legendary", price: 800, description: "Puissance infinie",       description_en: "Infinite power"        },
  { id: "sticker_crown",   name: "Couronne",     name_en: "Crown",     emoji: "👑", type: "sticker", rarity: "legendary", price: 800, description: "Le roi du Python",        description_en: "The Python king"       },
  { id: "sticker_galaxy",  name: "Galaxie",      name_en: "Galaxy",    emoji: "🌌", type: "sticker", rarity: "legendary", price: 800, description: "Maître de l'univers",     description_en: "Master of the universe" },
  // Commun (suite)
  { id: "sticker_frog",    name: "Grenouille",   name_en: "Frog",      emoji: "🐸", type: "sticker", rarity: "common",    price: 30,  description: "Coâ coâ !",              description_en: "Ribbit!"               },
  { id: "sticker_fire",    name: "Feu",          name_en: "Fire",      emoji: "🔥", type: "sticker", rarity: "common",    price: 30,  description: "En feu !",               description_en: "On fire!"              },
  { id: "sticker_rainbow", name: "Arc-en-ciel",  name_en: "Rainbow",   emoji: "🌈", type: "sticker", rarity: "common",    price: 30,  description: "Après la pluie",          description_en: "After the rain"        },
  { id: "sticker_sun",     name: "Soleil",       name_en: "Sun",       emoji: "☀️", type: "sticker", rarity: "common",    price: 30,  description: "Rayonnant",               description_en: "Radiant"               },
  { id: "sticker_bug",     name: "Bug",          name_en: "Bug",       emoji: "🐛", type: "sticker", rarity: "common",    price: 30,  description: "Débogueur en chef",       description_en: "Chief debugger"        },
  { id: "sticker_heart",   name: "Coeur",        name_en: "Heart",     emoji: "❤️", type: "sticker", rarity: "common",    price: 30,  description: "Code avec amour",         description_en: "Code with love"        },
  // Rare (suite)
  { id: "sticker_owl",     name: "Hibou",        name_en: "Owl",       emoji: "🦉", type: "sticker", rarity: "rare",      price: 100, description: "Sage et discret",         description_en: "Wise and quiet"        },
  { id: "sticker_crystal2",name: "Gemme bleue",  name_en: "Blue Gem",  emoji: "💠", type: "sticker", rarity: "rare",      price: 100, description: "Précieux et rare",        description_en: "Precious and rare"     },
  { id: "sticker_thunder", name: "Foudre",       name_en: "Lightning", emoji: "⚡", type: "sticker", rarity: "rare",      price: 100, description: "Vitesse éclair",          description_en: "Lightning speed"       },
  { id: "sticker_fox",     name: "Renard",       name_en: "Fox",       emoji: "🦊", type: "sticker", rarity: "rare",      price: 100, description: "Rusé et malin",           description_en: "Cunning and clever"    },
  // Épique (suite)
  { id: "sticker_wolf",    name: "Loup",         name_en: "Wolf",      emoji: "🐺", type: "sticker", rarity: "epic",      price: 300, description: "Solitaire et puissant",   description_en: "Solitary and powerful" },
  { id: "sticker_saturn",  name: "Saturne",      name_en: "Saturn",    emoji: "🪐", type: "sticker", rarity: "epic",      price: 300, description: "Planète mystérieuse",     description_en: "Mysterious planet"     },
  // Légendaire (suite)
  { id: "sticker_angel",   name: "Ange",         name_en: "Angel",     emoji: "👼", type: "sticker", rarity: "legendary", price: 800, description: "Messager céleste",        description_en: "Celestial messenger"   },
  { id: "sticker_infinity", name: "Infini",      name_en: "Infinity",  emoji: "♾️", type: "sticker", rarity: "legendary", price: 800, description: "Sans limites",            description_en: "Without limits"        },
  // Stickers exclusifs Pass de Combat
  { id: "bp_sticker_shield",      name: "Bouclier",         name_en: "Shield",         emoji: "🛡️", type: "sticker", rarity: "common",    price: 0, description: "Défense du pass",   description_en: "Pass defense",    battlePass: true },
  { id: "bp_sticker_blade",       name: "Lame",             name_en: "Blade",          emoji: "🗡️", type: "sticker", rarity: "rare",      price: 0, description: "Attaque du pass",   description_en: "Pass attack",     battlePass: true },
  { id: "bp_sticker_star_gold",   name: "Étoile d'or",      name_en: "Gold Star",      emoji: "🌟", type: "sticker", rarity: "epic",      price: 0, description: "Éclat du pass",     description_en: "Pass radiance",   battlePass: true },
  { id: "bp_sticker_champion",    name: "Champion",         name_en: "Champion",       emoji: "🏆", type: "sticker", rarity: "legendary", price: 0, description: "Gloire du pass",    description_en: "Pass glory",      battlePass: true },
  { id: "bp_sticker_thunder_bp",  name: "Foudre de Guerre", name_en: "War Lightning",  emoji: "⚡", type: "sticker", rarity: "epic",      price: 0, description: "Puissance premium", description_en: "Premium power",   battlePass: true },
];

export const SHOP_TITLES: ShopItem[] = [
  // Commun
  { id: "title_coder",       name: "Codeur en herbe",      name_en: "Budding Coder",        emoji: "🌱", type: "title", rarity: "common",    price: 60,   description: "Pour les débutants motivés",               description_en: "For motivated beginners",                  gradient: "from-green-400 to-emerald-500",     tagText: "Codeur en herbe",     tagText_en: "Budding Coder"      },
  { id: "title_explorer",    name: "Explorateur",          name_en: "Explorer",             emoji: "🔭", type: "title", rarity: "common",    price: 60,   description: "Curieux de nature",                        description_en: "Curious by nature",                        gradient: "from-cyan-400 to-blue-500",         tagText: "Explorateur",         tagText_en: "Explorer"           },
  { id: "title_bug_hunter",  name: "Chasseur de bugs",     name_en: "Bug Hunter",           emoji: "🐛", type: "title", rarity: "common",    price: 60,   description: "Tu débogues comme un pro !",                description_en: "You debug like a pro!",                    gradient: "from-orange-400 to-amber-500",      tagText: "Chasseur de bugs",    tagText_en: "Bug Hunter"         },
  { id: "title_collector",   name: "Collectionneur",       name_en: "Collector",            emoji: "🏅", type: "title", rarity: "common",    price: 60,   description: "Accumule les badges et stickers",          description_en: "Accumulates badges and stickers",          gradient: "from-yellow-400 to-orange-400",     tagText: "Collectionneur",      tagText_en: "Collector"          },
  { id: "title_night_coder", name: "Codeur nocturne",      name_en: "Night Coder",          emoji: "🌙", type: "title", rarity: "common",    price: 60,   description: "La nuit appartient aux coders",             description_en: "The night belongs to coders",              gradient: "from-indigo-500 to-slate-600",      tagText: "Codeur nocturne",     tagText_en: "Night Coder"        },
  // Rare
  { id: "title_pythoniste",  name: "Pythoniste",           name_en: "Pythonist",            emoji: "🐍", type: "title", rarity: "rare",      price: 180,  description: "Tu maîtrises le serpent !",                 description_en: "You've mastered the snake!",               gradient: "from-green-500 to-teal-600",        tagText: "Pythoniste",          tagText_en: "Pythonist"          },
  { id: "title_loop_master", name: "Maître des boucles",   name_en: "Loop Master",          emoji: "🔄", type: "title", rarity: "rare",      price: 180,  description: "Aucune boucle ne te résiste",               description_en: "No loop can resist you",                   gradient: "from-blue-500 to-indigo-600",       tagText: "Maître des boucles",  tagText_en: "Loop Master"        },
  { id: "title_streak",      name: "Gardien du streak",    name_en: "Streak Guardian",      emoji: "🔥", type: "title", rarity: "rare",      price: 180,  description: "La régularité, c'est ton truc",             description_en: "Consistency is your thing",                gradient: "from-orange-500 to-red-500",        tagText: "Gardien du streak",   tagText_en: "Streak Guardian"    },
  { id: "title_challenger",  name: "Champion des défis",   name_en: "Challenge Champion",   emoji: "🎯", type: "title", rarity: "rare",      price: 180,  description: "Les défis n'ont aucun secret pour toi",    description_en: "Challenges hold no secrets for you",       gradient: "from-pink-500 to-rose-500",         tagText: "Champion des défis",  tagText_en: "Challenge Champion" },
  { id: "title_architect",   name: "Architecte Python",    name_en: "Python Architect",     emoji: "🏗️", type: "title", rarity: "rare",      price: 180,  description: "Tu structures ton code comme un bâtisseur", description_en: "You structure your code like a builder",   gradient: "from-violet-500 to-purple-600",     tagText: "Architecte Python",   tagText_en: "Python Architect"   },
  // Épique
  { id: "title_ninja",       name: "Ninja du clavier",     name_en: "Keyboard Ninja",       emoji: "🥷", type: "title", rarity: "epic",      price: 450,  description: "Discret, rapide, mortel",                  description_en: "Stealthy, fast, deadly",                   gradient: "from-gray-700 to-slate-800",        tagText: "Ninja du clavier",    tagText_en: "Keyboard Ninja"     },
  { id: "title_algo",        name: "Seigneur des algos",   name_en: "Algorithm Lord",       emoji: "🧠", type: "title", rarity: "epic",      price: 450,  description: "Complexité O(1) dans les yeux",            description_en: "O(1) complexity in your eyes",             gradient: "from-fuchsia-500 to-violet-700",    tagText: "Seigneur des algos",  tagText_en: "Algorithm Lord"     },
  { id: "title_dragon",      name: "Dompteur de dragons",  name_en: "Dragon Tamer",         emoji: "🐉", type: "title", rarity: "epic",      price: 450,  description: "Le code n'a aucun secret pour toi",         description_en: "Code holds no secrets for you",            gradient: "from-red-600 to-orange-700",        tagText: "Dompteur de dragons", tagText_en: "Dragon Tamer"       },
  // Légendaire
  { id: "title_legend",      name: "Légende Vivante",      name_en: "Living Legend",        emoji: "🌟", type: "title", rarity: "legendary", price: 1200, description: "On raconte des histoires sur toi",          description_en: "Stories are told about you",               gradient: "from-yellow-400 to-amber-500",      tagText: "Légende Vivante",     tagText_en: "Living Legend"      },
  { id: "title_god",         name: "Dieu du Code",         name_en: "Code God",             emoji: "⚡", type: "title", rarity: "legendary", price: 1200, description: "Python n'a plus aucun secret pour toi",    description_en: "Python holds no more secrets for you",     gradient: "from-purple-600 to-pink-600",       tagText: "Dieu du Code",        tagText_en: "Code God"           },
  // Titres exclusifs Pass de Combat
  { id: "bp_title_fighter",       name: "Combattant",        name_en: "Fighter",        emoji: "⚔️",  type: "title", rarity: "common",    price: 0, description: "Guerrier du pass",         description_en: "Pass warrior",          gradient: "from-red-400 to-orange-500",       tagText: "Combattant",         tagText_en: "Fighter",         battlePass: true },
  { id: "bp_title_veteran",       name: "Vétéran",           name_en: "Veteran",        emoji: "🎖️",  type: "title", rarity: "rare",      price: 0, description: "Expérimenté du pass",      description_en: "Pass experienced",      gradient: "from-teal-500 to-cyan-600",        tagText: "Vétéran",            tagText_en: "Veteran",         battlePass: true },
  { id: "bp_title_champion_pass", name: "Champion du Pass",  name_en: "Pass Champion",  emoji: "🏆",  type: "title", rarity: "epic",      price: 0, description: "Élite des combattants",    description_en: "Combat elite",          gradient: "from-yellow-500 to-amber-600",     tagText: "Champion du Pass",   tagText_en: "Pass Champion",   battlePass: true },
  { id: "bp_title_conqueror",     name: "Conquérant",        name_en: "Conqueror",      emoji: "👑",  type: "title", rarity: "legendary", price: 0, description: "Maître absolu du pass",    description_en: "Absolute pass master",  gradient: "from-purple-600 to-pink-700",      tagText: "Conquérant",         tagText_en: "Conqueror",       battlePass: true },
  { id: "bp_title_elite",         name: "Élite du Pass",     name_en: "Pass Elite",     emoji: "💎",  type: "title", rarity: "legendary", price: 0, description: "Légende premium du pass",  description_en: "Premium pass legend",   gradient: "from-sky-400 to-indigo-600",       tagText: "Élite du Pass",      tagText_en: "Pass Elite",      battlePass: true },
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
