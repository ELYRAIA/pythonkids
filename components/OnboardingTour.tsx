"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    emoji: "🐍",
    title: "Bienvenue sur PythonKids !",
    desc: "Apprends Python pas à pas avec des leçons courtes, des défis rigolos et des badges à débloquer. C'est parti !",
  },
  {
    emoji: "📚",
    title: "12 niveaux t'attendent",
    desc: "Du niveau Premiers pas (8 ans) jusqu'au niveau Maître Python. Chaque niveau te donne un badge et un coffre de récompenses !",
  },
  {
    emoji: "⚔️",
    title: "Le Pass de Combat",
    desc: "En apprenant, tu gagnes de l'XP pour monter de niveau dans le Pass de Combat ! À chaque niveau : gemmes 💎, coffres ou objets exclusifs à réclamer.",
  },
  {
    emoji: "🎯",
    title: "Quêtes & Défis",
    desc: "Des quêtes quotidiennes et hebdomadaires t'attendent sur la page d'accueil. Réussis des défis pour gagner des gemmes 💎 et des badges !",
  },
  {
    emoji: "🔥",
    title: "Reviens chaque jour !",
    desc: "Ta progression est sauvegardée automatiquement. Reviens chaque jour pour maintenir ta série de jours consécutifs et gagner des bonus !",
  },
];

const KEY = "pythonkids_onboarding_v1";

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const done = localStorage.getItem(KEY);
      const hasUser = localStorage.getItem("pythonkids_username");
      if (hasUser && !done) setVisible(true);
    };
    check();
    window.addEventListener("pythonkids:progress", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("pythonkids:progress", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  const finish = () => {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else finish();
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl p-7 max-w-sm w-full shadow-2xl text-center"
        style={{ animation: "badge-pop 0.3s ease-out" }}
      >
        <div className="text-5xl mb-3 select-none">{current.emoji}</div>
        <h2 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">{current.title}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-5">{current.desc}</p>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-purple-500" : "w-2 bg-gray-200 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-md"
        >
          {isLast ? "C'est parti ! 🚀" : "Suivant →"}
        </button>

        {!isLast && (
          <button
            onClick={finish}
            className="mt-3 w-full text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors py-1"
          >
            Passer le tutoriel
          </button>
        )}
      </div>
    </div>
  );
}
