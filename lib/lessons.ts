export interface LessonExercise {
  instruction: string;
  starterCode: string;
  expectedOutput: string;
  hints?: [string, string, string];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface LessonQuiz {
  questions: QuizQuestion[];
}

export interface Lesson {
  title: string;
  description: string;
  code: string;
  exercise?: LessonExercise;
  quiz?: LessonQuiz;
}

export interface LevelData {
  id: number;
  emoji: string;
  name: string;
  color: string;
  lessons: Lesson[];
}

export const LEVELS_DATA: Record<string, LevelData> = {
  "0": {
    id: 0,
    emoji: "🌟",
    name: "Premiers pas",
    color: "from-green-400 to-emerald-500",
    lessons: [
      {
        title: "Dis bonjour à l'ordinateur !",
        description: "L'ordinateur fait tout ce que tu lui dis !\nIl suffit de lui écrire des instructions en Python.\nTon premier ordre : lui dire d'afficher un message.\n🟢 Clique sur ▶ Exécuter pour voir la magie !",
        code: '# Le dièse # sert à écrire une note pour toi.\n# L\'ordinateur ne lit pas ces lignes.\n\n# Ton premier programme !\nprint("Bonjour le monde ! 🌍")\nprint("Je suis en train de coder ! 🎉")',
        exercise: {
          instruction: "À toi ! Écris un programme qui affiche exactement :\nJe code avec Python ! 🐍",
          starterCode: "# Affiche le message !\n",
          expectedOutput: "Je code avec Python ! 🐍",
          hints: [
            "Le mot magique en Python pour afficher du texte est print().",
            "Écris print() et mets ton texte entre guillemets à l'intérieur.",
            'Essaie : print("Je code avec Python ! 🐍")',
          ],
        },
        quiz: {
          questions: [
            {
              question: "À quoi sert print() en Python ?",
              options: ["Calculer un résultat", "Afficher du texte à l'écran", "Créer une variable", "Faire une boucle"],
              correct: 1,
              explanation: "print() est la fonction magique pour afficher du texte à l'écran.",
            },
            {
              question: "Quel code affiche le mot Bonjour ?",
              options: ['print("Bonjour")', 'display("Bonjour")', 'echo Bonjour', 'show("Bonjour")'],
              correct: 0,
              explanation: "En Python, on utilise toujours print() pour afficher.",
            },
          ],
        },
      },
      {
        title: "Fais parler les animaux !",
        description: "print() est le mot magique de Python !\nTu écris print( ) et entre les ( ) tu mets ton texte entre \" \".\nChaque print() affiche une nouvelle ligne.\n✏️ Change le texte et clique sur ▶ pour voir !",
        code: 'print("🐶 Le chien dit : Ouaf !")\nprint("🐱 Le chat dit : Miaou !")\nprint("🐸 La grenouille dit : Coâ !")\nprint("🦁 Le lion dit : Roaaaar !")\nprint("🐍 Le serpent dit : Ssssss... je suis Python !")',
        exercise: {
          instruction: "Fais parler exactement ces 3 animaux :\n🐧 Le pingouin dit : Coin coin !\n🦊 Le renard dit : Glapissement !\n🐝 L'abeille dit : Bzzzz !",
          starterCode: "# Fais parler les 3 animaux !\n",
          expectedOutput: "🐧 Le pingouin dit : Coin coin !\n🦊 Le renard dit : Glapissement !\n🐝 L'abeille dit : Bzzzz !",
        },
      },
      {
        title: "Dessine avec Python !",
        description: "On peut dessiner avec Python !\nIl suffit d'utiliser plusieurs print() à la suite.\nChaque ligne de code = une ligne du dessin.\n✏️ Exécute le code, puis change les * pour créer ton propre dessin !",
        code: '# Un sapin 🎄\nprint("    *")\nprint("   ***")\nprint("  *****")\nprint(" *******")\nprint("   | |")\n\nprint("")\n\n# Un soleil ☀️\nprint("  \\\\  |  /")\nprint("   \\ | /")\nprint("----***----")\nprint("   / | \\")\nprint("  /  |  \\")\n\nprint("")\nprint("À toi de dessiner quelque chose !")',
        exercise: {
          instruction: "Dessine cette flèche exactement avec print() :\n-->\n---\n-->",
          starterCode: "# Dessine la flèche !\n",
          expectedOutput: "-->\n---\n-->",
        },
      },
      {
        title: "Mini-projet : La carte de mon animal",
        description: "Crée la carte d'identité de ton animal préféré !\nChange le nom, l'animal et ce qu'il mange.\nUtilise print() pour tout afficher.\n🎨 Sois créatif et amuse-toi !",
        code: '# 🐾 MINI-PROJET : Carte de mon animal préféré !\n# Change les infos pour mettre TON animal !\n\nprint("==============================")\nprint("  🐾 CARTE DE MON ANIMAL 🐾")\nprint("==============================")\nprint("Nom           : Filou")\nprint("Animal        : Chien 🐶")\nprint("Couleur       : Marron et blanc")\nprint("Nourriture    : Croquettes et caresses")\nprint("Super-pouvoir : Faire des câlins")\nprint("Cri           : OUAF OUAF !")\nprint("==============================")\nprint("Bravo, tu sais coder ! 🎉")',
      },
    ],
  },
  "1": {
    id: 1,
    emoji: "⭐",
    name: "Débutant",
    color: "from-yellow-400 to-orange-400",
    lessons: [
      {
        title: "Les variables",
        description: "Une variable, c'est comme une boîte avec une étiquette !\nTu crées une boîte appelée 'prenom' et tu mets 'Alice' dedans.\nPlus tard, quand tu écris prenom, Python sait que c'est 'Alice' !\nEssaie de changer 'Alice' par ton propre prénom !",
        code: 'prenom = "Alice"\nage = 12\nprefere_python = True\n\nprint(f"Je m\'appelle {prenom}")\nprint(f"J\'ai {age} ans")\nprint(f"J\'aime Python : {prefere_python}")',
        exercise: {
          instruction: "Utilise les variables pour afficher exactement :\nLe joueur Max a 100 points !",
          starterCode: 'nom = "Max"\npoints = 100\n# Affiche le message avec les variables\n',
          expectedOutput: "Le joueur Max a 100 points !",
          hints: [
            "Tu dois combiner les variables nom et points dans un print().",
            "Utilise une f-string : print(f\"...{variable}...\")",
            'Écris : print(f"Le joueur {nom} a {points} points !")',
          ],
        },
        quiz: {
          questions: [
            {
              question: "Qu'est-ce qu'une variable en Python ?",
              options: ["Une erreur dans le code", "Une boîte qui stocke une valeur", "Un type de boucle", "Une fonction spéciale"],
              correct: 1,
              explanation: "Une variable est comme une boîte avec une étiquette : elle stocke une valeur qu'on peut réutiliser.",
            },
            {
              question: "Comment afficher la valeur d'une variable prenom dans un texte ?",
              options: ['print("prenom")', 'print(f"Bonjour {prenom}")', 'echo(prenom)', 'display prenom'],
              correct: 1,
              explanation: "Les f-strings permettent d'insérer une variable directement dans un texte avec {variable}.",
            },
          ],
        },
      },
      {
        title: "Les types de données",
        description: "Il existe différents types de valeurs en Python.\nUn texte s'écrit entre guillemets : \"Bonjour\".\nUn nombre entier s'écrit sans guillemets : 42.\nUn nombre à virgule aussi : 3.14.\nEn Python, OUI s'écrit True et NON s'écrit False — avec une majuscule obligatoire !",
        code: '# Un texte s\'écrit entre guillemets\npersonnage = "Mario"\n\n# Un nombre entier s\'écrit sans guillemets\nvies = 3\nscore = 4200\n\n# Un nombre à virgule aussi\nvitesse = 8.5\n\n# True = OUI, False = NON (avec une majuscule !)\nest_invincible = False\n\nprint(f"Personnage : {personnage}")\nprint(f"Vies restantes : {vies}")\nprint(f"Score : {score} points")\nprint(f"Vitesse : {vitesse} km/h")\nprint(f"Invincible : {est_invincible}")',
        exercise: {
          instruction: "Affiche le type de chaque variable avec type() :\n(le résultat doit être sur 3 lignes séparées)",
          starterCode: "texte = \"Python\"\nnombre = 42\nvrai_faux = True\n# Affiche le type de chaque variable\n",
          expectedOutput: "<class 'str'>\n<class 'int'>\n<class 'bool'>",
        },
      },
      {
        title: "Les conditions if/else",
        description: "Grâce aux conditions, ton programme peut prendre des décisions tout seul !\nC'est comme dans la vraie vie : SI il pleut ALORS je prends mon parapluie SINON je mets des lunettes de soleil.\nEn Python, on écrit ça avec if (si), elif (ou bien si) et else (sinon).\nEssaie de changer l'âge dans le code et vois ce qui s'affiche !",
        code: 'age = 12\n\nif age >= 18:\n    print("Tu es majeur !")\nelif age >= 13:\n    print("Tu es ado !")\nelse:\n    print("Tu es enfant !")\n\nprint(f"Tu as {age} ans.")',
        exercise: {
          instruction: "Écris une condition : si age vaut 10, affiche 'Accès refusé', sinon affiche 'Bienvenue !'",
          starterCode: "age = 10\n# Si age < 13 : affiche 'Accès refusé'\n# Sinon : affiche 'Bienvenue !'\n",
          expectedOutput: "Accès refusé",
        },
      },
      {
        title: "Demander quelque chose à l'utilisateur",
        description: "Jusqu'ici, c'est toujours Python qui parle. Mais comment faire parler l'utilisateur ?\nAvec input(), tu peux poser une question et récupérer ce que la personne tape au clavier !\nCe qu'elle tape est automatiquement rangé dans une variable.\nEssaie d'écrire ton prénom quand le programme te le demande !",
        code: '# input() pose une question et attend que tu tapes quelque chose\nprenom = input("Comment tu t\'appelles ? ")\n\nprint(f"Bonjour {prenom} !")\nprint(f"Bienvenue sur PythonKids, {prenom} 🐍")\n\n# On peut aussi demander un nombre !\nage = input("Tu as quel âge ? ")\nprint(f"Cool, {age} ans c\'est un super âge pour apprendre Python !")',
        exercise: {
          instruction: "Sans input(), crée les variables et affiche exactement :\nBonjour Lucie !\nTu as 9 ans.",
          starterCode: 'prenom = "Lucie"\nage = 9\n# Affiche les 2 messages\n',
          expectedOutput: "Bonjour Lucie !\nTu as 9 ans.",
        },
      },
      {
        title: "Les opérateurs mathématiques",
        description: "Python sait faire des calculs ! Tu as les opérations classiques (+, -, *, /) mais aussi des bonus :\n// divise et arrondit vers le bas (division entière)\n% donne le reste de la division — super utile pour savoir si un nombre est pair !\n** élève à une puissance.\nEssaie de modifier les valeurs !",
        code: 'a = 17\nb = 5\n\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b:.1f}")\nprint(f"{a} // {b} = {a // b}")\nprint(f"{a} % {b} = {a % b}")\nprint(f"2 ** 8 = {2 ** 8}")\n\nif a % 2 == 0:\n    print(f"{a} est pair")\nelse:\n    print(f"{a} est impair")',
        exercise: {
          instruction: "Calcule et affiche le reste de la division de 23 par 4.",
          starterCode: "# Affiche le reste de 23 ÷ 4\n",
          expectedOutput: "3",
        },
      },
      {
        title: "La boucle while",
        description: "La boucle for répète un nombre fixe de fois. Mais parfois, tu veux répéter tant qu'une condition est vraie — c'est le rôle de while !\nC'est parfait pour des jeux où le joueur continue jusqu'à ce qu'il gagne ou perde.\nAttention : si la condition reste toujours vraie, la boucle tourne à l'infini !",
        code: '# Compte à rebours avec while\ncompteur = 5\n\nwhile compteur > 0:\n    print(f"⏳ {compteur}...")\n    compteur -= 1\n\nprint("🚀 Décollage !")',
        exercise: {
          instruction: "Affiche les nombres de 1 à 5 avec une boucle while (un nombre par ligne).",
          starterCode: "n = 1\n# Affiche 1, 2, 3, 4, 5\n",
          expectedOutput: "1\n2\n3\n4\n5",
        },
      },
      {
        title: "Les chaînes de caractères",
        description: "Une chaîne de caractères (str), c'est du texte entre guillemets.\nPython propose plein d'outils pour les manipuler :\n- len() donne la longueur\n- upper() met tout en majuscules\n- lower() met tout en minuscules\n- replace() remplace des mots\n- in vérifie si un mot est contenu dedans",
        code: 'phrase = "Apprendre Python, c\'est super cool !"\n\nprint(f"Texte original : {phrase}")\nprint(f"Longueur       : {len(phrase)} caractères")\nprint(f"Majuscules     : {phrase.upper()}")\nprint(f"Minuscules     : {phrase.lower()}")\nprint(f"Remplacé       : {phrase.replace(\'super\', \'vraiment\')}")\n\nif "Python" in phrase:\n    print("✅ La phrase contient le mot Python !")\n\nprint(f"Premiers 9 car : {phrase[:9]}")',
        exercise: {
          instruction: "Affiche le mot 'informatique' en majuscules, puis son nombre de lettres.",
          starterCode: 'mot = "informatique"\n# Affiche en majuscules\n# Affiche la longueur\n',
          expectedOutput: "INFORMATIQUE\n12",
        },
      },
      {
        title: "Mini-projet : Quiz",
        description: "Tu sais maintenant utiliser print(), les variables et les conditions — bravo !\nAvec input() tu peux poser une question et vérifier la réponse.\nPour ce mini-projet, le programme pose une question, tu tapes ta réponse, et Python vérifie si c'est juste.\nTu peux changer la question et la bonne réponse pour inventer ton propre quiz !",
        code: '# 🎯 MINI-PROJET : Quiz Python\n\nprint("🧠 QUIZ PYTHON")\nprint("--------------------")\n\nreponse = input("Quel mot utilise-t-on pour afficher du texte en Python ? (en minuscules) ")\n\nif reponse == "print":\n    print("✅ Bravo ! C\'est bien print() !")\nelse:\n    print("❌ Pas tout à fait... La réponse était : print")\n\nprint("Merci d\'avoir joué ! 🎉")',
      },
    ],
  },
  "2": {
    id: 2,
    emoji: "🚀",
    name: "Explorateur",
    color: "from-blue-400 to-cyan-500",
    lessons: [
      {
        title: "Les boucles for",
        description: "Imagine que tu dois écrire 'Je n'oublierai pas mes devoirs' 100 fois... Avec une boucle, Python le fait pour toi en 2 lignes !\nUne boucle for répète des instructions autant de fois que tu veux.\nrange(1, 6) veut dire 'de 1 jusqu'à 5'. À chaque tour, la variable i prend la valeur suivante.",
        code: '# Compter jusqu\'à 5\nfor i in range(1, 6):\n    print(f"Nombre : {i}")\n\nprint("")\n\n# Table de multiplication par 7\nfor i in range(1, 11):\n    print(f"7 x {i} = {7 * i}")',
        quiz: {
          questions: [
            {
              question: "Que fait range(1, 6) dans une boucle for ?",
              options: ["Génère les nombres 1, 2, 3, 4, 5, 6", "Génère les nombres 1, 2, 3, 4, 5", "Répète 6 fois seulement", "Crée une liste vide"],
              correct: 1,
              explanation: "range(1, 6) génère les nombres de 1 à 5 — le dernier chiffre est exclu.",
            },
            {
              question: "Combien de fois s'affiche 'Bravo' avec : for i in range(3): print('Bravo') ?",
              options: ["2 fois", "4 fois", "3 fois", "1 fois"],
              correct: 2,
              explanation: "range(3) génère 0, 1, 2 — donc 3 itérations.",
            },
          ],
        },
      },
      {
        title: "Les listes",
        description: "Une liste, c'est comme un sac à dos dans lequel tu ranges plusieurs choses !\nAu lieu de créer une variable pour chaque fruit, tu les mets tous dans une seule liste entre crochets [ ].\nTu peux demander le premier élément (position 0), le dernier (-1), ou parcourir toute la liste avec for !",
        code: 'fruits = ["pomme", "banane", "cerise", "kiwi"]\n\nprint(f"Nombre de fruits : {len(fruits)}")\nprint(f"Premier fruit : {fruits[0]}")\nprint(f"Dernier fruit : {fruits[-1]}")\n\nfor fruit in fruits:\n    print(f"🍎 {fruit}")',
      },
      {
        title: "Les fonctions",
        description: "Une fonction, c'est comme une recette de cuisine : tu l'écris une fois, et tu peux l'utiliser autant de fois que tu veux !\nTu crées une fonction avec def, tu lui donnes un nom et entre parenthèses tu mets les paramètres dont elle a besoin.\nPlus besoin de réécrire le même code !",
        code: 'def saluer(prenom):\n    print(f"Bonjour {prenom} ! 👋")\n    print(f"Bienvenue sur PythonKids !")\n\ndef calculer(a, b):\n    return a + b\n\nsaluer("Alice")\nsaluer("Bob")\n\nresultat = calculer(10, 5)\nprint(f"10 + 5 = {resultat}")',
      },
      {
        title: "Boucle while et logique",
        description: "On combine la boucle while avec les opérateurs logiques and, or, not.\nand : les DEUX conditions doivent être vraies\nor : au moins UNE doit être vraie\nnot : inverse la condition (True devient False)\nCes outils permettent de créer des règles complexes facilement !",
        code: 'age = 14\na_carte_etudiant = True\n\nif age < 18 and a_carte_etudiant:\n    print("✅ Tarif réduit !")\nelse:\n    print("Prix normal")\n\nprefere_pizza = False\nprefere_pates = True\n\nif prefere_pizza or prefere_pates:\n    print("On mange italien ce soir 🍕")\n\nest_ferme = False\nif not est_ferme:\n    print("Le magasin est ouvert 🏪")',
      },
      {
        title: "Les tuples",
        description: "Un tuple ressemble à une liste, mais il est immuable : une fois créé, on ne peut plus le modifier !\nOn l'écrit avec des parenthèses ( ) au lieu de crochets [ ].\nLes tuples sont parfaits pour stocker des données fixes, comme des coordonnées ou des couleurs RGB.",
        code: '# Un tuple de coordonnées\npoint = (10, 20)\nprint(f"x = {point[0]}, y = {point[1]}")\n\n# Couleurs RGB\nrouge = (255, 0, 0)\nvert  = (0, 255, 0)\nbleu  = (0, 0, 255)\n\ncouleurs = [("Rouge", rouge), ("Vert", vert), ("Bleu", bleu)]\nfor nom, rgb in couleurs:\n    print(f"{nom} : R={rgb[0]}, G={rgb[1]}, B={rgb[2]}")\n\n# Dépackage de tuple\nx, y = point\nprint(f"Coordonnées : x={x}, y={y}")',
      },
      {
        title: "Mini-projet : Jeu de devinette",
        description: "Pour ce mini-projet, on crée un vrai jeu !\nL'ordinateur choisit un nombre au hasard (grâce au module random), et le joueur doit deviner.\nPython compare la réponse et dit si c'est trop grand, trop petit, ou exact.\nTu connais maintenant les variables, les conditions et les fonctions — tu es prêt !",
        code: '# 🎯 MINI-PROJET : Jeu de devinette\nimport random\n\nnombre_secret = random.randint(1, 10)\nprint("🎲 J\'ai choisi un nombre entre 1 et 10...")\nprint(f"(Psst : c\'était le {nombre_secret} !)")\n\nessai = int(input("Ton essai : "))\n\nif essai == nombre_secret:\n    print("🎉 Bravo ! Tu as trouvé !")\nelif essai < nombre_secret:\n    print(f"📈 Trop petit ! C\'était {nombre_secret}")\nelse:\n    print(f"📉 Trop grand ! C\'était {nombre_secret}")',
      },
    ],
  },
  "3": {
    id: 3,
    emoji: "🔨",
    name: "Bâtisseur",
    color: "from-purple-500 to-violet-600",
    lessons: [
      {
        title: "Les dictionnaires",
        description: "Un dictionnaire Python, c'est comme la fiche d'un joueur dans un jeu vidéo : chaque information a un nom (la clé) et une valeur.\nPar exemple : 'nom' → 'Alice', 'score' → 1500.\nOn écrit les dictionnaires entre accolades { }.",
        code: 'joueur = {\n    "nom": "Alice",\n    "score": 1500,\n    "niveau": "Bâtisseur",\n    "badges": ["🌱", "⭐", "🚀"]\n}\n\nprint(f"Joueur : {joueur[\'nom\']}")\nprint(f"Score  : {joueur[\'score\']} pts")\nprint(f"Badges : {\' \'.join(joueur[\'badges\'])}")',
        quiz: {
          questions: [
            {
              question: "Avec quoi on écrit un dictionnaire Python ?",
              options: ["Des crochets [ ]", "Des parenthèses ( )", "Des accolades { }", "Des guillemets \" \""],
              correct: 2,
              explanation: "Les dictionnaires s'écrivent entre accolades { } avec des paires clé: valeur.",
            },
            {
              question: "Comment accéder à la valeur 'nom' dans un dict d appelé joueur ?",
              options: ["joueur.nom", "joueur[nom]", 'joueur["nom"]', "joueur->nom"],
              correct: 2,
              explanation: "On accède à une valeur avec la clé entre crochets et guillemets : joueur[\"nom\"].",
            },
          ],
        },
      },
      {
        title: "Gestion des erreurs",
        description: "Tout le monde fait des erreurs en codant — même les pros !\nAvec try/except, ton programme ne plante plus quand quelque chose se passe mal.\ntry veut dire 'essaie ce code'.\nSi ça foire, except attrape l'erreur et affiche un message sympa au lieu de tout crasher.",
        code: 'def diviser(a, b):\n    try:\n        resultat = a / b\n        print(f"{a} ÷ {b} = {resultat}")\n    except ZeroDivisionError:\n        print("❌ Impossible de diviser par zéro !")\n    except TypeError:\n        print("❌ Il faut des nombres !")\n\ndiviser(10, 2)\ndiviser(10, 0)\ndiviser(10, "cinq")',
      },
      {
        title: "Le débogage",
        description: "Déboguer, c'est trouver et corriger les erreurs dans son code. Ce programme contient 3 bugs ! Lis les messages d'erreur et essaie de les corriger un par un.",
        code: '# 🐛 Ce code contient 3 bugs à corriger !\n# Exécute-le, lis l\'erreur, corrige, recommence.\n\ndef calculer_moyenne(notes):\n    total = 0\n    for note in notes:\n        total = total + note\n    moyenne = total / len(notes\n    return moyenne\n\nmes_notes = [15, 18, 12, 16, 14\nresultat = calculer_moyenne(mes_note)\nprint(f"Ma moyenne : {resultat}/20")',
      },
      {
        title: "Compréhensions de listes",
        description: "Une compréhension de liste, c'est une façon magique de créer une liste en une seule ligne !\nAu lieu d'écrire une boucle for sur 3 lignes pour remplir une liste, tu l'écris en une ligne entre crochets.\nC'est l'une des fonctionnalités les plus aimées de Python !",
        code: '# Sans compréhension : 4 lignes\ncarres_long = []\nfor i in range(1, 6):\n    carres_long.append(i ** 2)\nprint(f"Ancienne méthode : {carres_long}")\n\n# Avec compréhension : 1 ligne ✨\ncarres = [i ** 2 for i in range(1, 6)]\nprint(f"Compréhension    : {carres}")\n\n# Avec condition : seulement les pairs\npairs = [i for i in range(1, 21) if i % 2 == 0]\nprint(f"Nombres pairs    : {pairs}")',
      },
      {
        title: "Les ensembles (sets)",
        description: "Un ensemble (set) est une collection sans doublons et sans ordre particulier.\nIl est parfait pour éliminer les doublons d'une liste, vérifier rapidement si un élément existe, ou faire des opérations mathématiques comme l'union ou l'intersection.",
        code: '# Créer un set\ncouleurs = {"rouge", "bleu", "vert", "rouge"}\nprint(f"Set (sans doublons) : {couleurs}")\nprint(f"Taille : {len(couleurs)}")\n\n# Éliminer les doublons d\'une liste\nnotes = [15, 18, 12, 15, 16, 18, 12]\nuniques = list(set(notes))\nprint(f"Notes sans doublons : {sorted(uniques)}")\n\n# Union et intersection\nclub_foot = {"Alice", "Bob", "Charlie"}\nclub_info = {"Bob", "Diana", "Charlie"}\nprint(f"Dans les deux clubs : {club_foot & club_info}")',
      },
      {
        title: "Mini-projet : Gestionnaire de scores",
        description: "On combine tout ce qu'on a appris : les dictionnaires pour stocker les scores, les fonctions pour organiser le code, et le tri pour afficher le classement !\nC'est exactement comme ça que fonctionne un vrai leaderboard de jeu vidéo.",
        code: '# 🎯 MINI-PROJET : Gestionnaire de scores\n\nscores = {}\n\ndef ajouter_score(nom, points):\n    if nom in scores:\n        scores[nom] += points\n    else:\n        scores[nom] = points\n    print(f"✅ {nom} : {scores[nom]} points")\n\ndef afficher_classement():\n    print("\\n🏆 CLASSEMENT")\n    print("-" * 20)\n    tri = sorted(scores.items(), key=lambda x: x[1], reverse=True)\n    for i, (nom, pts) in enumerate(tri, 1):\n        print(f"{i}. {nom} : {pts} pts")\n\najouter_score("Alice", 500)\najouter_score("Bob", 300)\najouter_score("Alice", 200)\najouter_score("Charlie", 700)\nafficher_classement()',
      },
    ],
  },
  "4": {
    id: 4,
    emoji: "🏆",
    name: "Expert",
    color: "from-pink-500 to-rose-600",
    lessons: [
      {
        title: "La programmation orientée objet",
        description: "Imagine que tu crées un jeu vidéo avec des personnages.\nChaque personnage a un nom, des points de vie, et peut attaquer.\nEn Python, on peut créer un 'moule' pour ces personnages — on appelle ça une classe !\nEnsuite on fabrique autant de personnages qu'on veut à partir de ce moule.",
        code: 'class Personnage:\n    def __init__(self, nom, vie):\n        self.nom = nom\n        self.vie = vie\n        self.niveau = 1\n    \n    def attaquer(self, ennemi, degats):\n        ennemi.vie -= degats\n        print(f"⚔️ {self.nom} attaque {ennemi.nom} : -{degats} PV")\n    \n    def __str__(self):\n        return f"{self.nom} (Niv.{self.niveau}) — ❤️ {self.vie} PV"\n\nheros = Personnage("Arthur", 100)\nvillain = Personnage("Dragon", 200)\n\nprint(heros)\nprint(villain)\nheros.attaquer(villain, 35)\nprint(villain)',
        quiz: {
          questions: [
            {
              question: "En POO, qu'est-ce qu'une classe ?",
              options: ["Un type d'erreur Python", "Un moule pour créer des objets", "Une boucle spéciale", "Un module importable"],
              correct: 1,
              explanation: "Une classe est comme un moule ou un plan : elle décrit la structure et les actions des objets.",
            },
            {
              question: "À quoi sert __init__ dans une classe ?",
              options: ["Supprimer l'objet", "Afficher l'objet", "Initialiser l'objet à sa création", "Comparer deux objets"],
              correct: 2,
              explanation: "__init__ est le constructeur : il s'exécute automatiquement quand on crée un nouvel objet.",
            },
          ],
        },
      },
      {
        title: "Les modules Python",
        description: "Python est livré avec des boîtes à outils toutes prêtes qu'on appelle des modules !\nTu veux tirer au sort ? Utilise random.\nTu veux faire des maths compliquées ? Utilise math.\nTu veux connaître la date ? Utilise datetime.\nIl suffit d'écrire import au début pour déballer la boîte !",
        code: 'import random\nimport math\nfrom datetime import datetime\n\n# random\nprint("🎲 Nombres aléatoires :")\nfor _ in range(3):\n    print(f"  {random.randint(1, 100)}")\n\n# math\nprint(f"\\n📐 Racine de 144 : {math.sqrt(144)}")\nprint(f"📐 Pi : {math.pi:.4f}")\n\n# datetime\nmaintenant = datetime.now()\nprint(f"\\n📅 Aujourd\'hui : {maintenant.strftime(\'%d/%m/%Y\')}")',
      },
      {
        title: "Algorithmes de tri",
        description: "Un algorithme, c'est une suite d'étapes pour résoudre un problème — comme une recette de cuisine, mais pour l'ordinateur !\nLe tri, c'est un grand classique : comment ranger une liste de nombres dans l'ordre ?\nOn va voir le 'tri à bulles' : on compare deux nombres voisins et on les échange si besoin.",
        code: 'def tri_bulles(liste):\n    n = len(liste)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if liste[j] > liste[j + 1]:\n                liste[j], liste[j + 1] = liste[j + 1], liste[j]\n    return liste\n\nnombres = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Avant : {nombres}")\ntrie = tri_bulles(nombres.copy())\nprint(f"Après : {trie}")\n\nprint(f"sorted(): {sorted([64, 34, 25, 12, 22, 11, 90])}")',
      },
      {
        title: "Lambda, map et filter",
        description: "Python permet d'écrire des fonctions ultra-courtes appelées fonctions lambda.\nmap() applique une fonction à chaque élément d'une liste.\nfilter() garde uniquement les éléments qui vérifient une condition.\nCombinées aux lambdas, ces fonctions permettent d'écrire du code très élégant en une ligne !",
        code: '# Lambda : mini-fonction anonyme\ndouble = lambda x: x * 2\nprint(f"Double de 7 : {double(7)}")\n\n# map : appliquer à chaque élément\nnombres = [1, 2, 3, 4, 5]\ncarres = list(map(lambda x: x ** 2, nombres))\nprint(f"Carrés : {carres}")\n\n# filter : garder seulement certains éléments\npairs = list(filter(lambda x: x % 2 == 0, nombres))\nprint(f"Pairs : {pairs}")',
      },
      {
        title: "La récursivité",
        description: "Une fonction récursive est une fonction qui s'appelle elle-même !\nC'est un concept puissant pour résoudre des problèmes qui se répètent.\nIl faut toujours prévoir un cas de base (condition d'arrêt) pour éviter que ça tourne à l'infini.\nExemple classique : la factorielle. 5! = 5 × 4! = 5 × 4 × 3! = ...",
        code: 'def factorielle(n):\n    if n <= 1:\n        return 1\n    return n * factorielle(n - 1)\n\nfor i in range(1, 8):\n    print(f"{i}! = {factorielle(i)}")\n\n# Fibonacci récursif\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nfib = [fibonacci(i) for i in range(10)]\nprint(f"\\nFibonacci : {fib}")',
      },
      {
        title: "Mini-projet : Jeu de rôle textuel",
        description: "Le grand final !\nTu vas créer un vrai jeu de combat avec tout ce que tu as appris : des classes pour les personnages, du hasard pour les dégâts, une boucle while pour les tours de combat, et des conditions pour savoir qui gagne.\nExécute plusieurs fois — le résultat change à chaque fois !",
        code: '# 🎯 MINI-PROJET FINAL : Jeu de rôle\nimport random\n\nclass Guerrier:\n    def __init__(self, nom):\n        self.nom = nom\n        self.vie = 100\n        self.attaque = random.randint(15, 25)\n    \n    def est_vivant(self):\n        return self.vie > 0\n    \n    def attaquer(self, cible):\n        degats = random.randint(self.attaque - 5, self.attaque + 5)\n        cible.vie = max(0, cible.vie - degats)\n        return degats\n\nheros = Guerrier("Toi")\ndragon = Guerrier("Dragon Géant")\ndragon.vie = 80\n\nprint("⚔️  COMBAT !")\nprint(f"{heros.nom} (❤️ {heros.vie}) VS {dragon.nom} (❤️ {dragon.vie})\\n")\n\ntour = 1\nwhile heros.est_vivant() and dragon.est_vivant():\n    d = heros.attaquer(dragon)\n    print(f"Tour {tour}: Tu fais {d} dégâts → Dragon : ❤️ {dragon.vie}")\n    if dragon.est_vivant():\n        d = dragon.attaquer(heros)\n        print(f"       Le dragon riposte : {d} dégâts → Toi : ❤️ {heros.vie}")\n    tour += 1\n\nprint("\\n" + ("🎉 VICTOIRE !" if heros.est_vivant() else "💀 DÉFAITE..."))',
      },
    ],
  },
  "5": {
    id: 5,
    emoji: "🌐",
    name: "Maître",
    color: "from-cyan-500 to-blue-600",
    lessons: [
      {
        title: "Le module json",
        description: "JSON (JavaScript Object Notation) est le format universel pour échanger des données sur internet.\nEn Python, le module json permet de convertir un dictionnaire en texte JSON (sérialisation) et inversement (désérialisation).\nQuand tu parles à une API web, elle te répond en JSON !",
        code: 'import json\n\n# Dictionnaire Python → texte JSON\nprofil = {\n    "username": "Alice",\n    "score": 1500,\n    "badges": ["🌱", "⭐", "🚀"],\n    "actif": True\n}\n\ntexte_json = json.dumps(profil, indent=2, ensure_ascii=False)\nprint("Texte JSON :")\nprint(texte_json)\n\n# Texte JSON → dictionnaire Python\njson_recu = \'{"ville": "Paris", "population": 2161000, "capitale": true}\'\ndonnees = json.loads(json_recu)\nprint(f"\\nVille : {donnees[\'ville\']}")\nprint(f"Population : {donnees[\'population\']:,}")',
        quiz: {
          questions: [
            {
              question: "Que signifie JSON ?",
              options: ["Java Standard Object Name", "JavaScript Object Notation", "Python JSON Object", "Just Some Old Notation"],
              correct: 1,
              explanation: "JSON signifie JavaScript Object Notation — c'est le format standard pour échanger des données sur internet.",
            },
            {
              question: "Quelle fonction convertit un dict Python en texte JSON ?",
              options: ["json.parse()", "json.stringify()", "json.dumps()", "json.encode()"],
              correct: 2,
              explanation: "json.dumps() (dump string) sérialise un objet Python en texte JSON.",
            },
          ],
        },
      },
      {
        title: "Le module collections",
        description: "Le module collections contient des structures de données super utiles !\nCounter compte automatiquement les occurrences.\ndefaultdict crée automatiquement une valeur par défaut pour les clés manquantes.\ndeque est une liste optimisée pour ajouter/supprimer des éléments des deux côtés.",
        code: 'from collections import Counter, defaultdict, deque\n\n# Counter : compter automatiquement\ntexte = "abracadabra"\ncompteur = Counter(texte)\nprint(f"Lettres : {dict(compteur)}")\nprint(f"Les 3 plus fréquentes : {compteur.most_common(3)}")\n\n# defaultdict : pas de KeyError !\nscores = defaultdict(int)\nscores["Alice"] += 100\nscores["Bob"] += 200\nscores["Alice"] += 50\nprint(f"\\nScores : {dict(scores)}")\n\n# deque : file d\'attente efficace\nfile = deque(["Alice", "Bob", "Charlie"])\nfile.append("Diana")\nfile.appendleft("Zara")\nprint(f"\\nFile : {list(file)}")',
      },
      {
        title: "Les expressions régulières",
        description: "Les expressions régulières (regex) sont un langage pour décrire des motifs dans du texte.\nTu peux trouver tous les emails, les numéros de téléphone, les mots qui commencent par une majuscule, etc.\n. = n'importe quel caractère / \\d = un chiffre / \\w = une lettre ou chiffre / + = un ou plusieurs",
        code: 'import re\n\ntexte = "Contact: alice@python.fr, bob@code.com ou au 06-12-34-56-78"\n\n# Trouver tous les emails\nemails = re.findall(r\'\\w+@\\w+\\.\\w+\', texte)\nprint(f"Emails trouvés : {emails}")\n\n# Trouver le numéro de téléphone\ntel = re.search(r\'\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}\', texte)\nif tel:\n    print(f"Téléphone : {tel.group()}")\n\n# Remplacer des mots\nphrase = "Python est super et Python est puissant"\nnouvelle = re.sub(r\'Python\', \'🐍 Python\', phrase)\nprint(f"\\nAvec emojis : {nouvelle}")',
      },
      {
        title: "Manipulation avancée des données",
        description: "Quand tu travailles avec des données, Python offre des outils puissants :\n- sorted() avec une clé de tri personnalisée\n- zip() pour combiner deux listes\n- enumerate() pour avoir l'index en même temps\nCes outils sont le quotidien des développeurs Python !",
        code: '# Données : liste de joueurs\njoueurs = [\n    {"nom": "Alice",   "niveau": "Expert",    "score": 1500},\n    {"nom": "Bob",     "niveau": "Débutant",  "score": 300},\n    {"nom": "Charlie", "niveau": "Expert",    "score": 1200},\n    {"nom": "Diana",   "niveau": "Débutant",  "score": 450},\n]\n\n# Trier par score décroissant\ntri = sorted(joueurs, key=lambda j: j["score"], reverse=True)\nprint("Classement :")\nfor i, j in enumerate(tri, 1):\n    print(f"  {i}. {j[\'nom\']} — {j[\'score\']} pts")\n\n# Combiner deux listes avec zip\nprenoms = ["Alice", "Bob", "Charlie"]\nscores  = [1500, 300, 1200]\nfor prenom, score in zip(prenoms, scores):\n    print(f"  {prenom} : {score} pts")',
      },
      {
        title: "Mini-projet : Analyseur de texte",
        description: "On combine json, Counter, et re pour créer un vrai outil d'analyse de texte !\nLe programme analyse un texte et produit des statistiques complètes : nombre de mots, lettres les plus fréquentes...\nC'est le genre d'outil que les linguistes et les data scientists utilisent vraiment !",
        code: 'import re\nfrom collections import Counter\n\ntexte = """\nPython est un langage de programmation puissant et polyvalent.\nIl est utilisé dans le développement web, la science des données,\nl\'intelligence artificielle et bien plus encore.\nPython est simple à apprendre mais très puissant !\n"""\n\nmots = texte.lower().split()\nprint(f"📊 ANALYSE DU TEXTE")\nprint("=" * 30)\nprint(f"Nombre de mots     : {len(mots)}")\nprint(f"Nombre de phrases  : {texte.count(\'.\') + texte.count(\'!\')}")\n\nstopwords = {"est", "un", "de", "et", "le", "la", "les", "il", "en"}\nmots_filtres = [m.strip(".,!\\n") for m in mots if m not in stopwords and len(m) > 2]\ncompteur = Counter(mots_filtres)\n\nprint(f"\\n🔤 Top 5 des mots :")\nfor mot, count in compteur.most_common(5):\n    print(f"  \'{mot}\' apparaît {count} fois")',
      },
      {
        title: "Mini-projet : Générateur de mots de passe",
        description: "Un générateur de mots de passe sécurisé — un outil vraiment utile !\nOn utilise le module secrets (plus sécurisé que random pour la cryptographie), string pour les caractères disponibles, et on vérifie que le mot de passe respecte les règles de sécurité.",
        code: 'import secrets\nimport string\n\ndef generer_mdp(longueur=12, majuscules=True, chiffres=True, symboles=True):\n    alphabet = string.ascii_lowercase\n    if majuscules: alphabet += string.ascii_uppercase\n    if chiffres:   alphabet += string.digits\n    if symboles:   alphabet += "!@#$%&*"\n    \n    while True:\n        mdp = \'\'.join(secrets.choice(alphabet) for _ in range(longueur))\n        ok = True\n        if majuscules and not any(c.isupper() for c in mdp): ok = False\n        if chiffres and not any(c.isdigit() for c in mdp): ok = False\n        if symboles and not any(c in "!@#$%&*" for c in mdp): ok = False\n        if ok:\n            return mdp\n\nprint("🔐 GÉNÉRATEUR DE MOTS DE PASSE")\nprint("=" * 35)\nfor longueur in [8, 12, 16]:\n    mdp = generer_mdp(longueur)\n    print(f"  {longueur} caractères : {mdp}")',
      },
    ],
  },
};
