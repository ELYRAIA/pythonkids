export function fireToast(msg: string, emoji: string, type = "default") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("pythonkids:toast", { detail: { msg, emoji, type } }));
}
