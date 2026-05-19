const STORAGE_KEY = "pythonkids_mastery";

type MasteryMap = Record<string, number>;

export function lessonKey(levelId: number, lessonIndex: number): string {
  return `${levelId}_${lessonIndex}`;
}

function load(): MasteryMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MasteryMap) : {};
  } catch {
    return {};
  }
}

export function getMastery(): MasteryMap {
  return load();
}

export function getLessonStars(levelId: number, lessonIndex: number): number {
  return load()[lessonKey(levelId, lessonIndex)] ?? 0;
}

export function setLessonStars(levelId: number, lessonIndex: number, stars: number): void {
  if (typeof window === "undefined") return;
  const map = load();
  const key = lessonKey(levelId, lessonIndex);
  const clamped = Math.min(3, Math.max(1, stars));
  if (!map[key] || clamped > map[key]) {
    map[key] = clamped;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }
}

export function getLevelAvgStars(levelId: number, totalLessons: number): number {
  const map = load();
  let sum = 0;
  let count = 0;
  for (let i = 0; i < totalLessons; i++) {
    const s = map[lessonKey(levelId, i)];
    if (s) { sum += s; count++; }
  }
  return count === 0 ? 0 : Math.round((sum / count) * 10) / 10;
}
