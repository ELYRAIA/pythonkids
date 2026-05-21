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
        exercise: {
          instruction: "Crée une liste animaux avec [\"chat\", \"chien\", \"lapin\"] et affiche chaque animal sur une ligne.",
          starterCode: "animaux = [\"chat\", \"chien\", \"lapin\"]\n# Affiche chaque animal avec une boucle\n",
          expectedOutput: "chat\nchien\nlapin",
          hints: [
            "Utilise une boucle for pour parcourir la liste.",
            "Dans la boucle : for animal in animaux: puis print(animal)",
            "for animal in animaux:\n    print(animal)",
          ],
        },
      },
      {
        title: "Les fonctions",
        description: "Une fonction, c'est comme une recette de cuisine : tu l'écris une fois, et tu peux l'utiliser autant de fois que tu veux !\nTu crées une fonction avec def, tu lui donnes un nom et entre parenthèses tu mets les paramètres dont elle a besoin.\nPlus besoin de réécrire le même code !",
        code: 'def saluer(prenom):\n    print(f"Bonjour {prenom} ! 👋")\n    print(f"Bienvenue sur PythonKids !")\n\ndef calculer(a, b):\n    return a + b\n\nsaluer("Alice")\nsaluer("Bob")\n\nresultat = calculer(10, 5)\nprint(f"10 + 5 = {resultat}")',
        exercise: {
          instruction: "Écris une fonction double(n) qui retourne n × 2. Affiche double(7).",
          starterCode: "# Crée la fonction double\n",
          expectedOutput: "14",
          hints: [
            "Une fonction se crée avec def nom(paramètre): et le corps indenté.",
            "Utilise return pour renvoyer la valeur calculée.",
            "def double(n):\n    return n * 2\nprint(double(7))",
          ],
        },
      },
      {
        title: "Boucle while et logique",
        description: "On combine la boucle while avec les opérateurs logiques and, or, not.\nand : les DEUX conditions doivent être vraies\nor : au moins UNE doit être vraie\nnot : inverse la condition (True devient False)\nCes outils permettent de créer des règles complexes facilement !",
        code: 'age = 14\na_carte_etudiant = True\n\nif age < 18 and a_carte_etudiant:\n    print("✅ Tarif réduit !")\nelse:\n    print("Prix normal")\n\nprefere_pizza = False\nprefere_pates = True\n\nif prefere_pizza or prefere_pates:\n    print("On mange italien ce soir 🍕")\n\nest_ferme = False\nif not est_ferme:\n    print("Le magasin est ouvert 🏪")',
        exercise: {
          instruction: "Affiche 'Accès autorisé' si age >= 12 ET has_code est True, sinon 'Refusé'.",
          starterCode: "age = 14\nhas_code = True\n# Affiche le bon message\n",
          expectedOutput: "Accès autorisé",
          hints: [
            "Utilise une condition if avec l'opérateur and entre les deux conditions.",
            "if age >= 12 and has_code: ...",
            "if age >= 12 and has_code:\n    print(\"Accès autorisé\")\nelse:\n    print(\"Refusé\")",
          ],
        },
      },
      {
        title: "Les tuples",
        description: "Un tuple ressemble à une liste, mais il est immuable : une fois créé, on ne peut plus le modifier !\nOn l'écrit avec des parenthèses ( ) au lieu de crochets [ ].\nLes tuples sont parfaits pour stocker des données fixes, comme des coordonnées ou des couleurs RGB.",
        code: '# Un tuple de coordonnées\npoint = (10, 20)\nprint(f"x = {point[0]}, y = {point[1]}")\n\n# Couleurs RGB\nrouge = (255, 0, 0)\nvert  = (0, 255, 0)\nbleu  = (0, 0, 255)\n\ncouleurs = [("Rouge", rouge), ("Vert", vert), ("Bleu", bleu)]\nfor nom, rgb in couleurs:\n    print(f"{nom} : R={rgb[0]}, G={rgb[1]}, B={rgb[2]}")\n\n# Dépackage de tuple\nx, y = point\nprint(f"Coordonnées : x={x}, y={y}")',
        exercise: {
          instruction: "Crée un tuple position avec (3, 7) et affiche : x=3, y=7",
          starterCode: "# Crée le tuple et affiche les coordonnées\n",
          expectedOutput: "x=3, y=7",
          hints: [
            "Un tuple se crée avec des parenthèses : (valeur1, valeur2)",
            "Accède aux éléments avec position[0] pour x et position[1] pour y.",
            "position = (3, 7)\nprint(f\"x={position[0]}, y={position[1]}\")",
          ],
        },
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
        exercise: {
          instruction: "Utilise try/except pour afficher 'Erreur : division impossible' si diviseur vaut 0.",
          starterCode: "diviseur = 0\nnombre = 10\n# Protège la division avec try/except\n",
          expectedOutput: "Erreur : division impossible",
          hints: [
            "Utilise try: pour essayer le code qui peut échouer.",
            "Dans except ZeroDivisionError: mets le message d'erreur.",
            "try:\n    print(nombre / diviseur)\nexcept ZeroDivisionError:\n    print(\"Erreur : division impossible\")",
          ],
        },
      },
      {
        title: "Le débogage",
        description: "Déboguer, c'est trouver et corriger les erreurs dans son code. Ce programme contient 3 bugs ! Lis les messages d'erreur et essaie de les corriger un par un.",
        code: '# 🐛 Ce code contient 3 bugs à corriger !\n# Exécute-le, lis l\'erreur, corrige, recommence.\n\ndef calculer_moyenne(notes):\n    total = 0\n    for note in notes:\n        total = total + note\n    moyenne = total / len(notes\n    return moyenne\n\nmes_notes = [15, 18, 12, 16, 14\nresultat = calculer_moyenne(mes_note)\nprint(f"Ma moyenne : {resultat}/20")',
        exercise: {
          instruction: "Calcule et affiche la moyenne de [12, 14, 16] avec sum() et len().",
          starterCode: "notes = [12, 14, 16]\n# Calcule et affiche la moyenne\n",
          expectedOutput: "14.0",
          hints: [
            "La moyenne = somme / nombre de valeurs.",
            "sum(notes) donne la somme, len(notes) le nombre d'éléments.",
            "print(sum(notes) / len(notes))",
          ],
        },
      },
      {
        title: "Compréhensions de listes",
        description: "Une compréhension de liste, c'est une façon magique de créer une liste en une seule ligne !\nAu lieu d'écrire une boucle for sur 3 lignes pour remplir une liste, tu l'écris en une ligne entre crochets.\nC'est l'une des fonctionnalités les plus aimées de Python !",
        code: '# Sans compréhension : 4 lignes\ncarres_long = []\nfor i in range(1, 6):\n    carres_long.append(i ** 2)\nprint(f"Ancienne méthode : {carres_long}")\n\n# Avec compréhension : 1 ligne ✨\ncarres = [i ** 2 for i in range(1, 6)]\nprint(f"Compréhension    : {carres}")\n\n# Avec condition : seulement les pairs\npairs = [i for i in range(1, 21) if i % 2 == 0]\nprint(f"Nombres pairs    : {pairs}")',
        exercise: {
          instruction: "Crée une liste des cubes de 1 à 5 avec une compréhension de liste.",
          starterCode: "# Crée la liste des cubes de 1 à 5\n",
          expectedOutput: "[1, 8, 27, 64, 125]",
          hints: [
            "Une compréhension de liste s'écrit : [expression for i in range(...)]",
            "Pour les cubes, l'expression est i ** 3.",
            "cubes = [i ** 3 for i in range(1, 6)]\nprint(cubes)",
          ],
        },
      },
      {
        title: "Les ensembles (sets)",
        description: "Un ensemble (set) est une collection sans doublons et sans ordre particulier.\nIl est parfait pour éliminer les doublons d'une liste, vérifier rapidement si un élément existe, ou faire des opérations mathématiques comme l'union ou l'intersection.",
        code: '# Créer un set\ncouleurs = {"rouge", "bleu", "vert", "rouge"}\nprint(f"Set (sans doublons) : {couleurs}")\nprint(f"Taille : {len(couleurs)}")\n\n# Éliminer les doublons d\'une liste\nnotes = [15, 18, 12, 15, 16, 18, 12]\nuniques = list(set(notes))\nprint(f"Notes sans doublons : {sorted(uniques)}")\n\n# Union et intersection\nclub_foot = {"Alice", "Bob", "Charlie"}\nclub_info = {"Bob", "Diana", "Charlie"}\nprint(f"Dans les deux clubs : {club_foot & club_info}")',
        exercise: {
          instruction: "Supprime les doublons de [3, 1, 4, 1, 5, 9, 2, 6, 5, 3] et affiche-les triés.",
          starterCode: "nombres = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\n# Supprime les doublons et affiche en ordre\n",
          expectedOutput: "[1, 2, 3, 4, 5, 6, 9]",
          hints: [
            "Convertis la liste en set pour supprimer automatiquement les doublons.",
            "Utilise list(set(...)) pour reconvertir en liste, puis sorted() pour trier.",
            "print(sorted(list(set(nombres))))",
          ],
        },
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
        exercise: {
          instruction: "Importe math et affiche la racine carrée de 225.",
          starterCode: "import math\n# Calcule et affiche la racine carrée de 225\n",
          expectedOutput: "15.0",
          hints: [
            "Le module math contient la fonction sqrt() pour la racine carrée.",
            "Utilise math.sqrt(valeur).",
            "print(math.sqrt(225))",
          ],
        },
      },
      {
        title: "Algorithmes de tri",
        description: "Un algorithme, c'est une suite d'étapes pour résoudre un problème — comme une recette de cuisine, mais pour l'ordinateur !\nLe tri, c'est un grand classique : comment ranger une liste de nombres dans l'ordre ?\nOn va voir le 'tri à bulles' : on compare deux nombres voisins et on les échange si besoin.",
        code: 'def tri_bulles(liste):\n    n = len(liste)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if liste[j] > liste[j + 1]:\n                liste[j], liste[j + 1] = liste[j + 1], liste[j]\n    return liste\n\nnombres = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Avant : {nombres}")\ntrie = tri_bulles(nombres.copy())\nprint(f"Après : {trie}")\n\nprint(f"sorted(): {sorted([64, 34, 25, 12, 22, 11, 90])}")',
        exercise: {
          instruction: "Trie [5, 2, 8, 1, 9, 3] dans l'ordre décroissant avec sorted() et affiche-le.",
          starterCode: "nombres = [5, 2, 8, 1, 9, 3]\n# Trie dans l'ordre décroissant\n",
          expectedOutput: "[9, 8, 5, 3, 2, 1]",
          hints: [
            "sorted() accepte un paramètre reverse=True pour l'ordre décroissant.",
            "sorted(liste, reverse=True) trie du plus grand au plus petit.",
            "print(sorted(nombres, reverse=True))",
          ],
        },
      },
      {
        title: "Lambda, map et filter",
        description: "Python permet d'écrire des fonctions ultra-courtes appelées fonctions lambda.\nmap() applique une fonction à chaque élément d'une liste.\nfilter() garde uniquement les éléments qui vérifient une condition.\nCombinées aux lambdas, ces fonctions permettent d'écrire du code très élégant en une ligne !",
        code: '# Lambda : mini-fonction anonyme\ndouble = lambda x: x * 2\nprint(f"Double de 7 : {double(7)}")\n\n# map : appliquer à chaque élément\nnombres = [1, 2, 3, 4, 5]\ncarres = list(map(lambda x: x ** 2, nombres))\nprint(f"Carrés : {carres}")\n\n# filter : garder seulement certains éléments\npairs = list(filter(lambda x: x % 2 == 0, nombres))\nprint(f"Pairs : {pairs}")',
        exercise: {
          instruction: "Utilise map et une lambda pour tripler chaque nombre de [1, 2, 3, 4, 5].",
          starterCode: "nombres = [1, 2, 3, 4, 5]\n# Utilise map et lambda pour tripler\n",
          expectedOutput: "[3, 6, 9, 12, 15]",
          hints: [
            "map(fonction, liste) applique la fonction à chaque élément.",
            "Utilise une lambda : lambda x: x * 3",
            "print(list(map(lambda x: x * 3, nombres)))",
          ],
        },
      },
      {
        title: "La récursivité",
        description: "Une fonction récursive est une fonction qui s'appelle elle-même !\nC'est un concept puissant pour résoudre des problèmes qui se répètent.\nIl faut toujours prévoir un cas de base (condition d'arrêt) pour éviter que ça tourne à l'infini.\nExemple classique : la factorielle. 5! = 5 × 4! = 5 × 4 × 3! = ...",
        code: 'def factorielle(n):\n    if n <= 1:\n        return 1\n    return n * factorielle(n - 1)\n\nfor i in range(1, 8):\n    print(f"{i}! = {factorielle(i)}")\n\n# Fibonacci récursif\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nfib = [fibonacci(i) for i in range(10)]\nprint(f"\\nFibonacci : {fib}")',
        exercise: {
          instruction: "Écris une fonction récursive somme(n) qui calcule 1+2+...+n. Affiche somme(5).",
          starterCode: "# Écris la fonction somme récursive\n",
          expectedOutput: "15",
          hints: [
            "Une fonction récursive s'appelle elle-même avec un cas de base pour s'arrêter.",
            "somme(n) = n + somme(n-1), avec somme(0) = 0 comme cas de base.",
            "def somme(n):\n    if n <= 0:\n        return 0\n    return n + somme(n - 1)\nprint(somme(5))",
          ],
        },
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
        exercise: {
          instruction: "Utilise Counter pour compter les lettres de 'banana' et affiche le nombre de 'a'.",
          starterCode: "from collections import Counter\nmot = 'banana'\n# Compte les lettres et affiche le nombre de 'a'\n",
          expectedOutput: "3",
          hints: [
            "Counter(mot) crée un compteur qui compte automatiquement chaque lettre.",
            "Accède à la valeur d'une clé comme un dictionnaire : compteur['a']",
            "compteur = Counter(mot)\nprint(compteur['a'])",
          ],
        },
      },
      {
        title: "Les expressions régulières",
        description: "Les expressions régulières (regex) sont un langage pour décrire des motifs dans du texte.\nTu peux trouver tous les emails, les numéros de téléphone, les mots qui commencent par une majuscule, etc.\n. = n'importe quel caractère / \\d = un chiffre / \\w = une lettre ou chiffre / + = un ou plusieurs",
        code: 'import re\n\ntexte = "Contact: alice@python.fr, bob@code.com ou au 06-12-34-56-78"\n\n# Trouver tous les emails\nemails = re.findall(r\'\\w+@\\w+\\.\\w+\', texte)\nprint(f"Emails trouvés : {emails}")\n\n# Trouver le numéro de téléphone\ntel = re.search(r\'\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}\', texte)\nif tel:\n    print(f"Téléphone : {tel.group()}")\n\n# Remplacer des mots\nphrase = "Python est super et Python est puissant"\nnouvelle = re.sub(r\'Python\', \'🐍 Python\', phrase)\nprint(f"\\nAvec emojis : {nouvelle}")',
        exercise: {
          instruction: "Utilise re.findall pour trouver tous les nombres dans la phrase.",
          starterCode: "import re\ntexte = \'J\'ai 42 pommes, 100 bananes et 7 kiwis\'\n# Trouve tous les nombres\n",
          expectedOutput: "[\'42\', \'100\', \'7\']",
          hints: [
            "re.findall(pattern, texte) retourne une liste de toutes les correspondances.",
            "Le pattern \\\\d+ correspond à un ou plusieurs chiffres.",
            "print(re.findall(r\'\\\\d+\', texte))",
          ],
        },
      },
      {
        title: "Manipulation avancée des données",
        description: "Quand tu travailles avec des données, Python offre des outils puissants :\n- sorted() avec une clé de tri personnalisée\n- zip() pour combiner deux listes\n- enumerate() pour avoir l'index en même temps\nCes outils sont le quotidien des développeurs Python !",
        code: '# Données : liste de joueurs\njoueurs = [\n    {"nom": "Alice",   "niveau": "Expert",    "score": 1500},\n    {"nom": "Bob",     "niveau": "Débutant",  "score": 300},\n    {"nom": "Charlie", "niveau": "Expert",    "score": 1200},\n    {"nom": "Diana",   "niveau": "Débutant",  "score": 450},\n]\n\n# Trier par score décroissant\ntri = sorted(joueurs, key=lambda j: j["score"], reverse=True)\nprint("Classement :")\nfor i, j in enumerate(tri, 1):\n    print(f"  {i}. {j[\'nom\']} — {j[\'score\']} pts")\n\n# Combiner deux listes avec zip\nprenoms = ["Alice", "Bob", "Charlie"]\nscores  = [1500, 300, 1200]\nfor prenom, score in zip(prenoms, scores):\n    print(f"  {prenom} : {score} pts")',
        exercise: {
          instruction: "Trie les élèves par score croissant et affiche uniquement leurs noms.",
          starterCode: "eleves = [\n    {\"nom\": \"Alice\", \"score\": 85},\n    {\"nom\": \"Bob\",   \"score\": 72},\n    {\"nom\": \"Charlie\", \"score\": 95},\n]\n# Trie par score et affiche les noms\n",
          expectedOutput: "Bob\nAlice\nCharlie",
          hints: [
            "Utilise sorted() avec key= pour préciser le critère de tri.",
            "key=lambda e: e['score'] trie par la valeur du champ score.",
            "for e in sorted(eleves, key=lambda e: e['score']):\n    print(e['nom'])",
          ],
        },
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
  "6": {
    id: 6,
    emoji: "🏗️",
    name: "Architecte",
    color: "from-violet-500 to-purple-700",
    lessons: [
      {
        title: "Héritage et polymorphisme",
        description: "L'héritage permet à une classe d'utiliser les attributs et méthodes d'une autre classe !\nTu crées une classe \"mère\" générale, et des classes \"filles\" spécialisées.\nLe mot-clé super() appelle le constructeur de la classe mère.\nLe polymorphisme : chaque classe peut avoir sa propre version d'une méthode.",
        code: 'class Vehicule:\n    def __init__(self, marque, couleur):\n        self.marque = marque\n        self.couleur = couleur\n    \n    def description(self):\n        return f"{self.couleur} {self.marque}"\n    \n    def klaxonner(self):\n        return "Beep !"\n\nclass Voiture(Vehicule):\n    def __init__(self, marque, couleur, portes):\n        super().__init__(marque, couleur)\n        self.portes = portes\n    \n    def description(self):\n        return f"Voiture {self.couleur} {self.marque} ({self.portes} portes)"\n    \n    def klaxonner(self):\n        return "Pouet Pouet !"\n\nclass Moto(Vehicule):\n    def klaxonner(self):\n        return "Vroooom !"\n\nvehicules = [\n    Voiture("Renault", "Rouge", 4),\n    Moto("Yamaha", "Noire"),\n    Voiture("Peugeot", "Bleue", 5),\n]\n\nfor v in vehicules:\n    print(f"{v.description()} → {v.klaxonner()}")',
        exercise: {
          instruction: "Crée une classe Oiseau qui hérite d'Animal et surcharge parler() pour retourner 'Cui cui !'.\nAffiche le nom puis le cri d'un Oiseau('Tweety').",
          starterCode: "class Animal:\n    def __init__(self, nom):\n        self.nom = nom\n    def parler(self):\n        return '...'\n\n# Crée Oiseau ici\n",
          expectedOutput: "Tweety\nCui cui !",
          hints: [
            "Une classe hérite avec la syntaxe : class Oiseau(Animal):",
            "Redéfinis parler() dans Oiseau pour retourner 'Cui cui !'",
            "class Oiseau(Animal):\n    def parler(self):\n        return 'Cui cui !'\no = Oiseau('Tweety')\nprint(o.nom)\nprint(o.parler())",
          ],
        },
        quiz: {
          questions: [
            {
              question: "Comment une classe Python hérite-t-elle d'une autre ?",
              options: ["class Enfant inherits Parent:", "class Enfant(Parent):", "class Enfant extends Parent:", "Enfant = class(Parent)"],
              correct: 1,
              explanation: "La syntaxe est class NomEnfant(NomParent): — les parenthèses indiquent l'héritage.",
            },
            {
              question: "À quoi sert super().__init__() dans une classe enfant ?",
              options: ["Supprimer la classe parent", "Appeler le constructeur de la classe parent", "Créer un nouvel objet", "Copier toutes les méthodes"],
              correct: 1,
              explanation: "super().__init__() appelle le constructeur de la classe parente pour initialiser les attributs hérités.",
            },
          ],
        },
      },
      {
        title: "Les décorateurs",
        description: "Un décorateur est une fonction qui enveloppe une autre fonction pour lui ajouter des comportements !\nTu l'appliques avec @nom_decorateur juste avant la définition de la fonction.\nC'est comme ajouter un emballage cadeau à une fonction existante.\nLes frameworks web comme Django et Flask utilisent des décorateurs partout !",
        code: 'def majuscule(fonction):\n    def wrapper(*args, **kwargs):\n        resultat = fonction(*args, **kwargs)\n        return resultat.upper() if isinstance(resultat, str) else resultat\n    return wrapper\n\ndef encadrer(caractere):\n    def decorateur(fonction):\n        def wrapper(*args, **kwargs):\n            resultat = fonction(*args, **kwargs)\n            bordure = caractere * (len(str(resultat)) + 4)\n            return f"{bordure}\\n{caractere} {resultat} {caractere}\\n{bordure}"\n        return wrapper\n    return decorateur\n\n@majuscule\ndef saluer(prenom):\n    return f"bonjour {prenom} !"\n\n@encadrer("*")\ndef titre():\n    return "Python est super"\n\nprint(saluer("alice"))\nprint()\nprint(titre())',
        exercise: {
          instruction: "Écris un décorateur double qui retourne le résultat de la fonction répété deux fois.\nApplique-le à message() qui retourne 'ping'.\nAffiche message().",
          starterCode: "def double(fonction):\n    def wrapper(*args, **kwargs):\n        # Appelle la fonction et retourne le résultat × 2\n        pass\n    return wrapper\n\n@double\ndef message():\n    return 'ping'\n\nprint(message())",
          expectedOutput: "pingping",
          hints: [
            "Appelle la fonction avec fonction(*args, **kwargs) pour obtenir le résultat.",
            "Retourne le résultat concaténé avec lui-même : resultat + resultat",
            "def double(fonction):\n    def wrapper(*args, **kwargs):\n        r = fonction(*args, **kwargs)\n        return r + r\n    return wrapper",
          ],
        },
      },
      {
        title: "Générateurs et yield",
        description: "Un générateur est une fonction qui produit des valeurs une par une avec yield.\nAu lieu de tout calculer et stocker en mémoire, il génère la valeur suivante à la demande.\nC'est parfait pour traiter de grandes quantités de données sans saturer la mémoire !\nyield met la fonction en pause et reprend au même endroit à l'appel suivant.",
        code: 'def fibonacci_gen():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ndef multiples_de(n, limite):\n    valeur = n\n    while valeur <= limite:\n        yield valeur\n        valeur += n\n\nfrom itertools import islice\n\n# Fibonacci : prendre seulement les 10 premiers\nfibs = list(islice(fibonacci_gen(), 10))\nprint(f"Fibonacci : {fibs}")\n\n# Multiples de 4 jusqu\'à 30\nmult = list(multiples_de(4, 30))\nprint(f"Multiples de 4 : {mult}")\n\n# Expression génératrice : comme une list comprehension mais lazy\npairs_carres = sum(x**2 for x in range(1, 11) if x % 2 == 0)\nprint(f"Somme carrés pairs (1-10) : {pairs_carres}")',
        exercise: {
          instruction: "Écris un générateur compter(debut, fin) qui produit les entiers de debut à fin inclus.\nAffiche chaque valeur générée par compter(1, 5) sur une ligne.",
          starterCode: "def compter(debut, fin):\n    # Utilise yield pour produire chaque valeur\n    pass\n\nfor n in compter(1, 5):\n    print(n)",
          expectedOutput: "1\n2\n3\n4\n5",
          hints: [
            "Utilise une boucle while et yield pour produire chaque valeur.",
            "Commence avec n = debut, yield n, puis n += 1 jusqu'à fin.",
            "def compter(debut, fin):\n    n = debut\n    while n <= fin:\n        yield n\n        n += 1",
          ],
        },
      },
      {
        title: "Les dataclasses",
        description: "Une dataclass est un raccourci Python pour créer des classes qui stockent des données.\nAvec @dataclass, Python génère automatiquement __init__, __repr__ et __eq__ !\nTu décris juste les champs et leurs types — Python fait le reste.\nTrès utilisé pour les données structurées : utilisateurs, produits, points, etc.",
        code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Joueur:\n    nom: str\n    niveau: int = 1\n    score: int = 0\n    badges: list = field(default_factory=list)\n    \n    def gagner_badge(self, badge):\n        self.badges.append(badge)\n    \n    @property\n    def rang(self):\n        if self.score >= 2000: return "Legend"\n        if self.score >= 1000: return "Expert"\n        return "Novice"\n\n@dataclass(order=True)\nclass Point:\n    x: float = 0.0\n    y: float = 0.0\n    \n    def distance_origine(self):\n        return (self.x**2 + self.y**2) ** 0.5\n\nalice = Joueur("Alice", niveau=3, score=1500)\nalice.gagner_badge("⭐")\nalice.gagner_badge("🚀")\nprint(alice)\nprint(f"Rang : {alice.rang}")\n\np = Point(3.0, 4.0)\nprint(f"\\n{p} → distance = {p.distance_origine()}")',
        exercise: {
          instruction: "Crée une dataclass Livre avec les champs titre (str), auteur (str) et pages (int = 0).\nAffiche Livre(titre='Python', auteur='Guido', pages=300).",
          starterCode: "from dataclasses import dataclass\n\n# Crée la dataclass Livre\n\nprint(Livre(titre='Python', auteur='Guido', pages=300))",
          expectedOutput: "Livre(titre='Python', auteur='Guido', pages=300)",
          hints: [
            "Utilise @dataclass avant la définition de la classe.",
            "Déclare les champs avec leur type : titre: str, auteur: str, pages: int = 0",
            "@dataclass\nclass Livre:\n    titre: str\n    auteur: str\n    pages: int = 0",
          ],
        },
      },
      {
        title: "Les protocoles Python",
        description: "Les méthodes spéciales (dunder methods) permettent à tes classes de se comporter comme des types Python natifs !\n__len__ : ton objet répond à len()\n__contains__ : ton objet répond à l'opérateur in\n__iter__ : ton objet peut être parcouru avec for\n__str__ : définit ce que print() affiche\nC'est le secret derrière list, dict, str...",
        code: 'class Bibliotheque:\n    def __init__(self, nom):\n        self.nom = nom\n        self.livres = []\n    \n    def ajouter(self, titre, auteur):\n        self.livres.append({"titre": titre, "auteur": auteur})\n    \n    def __len__(self):\n        return len(self.livres)\n    \n    def __contains__(self, titre):\n        return any(l["titre"] == titre for l in self.livres)\n    \n    def __iter__(self):\n        return iter(self.livres)\n    \n    def __str__(self):\n        lignes = [f"  📚 {l[\'titre\']} — {l[\'auteur\']}" for l in self.livres]\n        return f"🏠 {self.nom} ({len(self)} livres):\\n" + "\\n".join(lignes)\n\nbib = Bibliotheque("Ma bibliothèque")\nbib.ajouter("Python pour tous", "Guido")\nbib.ajouter("Algorithmes", "Knuth")\nbib.ajouter("Clean Code", "Martin")\n\nprint(bib)\nprint(f"\\nNombre de livres : {len(bib)}")\nprint(f"A \'Algorithmes\' : {\'Algorithmes\' in bib}")\nprint(f"A \'Java\' : {\'Java\' in bib}")',
        exercise: {
          instruction: "Crée une classe Classe avec __len__ qui retourne le nombre d'élèves.\nCrée une classe avec 3 élèves et affiche len(ma_classe).",
          starterCode: "class Classe:\n    def __init__(self):\n        self.eleves = []\n    \n    def ajouter(self, nom):\n        self.eleves.append(nom)\n    \n    # Implémente __len__\n\nma_classe = Classe()\nma_classe.ajouter('Alice')\nma_classe.ajouter('Bob')\nma_classe.ajouter('Charlie')\nprint(len(ma_classe))",
          expectedOutput: "3",
          hints: [
            "Ajoute def __len__(self): dans la classe.",
            "Retourne le nombre d'éléments dans self.eleves avec len().",
            "def __len__(self):\n    return len(self.eleves)",
          ],
        },
      },
      {
        title: "Mini-projet : Système de réservation",
        description: "On combine les dataclasses, l'héritage et les méthodes spéciales pour créer un vrai système de réservation !\nLa propriété @property calcule une valeur dynamiquement sans mémoriser.\nOn utilise des type hints (list[Billet]) pour rendre le code lisible.\nC'est la façon dont fonctionnent les sites de billetterie !",
        code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Billet:\n    spectateur: str\n    places: int\n    \n    def __str__(self):\n        s = "s" if self.places > 1 else ""\n        return f"{self.spectateur} ({self.places} place{s})"\n\nclass Salle:\n    def __init__(self, nom, capacite):\n        self.nom = nom\n        self.capacite = capacite\n        self.billets: list = []\n    \n    @property\n    def places_prises(self):\n        return sum(b.places for b in self.billets)\n    \n    @property\n    def places_libres(self):\n        return self.capacite - self.places_prises\n    \n    def reserver(self, spectateur, places):\n        if places > self.places_libres:\n            print(f"❌ Plus assez de places ! ({self.places_libres} restantes)")\n            return\n        self.billets.append(Billet(spectateur, places))\n        print(f"✅ Réservé pour {spectateur} : {places} place(s)")\n    \n    def bilan(self):\n        print(f"\\n🎥 {self.nom} — {self.places_libres}/{self.capacite} places libres")\n        for b in self.billets:\n            print(f"  • {b}")\n\nsalle = Salle("Grand Rex", 20)\nsalle.reserver("Alice", 2)\nsalle.reserver("Classe 6B", 15)\nsalle.reserver("Bob", 5)\nsalle.reserver("Bob", 3)\nsalle.bilan()',
      },
    ],
  },
  "7": {
    id: 7,
    emoji: "🔬",
    name: "Chercheur",
    color: "from-teal-500 to-cyan-600",
    lessons: [
      {
        title: "Le module statistics",
        description: "Python a un module statistics qui calcule tout ce dont tu as besoin pour analyser des données !\nmean() = la moyenne (somme / nombre)\nmedian() = la valeur du milieu (insensible aux extrêmes)\nstdev() = l'écart-type (mesure la dispersion)\nmode() = la valeur la plus fréquente\nCes outils sont utilisés par les data scientists chaque jour !",
        code: 'import statistics\n\ntemperatures = [15.2, 18.5, 22.1, 19.8, 16.4, 20.3, 23.7, 17.9, 21.2, 18.8,\n                14.5, 19.1, 22.8, 20.5, 17.3]\n\nprint("🌡️ ANALYSE DES TEMPÉRATURES")\nprint("=" * 35)\nprint(f"Nombre de mesures : {len(temperatures)}")\nprint(f"T° min           : {min(temperatures):.1f}°C")\nprint(f"T° max           : {max(temperatures):.1f}°C")\nprint(f"Moyenne          : {statistics.mean(temperatures):.2f}°C")\nprint(f"Médiane          : {statistics.median(temperatures):.1f}°C")\nprint(f"Écart-type       : {statistics.stdev(temperatures):.2f}°C")\n\ntranches = [0, 0, 0, 0]\nfor t in temperatures:\n    if t < 16:   tranches[0] += 1\n    elif t < 18: tranches[1] += 1\n    elif t < 21: tranches[2] += 1\n    else:        tranches[3] += 1\n\nlabels = ["<16°", "16-18°", "18-21°", ">21°"]\nprint("\\nDistribution :")\nfor label, count in zip(labels, tranches):\n    bar = "█" * count\n    print(f"  {label:7} {bar} ({count})")',
        exercise: {
          instruction: "Utilise statistics pour calculer la moyenne et la médiane de [10, 20, 30, 40, 50].\nAffiche la moyenne sur une ligne, la médiane sur la suivante.",
          starterCode: "import statistics\nnombres = [10, 20, 30, 40, 50]\n# Affiche la moyenne puis la médiane\n",
          expectedOutput: "30.0\n30",
          hints: [
            "statistics.mean(liste) calcule la moyenne.",
            "statistics.median(liste) calcule la médiane.",
            "print(statistics.mean(nombres))\nprint(statistics.median(nombres))",
          ],
        },
        quiz: {
          questions: [
            {
              question: "Quelle est la différence entre moyenne et médiane ?",
              options: [
                "Il n'y a aucune différence",
                "La médiane est toujours plus grande",
                "La moyenne est influencée par les extrêmes, la médiane non",
                "La moyenne est toujours entière",
              ],
              correct: 2,
              explanation: "La médiane est la valeur centrale — elle n'est pas affectée par les valeurs extrêmes.",
            },
            {
              question: "Que mesure l'écart-type ?",
              options: ["La valeur maximale", "La valeur centrale", "La dispersion des données autour de la moyenne", "Le nombre de données"],
              correct: 2,
              explanation: "Un écart-type faible = données proches de la moyenne. Un grand écart-type = données très dispersées.",
            },
          ],
        },
      },
      {
        title: "Le module itertools",
        description: "itertools est une boîte à outils pour travailler avec des itérables de façon élégante et efficace !\ncombinations() : toutes les combinaisons possibles\npermutations() : toutes les permutations\nchain() : fusionner plusieurs listes\ncycle() : répéter indéfiniment\naccumulate() : valeurs cumulées\nCes outils sont au cœur de l'algorithmique Python !",
        code: 'import itertools\n\n# combinations : toutes les paires d\'une équipe\nequipe = ["Alice", "Bob", "Charlie", "Diana"]\nduos = list(itertools.combinations(equipe, 2))\nprint(f"Duos possibles ({len(duos)}) :")\nfor a, b in duos:\n    print(f"  {a} & {b}")\n\n# chain : fusionner plusieurs listes\nlistes = [[1, 2, 3], ["a", "b", "c"]]\nfusion = list(itertools.chain(*listes))\nprint(f"\\nFusionnés : {fusion}")\n\n# accumulate : sommes cumulées\nfrom itertools import accumulate\nscores = [10, 15, 8, 20, 5]\ncumul = list(accumulate(scores))\nprint(f"\\nScores : {scores}")\nprint(f"Cumul  : {cumul}")',
        exercise: {
          instruction: "Utilise itertools.combinations sur ['A', 'B', 'C'] avec r=2.\nAffiche la liste des combinaisons.",
          starterCode: "import itertools\nlettres = ['A', 'B', 'C']\n# Affiche toutes les combinaisons de 2\n",
          expectedOutput: "[('A', 'B'), ('A', 'C'), ('B', 'C')]",
          hints: [
            "itertools.combinations(iterable, r) retourne un itérateur de combinaisons.",
            "Utilise list() pour convertir le résultat en liste affichable.",
            "print(list(itertools.combinations(lettres, 2)))",
          ],
        },
      },
      {
        title: "Le module functools",
        description: "functools offre des outils pour travailler avec les fonctions de façon avancée !\nreduce() : réduire une liste à une seule valeur\npartial() : fixer certains arguments d'une fonction pour en créer une nouvelle\nlru_cache() : mémoriser les résultats d'une fonction (memoïsation)\nCes outils rendent le code plus expressif et souvent bien plus rapide !",
        code: 'from functools import reduce, partial, lru_cache\n\n# reduce : calculer en parcourant une liste\nnombres = [1, 2, 3, 4, 5]\nproduit = reduce(lambda a, b: a * b, nombres)\nprint(f"Produit de {nombres} = {produit}")\n\n# partial : spécialiser une fonction\ndef multiplier(a, b):\n    return a * b\n\ndoubler = partial(multiplier, 2)\ntripler = partial(multiplier, 3)\n\nprint(f"\\nDoubler : {[doubler(i) for i in range(1, 6)]}")\nprint(f"Tripler : {[tripler(i) for i in range(1, 6)]}")\n\n# lru_cache : mémoïsation — chaque résultat est mis en cache\n@lru_cache(maxsize=128)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\nprint(f"\\nfib(35) = {fib(35)}")\ninfos = fib.cache_info()\nprint(f"Cache : {infos.hits} hits, {infos.misses} misses")',
        exercise: {
          instruction: "Utilise partial pour créer fois_cinq à partir d'une fonction multiplier(a, b).\nAffiche list(map(fois_cinq, [1, 2, 3])).",
          starterCode: "from functools import partial\n\ndef multiplier(a, b):\n    return a * b\n\n# Crée fois_cinq avec partial\n\nprint(list(map(fois_cinq, [1, 2, 3])))",
          expectedOutput: "[5, 10, 15]",
          hints: [
            "partial(fonction, valeur_fixée) crée une nouvelle fonction avec un argument déjà rempli.",
            "partial(multiplier, 5) fixe a=5, il ne reste qu'à fournir b.",
            "fois_cinq = partial(multiplier, 5)",
          ],
        },
      },
      {
        title: "Traitement de données (CSV)",
        description: "Le format CSV (valeurs séparées par des virgules) est universel pour les données structurées !\nPython lit les CSV avec csv.DictReader qui retourne des dictionnaires.\nio.StringIO permet de traiter une chaîne comme si c'était un fichier.\nEn combinant CSV + defaultdict, tu peux faire de l'analyse de données comme un vrai data analyst !",
        code: 'import csv, io\nfrom collections import defaultdict\n\ndonnees = """nom,matiere,note\nAlice,Maths,16\nBob,Maths,12\nAlice,Science,14\nCharlie,Maths,18\nBob,Science,15\nCharlie,Science,11\nAlice,Histoire,17\nBob,Histoire,13\nCharlie,Histoire,16\n"""\n\nlecteur = csv.DictReader(io.StringIO(donnees))\nlignes = list(lecteur)\n\nnotes_eleve = defaultdict(list)\nfor ligne in lignes:\n    notes_eleve[ligne["nom"]].append(int(ligne["note"]))\n\nprint("📊 MOYENNES PAR ÉLÈVE")\nprint("-" * 22)\nfor nom in sorted(notes_eleve):\n    notes = notes_eleve[nom]\n    moy = sum(notes) / len(notes)\n    print(f"  {nom:<10} : {moy:.1f}/20")\n\nmeilleures = defaultdict(lambda: ("", 0))\nfor ligne in lignes:\n    nom, mat, note = ligne["nom"], ligne["matiere"], int(ligne["note"])\n    if note > meilleures[mat][1]:\n        meilleures[mat] = (nom, note)\n\nprint("\\n🏆 MEILLEURE NOTE PAR MATIÈRE")\nprint("-" * 28)\nfor mat, (nom, note) in sorted(meilleures.items()):\n    print(f"  {mat:<12}: {nom} ({note}/20)")',
        exercise: {
          instruction: "Lis les données CSV et affiche le nom de l'élève avec le score le plus élevé.",
          starterCode: "import csv, io\n\ndonnees = \"\"\"nom,score\nAlice,85\nBob,72\nCharlie,91\nDiana,78\n\"\"\"\n\nlecteur = csv.DictReader(io.StringIO(donnees))\neleves = list(lecteur)\n# Trouve et affiche le nom de l'élève avec le meilleur score\n",
          expectedOutput: "Charlie",
          hints: [
            "Utilise max() avec une key= pour trouver l'élève avec le score max.",
            "Les scores sont des chaînes — utilise int() pour les comparer numériquement.",
            "meilleur = max(eleves, key=lambda e: int(e['score']))\nprint(meilleur['nom'])",
          ],
        },
      },
      {
        title: "Algorithmes de recherche",
        description: "Deux façons de chercher un élément dans une liste :\nRecherche linéaire : on parcourt tout depuis le début — O(n)\nRecherche binaire : on coupe en deux à chaque fois — O(log n)\nSur 1 000 000 d'éléments, la recherche binaire prend ~20 comparaisons là où la linéaire en fait 500 000 en moyenne !\nMais la recherche binaire nécessite une liste triée.",
        code: 'def recherche_lineaire(liste, cible):\n    for i, val in enumerate(liste):\n        if val == cible:\n            return i, i + 1\n    return -1, len(liste)\n\ndef recherche_binaire(liste, cible):\n    g, d, etapes = 0, len(liste) - 1, 0\n    while g <= d:\n        etapes += 1\n        m = (g + d) // 2\n        if liste[m] == cible:\n            return m, etapes\n        elif liste[m] < cible:\n            g = m + 1\n        else:\n            d = m - 1\n    return -1, etapes\n\nnombres = list(range(0, 100, 2))  # 50 nombres pairs : 0, 2, 4, ..., 98\ncible = 76\n\nidx_lin, comp_lin = recherche_lineaire(nombres, cible)\nidx_bin, comp_bin = recherche_binaire(nombres, cible)\n\nprint(f"Recherche de {cible} dans {len(nombres)} éléments")\nprint(f"Linéaire : {comp_lin} comparaisons → index {idx_lin}")\nprint(f"Binaire  : {comp_bin} comparaisons → index {idx_bin}")\nprint(f"Gain : {comp_lin // comp_bin}× plus rapide")',
        exercise: {
          instruction: "Implémente la recherche binaire sur [10, 20, 30, 40, 50] pour trouver 30.\nAffiche son index.",
          starterCode: "def recherche_binaire(liste, cible):\n    g, d = 0, len(liste) - 1\n    while g <= d:\n        m = (g + d) // 2\n        if liste[m] == cible:\n            return m\n        elif liste[m] < cible:\n            g = m + 1\n        else:\n            d = m - 1\n    return -1\n\nnombres = [10, 20, 30, 40, 50]\nprint(recherche_binaire(nombres, 30))",
          expectedOutput: "2",
          hints: [
            "La recherche binaire compare la valeur du milieu (m = (g+d)//2) avec la cible.",
            "Si liste[m] < cible, cherche à droite : g = m + 1. Sinon cherche à gauche : d = m - 1.",
            "Le code est déjà là — exécute-le pour voir le résultat !",
          ],
        },
      },
      {
        title: "Mini-projet : Analyseur de données scientifiques",
        description: "On combine statistics, itertools et CSV pour créer un vrai analyseur de données !\nOn analyse deux groupes expérimentaux, on compare leurs statistiques, et on produit un rapport.\nLe coefficient de variation (CV = écart-type / moyenne × 100) mesure la stabilité relative.\nC'est ce que font les scientifiques pour comparer des expériences !",
        code: 'import statistics\nfrom itertools import groupby\n\nexperiences = [\n    ("Groupe A", [14.2, 15.1, 13.8, 15.5, 14.7, 15.0, 14.3, 15.2, 14.9, 15.1]),\n    ("Groupe B", [12.1, 18.5, 13.2, 17.8, 14.5, 16.2, 13.8, 17.1, 14.1, 16.9]),\n]\n\ndef analyser(nom, donnees):\n    moy = statistics.mean(donnees)\n    med = statistics.median(donnees)\n    std = statistics.stdev(donnees)\n    cv  = std / moy * 100\n    stable = "✅ stable" if cv < 5 else "⚠️ variable"\n    print(f"📊 {nom} ({len(donnees)} mesures)")\n    print(f"   Plage       : {min(donnees):.1f} – {max(donnees):.1f}")\n    print(f"   Moyenne     : {moy:.2f} | Médiane : {med:.2f}")\n    print(f"   Écart-type  : {std:.3f} | CV : {cv:.1f}% — {stable}")\n\nfor nom, donnees in experiences:\n    analyser(nom, donnees)\n    print()\n\nnoms = [nom for nom, _ in experiences]\nstds = [statistics.stdev(d) for _, d in experiences]\nmeilleur = noms[stds.index(min(stds))]\nprint(f"🔬 {meilleur} est le groupe le plus stable")',
      },
    ],
  },
  "8": {
    id: 8,
    emoji: "🛠️",
    name: "Ingénieur",
    color: "from-orange-500 to-amber-500",
    lessons: [
      {
        title: "Tests unitaires",
        description: "Un bon développeur teste son code avant de le livrer !\nOn écrit des fonctions de test qui vérifient le comportement attendu.\nunittest.TestCase fournit des méthodes : assertEqual, assertTrue, assertRaises...\nSi un test échoue, Python te dit exactement où le bug se trouve.",
        code: 'import unittest\n\ndef diviser(a, b):\n    if b == 0:\n        raise ZeroDivisionError("Division par zéro !")\n    return a / b\n\ndef est_palindrome(mot):\n    m = mot.lower()\n    return m == m[::-1]\n\nclass TestFonctions(unittest.TestCase):\n    \n    def test_diviser_normal(self):\n        self.assertAlmostEqual(diviser(10, 4), 2.5)\n    \n    def test_diviser_zero(self):\n        with self.assertRaises(ZeroDivisionError):\n            diviser(5, 0)\n    \n    def test_palindrome_vrai(self):\n        self.assertTrue(est_palindrome("radar"))\n        self.assertTrue(est_palindrome("KAYAK"))\n    \n    def test_palindrome_faux(self):\n        self.assertFalse(est_palindrome("python"))\n\nsuite = unittest.TestLoader().loadTestsFromTestCase(TestFonctions)\nresultat = unittest.TextTestRunner(verbosity=0, stream=__import__("io").StringIO()).run(suite)\nprint(f"Tests exécutés : {resultat.testsRun}")\nprint(f"Succès : {resultat.testsRun - len(resultat.failures) - len(resultat.errors)}")\nif resultat.wasSuccessful():\n    print("✅ Tous les tests passent !")\nelse:\n    print("❌ Des tests ont échoué !")',
        exercise: {
          instruction: "Écris une fonction carre(n) qui retourne n².\nTestez-la avec des assertEqual :\ncarre(3) == 9, carre(0) == 0, carre(-2) == 4.\nAffiche '✅ Tests réussis' si tout est bon.",
          starterCode: "def carre(n):\n    # Retourne n au carré\n    pass\n\n# Teste carre() ici\nassert carre(3) == 9\nassert carre(0) == 0\nassert carre(-2) == 4\nprint('✅ Tests réussis')\n",
          expectedOutput: "✅ Tests réussis",
          hints: [
            "La fonction doit retourner n multiplié par lui-même.",
            "return n * n ou return n**2 fonctionnent tous les deux.",
            "def carre(n):\n    return n ** 2",
          ],
        },
        quiz: {
          questions: [
            {
              question: "À quoi sert assertEqual(a, b) dans un test ?",
              options: ["Affiche a et b", "Vérifie que a == b et échoue sinon", "Assigne b à a", "Affiche True ou False"],
              correct: 1,
              explanation: "assertEqual(a, b) vérifie l'égalité. Si a != b, le test échoue avec un message d'erreur clair.",
            },
            {
              question: "Comment tester qu'une fonction lève une exception ?",
              options: ["try/except dans le test", "self.assertRaises(TypeError):", "with self.assertRaises(TypeError):", "assertEqual(error, True)"],
              correct: 2,
              explanation: "with self.assertRaises(MonErreur): est le moyen idiomatique de tester qu'une exception est bien levée.",
            },
          ],
        },
      },
      {
        title: "Fichiers et texte avec io",
        description: "Python lit et écrit des fichiers avec open().\nEn vrai : open('fichier.txt', 'r') pour lire, 'w' pour écrire, 'a' pour ajouter.\nDans le navigateur, on utilise io.StringIO : un fichier en mémoire.\nio.StringIO() se comporte exactement comme un vrai fichier texte !\nToujours utiliser with open(...) pour fermer le fichier automatiquement.",
        code: 'import io\n\n# io.StringIO = fichier en mémoire (même API qu\'un vrai fichier)\nfichier = io.StringIO()\nfichier.write("Alice 85\\n")\nfichier.write("Bob 72\\n")\nfichier.write("Charlie 91\\n")\nfichier.write("Diana 68\\n")\n\n# Revenir au début pour lire\nfichier.seek(0)\n\nresultats = []\nfor ligne in fichier:\n    nom, score = ligne.strip().split()\n    resultats.append((nom, int(score)))\n\n# Trier par score décroissant\nresultats.sort(key=lambda x: x[1], reverse=True)\n\nprint("🏆 CLASSEMENT")\nprint("-" * 20)\nfor rang, (nom, score) in enumerate(resultats, 1):\n    emoji = ["🥇", "🥈", "🥉"][rang-1] if rang <= 3 else f"{rang}."\n    print(f"  {emoji} {nom:<10} {score}/100")\n\nmoyenne = sum(s for _, s in resultats) / len(resultats)\nprint(f"\\nMoyenne de classe : {moyenne:.1f}")',
        exercise: {
          instruction: "Utilise io.StringIO pour créer un texte avec 5 lignes numérotées (Ligne 1, Ligne 2, ..., Ligne 5).\nLis-le et affiche uniquement les lignes dont le numéro est impair.",
          starterCode: "import io\n\nbuf = io.StringIO()\n# Écris 5 lignes : 'Ligne 1', 'Ligne 2', ..., 'Ligne 5'\n\nbuf.seek(0)\n# Affiche uniquement les lignes impaires\n",
          expectedOutput: "Ligne 1\nLigne 3\nLigne 5",
          hints: [
            "Écris les lignes avec buf.write(f'Ligne {i}\\n') dans une boucle.",
            "Pour lire, parcours buf avec for ligne in buf: et utilise strip().",
            "for i in range(1, 6):\n    buf.write(f'Ligne {i}\\n')\nbuf.seek(0)\nfor ligne in buf:\n    n = int(ligne.strip().split()[1])\n    if n % 2 == 1:\n        print(ligne.strip())",
          ],
        },
      },
      {
        title: "Exceptions personnalisées",
        description: "Tu peux créer tes propres exceptions en héritant de Exception !\nCela rend le code beaucoup plus lisible : ValueError vs ErreurAge, ça n'a pas le même sens.\nUne hiérarchie d'exceptions permet de les attraper avec précision.\nLes vraies applis (Django, SQLAlchemy, requests) ont toutes leurs propres exceptions.",
        code: 'class ErreurValidation(Exception):\n    """Erreur de base pour les validations."""\n    pass\n\nclass ErreurAge(ErreurValidation):\n    def __init__(self, age, mini=0, maxi=120):\n        self.age = age\n        super().__init__(f"Âge invalide : {age} (attendu entre {mini} et {maxi})")\n\nclass ErreurNom(ErreurValidation):\n    def __init__(self, nom):\n        super().__init__(f"Nom invalide : \'{nom}\' (min 2 caractères, lettres uniquement)")\n\ndef creer_compte(nom, age):\n    if len(nom) < 2 or not nom.isalpha():\n        raise ErreurNom(nom)\n    if not 0 <= age <= 120:\n        raise ErreurAge(age)\n    return f"✅ Compte créé : {nom}, {age} ans"\n\ntests = [\n    ("Alice", 25),\n    ("X", 30),\n    ("Bob", -5),\n    ("Charlie", 200),\n    ("Emma", 17),\n]\n\nfor nom, age in tests:\n    try:\n        print(creer_compte(nom, age))\n    except ErreurNom as e:\n        print(f"❌ Nom : {e}")\n    except ErreurAge as e:\n        print(f"❌ Âge : {e}")',
        exercise: {
          instruction: "Crée une exception ErreurNote qui hérite de Exception.\nSi la note est < 0 ou > 20, lève ErreurNote avec le message 'Note invalide: X'.\nAffiche 'OK' pour 15, et le message d'erreur pour 25.",
          starterCode: "class ErreurNote(Exception):\n    pass\n\ndef valider_note(n):\n    if n < 0 or n > 20:\n        raise ErreurNote(f'Note invalide: {n}')\n    return 'OK'\n\ntry:\n    print(valider_note(15))\nexcept ErreurNote as e:\n    print(e)\n\ntry:\n    print(valider_note(25))\nexcept ErreurNote as e:\n    print(e)\n",
          expectedOutput: "OK\nNote invalide: 25",
          hints: [
            "La classe ErreurNote est déjà définie — tu n'as qu'à compléter valider_note.",
            "Vérifie si n < 0 ou n > 20, et lève l'exception avec raise ErreurNote(...).",
            "def valider_note(n):\n    if n < 0 or n > 20:\n        raise ErreurNote(f'Note invalide: {n}')\n    return 'OK'",
          ],
        },
      },
      {
        title: "Type hints et annotations",
        description: "Les type hints annotent les types des variables et paramètres — elles ne changent pas l'exécution mais documentent le code.\ntyping.Optional[X] = X ou None\ntyping.List[X], typing.Dict[K,V] — ou list[X], dict[K,V] depuis Python 3.9\nCallable[[int], str] = une fonction qui prend un int et retourne un str\nLes outils comme mypy utilisent ces annotations pour détecter des bugs avant l'exécution !",
        code: 'from typing import Optional, Callable\n\ndef chercher(liste: list[int], cible: int) -> Optional[int]:\n    """Retourne l\'index ou None si absent."""\n    try:\n        return liste.index(cible)\n    except ValueError:\n        return None\n\ndef transformer(valeurs: list[int], fn: Callable[[int], int]) -> list[int]:\n    """Applique fn à chaque élément."""\n    return [fn(v) for v in valeurs]\n\ndef resumer(donnees: dict[str, list[float]]) -> dict[str, float]:\n    """Calcule la moyenne de chaque groupe."""\n    return {cle: sum(vals) / len(vals) for cle, vals in donnees.items()}\n\n# Utilisation\nnombres = [10, 20, 30, 40, 50]\nprint(f"Index de 30 : {chercher(nombres, 30)}")\nprint(f"Index de 99 : {chercher(nombres, 99)}")\n\ncubes = transformer(range(1, 6), lambda x: x ** 3)\nprint(f"Cubes : {cubes}")\n\ngroupes = {\n    "A": [14.5, 16.0, 15.5, 13.0],\n    "B": [18.0, 17.5, 19.0, 18.5],\n}\nmoyennes = resumer(groupes)\nfor grp, moy in moyennes.items():\n    print(f"Groupe {grp} : {moy:.2f}/20")',
        exercise: {
          instruction: "Écris une fonction annotée filtre(liste: list[int], mini: int, maxi: int) -> list[int]\nqui retourne les éléments entre mini et maxi inclus.\nAffiche filtre([1,5,3,8,2,9,4], 3, 7).",
          starterCode: "from typing import Optional\n\ndef filtre(liste: list[int], mini: int, maxi: int) -> list[int]:\n    # Retourne les éléments entre mini et maxi inclus\n    pass\n\nprint(filtre([1, 5, 3, 8, 2, 9, 4], 3, 7))\n",
          expectedOutput: "[5, 3, 4]",
          hints: [
            "Utilise une compréhension de liste avec une condition.",
            "Filtre les éléments où mini <= x <= maxi.",
            "return [x for x in liste if mini <= x <= maxi]",
          ],
        },
      },
      {
        title: "Gestionnaires de contexte",
        description: "with est un gestionnaire de contexte : il exécute du code avant et après un bloc, même si une erreur survient !\nTu as déjà utilisé : with open('fichier') as f:\nTu peux créer les tiens avec @contextmanager et yield.\nC'est parfait pour gérer des ressources : connexions, mesure du temps, transactions.",
        code: 'from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef chronometre(label: str):\n    debut = time.perf_counter()\n    try:\n        yield  # ← Exécute le bloc with\n    finally:\n        duree = time.perf_counter() - debut\n        print(f"⏱️ {label} : {duree*1000:.2f} ms")\n\n@contextmanager\ndef section(titre: str):\n    print(f"\\n┌── {titre}")\n    yield\n    print(f"└── Fin de {titre}")\n\nwith section("Calcul intensif"):\n    with chronometre("Somme 1-1M"):\n        total = sum(range(1_000_000))\n    print(f"│  Résultat : {total:,}")\n\nwith section("Traitement texte"):\n    with chronometre("Mots uniques"):\n        texte = "le chat mange le poisson le chat dort"\n        uniques = set(texte.split())\n    print(f"│  {len(uniques)} mots uniques : {sorted(uniques)}")',
        exercise: {
          instruction: "Écris un gestionnaire de contexte compteur() qui print 'Début' avant le bloc et 'Fin' après.\nUtilise-le avec une instruction with et affiche 'En cours...' dans le bloc.",
          starterCode: "from contextlib import contextmanager\n\n@contextmanager\ndef compteur():\n    print('Début')\n    yield\n    print('Fin')\n\nwith compteur():\n    print('En cours...')\n",
          expectedOutput: "Début\nEn cours...\nFin",
          hints: [
            "Le code avant yield s'exécute en entrant dans le with, le code après en sortant.",
            "Le gestionnaire est déjà quasi-complet — exécute-le !",
            "Le code fourni est la solution. Clique ▶ pour voir le résultat.",
          ],
        },
      },
      {
        title: "Mini-projet : Carnet de notes",
        description: "On assemble tout ce qu'on a appris dans ce niveau : exceptions personnalisées, type hints, gestionnaires de contexte et io.\nLe CarnetNotes valide les entrées, gère les erreurs proprement et exporte un rapport.\nC'est exactement le style de code qu'on écrit en entreprise !",
        code: 'from contextlib import contextmanager\nfrom dataclasses import dataclass, field\nimport io\n\nclass ErreurNote(Exception): pass\nclass ErreurEleve(Exception): pass\n\n@dataclass\nclass Eleve:\n    nom: str\n    notes: list = field(default_factory=list)\n    \n    @property\n    def moyenne(self):\n        return sum(self.notes) / len(self.notes) if self.notes else 0.0\n    \n    @property\n    def mention(self):\n        m = self.moyenne\n        if m >= 16: return "Tres bien"\n        if m >= 14: return "Bien"\n        if m >= 12: return "Assez bien"\n        if m >= 10: return "Passable"\n        return "Insuffisant"\n\nclass CarnetNotes:\n    def __init__(self):\n        self.eleves = {}\n    \n    def ajouter_eleve(self, nom):\n        if len(nom) < 2:\n            raise ErreurEleve("Nom trop court")\n        self.eleves[nom] = Eleve(nom)\n    \n    def ajouter_note(self, nom, note):\n        if nom not in self.eleves:\n            raise ErreurEleve(f"{nom} inconnu")\n        if not 0 <= note <= 20:\n            raise ErreurNote(f"Note invalide : {note}")\n        self.eleves[nom].notes.append(note)\n    \n    @contextmanager\n    def rapport(self, titre):\n        buf = io.StringIO()\n        sep = "=" * 38\n        buf.write(f"{sep}\\n{titre}\\n{sep}\\n")\n        yield buf\n        buf.seek(0)\n        print(buf.read())\n\ncarnet = CarnetNotes()\nfor n in ["Alice", "Bob", "Charlie"]:\n    carnet.ajouter_eleve(n)\n\ndonnees = [\n    ("Alice",   [15, 17, 14, 16]),\n    ("Bob",     [11, 9,  13, 10]),\n    ("Charlie", [18, 19, 17, 20]),\n]\nfor nom, notes in donnees:\n    for note in notes:\n        carnet.ajouter_note(nom, note)\n\nwith carnet.rapport("Bulletin de fin de semestre") as buf:\n    for eleve in sorted(carnet.eleves.values(), key=lambda e: e.moyenne, reverse=True):\n        buf.write(f"{eleve.nom:<12} {eleve.moyenne:.2f}/20  ->  {eleve.mention}\\n")',
      },
    ],
  },
  "9": {
    id: 9,
    emoji: "🌟",
    name: "Pionnier",
    color: "from-rose-500 to-pink-600",
    lessons: [
      {
        title: "Design Pattern : Factory",
        description: "Le pattern Factory délègue la création d'objets à une fonction ou classe spéciale.\nAu lieu de 'new Truc()' partout, tu appelles 'factory.creer(\"truc\")'.\nAvantage : le code qui utilise les objets n'a pas besoin de savoir comment ils sont construits.\nC'est utilisé partout : ORM Django, parsers, plugins, UI frameworks.",
        code: 'from abc import ABC, abstractmethod\n\nclass Forme(ABC):\n    @abstractmethod\n    def aire(self) -> float: ...\n    @abstractmethod\n    def description(self) -> str: ...\n\nclass Cercle(Forme):\n    def __init__(self, rayon: float):\n        self.rayon = rayon\n    def aire(self) -> float:\n        return 3.14159 * self.rayon ** 2\n    def description(self) -> str:\n        return f"Cercle (r={self.rayon}) — aire={self.aire():.2f}"\n\nclass Rectangle(Forme):\n    def __init__(self, largeur: float, hauteur: float):\n        self.largeur, self.hauteur = largeur, hauteur\n    def aire(self) -> float:\n        return self.largeur * self.hauteur\n    def description(self) -> str:\n        return f"Rectangle ({self.largeur}×{self.hauteur}) — aire={self.aire():.2f}"\n\nclass Triangle(Forme):\n    def __init__(self, base: float, hauteur: float):\n        self.base, self.hauteur = base, hauteur\n    def aire(self) -> float:\n        return 0.5 * self.base * self.hauteur\n    def description(self) -> str:\n        return f"Triangle (b={self.base}, h={self.hauteur}) — aire={self.aire():.2f}"\n\nclass FormeFactory:\n    _types = {\n        "cercle":    lambda **kw: Cercle(kw["rayon"]),\n        "rectangle": lambda **kw: Rectangle(kw["largeur"], kw["hauteur"]),\n        "triangle":  lambda **kw: Triangle(kw["base"], kw["hauteur"]),\n    }\n    \n    @classmethod\n    def creer(cls, type_forme: str, **kwargs) -> Forme:\n        if type_forme not in cls._types:\n            raise ValueError(f"Forme inconnue : {type_forme}")\n        return cls._types[type_forme](**kwargs)\n\nformes = [\n    FormeFactory.creer("cercle",    rayon=5),\n    FormeFactory.creer("rectangle", largeur=4, hauteur=6),\n    FormeFactory.creer("triangle",  base=3,    hauteur=8),\n]\n\nfor f in formes:\n    print(f.description())\n\ntotal = sum(f.aire() for f in formes)\nprint(f"\\nAire totale : {total:.2f}")',
        exercise: {
          instruction: "Crée une AnimalFactory avec 'chat' → print 'Miaou !' et 'chien' → print 'Ouaf !'.\nAppelle factory.creer('chat').parler() et factory.creer('chien').parler().",
          starterCode: "class Animal:\n    def parler(self): pass\n\nclass Chat(Animal):\n    def parler(self):\n        print('Miaou !')\n\nclass Chien(Animal):\n    def parler(self):\n        print('Ouaf !')\n\nclass AnimalFactory:\n    _types = {'chat': Chat, 'chien': Chien}\n    \n    @classmethod\n    def creer(cls, type_animal: str) -> Animal:\n        # Retourne une instance du bon type\n        pass\n\nAnimalFactory.creer('chat').parler()\nAnimalFactory.creer('chien').parler()\n",
          expectedOutput: "Miaou !\nOuaf !",
          hints: [
            "La factory doit récupérer la classe dans _types et l'instancier.",
            "Retourne cls._types[type_animal]() pour créer l'instance.",
            "return cls._types[type_animal]()",
          ],
        },
        quiz: {
          questions: [
            {
              question: "Quel est l'avantage principal du pattern Factory ?",
              options: [
                "Le code est plus court",
                "La création d'objets est centralisée et le code appelant ne dépend pas des classes concrètes",
                "Les objets sont plus rapides",
                "Il n'y a plus besoin d'héritage",
              ],
              correct: 1,
              explanation: "La Factory découple la création de l'utilisation. Tu peux changer les classes concrètes sans toucher au code qui les utilise.",
            },
          ],
        },
      },
      {
        title: "Design Pattern : Observer",
        description: "Le pattern Observer permet à des objets de s'abonner à des événements d'un autre objet.\nL'objet observé (sujet) notifie tous ses abonnés quand son état change.\nC'est le fondement des interfaces graphiques, des frameworks réactifs (React, Vue), des jeux...\nExemple : un bouton (sujet) notifie les listeners quand on clique dessus.",
        code: 'from typing import Callable\n\nclass Evenement:\n    """Système d\'événements simple : on s\'abonne avec += et on lève avec ()."""\n    \n    def __init__(self):\n        self._handlers: list[Callable] = []\n    \n    def __iadd__(self, handler: Callable):\n        self._handlers.append(handler)\n        return self\n    \n    def __isub__(self, handler: Callable):\n        self._handlers.remove(handler)\n        return self\n    \n    def __call__(self, *args, **kwargs):\n        for h in self._handlers:\n            h(*args, **kwargs)\n\nclass CompteBancaire:\n    def __init__(self, proprietaire: str, solde: float = 0):\n        self.proprietaire = proprietaire\n        self._solde = solde\n        self.on_depot    = Evenement()\n        self.on_retrait  = Evenement()\n        self.on_alerte   = Evenement()\n    \n    def deposer(self, montant: float):\n        self._solde += montant\n        self.on_depot(montant, self._solde)\n        if self._solde > 1000:\n            self.on_alerte(f"Solde élevé : {self._solde:.2f}€")\n    \n    def retirer(self, montant: float):\n        if montant > self._solde:\n            self.on_alerte(f"Solde insuffisant : {self._solde:.2f}€ < {montant:.2f}€")\n            return\n        self._solde -= montant\n        self.on_retrait(montant, self._solde)\n\ncompte = CompteBancaire("Alice", 500)\n\ncompte.on_depot   += lambda m, s: print(f"📥 Dépôt +{m}€ → Solde : {s:.2f}€")\ncompte.on_retrait += lambda m, s: print(f"📤 Retrait -{m}€ → Solde : {s:.2f}€")\ncompte.on_alerte  += lambda msg: print(f"⚠️  {msg}")\n\ncompte.deposer(600)\ncompte.retirer(200)\ncompte.retirer(1000)\ncompte.deposer(50)',
        exercise: {
          instruction: "Crée un Minuteur avec un événement on_tique.\nChaque fois que tick() est appelé, il lève on_tique(n) où n est le numéro du tick.\nAppelle tick() 3 fois et abonne-toi pour afficher 'Tick 1', 'Tick 2', 'Tick 3'.",
          starterCode: "class Evenement:\n    def __init__(self):\n        self._handlers = []\n    def __iadd__(self, h):\n        self._handlers.append(h)\n        return self\n    def __call__(self, *a):\n        for h in self._handlers: h(*a)\n\nclass Minuteur:\n    def __init__(self):\n        self.on_tique = Evenement()\n        self._n = 0\n    \n    def tick(self):\n        self._n += 1\n        self.on_tique(self._n)\n\nm = Minuteur()\nm.on_tique += lambda n: print(f'Tick {n}')\nm.tick()\nm.tick()\nm.tick()\n",
          expectedOutput: "Tick 1\nTick 2\nTick 3",
          hints: [
            "Le code est presque complet — tu dois juste appeler self.on_tique(self._n) dans tick().",
            "Incrémenter self._n puis lever l'événement : self.on_tique(self._n).",
            "Le code fourni est la solution. Clique ▶ pour l'exécuter.",
          ],
        },
      },
      {
        title: "Programmation fonctionnelle avancée",
        description: "La programmation fonctionnelle traite les fonctions comme des valeurs comme les autres.\nCompose : f(g(x)) — appliquer plusieurs fonctions en chaîne\nCurrying : transformer f(a, b) en f(a)(b)\nMonad-like : chaîner des opérations sans effets de bord\nPython n'est pas pur FP, mais ses outils fonctionnels (map, filter, functools) sont très puissants.",
        code: 'from functools import reduce, partial\nfrom typing import Callable\n\n# Composition : applique des fonctions de droite à gauche\ndef compose(*fns: Callable) -> Callable:\n    return reduce(lambda f, g: lambda x: f(g(x)), fns)\n\n# Pipeline : applique des fonctions de gauche à droite\ndef pipeline(*fns: Callable) -> Callable:\n    return reduce(lambda f, g: lambda x: g(f(x)), fns)\n\n# Fonctions de transformation de texte\nnettoyer   = str.strip\nmajuscule  = str.upper\najouter_pt = lambda s: s + "."\nremplacer  = lambda s: s.replace(" ", "_")\n\n# Composons-les\nformater = pipeline(nettoyer, majuscule, remplacer, ajouter_pt)\n\nphrase = "  bonjour le monde  "\nprint(formater(phrase))\n\n# Currying avec partial\ndef multiplier(a: int, b: int) -> int:\n    return a * b\n\ndoubler = partial(multiplier, 2)\ntripler = partial(multiplier, 3)\n\nprint(list(map(doubler, range(1, 6))))\nprint(list(map(tripler, range(1, 6))))\n\n# Reduce pour créer un mini-pipeline de données\nnombres = range(1, 11)\nresultat = reduce(\n    lambda acc, fn: fn(acc),\n    [\n        list,\n        lambda lst: filter(lambda x: x % 2 == 0, lst),\n        list,\n        lambda lst: map(lambda x: x ** 2, lst),\n        list,\n    ],\n    nombres\n)\nprint(f"Carrés des pairs 1-10 : {resultat}")',
        exercise: {
          instruction: "Utilise compose pour créer une fonction qui :\n1. Multiplie par 2\n2. Ajoute 10\nApplique-la à [1, 2, 3, 4, 5] avec map et affiche la liste.",
          starterCode: "from functools import reduce\n\ndef compose(*fns):\n    return reduce(lambda f, g: lambda x: f(g(x)), fns)\n\n# Crée les deux fonctions puis compose-les\ntimes2 = lambda x: x * 2\nplus10 = lambda x: x + 10\n\ntraiter = compose(plus10, times2)  # d'abord times2, puis plus10\n\nprint(list(map(traiter, [1, 2, 3, 4, 5])))\n",
          expectedOutput: "[12, 14, 16, 18, 20]",
          hints: [
            "compose(f, g)(x) = f(g(x)) — g s'applique en premier.",
            "compose(plus10, times2) fait d'abord ×2 puis +10.",
            "Le code fourni est la solution — clique ▶ pour vérifier !",
          ],
        },
      },
      {
        title: "Classes abstraites (ABC)",
        description: "Une classe abstraite définit une interface que toutes les classes filles DOIVENT implémenter.\n@abstractmethod rend une méthode obligatoire — impossible d'instancier la classe sans l'implémenter.\nABC (Abstract Base Class) garantit que toutes les implémentations respectent le contrat.\nC'est la base des plugins, des drivers, des stratégies interchangeables.",
        code: 'from abc import ABC, abstractmethod\nfrom typing import Iterator\n\nclass SourceDonnees(ABC):\n    """Interface abstraite pour toute source de données."""\n    \n    @abstractmethod\n    def lire(self) -> Iterator[str]: ...\n    \n    @abstractmethod\n    def compter(self) -> int: ...\n    \n    def afficher_resume(self) -> None:\n        lignes = list(self.lire())\n        print(f"Source : {self.__class__.__name__}")\n        print(f"Lignes : {self.compter()}")\n        print(f"Aperçu : {lignes[:2]}...")\n\nclass SourceTexte(SourceDonnees):\n    def __init__(self, texte: str):\n        self._lignes = texte.strip().split("\\n")\n    \n    def lire(self) -> Iterator[str]:\n        return iter(self._lignes)\n    \n    def compter(self) -> int:\n        return len(self._lignes)\n\nclass SourceRepetition(SourceDonnees):\n    def __init__(self, valeur: str, fois: int):\n        self._valeur = valeur\n        self._fois   = fois\n    \n    def lire(self) -> Iterator[str]:\n        return iter([self._valeur] * self._fois)\n    \n    def compter(self) -> int:\n        return self._fois\n\ndef analyser(source: SourceDonnees) -> None:\n    source.afficher_resume()\n    mots_total = sum(len(l.split()) for l in source.lire())\n    print(f"Mots total : {mots_total}\\n")\n\nsources = [\n    SourceTexte("Python est super\\nJ\'adore coder\\nLes classes abstraites aussi"),\n    SourceRepetition("Bonjour le monde", 4),\n]\n\nfor src in sources:\n    analyser(src)',
        exercise: {
          instruction: "Implémente une classe concrète SourceListe(ABC) qui prend une list[str].\nImplemente lire() et compter().\nAffiche compter() d'une SourceListe(['a', 'b', 'c']).",
          starterCode: "from abc import ABC, abstractmethod\n\nclass SourceDonnees(ABC):\n    @abstractmethod\n    def lire(self): ...\n    @abstractmethod\n    def compter(self) -> int: ...\n\nclass SourceListe(SourceDonnees):\n    def __init__(self, donnees: list):\n        self._donnees = donnees\n    \n    def lire(self):\n        return iter(self._donnees)\n    \n    def compter(self) -> int:\n        return len(self._donnees)\n\nsrc = SourceListe(['a', 'b', 'c'])\nprint(src.compter())\n",
          expectedOutput: "3",
          hints: [
            "SourceListe hérite de SourceDonnees et doit implémenter lire() et compter().",
            "lire() retourne iter(self._donnees), compter() retourne len(self._donnees).",
            "Le code fourni est la solution — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Métaclasses",
        description: "En Python, TOUT est un objet — y compris les classes elles-mêmes !\nUne métaclasse est la classe d'une classe — elle contrôle la création de classes.\ntype est la métaclasse par défaut de toutes les classes Python.\nAvec __new__ dans une métaclasse, tu peux modifier une classe au moment où elle est définie.\nUtilisé par Django (models), SQLAlchemy, attrs, Pydantic, enums...",
        code: '# Métaclasse simple : ajoute automatiquement un attribut de classe\nclass AutoDoc(type):\n    def __new__(mcs, nom, bases, namespace):\n        cls = super().__new__(mcs, nom, bases, namespace)\n        # Ajoute automatiquement une description si absente\n        if not hasattr(cls, "description"):\n            cls.description = f"Classe {nom} sans documentation"\n        # Liste les méthodes publiques\n        cls.methodes_publiques = [\n            k for k in namespace\n            if callable(namespace[k]) and not k.startswith("_")\n        ]\n        return cls\n\nclass Vehicule(metaclass=AutoDoc):\n    description = "Tout ce qui roule"\n    \n    def demarrer(self): return "Vroooom"\n    def arreter(self):  return "Scrreech"\n\nclass Outil(metaclass=AutoDoc):\n    def couper(self): return "Schnik"\n    def percer(self): return "Zzzz"\n\nprint(f"Vehicule : {Vehicule.description}")\nprint(f"Méthodes : {Vehicule.methodes_publiques}")\nprint()\nprint(f"Outil : {Outil.description}")\nprint(f"Méthodes : {Outil.methodes_publiques}")\nprint()\n\n# Singleton avec métaclasse\nclass Singleton(type):\n    _instances: dict = {}\n    def __call__(cls, *args, **kwargs):\n        if cls not in cls._instances:\n            cls._instances[cls] = super().__call__(*args, **kwargs)\n        return cls._instances[cls]\n\nclass Config(metaclass=Singleton):\n    def __init__(self):\n        self.debug = False\n        self.version = "1.0"\n\nc1 = Config()\nc2 = Config()\nprint(f"c1 is c2 : {c1 is c2}")  # True !',
        exercise: {
          instruction: "Crée une métaclasse CompteurClasses qui incrémente une variable nb_classes chaque fois qu'une classe est créée.\nCrée 2 classes avec cette métaclasse et affiche CompteurClasses.nb_classes.",
          starterCode: "class CompteurClasses(type):\n    nb_classes = 0\n    def __new__(mcs, nom, bases, namespace):\n        cls = super().__new__(mcs, nom, bases, namespace)\n        CompteurClasses.nb_classes += 1\n        return cls\n\nclass Foo(metaclass=CompteurClasses): pass\nclass Bar(metaclass=CompteurClasses): pass\n\nprint(CompteurClasses.nb_classes)\n",
          expectedOutput: "2",
          hints: [
            "Dans __new__, incrémente CompteurClasses.nb_classes avant de retourner la classe.",
            "N'oublie pas d'appeler super().__new__(mcs, nom, bases, namespace).",
            "Le code fourni est la solution — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Mini-projet : Framework de règles",
        description: "On combine tout ce qu'on a appris : ABC, Factory, Observer, décorateurs et fonctionnel.\nOn crée un moteur de règles métier — le genre de système utilisé dans les banques, assurances, et jeux.\nChaque règle est une classe abstraite, la factory les instancie, et l'observer notifie les violations.\nC'est du vrai code d'entreprise !",
        code: 'from abc import ABC, abstractmethod\nfrom typing import Callable\nfrom functools import reduce\n\n# ── Règles abstraites ─────────────────────────────────────────────────\nclass Regle(ABC):\n    def __init__(self, message: str):\n        self.message = message\n    \n    @abstractmethod\n    def verifier(self, valeur) -> bool: ...\n    \n    def __call__(self, valeur) -> tuple[bool, str]:\n        ok = self.verifier(valeur)\n        return ok, ("" if ok else self.message)\n\nclass RegleMin(Regle):\n    def __init__(self, mini):\n        super().__init__(f"Valeur trop petite (min={mini})")\n        self.mini = mini\n    def verifier(self, v) -> bool: return v >= self.mini\n\nclass RegleMax(Regle):\n    def __init__(self, maxi):\n        super().__init__(f"Valeur trop grande (max={maxi})")\n        self.maxi = maxi\n    def verifier(self, v) -> bool: return v <= self.maxi\n\nclass ReglePair(Regle):\n    def __init__(self):\n        super().__init__("La valeur doit être paire")\n    def verifier(self, v) -> bool: return v % 2 == 0\n\n# ── Moteur de règles ──────────────────────────────────────────────────\nclass MoteurRegles:\n    def __init__(self):\n        self.regles: list[Regle] = []\n        self._violations: list[Callable] = []\n    \n    def ajouter(self, *regles: Regle):\n        self.regles.extend(regles)\n        return self\n    \n    def on_violation(self, handler: Callable):\n        self._violations.append(handler)\n        return self\n    \n    def valider(self, valeur) -> bool:\n        erreurs = [msg for ok, msg in (r(valeur) for r in self.regles) if not ok]\n        for erreur in erreurs:\n            for h in self._violations: h(valeur, erreur)\n        return len(erreurs) == 0\n\n# ── Utilisation ───────────────────────────────────────────────────────\nmoteur = MoteurRegles()\nmoteur.ajouter(\n    RegleMin(0),\n    RegleMax(100),\n    ReglePair(),\n)\nmoteur.on_violation(lambda v, msg: print(f"  ❌ {v} → {msg}"))\n\nvaleurs = [50, -5, 101, 7, 84, 200]\nprint("Validation des valeurs :")\nfor v in valeurs:\n    ok = moteur.valider(v)\n    if ok:\n        print(f"  ✅ {v} → valide")',
      },
    ],
  },
  "10": {
    id: 10,
    emoji: "⚒️",
    name: "Maître Artisan",
    color: "from-lime-500 to-green-600",
    lessons: [
      {
        title: "Les énumérations (enum)",
        description: "Un enum est un ensemble de constantes nommées — comme un menu fixe de valeurs possibles.\nPlus lisible que des entiers magiques : Couleur.ROUGE plutôt que 1.\nauto() génère les valeurs automatiquement.\nFlag permet de combiner des valeurs avec | (opérateur OU).\nLes enums sont comparables, itérables, et sérialisables en JSON.",
        code: 'from enum import Enum, Flag, auto\n\nclass Direction(Enum):\n    NORD  = auto()\n    SUD   = auto()\n    EST   = auto()\n    OUEST = auto()\n\nclass Permission(Flag):\n    LIRE    = auto()\n    ECRIRE  = auto()\n    EXECUTER = auto()\n    TOUT    = LIRE | ECRIRE | EXECUTER\n\nclass Statut(Enum):\n    ATTENTE   = "attente"\n    EN_COURS  = "en_cours"\n    TERMINE   = "termine"\n    ANNULE    = "annule"\n    \n    def est_actif(self):\n        return self in (Statut.ATTENTE, Statut.EN_COURS)\n\n# Itérer sur un enum\nprint("Directions :", [d.name for d in Direction])\n\n# Comparer\ndir_actuelle = Direction.NORD\nif dir_actuelle == Direction.NORD:\n    print("On va vers le nord !")\n\n# Combiner des flags\ndroits = Permission.LIRE | Permission.ECRIRE\nprint(f"Droits : {droits}")\nprint(f"Peut lire : {Permission.LIRE in droits}")\nprint(f"Peut executer : {Permission.EXECUTER in droits}")\n\n# Enum avec méthode\ncommande = Statut.EN_COURS\nprint(f"Statut actif : {commande.est_actif()}")',
        exercise: {
          instruction: "Crée un enum Saison avec PRINTEMPS=1, ETE=2, AUTOMNE=3, HIVER=4.\nAffiche la valeur de Saison.ETE.",
          starterCode: "from enum import Enum\n\nclass Saison(Enum):\n    PRINTEMPS = 1\n    ETE = 2\n    AUTOMNE = 3\n    HIVER = 4\n\nprint(Saison.ETE.value)\n",
          expectedOutput: "2",
          hints: [
            "Un enum se définit avec class NomEnum(Enum): et des constantes MAJUSCULES.",
            "Pour accéder à la valeur, utilise .value.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
        quiz: {
          questions: [
            {
              question: "Pourquoi utiliser un enum plutôt qu'un entier ?",
              options: [
                "Les enums sont plus rapides",
                "Les enums ont des noms lisibles et évitent les valeurs magiques",
                "Les enums prennent moins de mémoire",
                "Les enums sont obligatoires en Python 3",
              ],
              correct: 1,
              explanation: "Couleur.ROUGE est bien plus lisible que 1. Les enums préviennent les erreurs de valeur invalide.",
            },
            {
              question: "À quoi sert auto() dans un enum ?",
              options: [
                "Génère automatiquement une valeur unique pour chaque membre",
                "Rend l'enum automatiquement sérialisable",
                "Crée un enum avec des méthodes automatiques",
                "Trie les membres alphabétiquement",
              ],
              correct: 0,
              explanation: "auto() assigne automatiquement une valeur entière croissante à chaque membre, évitant de les numéroter manuellement.",
            },
          ],
        },
      },
      {
        title: "SQLite3 : base de données en Python",
        description: "sqlite3 est une base de données SQL intégrée à Python — aucune installation requise !\n':memory:' crée une base entièrement en mémoire (parfait pour les tests).\nLes opérations de base : CREATE TABLE, INSERT, SELECT, UPDATE, DELETE.\nToujours utiliser des paramètres ? pour éviter les injections SQL.\nSQLite3 est utilisé par Firefox, Android, et des milliers d'applications !",
        code: 'import sqlite3\n\n# Connexion en mémoire\nconn = sqlite3.connect(":memory:")\nconn.row_factory = sqlite3.Row  # Accès par nom de colonne\ncur = conn.cursor()\n\n# Créer la table\ncur.execute("""\n    CREATE TABLE eleves (\n        id    INTEGER PRIMARY KEY AUTOINCREMENT,\n        nom   TEXT NOT NULL,\n        note  REAL,\n        classe TEXT\n    )\n""")\n\n# Insérer des données avec des paramètres (anti-injection)\neleves = [\n    ("Alice",   17.5, "3A"),\n    ("Bob",     12.0, "3A"),\n    ("Charlie", 15.5, "3B"),\n    ("Diana",   18.0, "3B"),\n    ("Eve",      9.5, "3A"),\n]\ncur.executemany(\n    "INSERT INTO eleves (nom, note, classe) VALUES (?, ?, ?)",\n    eleves\n)\nconn.commit()\n\n# Requête SELECT\nprint("=== Tous les élèves ===")\nfor row in cur.execute("SELECT nom, note, classe FROM eleves ORDER BY note DESC"):\n    print(f"  {row[\'nom\']:<10} {row[\'note\']:5.1f}/20  ({row[\'classe\']})")\n\n# Agrégation\ncur.execute("SELECT classe, AVG(note) as moy FROM eleves GROUP BY classe")\nprint("\\n=== Moyenne par classe ===")\nfor row in cur.fetchall():\n    print(f"  Classe {row[\'classe\']} : {row[\'moy\']:.2f}/20")\n\n# Recherche avec WHERE\ncur.execute("SELECT COUNT(*) FROM eleves WHERE note >= 15")\ncount = cur.fetchone()[0]\nprint(f"\\nÉlèves >= 15/20 : {count}")\n\nconn.close()',
        exercise: {
          instruction: "Crée une table 'produits' avec nom (TEXT) et prix (REAL).\nInsère pomme=0.50, banane=0.30, cerise=2.00.\nAffiche le nombre de produits dont le prix est inférieur à 1.00.",
          starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE produits (nom TEXT, prix REAL)')\ncur.executemany('INSERT INTO produits VALUES (?, ?)', [\n    ('pomme', 0.50), ('banane', 0.30), ('cerise', 2.00)\n])\nconn.commit()\n\ncur.execute('SELECT COUNT(*) FROM produits WHERE prix < 1.00')\nprint(cur.fetchone()[0])\nconn.close()\n",
          expectedOutput: "2",
          hints: [
            "La table et les données sont déjà insérées — il faut juste compter avec COUNT(*).",
            "SELECT COUNT(*) FROM produits WHERE prix < 1.00 compte les lignes correspondantes.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Logging professionnel",
        description: "print() c'est bien pour déboguer, mais logging c'est mieux pour la production !\nlogging a 5 niveaux : DEBUG < INFO < WARNING < ERROR < CRITICAL.\nTu peux filtrer par niveau, formater les messages, les envoyer dans un fichier ou la console.\nEn production, on met le niveau à WARNING — en développement à DEBUG.\nDjango, Flask, et tous les grands frameworks utilisent logging.",
        code: 'import logging\nimport io\n\n# Configurer un handler vers un buffer (pour tester sans fichier)\nbuffer = io.StringIO()\nhandler = logging.StreamHandler(buffer)\nhandler.setFormatter(logging.Formatter("%(levelname)-8s | %(name)s | %(message)s"))\n\nlogger = logging.getLogger("mon_app")\nlogger.setLevel(logging.DEBUG)\nlogger.addHandler(handler)\nlogger.propagate = False\n\n# Émettre des messages à différents niveaux\nlogger.debug("Démarrage du module")\nlogger.info("Connexion établie avec la base de données")\nlogger.warning("Mémoire disponible faible : 12%")\nlogger.error("Impossible de lire le fichier config.json")\nlogger.critical("Crash critique — arrêt immédiat")\n\n# Lire ce qui a été enregistré\nbuffer.seek(0)\nfor ligne in buffer:\n    print(ligne.rstrip())\n\n# Exemple : logger enfant hérite du parent\nlogger_db = logging.getLogger("mon_app.db")\nlogger_db.addHandler(handler)\nlogger_db.propagate = False\nlogger_db.setLevel(logging.WARNING)\n\nlogger_db.debug("Cette ligne ne sera PAS affichée")  # sous le niveau\nlogger_db.warning("Requête lente détectée : 3.2s")',
        exercise: {
          instruction: "Crée un logger nommé 'test' avec niveau WARNING.\nÉmets un debug, un warning et une error.\nCompte combien de lignes ont été enregistrées (seules WARNING et ERROR passent).\nAffiche ce nombre.",
          starterCode: "import logging, io\n\nbuffer = io.StringIO()\nhandler = logging.StreamHandler(buffer)\nlogger = logging.getLogger('test')\nlogger.setLevel(logging.WARNING)\nlogger.addHandler(handler)\nlogger.propagate = False\n\nlogger.debug('invisible')\nlogger.warning('attention')\nlogger.error('erreur')\n\nbuffer.seek(0)\nlignes = [l for l in buffer if l.strip()]\nprint(len(lignes))\n",
          expectedOutput: "2",
          hints: [
            "Avec setLevel(WARNING), debug() est ignoré. Seuls warning() et error() sont enregistrés.",
            "Le buffer contiendra 2 lignes — compte-les.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Surcharge d'opérateurs",
        description: "En Python tu peux définir ce que font +, -, *, ==, <, len() sur tes propres classes !\nCes méthodes spéciales s'appellent dunder methods (double underscore).\n__add__ : l'opérateur +\n__mul__ : l'opérateur *\n__eq__ : l'opérateur ==\n__lt__ : l'opérateur <\n__len__ : la fonction len()\nC'est ainsi que numpy, pandas et SQLAlchemy fonctionnent !",
        code: 'class Vecteur:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n    \n    def __repr__(self) -> str:\n        return f"Vecteur({self.x}, {self.y})"\n    \n    def __add__(self, other: "Vecteur") -> "Vecteur":\n        return Vecteur(self.x + other.x, self.y + other.y)\n    \n    def __sub__(self, other: "Vecteur") -> "Vecteur":\n        return Vecteur(self.x - other.x, self.y - other.y)\n    \n    def __mul__(self, scalaire: float) -> "Vecteur":\n        return Vecteur(self.x * scalaire, self.y * scalaire)\n    \n    def __rmul__(self, scalaire: float) -> "Vecteur":\n        return self.__mul__(scalaire)  # 3 * v fonctionne aussi\n    \n    def __abs__(self) -> float:\n        return (self.x**2 + self.y**2) ** 0.5\n    \n    def __eq__(self, other: object) -> bool:\n        if not isinstance(other, Vecteur): return False\n        return self.x == other.x and self.y == other.y\n    \n    def __neg__(self) -> "Vecteur":\n        return Vecteur(-self.x, -self.y)\n\nu = Vecteur(1, 2)\nv = Vecteur(3, 4)\n\nprint(f"u = {u}")\nprint(f"v = {v}")\nprint(f"u + v = {u + v}")\nprint(f"u - v = {u - v}")\nprint(f"3 * u = {3 * u}")\nprint(f"|v|  = {abs(v):.2f}")\nprint(f"-u   = {-u}")\nprint(f"u == Vecteur(1,2) : {u == Vecteur(1, 2)}")',
        exercise: {
          instruction: "Crée une classe Fraction(num, den) avec __add__ pour additionner deux fractions.\nFraction(1,2) + Fraction(1,3) doit donner Fraction(5,6).\nAffiche str(Fraction(1,2) + Fraction(1,3)) → '5/6'.",
          starterCode: "class Fraction:\n    def __init__(self, num, den):\n        self.num = num\n        self.den = den\n    def __repr__(self):\n        return f'{self.num}/{self.den}'\n    def __add__(self, other):\n        # num/den + other.num/other.den = (num*other.den + other.num*den) / (den*other.den)\n        nouveau_num = self.num * other.den + other.num * self.den\n        nouveau_den = self.den * other.den\n        return Fraction(nouveau_num, nouveau_den)\n\nprint(Fraction(1, 2) + Fraction(1, 3))\n",
          expectedOutput: "5/6",
          hints: [
            "Pour additionner a/b + c/d = (a*d + c*b) / (b*d).",
            "Le code de __add__ est déjà là — complète ou exécute.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Les descripteurs",
        description: "Un descripteur contrôle l'accès à un attribut d'une classe via __get__, __set__, __delete__.\nC'est ce qui alimente @property, @staticmethod, @classmethod — ce sont tous des descripteurs !\nUn descripteur de données implémente __set__ — il prend la priorité sur l'instance.\nC'est la façon élégante d'ajouter de la validation sans toucher à __init__.",
        code: 'class Valide:\n    """Descripteur qui valide les valeurs selon un prédicat."""\n    \n    def __init__(self, predicat, message):\n        self.predicat = predicat\n        self.message  = message\n        self.attr     = None  # nom de l\'attribut, défini par __set_name__\n    \n    def __set_name__(self, owner, name):\n        self.attr = f"_{name}"  # stocké dans _age, _note, etc.\n    \n    def __get__(self, obj, objtype=None):\n        if obj is None: return self\n        return getattr(obj, self.attr, None)\n    \n    def __set__(self, obj, value):\n        if not self.predicat(value):\n            raise ValueError(f"{value} : {self.message}")\n        setattr(obj, self.attr, value)\n\nclass Etudiant:\n    age  = Valide(lambda v: 5 <= v <= 120,    "âge entre 5 et 120")\n    note = Valide(lambda v: 0.0 <= v <= 20.0, "note entre 0 et 20")\n    nom  = Valide(lambda v: len(v) >= 2,      "nom trop court")\n    \n    def __init__(self, nom, age, note):\n        self.nom  = nom\n        self.age  = age\n        self.note = note\n    \n    def __repr__(self):\n        return f"Etudiant({self.nom}, {self.age} ans, {self.note}/20)"\n\n# Cas valides\nalice = Etudiant("Alice", 16, 15.5)\nprint(alice)\n\n# Mise à jour valide\nalice.note = 17.0\nprint(f"Nouvelle note : {alice.note}")\n\n# Cas invalides\nfor cas in [("Etudiant age -1", lambda: Etudiant("Bob", -1, 10)),\n            ("Note > 20",       lambda: Etudiant("Eve", 15, 25)),\n            ("Nom court",       lambda: Etudiant("X",   12, 10))]:\n    try:\n        cas[1]()\n    except ValueError as e:\n        print(f"❌ {cas[0]}: {e}")',
        exercise: {
          instruction: "Crée un descripteur PositifStrict qui lève ValueError si la valeur <= 0.\nApplique-le à l'attribut prix d'une classe Produit.\nTeste avec prix=5 (OK) et prix=-1 (erreur).",
          starterCode: "class PositifStrict:\n    def __set_name__(self, owner, name):\n        self.attr = f'_{name}'\n    def __get__(self, obj, objtype=None):\n        return getattr(obj, self.attr, None) if obj else self\n    def __set__(self, obj, value):\n        if value <= 0:\n            raise ValueError(f'Doit etre positif, recu {value}')\n        setattr(obj, self.attr, value)\n\nclass Produit:\n    prix = PositifStrict()\n    def __init__(self, prix):\n        self.prix = prix\n\np = Produit(5)\nprint(p.prix)\ntry:\n    Produit(-1)\nexcept ValueError as e:\n    print(e)\n",
          expectedOutput: "5\nDoit etre positif, recu -1",
          hints: [
            "Le descripteur est déjà implémenté — il valide dans __set__.",
            "Produit(5) doit réussir, Produit(-1) doit lever ValueError.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Mini-projet : Bibliothèque SQLite",
        description: "On combine enum, SQLite3 et surcharge d'opérateurs pour créer une mini-bibliothèque.\nLes statuts de livre sont des enum, les requêtes utilisent SQLite3.\nLa classe Collection supporte len(), in et l'itération (for livre in collection).\nC'est le type de code qu'on écrit pour des apps de gestion réelles !",
        code: 'import sqlite3\nfrom enum import Enum, auto\n\nclass Statut(Enum):\n    DISPONIBLE = auto()\n    EMPRUNTE   = auto()\n    RESERVE    = auto()\n\nclass Bibliotheque:\n    def __init__(self):\n        self.conn = sqlite3.connect(":memory:")\n        self.conn.row_factory = sqlite3.Row\n        self._init_db()\n    \n    def _init_db(self):\n        self.conn.execute("""\n            CREATE TABLE livres (\n                id      INTEGER PRIMARY KEY AUTOINCREMENT,\n                titre   TEXT NOT NULL,\n                auteur  TEXT NOT NULL,\n                statut  TEXT DEFAULT \'DISPONIBLE\'\n            )\n        """)\n        self.conn.commit()\n    \n    def ajouter(self, titre, auteur):\n        self.conn.execute(\n            "INSERT INTO livres (titre, auteur) VALUES (?, ?)",\n            (titre, auteur)\n        )\n        self.conn.commit()\n    \n    def emprunter(self, titre):\n        cur = self.conn.execute(\n            "SELECT statut FROM livres WHERE titre=?", (titre,)\n        )\n        row = cur.fetchone()\n        if not row:\n            print(f"Livre inconnu : {titre}")\n            return\n        if row["statut"] != Statut.DISPONIBLE.name:\n            print(f"Indisponible : {titre} ({row[\'statut\']})")\n            return\n        self.conn.execute(\n            "UPDATE livres SET statut=? WHERE titre=?",\n            (Statut.EMPRUNTE.name, titre)\n        )\n        self.conn.commit()\n        print(f"Emprunte : {titre}")\n    \n    def __len__(self):\n        return self.conn.execute("SELECT COUNT(*) FROM livres").fetchone()[0]\n    \n    def __contains__(self, titre):\n        return bool(self.conn.execute(\n            "SELECT 1 FROM livres WHERE titre=?", (titre,)\n        ).fetchone())\n    \n    def afficher(self):\n        print(f"Bibliotheque ({len(self)} livres) :")\n        for row in self.conn.execute("SELECT titre, auteur, statut FROM livres"):\n            s = "✅" if row["statut"] == "DISPONIBLE" else "📖"\n            print(f"  {s} {row[\'titre\']} — {row[\'auteur\']}")\n\nbib = Bibliotheque()\nfor titre, auteur in [\n    ("Le Petit Prince",   "Saint-Exupery"),\n    ("1984",              "Orwell"),\n    ("Python Fluent",     "Ramalho"),\n]:\n    bib.ajouter(titre, auteur)\n\nbib.emprunter("1984")\nbib.afficher()\nprint(f"Contient Python Fluent : {\'Python Fluent\' in bib}")\nprint(f"Contient Java : {\'Java\' in bib}")',
      },
    ],
  },
  "11": {
    id: 11,
    emoji: "👑",
    name: "Grand Maître",
    color: "from-yellow-400 to-amber-500",
    lessons: [
      {
        title: "TypeVar et types génériques",
        description: "Les génériques permettent d'écrire du code qui fonctionne avec n'importe quel type tout en restant sûr.\nTypeVar('T') est un type paramétrique — il peut être int, str, n'importe quoi.\nGeneric[T] est la base pour créer des classes génériques comme list[int].\nEn pratique : une Pile[str] ne peut contenir que des chaînes, une Pile[int] que des entiers.\nC'est ce qui fait que list, dict, Optional sont typés dans Python moderne.",
        code: 'from typing import TypeVar, Generic, Optional\n\nT = TypeVar("T")\nK = TypeVar("K")\nV = TypeVar("V")\n\nclass Pile(Generic[T]):\n    """Pile LIFO générique."""\n    \n    def __init__(self):\n        self._items: list[T] = []\n    \n    def empiler(self, item: T) -> None:\n        self._items.append(item)\n    \n    def depiler(self) -> T:\n        if not self._items:\n            raise IndexError("Pile vide !")\n        return self._items.pop()\n    \n    def sommet(self) -> Optional[T]:\n        return self._items[-1] if self._items else None\n    \n    def __len__(self) -> int:\n        return len(self._items)\n    \n    def __repr__(self) -> str:\n        return f"Pile({self._items})"\n\nclass PaireTriee(Generic[K, V]):\n    """Paire clé-valeur avec clé comparable."""\n    \n    def __init__(self, cle: K, valeur: V):\n        self.cle = cle\n        self.valeur = valeur\n    \n    def __lt__(self, other: "PaireTriee[K, V]") -> bool:\n        return self.cle < other.cle\n    \n    def __repr__(self) -> str:\n        return f"({self.cle}: {self.valeur})"\n\n# Pile d\'entiers\npile_int: Pile[int] = Pile()\nfor n in [10, 20, 30]:\n    pile_int.empiler(n)\nprint(f"Pile : {pile_int}, sommet : {pile_int.sommet()}")\nprint(f"Défile : {pile_int.depiler()}, {pile_int.depiler()}, {pile_int.depiler()}")\n\n# Pile de chaînes\npile_str: Pile[str] = Pile()\nfor mot in ["Python", "est", "génial"]:\n    pile_str.empiler(mot)\nphrase = []\nwhile len(pile_str):\n    phrase.append(pile_str.depiler())\nprint(" ".join(phrase))\n\n# Paires triées\npaires = [PaireTriee(3, "C"), PaireTriee(1, "A"), PaireTriee(2, "B")]\nprint(sorted(paires))',
        exercise: {
          instruction: "Crée une Pile d'entiers, empile 1, 2, 3, puis dépile tout et affiche chaque valeur.\nLa pile est LIFO : le dernier entré sort en premier.",
          starterCode: "from typing import TypeVar, Generic\n\nT = TypeVar('T')\n\nclass Pile(Generic[T]):\n    def __init__(self):\n        self._items = []\n    def empiler(self, item):\n        self._items.append(item)\n    def depiler(self):\n        return self._items.pop()\n    def __len__(self):\n        return len(self._items)\n\np = Pile()\np.empiler(1)\np.empiler(2)\np.empiler(3)\nwhile len(p):\n    print(p.depiler())\n",
          expectedOutput: "3\n2\n1",
          hints: [
            "Une pile LIFO : dernier entré = premier sorti. pop() retourne le dernier élément.",
            "Empile 1, 2, 3 puis dépile : on obtient 3, 2, 1.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
        quiz: {
          questions: [
            {
              question: "À quoi sert TypeVar('T') ?",
              options: [
                "Créer un type personnalisé nommé T",
                "Déclarer un paramètre de type pour les génériques",
                "Convertir n'importe quelle valeur en T",
                "Limiter T aux types numériques",
              ],
              correct: 1,
              explanation: "TypeVar déclare un paramètre de type — T peut représenter int, str, ou n'importe quel type selon le contexte d'utilisation.",
            },
          ],
        },
      },
      {
        title: "Protocol : le duck typing structurel",
        description: "Un Protocol définit une interface sans héritage — une classe n'a pas besoin d'en hériter pour la respecter !\nSi un objet a les bonnes méthodes, il est compatible. C'est le duck typing formalisé.\nruntime_checkable permet d'utiliser isinstance() avec un Protocol.\nContrairement à ABC, les Protocols ne nécessitent aucune modification des classes existantes.\nC'est utilisé dans les bibliothèques modernes : pathlib, typing, numpy...",
        code: 'from typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass Dessinable(Protocol):\n    def dessiner(self) -> str: ...\n    def couleur(self) -> str: ...\n\n@runtime_checkable\nclass Serialisable(Protocol):\n    def to_dict(self) -> dict: ...\n\n# Ces classes ne héritent PAS de Dessinable !\nclass Cercle:\n    def __init__(self, r: float, coul: str):\n        self.r = r\n        self._coul = coul\n    def dessiner(self) -> str:\n        return f"O ({self.r}cm)"\n    def couleur(self) -> str:\n        return self._coul\n    def to_dict(self) -> dict:\n        return {"type": "cercle", "r": self.r}\n\nclass Carre:\n    def __init__(self, c: float, coul: str):\n        self.c = c\n        self._coul = coul\n    def dessiner(self) -> str:\n        return f"[] ({self.c}cm)"\n    def couleur(self) -> str:\n        return self._coul\n\n# isinstance() fonctionne avec @runtime_checkable\nformes = [Cercle(5, "rouge"), Carre(3, "bleu")]\n\nfor f in formes:\n    if isinstance(f, Dessinable):\n        print(f"Dessinable : {f.dessiner()} ({f.couleur()})")\n    if isinstance(f, Serialisable):\n        print(f"  -> sérialisable : {f.to_dict()}")\n\n# Fonction qui accepte tout objet Dessinable\ndef afficher_canvas(objets: list[Dessinable]) -> None:\n    print("\\n=== Canvas ===")\n    for obj in objets:\n        print(f"  {obj.couleur():6} | {obj.dessiner()}")\n\nafficher_canvas(formes)',
        exercise: {
          instruction: "Crée un Protocol Comparable avec une méthode comparer(other) -> int.\nCrée une classe Temperature qui l'implémente : comparer retourne -1, 0 ou 1.\nAffiche Temperature(20).comparer(Temperature(30)).",
          starterCode: "from typing import Protocol\n\nclass Comparable(Protocol):\n    def comparer(self, other) -> int: ...\n\nclass Temperature:\n    def __init__(self, valeur: float):\n        self.valeur = valeur\n    def comparer(self, other: 'Temperature') -> int:\n        if self.valeur < other.valeur: return -1\n        if self.valeur > other.valeur: return 1\n        return 0\n\nprint(Temperature(20).comparer(Temperature(30)))\n",
          expectedOutput: "-1",
          hints: [
            "Temperature(20) < Temperature(30), donc comparer retourne -1.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
            "La valeur attendue est -1 (20 est inférieur à 30).",
          ],
        },
      },
      {
        title: "__slots__ et optimisation mémoire",
        description: "Par défaut chaque instance Python stocke ses attributs dans un dictionnaire __dict__.\n__slots__ remplace ce dict par un stockage fixe — moins de mémoire, accès plus rapide.\nPour des millions d'objets, la différence peut être énorme : 50% de mémoire en moins !\nLimite : tu ne peux pas ajouter d'attributs dynamiques à une classe avec __slots__.\nIdéal pour : data objects, points de coordonnées, vecteurs, enregistrements.",
        code: 'import sys\n\nclass PointNormal:\n    def __init__(self, x, y, z):\n        self.x = x\n        self.y = y\n        self.z = z\n\nclass PointSlots:\n    __slots__ = ("x", "y", "z")\n    def __init__(self, x, y, z):\n        self.x = x\n        self.y = y\n        self.z = z\n\np1 = PointNormal(1.0, 2.0, 3.0)\np2 = PointSlots(1.0, 2.0, 3.0)\n\ntaille_normale = sys.getsizeof(p1) + sys.getsizeof(p1.__dict__)\ntaille_slots   = sys.getsizeof(p2)\n\nprint(f"Avec __dict__ : {taille_normale} octets")\nprint(f"Avec __slots__: {taille_slots} octets")\nprint(f"Gain mémoire  : ~{round((1 - taille_slots/taille_normale)*100)}%")\n\n# Les slots limitent les attributs dynamiques\ntry:\n    p2.w = 4.0  # Interdit !\nexcept AttributeError as e:\n    print(f"\\n❌ {e}")\n\n# Mais les attributs déclarés fonctionnent normalement\np2.x = 99.0\nprint(f"✅ p2.x = {p2.x}")\n\n# Performance sur 100k objets\nimport time\nn = 100_000\n\nt0 = time.perf_counter()\nnormaux = [PointNormal(i, i, i) for i in range(n)]\nt1 = time.perf_counter()\nslots_pts = [PointSlots(i, i, i) for i in range(n)]\nt2 = time.perf_counter()\n\nprint(f"\\n{n} objets normaux : {(t1-t0)*1000:.1f}ms")\nprint(f"{n} objets slots   : {(t2-t1)*1000:.1f}ms")',
        exercise: {
          instruction: "Crée une classe Pixel avec __slots__ = ('r', 'g', 'b').\nCrée Pixel(255, 128, 0) et affiche r, g, b sur une ligne séparée par des virgules.",
          starterCode: "class Pixel:\n    __slots__ = ('r', 'g', 'b')\n    def __init__(self, r, g, b):\n        self.r = r\n        self.g = g\n        self.b = b\n\np = Pixel(255, 128, 0)\nprint(p.r, p.g, p.b, sep=',')\n",
          expectedOutput: "255,128,0",
          hints: [
            "__slots__ déclare les seuls attributs autorisés — r, g et b ici.",
            "print(p.r, p.g, p.b, sep=',') affiche les trois valeurs séparées par des virgules.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Regex avancé : groupes et assertions",
        description: "Les groupes nommés (?P<nom>...) rendent les regex lisibles et les résultats accessibles par nom.\nLes assertions sont des conditions de contexte sans capturer de texte :\n(?=...) lookahead : suivi de...\n(?!...) negative lookahead : pas suivi de...\n(?<=...) lookbehind : précédé de...\n(?<!...) negative lookbehind : pas précédé de...\nLes regex avancées servent en data science, parsing de logs, validation...",
        code: 'import re\n\n# Groupes nommés : beaucoup plus lisibles !\npattern_date = r"(?P<jour>\\d{2})/(?P<mois>\\d{2})/(?P<annee>\\d{4})"\ndates = ["25/12/2024", "01/01/2025", "invalide", "31/03/2023"]\n\nprint("=== Dates ===")\nfor texte in dates:\n    m = re.fullmatch(pattern_date, texte)\n    if m:\n        print(f"  {m.group(\'annee\')}-{m.group(\'mois\')}-{m.group(\'jour\')}")\n    else:\n        print(f"  {texte!r} → invalide")\n\n# Lookahead : mot suivi de certains caractères\npattern_prix = r"\\d+\\.?\\d*(?= ?€)"  # nombre suivi de €\ntexte = "Pomme 0.80€, Banane 0.30 €, Raisin 2.50€"\nprint("\\n=== Prix (€) ===")\nfor prix in re.findall(pattern_prix, texte):\n    print(f"  {prix}€")\n\n# Lookbehind : chiffre précédé de €\npattern_apres = r"(?<=@)[a-z]+(?=\\.)"  # domaine dans un email\nemails = ["alice@gmail.com", "bob@yahoo.fr", "eve@hotmail.com"]\nprint("\\n=== Domaines ===" )\nfor email in emails:\n    m = re.search(pattern_apres, email)\n    if m:\n        print(f"  {email} → domaine: {m.group()}")\n\n# Substitution avec groupes\npattern_tel = r"(?P<indicatif>0\\d)(?P<suite>[\\d]{8})"\ntel = "0612345678"\nformate = re.sub(pattern_tel, r"\\g<indicatif> \\g<suite>", tel)\nprint(f"\\nTéléphone : {formate}")',
        exercise: {
          instruction: "Utilise une regex avec groupes nommés pour extraire l'année, le mois et le jour de '2025-01-15'.\nAffiche l'année, puis le mois, puis le jour sur 3 lignes séparées.",
          starterCode: "import re\n\npattern = r'(?P<annee>\\d{4})-(?P<mois>\\d{2})-(?P<jour>\\d{2})'\nm = re.fullmatch(pattern, '2025-01-15')\nif m:\n    print(m.group('annee'))\n    print(m.group('mois'))\n    print(m.group('jour'))\n",
          expectedOutput: "2025\n01\n15",
          hints: [
            "(?P<nom>...) capture dans un groupe nommé 'nom'.",
            "m.group('annee') retourne la valeur du groupe nommé 'annee'.",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "__init_subclass__ : hooks de sous-classement",
        description: "__init_subclass__ est appelé automatiquement chaque fois qu'une classe hérite d'une autre.\nC'est plus propre que les métaclasses pour beaucoup de cas !\nOn peut enregistrer des sous-classes dans un registre, valider la définition de la classe...\nPydantic, Django et attrs utilisent ce mécanisme pour créer des registres de modèles.",
        code: 'class Plugin:\n    """Classe de base avec registre automatique des sous-classes."""\n    \n    _registre: dict = {}\n    \n    def __init_subclass__(cls, nom: str = "", **kwargs):\n        super().__init_subclass__(**kwargs)\n        if nom:\n            Plugin._registre[nom] = cls\n            print(f"  Plugin enregistré : {nom!r} → {cls.__name__}")\n    \n    @classmethod\n    def obtenir(cls, nom: str):\n        return cls._registre.get(nom)\n\nprint("=== Chargement des plugins ===")\n\nclass PluginJson(Plugin, nom="json"):\n    def traiter(self, data):\n        import json\n        return json.dumps(data)\n\nclass PluginTexte(Plugin, nom="texte"):\n    def traiter(self, data):\n        return str(data)\n\nclass PluginUpper(Plugin, nom="upper"):\n    def traiter(self, data):\n        return str(data).upper()\n\nprint(f"\\nRegistre : {list(Plugin._registre)}")\n\n# Utilisation\ndonnees = {"cle": "valeur", "n": 42}\nfor nom in ["json", "texte", "upper", "inconnu"]:\n    cls = Plugin.obtenir(nom)\n    if cls:\n        print(f"{nom:8} → {cls().traiter(donnees)}")\n    else:\n        print(f"{nom:8} → plugin inconnu")',
        exercise: {
          instruction: "Crée une classe Forme avec __init_subclass__ qui enregistre les sous-classes dans Forme._registre.\nCrée Cercle et Carre comme sous-classes.\nAffiche la liste des clés du registre (les noms de classes).",
          starterCode: "class Forme:\n    _registre = {}\n    def __init_subclass__(cls, **kwargs):\n        super().__init_subclass__(**kwargs)\n        Forme._registre[cls.__name__] = cls\n\nclass Cercle(Forme): pass\nclass Carre(Forme): pass\n\nprint(sorted(Forme._registre.keys()))\n",
          expectedOutput: "['Carre', 'Cercle']",
          hints: [
            "__init_subclass__ reçoit cls qui est la sous-classe en cours de création.",
            "cls.__name__ donne le nom de la classe (ex: 'Cercle').",
            "Le code est déjà complet — clique ▶ pour vérifier.",
          ],
        },
      },
      {
        title: "Mini-projet final : Framework de validation",
        description: "Le projet final combine TypeVar, Protocol, descripteurs, __init_subclass__ et enum !\nOn crée un mini-framework de validation inspiré de Pydantic.\nChaque champ est un descripteur, le modèle s'enregistre automatiquement, les erreurs sont collectées.\nC'est le genre de bibliothèque que les développeurs Python expérimentés construisent pour gagner du temps.",
        code: 'from typing import TypeVar, Any\nfrom enum import Enum, auto\n\n# ── Types ─────────────────────────────────────────────────────────────\nclass TypeChamp(Enum):\n    TEXTE   = auto()\n    ENTIER  = auto()\n    REEL    = auto()\n    BOOLEEN = auto()\n\nTYPE_PYTHON = {\n    TypeChamp.TEXTE:   str,\n    TypeChamp.ENTIER:  int,\n    TypeChamp.REEL:    float,\n    TypeChamp.BOOLEEN: bool,\n}\n\n# ── Descripteur de champ validé ───────────────────────────────────────\nclass Champ:\n    def __init__(self, type_champ: TypeChamp, obligatoire: bool = True,\n                 mini=None, maxi=None):\n        self.type_champ   = type_champ\n        self.obligatoire  = obligatoire\n        self.mini         = mini\n        self.maxi         = maxi\n        self.nom          = ""\n    \n    def __set_name__(self, owner, name):\n        self.nom = name\n    \n    def __get__(self, obj, objtype=None):\n        return obj.__dict__.get(self.nom) if obj else self\n    \n    def valider(self, valeur) -> list[str]:\n        erreurs = []\n        if valeur is None:\n            if self.obligatoire:\n                erreurs.append(f"{self.nom} est obligatoire")\n            return erreurs\n        type_attendu = TYPE_PYTHON[self.type_champ]\n        if not isinstance(valeur, type_attendu):\n            erreurs.append(f"{self.nom} doit etre {type_attendu.__name__}")\n            return erreurs\n        if self.mini is not None and valeur < self.mini:\n            erreurs.append(f"{self.nom} >= {self.mini} requis")\n        if self.maxi is not None and valeur > self.maxi:\n            erreurs.append(f"{self.nom} <= {self.maxi} requis")\n        return erreurs\n    \n    def __set__(self, obj, valeur):\n        obj.__dict__[self.nom] = valeur\n\n# ── Modèle de base ────────────────────────────────────────────────────\nclass Modele:\n    _modeles: dict = {}\n    \n    def __init_subclass__(cls, **kwargs):\n        super().__init_subclass__(**kwargs)\n        Modele._modeles[cls.__name__] = cls\n    \n    def __init__(self, **kwargs):\n        for k, v in kwargs.items():\n            setattr(self, k, v)\n    \n    def valider(self) -> list[str]:\n        erreurs = []\n        for nom, champ in self.__class__.__dict__.items():\n            if isinstance(champ, Champ):\n                valeur = self.__dict__.get(nom)\n                erreurs.extend(champ.valider(valeur))\n        return erreurs\n    \n    def est_valide(self) -> bool:\n        return len(self.valider()) == 0\n\n# ── Définition de modèles métier ──────────────────────────────────────\nclass Utilisateur(Modele):\n    nom  = Champ(TypeChamp.TEXTE,  mini=2, maxi=50)\n    age  = Champ(TypeChamp.ENTIER, mini=0, maxi=120)\n    note = Champ(TypeChamp.REEL,   mini=0.0, maxi=20.0, obligatoire=False)\n\nprint("=== Tests de validation ===")\ncas = [\n    {"nom": "Alice", "age": 25, "note": 17.5},\n    {"nom": "B",     "age": 25},\n    {"nom": "Charlie", "age": -1, "note": 25.0},\n]\nfor data in cas:\n    u = Utilisateur(**data)\n    erreurs = u.valider()\n    if erreurs:\n        print(f"Invalide : {erreurs}")\n    else:\n        print(f"Valide   : {u.__dict__}")\n\nprint(f"\\nModeles enregistres : {list(Modele._modeles)}")',
      },
    ],
  },
};