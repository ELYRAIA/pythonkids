"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getPendingChests } from "@/lib/chests";

export default function HomeCoffresWidget() {
  const t = useTranslations("HomeCoffresWidget");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => setCount(getPendingChests().length);
    load();
    window.addEventListener("pythonkids:chests", load);
    return () => window.removeEventListener("pythonkids:chests", load);
  }, []);

  if (count === 0) return null;

  return (
    <section className="w-full px-6 pb-4">
      <Link href="/profile">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg hover:opacity-90 transition-opacity cursor-pointer">
          <span className="text-3xl" style={{ animation: "avatar-badge-bounce 3s ease-in-out infinite" }}>📦</span>
          <div className="flex-1">
            <p className="text-white font-extrabold text-sm">
              {count === 1 ? t("singular") : t("plural", { count })}
            </p>
            <p className="text-amber-100 text-xs">{t("open_hint")}</p>
          </div>
          <span className="bg-white/25 text-white font-extrabold text-sm rounded-full w-8 h-8 flex items-center justify-center shrink-0">
            {count}
          </span>
        </div>
      </Link>
    </section>
  );
}
