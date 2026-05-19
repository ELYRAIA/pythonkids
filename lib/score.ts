import { getProgress } from "./progress";
import { getCompletedChallenges } from "./challenges";
import { getStreak } from "./streak";
import { getChestBonusStars } from "./chests";

export function calculateScore(): number {
  if (typeof window === "undefined") return 0;

  const progress = getProgress();
  const challenges = getCompletedChallenges();
  const streak = getStreak();

  // Leçons : 100 pts chacune
  const lessonPoints = Object.values(progress.completedLessons).flat().length * 100;

  // Badge de niveau : 500 pts chacun
  const levelBadges = progress.earnedBadges.filter((b) => b.startsWith("level_")).length;
  const levelPoints = levelBadges * 500;

  // Défis : 200 pts chacun
  const challengePoints = challenges.length * 200;

  // Bonus streak : 50 pts par jour consécutif
  const streakPoints = streak.currentStreak * 50;

  // Bonus coffres : étoiles gagnées en ouvrant les coffres
  const chestBonus = getChestBonusStars();

  return lessonPoints + levelPoints + challengePoints + streakPoints + chestBonus;
}
