import AppHeader from "@/components/AppHeader";
import BugHuntView from "@/components/BugHuntView";

export default function BugHuntPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-4 py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐛</div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
            Chasse aux bugs
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Trouve et corrige les erreurs cachées dans le code Python !
          </p>
        </div>
        <BugHuntView />
      </div>
    </div>
  );
}
