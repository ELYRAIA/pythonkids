const KEY = "pythonkids_gems";

export function getGems(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) ?? "0");
}

export function addGems(amount: number): void {
  const current = getGems();
  localStorage.setItem(KEY, String(current + amount));
  window.dispatchEvent(new Event("pythonkids:gems"));
}

export function spendGems(amount: number): boolean {
  const current = getGems();
  if (current < amount) return false;
  localStorage.setItem(KEY, String(current - amount));
  window.dispatchEvent(new Event("pythonkids:gems"));
  return true;
}
