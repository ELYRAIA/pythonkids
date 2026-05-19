const KEY = "pythonkids_failed_challenges";

export function recordFailure(challengeId: string): void {
  if (typeof window === "undefined") return;
  const data = getFailedChallenges();
  data[challengeId] = (data[challengeId] ?? 0) + 1;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getFailedChallenges(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch { return {}; }
}

export function clearMistake(challengeId: string): void {
  if (typeof window === "undefined") return;
  const data = getFailedChallenges();
  delete data[challengeId];
  localStorage.setItem(KEY, JSON.stringify(data));
}
