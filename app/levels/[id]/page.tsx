import { notFound } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { LEVELS_DATA } from "@/lib/lessons";
import LevelLessonsGrid from "@/components/LevelLessonsGrid";

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const level = LEVELS_DATA[id];

  if (!level) notFound();

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="w-full px-6 py-8">
        {/* Titre */}
        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
            {level.emoji}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
            Niveau {level.id} : {level.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {level.lessons.length} leçons · Clique sur une leçon pour commencer !
          </p>
        </div>

        {/* Grille des leçons */}
        <LevelLessonsGrid level={level} />

        {/* Navigation vers niveau suivant */}
        <div className="mt-12 text-center">
          {level.id < 5 ? (
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                Tu as fini le niveau {level.id} ? Bravo ! 🎉
              </p>
              <Link
                href={`/levels/${level.id + 1}`}
                className={`bg-gradient-to-r ${level.color} text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg`}
              >
                Passer au niveau {level.id + 1} →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-5xl mb-4">🏆</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Félicitations !</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                Tu as terminé tous les niveaux de PythonKids — tu es un vrai Maître Python !
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/certificate"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  🎓 Obtenir mon certificat
                </Link>
                <Link
                  href="/leaderboard"
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Voir le classement 🏅
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
