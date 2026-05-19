import { addGems } from "./gems";

const KEY = "pythonkids_daily_reward";
const REWARD_GEMS = 5;

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function canClaimDailyReward(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(KEY);
    const data: { date: string } = raw ? JSON.parse(raw) : { date: "" };
    return data.date !== today();
  } catch { return false; }
}

export function claimDailyReward(): number {
  localStorage.setItem(KEY, JSON.stringify({ date: today() }));
  addGems(REWARD_GEMS);
  return REWARD_GEMS;
}
