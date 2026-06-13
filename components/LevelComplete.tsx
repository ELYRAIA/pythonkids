"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { lf } from "@/lib/localize";
import { LEVELS } from "@/lib/levels";
import Confetti from "./Confetti";

interface LevelCompleteProps {
  levelId: number;
  totalLessons: number;
  onClose: () => void;
}

export default function LevelComplete({ levelId, totalLessons, onClose }: LevelCompleteProps) {
  const t = useTranslations("LevelComplete");
  const locale = useLocale();
  const level = LEVELS.find((l) => l.id === levelId);
  const nextLevel = LEVELS.find((l) => l.id === levelId + 1);
  const isLast = !nextLevel;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Confetti active={true} />

      <div
        className="relative rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e1040 0%, #2d1b69 50%, #1a0533 100%)",
          border: "1px solid rgba(167,139,250,0.4)",
          animation: "badge-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px"
             style={{ background: "linear-gradient(to right, transparent, rgba(167,139,250,0.8), transparent)" }} />

        {/* Sparkles décoratifs */}
        {["10%,15%", "85%,20%", "50%,8%", "20%,75%", "80%,80%"].map((pos, i) => (
          <div key={i} className="absolute text-yellow-300 text-xs pointer-events-none"
               style={{ left: pos.split(",")[0], top: pos.split(",")[1], animation: `badge-glow ${1.5 + i * 0.3}s ease-in-out infinite` }}>
            ✦
          </div>
        ))}

        <div className="relative z-10">
          {/* Trophy animé */}
          <div className="text-8xl mb-3 select-none"
               style={{ filter: "drop-shadow(0 0 20px rgba(250,204,21,0.6))", animation: "streak-pulse 2s ease-in-out infinite" }}>
            🏆
          </div>

          <div className="text-4xl mb-2">{level?.emoji}</div>

          <h1 className="text-3xl font-extrabold text-white mb-1"
              style={{ textShadow: "0 2px 20px rgba(167,139,250,0.6)" }}>
            {t("title")}
          </h1>
          <p className="text-purple-300 text-base font-semibold mb-1">{level ? lf(level, "name", locale) : ""}</p>
          <p className="text-purple-400 text-sm mb-4">
            {totalLessons > 1 ? t("summary_plural", { n: totalLessons }) : t("summary", { n: totalLessons })}
          </p>

          {/* Étoiles */}
          <div className="flex justify-center gap-1 mb-6 text-2xl">
            {["⭐", "⭐", "⭐"].map((s, i) => (
              <span key={i} style={{ animation: `badge-pop 0.3s ${0.2 + i * 0.15}s ease-out both` }}>{s}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {!isLast ? (
              <Link
                href={`/levels/${levelId + 1}`}
                onClick={onClose}
                className="block w-full text-white px-6 py-3 rounded-full font-extrabold hover:opacity-90 transition-opacity shadow-lg text-base"
                style={{ background: "linear-gradient(to right, #a78bfa, #f472b6)" }}
              >
                {t("next_level", { id: levelId + 1, emoji: nextLevel?.emoji ?? "" })}
              </Link>
            ) : (
              <Link
                href="/certificate"
                onClick={onClose}
                className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-extrabold hover:opacity-90 transition-opacity shadow-lg"
              >
                {t("get_certificate")}
              </Link>
            )}
            <Link
              href="/challenges"
              onClick={onClose}
              className="block w-full px-6 py-3 rounded-full font-bold transition-colors text-purple-200 hover:text-white"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              {t("take_challenges")}
            </Link>
            <button onClick={onClose} className="text-purple-400 text-sm hover:text-purple-200 transition-colors w-full py-1">
              {t("continue_here")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
