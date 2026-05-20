import { getProgress } from "./progress";
import { getStreak } from "./streak";
import { getCompletedChallenges } from "./challenges";
import { getDuelWins } from "./duels";
import { getOwnedShopItems, getEquippedSkin } from "./shop";
import { calculateScore } from "./score";
import { playAchievementSound } from "./sounds";

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  color: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Leçons
  { id: "first_lesson",   name: "Premier pas",           emoji: "👶", desc: "Terminer ta première leçon",         color: "from-green-400 to-emerald-500"    },
  { id: "lessons_10",     name: "Assidu",                emoji: "📚", desc: "10 leçons terminées",               color: "from-blue-400 to-cyan-500"        },
  { id: "lessons_20",     name: "Studieux",              emoji: "🎓", desc: "20 leçons terminées",               color: "from-violet-400 to-purple-500"    },
  { id: "lessons_all",    name: "Encyclopédiste",        emoji: "🌟", desc: "Toutes les leçons terminées",       color: "from-yellow-400 to-orange-500"    },
  // Streak
  { id: "streak_3",       name: "Régulier",              emoji: "🔥", desc: "3 jours de streak",                 color: "from-orange-400 to-red-500"       },
  { id: "streak_7",       name: "Semaine de feu",        emoji: "🌋", desc: "7 jours de streak",                 color: "from-red-500 to-rose-600"         },
  { id: "streak_30",      name: "Mois légendaire",       emoji: "👑", desc: "30 jours de streak",                color: "from-yellow-400 to-amber-500"     },
  // Défis
  { id: "first_challenge",name: "Challenger",            emoji: "🎯", desc: "Réussir ton premier défi",          color: "from-teal-400 to-cyan-500"        },
  { id: "challenges_5",   name: "Combattant",            emoji: "⚔️", desc: "5 défis réussis",                  color: "from-indigo-500 to-purple-600"    },
  { id: "challenges_all", name: "Maître des défis",      emoji: "🏆", desc: "Tous les défis réussis",            color: "from-yellow-500 to-orange-600"    },
  // Duel
  { id: "first_duel_win", name: "Premier sang",          emoji: "🗡️", desc: "Gagner ton premier duel",          color: "from-red-400 to-pink-500"         },
  { id: "duel_wins_5",    name: "Gladiateur",            emoji: "🛡️", desc: "5 duels gagnés",                   color: "from-orange-500 to-red-600"       },
  { id: "duel_wins_10",   name: "Champion",              emoji: "⚡", desc: "10 duels gagnés",                   color: "from-yellow-400 to-red-500"       },
  // Boutique
  { id: "first_purchase", name: "Fashionista",           emoji: "🛒", desc: "Acheter ton premier item",           color: "from-pink-400 to-rose-500"        },
  { id: "skin_equipped",  name: "Stylé",                 emoji: "💅", desc: "Équiper un skin",                   color: "from-fuchsia-400 to-pink-500"     },
  // Score
  { id: "score_1000",     name: "Prometteur",            emoji: "📈", desc: "Atteindre 1 000 points",            color: "from-sky-400 to-blue-500"         },
  { id: "score_10000",    name: "Expert",                emoji: "🚀", desc: "Atteindre 10 000 points",           color: "from-violet-500 to-purple-700"    },
  // Secret
  { id: "secret_code",    name: "Initié",                emoji: "🔮", desc: "Utiliser un code secret",           color: "from-emerald-600 to-green-800"    },
];

const KEY = "pythonkids_achievements";
const TOTAL_LESSONS = 36;
const TOTAL_CHALLENGES = 13;

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
    window.dispatchEvent(new CustomEvent("pythonkids:toast", {
      detail: { msg: `Succès débloqué : ${ach.name} !`, emoji: ach.emoji, type: "rank" },
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
