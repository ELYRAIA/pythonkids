"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function getSessionId(): string {
  const key = "pk_session";
  let id = sessionStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
  return id;
}

export default function HomeOnlineWidget() {
  const t = useTranslations("HomeOnlineWidget");
  const [count, setCount] = useState<number | null>(null);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    sessionId.current = getSessionId();

    async function heartbeat() {
      if (!sessionId.current) return;
      try {
        const res = await fetch("/api/online", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId.current }),
        });
        if (res.ok) {
          const data = await res.json() as { count: number };
          setCount(data.count);
        }
      } catch {}
    }

    heartbeat();
    const hb = setInterval(heartbeat, 30_000);
    return () => clearInterval(hb);
  }, []);

  if (count === null) return null;

  const alone  = count <= 1;
  const plural = count > 1;

  return (
    <section className="w-full px-6 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-sm ${
          alone
            ? "bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700"
            : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
        }`}>
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${alone ? "bg-gray-400" : "bg-emerald-400"}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${alone ? "bg-gray-400" : "bg-emerald-500"}`} />
          </span>
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
            {count === 0
              ? t("none_active")
              : alone
              ? t("alone")
              : t("multiple", { count })
            }
          </p>
        </div>
      </div>
    </section>
  );
}
