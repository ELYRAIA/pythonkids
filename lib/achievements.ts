import { getProgress } from "./progress";
import { getStreak } from "./streak";
import { LEVELS } from "./levels";
import { CHALLENGES, getCompletedChallenges } from "./challenges";
import { getDuelWins } from "./duels";
import { getOwnedShopItems, getEquippedSkin } from "./shop";
import { calculateScore } from "./score";
import { playAchievementSound } from "./sounds";

export interface Achievement {
  id: string;
  name: string;
  name_en?: string;
  emoji: string;
  desc: string;
  desc_en?: string;
  color: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Leçons
  { id: "first_lesson",   name: "Premier pas",           name_en: "First Step",          emoji: "👶", desc: "Terminer ta première leçon",         desc_en: "Complete your first lesson",         color: "from-green-400 to-emerald-500"    },
  { id: "lessons_10",     name: "Assidu",                name_en: "Dedicated",           emoji: "📚", desc: "10 leçons terminées",               desc_en: "10 lessons completed",               color: "from-blue-400 to-cyan-500"        },
  { id: "lessons_20",     name: "Studieux",              name_en: "Scholar",             emoji: "🎓", desc: "20 leçons terminées",               desc_en: "20 lessons completed",               color: "from-violet-400 to-purple-500"    },
  { id: "lessons_all",    name: "Encyclopédiste",        name_en: "Encyclopedist",       emoji: "🌟", desc: "Toutes les leçons terminées",       desc_en: "All lessons completed",              color: "from-yellow-400 to-orange-500"    },
  // Streak
  { id: "streak_3",       name: "Régulier",              name_en: "Consistent",          emoji: "🔥", desc: "3 jours de streak",                 desc_en: "3-day streak",                       color: "from-orange-400 to-red-500"       },
  { id: "streak_7",       name: "Semaine de feu",        name_en: "Week on Fire",        emoji: "🌋", desc: "7 jours de streak",                 desc_en: "7-day streak",                       color: "from-red-500 to-rose-600"         },
  { id: "streak_30",      name: "Mois légendaire",       name_en: "Legendary Month",     emoji: "👑", desc: "30 jours de streak",                desc_en: "30-day streak",                      color: "from-yellow-400 to-amber-500"     },
  // Défis
  { id: "first_challenge",name: "Challenger",            name_en: "Challenger",          emoji: "🎯", desc: "Réussir ton premier défi",          desc_en: "Complete your first challenge",       color: "from-teal-400 to-cyan-500"        },
  { id: "challenges_5",   name: "Combattant",            name_en: "Fighter",             emoji: "⚔️", desc: "5 défis réussis",                  desc_en: "5 challenges completed",             color: "from-indigo-500 to-purple-600"    },
  { id: "challenges_all", name: "Maître des défis",      name_en: "Challenge Master",    emoji: "🏆", desc: "Tous les défis réussis",            desc_en: "All challenges completed",           color: "from-yellow-500 to-orange-600"    },
  // Duel
  { id: "first_duel_win", name: "Premier sang",          name_en: "First Blood",         emoji: "🗡️", desc: "Gagner ton premier duel",          desc_en: "Win your first duel",                color: "from-red-400 to-pink-500"         },
  { id: "duel_wins_5",    name: "Gladiateur",            name_en: "Gladiator",           emoji: "🛡️", desc: "5 duels gagnés",                   desc_en: "5 duels won",                        color: "from-orange-500 to-red-600"       },
  { id: "duel_wins_10",   name: "Champion",              name_en: "Champion",            emoji: "⚡", desc: "10 duels gagnés",                   desc_en: "10 duels won",                       color: "from-yellow-400 to-red-500"       },
  // Boutique
  { id: "first_purchase", name: "Fashionista",           name_en: "Fashionista",         emoji: "🛒", desc: "Acheter ton premier item",           desc_en: "Buy your first item",                color: "from-pink-400 to-rose-500"        },
  { id: "skin_equipped",  name: "Stylé",                 name_en: "Styled",              emoji: "💅", desc: "Équiper un skin",                   desc_en: "Equip a skin",                       color: "from-fuchsia-400 to-pink-500"     },
  // Score
  { id: "score_1000",     name: "Prometteur",            name_en: "Promising",           emoji: "📈", desc: "Atteindre 1 000 points",            desc_en: "Reach 1,000 points",                 color: "from-sky-400 to-blue-500"         },
  { id: "score_10000",    name: "Expert",                name_en: "Expert",              emoji: "🚀", desc: "Atteindre 10 000 points",           desc_en: "Reach 10,000 points",                color: "from-violet-500 to-purple-700"    },
  // Secret
  { id: "secret_code",    name: "Initié",                name_en: "Initiate",            emoji: "🔮", desc: "Utiliser un code secret",           desc_en: "Use a secret code",                  color: "from-emerald-600 to-green-800"    },
];

const KEY = "pythonkids_achievements";
// Totaux dérivés du contenu réel : restent justes quand on ajoute des niveaux ou des défis.
const TOTAL_LESSONS = LEVELS.reduce((sum, l) => sum + l.lessons, 0);
const TOTAL_CHALLENGES = CHALLENGES.length;

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function unlockAchievement(id: string): boolean {
  const unlocked = getUnlockedAchievements();
  if (unlocked.includes(id)) return false;
  unlocked.push(id);
  localStorage.setItem(KEY, JSON.stringify(unlocked));
  const ach = ACHIEVEMENTS.find((a) => a.id === id);
  if (ach) {
    playAchievementSound();
    const locale = typeof window !== "undefined" && window.location.pathname.split("/")[1] === "en" ? "en" : "fr";
    const achName = locale === "en" ? (ach.name_en ?? ach.name) : ach.name;
    const msg = locale === "en" ? `Achievement unlocked: ${achName}!` : `Succès débloqué : ${achName} !`;
    window.dispatchEvent(new CustomEvent("pythonkids:toast", {
      detail: { msg, emoji: ach.emoji, type: "rank" },
    }));
    window.dispatchEvent(new CustomEvent("pythonkids:achievement", { detail: { id } }));
  }
  return true;
}

export function checkAchievements(extraFlags?: { secretCode?: boolean }): string[] {
  if (typeof window === "undefined") return [];
  const newlyUnlocked: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && unlockAchievement(id)) newlyUnlocked.push(id);
  };

  const progress = getProgress();
  const lessonsDone = Object.values(progress.completedLessons ?? {}).flat().length;
  const streak = getStreak().currentStreak;
  const challengesDone = getCompletedChallenges().length;
  const duelWins = getDuelWins();
  const ownedItems = getOwnedShopItems().length;
  const hasSkin = !!getEquippedSkin();
  const score = calculateScore();

  check("first_lesson",    lessonsDone >= 1);
  check("lessons_10",      lessonsDone >= 10);
  check("lessons_20",      lessonsDone >= 20);
  check("lessons_all",     lessonsDone >= TOTAL_LESSONS);
  check("streak_3",        streak >= 3);
  check("streak_7",        streak >= 7);
  check("streak_30",       streak >= 30);
  check("first_challenge", challengesDone >= 1);
  check("challenges_5",    challengesDone >= 5);
  check("challenges_all",  challengesDone >= TOTAL_CHALLENGES);
  check("first_duel_win",  duelWins >= 1);
  check("duel_wins_5",     duelWins >= 5);
  check("duel_wins_10",    duelWins >= 10);
  check("first_purchase",  ownedItems >= 1);
  check("skin_equipped",   hasSkin);
  check("score_1000",      score >= 1000);
  check("score_10000",     score >= 10000);
  if (extraFlags?.secretCode) check("secret_code", true);

  return newlyUnlocked;
}
