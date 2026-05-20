"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { addGems } from "@/lib/gems";

const GRID = 20;
const CELL = 20;
const SIZE = GRID * CELL; // 400px

type Dir   = { x: number; y: number };
type Point = { x: number; y: number };

const OPPOSITE = (d: Dir): Dir => ({ x: -d.x, y: -d.y });
const EQ       = (a: Dir, b: Dir) => a.x === b.x && a.y === b.y;

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp:    { x: 0,  y: -1 }, w: { x: 0,  y: -1 },
  ArrowDown:  { x: 0,  y:  1 }, s: { x: 0,  y:  1 },
  ArrowLeft:  { x: -1, y:  0 }, a: { x: -1, y:  0 },
  ArrowRight: { x: 1,  y:  0 }, d: { x: 1,  y:  0 },
};

// Gem rewards at score milestones
const GEM_MILESTONES: Record<number, number> = { 5: 1, 10: 2, 20: 3, 30: 5, 50: 10 };

function randomFood(snake: Point[]): Point {
  let p: Point;
  do { p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
  while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function makeInitialState() {
  const snake = [{ x: 10, y: 10 }];
  return {
    snake,
    dir:     { x: 1, y: 0 } as Dir,
    nextDir: { x: 1, y: 0 } as Dir,
    food:    randomFood(snake),
    score:   0,
    alive:   true,
  };
}

type Phase = "idle" | "playing" | "dead";

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs        = useRef(makeInitialState()); // game state ref (no re-render on each tick)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const [phase,       setPhase]       = useState<Phase>("idle");
  const [score,       setScore]       = useState(0);
  const [highScore,   setHighScore]   = useState(0);
  const [gemsEarned,  setGemsEarned]  = useState(0);
  const [newRecord,   setNewRecord]   = useState(false);
  const [milestoneHit, setMilestoneHit] = useState<number | null>(null);

  useEffect(() => {
    const hs = parseInt(localStorage.getItem("pythonkids_snake_hs") ?? "0", 10);
    setHighScore(hs);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { snake, food, dir } = gs.current;
    const dark = document.documentElement.getAttribute("data-theme") === "dark";

    // BG
    ctx.fillStyle = dark ? "#0f172a" : "#f8fafc";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid
    ctx.strokeStyle = dark ? "rgba(148,163,184,0.05)" : "rgba(139,92,246,0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0);    ctx.lineTo(i * CELL, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL);    ctx.lineTo(SIZE, i * CELL); ctx.stroke();
    }

    // Food
    ctx.font = `${CELL - 2}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍎", food.x * CELL + CELL / 2, food.y * CELL + CELL / 2 + 1);

    // Snake segments
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const t = snake.length > 1 ? i / (snake.length - 1) : 0;
      // head = purple (139,92,246) → tail = green (74,222,128)
      const r = Math.round(139 + (74  - 139) * t);
      const g = Math.round( 92 + (222 -  92) * t);
      const b = Math.round(246 + (128 - 246) * t);
      ctx.fillStyle = `rgb(${r},${g},${b})`;

      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, isHead ? 7 : 4);
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = "#fff";
        if (dir.x === 1) {
          ctx.fillRect(seg.x * CELL + CELL - 7, seg.y * CELL + 4,        3, 3);
          ctx.fillRect(seg.x * CELL + CELL - 7, seg.y * CELL + CELL - 7, 3, 3);
        } else if (dir.x === -1) {
          ctx.fillRect(seg.x * CELL + 4, seg.y * CELL + 4,        3, 3);
          ctx.fillRect(seg.x * CELL + 4, seg.y * CELL + CELL - 7, 3, 3);
        } else if (dir.y === -1) {
          ctx.fillRect(seg.x * CELL + 4,        seg.y * CELL + 4, 3, 3);
          ctx.fillRect(seg.x * CELL + CELL - 7, seg.y * CELL + 4, 3, 3);
        } else {
          ctx.fillRect(seg.x * CELL + 4,        seg.y * CELL + CELL - 7, 3, 3);
          ctx.fillRect(seg.x * CELL + CELL - 7, seg.y * CELL + CELL - 7, 3, 3);
        }
      }
    });
  }, []);

  const tick = useCallback(() => {
    const s = gs.current;
    if (!s.alive) return;

    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
        s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      s.alive = false;
      if (timerRef.current) clearInterval(timerRef.current);

      // Save high score
      const finalScore = s.score;
      setScore(finalScore);
      setHighScore((prev) => {
        const next = Math.max(prev, finalScore);
        localStorage.setItem("pythonkids_snake_hs", String(next));
        if (finalScore > prev && finalScore > 0) setNewRecord(true);
        return next;
      });
      setPhase("dead");
      draw();
      return;
    }

    s.snake.unshift(head);
    const ate = head.x === s.food.x && head.y === s.food.y;
    if (ate) {
      s.score++;
      s.food = randomFood(s.snake);
      const newScore = s.score;
      setScore(newScore);

      // Gem milestones
      const gems = GEM_MILESTONES[newScore];
      if (gems) {
        addGems(gems);
        setGemsEarned((p) => p + gems);
        setMilestoneHit(newScore);
        setTimeout(() => setMilestoneHit(null), 2000);
      }
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    gs.current = makeInitialState();
    setScore(0);
    setGemsEarned(0);
    setNewRecord(false);
    setMilestoneHit(null);
    setPhase("playing");
    draw();
    // Speed: starts at 130ms, gets faster with score
    let speed = 130;
    timerRef.current = setInterval(tick, speed);

    // Gradually increase speed
    const speedUp = setInterval(() => {
      if (!gs.current.alive) { clearInterval(speedUp); return; }
      const s = gs.current.score;
      const newSpeed = Math.max(70, 130 - s * 3);
      if (newSpeed !== speed) {
        speed = newSpeed;
        clearInterval(timerRef.current!);
        timerRef.current = setInterval(tick, speed);
      }
    }, 1000);
  }, [tick, draw]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = KEY_DIRS[e.key];
      if (!d) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      if (!EQ(d, OPPOSITE(gs.current.dir))) gs.current.nextDir = d;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // Touch / swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    const d: Dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
      : (dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    if (!EQ(d, OPPOSITE(gs.current.dir))) gs.current.nextDir = d;
  };

  const DirBtn = ({ d, label }: { d: Dir; label: string }) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        if (!EQ(d, OPPOSITE(gs.current.dir))) gs.current.nextDir = d;
      }}
      className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 text-xl font-bold text-gray-700 dark:text-white active:scale-90 transition-transform select-none shadow-sm"
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Score bar */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{score}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Score</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-extrabold text-amber-500">🏆 {highScore}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Record</p>
        </div>
        {gemsEarned > 0 && (
          <div className="text-center">
            <p className="text-3xl font-extrabold text-cyan-500">+{gemsEarned}💎</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">Gagnées</p>
          </div>
        )}
      </div>

      {/* Milestone toast */}
      {milestoneHit && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-bounce">
          🎉 Score {milestoneHit} ! +{GEM_MILESTONES[milestoneHit]} 💎 gagnées !
        </div>
      )}

      {/* Canvas */}
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="rounded-2xl border-2 border-purple-200 dark:border-slate-700 shadow-xl"
          style={{ width: "min(calc(100vw - 80px), 400px)", height: "min(calc(100vw - 80px), 400px)" }}
        />

        {/* Overlay : accueil */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl gap-4">
            <span className="text-7xl">🐍</span>
            <div className="text-center">
              <p className="text-white text-2xl font-extrabold mb-1">Snake Python</p>
              <p className="text-white/70 text-sm px-6 text-center">
                Mange les 🍎, évite les murs et ton corps !
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-3 rounded-full font-extrabold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Jouer 🎮
            </button>
            <p className="text-white/50 text-xs">Touches fléchées / WASD / swipe</p>
          </div>
        )}

        {/* Overlay : game over */}
        {phase === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl gap-3">
            <span className="text-6xl">{newRecord ? "🏆" : "💀"}</span>
            <p className="text-white text-2xl font-extrabold">
              {newRecord ? "Nouveau record !" : "Game Over !"}
            </p>
            <p className="text-white/80 text-xl">
              Score : <span className="font-bold text-purple-300">{score}</span>
            </p>
            {gemsEarned > 0 && (
              <p className="text-cyan-400 font-bold text-sm">+{gemsEarned} 💎 gagnées !</p>
            )}
            <button
              onClick={startGame}
              className="mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-3 rounded-full font-extrabold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Rejouer 🔄
            </button>
          </div>
        )}
      </div>

      {/* Touches mobile */}
      <div className="flex flex-col items-center gap-2 sm:hidden select-none">
        <DirBtn d={{ x: 0, y: -1 }} label="▲" />
        <div className="flex gap-6">
          <DirBtn d={{ x: -1, y: 0 }} label="◀" />
          <DirBtn d={{ x: 0,  y: 1 }} label="▼" />
          <DirBtn d={{ x: 1,  y: 0 }} label="▶" />
        </div>
      </div>

      {/* Légende */}
      <div className="text-xs text-gray-400 dark:text-slate-500 text-center space-y-1">
        <p className="hidden sm:block">↑ ↓ ← → ou WASD pour jouer</p>
        <p>💎 Gemmes aux paliers : 5 pts → +1💎 · 10 → +2💎 · 20 → +3💎 · 30 → +5💎 · 50 → +10💎</p>
      </div>
    </div>
  );
}
