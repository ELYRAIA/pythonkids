"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/challenges", label: "Défis", emoji: "🎯" },
  { href: "/duel", label: "Duel", emoji: "⚔️" },
  { href: "/friends", label: "Amis", emoji: "👥" },
  { href: "/shop", label: "Boutique", emoji: "🛒" },
  { href: "/leaderboard", label: "Classement", emoji: "🏅" },
  { href: "/profile", label: "Profil", emoji: "👤" },
];

export default function AppHeader({ right }: { right?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [profileEmoji, setProfileEmoji] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const profiles = localStorage.getItem("pythonkids_profiles");
      const username = localStorage.getItem("pythonkids_username");
      if (profiles && username) {
        const list = JSON.parse(profiles) as Array<{ name: string; emoji: string }>;
        const found = list.find((p) => p.name === username);
        if (found) setProfileEmoji(found.emoji);
      }
    } catch {}
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const lessonMatch = pathname.match(/^\/levels\/(\d+)\/lessons\//);
  const breadcrumb = lessonMatch
    ? { href: `/levels/${lessonMatch[1]}`, label: `← Niveau ${lessonMatch[1]}` }
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

        <nav className="hidden sm:flex items-center gap-1 ml-2">
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

        <div className="ml-auto hidden sm:flex items-center gap-3">
          {right}
          {profileEmoji && (
            <Link
              href="/profiles"
              title="Changer de profil"
              className="text-xl w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-600 hover:border-purple-400 transition-colors shadow-sm"
            >
              {profileEmoji}
            </Link>
          )}
          <Link
            href="/editor"
            className={`bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity ${
              pathname === "/editor" ? "ring-2 ring-purple-300 ring-offset-1" : ""
            }`}
          >
            Coder maintenant
          </Link>
        </div>

        {right && <div className="sm:hidden ml-auto mr-2">{right}</div>}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className={`sm:hidden flex flex-col justify-center gap-1.5 w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors p-2 ${right ? "" : "ml-auto"}`}
        >
          <span className={`block h-0.5 bg-gray-600 dark:bg-slate-300 transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 bg-gray-600 dark:bg-slate-300 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 bg-gray-600 dark:bg-slate-300 transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-purple-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-6 py-4 flex flex-col gap-3">
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
            {profileEmoji ?? "👤"} Changer de profil
          </Link>
          <Link
            href="/editor"
            onClick={() => setOpen(false)}
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity text-center"
          >
            Coder maintenant
          </Link>
        </div>
      )}
    </header>
  );
}
