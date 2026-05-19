import { notifyProgress } from "./events";

export interface Progress {
  completedLessons: Record<string, number[]>;
  earnedBadges: string[];
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  color: string;
  secret?: boolean;
}

export const BADGES: Badge[] = [
  {
    id: "first_lesson",
    emoji: "🚀",
    name: "Premier pas",
    desc: "Terminer ta première leçon",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "level_0",
    emoji: "🌟",
    name: "Premiers pas",
    desc: "Terminer le niveau Premiers pas",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "level_1",
    emoji: "⭐",
    name: "Débutant confirmé",
    desc: "Terminer le niveau Débutant",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: "level_2",
    emoji: "🚀",
    name: "Explorateur",
    desc: "Terminer le niveau Explorateur",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "level_3",
    emoji: "🔨",
    name: "Bâtisseur",
    desc: "Terminer le niveau Bâtisseur",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "level_4",
    emoji: "🏆",
    name: "Expert Python",
    desc: "Terminer le niveau Expert",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "level_5",
    emoji: "🌐",
    name: "Maître Python",
    desc: "Terminer le niveau Maître",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "all_levels",
    emoji: "🐍",
    name: "Grand Maître",
    desc: "Terminer tous les niveaux !",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: "challenge_master",
    emoji: "🎯",
    name: "Maître des défis",
    desc: "Réussir ton premier défi !",
    color: "from-orange-400 to-red-500",
  },
  {
    id: "challenge_all",
    emoji: "💎",
    name: "Codeur ultime",
    desc: "Réussir tous les défis !",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "streak_3",
    emoji: "🔥",
    name: "En feu !",
    desc: "Jouer 3 jours de suite !",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "streak_7",
    emoji: "⚡",
    name: "Invincible !",
    desc: "Jouer 7 jours de suite !",
    color: "from-yellow-400 to-orange-500",
  },
  // Badges secrets
  {
    id: "night_owl",
    emoji: "🦉",
    name: "Chouette de nuit",
    desc: "Faire une leçon après 22h",
    color: "from-indigo-600 to-purple-700",
    secret: true,
  },
  {
    id: "early_bird",
    emoji: "🌅",
    name: "Lève-tôt",
    desc: "Faire une leçon avant 8h du matin",
    color: "from-orange-300 to-yellow-400",
    secret: true,
  },
  {
    id: "marathon",
    emoji: "🏃",
    name: "Marathonien",
    desc: "Compléter 5 leçons en un seul jour",
    color: "from-teal-400 to-green-500",
    secret: true,
  },
  {
    id: "no_hint_win",
    emoji: "🧠",
    name: "Génie pur",
    desc: "Réussir un défi sans utiliser d'indice",
    color: "from-blue-500 to-indigo-600",
    secret: true,
  },
  {
    id: "perfect_run",
    emoji: "💯",
    name: "Sans faute",
    desc: "Réussir un défi avec 3 vies restantes",
    color: "from-rose-400 to-pink-500",
    secret: true,
  },
];

const STORAGE_KEY = "pythonkids_progress";

export function getProgress(): Progress {
  if (typeof window === "undefined") return { completedLessons: {}, earnedBadges: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedLessons: {}, earnedBadges: [] };
    return JSON.parse(raw) as Progress;
  } catch {
    return { completedLessons: {}, earnedBadges: [] };
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function checkSecretBadges(context: {
  noHintWin?: boolean;
  perfectRun?: boolean;
}): string[] {
  const progress = getProgress();
  const newBadges: string[] = [];
  const hour = new Date().getHours();

  if (!progress.earnedBadges.includes("night_owl") && (hour >= 22 || hour < 1)) {
    newBadges.push("night_owl");
  }
  if (!progress.earnedBadges.includes("early_bird") && hour >= 5 && hour < 8) {
    newBadges.push("early_bird");
  }
  if (context.noHintWin && !progress.earnedBadges.includes("no_hint_win")) {
    newBadges.push("no_hint_win");
  }
  if (context.perfectRun && !progress.earnedBadges.includes("perfect_run")) {
    newBadges.push("perfect_run");
  }

  if (newBadges.length > 0) {
    saveProgress({ ...progress, earnedBadges: [...progress.earnedBadges, ...newBadges] });
    notifyProgress();
  }
  return newBadges;
}

export function markLessonComplete(levelId: number, lessonIndex: number): string[] {
  const progress = getProgress();
  const key = String(levelId);
  const current = progress.completedLessons[key] ?? [];
  if (!current.includes(lessonIndex)) {
    progress.completedLessons[key] = [...current, lessonIndex];
  }

  const newBadges: string[] = [];

  const totalCompleted = Object.values(progress.completedLessons).flat().length;
  if (totalCompleted >= 1 && !progress.earnedBadges.includes("first_lesson")) {
    newBadges.push("first_lesson");
  }

  // Badge marathon : 5 leçons dans la journée
  if (!progress.earnedBadges.includes("marathon")) {
    try {
      const raw = localStorage.getItem("pythonkids_lessons_today");
      const data: { date: string; count: number } = raw ? JSON.parse(raw) : { date: "", count: 0 };
      const todayStr = new Date().toISOString().split("T")[0];
      const todayCount = data.date === todayStr ? data.count : 0;
      if (todayCount >= 5) newBadges.push("marathon");
    } catch {}
  }

  saveProgress({ ...progress, earnedBadges: [...progress.earnedBadges, ...newBadges] });
  notifyProgress();
  return newBadges;
}

export function markLevelComplete(levelId: number, totalLessons: number): string[] {
  const progress = getProgress();
  const key = String(levelId);
  const completed = progress.completedLessons[key] ?? [];
  const newBadges: string[] = [];

  if (completed.length >= totalLessons) {
    const levelBadgeId = `level_${levelId}`;
    if (!progress.earnedBadges.includes(levelBadgeId)) {
      newBadges.push(levelBadgeId);
    }

    const allLevelsDone = [0, 1, 2, 3, 4, 5].every((id) => {
      if (id === levelId) return true;
      return progress.earnedBadges.includes(`level_${id}`);
    });
    if (allLevelsDone && !progress.earnedBadges.includes("all_levels")) {
      newBadges.push("all_levels");
    }
  }

  if (newBadges.length > 0) {
    saveProgress({ ...progress, earnedBadges: [...progress.earnedBadges, ...newBadges] });
    notifyProgress();
  }
  return newBadges;
}

export function isLessonComplete(levelId: number, lessonIndex: number): boolean {
  const progress = getProgress();
  return (progress.completedLessons[String(levelId)] ?? []).includes(lessonIndex);
}

export function getCompletedCount(levelId: number): number {
  const progress = getProgress();
  return (progress.completedLessons[String(levelId)] ?? []).length;
}

/** Retourne le niveau actuel du joueur (0–5) basé sur sa progression. */
export function getPlayerLevel(): number {
  const progress = getProgress();
  // Le niveau en cours = le plus haut niveau où il a au moins une leçon faite
  // ou le prochain niveau non commencé, capped à 5
  const LESSONS_PER_LEVEL: Record<string, number> = { "0": 4, "1": 8, "2": 6, "3": 6, "4": 6, "5": 6 };
  for (let id = 5; id >= 0; id--) {
    const done = (progress.completedLessons[String(id)] ?? []).length;
    if (done > 0) return id;
  }
  return 0;
}
