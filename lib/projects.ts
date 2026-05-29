export interface ProjectStep {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
}

export interface GuidedProject {
  id: string;
  levelId: number;
  emoji: string;
  title: string;
  description: string;
  color: string;
  steps: ProjectStep[];
}

export const GUIDED_PROJECTS: GuidedProject[] = [
  {
    id: "robot-bavard",
    levelId: 0,
    emoji: "🤖",
    title: "Le Robot Bavard",
    description: "Crée un robot qui parle, se présente et raconte une blague ! Tu vas apprendre à utiliser print() comme un vrai programmeur.",
    color: "from-green-400 to-emerald-500",
    steps: [
      {
        id: 0,
        title: "Le robot se présente",
        description: "Fais dire à ton robot son nom et sa spécialité. Utilise 3 print() à la suite.",
        starterCode: '# Fais parler ton robot !\n# Il doit dire son nom, son âge (en années de création) et sa spécialité\n\nprint("Je suis...")\n',
        expectedOutput: "Je suis ROBO-3000 !\nJ'ai 2 ans.\nMa spécialité : apprendre Python !",
        hint: "Écris trois lignes print() avec exactement le bon texte.",
      },
      {
        id: 1,
        title: "Le robot compte",
        description: "Ton robot adore compter ! Fais-le compter de 1 à 5 en affichant chaque chiffre.",
        starterCode: "# Le robot compte de 1 à 5\n# Une ligne par chiffre\n\nprint(1)\n",
        expectedOutput: "1\n2\n3\n4\n5",
        hint: "Utilise print() 5 fois, une fois pour chaque chiffre.",
      },
      {
        id: 2,
        title: "Le robot raconte une blague",
        description: "Programme le robot pour qu'il raconte une blague en 2 temps : d'abord la question, puis la réponse.",
        starterCode: '# La blague du robot !\nprint("Pourquoi les plongeurs plongent-ils toujours en arrière ?")\nprint("...")\n',
        expectedOutput: "Pourquoi les plongeurs plongent-ils toujours en arrière ?\nParce que sinon ils tomberaient dans le bateau !",
        hint: "Remplace les '...' par la réponse de la blague.",
      },
      {
        id: 3,
        title: "Le robot se souvient",
        description: "Utilise des variables pour stocker le nom de l'utilisateur et le nombre de blagues racontées, puis affiche un résumé.",
        starterCode: '# Stocke des infos dans des variables\nnom = "Alice"\nnb_blagues = 3\n\n# Affiche un message personnalisé\nprint("Bonjour " + ... + " !")\nprint("J\'ai raconté " + str(...) + " blagues aujourd\'hui.")\n',
        expectedOutput: "Bonjour Alice !\nJ'ai raconté 3 blagues aujourd'hui.",
        hint: "Remplace les ... par les noms de variables : nom et nb_blagues. Pour les nombres, utilise str() pour les convertir en texte.",
      },
      {
        id: 4,
        title: "Le robot fait le bilan",
        description: "Crée un programme qui calcule et affiche le bilan du robot : nombre de mots dits et moyenne de mots par blague.",
        starterCode: '# Bilan du robot bavard\nblague1 = "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tomberaient dans le bateau !"\nblague2 = "Qu\'est-ce qu\'un canif ? Un petit fien !"\nblague3 = "Pourquoi le scarabée ? Parce que la betterave !"\n\nmots_total = len(blague1.split()) + len(blague2.split()) + len(blague3.split())\nmoyenne = mots_total // 3\n\nprint("Mots prononcés au total : " + str(mots_total))\nprint("Moyenne par blague : " + str(moyenne) + " mots")\n',
        expectedOutput: "Mots prononcés au total : 34\nMoyenne par blague : 11 mots",
        hint: "split() divise une phrase en liste de mots. len() compte les éléments. // fait la division entière.",
      },
    ],
  },
  {
    id: "devinette",
    levelId: 1,
    emoji: "🎲",
    title: "Le Jeu de Devinette",
    description: "Crée un vrai jeu où l'ordinateur choisit un nombre et le joueur doit le trouver. Variables, conditions et boucles au programme !",
    color: "from-yellow-400 to-orange-400",
    steps: [
      {
        id: 0,
        title: "Stocker le nombre secret",
        description: "Crée une variable `secret` qui contient le nombre 42, et affiche un message de bienvenue.",
        starterCode: "# Crée le nombre secret\nsecret = ...\nprint(\"Bienvenue dans le jeu de devinette !\")\nprint(\"J'ai choisi un nombre entre 1 et 100.\")\n",
        expectedOutput: "Bienvenue dans le jeu de devinette !\nJ'ai choisi un nombre entre 1 et 100.",
        hint: "Remplace ... par le nombre 42.",
      },
      {
        id: 1,
        title: "Comparer deux nombres",
        description: "Utilise une condition `if/elif/else` pour comparer `proposition = 30` avec `secret = 42`.",
        starterCode: "secret = 42\nproposition = 30\n\n# Compare et affiche le bon message\nif proposition == secret:\n    print(\"Bravo !\")\nelif proposition < secret:\n    print(\"...\")  # Trop petit !\nelse:\n    print(\"...\")  # Trop grand !\n",
        expectedOutput: "Trop petit !",
        hint: "Remplace les ... par 'Trop petit !' ou 'Trop grand !' selon la logique.",
      },
      {
        id: 2,
        title: "Simuler plusieurs essais",
        description: "Simule 3 essais avec une liste de propositions et affiche le résultat de chaque essai.",
        starterCode: "secret = 42\nessais = [20, 60, 42]\n\nfor proposition in essais:\n    if proposition == secret:\n        print(f\"{proposition} - Bravo !\")\n    elif proposition < secret:\n        print(f\"{proposition} - ...\")  # Trop petit !\n    else:\n        print(f\"{proposition} - ...\")  # Trop grand !\n",
        expectedOutput: "20 - Trop petit !\n60 - Trop grand !\n42 - Bravo !",
        hint: "Complète les ... avec 'Trop petit !' et 'Trop grand !'",
      },
      {
        id: 3,
        title: "Compter les tentatives",
        description: "Ajoute un compteur d'essais pour savoir combien de tentatives ont été nécessaires avant de trouver le nombre.",
        starterCode: "secret = 42\nessais = [20, 60, 42]\ncompteur = 0\n\nfor proposition in essais:\n    compteur = compteur + 1\n    if proposition == secret:\n        print(f\"Trouvé en {compteur} essai(s) !\")\n    elif proposition < secret:\n        print(f\"Essai {compteur} : {proposition} - Trop petit !\")\n    else:\n        print(f\"Essai {compteur} : {proposition} - Trop grand !\")\n",
        expectedOutput: "Essai 1 : 20 - Trop petit !\nEssai 2 : 60 - Trop grand !\nTrouvé en 3 essai(s) !",
        hint: "compteur = compteur + 1 s'écrit aussi compteur += 1. La variable s'incrémente à chaque tour de boucle.",
      },
      {
        id: 4,
        title: "Score et message final",
        description: "Calcule un score (moins d'essais = meilleur score) et affiche un message de félicitations adapté.",
        starterCode: "secret = 42\nessais = [20, 60, 42]\ncompteur = 0\ntrouve = False\n\nfor proposition in essais:\n    compteur += 1\n    if proposition == secret:\n        trouve = True\n        break\n\nif trouve:\n    score = max(0, 100 - (compteur - 1) * 30)\n    print(f\"Bravo ! Trouvé en {compteur} essai(s).\")\n    print(f\"Ton score : {score}/100\")\n    if score >= 100:\n        print(\"Parfait ! Premier essai !\")\n    elif score >= 70:\n        print(\"Très bien joué !\")\n    else:\n        print(\"Continue de t'entraîner !\")\n",
        expectedOutput: "Bravo ! Trouvé en 3 essai(s).\nTon score : 40/100\nContinue de t'entraîner !",
        hint: "break arrête la boucle dès qu'on trouve. max(0, ...) évite un score négatif. Ici 100 - (3-1)*30 = 40.",
      },
    ],
  },
  {
    id: "carnet-contacts",
    levelId: 2,
    emoji: "📒",
    title: "Le Carnet de Contacts",
    description: "Construis un carnet de contacts avec des listes et des fonctions. Tu vas créer, afficher et rechercher des contacts !",
    color: "from-blue-400 to-cyan-500",
    steps: [
      {
        id: 0,
        title: "Créer les contacts",
        description: "Crée une liste `contacts` avec 3 noms et affiche-les avec leur numéro d'ordre.",
        starterCode: "contacts = [\"Alice\", \"Bob\", \"Charlie\"]\n\n# Affiche chaque contact avec son numéro\nfor i, nom in enumerate(contacts, 1):\n    print(f\"...\")\n",
        expectedOutput: "1. Alice\n2. Bob\n3. Charlie",
        hint: "Dans le f-string, utilise {i} pour le numéro et {nom} pour le nom.",
      },
      {
        id: 1,
        title: "Fonction d'ajout",
        description: "Crée une fonction `ajouter(contacts, nom)` qui ajoute un contact à la liste et affiche un message de confirmation.",
        starterCode: "def ajouter(contacts, nom):\n    contacts.append(nom)\n    print(f\"{nom} ajouté !\")\n\ncontacts = [\"Alice\", \"Bob\"]\najouter(contacts, \"David\")\nprint(f\"Total : {len(contacts)} contacts\")\n",
        expectedOutput: "David ajouté !\nTotal : 3 contacts",
        hint: "La fonction est déjà écrite ! Lance-la simplement et affiche le total.",
      },
      {
        id: 2,
        title: "Recherche de contact",
        description: "Crée une fonction `chercher(contacts, nom)` qui retourne True si le contact existe, False sinon.",
        starterCode: "def chercher(contacts, nom):\n    return nom in contacts\n\ncontacts = [\"Alice\", \"Bob\", \"Charlie\"]\n\nif chercher(contacts, \"Bob\"):\n    print(\"Bob trouvé !\")\nelse:\n    print(\"Bob introuvable.\")\n\nif chercher(contacts, \"Zara\"):\n    print(\"Zara trouvé !\")\nelse:\n    print(\"Zara introuvable.\")\n",
        expectedOutput: "Bob trouvé !\nZara introuvable.",
        hint: "La fonction chercher() utilise l'opérateur `in`. Le code est complet, lance-le !",
      },
      {
        id: 3,
        title: "Trier les contacts",
        description: "Trie la liste de contacts par ordre alphabétique et affiche-la numérotée.",
        starterCode: "contacts = [\"Charlie\", \"Alice\", \"Bob\", \"David\"]\n\ncontacts_tries = sorted(contacts)\n\nprint(\"Carnet trié :\")\nfor i, nom in enumerate(contacts_tries, 1):\n    print(f\"  {i}. {nom}\")\n",
        expectedOutput: "Carnet trié :\n  1. Alice\n  2. Bob\n  3. Charlie\n  4. David",
        hint: "sorted() retourne une nouvelle liste triée sans modifier l'originale. enumerate(liste, 1) démarre le compteur à 1.",
      },
      {
        id: 4,
        title: "Supprimer un contact",
        description: "Crée une fonction `supprimer(contacts, nom)` qui retire un contact s'il existe, et affiche un message de confirmation.",
        starterCode: "def supprimer(contacts, nom):\n    if nom in contacts:\n        contacts.remove(nom)\n        print(f\"{nom} supprimé.\")\n    else:\n        print(f\"{nom} introuvable.\")\n\ncontacts = [\"Alice\", \"Bob\", \"Charlie\"]\nsupprimer(contacts, \"Bob\")\nsupprimer(contacts, \"Zara\")\nprint(f\"Contacts restants : {contacts}\")\n",
        expectedOutput: "Bob supprimé.\nZara introuvable.\nContacts restants : ['Alice', 'Charlie']",
        hint: "remove() retire la première occurrence d'un élément. Vérifie d'abord avec `in` pour éviter une erreur.",
      },
    ],
  },
  {
    id: "base-eleves",
    levelId: 3,
    emoji: "🏫",
    title: "La Base de Données d'Élèves",
    description: "Crée un système pour gérer les notes des élèves avec des dictionnaires. Ajoute, modifie et calcule les moyennes !",
    color: "from-purple-500 to-violet-600",
    steps: [
      {
        id: 0,
        title: "Créer le dictionnaire",
        description: "Crée un dictionnaire `eleves` avec 3 élèves et leurs notes, puis affiche chaque élève et sa note.",
        starterCode: "eleves = {\n    \"Alice\": 18,\n    \"Bob\": 14,\n    \"Charlie\": 16\n}\n\nfor nom, note in eleves.items():\n    print(f\"{nom} : {note}/20\")\n",
        expectedOutput: "Alice : 18/20\nBob : 14/20\nCharlie : 16/20",
        hint: "Le code est prêt ! Lance-le pour voir le résultat.",
      },
      {
        id: 1,
        title: "Calculer la moyenne",
        description: "Calcule et affiche la moyenne de toutes les notes avec 2 décimales.",
        starterCode: "eleves = {\"Alice\": 18, \"Bob\": 14, \"Charlie\": 16}\n\nnotes = list(eleves.values())\nmoyenne = sum(notes) / len(notes)\nprint(f\"Moyenne de la classe : {moyenne:.2f}/20\")\n",
        expectedOutput: "Moyenne de la classe : 16.00/20",
        hint: "Utilise sum() pour la somme et len() pour le nombre d'élèves.",
      },
      {
        id: 2,
        title: "Trouver le meilleur",
        description: "Trouve et affiche l'élève avec la meilleure note en utilisant max().",
        starterCode: "eleves = {\"Alice\": 18, \"Bob\": 14, \"Charlie\": 16}\n\nmeilleur = max(eleves, key=eleves.get)\nprint(f\"Meilleur élève : {meilleur} avec {eleves[meilleur]}/20\")\n",
        expectedOutput: "Meilleur élève : Alice avec 18/20",
        hint: "max() avec key=eleves.get trouve la clé avec la valeur maximale.",
      },
      {
        id: 3,
        title: "Classement de la classe",
        description: "Affiche le classement complet des élèves du meilleur au moins bon, avec leur rang.",
        starterCode: "eleves = {\"Alice\": 18, \"Bob\": 14, \"Charlie\": 16, \"Diana\": 12, \"Ethan\": 19}\n\nclassement = sorted(eleves.items(), key=lambda x: x[1], reverse=True)\n\nprint(\"=== Classement ===\")\nfor rang, (nom, note) in enumerate(classement, 1):\n    medaille = \"🥇\" if rang == 1 else \"🥈\" if rang == 2 else \"🥉\" if rang == 3 else \"  \"\n    print(f\"{medaille} {rang}. {nom} : {note}/20\")\n",
        expectedOutput: "=== Classement ===\n🥇 1. Ethan : 19/20\n🥈 2. Alice : 18/20\n🥉 3. Charlie : 16/20\n   4. Bob : 14/20\n   5. Diana : 12/20",
        hint: "sorted() avec reverse=True trie du plus grand au plus petit. lambda x: x[1] trie par la note (deuxième élément du tuple).",
      },
      {
        id: 4,
        title: "Élèves sous la moyenne",
        description: "Identifie les élèves dont la note est inférieure à la moyenne et affiche une liste de ceux qui ont besoin d'aide.",
        starterCode: "eleves = {\"Alice\": 18, \"Bob\": 14, \"Charlie\": 16, \"Diana\": 12, \"Ethan\": 19}\n\nnotes = list(eleves.values())\nmoyenne = sum(notes) / len(notes)\nprint(f\"Moyenne : {moyenne:.1f}/20\")\n\nsous_moyenne = [nom for nom, note in eleves.items() if note < moyenne]\nprint(f\"Élèves sous la moyenne : {sous_moyenne}\")\nprint(f\"Nombre d'élèves à aider : {len(sous_moyenne)}\")\n",
        expectedOutput: "Moyenne : 15.8/20\nÉlèves sous la moyenne : ['Bob', 'Diana']\nNombre d'élèves à aider : 2",
        hint: "Une compréhension de liste [x for x in liste if condition] filtre les éléments. Ici on filtre les noms dont la note < moyenne.",
      },
    ],
  },
  {
    id: "jeu-rpg",
    levelId: 4,
    emoji: "⚔️",
    title: "Le Mini RPG",
    description: "Crée un mini jeu de rôle avec des classes Python ! Un héros combat un monstre, avec des points de vie et des attaques.",
    color: "from-pink-500 to-rose-600",
    steps: [
      {
        id: 0,
        title: "La classe Personnage",
        description: "Crée une classe `Personnage` avec un nom et des points de vie, et une méthode `present()` qui se présente.",
        starterCode: "class Personnage:\n    def __init__(self, nom, pv):\n        self.nom = nom\n        self.pv = pv\n\n    def present(self):\n        print(f\"{self.nom} ({self.pv} PV)\")\n\nheros = Personnage(\"Aria\", 100)\nmonster = Personnage(\"Dragon\", 80)\nheros.present()\nmonster.present()\n",
        expectedOutput: "Aria (100 PV)\nDragon (80 PV)",
        hint: "Le code est complet ! Lance-le pour voir tes personnages.",
      },
      {
        id: 1,
        title: "Méthode d'attaque",
        description: "Ajoute une méthode `attaquer(cible, degats)` qui réduit les PV de la cible et affiche le résultat.",
        starterCode: "class Personnage:\n    def __init__(self, nom, pv):\n        self.nom = nom\n        self.pv = pv\n\n    def attaquer(self, cible, degats):\n        cible.pv -= degats\n        print(f\"{self.nom} attaque {cible.nom} pour {degats} dégâts ! ({cible.pv} PV restants)\")\n\nheros = Personnage(\"Aria\", 100)\ndragon = Personnage(\"Dragon\", 80)\nheros.attaquer(dragon, 25)\ndragon.attaquer(heros, 15)\n",
        expectedOutput: "Aria attaque Dragon pour 25 dégâts ! (55 PV restants)\nDragon attaque Aria pour 15 dégâts ! (85 PV restants)",
        hint: "Utilise cible.pv -= degats pour réduire les PV.",
      },
      {
        id: 2,
        title: "Est-ce vivant ?",
        description: "Ajoute une propriété `est_vivant` et teste si les personnages sont en vie après des attaques.",
        starterCode: "class Personnage:\n    def __init__(self, nom, pv):\n        self.nom = nom\n        self.pv = pv\n\n    @property\n    def est_vivant(self):\n        return self.pv > 0\n\nheros = Personnage(\"Aria\", 100)\nenemi = Personnage(\"Goblin\", 20)\nenemi.pv -= 30  # attaque fatale\n\nprint(f\"Aria vivante : {heros.est_vivant}\")\nprint(f\"Goblin vivant : {enemi.est_vivant}\")\n",
        expectedOutput: "Aria vivante : True\nGoblin vivant : False",
        hint: "Après avoir retiré 30 PV au Goblin (qui en a 20), ses PV sont négatifs → est_vivant = False.",
      },
      {
        id: 3,
        title: "Combat tour par tour",
        description: "Simule un combat complet entre le héros et le dragon : ils s'attaquent à tour de rôle jusqu'à ce que l'un d'eux tombe.",
        starterCode: "class Personnage:\n    def __init__(self, nom, pv, force):\n        self.nom = nom\n        self.pv = pv\n        self.force = force\n\n    @property\n    def est_vivant(self):\n        return self.pv > 0\n\nheros = Personnage(\"Aria\", 50, 15)\ndragon = Personnage(\"Dragon\", 50, 12)\ntour = 1\n\nwhile heros.est_vivant and dragon.est_vivant:\n    dragon.pv -= heros.force\n    heros.pv -= dragon.force\n    print(f\"Tour {tour} — Aria: {max(0, heros.pv)} PV | Dragon: {max(0, dragon.pv)} PV\")\n    tour += 1\n\nif heros.est_vivant:\n    print(\"Aria a gagné !\")\nelse:\n    print(\"Le Dragon a gagné !\")\n",
        expectedOutput: "Tour 1 — Aria: 38 PV | Dragon: 35 PV\nTour 2 — Aria: 26 PV | Dragon: 20 PV\nTour 3 — Aria: 14 PV | Dragon: 5 PV\nTour 4 — Aria: 2 PV | Dragon: 0 PV\nAria a gagné !",
        hint: "La boucle while continue tant que les deux sont en vie. max(0, pv) évite d'afficher des PV négatifs.",
      },
      {
        id: 4,
        title: "Héritage — la classe Mage",
        description: "Crée une classe Mage qui hérite de Personnage et ajoute un sort magique qui fait le double des dégâts normaux.",
        starterCode: "class Personnage:\n    def __init__(self, nom, pv, force):\n        self.nom = nom\n        self.pv = pv\n        self.force = force\n\n    def attaquer(self, cible):\n        cible.pv -= self.force\n        print(f\"{self.nom} attaque {cible.nom} pour {self.force} dégâts !\")\n\nclass Mage(Personnage):\n    def sort(self, cible):\n        degats = self.force * 2\n        cible.pv -= degats\n        print(f\"{self.nom} lance un sort sur {cible.nom} pour {degats} dégâts magiques !\")\n\nmage = Mage(\"Merlin\", 60, 10)\ndragon = Personnage(\"Dragon\", 80, 15)\n\nmage.attaquer(dragon)\nmage.sort(dragon)\nprint(f\"Dragon PV restants : {dragon.pv}\")\n",
        expectedOutput: "Merlin attaque Dragon pour 10 dégâts !\nMerlin lance un sort sur Dragon pour 20 dégâts magiques !\nDragon PV restants : 50",
        hint: "class Mage(Personnage) signifie que Mage hérite de toutes les méthodes de Personnage. Tu peux appeler mage.attaquer() même si tu ne l'as pas réécrite dans Mage.",
      },
    ],
  },
  {
    id: "analyseur-texte",
    levelId: 5,
    emoji: "🔍",
    title: "L'Analyseur de Texte",
    description: "Analyse des textes comme un data scientist ! Compte les mots, trouve les plus fréquents et travaille avec des collections avancées.",
    color: "from-cyan-500 to-blue-600",
    steps: [
      {
        id: 0,
        title: "Compter les mots",
        description: "Compte le nombre de mots dans une phrase et affiche le résultat.",
        starterCode: "texte = \"Python est un langage de programmation puissant et simple\"\n\nmots = texte.split()\nprint(f\"Nombre de mots : {len(mots)}\")\n",
        expectedOutput: "Nombre de mots : 9",
        hint: "split() découpe le texte en liste de mots. len() compte les éléments.",
      },
      {
        id: 1,
        title: "Fréquence des mots",
        description: "Utilise un dictionnaire pour compter combien de fois chaque mot apparaît dans le texte.",
        starterCode: "from collections import Counter\n\ntexte = \"le chat mange le poisson et le chien mange aussi\"\nmots = texte.split()\nfreq = Counter(mots)\n\nfor mot, count in freq.most_common(3):\n    print(f\"{mot} : {count}x\")\n",
        expectedOutput: "le : 3x\nmange : 2x\nchat : 1x",
        hint: "Counter() compte automatiquement les occurrences. most_common(3) retourne les 3 plus fréquents.",
      },
      {
        id: 2,
        title: "Mots uniques",
        description: "Trouve le nombre de mots uniques (sans doublons) dans le texte.",
        starterCode: "texte = \"le chat mange le poisson et le chien mange aussi\"\nmots = texte.split()\nuniques = set(mots)\nprint(f\"Mots uniques : {len(uniques)}\")\nprint(f\"Mots uniques triés : {sorted(uniques)}\")\n",
        expectedOutput: "Mots uniques : 7\nMots uniques triés : ['aussi', 'chien', 'chat', 'et', 'le', 'mange', 'poisson']",
        hint: "set() élimine les doublons. sorted() trie par ordre alphabétique.",
      },
      {
        id: 3,
        title: "Longueur des phrases",
        description: "Découpe un texte en phrases et calcule la longueur moyenne de chaque phrase (en nombre de mots).",
        starterCode: "texte = \"Python est puissant. Il est simple à apprendre. Les enfants adorent coder. C'est vraiment super !\"\n\nphrase_separateurs = texte.replace(\"!\", \".\").replace(\"?\", \".\")\nphrases = [p.strip() for p in phrase_separateurs.split(\".\") if p.strip()]\n\nprint(f\"Nombre de phrases : {len(phrases)}\")\nfor i, phrase in enumerate(phrases, 1):\n    nb_mots = len(phrase.split())\n    print(f\"  Phrase {i} : {nb_mots} mots\")\n\nmoyenne = sum(len(p.split()) for p in phrases) / len(phrases)\nprint(f\"Longueur moyenne : {moyenne:.1f} mots/phrase\")\n",
        expectedOutput: "Nombre de phrases : 4\n  Phrase 1 : 3 mots\n  Phrase 2 : 5 mots\n  Phrase 3 : 4 mots\n  Phrase 4 : 3 mots\nLongueur moyenne : 3.8 mots/phrase",
        hint: "replace() remplace un caractère par un autre. split(\".\") coupe à chaque point. strip() enlève les espaces en début/fin.",
      },
      {
        id: 4,
        title: "Rapport complet",
        description: "Génère un rapport statistique complet du texte : mots totaux, uniques, phrases, mot le plus long et le plus fréquent.",
        starterCode: "from collections import Counter\n\ntexte = \"le petit chat noir mange le poisson et le grand chien mange aussi\"\nmots = texte.split()\n\nnb_total = len(mots)\nnb_uniques = len(set(mots))\nmot_long = max(mots, key=len)\nmot_frequent = Counter(mots).most_common(1)[0]\n\nprint(\"=== Rapport d'analyse ===\")\nprint(f\"Mots total    : {nb_total}\")\nprint(f\"Mots uniques  : {nb_uniques}\")\nprint(f\"Mot le plus long  : '{mot_long}' ({len(mot_long)} lettres)\")\nprint(f\"Mot le plus fréquent : '{mot_frequent[0]}' ({mot_frequent[1]}x)\")\n",
        expectedOutput: "=== Rapport d'analyse ===\nMots total    : 13\nMots uniques  : 10\nMot le plus long  : 'poisson' (7 lettres)\nMot le plus fréquent : 'le' (3x)",
        hint: "max(mots, key=len) trouve le mot le plus long. most_common(1)[0] retourne un tuple (mot, compte) du mot le plus fréquent.",
      },
    ],
  },
];

const PROGRESS_KEY = "pythonkids_projects_progress";

interface ProjectProgress {
  [projectId: string]: number; // index de la dernière étape complétée + 1
}

export function getProjectsProgress(): ProjectProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as ProjectProgress;
  } catch {
    return {};
  }
}

export function completeProjectStep(projectId: string, stepId: number) {
  const prog = getProjectsProgress();
  prog[projectId] = Math.max(prog[projectId] ?? 0, stepId + 1);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
}

export function getProjectStepsDone(projectId: string): number {
  return getProjectsProgress()[projectId] ?? 0;
}
