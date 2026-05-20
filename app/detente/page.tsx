import AppHeader from "@/components/AppHeader";
import SnakeGame from "@/components/SnakeGame";
import Link from "next/link";

export default function DetentePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="w-full px-6 py-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
            ← Accueil
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            🎮 Espace Détente
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Une pause méritée — joue et gagne des 💎 !
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700 p-6 shadow-sm">
          <SnakeGame />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/levels/0"
            className="text-sm text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            Retour aux leçons 📚
          </Link>
        </div>
      </div>
    </div>
  );
}
