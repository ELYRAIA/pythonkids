import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-sm w-full">
        {/* Serpent perdu */}
        <div className="text-8xl mb-4 select-none" style={{ filter: "drop-shadow(0 8px 24px rgba(147,51,234,0.3))" }}>
          🐍
        </div>
        <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-3">
          Page introuvable !
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          Le serpent Python a cherché cette page partout… mais elle n&apos;existe pas !
          Tu t&apos;es peut-être perdu dans une boucle infinie ? 🤔
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
          >
            🏠 Retour à l&apos;accueil
          </Link>
          <Link
            href="/levels/0"
            className="block w-full bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 border-2 border-purple-200 dark:border-slate-600 px-6 py-3 rounded-full text-sm font-bold hover:border-purple-400 transition-colors"
          >
            📚 Commencer à apprendre
          </Link>
          <Link
            href="/challenges"
            className="block w-full text-gray-400 dark:text-slate-500 text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
          >
            🎯 Voir les défis
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-300 dark:text-slate-600">
          Erreur 404 — Page non trouvée
        </p>
      </div>
    </div>
  );
}
