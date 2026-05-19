"use client";

import { useEffect, useRef, useState } from "react";

const EMOJIS = ["🎉", "⭐", "✨", "🌟", "🎊", "💫", "🏆", "🎯", "🐍", "🚀"];

interface Particle {
  id: number;
  emoji: string;
  tx: number;
  ty: number;
  rot: number;
  sc: number;
  dur: number;
  delay: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    const list: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      tx: (Math.random() - 0.5) * 500,
      ty: -(Math.random() * 350 + 80),
      rot: (Math.random() - 0.5) * 720,
      sc: 0.4 + Math.random() * 0.8,
      dur: 0.7 + Math.random() * 0.8,
      delay: Math.random() * 0.3,
    }));
    setParticles(list);

    timerRef.current = setTimeout(() => setParticles([]), 2500);
  }, [active]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] flex items-center justify-center">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-2xl select-none"
          style={{
            animation: `confetti-fly ${p.dur}s ease-out ${p.delay}s forwards`,
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            "--rot": `${p.rot}deg`,
            "--sc": p.sc,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
