let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx || _ctx.state === "closed") {
    try {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { return null; }
  }
  if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
  return _ctx;
}

function note(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.22, delay = 0) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
  gain.gain.setValueAtTime(0.001, ac.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + duration + 0.05);
}

function seq(freqs: number[], type: OscillatorType = "sine", dur = 0.18, vol = 0.22, step = 0.12) {
  freqs.forEach((f, i) => note(f, dur, type, vol, i * step));
}

/** Badge gagné — arpège majeur montant */
export function playBadgeSound() {
  seq([523, 659, 784, 1047], "sine", 0.5, 0.25, 0.12);
}

/** Leçon terminée — deux notes */
export function playLessonDoneSound() {
  seq([440, 587], "sine", 0.3, 0.22, 0.14);
}

/** Défi réussi — fanfare */
export function playChallengeWinSound() {
  seq([392, 523, 659, 784], "triangle", 0.4, 0.22, 0.12);
}

/** Erreur — son descendant */
export function playErrorSound() {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(300, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.3);
  gain.gain.setValueAtTime(0.14, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.35);
}

/** Coffre ouvert — scintillement montant */
export function playChestOpenSound() {
  [350, 450, 580, 750, 980].forEach((f, i) => note(f, 0.1, "sine", 0.18, i * 0.06));
}

/** Gemme révélée — deux notes cristallines */
export function playGemSound() {
  note(880, 0.06, "sine", 0.18, 0);
  note(1320, 0.14, "sine", 0.18, 0.07);
}

/** Toast — ding discret */
export function playToastSound() {
  note(660, 0.07, "sine", 0.12, 0);
  note(880, 0.12, "sine", 0.1, 0.08);
}

/** Montée de rang — fanfare ascendante */
export function playRankUpSound() {
  seq([440, 554, 659, 880, 1109], "sine", 0.18, 0.28, 0.11);
}
