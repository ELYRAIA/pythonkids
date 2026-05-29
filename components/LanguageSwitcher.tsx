"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className={`flex items-center gap-1 text-xs font-bold ${isPending ? "opacity-50" : ""}`}>
      <button
        onClick={() => switchTo("fr")}
        className={`px-2 py-1 rounded-md transition-colors ${
          locale === "fr"
            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
            : "text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
        }`}
        title="Français"
      >
        🇫🇷
      </button>
      <button
        onClick={() => switchTo("en")}
        className={`px-2 py-1 rounded-md transition-colors ${
          locale === "en"
            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
            : "text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
        }`}
        title="English"
      >
        🇬🇧
      </button>
    </div>
  );
}
