"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { isAudioEnabled, toggleAudio } from "@/lib/sounds";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AppHeader({ right }: { right?: React.ReactNode }) {
  const t = useTranslations("AppHeader");
  const [open, setOpen] = useState(false);
  const [profileEmoji, setProfileEmoji] = useState<string | null>(null);
  const [streakDanger, setStreakDanger] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: "/battle-pass", label: t("nav_pass"), emoji: "⚔️" },
    { href: "/challenges", label: t("nav_challenges"), emoji: "🎯" },
    { href: "/bug-hunt", label: t("nav_bug_hunt"), emoji: "🐛" },
    { href: "/quick", label: t("nav_quick"), emoji: "⚡" },
    { href: "/duel", label: t("nav_duel"), emoji: "🥊" },
    { href: "/detente", label: t("nav_relax"), emoji: "🎮" },
    { href: "/friends", label: t("nav_friends"), emoji: "👥" },
    { href: "/shop", label: t("nav_shop"), emoji: "🛒" },
    { href: "/leaderboard", label: t("nav_leaderboard"), emoji: "🏅" },
    { href: "/profile", label: t("nav_profile"), emoji: "👤" },
  ];

  useEffect(() => {
    setAudioOn(isAudioEnabled());
    const onToggle = () => setAudioOn(isAudioEnabled());
    window.addEventListener("pythonkids:audio_toggle", onToggle);
    return () => window.removeEventListener("pythonkids:audio_toggle", onToggle);
  }, []);

  useEffect(() => {
    try {
      const profiles = localStorage.getItem("pythonkids_profiles");
      const username = localStorage.getItem("pythonkids_username");
      if (profiles && username) {
        const list = JSON.parse(profiles) as Array<{ name: string; emoji: string; local?: boolean }>;
        const found = list.find((p) => p.name === username);
        if (found) setProfileEmoji(found.emoji);
      }
      const streakRaw = localStorage.getItem("pythonkids_streak");
      if (streakRaw) {
        const s = JSON.parse(streakRaw) as { currentStreak: number; lastPlayDate: string };
        const today = new Date().toISOString().split("T")[0];
        setStreakDanger(s.currentStreak > 0 && s.lastPlayDate !== today);
      }
    } catch {}
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const lessonMatch = pathname.match(/^\/levels\/(\d+)\/lessons\//);
  const breadcrumbHref = lessonMatch ? `/levels/${lessonMatch[1]}` : null;
  const breadcrumb = lessonMatch && breadcrumbHref
    ? { href: breadcrumbHref, label: t("level_label", { level: lessonMatch[1] }) }
    : null;

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-purple-100 dark:border-slate-700 sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center gap-3">
        {breadcrumb ? (
          <Link
            href={breadcrumb.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 shrink-0 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            {breadcrumb.label}
          </Link>
        ) : (
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="text-2xl">🐍</span>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              PythonKids
            </span>
          </Link>
        )}

        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                  : "text-gray-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800"
              }`}
            >
              {link.emoji} {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden lg:flex items-center gap-3">
          {right}
          <LanguageSwitcher />
          <button
            onClick={() => toggleAudio()}
            title={audioOn ? t("sound_on") : t("sound_off")}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors text-base"
          >
            {audioOn ? "🔊" : "🔇"}
          </button>
          {streakDanger && (
            <span className="text-xs font-bold text-orange-500 dark:text-orange-400 animate-pulse bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-700 rounded-full px-2.5 py-1">
              {t("streak_danger")}
            </span>
          )}
          {profileEmoji && (
            <Link
              href="/profiles"
              title={streakDanger ? t("sound_warning") : t("switch_profile")}
              className="relative text-xl w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-600 hover:border-purple-400 transition-colors shadow-sm"
            >
              {profileEmoji}
              {streakDanger && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] text-white font-black animate-pulse">!</span>
              )}
            </Link>
          )}
        </div>

        {right && <div className="lg:hidden ml-auto mr-2">{right}</div>}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className={`lg:hidden flex flex-col justify-center gap-1.5 w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors p-2 ${right ? "" : "ml-auto"}`}
        >
          <span className={`block h-0.5 bg-gray-600 dark:bg-slate-300 transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 bg-gray-600 dark:bg-slate-300 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 bg-gray-600 dark:bg-slate-300 transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-purple-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-semibold text-sm ${
                isActive(link.href)
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-slate-300"
              }`}
            >
              {link.emoji} {link.label}
            </Link>
          ))}
          <Link
            href="/profiles"
            onClick={() => setOpen(false)}
            className={`font-semibold text-sm ${isActive("/profiles") ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-slate-300"}`}
          >
            {profileEmoji ?? "👤"} {t("switch_profile")}
          </Link>
          <button
            onClick={() => toggleAudio()}
            className="font-semibold text-sm text-gray-600 dark:text-slate-300 text-left"
          >
            {audioOn ? "🔊" : "🔇"} {audioOn ? t("sound_on") : t("sound_off")}
          </button>
          <div className="pt-1 border-t border-gray-100 dark:border-slate-700">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
