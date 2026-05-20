export interface Challenge {
  id: string;
  emoji: string;
  title: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  difficultyColor: string;
  description: string;
  starterCode: string;
  hint: string;
  expectedOutput: string;
  solutionCode: string;
  minLevel: number; // niveau minimum recommandé (0–5)
  hints: [string, string, string]; // indices progressifs : vague → précis → quasi-solution
}

export const CHALLENGES: Challenge[] = [
  // ── FACILE ──────────────────────────────────────────────────────────
  {
    id: "hello",
    emoji: "👋",
    title: "Dis bonjour !",
    difficulty: "Facile",
    difficultyColor: "from-green-400 to-emerald-500",
    description: "Affiche exactement ce message :\nBonjour Python !",
    starterCode: "# Affiche le bon message\n",
    hint: "Utilise print() avec le texte exact entre guillemets.",
    hints: [
      "Pense au mot magique de Python pour afficher du texte à l'écran.",
      "Utilise print() avec le texte exact entre guillemets.",
      'Écris : print("Bonjour Python !")',
    ],
    expectedOutput: "Bonjour Python !",
    solutionCode: 'print("Bonjour Python !")',
    minLevel: 0,
  },
  {
    id: "even_odd",
    emoji: "🔢",
    title: "Pair ou impair",
    difficulty: "Facile",
    difficultyColor: "from-green-400 to-emerald-500",
    description: "Le nombre 42 est-il pair ou impair ?\nAffiche 'pair' ou 'impair'.",
    starterCode: "n = 42\n# Affiche pair ou impair\n",
    hint: "Utilise le modulo % : si n % 2 == 0 alors c'est pair.",
    hints: [
      "Il existe un opérateur en Python qui donne le reste d'une division.",
      "Utilise le modulo % : si n % 2 == 0 alors c'est pair.",
      'if n % 2 == 0:\n    print("pair")\nelse:\n    print("impair")',
    ],
    expectedOutput: "pair",
    solutionCode: "n = 42\nif n % 2 == 0:\n    print(\"pair\")\nelse:\n    print(\"impair\")",
    minLevel: 1,
  },
  {
    id: "sum",
    emoji: "➕",
    title: "La somme des 10",
    difficulty: "Facile",
    difficultyColor: "from-green-400 to-emerald-500",
    description: "Calcule et affiche la somme de tous les nombres de 1 à 10.\n(1 + 2 + 3 + … + 10)",
    starterCode: "# Affiche la somme de 1 à 10\n",
    hint: "Tu peux utiliser sum(range(1, 11)) ou une boucle for.",
    hints: [
      "Pense à une fonction Python qui fait une somme, ou à une boucle qui accumule.",
      "Tu peux utiliser sum(range(1, 11)) ou une boucle for.",
      "print(sum(range(1, 11)))",
    ],
    expectedOutput: "55",
    solutionCode: "print(sum(range(1, 11)))",
    minLevel: 1,
  },
  {
    id: "vowels",
    emoji: "🔤",
    title: "Compte les voyelles",
    difficulty: "Facile",
    difficultyColor: "from-green-400 to-emerald-500",
    description: "Combien de voyelles (a, e, i, o, u, y) y a-t-il dans le mot 'programmation' ?\nAffiche ce nombre.",
    starterCode: "mot = \"programmation\"\n# Compte les voyelles\n",
    hint: "Parcours chaque lettre avec une boucle for et vérifie si elle est dans 'aeiouy'.",
    hints: [
      "Parcours le mot lettre par lettre et vérifie si chaque lettre appartient à un groupe.",
      "Parcours chaque lettre avec une boucle for et vérifie si elle est dans 'aeiouy'.",
      "count = 0\nfor c in mot:\n    if c in 'aeiouy':\n        count += 1\nprint(count)",
    ],
    expectedOutput: "5",
    solutionCode: "mot = \"programmation\"\ncount = sum(1 for c in mot if c in \"aeiouy\")\nprint(count)",
    minLevel: 1,
  },
  {
    id: "fstring",
    emoji: "💬",
    title: "F-strings magiques",
    difficulty: "Facile",
    difficultyColor: "from-green-400 to-emerald-500",
    description: "Utilise les variables prenom et age pour afficher ce message avec une f-string :\nBonjour, je m'appelle Alice et j'ai 14 ans.",
    starterCode: 'prenom = "Alice"\nage = 14\n# Affiche le message avec une f-string\n',
    hint: "Écris f\"Bonjour, je m'appelle {prenom} et j'ai {age} ans.\"",
    hints: [
      "Les f-strings en Python permettent d'insérer des variables directement dans du texte.",
      "Écris f\"Bonjour, je m'appelle {prenom} et j'ai {age} ans.\"",
      "print(f\"Bonjour, je m'appelle {prenom} et j'ai {age} ans.\")",
    ],
    expectedOutput: "Bonjour, je m'appelle Alice et j'ai 14 ans.",
    solutionCode: "prenom = \"Alice\"\nage = 14\nprint(f\"Bonjour, je m'appelle {prenom} et j'ai {age} ans.\")",
    minLevel: 1,
  },
  {
    id: "unique",
    emoji: "🎲",
    title: "Éléments uniques",
    difficulty: "Facile",
    difficultyColor: "from-green-400 to-emerald-500",
    description: "Combien de langages différents y a-t-il dans cette liste ?\n(certains apparaissent plusieurs fois)\nAffiche juste le nombre.",
    starterCode: 'langages = ["python", "java", "python", "c++", "java", "python"]\n# Affiche le nombre de langages uniques\n',
    hint: "set() supprime les doublons. len(set(langages)) donne le nombre d'éléments différents.",
    hints: [
      "En Python, un certain type de collection supprime automatiquement les doublons.",
      "set() supprime les doublons. len(set(langages)) donne le nombre d'éléments différents.",
      "print(len(set(langages)))",
    ],
    expectedOutput: "3",
    solutionCode: "langages = [\"python\", \"java\", \"python\", \"c++\", \"java\", \"python\"]\nprint(len(set(langages)))",
    minLevel: 2,
  },

  // ── MOYEN ────────────────────────────────────────────────────────────
  {
    id: "multiplication",
    emoji: "✖️",
    title: "Table de 7",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Affiche la table de multiplication de 7, de 7×1 jusqu'à 7×10.\nUn résultat par ligne.",
    starterCode: "# Affiche 7, 14, 21, ..., 70\n",
    hint: "Utilise une boucle for avec range(1, 11) et print(7 * i).",
    hints: [
      "Tu dois répéter une opération 10 fois avec un compteur qui augmente.",
      "Utilise une boucle for avec range(1, 11) et print(7 * i).",
      "for i in range(1, 11):\n    print(7 * i)",
    ],
    expectedOutput: "7\n14\n21\n28\n35\n42\n49\n56\n63\n70",
    solutionCode: "for i in range(1, 11):\n    print(7 * i)",
    minLevel: 1,
  },
  {
    id: "triangle",
    emoji: "🔺",
    title: "Triangle d'étoiles",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Affiche un triangle de 5 lignes d'étoiles :\n*\n**\n***\n****\n*****",
    starterCode: "# Affiche un triangle de 5 lignes\n",
    hint: "Utilise une boucle for avec range(1, 6) et print('*' * i).",
    hints: [
      "Chaque ligne contient un nombre d'étoiles égal à son numéro de ligne.",
      "Utilise une boucle for avec range(1, 6) et print('*' * i).",
      "for i in range(1, 6):\n    print('*' * i)",
    ],
    expectedOutput: "*\n**\n***\n****\n*****",
    solutionCode: "for i in range(1, 6):\n    print(\"*\" * i)",
    minLevel: 1,
  },
  {
    id: "max",
    emoji: "🏆",
    title: "Le plus grand",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Trouve le plus grand nombre dans cette liste et affiche-le :\n[34, 17, 89, 45, 12, 67]",
    starterCode: "nombres = [34, 17, 89, 45, 12, 67]\n# Affiche le plus grand nombre\n",
    hint: "Utilise la fonction max() de Python.",
    hints: [
      "Python a une fonction intégrée pour trouver le plus grand élément d'une liste.",
      "Utilise la fonction max() de Python.",
      "print(max(nombres))",
    ],
    expectedOutput: "89",
    solutionCode: "nombres = [34, 17, 89, 45, 12, 67]\nprint(max(nombres))",
    minLevel: 2,
  },
  {
    id: "reverse",
    emoji: "🔄",
    title: "À l'envers",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Affiche le mot 'Python' écrit à l'envers.",
    starterCode: 'mot = "Python"\n# Affiche le mot à l\'envers\n',
    hint: "En Python, tu peux inverser une chaîne avec mot[::-1].",
    hints: [
      "Python permet d'accéder aux éléments d'une séquence en sens inverse avec un pas négatif.",
      "En Python, tu peux inverser une chaîne avec mot[::-1].",
      "print(mot[::-1])",
    ],
    expectedOutput: "nohtyP",
    solutionCode: "mot = \"Python\"\nprint(mot[::-1])",
    minLevel: 2,
  },
  {
    id: "palindrome",
    emoji: "🔁",
    title: "Palindrome",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Un palindrome se lit pareil dans les deux sens (ex : 'kayak', 'radar').\nAffiche 'oui' si 'radar' est un palindrome, sinon 'non'.",
    starterCode: "mot = \"radar\"\n# Vérifie si c'est un palindrome\n",
    hint: "Compare mot avec mot[::-1] qui donne le mot à l'envers.",
    hints: [
      "Comment vérifier qu'un mot est identique quand on le lit à l'envers ?",
      "Compare mot avec mot[::-1] qui donne le mot à l'envers.",
      'if mot == mot[::-1]:\n    print("oui")\nelse:\n    print("non")',
    ],
    expectedOutput: "oui",
    solutionCode: "mot = \"radar\"\nif mot == mot[::-1]:\n    print(\"oui\")\nelse:\n    print(\"non\")",
    minLevel: 2,
  },
  {
    id: "factorial",
    emoji: "❗",
    title: "Factorielle",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Calcule la factorielle de 6 et affiche le résultat.\n6! = 6 × 5 × 4 × 3 × 2 × 1",
    starterCode: "n = 6\n# Calcule n!\n",
    hint: "Commence avec result = 1, puis multiplie par chaque nombre de 1 à n.",
    hints: [
      "Commence avec 1 et multiplie successivement par 2, 3, 4, 5, 6.",
      "Commence avec result = 1, puis multiplie par chaque nombre de 1 à n.",
      "result = 1\nfor i in range(1, n + 1):\n    result *= i\nprint(result)",
    ],
    expectedOutput: "720",
    solutionCode: "n = 6\nresult = 1\nfor i in range(1, n + 1):\n    result *= i\nprint(result)",
    minLevel: 2,
  },
  {
    id: "sort_by_length",
    emoji: "📏",
    title: "Tri par longueur",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Trie cette liste de mots du plus court au plus long et affiche-la.",
    starterCode: 'mots = ["chat", "elephant", "rat", "girafe", "pie"]\n# Trie par longueur et affiche\n',
    hint: "Utilise sorted(mots, key=len) pour trier par longueur.",
    hints: [
      "La fonction sorted() peut trier selon un critère personnalisé avec key=.",
      "Utilise sorted(mots, key=len) pour trier par longueur.",
      "print(sorted(mots, key=len))",
    ],
    expectedOutput: "['rat', 'pie', 'chat', 'girafe', 'elephant']",
    solutionCode: "mots = [\"chat\", \"elephant\", \"rat\", \"girafe\", \"pie\"]\nprint(sorted(mots, key=len))",
    minLevel: 2,
  },
  {
    id: "list_comp",
    emoji: "⚡",
    title: "Les carrés parfaits",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Crée la liste des carrés des nombres de 1 à 5 en une seule ligne et affiche-la.\n(1², 2², 3², 4², 5²)",
    starterCode: "# Crée [1, 4, 9, 16, 25] en une ligne\n",
    hint: "Utilise [n**2 for n in range(1, 6)] pour créer la liste en une seule ligne.",
    hints: [
      "En Python, tu peux créer une liste en une seule ligne avec [ ... for ... in ... ].",
      "Utilise [n**2 for n in range(1, 6)] pour créer la liste en une seule ligne.",
      "print([n**2 for n in range(1, 6)])",
    ],
    expectedOutput: "[1, 4, 9, 16, 25]",
    solutionCode: "print([n**2 for n in range(1, 6)])",
    minLevel: 2,
  },
  {
    id: "occurrences",
    emoji: "📊",
    title: "Compte les fruits",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Compte combien de fois chaque fruit apparaît et affiche le résultat.\nFormat attendu :\npomme: 3\nbanane: 2\ncerise: 1",
    starterCode: 'fruits = ["pomme", "banane", "pomme", "cerise", "banane", "pomme"]\n# Compte les occurrences\n',
    hint: "Crée un dictionnaire vide {} et une boucle for. Pour chaque fruit, ajoute 1 à son compteur.",
    hints: [
      "Tu as besoin d'une structure qui mémorise combien de fois chaque fruit apparaît.",
      "Crée un dictionnaire vide {} et une boucle for. Pour chaque fruit, ajoute 1 à son compteur.",
      "compte = {}\nfor f in fruits:\n    compte[f] = compte.get(f, 0) + 1\nfor fruit, n in compte.items():\n    print(f'{fruit}: {n}')",
    ],
    expectedOutput: "pomme: 3\nbanane: 2\ncerise: 1",
    solutionCode: "fruits = [\"pomme\", \"banane\", \"pomme\", \"cerise\", \"banane\", \"pomme\"]\ncompte = {}\nfor f in fruits:\n    compte[f] = compte.get(f, 0) + 1\nfor fruit, n in compte.items():\n    print(f\"{fruit}: {n}\")",
    minLevel: 3,
  },
  {
    id: "safe_divide",
    emoji: "🛡️",
    title: "Division sécurisée",
    difficulty: "Moyen",
    difficultyColor: "from-yellow-400 to-orange-400",
    description: "Écris une fonction divise(a, b) qui divise a par b.\nSi b vaut 0, affiche un message d'erreur au lieu de planter.\nAffiche divise(10, 2) puis divise(10, 0).",
    starterCode: "def divise(a, b):\n    # Utilise try/except pour gérer la division par zéro\n    pass\n\nprint(divise(10, 2))\nprint(divise(10, 0))\n",
    hint: "Dans un bloc try, fais a // b. Dans except ZeroDivisionError, retourne le message d'erreur.",
    hints: [
      "Python peut attraper les erreurs avec un mécanisme spécial pour les gérer proprement.",
      "Dans un bloc try, fais a // b. Dans except ZeroDivisionError, retourne le message d'erreur.",
      "try:\n    return a // b\nexcept ZeroDivisionError:\n    return \"Erreur : division par zero !\"",
    ],
    expectedOutput: "5\nErreur : division par zero !",
    solutionCode: "def divise(a, b):\n    try:\n        return a // b\n    except ZeroDivisionError:\n        return \"Erreur : division par zero !\"\n\nprint(divise(10, 2))\nprint(divise(10, 0))",
    minLevel: 3,
  },

  // ── DIFFICILE ────────────────────────────────────────────────────────
  {
    id: "fizzbuzz",
    emoji: "🎯",
    title: "FizzBuzz",
    difficulty: "Difficile",
    difficultyColor: "from-pink-500 to-rose-600",
    description: "Affiche les nombres de 1 à 15, mais :\n→ Si divisible par 3 : affiche 'Fizz'\n→ Si divisible par 5 : affiche 'Buzz'\n→ Si divisible par 3 ET 5 : affiche 'FizzBuzz'\n→ Sinon : affiche le nombre",
    starterCode: "# FizzBuzz de 1 à 15\n",
    hint: "Vérifie d'abord si divisible par 15 (FizzBuzz), puis par 3, puis par 5.",
    hints: [
      "Teste les divisibilités dans le bon ordre — commence par le cas le plus spécifique.",
      "Vérifie d'abord si divisible par 15 (FizzBuzz), puis par 3, puis par 5.",
      "for i in range(1, 16):\n    if i % 15 == 0: print('FizzBuzz')\n    elif i % 3 == 0: print('Fizz')\n    elif i % 5 == 0: print('Buzz')\n    else: print(i)",
    ],
    expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    solutionCode: "for i in range(1, 16):\n    if i % 15 == 0:\n        print(\"FizzBuzz\")\n    elif i % 3 == 0:\n        print(\"Fizz\")\n    elif i % 5 == 0:\n        print(\"Buzz\")\n    else:\n        print(i)",
    minLevel: 2,
  },
  {
    id: "fibonacci",
    emoji: "🌀",
    title: "Suite de Fibonacci",
    difficulty: "Difficile",
    difficultyColor: "from-purple-500 to-violet-600",
    description: "Affiche les 8 premiers nombres de la suite de Fibonacci, séparés par des virgules.\nChaque nombre est la somme des deux précédents :\n0, 1, 1, 2, 3, 5, 8, 13…",
    starterCode: "# Affiche : 0, 1, 1, 2, 3, 5, 8, 13\n",
    hint: "Commence avec a=0, b=1. À chaque étape, fais : a, b = b, a+b.",
    hints: [
      "Garde en mémoire les deux derniers nombres de la suite pour calculer le suivant.",
      "Commence avec a=0, b=1. À chaque étape, fais : a, b = b, a+b.",
      "a, b = 0, 1\nres = []\nfor _ in range(8):\n    res.append(str(a))\n    a, b = b, a + b\nprint(', '.join(res))",
    ],
    expectedOutput: "0, 1, 1, 2, 3, 5, 8, 13",
    solutionCode: "a, b = 0, 1\nresultat = []\nfor _ in range(8):\n    resultat.append(str(a))\n    a, b = b, a + b\nprint(\", \".join(resultat))",
    minLevel: 3,
  },
  {
    id: "primes",
    emoji: "🔢",
    title: "Nombres premiers",
    difficulty: "Difficile",
    difficultyColor: "from-purple-500 to-violet-600",
    description: "Affiche tous les nombres premiers entre 2 et 20, séparés par des virgules.\nUn nombre premier n'est divisible que par 1 et lui-même.",
    starterCode: "# Affiche les nombres premiers de 2 à 20\n",
    hint: "Pour chaque nombre n, vérifie qu'aucun entier entre 2 et n-1 ne le divise.",
    hints: [
      "Pour chaque nombre, vérifie qu'aucun entier entre 2 et lui-même ne peut le diviser.",
      "Pour chaque nombre n, vérifie qu'aucun entier entre 2 et n-1 ne le divise.",
      "premiers = []\nfor n in range(2, 21):\n    if all(n % i != 0 for i in range(2, n)):\n        premiers.append(str(n))\nprint(', '.join(premiers))",
    ],
    expectedOutput: "2, 3, 5, 7, 11, 13, 17, 19",
    solutionCode: "premiers = []\nfor n in range(2, 21):\n    if all(n % i != 0 for i in range(2, n)):\n        premiers.append(str(n))\nprint(\", \".join(premiers))",
    minLevel: 3,
  },
  {
    id: "class_animal",
    emoji: "🐕",
    title: "Ma première classe",
    difficulty: "Difficile",
    difficultyColor: "from-purple-500 to-violet-600",
    description: "Crée une classe Animal avec :\n- un attribut nom\n- une méthode parler() qui retourne \"<nom> dit Bonjour !\"\n\nCrée un Animal nommé 'Rex' et affiche parler().",
    starterCode: "# Crée la classe Animal\n\n\n# Crée un Animal nommé Rex et affiche parler()\n",
    hint: "Dans __init__(self, nom), stocke self.nom = nom. Dans parler(self), retourne f\"{self.nom} dit Bonjour !\"",
    hints: [
      "En Python, une classe se définit avec class, et son constructeur s'appelle __init__.",
      "Dans __init__(self, nom), stocke self.nom = nom. Dans parler(self), retourne f\"{self.nom} dit Bonjour !\"",
      "class Animal:\n    def __init__(self, nom):\n        self.nom = nom\n    def parler(self):\n        return f\"{self.nom} dit Bonjour !\"",
    ],
    expectedOutput: "Rex dit Bonjour !",
    solutionCode: "class Animal:\n    def __init__(self, nom):\n        self.nom = nom\n    def parler(self):\n        return f\"{self.nom} dit Bonjour !\"\n\nrex = Animal(\"Rex\")\nprint(rex.parler())",
    minLevel: 4,
  },
  {
    id: "power_recursive",
    emoji: "🔁",
    title: "Puissance récursive",
    difficulty: "Difficile",
    difficultyColor: "from-purple-500 to-violet-600",
    description: "Écris une fonction récursive puissance(base, exp) qui calcule base^exp.\nUne fonction récursive s'appelle elle-même !\nAffiche puissance(2, 8).",
    starterCode: "def puissance(base, exp):\n    # Si exp vaut 0, retourne 1\n    # Sinon retourne base * puissance(base, exp - 1)\n    pass\n\nprint(puissance(2, 8))\n",
    hint: "Si exp == 0, retourne 1. Sinon retourne base * puissance(base, exp - 1).",
    hints: [
      "Une fonction récursive s'appelle elle-même avec une valeur plus petite, jusqu'à un cas de base.",
      "Si exp == 0, retourne 1. Sinon retourne base * puissance(base, exp - 1).",
      "def puissance(base, exp):\n    if exp == 0:\n        return 1\n    return base * puissance(base, exp - 1)",
    ],
    expectedOutput: "256",
    solutionCode: "def puissance(base, exp):\n    if exp == 0:\n        return 1\n    return base * puissance(base, exp - 1)\n\nprint(puissance(2, 8))",
    minLevel: 4,
  },
];

import { getProgress, saveProgress } from "./progress";
import { notifyProgress } from "./events";
import { postActivity } from "./activity";

const STORAGE_KEY = "pythonkids_challenges";

export function getCompletedChallenges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Marque le défi comme terminé et retourne les nouveaux badges gagnés. */
export function markChallengeComplete(id: string): string[] {
  const done = getCompletedChallenges();
  if (done.includes(id)) return [];

  const newDone = [...done, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newDone));

  const newBadges: string[] = [];
  try {
    const progress = getProgress();
    if (!progress.earnedBadges.includes("challenge_master")) {
      newBadges.push("challenge_master");
    }
    if (newDone.length >= CHALLENGES.length && !progress.earnedBadges.includes("challenge_all")) {
      newBadges.push("challenge_all");
    }
    if (newBadges.length > 0) {
      saveProgress({ ...progress, earnedBadges: [...progress.earnedBadges, ...newBadges] });
    }
  } catch { /* ignore */ }

  notifyProgress();
  postActivity("challenge", id);
  for (const badge of newBadges) postActivity("badge", badge);
  return newBadges;
}
