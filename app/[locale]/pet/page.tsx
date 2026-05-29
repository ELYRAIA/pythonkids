"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import AppHeader from "@/components/AppHeader";
import PetRobot from "@/components/PetRobot";
import PythonEditor from "@/components/PythonEditor";
import { getPyodide } from "@/lib/pyodide";
import { getPetState, savePetState, applyPetAction, type PetState } from "@/lib/pet";
import { SHOP_SKINS } from "@/lib/shop";

const DEFAULT_CODE = `# 🤖 Contrôle ton robot avec ces fonctions :
#
#   nourrir(50)        → donne à manger  (+faim)
#   jouer("balle")     → fais-le jouer   (+humeur)
#   dormir(8)          → fais-le dormir  (+énergie)
#   danser()           → fais-le danser  🕺
#   etat()             → affiche ses stats
#
# ↓ Essaie d'utiliser des variables, boucles, fonctions !

nourrir(50)
jouer("balle")
etat()`;

function StatBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-300 w-12 text-right">{value}/100</span>
    </div>
  );
}

const TIPS = [
  { emoji: "📦", titleKey: "tips_variables", code: `repas = 40\nnourrir(repas)\njouer("foot")` },
  { emoji: "🔁", titleKey: "tips_for_loop", code: `for i in range(3):\n    jouer("balle")\netat()` },
  { emoji: "🔧", titleKey: "tips_function", code: `def soiree():\n    nourrir(60)\n    danser()\n    dormir(7)\nsoiree()` },
];

export default function PetPage() {
  const t = useTranslations("Pet");
  const [state, setState] = useState<PetState | null>(null);
  const stateRef = useRef<PetState | null>(null);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [skinGradient, setSkinGradient] = useState("from-blue-500 to-cyan-400");
  const [pyodideReady, setPyodideReady] = useState(false);

  useEffect(() => {
    const s = getPetState();
    setState(s);
    stateRef.current = s;

    const skinId = localStorage.getItem("pythonkids_equipped_skin");
    if (skinId) {
      const skin = SHOP_SKINS.find((sk) => sk.id === skinId);
      if (skin?.gradient) setSkinGradient(skin.gradient);
    }
  }, []);

  useEffect(() => {
    getPyodide().then((py) => {
      window.petAction = (action: string, value: unknown) => {
        setState((prev) => {
          if (!prev) return prev;
          const next = applyPetAction(prev, action, value);
          stateRef.current = next;
          savePetState(next);

          if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
          actionTimeoutRef.current = setTimeout(() => {
            setState((curr) => {
              if (!curr) return curr;
              const reset: PetState = {
                ...curr,
                action: curr.faim < 20 || curr.humeur < 20 ? "triste" : "idle",
              };
              stateRef.current = reset;
              savePetState(reset);
              return reset;
            });
          }, 2500);

          return next;
        });
      };

      window.petGetStats = () => ({
        faim: stateRef.current?.faim ?? 60,
        humeur: stateRef.current?.humeur ?? 70,
        energie: stateRef.current?.energie ?? 80,
      });

      py.runPython(`
import js

def nourrir(quantite=50):
    js.petAction("nourrir", int(quantite))
    print(f"🍕 Robot nourri (+{int(quantite)} pts de faim)")

def jouer(jeu="balle"):
    js.petAction("jouer", str(jeu))
    print(f"⚽ Robot joue à {jeu} !")

def dormir(heures=8):
    js.petAction("dormir", int(heures))
    print(f"💤 Robot dort {int(heures)}h (+{min(100, int(heures)*10)} énergie)")

def danser():
    js.petAction("danser", "")
    print("🕺 Robot danse !")

def etat():
    s = js.petGetStats()
    print(f"🤖 Faim: {int(s.faim)}/100 | Humeur: {int(s.humeur)}/100 | Énergie: {int(s.energie)}/100")
`);

      setPyodideReady(true);
    });
  }, []);

  const handleReset = () => {
    const fresh: PetState = {
      nom: state?.nom ?? "Pixel",
      faim: 60, humeur: 70, energie: 80, action: "idle",
    };
    setState(fresh);
    stateRef.current = fresh;
    savePetState(fresh);
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <AppHeader />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {t("title").split(" ").slice(0, 2).join(" ")}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t("title").split(" ").slice(2).join(" ")}
            </span>
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Robot + stats panel */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <PetRobot state={state} skinGradient={skinGradient} />

            {/* Stats */}
            <div className="mt-4 space-y-3">
              <StatBar
                label={t("stat_hunger")}
                value={state.faim}
                colorClass={state.faim < 20 ? "bg-red-500" : state.faim < 50 ? "bg-yellow-500" : "bg-green-500"}
              />
              <StatBar
                label={t("stat_mood")}
                value={state.humeur}
                colorClass={state.humeur < 20 ? "bg-red-500" : state.humeur < 50 ? "bg-yellow-500" : "bg-blue-500"}
              />
              <StatBar
                label={t("stat_energy")}
                value={state.energie}
                colorClass={state.energie < 20 ? "bg-red-500" : state.energie < 50 ? "bg-yellow-500" : "bg-purple-500"}
              />
            </div>

            {/* Name + reset */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{t("name_label")}</span>
                <input
                  type="text"
                  value={state.nom}
                  maxLength={12}
                  onChange={(e) => {
                    const next = { ...state, nom: e.target.value };
                    setState(next);
                    stateRef.current = next;
                    savePetState(next);
                  }}
                  className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline"
              >
                {t("reset_button")}
              </button>
            </div>

            <p className="mt-4 text-[11px] text-gray-600 text-center">
              {t("shop_note", { link: <a href="/shop" className="text-cyan-500 hover:underline">{t("shop_link")}</a> })}
            </p>
          </div>

          {/* Code editor panel */}
          <div className="flex flex-col gap-3">
            <div
              className={`text-xs rounded-xl px-4 py-2.5 border ${
                pyodideReady
                  ? "bg-green-950/30 border-green-800/40 text-green-400"
                  : "bg-yellow-950/30 border-yellow-800/40 text-yellow-400 animate-pulse"
              }`}
            >
              {pyodideReady ? t("ready") : t("loading")}
            </div>
            <PythonEditor defaultCode={DEFAULT_CODE} height="380px" storageKey="pet" />
          </div>
        </div>

        {/* Code tips */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIPS.map(({ emoji, titleKey, code }) => (
            <div key={titleKey} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
              <div className="font-bold text-white text-sm mb-2">
                {emoji} {t(titleKey as "tips_variables" | "tips_for_loop" | "tips_function")}
              </div>
              <pre className="text-xs text-cyan-300 bg-slate-900/60 rounded-lg p-3 font-mono leading-relaxed whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
