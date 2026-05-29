"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer;
}

export default function PushNotificationSetup() {
  const t = useTranslations("PushNotificationSetup");
  const [state, setState] = useState<"unknown" | "granted" | "denied" | "loading">("unknown");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (localStorage.getItem("push_dismissed")) { setDismissed(true); return; }
    setState(Notification.permission === "granted" ? "granted" : "unknown");
  }, []);

  if (dismissed || state === "granted" || state === "denied") return null;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  const enable = async () => {
    setState("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setState("denied"); return; }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setState("granted");
    } catch {
      setState("unknown");
    }
  };

  const dismiss = () => {
    localStorage.setItem("push_dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="mx-6 mb-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-center gap-3">
      <span className="text-2xl shrink-0">🔔</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-orange-800 dark:text-orange-300">{t("title")}</p>
        <p className="text-xs text-orange-600 dark:text-orange-400">{t("desc")}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={enable}
          disabled={state === "loading"}
          className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-60"
        >
          {state === "loading" ? "…" : t("enable")}
        </button>
        <button onClick={dismiss} className="text-orange-400 hover:text-orange-600 text-xs px-2">{t("dismiss")}</button>
      </div>
    </div>
  );
}
