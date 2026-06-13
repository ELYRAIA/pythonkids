"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { addGems } from "@/lib/gems";

// ── Constants ──────────────────────────────────────────────────────────────
const GRID = 20;
const CELL = 20;
const SIZE = GRID * CELL; // 400

type Dir   = { x: number; y: number };
type Point = { x: number; y: number };
interface Particle { x:number; y:number; vx:number; vy:number; life:number; color:string; size:number; }

const EQ  = (a: Dir, b: Dir) => a.x === b.x && a.y === b.y;
const OPP = (d: Dir): Dir => ({ x: -d.x, y: -d.y });

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp:   {x:0,y:-1}, w:{x:0,y:-1},
  ArrowDown: {x:0,y:1},  s:{x:0,y:1},
  ArrowLeft: {x:-1,y:0}, a:{x:-1,y:0},
  ArrowRight:{x:1,y:0},  d:{x:1,y:0},
};

const GEM_MILESTONES: Record<number,number> = {5:1,10:2,20:3,30:5,50:10};

// ── Helpers ────────────────────────────────────────────────────────────────
function randomFood(snake: Point[]): Point {
  let p: Point;
  do { p = {x:Math.floor(Math.random()*GRID), y:Math.floor(Math.random()*GRID)}; }
  while (snake.some(s => s.x===p.x && s.y===p.y));
  return p;
}

function makeState() {
  const snake = [{x:10,y:10}];
  return { snake, dir:{x:1,y:0} as Dir, nextDir:{x:1,y:0} as Dir, food:randomFood(snake), score:0, alive:true };
}

// Purple head → emerald tail
function segColor(t: number): string {
  const r = Math.round(139 + (16  - 139) * t);
  const g = Math.round( 92 + (185 -  92) * t);
  const b = Math.round(246 + (129 - 246) * t);
  return `rgb(${r},${g},${b})`;
}

function spawnParticles(cx: number, cy: number): Particle[] {
  return Array.from({length:10}, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.6;
    const speed = 1.5 + Math.random() * 2.5;
    const hue   = 15 + Math.random() * 45; // warm reds/oranges
    return { x:cx, y:cy, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
             life:1, color:`hsl(${hue},90%,62%)`, size:2+Math.random()*3 };
  });
}

function levelKey(score: number): string {
  if (score >= 50) return "level_legend";
  if (score >= 30) return "level_master";
  if (score >= 20) return "level_expert";
  if (score >= 10) return "level_pro";
  if (score >= 5)  return "level_player";
  return "level_novice";
}

// ── Component ──────────────────────────────────────────────────────────────
type Phase = "idle" | "playing" | "dead";

export default function SnakeGame() {
  const t = useTranslations("SnakeGame");
  const levelLabel = (s: number) => t(levelKey(s) as Parameters<typeof t>[0]);

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const gs         = useRef(makeState());
  const parts      = useRef<Particle[]>([]);
  const timerRef   = useRef<ReturnType<typeof setInterval>|null>(null);
  const rafRef     = useRef<number>(0);
  const speedRef   = useRef(130);

  const [phase,       setPhase]       = useState<Phase>("idle");
  const [score,       setScore]       = useState(0);
  const [highScore,   setHighScore]   = useState(0);
  const [gemsEarned,  setGemsEarned]  = useState(0);
  const [newRecord,   setNewRecord]   = useState(false);
  const [milestone,   setMilestone]   = useState<number|null>(null);

  useEffect(() => {
    const hs = parseInt(localStorage.getItem("pythonkids_snake_hs") ?? "0", 10);
    setHighScore(hs);
  }, []);

  // ── Draw (called at 60 fps via rAF) ──────────────────────────────────
  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { snake, food, dir, alive } = gs.current;
    const n = snake.length;

    // Update particles
    parts.current = parts.current
      .map(p => ({...p, x:p.x+p.vx, y:p.y+p.vy, vy:p.vy+0.13, life:p.life-0.038}))
      .filter(p => p.life > 0);

    // ── Background ───────────────────────────────────────────────────
    ctx.fillStyle = "#0b0f1a";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Checkerboard
    for (let x = 0; x < GRID; x++) for (let y = 0; y < GRID; y++) {
      if ((x+y) % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.016)";
        ctx.fillRect(x*CELL, y*CELL, CELL, CELL);
      }
    }

    // Board border (gradient glow)
    const brd = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    brd.addColorStop(0, "rgba(139,92,246,0.6)");
    brd.addColorStop(0.5, "rgba(236,72,153,0.6)");
    brd.addColorStop(1, "rgba(139,92,246,0.6)");
    ctx.strokeStyle = brd;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(1.25, 1.25, SIZE-2.5, SIZE-2.5);

    // Subtle corner ornaments
    const corner = 8;
    ctx.strokeStyle = "rgba(236,72,153,0.4)";
    ctx.lineWidth = 1.5;
    [[0,0],[SIZE,0],[0,SIZE],[SIZE,SIZE]].forEach(([cx,cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + (cx===0?corner:-corner), cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + (cy===0?corner:-corner));
      ctx.stroke();
    });

    // ── Animated food ─────────────────────────────────────────────────
    const pulse = Math.sin(ts * 0.004) * 0.13 + 0.87;
    ctx.save();
    ctx.translate(food.x*CELL + CELL/2, food.y*CELL + CELL/2);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = "rgba(239,68,68,0.8)";
    ctx.shadowBlur = 18;
    ctx.font = `${CELL + 4}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍎", 0, 1);
    ctx.restore();
    ctx.shadowBlur = 0;

    // ── Connectors (fill gap between adjacent segments) ───────────────
    for (let i = 0; i < n-1; i++) {
      const a = snake[i], b = snake[i+1];
      const t = n > 1 ? i/(n-1) : 0;
      ctx.fillStyle = segColor(t);
      const pad = 3;
      if (a.y === b.y) {
        const lx = Math.min(a.x,b.x)*CELL + CELL/2;
        ctx.fillRect(lx, a.y*CELL+pad, CELL, CELL-pad*2);
      } else {
        const ty = Math.min(a.y,b.y)*CELL + CELL/2;
        ctx.fillRect(a.x*CELL+pad, ty, CELL-pad*2, CELL);
      }
    }

    // ── Segments ──────────────────────────────────────────────────────
    for (let i = n-1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      const t = n > 1 ? i/(n-1) : 0;

      // Head glow
      if (isHead) {
        ctx.shadowColor = "rgba(139,92,246,0.95)";
        ctx.shadowBlur = 22;
      }

      ctx.fillStyle = segColor(t);
      const pad = isHead ? 0 : 2;
      ctx.beginPath();
      ctx.roundRect(seg.x*CELL+pad, seg.y*CELL+pad, CELL-pad*2, CELL-pad*2, isHead ? 9 : 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Slight highlight on head top-left
      if (isHead) {
        const hl = ctx.createRadialGradient(
          seg.x*CELL+5, seg.y*CELL+5, 0,
          seg.x*CELL+CELL/2, seg.y*CELL+CELL/2, CELL/2
        );
        hl.addColorStop(0, "rgba(255,255,255,0.22)");
        hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl;
        ctx.beginPath();
        ctx.roundRect(seg.x*CELL, seg.y*CELL, CELL, CELL, 9);
        ctx.fill();
      }

      // Eyes + tongue on head
      if (isHead && alive) {
        const hx = seg.x*CELL, hy = seg.y*CELL;
        // Eye positions based on direction
        let e1x: number, e1y: number, e2x: number, e2y: number;
        const eo = 5; // offset from edge
        if      (dir.x ===  1) { e1x=hx+CELL-eo; e1y=hy+eo;        e2x=hx+CELL-eo; e2y=hy+CELL-eo-1; }
        else if (dir.x === -1) { e1x=hx+eo;       e1y=hy+eo;        e2x=hx+eo;       e2y=hy+CELL-eo-1; }
        else if (dir.y === -1) { e1x=hx+eo;        e1y=hy+eo;        e2x=hx+CELL-eo-1; e2y=hy+eo; }
        else                   { e1x=hx+eo;        e1y=hy+CELL-eo;   e2x=hx+CELL-eo-1; e2y=hy+CELL-eo; }

        // Whites
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(e1x, e1y, 3.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e2x, e2y, 3.5, 0, Math.PI*2); ctx.fill();
        // Pupils
        ctx.fillStyle = "#0f0520";
        ctx.beginPath(); ctx.arc(e1x+0.5, e1y+0.5, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e2x+0.5, e2y+0.5, 2, 0, Math.PI*2); ctx.fill();
        // Eye shine
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath(); ctx.arc(e1x-0.5, e1y-0.5, 0.8, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e2x-0.5, e2y-0.5, 0.8, 0, Math.PI*2); ctx.fill();

        // Tongue (flicker)
        const tongueOut = Math.sin(ts * 0.009) > 0.4;
        if (tongueOut) {
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 1.8;
          ctx.lineCap = "round";
          const cx = seg.x*CELL + CELL/2;
          const cy = seg.y*CELL + CELL/2;
          const len = 6, fork = 4;
          ctx.beginPath();
          if (dir.x === 1) {
            ctx.moveTo(cx+9,cy); ctx.lineTo(cx+9+len,cy);
            ctx.moveTo(cx+9+len,cy); ctx.lineTo(cx+9+len+fork,cy-3);
            ctx.moveTo(cx+9+len,cy); ctx.lineTo(cx+9+len+fork,cy+3);
          } else if (dir.x === -1) {
            ctx.moveTo(cx-9,cy); ctx.lineTo(cx-9-len,cy);
            ctx.moveTo(cx-9-len,cy); ctx.lineTo(cx-9-len-fork,cy-3);
            ctx.moveTo(cx-9-len,cy); ctx.lineTo(cx-9-len-fork,cy+3);
          } else if (dir.y === -1) {
            ctx.moveTo(cx,cy-9); ctx.lineTo(cx,cy-9-len);
            ctx.moveTo(cx,cy-9-len); ctx.lineTo(cx-3,cy-9-len-fork);
            ctx.moveTo(cx,cy-9-len); ctx.lineTo(cx+3,cy-9-len-fork);
          } else {
            ctx.moveTo(cx,cy+9); ctx.lineTo(cx,cy+9+len);
            ctx.moveTo(cx,cy+9+len); ctx.lineTo(cx-3,cy+9+len+fork);
            ctx.moveTo(cx,cy+9+len); ctx.lineTo(cx+3,cy+9+len+fork);
          }
          ctx.stroke();
        }
      }
    }

    // ── Particles ─────────────────────────────────────────────────────
    for (const p of parts.current) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Death flash overlay
    if (!alive) {
      const flash = (Math.sin(ts * 0.012) * 0.5 + 0.5) * 0.25;
      ctx.fillStyle = `rgba(239,68,68,${flash})`;
      ctx.fillRect(0, 0, SIZE, SIZE);
    }
  }, []);

  // ── RAF render loop ───────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    const loop = (ts: number) => {
      if (!active) return;
      draw(ts);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { active = false; cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  // ── Game tick (logic only, no draw) ──────────────────────────────────
  const tick = useCallback(() => {
    const s = gs.current;
    if (!s.alive) return;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
        s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.alive = false;
      if (timerRef.current) clearInterval(timerRef.current);
      const finalScore = s.score;
      setScore(finalScore);
      setHighScore(prev => {
        const next = Math.max(prev, finalScore);
        localStorage.setItem("pythonkids_snake_hs", String(next));
        if (finalScore > prev && finalScore > 0) setNewRecord(true);
        return next;
      });
      setPhase("dead");
      return;
    }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      parts.current.push(...spawnParticles(s.food.x*CELL + CELL/2, s.food.y*CELL + CELL/2));
      s.food = randomFood(s.snake);
      const ns = s.score;
      setScore(ns);
      const gems = GEM_MILESTONES[ns];
      if (gems) {
        addGems(gems);
        setGemsEarned(p => p + gems);
        setMilestone(ns);
        setTimeout(() => setMilestone(null), 2200);
      }
    } else {
      s.snake.pop();
    }
  }, []);

  // ── Start game ────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    gs.current = makeState();
    parts.current = [];
    speedRef.current = 130;
    setScore(0);
    setGemsEarned(0);
    setNewRecord(false);
    setMilestone(null);
    setPhase("playing");

    timerRef.current = setInterval(tick, speedRef.current);

    // Speed up every second based on score
    const su = setInterval(() => {
      if (!gs.current.alive) { clearInterval(su); return; }
      const newSpeed = Math.max(65, 130 - gs.current.score * 3);
      if (newSpeed !== speedRef.current) {
        speedRef.current = newSpeed;
        clearInterval(timerRef.current!);
        timerRef.current = setInterval(tick, newSpeed);
      }
    }, 800);
  }, [tick]);

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = KEY_DIRS[e.key];
      if (!d) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      if (!EQ(d, OPP(gs.current.dir))) gs.current.nextDir = d;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Swipe ─────────────────────────────────────────────────────────────
  const touchStart = useRef<{x:number;y:number}|null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {x:e.touches[0].clientX, y:e.touches[0].clientY};
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    const d: Dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? {x:1,y:0} : {x:-1,y:0})
      : (dy > 0 ? {x:0,y:1} : {x:0,y:-1});
    if (!EQ(d, OPP(gs.current.dir))) gs.current.nextDir = d;
  };

  const DirBtn = ({d, label}: {d:Dir; label:string}) => (
    <button
      onPointerDown={e => { e.preventDefault(); if (!EQ(d, OPP(gs.current.dir))) gs.current.nextDir = d; }}
      className="w-14 h-14 rounded-2xl bg-slate-800 border border-purple-500/40 text-xl font-bold text-white active:scale-90 transition-transform select-none shadow-lg"
    >
      {label}
    </button>
  );

  const lv = levelLabel(score);

  return (
    <div className="flex flex-col items-center gap-5">

      {/* Status bar */}
      <div className="w-full max-w-[400px] bg-slate-900 rounded-2xl border border-purple-500/25 p-4 shadow-xl flex items-stretch gap-0">
        {[
          { label: t("label_score"),  value: <span className="text-3xl font-black text-purple-400">{score}</span> },
          { label: t("label_record"), value: <span className="text-2xl font-black text-amber-400">🏆{highScore}</span> },
          { label: t("label_level"),  value: <span className="text-sm font-black text-emerald-400 leading-tight">{lv}</span> },
          ...(gemsEarned > 0 ? [{ label: t("label_earned"), value: <span className="text-xl font-black text-cyan-400">+{gemsEarned}💎</span> }] : []),
        ].map((item, i, arr) => (
          <div key={item.label} className={`flex-1 text-center flex flex-col items-center justify-center gap-0.5 ${i < arr.length-1 ? "border-r border-slate-700" : ""}`}>
            {item.value}
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Milestone toast */}
      {milestone && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-bounce pointer-events-none">
          🎉 {t("milestone_toast", { score: milestone, gems: GEM_MILESTONES[milestone] })}
        </div>
      )}

      {/* Canvas wrapper */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)", touchAction:"none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ width:"min(calc(100vw - 80px), 400px)", height:"min(calc(100vw - 80px), 400px)", display:"block" }}
        />

        {/* Idle overlay */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background:"radial-gradient(ellipse at center, rgba(15,7,35,0.88) 50%, rgba(139,92,246,0.15) 100%)" }}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-8xl drop-shadow-2xl select-none">🐍</span>
              <p className="text-white text-3xl font-black tracking-wide">Snake Python</p>
              <p className="text-white/50 text-sm px-8 text-center">
                {t("idle_hint")}
              </p>
            </div>
            <button onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-12 py-3.5 rounded-full font-extrabold text-xl shadow-2xl shadow-purple-900/60 hover:opacity-90 transition-opacity active:scale-95">
              {t("play_button")}
            </button>
            <div className="flex flex-wrap justify-center gap-1.5 px-8">
              {Object.entries(GEM_MILESTONES).map(([pts,gems]) => (
                <span key={pts} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700">
                  {pts}pts→+{gems}💎
                </span>
              ))}
            </div>
            <p className="text-white/25 text-xs">{t("controls_hint")}</p>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background:"radial-gradient(ellipse at center, rgba(10,5,25,0.9) 50%, rgba(239,68,68,0.12) 100%)" }}>
            <span className="text-7xl">{newRecord ? "🏆" : "💀"}</span>
            <div className="text-center">
              <p className="text-white text-2xl font-black tracking-wide mb-1">
                {newRecord ? t("new_record") : t("game_over")}
              </p>
              <p className="text-slate-400 text-sm">{levelLabel(score)}</p>
            </div>
            <div className="flex items-center gap-6 bg-slate-900/70 rounded-2xl px-6 py-3 border border-slate-700">
              <div className="text-center">
                <p className="text-purple-300 text-2xl font-black">{score}</p>
                <p className="text-slate-500 text-xs">{t("label_score")}</p>
              </div>
              {newRecord && (
                <div className="text-center">
                  <p className="text-amber-400 text-xl font-black">🏆 {score}</p>
                  <p className="text-slate-500 text-xs">{t("label_record")}</p>
                </div>
              )}
              {gemsEarned > 0 && (
                <div className="text-center">
                  <p className="text-cyan-400 text-xl font-black">+{gemsEarned}💎</p>
                  <p className="text-slate-500 text-xs">{t("label_earned")}</p>
                </div>
              )}
            </div>
            <button onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-12 py-3.5 rounded-full font-extrabold text-xl shadow-2xl shadow-purple-900/60 hover:opacity-90 transition-opacity active:scale-95">
              {t("play_again")}
            </button>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="flex flex-col items-center gap-2 sm:hidden select-none">
        <DirBtn d={{x:0,y:-1}} label="▲" />
        <div className="flex gap-4">
          <DirBtn d={{x:-1,y:0}} label="◀" />
          <DirBtn d={{x:0,y:1}}  label="▼" />
          <DirBtn d={{x:1,y:0}}  label="▶" />
        </div>
      </div>

      {/* Milestone progress (desktop) */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2 max-w-[400px]">
        {Object.entries(GEM_MILESTONES).map(([pts, gems]) => {
          const reached = score >= parseInt(pts);
          return (
            <span key={pts}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                reached
                  ? "bg-emerald-900/50 text-emerald-400 border-emerald-700"
                  : "bg-slate-800/60 text-slate-500 border-slate-700"
              }`}>
              {reached ? "✓" : ""} {pts}pts → +{gems}💎
            </span>
          );
        })}
      </div>

      <p className="hidden sm:block text-xs text-slate-500">
        {t("keyboard_hint")}
      </p>
    </div>
  );
}
