export interface LevelMeta {
  id: number;
  emoji: string;
  name: string;
  description: string;
  ages: string;
  color: string;
  bg: string;
  darkBg: string;
  border: string;
  darkBorder: string;
  lessons: number;
}

export const LEVELS: LevelMeta[] = [
  {
    id: 0,
    emoji: "🌟",
    name: "Premiers pas",
    description: "Découvre la magie du code ! Fais parler l'ordinateur dès ta première leçon.",
    ages: "8-10 ans",
    color: "from-green-400 to-emerald-500",
    bg: "bg-green-50",
    darkBg: "dark:bg-green-950/30",
    border: "border-green-200",
    darkBorder: "dark:border-green-800",
    lessons: 4,
  },
  {
    id: 1,
    emoji: "⭐",
    name: "Débutant",
    description: "Variables, conditions, boucles et tes premières vraies interactions !",
    ages: "10-12 ans",
    color: "from-yellow-400 to-orange-400",
    bg: "bg-yellow-50",
    darkBg: "dark:bg-yellow-950/30",
    border: "border-yellow-200",
    darkBorder: "dark:border-yellow-800",
    lessons: 8,
  },
  {
    id: 2,
    emoji: "🚀",
    name: "Explorateur",
    description: "Boucles, listes, fonctions, tuples pour créer des programmes puissants.",
    ages: "12-14 ans",
    color: "from-blue-400 to-cyan-500",
    bg: "bg-blue-50",
    darkBg: "dark:bg-blue-950/30",
    border: "border-blue-200",
    darkBorder: "dark:border-blue-800",
    lessons: 6,
  },
  {
    id: 3,
    emoji: "🔨",
    name: "Bâtisseur",
    description: "Dictionnaires, sets, compréhensions et débogage comme un pro.",
    ages: "14-16 ans",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    darkBg: "dark:bg-purple-950/30",
    border: "border-purple-200",
    darkBorder: "dark:border-purple-800",
    lessons: 6,
  },
  {
    id: 4,
    emoji: "🏆",
    name: "Expert",
    description: "POO, récursivité, lambda, algorithmes — crée de vrais projets !",
    ages: "16-18 ans",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    darkBg: "dark:bg-pink-950/30",
    border: "border-pink-200",
    darkBorder: "dark:border-pink-800",
    lessons: 6,
  },
  {
    id: 5,
    emoji: "🌐",
    name: "Maître",
    description: "JSON, regex, collections, sécurité — maîtrise le Python avancé !",
    ages: "16-18 ans",
    color: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50",
    darkBg: "dark:bg-cyan-950/30",
    border: "border-cyan-200",
    darkBorder: "dark:border-cyan-800",
    lessons: 6,
  },
];
