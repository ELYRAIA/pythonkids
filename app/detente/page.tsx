import AppHeader from "@/components/AppHeader";
import SnakeGame from "@/components/SnakeGame";
import MemoryGame from "@/components/MemoryGame";
import WordlePython from "@/components/WordlePython";
import FlashcardGame from "@/components/FlashcardGame";
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

        {/* Snake */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🐍</span>
            <h2 className="font-extrabold text-gray-800 dark:text-white">Snake Python</h2>
            <span className="ml-auto text-xs text-gray-400 dark:text-slate-500">Score → 💎</span>
          </div>
          <SnakeGame />
        </div>

        {/* Memory */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-indigo-100 dark:border-slate-700 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🃏</span>
            <h2 className="font-extrabold text-gray-800 dark:text-white">Memory Python</h2>
            <span className="ml-auto text-xs text-gray-400 dark:text-slate-500">Paires → 💎</span>
          </div>
          <MemoryGame />
        </div>

        {/* Wordle */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-green-100 dark:border-slate-700 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🟩</span>
            <div>
              <h2 className="font-extrabold text-gray-800 dark:text-white">Wordle Python</h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">Devine le mot Python du jour · 6 essais · +💎</p>
            </div>
          </div>
          <WordlePython />
        </div>

        {/* Flashcards */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-indigo-100 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🃏</span>
            <div>
              <h2 className="font-extrabold text-gray-800 dark:text-white">Flashcards Python</h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">10 questions · 15s chrono · +💎 par bonne réponse</p>
            </div>
          </div>
          <FlashcardGame />
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
