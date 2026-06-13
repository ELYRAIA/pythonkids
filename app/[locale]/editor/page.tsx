"use client";

import PythonEditor from "@/components/PythonEditor";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { lf } from "@/lib/localize";
import AppHeader from "@/components/AppHeader";

interface Template {
  emoji: string;
  label: string;
  label_en?: string;
  code: string;
  code_en?: string;
}

interface Category {
  nameKey: string;
  templates: Template[];
}

const CATEGORIES: Category[] = [
  {
    nameKey: "category_beginner",
    templates: [
      {
        emoji: "👋",
        label: "Hello World",
        code: '# Mon premier programme Python !\nprenom = "PythonKids"\nprint(f"Bonjour {prenom} ! 🐍")\nprint("Je viens d\'apprendre à coder !")\nfor i in range(3):\n    print("⭐ " * (i + 1))',
        code_en: '# My first Python program!\nname = "PythonKids"\nprint(f"Hello {name}! 🐍")\nprint("I\'m learning to code!")\nfor i in range(3):\n    print("⭐ " * (i + 1))',
      },
      {
        emoji: "🔢",
        label: "Calculatrice",
        label_en: "Calculator",
        code: '# Mini calculatrice\na = 42\nb = 7\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} × {b} = {a * b}")\nprint(f"{a} ÷ {b} = {a // b}")',
        code_en: '# Mini calculator\na = 42\nb = 7\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} × {b} = {a * b}")\nprint(f"{a} ÷ {b} = {a // b}")',
      },
      {
        emoji: "🎲",
        label: "Dé à lancer",
        label_en: "Dice Roll",
        code: 'import random\nprint("🎲 Lance le dé !")\nfor lancer in range(1, 6):\n    resultat = random.randint(1, 6)\n    print(f"Lancer {lancer} : {\"⚀⚁⚂⚃⚄⚅\"[resultat - 1]} ({resultat})")',
        code_en: 'import random\nprint("🎲 Roll the dice!")\nfor roll in range(1, 6):\n    result = random.randint(1, 6)\n    print(f"Roll {roll}: {\"⚀⚁⚂⚃⚄⚅\"[result - 1]} ({result})")',
      },
      {
        emoji: "🎨",
        label: "Dessin ASCII",
        label_en: "ASCII Art",
        code: '# Dessine avec des caractères !\nfor i in range(1, 8):\n    etoiles = "⭐" * i\n    print(etoiles)\nfor i in range(6, 0, -1):\n    etoiles = "⭐" * i\n    print(etoiles)',
        code_en: '# Draw with characters!\nfor i in range(1, 8):\n    stars = "⭐" * i\n    print(stars)\nfor i in range(6, 0, -1):\n    stars = "⭐" * i\n    print(stars)',
      },
    ],
  },
  {
    nameKey: "category_intermediate",
    templates: [
      {
        emoji: "📋",
        label: "Liste de courses",
        label_en: "Shopping List",
        code: '# Gestionnaire de liste\ncourses = ["pommes", "bananes", "chocolat", "lait"]\nprint("🛒 Ma liste de courses :")\nfor i, article in enumerate(courses, 1):\n    print(f"  {i}. {article}")\nprint(f"\\nTotal : {len(courses)} articles")',
        code_en: '# List manager\nitems = ["apples", "bananas", "chocolate", "milk"]\nprint("🛒 My shopping list:")\nfor i, item in enumerate(items, 1):\n    print(f"  {i}. {item}")\nprint(f"\\nTotal: {len(items)} items")',
      },
      {
        emoji: "🔢",
        label: "Table de mult.",
        label_en: "Mult. table",
        code: '# Table de multiplication\nn = 7\nprint(f"📊 Table de {n} :")\nfor i in range(1, 11):\n    ligne = f"  {n} × {i:2d} = {n * i:3d}"\n    if n * i >= 50:\n        ligne += " 💪"\n    print(ligne)',
        code_en: '# Multiplication table\nn = 7\nprint(f"📊 Table of {n}:")\nfor i in range(1, 11):\n    line = f"  {n} × {i:2d} = {n * i:3d}"\n    if n * i >= 50:\n        line += " 💪"\n    print(line)',
      },
      {
        emoji: "🔐",
        label: "Générateur mdp",
        label_en: "Password gen.",
        code: 'import random\nimport string\n\ndef generer_mdp(longueur=12):\n    chars = string.ascii_letters + string.digits + "!@#$"\n    return "".join(random.choice(chars) for _ in range(longueur))\n\nprint("🔐 Mots de passe générés :")\nfor i in range(3):\n    print(f"  {i+1}. {generer_mdp()}")',
        code_en: 'import random\nimport string\n\ndef generate_password(length=12):\n    chars = string.ascii_letters + string.digits + "!@#$"\n    return "".join(random.choice(chars) for _ in range(length))\n\nprint("🔐 Generated passwords:")\nfor i in range(3):\n    print(f"  {i+1}. {generate_password()}")',
      },
      {
        emoji: "📊",
        label: "Stats de liste",
        label_en: "List Stats",
        code: '# Analyse statistique\nnotes = [14, 17, 12, 19, 15, 11, 18, 16]\nprint("📊 Analyse des notes :")\nprint(f"  Minimum  : {min(notes)}/20")\nprint(f"  Maximum  : {max(notes)}/20")\nprint(f"  Moyenne  : {sum(notes)/len(notes):.1f}/20")\nprint(f"  Reçus    : {sum(1 for n in notes if n >= 10)}/{len(notes)}")',
        code_en: '# Statistical analysis\nscores = [14, 17, 12, 19, 15, 11, 18, 16]\nprint("📊 Score analysis:")\nprint(f"  Minimum : {min(scores)}/20")\nprint(f"  Maximum : {max(scores)}/20")\nprint(f"  Average : {sum(scores)/len(scores):.1f}/20")\nprint(f"  Passed  : {sum(1 for n in scores if n >= 10)}/{len(scores)}")',
      },
    ],
  },
  {
    nameKey: "category_advanced",
    templates: [
      {
        emoji: "🎮",
        label: "Jeu de devinette",
        label_en: "Guessing Game",
        code: 'import random\nnombre_secret = random.randint(1, 20)\ntentatives = 5\nprint(f"🎮 Devine le nombre (entre 1 et 20) — {tentatives} essais !")\nfor essai in range(1, tentatives + 1):\n    guess = int(input(f"Essai {essai}/{tentatives} : "))\n    if guess == nombre_secret:\n        print(f"🏆 Bravo ! Trouvé en {essai} essai(s) !")\n        break\n    elif guess < nombre_secret:\n        print("  ↑ Plus grand !")\n    else:\n        print("  ↓ Plus petit !")\nelse:\n    print(f"😔 Perdu ! C\'était {nombre_secret}.")',
        code_en: 'import random\nsecret = random.randint(1, 20)\nattempts = 5\nprint(f"🎮 Guess the number (between 1 and 20) — {attempts} tries!")\nfor try_num in range(1, attempts + 1):\n    guess = int(input(f"Try {try_num}/{attempts}: "))\n    if guess == secret:\n        print(f"🏆 Correct! Found in {try_num} try/tries!")\n        break\n    elif guess < secret:\n        print("  ↑ Higher!")\n    else:\n        print("  ↓ Lower!")\nelse:\n    print(f"😔 Game over! It was {secret}.")',
      },
      {
        emoji: "🐍",
        label: "Fibonacci",
        code: '# Suite de Fibonacci\ndef fibonacci(n):\n    a, b = 0, 1\n    suite = []\n    for _ in range(n):\n        suite.append(a)\n        a, b = b, a + b\n    return suite\n\nfib = fibonacci(12)\nprint("🐍 Suite de Fibonacci :")\nprint(" → ".join(str(n) for n in fib))\nprint(f"\\nLe 12e terme vaut : {fib[-1]}")',
        code_en: '# Fibonacci sequence\ndef fibonacci(n):\n    a, b = 0, 1\n    sequence = []\n    for _ in range(n):\n        sequence.append(a)\n        a, b = b, a + b\n    return sequence\n\nfib = fibonacci(12)\nprint("🐍 Fibonacci sequence:")\nprint(" → ".join(str(n) for n in fib))\nprint(f"\\nThe 12th term is: {fib[-1]}")',
      },
      {
        emoji: "📝",
        label: "Analyse de texte",
        label_en: "Text Analysis",
        code: '# Analyseur de texte\ntexte = "Python est un langage de programmation super cool et facile à apprendre"\nmots = texte.split()\nvoyelles = "aeiouyAEIOUY"\nnb_voyelles = sum(1 for c in texte if c in voyelles)\nprint(f"📝 Texte : \\"{texte[:40]}...\\"\\n")\nprint(f"  Nombre de mots    : {len(mots)}")\nprint(f"  Nombre de lettres : {sum(c.isalpha() for c in texte)}")\nprint(f"  Nombre de voyelles: {nb_voyelles}")\nprint(f"  Mot le plus long  : {max(mots, key=len)}")',
        code_en: '# Text analyser\ntext = "Python is a super cool and easy programming language to learn"\nwords = text.split()\nvowels = "aeiouyAEIOUY"\nnum_vowels = sum(1 for c in text if c in vowels)\nprint(f"📝 Text: \\"{text[:40]}...\\"\\n")\nprint(f"  Word count   : {len(words)}")\nprint(f"  Letter count : {sum(c.isalpha() for c in text)}")\nprint(f"  Vowel count  : {num_vowels}")\nprint(f"  Longest word : {max(words, key=len)}")',
      },
      {
        emoji: "🏗️",
        label: "Classe Pokémon",
        label_en: "Pokémon Class",
        code: 'class Pokemon:\n    def __init__(self, nom, type_, pv):\n        self.nom = nom\n        self.type_ = type_\n        self.pv = pv\n    def attaque(self, adversaire, degats):\n        adversaire.pv -= degats\n        print(f"⚔️ {self.nom} attaque {adversaire.nom} ! (-{degats} PV)")\n    def __str__(self):\n        return f"{self.nom} ({self.type_}) — PV: {self.pv}"\n\npikachu = Pokemon("Pikachu", "Électrik", 100)\nsalamèche = Pokemon("Salamèche", "Feu", 90)\nprint(pikachu)\nprint(salamèche)\npikachu.attaque(salamèche, 25)\nprint(f"\\nAprès attaque : {salamèche}")',
        code_en: 'class Pokemon:\n    def __init__(self, name, type_, hp):\n        self.name = name\n        self.type_ = type_\n        self.hp = hp\n    def attack(self, opponent, damage):\n        opponent.hp -= damage\n        print(f"⚔️ {self.name} attacks {opponent.name}! (-{damage} HP)")\n    def __str__(self):\n        return f"{self.name} ({self.type_}) — HP: {self.hp}"\n\npikachu = Pokemon("Pikachu", "Electric", 100)\ncharmander = Pokemon("Charmander", "Fire", 90)\nprint(pikachu)\nprint(charmander)\npikachu.attack(charmander, 25)\nprint(f"\\nAfter attack: {charmander}")',
      },
    ],
  },
];

const DEFAULT_CODE_FR = `# Bienvenue dans l'éditeur PythonKids !
# Écris ton code ici et clique sur "Exécuter"

nom = "PythonKids"
print(f"Bonjour {nom} ! 🐍")

# Essaie de modifier ce code !
for i in range(5):
    print("⭐ " * (i + 1))`;

const DEFAULT_CODE_EN = `# Welcome to the PythonKids editor!
# Write your code here and click "Run"

name = "PythonKids"
print(f"Hello {name}! 🐍")

# Try editing this code!
for i in range(5):
    print("⭐ " * (i + 1))`;

export default function EditorPage() {
  const t = useTranslations("Editor");
  const locale = useLocale();
  const defaultCode = locale === "en" ? DEFAULT_CODE_EN : DEFAULT_CODE_FR;
  const [currentCode, setCurrentCode] = useState(defaultCode);
  const [editorKey, setEditorKey] = useState(0);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="w-full px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        <PythonEditor key={editorKey} defaultCode={currentCode} height="550px" storageKey="sandbox" />

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">{t("examples_label")}</p>
            <button
              onClick={() => {
                localStorage.removeItem("pythonkids_code_sandbox");
                setCurrentCode(defaultCode);
                setEditorKey((k) => k + 1);
              }}
              className="text-sm text-gray-400 dark:text-slate-500 hover:text-red-400 transition-colors"
            >
              {t("reset_button")}
            </button>
          </div>

          <div className="space-y-6">
            {CATEGORIES.map((category) => (
              <div key={category.nameKey}>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-3">{t(category.nameKey as "category_beginner" | "category_intermediate" | "category_advanced")}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {category.templates.map((tpl) => (
                    <button
                      key={tpl.label}
                      onClick={() => {
                        localStorage.removeItem("pythonkids_code_sandbox");
                        setCurrentCode(lf(tpl, "code", locale));
                        setEditorKey((k) => k + 1);
                      }}
                      className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-slate-700 rounded-xl p-3 text-left hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                      <span className="text-xl block mb-1">{tpl.emoji}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">{lf(tpl, "label", locale)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-400 dark:text-slate-500 mt-6 text-center">
            {t("saved_note")}
          </p>
        </div>
      </div>
    </div>
  );
}
