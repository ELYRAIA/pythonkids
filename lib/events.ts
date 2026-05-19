export function notifyProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pythonkids:progress"));
  }
}
