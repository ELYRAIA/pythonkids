"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Badge } from "@/lib/progress";
import Confetti from "./Confetti";

interface Props {
  badge: Badge | null;
  onDismiss: () => void;
}

const SPARKLES = ["⭐", "✨", "💫", "🌟", "⚡", "🎊", "🎉", "💥"];

export default function BadgeCelebration({ badge, onDismiss }: Props) {
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  const [phase, setPhase] = useState<"hidden" | "in" | "idle" | "out">("hidden");
  const [confetti, setConfetti] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const burst = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 100);
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    setPhase("out");
    const t = setTimeout(() => {
      setPhase("hidden");
      setCurrentBadge(null);
      onDismiss();
    }, 400);
    timersRef.current.push(t);
  }, [onDismiss]);

  useEffect(() => {
    if (!badge) return;
    clearTimers();
    setCurrentBadge(badge);
    setPhase("in");
    burst();
    const t1 = setTimeout(() => setPhase("idle"), 650);
    const t2 = setTimeout(burst, 900);
    const t3 = setTimeout(burst, 1800);
    const t4 = setTimeout(dismiss, 5000);
    timersRef.current = [t1, t2, t3, t4];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badge]);

  useEffect(() => () => clearTimers(), []);

  if (phase === "hidden" || !currentBadge) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center cursor-pointer ${
          phase === "in" ? "badge-overlay-in" : phase === "out" ? "badge-overlay-out" : ""
        }`}
        onClick={dismiss}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className={`relative z-10 ${phase === "in" ? "badge-card-in" : phase === "out" ? "badge-card-out" : ""}`}>
          {/* Étoiles qui explosent depuis le centre */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {SPARKLES.map((s, i) => (
              <div
                key={i}
                className="badge-sparkle-wrapper"
                style={{ transform: `rotate(${i * 45}deg)` }}
              >
                <span className="badge-sparkle-fly text-xl block">{s}</span>
              </div>
            ))}
          </div>

          <div className={`bg-gradient-to-br ${currentBadge.color} rounded-3xl px-10 py-8 shadow-2xl text-white text-center max-w-sm mx-4 relative overflow-hidden`}>
            {/* Reflet lumineux */}
            <div className="badge-shine-overlay absolute inset-0 pointer-events-none" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75 mb-4">🎉 Nouveau badge !</p>
            <div className="badge-emoji-anim text-8xl mb-5 inline-block">{currentBadge.emoji}</div>
            <h2 className="text-3xl font-extrabold mb-2">{currentBadge.name}</h2>
            <p className="text-sm opacity-90 leading-relaxed">{currentBadge.desc}</p>
            <p className="text-xs opacity-50 mt-5">Clique pour continuer</p>
          </div>
        </div>
      </div>

      <Confetti active={confetti} />
    </>
  );
}
