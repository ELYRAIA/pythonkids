"""Add coding exercises to lessons that currently have none."""
import sys

with open('lib/lessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

def add_exercise(content, title, exercise_lines):
    """Insert an exercise block into the lesson with the given title."""
    marker = f'title: "{title}"'
    pos = content.find(marker)
    if pos == -1:
        print(f'  SKIP (not found): {title}', file=sys.stderr)
        return content

    # Find the end of this lesson section (just before the next title or end of lessons array)
    next_marker_pos = content.find('title: "', pos + len(marker))
    section_end = next_marker_pos if next_marker_pos != -1 else len(content)
    section = content[pos:section_end]

    if 'exercise:' in section:
        print(f'  SKIP (already has exercise): {title}', file=sys.stderr)
        return content

    # Find the closing `      },` of this lesson (exactly 6-space indent)
    closing = '\n      },'
    close_pos = section.rfind(closing)
    if close_pos == -1:
        print(f'  SKIP (no closing found): {title}', file=sys.stderr)
        return content

    insert_at = pos + close_pos  # position of the \n before `      },`

    exercise_block = '\n' + exercise_lines
    content = content[:insert_at] + exercise_block + content[insert_at:]
    print(f'  OK: {title}')
    return content


# ── Level 2 ────────────────────────────────────────────────────────────

content = add_exercise(content, "Les listes", """\
        exercise: {
          instruction: "Crée une liste animaux avec [\\\"chat\\\", \\\"chien\\\", \\\"lapin\\\"] et affiche chaque animal sur une ligne.",
          starterCode: "animaux = [\\\"chat\\\", \\\"chien\\\", \\\"lapin\\\"]\\n# Affiche chaque animal avec une boucle\\n",
          expectedOutput: "chat\\nchien\\nlapin",
          hints: [
            "Utilise une boucle for pour parcourir la liste.",
            "Dans la boucle : for animal in animaux: puis print(animal)",
            "for animal in animaux:\\n    print(animal)",
          ],
        },""")

content = add_exercise(content, "Les fonctions", """\
        exercise: {
          instruction: "Écris une fonction double(n) qui retourne n × 2. Affiche double(7).",
          starterCode: "# Crée la fonction double\\n",
          expectedOutput: "14",
          hints: [
            "Une fonction se crée avec def nom(paramètre): et le corps indenté.",
            "Utilise return pour renvoyer la valeur calculée.",
            "def double(n):\\n    return n * 2\\nprint(double(7))",
          ],
        },""")

content = add_exercise(content, "Boucle while et logique", """\
        exercise: {
          instruction: "Affiche 'Accès autorisé' si age >= 12 ET has_code est True, sinon 'Refusé'.",
          starterCode: "age = 14\\nhas_code = True\\n# Affiche le bon message\\n",
          expectedOutput: "Accès autorisé",
          hints: [
            "Utilise une condition if avec l'opérateur and entre les deux conditions.",
            "if age >= 12 and has_code: ...",
            "if age >= 12 and has_code:\\n    print(\\\"Accès autorisé\\\")\\nelse:\\n    print(\\\"Refusé\\\")",
          ],
        },""")

content = add_exercise(content, "Les tuples", """\
        exercise: {
          instruction: "Crée un tuple position avec (3, 7) et affiche : x=3, y=7",
          starterCode: "# Crée le tuple et affiche les coordonnées\\n",
          expectedOutput: "x=3, y=7",
          hints: [
            "Un tuple se crée avec des parenthèses : (valeur1, valeur2)",
            "Accède aux éléments avec position[0] pour x et position[1] pour y.",
            "position = (3, 7)\\nprint(f\\\"x={position[0]}, y={position[1]}\\\")",
          ],
        },""")

# ── Level 3 ────────────────────────────────────────────────────────────

content = add_exercise(content, "Gestion des erreurs", """\
        exercise: {
          instruction: "Utilise try/except pour afficher 'Erreur : division impossible' si diviseur vaut 0.",
          starterCode: "diviseur = 0\\nnombre = 10\\n# Protège la division avec try/except\\n",
          expectedOutput: "Erreur : division impossible",
          hints: [
            "Utilise try: pour essayer le code qui peut échouer.",
            "Dans except ZeroDivisionError: mets le message d'erreur.",
            "try:\\n    print(nombre / diviseur)\\nexcept ZeroDivisionError:\\n    print(\\\"Erreur : division impossible\\\")",
          ],
        },""")

content = add_exercise(content, "Le débogage", """\
        exercise: {
          instruction: "Calcule et affiche la moyenne de [12, 14, 16] avec sum() et len().",
          starterCode: "notes = [12, 14, 16]\\n# Calcule et affiche la moyenne\\n",
          expectedOutput: "14.0",
          hints: [
            "La moyenne = somme / nombre de valeurs.",
            "sum(notes) donne la somme, len(notes) le nombre d'éléments.",
            "print(sum(notes) / len(notes))",
          ],
        },""")

content = add_exercise(content, "Compréhensions de listes", """\
        exercise: {
          instruction: "Crée une liste des cubes de 1 à 5 avec une compréhension de liste.",
          starterCode: "# Crée la liste des cubes de 1 à 5\\n",
          expectedOutput: "[1, 8, 27, 64, 125]",
          hints: [
            "Une compréhension de liste s'écrit : [expression for i in range(...)]",
            "Pour les cubes, l'expression est i ** 3.",
            "cubes = [i ** 3 for i in range(1, 6)]\\nprint(cubes)",
          ],
        },""")

content = add_exercise(content, "Les ensembles (sets)", """\
        exercise: {
          instruction: "Supprime les doublons de [3, 1, 4, 1, 5, 9, 2, 6, 5, 3] et affiche-les triés.",
          starterCode: "nombres = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\\n# Supprime les doublons et affiche en ordre\\n",
          expectedOutput: "[1, 2, 3, 4, 5, 6, 9]",
          hints: [
            "Convertis la liste en set pour supprimer automatiquement les doublons.",
            "Utilise list(set(...)) pour reconvertir en liste, puis sorted() pour trier.",
            "print(sorted(list(set(nombres))))",
          ],
        },""")

# ── Level 4 ────────────────────────────────────────────────────────────

content = add_exercise(content, "Les modules Python", """\
        exercise: {
          instruction: "Importe math et affiche la racine carrée de 225.",
          starterCode: "import math\\n# Calcule et affiche la racine carrée de 225\\n",
          expectedOutput: "15.0",
          hints: [
            "Le module math contient la fonction sqrt() pour la racine carrée.",
            "Utilise math.sqrt(valeur).",
            "print(math.sqrt(225))",
          ],
        },""")

content = add_exercise(content, "Algorithmes de tri", """\
        exercise: {
          instruction: "Trie [5, 2, 8, 1, 9, 3] dans l'ordre décroissant avec sorted() et affiche-le.",
          starterCode: "nombres = [5, 2, 8, 1, 9, 3]\\n# Trie dans l'ordre décroissant\\n",
          expectedOutput: "[9, 8, 5, 3, 2, 1]",
          hints: [
            "sorted() accepte un paramètre reverse=True pour l'ordre décroissant.",
            "sorted(liste, reverse=True) trie du plus grand au plus petit.",
            "print(sorted(nombres, reverse=True))",
          ],
        },""")

content = add_exercise(content, "Lambda, map et filter", """\
        exercise: {
          instruction: "Utilise map et une lambda pour tripler chaque nombre de [1, 2, 3, 4, 5].",
          starterCode: "nombres = [1, 2, 3, 4, 5]\\n# Utilise map et lambda pour tripler\\n",
          expectedOutput: "[3, 6, 9, 12, 15]",
          hints: [
            "map(fonction, liste) applique la fonction à chaque élément.",
            "Utilise une lambda : lambda x: x * 3",
            "print(list(map(lambda x: x * 3, nombres)))",
          ],
        },""")

content = add_exercise(content, "La récursivité", """\
        exercise: {
          instruction: "Écris une fonction récursive somme(n) qui calcule 1+2+...+n. Affiche somme(5).",
          starterCode: "# Écris la fonction somme récursive\\n",
          expectedOutput: "15",
          hints: [
            "Une fonction récursive s'appelle elle-même avec un cas de base pour s'arrêter.",
            "somme(n) = n + somme(n-1), avec somme(0) = 0 comme cas de base.",
            "def somme(n):\\n    if n <= 0:\\n        return 0\\n    return n + somme(n - 1)\\nprint(somme(5))",
          ],
        },""")

# ── Level 5 ────────────────────────────────────────────────────────────

content = add_exercise(content, "Le module collections", """\
        exercise: {
          instruction: "Utilise Counter pour compter les lettres de 'banana' et affiche le nombre de 'a'.",
          starterCode: "from collections import Counter\\nmot = 'banana'\\n# Compte les lettres et affiche le nombre de 'a'\\n",
          expectedOutput: "3",
          hints: [
            "Counter(mot) crée un compteur qui compte automatiquement chaque lettre.",
            "Accède à la valeur d'une clé comme un dictionnaire : compteur['a']",
            "compteur = Counter(mot)\\nprint(compteur['a'])",
          ],
        },""")

content = add_exercise(content, "Les expressions régulières", """\
        exercise: {
          instruction: "Utilise re.findall pour trouver tous les nombres dans la phrase.",
          starterCode: "import re\\ntexte = \\'J\\'ai 42 pommes, 100 bananes et 7 kiwis\\'\\n# Trouve tous les nombres\\n",
          expectedOutput: "[\\'42\\', \\'100\\', \\'7\\']",
          hints: [
            "re.findall(pattern, texte) retourne une liste de toutes les correspondances.",
            "Le pattern \\\\\\\\d+ correspond à un ou plusieurs chiffres.",
            "print(re.findall(r\\'\\\\\\\\d+\\', texte))",
          ],
        },""")

content = add_exercise(content, "Manipulation avancée des données", """\
        exercise: {
          instruction: "Trie les élèves par score croissant et affiche uniquement leurs noms.",
          starterCode: "eleves = [\\n    {\\\"nom\\\": \\\"Alice\\\", \\\"score\\\": 85},\\n    {\\\"nom\\\": \\\"Bob\\\",   \\\"score\\\": 72},\\n    {\\\"nom\\\": \\\"Charlie\\\", \\\"score\\\": 95},\\n]\\n# Trie par score et affiche les noms\\n",
          expectedOutput: "Bob\\nAlice\\nCharlie",
          hints: [
            "Utilise sorted() avec key= pour préciser le critère de tri.",
            "key=lambda e: e['score'] trie par la valeur du champ score.",
            "for e in sorted(eleves, key=lambda e: e['score']):\\n    print(e['nom'])",
          ],
        },""")

with open('lib/lessons.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
