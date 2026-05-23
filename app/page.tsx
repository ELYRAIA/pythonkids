import Link from "next/link";
import { CHALLENGES } from "@/lib/challenges";
import { LEVELS } from "@/lib/levels";
import { LEVELS_DATA } from "@/lib/lessons";
import BadgeDisplay from "@/components/BadgeDisplay";
import AppHeader from "@/components/AppHeader";
import AdventureMap from "@/components/AdventureMap";
import HomeResume from "@/components/HomeResume";
import DailyChallenge from "@/components/DailyChallenge";
import DailyQuests from "@/components/DailyQuests";
import WeeklyQuests from "@/components/WeeklyQuests";
import StreakBanner from "@/components/StreakBanner";
import OnboardingTour from "@/components/OnboardingTour";
import SessionSummary from "@/components/SessionSummary";
import PyodidePreloader from "@/components/PyodidePreloader";
import DailyReward from "@/components/DailyReward";
import HomeBanner from "@/components/HomeBanner";
import HomeCoffresWidget from "@/components/HomeCoffresWidget";
import HomeQuestsWidget from "@/components/HomeQuestsWidget";
import HomeWeeklyWidget from "@/components/HomeWeeklyWidget";
import HomeProgressWidget from "@/components/HomeProgressWidget";
import HomeRankWidget from "@/components/HomeRankWidget";
import HomeRevisionWidget from "@/components/HomeRevisionWidget";
import HomeBattlePassWidget from "@/components/HomeBattlePassWidget";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      {/* Hero */}
      <section className="w-full px-6 py-12 text-center">
        <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          🎉 Pour les 8-18 ans
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
          Apprends Python{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            en t&apos;amusant !
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Des leçons courtes, des défis rigolos, et des projets dont tu seras fier.{" "}
          Rejoins des milliers d&apos;enfants qui apprennent à coder ! 🚀
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/levels/0"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full text-base font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 text-center"
          >
            Commencer l&apos;aventure 🌟
          </Link>
          <Link
            href="/editor"
            className="w-full sm:w-auto bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 border-2 border-purple-200 dark:border-slate-600 px-8 py-3 rounded-full text-base font-bold hover:border-purple-400 dark:hover:border-purple-500 transition-colors text-center"
          >
            Ouvrir l&apos;éditeur 💻
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { value: String(LEVELS.length), label: "niveaux", emoji: "📚" },
            { value: String(Object.values(LEVELS_DATA).reduce((a, l) => a + l.lessons.length, 0)), label: "leçons", emoji: "✏️" },
            { value: String(CHALLENGES.length), label: "défis", emoji: "🎯" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm border border-purple-50 dark:border-slate-700">
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <OnboardingTour />
      <SessionSummary />
      <DailyReward />
      <HomeBanner />

      {/* Progression globale */}
      <HomeProgressWidget />

      {/* Rang XP */}
      <HomeRankWidget />

      {/* Pass de Combat */}
      <HomeBattlePassWidget />

      {/* Révision espacée */}
      <HomeRevisionWidget />

      {/* Coffres en attente */}
      <HomeCoffresWidget />

      {/* Quêtes du jour */}
      <HomeQuestsWidget />

      {/* Quêtes de la semaine */}
      <HomeWeeklyWidget />

      {/* Reprendre + Défi du jour */}
      <HomeResume />
      <StreakBanner />
      <DailyChallenge />
      <DailyQuests />
      <WeeklyQuests />
      <PyodidePreloader />

      {/* Niveaux */}
      <section className="w-full px-6 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center mb-2">
          Ton parcours d&apos;apprentissage
        </h2>
        <p className="text-base text-gray-500 dark:text-slate-400 text-center mb-8">
          Progresse à ton rythme, niveau par niveau
        </p>
        <AdventureMap />
      </section>

      {/* Badges gagnés */}
      <BadgeDisplay />

      {/* Duel + Certificat + Détente */}
      <section className="w-full px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Link href="/duel">
            <div className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center">
              <div className="text-4xl mb-2">⚔️</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Mode Duel</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Affronte un ami en temps réel !</p>
            </div>
          </Link>
          <Link href="/pet">
            <div className="bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-cyan-900 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Mon Robot</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Contrôle-le avec du Python !</p>
            </div>
          </Link>
          <Link href="/certificate">
            <div className="bg-white dark:bg-slate-800 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center">
              <div className="text-4xl mb-2">🎓</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Mon Certificat</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Termine 5 niveaux pour l&apos;obtenir !</p>
            </div>
          </Link>
          <Link href="/detente">
            <div className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center">
              <div className="text-4xl mb-2">🎮</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Espace Détente</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Snake, Memory, Wordle, Flashcards 💎 !</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Défis */}
      <section className="w-full px-6 py-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Défis Python</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
            Résous des défis de code, teste ta logique et gagne des badges !
          </p>
          <Link
            href="/challenges"
            className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-full text-base font-bold hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
          >
            Voir les défis 🎯
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 dark:text-slate-500 text-sm space-y-2">
        <p>🐍 PythonKids — Apprendre à coder, c&apos;est super ! 🚀</p>
        <p>
          <Link href="/parent" className="text-xs text-gray-400 dark:text-slate-600 hover:text-purple-500 transition-colors underline underline-offset-2">
            👨‍👩‍👦 Espace parent
          </Link>
        </p>
      </footer>
    </div>
  );
}
