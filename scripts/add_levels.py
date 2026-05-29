"""Append level 6 and 7 lesson data to lib/lessons.ts."""

LEVEL6 = r"""  "6": {
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
"""

LEVEL7 = r'''  "7": {
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
'''

with open('lib/lessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the final closing `};` with the new levels + `};`
if not content.rstrip().endswith('};'):
    print('ERROR: unexpected file ending')
    exit(1)

# Find the last `};` and insert before it
last_close = content.rfind('};')
new_content = content[:last_close] + LEVEL6 + LEVEL7 + '};'

with open('lib/lessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done! Levels 6 and 7 added to lessons.ts')
