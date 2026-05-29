const SESSION_KEY = "pythonkids_session_time";
const SESSION_START_KEY = "pythonkids_session_start";

interface SessionRecord {
  date: string;       // "YYYY-MM-DD"
  seconds: number;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function getSessionHistory(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "[]") as SessionRecord[];
  } catch {
    return [];
  }
}

function saveHistory(history: SessionRecord[]) {
  // Ne garde que les 90 derniers jours
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const trimmed = history.filter((r) => r.date >= cutoffStr);
  localStorage.setItem(SESSION_KEY, JSON.stringify(trimmed));
}

export function startSession() {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_START_KEY, String(Date.now()));
}

export function endSession() {
  if (typeof window === "undefined") return;
  const startStr = localStorage.getItem(SESSION_START_KEY);
  if (!startStr) return;
  const elapsed = Math.round((Date.now() - parseInt(startStr)) / 1000);
  localStorage.removeItem(SESSION_START_KEY);

  // Ignore les sessions < 10s (rechargements) ou > 3h (oubli de fermer)
  if (elapsed < 10 || elapsed > 10800) return;

  const history = getSessionHistory();
  const todayStr = today();
  const existing = history.find((r) => r.date === todayStr);
  if (existing) {
    existing.seconds += elapsed;
  } else {
    history.push({ date: todayStr, seconds: elapsed });
  }
  saveHistory(history);
}

export function getTotalSeconds(): number {
  return getSessionHistory().reduce((sum, r) => sum + r.seconds, 0);
}

export function getSecondsForDate(date: string): number {
  return getSessionHistory().find((r) => r.date === date)?.seconds ?? 0;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}
