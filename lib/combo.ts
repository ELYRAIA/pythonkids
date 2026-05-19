import { addGems } from "./gems";

const KEY = "pythonkids_session_combo";

export interface ComboResult {
  combo: number;
  bonusGems: number;
  milestone: boolean;
}

export function getCombo(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(sessionStorage.getItem(KEY) ?? "0"); } catch { return 0; }
}

export function incrementCombo(): ComboResult {
  if (typeof window === "undefined") return { combo: 0, bonusGems: 0, milestone: false };
  try {
    const combo = getCombo() + 1;
    sessionStorage.setItem(KEY, String(combo));

    let bonusGems = 0;
    const milestone = [3, 5, 10].includes(combo) || (combo > 10 && combo % 5 === 0);
    if (combo === 3) bonusGems = 10;
    else if (combo === 5) bonusGems = 20;
    else if (combo === 10) bonusGems = 50;
    else if (combo > 10 && combo % 5 === 0) bonusGems = 30;

    if (bonusGems > 0) addGems(bonusGems);
    return { combo, bonusGems, milestone };
  } catch {
    return { combo: 0, bonusGems: 0, milestone: false };
  }
}

export function resetCombo(): void {
  if (typeof window === "undefined") return;
  try { sessionStorage.removeItem(KEY); } catch {}
}
