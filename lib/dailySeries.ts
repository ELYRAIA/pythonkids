export const SERIES_MAX = 10;
export const SERIES_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Rareté des 10 coffres (levelId utilisé pour générer les récompenses)
export const SLOT_LEVELS = [0, 0, 0, 1, 2, 2, 3, 3, 4, 5];

const KEY = "pythonkids_daily_series";

export interface DailySeriesData {
  date: string;
  claimed: number;
  lastClaimTime: number;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDailySeries(): DailySeriesData {
  if (typeof window === "undefined") return { date: today(), claimed: 0, lastClaimTime: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { date: today(), claimed: 0, lastClaimTime: 0 };
    const data = JSON.parse(raw) as DailySeriesData;
    // Nouveau jour → reset
    if (data.date !== today()) return { date: today(), claimed: 0, lastClaimTime: 0 };
    return data;
  } catch {
    return { date: today(), claimed: 0, lastClaimTime: 0 };
  }
}

function save(data: DailySeriesData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function canClaimNext(): boolean {
  const s = getDailySeries();
  if (s.claimed >= SERIES_MAX) return false;
  if (s.claimed === 0 && s.lastClaimTime === 0) return true;
  return Date.now() - s.lastClaimTime >= SERIES_INTERVAL_MS;
}

export function msUntilNext(): number {
  const s = getDailySeries();
  if (s.claimed >= SERIES_MAX) return -1;
  if (s.claimed === 0 && s.lastClaimTime === 0) return 0;
  return Math.max(0, SERIES_INTERVAL_MS - (Date.now() - s.lastClaimTime));
}

/** Réclame le prochain coffre. Retourne le levelId du coffre ajouté, ou -1 si impossible. */
export function claimSeriesChest(): number {
  const s = getDailySeries();
  if (!canClaimNext()) return -1;
  const levelId = SLOT_LEVELS[s.claimed];
  save({ date: today(), claimed: s.claimed + 1, lastClaimTime: Date.now() });
  return levelId;
}
