"use client";

import { useTranslations, useLocale } from "next-intl";
import { lf } from "@/lib/localize";
import PlayerAvatar from "@/components/PlayerAvatar";

const LEVELS = [
  { level: 0, title: "Débutant",   title_en: "Beginner",   color: "#7dd3fc", desc: "Niveau 0 — Les bases",    desc_en: "Level 0 — The basics" },
  { level: 1, title: "Apprenti",   title_en: "Apprentice",  color: "#6ee7b7", desc: "Niveau 1 — En route",    desc_en: "Level 1 — On track" },
  { level: 2, title: "Codeur",     title_en: "Coder",       color: "#c4b5fd", desc: "Niveau 2 — Maîtrise",    desc_en: "Level 2 — Mastery" },
  { level: 3, title: "Expert",     title_en: "Expert",      color: "#fdba74", desc: "Niveau 3 — Puissance",   desc_en: "Level 3 — Power" },
  { level: 4, title: "Maître",     title_en: "Master",      color: "#fda4af", desc: "Niveau 4 — Domination",  desc_en: "Level 4 — Domination" },
  { level: 5, title: "Légendaire", title_en: "Legendary",   color: "#fde68a", desc: "Niveau 5 — Mythique",    desc_en: "Level 5 — Mythical" },
];

export default function AvatarsPage() {
  const t = useTranslations("Avatars");
  const locale = useLocale();

  return (
    <div className="min-h-screen py-16 px-4"
         style={{ background: "linear-gradient(135deg, #0a0a16 0%, #130a26 40%, #0a1626 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 text-purple-300"
               style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.35)" }}>
            {t("badge")}
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 leading-tight"
              style={{ textShadow: "0 0 40px rgba(168,85,247,0.5)" }}>
            {t("title")}
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LEVELS.map((av) => {
            const { level, color } = av;
            const title = lf(av, "title", locale);
            const desc = lf(av, "desc", locale);
            return (
            <div key={level}
                 className="flex flex-col items-center gap-3 rounded-2xl pt-6 pb-5 px-2 transition-transform hover:scale-105"
                 style={{
                   background: "rgba(255,255,255,0.04)",
                   border: `1px solid ${color}30`,
                   boxShadow: `0 4px 32px ${color}18`,
                 }}>
              <PlayerAvatar username="A" playerLevel={level} />
              <div className="text-center">
                <div className="font-extrabold text-sm tracking-wide" style={{ color }}>{title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">{t("hint")}</p>
        </div>
      </div>
    </div>
  );
}
