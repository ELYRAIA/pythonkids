"use client";

import PythonEditor from "@/components/PythonEditor";
import Link from "next/link";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";

interface Template {
  emoji: string;
  label: string;
  code: string;
}

interface Category {
  name: string;
  templates: Template[];
}

const CATEGORIES: Category[] = [
  {
    name: "🌱 Débutant",
    templates: [
      { emoji: "👋", label: "Hello World", code: '# Mon premier programme Python !\nprenom = "PythonKids"\nprint(f"Bonjour {prenom} ! 🐍")\nprint("Je viens d\'apprendre à coder !")\nfor i in range(3):\n    print("⭐ " * (i + 1))' },
      { emoji: "🔢", label: "Calculatrice", code: '# Mini calculatrice\na = 42\nb = 7\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} × {b} = {a * b}")\nprint(f"{a} ÷ {b} = {a // b}")' },
      { emoji: "🎲", label: "Dé à lancer", code: 'import random\nprint("🎲 Lance le dé !")\nfor lancer in range(1, 6):\n    resultat = random.randint(1, 6)\n    print(f"Lancer {lancer} : {\"⚀⚁⚂⚃⚄⚅\"[resultat - 1]} ({resultat})")' },
      { emoji: "🎨", label: "Dessin ASCII", code: '# Dessine avec des caractères !\nfor i in range(1, 8):\n    etoiles = "⭐" * i\n    print(etoiles)\nfor i in range(6, 0, -1):\n    etoiles = "⭐" * i\n    print(etoiles)' },
    ],
  },
  {
    name: "🔭 Intermédiaire",
    templates: [
      { emoji: "📋", label: "Liste de courses", code: '# Gestionnaire de liste\ncourses = ["pommes", "bananes", "chocolat", "lait"]\nprint("🛒 Ma liste de courses :")\nfor i, article in enumerate(courses, 1):\n    print(f"  {i}. {article}")\nprint(f"\\nTotal : {len(courses)} articles")' },
      { emoji: "🔢", label: "Table de mult.", code: '# Table de multiplication\nn = 7\nprint(f"📊 Table de {n} :")\nfor i in range(1, 11):\n    ligne = f"  {n} × {i:2d} = {n * i:3d}"\n    if n * i >= 50:\n        ligne += " 💪"\n    print(ligne)' },
      { emoji: "🔐", label: "Générateur mdp", code: 'import random\nimport string\n\ndef generer_mdp(longueur=12):\n    chars = string.ascii_letters + string.digits + "!@#$"\n    return "".join(random.choice(chars) for _ in range(longueur))\n\nprint("🔐 Mots de passe générés :")\nfor i in range(3):\n    print(f"  {i+1}. {generer_mdp()}")' },
      { emoji: "📊", label: "Stats de liste", code: '# Analyse statistique\nnotes = [14, 17, 12, 19, 15, 11, 18, 16]\nprint("📊 Analyse des notes :")\nprint(f"  Minimum  : {min(notes)}/20")\nprint(f"  Maximum  : {max(notes)}/20")\nprint(f"  Moyenne  : {sum(notes)/len(notes):.1f}/20")\nprint(f"  Reçus    : {sum(1 for n in notes if n >= 10)}/{len(notes)}")' },
    ],
  },
  {
    name: "🚀 Avancé",
    templates: [
      { emoji: "🎮", label: "Jeu de devinette", code: 'import random\nnombre_secret = random.randint(1, 20)\ntentatives = 5\nprint(f"🎮 Devine le nombre (entre 1 et 20) — {tentatives} essais !")\nfor essai in range(1, tentatives + 1):\n    guess = int(input(f"Essai {essai}/{tentatives} : "))\n    if guess == nombre_secret:\n        print(f"🏆 Bravo ! Trouvé en {essai} essai(s) !")\n        break\n    elif guess < nombre_secret:\n        print("  ↑ Plus grand !")\n    else:\n        print("  ↓ Plus petit !")\nelse:\n    print(f"😔 Perdu ! C\'était {nombre_secret}.")' },
      { emoji: "🐍", label: "Fibonacci", code: '# Suite de Fibonacci\ndef fibonacci(n):\n    a, b = 0, 1\n    suite = []\n    for _ in range(n):\n        suite.append(a)\n        a, b = b, a + b\n    return suite\n\nfib = fibonacci(12)\nprint("🐍 Suite de Fibonacci :")\nprint(" → ".join(str(n) for n in fib))\nprint(f"\\nLe 12e terme vaut : {fib[-1]}")' },
      { emoji: "📝", label: "Analyse de texte", code: '# Analyseur de texte\ntexte = "Python est un langage de programmation super cool et facile à apprendre"\nmots = texte.split()\nvoyelles = "aeiouyAEIOUY"\nnb_voyelles = sum(1 for c in texte if c in voyelles)\nprint(f"📝 Texte : \\"{texte[:40]}...\\"\\n")\nprint(f"  Nombre de mots    : {len(mots)}")\nprint(f"  Nombre de lettres : {sum(c.isalpha() for c in texte)}")\nprint(f"  Nombre de voyelles: {nb_voyelles}")\nprint(f"  Mot le plus long  : {max(mots, key=len)}")' },
      { emoji: "🏗️", label: "Classe Pokémon", code: 'class Pokemon:\n    def __init__(self, nom, type_, pv):\n        self.nom = nom\n        self.type_ = type_\n        self.pv = pv\n    def attaque(self, adversaire, degats):\n        adversaire.pv -= degats\n        print(f"⚔️ {self.nom} attaque {adversaire.nom} ! (-{degats} PV)")\n    def __str__(self):\n        return f"{self.nom} ({self.type_}) — PV: {self.pv}"\n\npikachu = Pokemon("Pikachu", "Électrik", 100)\nsalamèche = Pokemon("Salamèche", "Feu", 90)\nprint(pikachu)\nprint(salamèche)\npikachu.attaque(salamèche, 25)\nprint(f"\\nAprès attaque : {salamèche}")' },
    ],
  },
];

const DEFAULT_CODE = `# Bienvenue dans l'éditeur PythonKids !
# Écris ton code ici et clique sur "Exécuter"

nom = "PythonKids"
print(f"Bonjour {nom} ! 🐍")

# Essaie de modifier ce code !
for i in range(5):
    print("⭐ " * (i + 1))`;

export default function EditorPage() {
  const [currentCode, setCurrentCode] = useState(DEFAULT_CODE);
  const [editorKey, setEditorKey] = useState(0);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="w-full px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
            Ton bac à sable Python 🧪
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Écris n&apos;importe quel code Python et exécute-le directement dans ton navigateur !
          </p>
        </div>

        <PythonEditor key={editorKey} defaultCode={currentCode} height="550px" storageKey="sandbox" />

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">Exemples rapides :</p>
            <button
              onClick={() => {
                localStorage.removeItem("pythonkids_code_sandbox");
                setCurrentCode(DEFAULT_CODE);
                setEditorKey((k) => k + 1);
              }}
              className="text-sm text-gray-400 dark:text-slate-500 hover:text-red-400 transition-colors"
            >
              🔄 Réinitialiser
            </button>
          </div>

          <div className="space-y-6">
            {CATEGORIES.map((category) => (
              <div key={category.name}>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-3">{category.name}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {category.templates.map((tpl) => (
                    <button
                      key={tpl.label}
                      onClick={() => {
                        localStorage.removeItem("pythonkids_code_sandbox");
                        setCurrentCode(tpl.code);
                        setEditorKey((k) => k + 1);
                      }}
                      className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-slate-700 rounded-xl p-3 text-left hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                      <span className="text-xl block mb-1">{tpl.emoji}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-400 dark:text-slate-500 mt-6 text-center">
            💾 Ton code est sauvegardé automatiquement dans le navigateur
          </p>
        </div>
      </div>
    </div>
  );
}
