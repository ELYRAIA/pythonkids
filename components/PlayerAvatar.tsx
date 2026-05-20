"use client";
import React, { useState } from "react";

const SKIN_GRADIENTS = [
  "from-sky-200 via-sky-300 to-sky-500",
  "from-teal-200 via-teal-300 to-emerald-600",
  "from-violet-300 via-violet-400 to-purple-700",
  "from-amber-300 via-amber-400 to-orange-600",
  "from-rose-300 via-rose-400 to-pink-700",
  "from-yellow-200 via-amber-300 to-orange-500",
];

const IRIS = [
  { top: "#7dd3fc", bot: "#0369a1" },
  { top: "#6ee7b7", bot: "#065f46" },
  { top: "#c4b5fd", bot: "#4c1d95" },
  { top: "#fdba74", bot: "#9a3412" },
  { top: "#fda4af", bot: "#9d174d" },
  { top: "#fde68a", bot: "#92400e" },
];

// paddingTop for face content (pushes face below hair band)
const HAIR_PT = [10, 24, 28, 22, 24, 24];

const HATS: (string | null)[] = [null, "🧢", "🎩", "⛑️", "👑", "✨"];
const CORNER_BADGES: (string | null)[] = [null, "⭐", "🚀", "🔥", "💎", "👑"];
const NECK_ITEMS: (string | null)[] = [null, null, "🔮", "⚔️", "🛡️", "💫"];

const GLOW_CLASSES = [
  "",
  "avatar-glow-yellow",
  "avatar-glow-blue",
  "avatar-glow-purple avatar-glow-pulse",
  "avatar-glow-pink avatar-glow-pulse",
  "avatar-glow-rainbow avatar-glow-pulse",
];

const AURA_BG = [
  null,
  "rgba(251,191,36,0.35)",
  "rgba(96,165,250,0.35)",
  "rgba(168,85,247,0.38)",
  "rgba(236,72,153,0.38)",
  "rgba(250,204,21,0.45)",
];

const PARTICLES: Array<Array<{ e: string; cls: string }>> = [
  [],
  [],
  [],
  [{ e: "✨", cls: "avatar-particle-tr" }, { e: "⭐", cls: "avatar-particle-bl" }],
  [{ e: "💫", cls: "avatar-particle-t" }, { e: "✨", cls: "avatar-particle-r" }, { e: "⭐", cls: "avatar-particle-bl" }],
  [{ e: "🌟", cls: "avatar-particle-t" }, { e: "✨", cls: "avatar-particle-tr" }, { e: "💫", cls: "avatar-particle-r" }, { e: "⭐", cls: "avatar-particle-bl" }, { e: "⚡", cls: "avatar-particle-l" }],
];

const FACE = 112;

interface Props {
  username: string;
  playerLevel: number;
  skinGradient?: string;
  hairColor?: string;
  equippedCosmeticEmoji?: string;
}

export default function PlayerAvatar({ username, playerLevel, skinGradient, hairColor, equippedCosmeticEmoji }: Props) {
  const letter = username ? username[0].toUpperCase() : "?";
  const level = Math.min(playerLevel, 5);
  const gradient = skinGradient ?? SKIN_GRADIENTS[level];
  const hat = HATS[level];
  const badge = CORNER_BADGES[level];
  const neckItem = NECK_ITEMS[level];
  const iris = IRIS[level];
  const [hovered, setHovered] = useState(false);

  const W = 148;
  const faceTop = hat ? 42 : 14;
  const H = faceTop + FACE + 30;
  const faceLeft = (W - FACE) / 2;

  return (
    <div
      className={`relative mx-auto mb-3 cursor-pointer ${level === 5 ? "avatar-legendary" : ""} ${hovered ? "avatar-dance" : "avatar-float"}`}
      style={{ width: W, height: H }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* Aura blur */}
      {AURA_BG[level] && (
        <div className="absolute rounded-full blur-2xl pointer-events-none"
             style={{ width: FACE + 44, height: FACE + 44, top: faceTop - 22, left: faceLeft - 22, background: AURA_BG[level]!, opacity: 0.65 }} />
      )}

      {/* Rotating rings */}
      {level >= 2 && (
        <div className="absolute rounded-full border-2 border-dashed border-white/40 avatar-spin-slow"
             style={{ width: FACE + 22, height: FACE + 22, top: faceTop - 11, left: faceLeft - 11 }} />
      )}
      {level >= 3 && (
        <div className="absolute rounded-full border border-white/25 avatar-spin-reverse"
             style={{ width: FACE + 38, height: FACE + 38, top: faceTop - 19, left: faceLeft - 19 }} />
      )}
      {level === 5 && (
        <div className="absolute rounded-full avatar-rainbow-ring avatar-spin-medium"
             style={{ width: FACE + 56, height: FACE + 56, top: faceTop - 28, left: faceLeft - 28 }} />
      )}

      {/* Hat */}
      {hat && (
        <div className="absolute z-30 select-none drop-shadow-lg flex items-center justify-center text-4xl"
             style={{ top: 0, left: 0, right: 0, height: 42, filter: level >= 4 ? "drop-shadow(0 0 8px gold)" : undefined,
                      animation: level === 5 ? "avatar-badge-bounce-anim 3s ease-in-out infinite" : undefined }}>
          {hat}
        </div>
      )}

      {/* Face circle */}
      <div className={`absolute rounded-full bg-gradient-to-br ${gradient} z-10 ${GLOW_CLASSES[level]} overflow-hidden`}
           style={{ width: FACE, height: FACE, top: faceTop, left: faceLeft }}>

        {/* Inner hair */}
        <InnerHair level={level} colorOverride={hairColor} />

        {/* 3D lighting */}
        <div className="absolute pointer-events-none"
             style={{ top: 10, left: 14, width: 50, height: 50, background: "rgba(255,255,255,0.13)", borderRadius: "50%", filter: "blur(18px)" }} />
        <div className="absolute pointer-events-none"
             style={{ top: 13, left: 18, width: 30, height: 30, background: "rgba(255,255,255,0.28)", borderRadius: "50%" }} />
        <div className="absolute pointer-events-none"
             style={{ top: 15, left: 22, width: 14, height: 14, background: "rgba(255,255,255,0.55)", borderRadius: "50%" }} />

        {/* Rim shadow bottom */}
        <div className="absolute pointer-events-none"
             style={{ bottom: 0, left: 0, right: 0, height: 28, background: "rgba(0,0,0,0.10)", borderRadius: "0 0 50% 50%" }} />

        {/* Cheeks */}
        {level <= 2 && (
          <>
            <div className="absolute pointer-events-none"
                 style={{ bottom: 24, left: 6, width: 26, height: 18, background: "rgba(255,140,170,0.4)", borderRadius: "50%", filter: "blur(6px)" }} />
            <div className="absolute pointer-events-none"
                 style={{ bottom: 24, right: 6, width: 26, height: 18, background: "rgba(255,140,170,0.4)", borderRadius: "50%", filter: "blur(6px)" }} />
          </>
        )}

        {/* Face content */}
        <div className="absolute inset-0 flex flex-col items-center z-10"
             style={{ paddingTop: HAIR_PT[level], gap: 4 }}>

          {/* Eyebrows */}
          <div className="flex" style={{ gap: 18 }}>
            <Eyebrow level={level} side="left" />
            <Eyebrow level={level} side="right" />
          </div>

          {/* Eyes */}
          <div className="flex" style={{ gap: 13 }}>
            <BigEye iris={iris} level={level} blinkDelay="0s" />
            <BigEye iris={iris} level={level} blinkDelay="0.04s" />
          </div>

          {/* Nose for level 3+ */}
          {level >= 3 && (
            <div style={{ width: 4, height: 3, background: "rgba(0,0,0,0.20)", borderRadius: "50%" }} />
          )}

          {/* Initial */}
          <span className="font-black text-white leading-none"
                style={{ fontSize: level >= 4 ? 19 : 16, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {letter}
          </span>

          {/* Mouth */}
          <BigMouth level={level} />
        </div>

        {/* Shimmer level 4+ */}
        {level >= 4 && (
          <div className="absolute inset-0 rounded-full avatar-shimmer pointer-events-none" />
        )}

        {/* Level 5 golden overlay */}
        {level === 5 && (
          <div className="absolute inset-0 rounded-full pointer-events-none"
               style={{ background: "radial-gradient(circle at 35% 28%, rgba(255,235,120,0.22) 0%, transparent 65%)" }} />
        )}
      </div>

      {/* Badge corner */}
      {badge && (
        <div className="absolute z-20 text-2xl avatar-badge-bounce select-none drop-shadow-lg"
             style={{ top: faceTop - 4, right: 0 }}>
          {badge}
        </div>
      )}

      {/* Neck item / equipped cosmetic */}
      {(equippedCosmeticEmoji || neckItem) && (
        <div className="absolute z-20 text-2xl avatar-badge-bounce select-none drop-shadow-lg w-full text-center"
             style={{ top: faceTop + FACE - 10 }}>
          {equippedCosmeticEmoji ?? neckItem}
        </div>
      )}

      {/* Particles */}
      {PARTICLES[level].map(({ e, cls }, i) => (
        <span key={i}
              className={`absolute text-lg select-none pointer-events-none z-20 avatar-particle ${cls}`}
              style={{ "--p-delay": `${i * 0.6}s`, top: faceTop } as React.CSSProperties}>
          {e}
        </span>
      ))}
    </div>
  );
}

function InnerHair({ level, colorOverride }: { level: number; colorOverride?: string }) {
  if (level === 0) return null;

  const DEFAULT_COLORS = ["", "#60a5fa", "#a78bfa", "#f97316", "#ec4899", "#f59e0b"];
  const c = colorOverride ?? DEFAULT_COLORS[level];

  if (level === 1) {
    return (
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
           style={{ height: 30, background: c, borderRadius: "50% 50% 0 0 / 50% 50% 0 0", zIndex: 1 }} />
    );
  }
  if (level === 2) {
    return (
      <>
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
             style={{ height: 34, background: c, zIndex: 1 }} />
        <div className="absolute pointer-events-none"
             style={{ top: 20, left: -10, width: 32, height: 24, background: c, borderRadius: "0 0 50% 50%", transform: "rotate(-8deg)", zIndex: 1 }} />
      </>
    );
  }
  if (level === 3) {
    return (
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
           style={{ height: 26, background: c, zIndex: 1 }} />
    );
  }
  if (level === 4) {
    const spikes = [
      { left: 8,  w: 16, h: 38 },
      { left: 24, w: 18, h: 46 },
      { left: 42, w: 20, h: 52 },
      { left: 62, w: 18, h: 44 },
      { left: 80, w: 15, h: 36 },
    ];
    return (
      <>
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
             style={{ height: 22, background: c, zIndex: 1 }} />
        {spikes.map((s, i) => (
          <div key={i} className="absolute pointer-events-none"
               style={{ top: -s.h + 28, left: s.left, width: s.w, height: s.h, background: c, borderRadius: "50% 50% 20% 20%", zIndex: 1 }} />
        ))}
      </>
    );
  }
  // Level 5: flames with custom color
  const lighter = colorOverride ? colorOverride + "cc" : "#fef3c7";
  const flames = [
    { left: 4,  w: 18, h: 44 },
    { left: 20, w: 22, h: 56 },
    { left: 42, w: 24, h: 62 },
    { left: 64, w: 20, h: 52 },
    { left: 82, w: 17, h: 42 },
  ];
  return (
    <>
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
           style={{ height: 26, background: `linear-gradient(to right, ${c}, ${lighter}, ${c})`, zIndex: 1 }} />
      {flames.map((f, i) => (
        <div key={i} className="absolute pointer-events-none"
             style={{ top: -f.h + 30, left: f.left, width: f.w, height: f.h, background: `linear-gradient(to bottom, ${lighter}, ${c})`, borderRadius: "50% 50% 10% 10%", zIndex: 1 }} />
      ))}
    </>
  );
}

function Eyebrow({ level, side }: { level: number; side: "left" | "right" }) {
  const color = level >= 5 ? "#fde68a" : "rgba(255,255,255,0.92)";
  const w = level >= 3 ? 15 : 12;
  const h = level >= 4 ? 3.5 : 2.5;
  const rot =
    level === 0 ? 0 :
    level === 1 ? (side === "left" ? -10 : 10) :
    level === 2 ? (side === "left" ? 6 : -6) :
    (side === "left" ? -15 : 15);
  return (
    <div style={{ width: w, height: h, background: color, borderRadius: 4, transform: `rotate(${rot}deg)` }} />
  );
}

function BigEye({ iris, level, blinkDelay = "0s" }: { iris: { top: string; bot: string }; level: number; blinkDelay?: string }) {
  const scW = level >= 3 ? 20 : 18;
  const scH = level >= 3 ? 24 : 22;
  const irW = level >= 3 ? 13 : 11;
  const irH = level >= 3 ? 17 : 15;
  const lidH = level === 2 ? 10 : level >= 4 ? 7 : 5;

  return (
    <div
      className="avatar-blink"
      style={{ width: scW, height: scH, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.25)", position: "relative", overflow: "hidden", animationDelay: blinkDelay }}
    >
      {/* Eyelid shadow */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: lidH, background: "rgba(0,0,0,0.11)", borderRadius: "50% 50% 0 0" }} />
      {/* Iris — se déplace pour regarder autour */}
      <div
        className="avatar-look"
        style={{ width: irW, height: irH, borderRadius: "50%", background: `linear-gradient(to bottom, ${iris.top}, ${iris.bot})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
      >
        {/* Pupil */}
        <div style={{ width: irW - 6, height: irH - 7, background: "#060606", borderRadius: "50%" }} />
        {/* Main catchlight */}
        <div style={{ position: "absolute", top: 2, right: 1, width: 4, height: 5, background: "rgba(255,255,255,0.92)", borderRadius: "50%" }} />
        {/* Secondary catchlight */}
        <div style={{ position: "absolute", bottom: 3, left: 1, width: 2, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
      </div>
      {/* Level 5: golden shimmer */}
      {level >= 5 && (
        <div style={{ position: "absolute", top: 2, left: 3, width: 7, height: 7, background: "rgba(253,230,138,0.55)", borderRadius: "50%", filter: "blur(2px)" }} />
      )}
    </div>
  );
}

function BigMouth({ level }: { level: number }) {
  const bc = level >= 5 ? "rgba(253,230,138,0.95)" : "rgba(255,255,255,0.88)";

  if (level === 0) return (
    <div style={{ width: 30, height: 15, borderBottom: `3px solid ${bc}`, borderLeft: "2px solid transparent", borderRight: "2px solid transparent", borderRadius: "0 0 50% 50%" }} />
  );
  if (level === 1) return (
    <div style={{ width: 26, height: 13, borderBottom: `2.5px solid ${bc}`, borderRadius: "0 0 50% 50%" }} />
  );
  if (level === 2) return (
    <div style={{ width: 22, height: 11, borderBottom: `2.5px solid ${bc}`, borderRadius: "0 0 60% 40%", transform: "translateX(7px)" }} />
  );
  if (level === 3) return (
    <div style={{ width: 28, borderTop: `2.5px solid ${bc}`, borderRadius: 2 }} />
  );
  if (level === 4) return (
    <div style={{ width: 36, height: 15, borderBottom: `3px solid ${bc}`, borderRadius: "0 0 50% 50%" }} />
  );
  return (
    <div style={{ width: 40, height: 18, borderBottom: `3px solid ${bc}`, borderRadius: "0 0 50% 50%", filter: "drop-shadow(0 0 5px gold)" }} />
  );
}
