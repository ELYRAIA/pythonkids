// Fire-and-forget : poste un événement d'activité sur le serveur
export function postActivity(
  type: "lesson" | "badge" | "challenge" | "streak",
  detail: string,
): void {
  if (typeof window === "undefined") return;
  const username = localStorage.getItem("pythonkids_username");
  if (!username) return;
  fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, type, detail }),
  }).catch(() => {});
}
