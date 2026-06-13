"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { lf } from "@/lib/localize";
import AppHeader from "@/components/AppHeader";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getProgress, BADGES, getPlayerLevel } from "@/lib/progress";
import { getPlayerRank } from "@/lib/ranks";
import { getStreak } from "@/lib/streak";
import { calculateScore } from "@/lib/score";
import { getCompletedChallenges, CHALLENGES } from "@/lib/challenges";
import { LEVELS_DATA } from "@/lib/lessons";
import { LEVELS } from "@/lib/levels";
import {
  getPendingChests, getUnlockedCosmetics, AVATAR_COSMETICS,
  getLevelRarity, CHEST_EMOJI_BY_RARITY, RARITY_COLORS, RARITY_LABELS, RARITY_BORDER, RARITY_BG, RARITY_GLOW,
  retroactiveChests, getEquippedCosmetic, equipCosmetic,
  HEAD_SKINS, getUnlockedHeads, getEquippedHead, equipHead,
  type Chest,
} from "@/lib/chests";
import { getGems } from "@/lib/gems";
import {
  getOwnedShopItems, getEquippedSkin, getEquippedStickers, getEquippedTitle,
  SHOP_SKINS, SHOP_STICKERS, SHOP_TITLES,
} from "@/lib/shop";
import ChestOpener from "@/components/ChestOpener";
import AccountSync from "@/components/AccountSync";
import DailySeries from "@/components/DailySeries";
import StreakCalendar from "@/components/StreakCalendar";
import { getXPInfo } from "@/lib/xp";
import { getDuelWins } from "@/lib/duels";
import { getUnlockedAchievements, checkAchievements, ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { isAudioEnabled, toggleAudio } from "@/lib/sounds";
import type { ActivityEvent } from "@/app/api/activity/route";
import { apiFetch } from "@/lib/api";

interface FriendStatus {
  name: string;
  lastEvent: ActivityEvent | null;
  online: boolean;
}

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, lastPlayDate: "", playDates: [] as string[] });
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({});
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [playerLevel, setPlayerLevel] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pendingChests, setPendingChests] = useState<Chest[]>([]);
  const [activeChest, setActiveChest] = useState<Chest | null>(null);
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<string[]>([]);
  const [equippedCosmetic, setEquippedCosmetic] = useState<string | null>(null);
  const [gems, setGems] = useState(0);
  const [equippedSkin, setEquippedSkin] = useState<string | null>(null);
  const [equippedStickers, setEquippedStickers] = useState<string[]>([]);
  const [equippedTitle, setEquippedTitle] = useState<string | null>(null);
  const [ownedShopItems, setOwnedShopItems] = useState<string[]>([]);
  const [unlockedHeads, setUnlockedHeads] = useState<string[]>([]);
  const [equippedHeadId, setEquippedHeadId] = useState<string | null>(null);
  const [xpInfo, setXpInfo] = useState(() => ({ rank: { id: "novice", title: "Novice", emoji: "🌱", color: "text-gray-400", bgGradient: "from-gray-400 to-slate-500", minXP: 0 }, nextRank: null as null | { id: string; title: string; emoji: string; color: string; bgGradient: string; minXP: number }, xp: 0, progress: 0, xpToNext: 0 }));
  const [friendStatuses, setFriendStatuses] = useState<FriendStatus[]>([]);
  const [duelWins, setDuelWins] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [audioOn, setAudioOn] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(localStorage.getItem("pythonkids_username") ?? "");

    const load = () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScore(calculateScore());
      const s = getStreak();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStreak({ currentStreak: s.currentStreak, longestStreak: s.longestStreak, lastPlayDate: s.lastPlayDate, playDates: s.playDates ?? [] });
      const p = getProgress();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEarnedBadges(p.earnedBadges);
      retroactiveChests(p.earnedBadges, p.completedLessons);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompletedLessons(p.completedLessons);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompletedChallenges(getCompletedChallenges());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayerLevel(getPlayerLevel());
    };
    const loadChests = () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingChests(getPendingChests());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlockedCosmetics(getUnlockedCosmetics());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEquippedCosmetic(getEquippedCosmetic());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlockedHeads(getUnlockedHeads());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEquippedHeadId(getEquippedHead());
    };
    const loadShop = () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGems(getGems());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEquippedSkin(getEquippedSkin());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEquippedStickers(getEquippedStickers());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEquippedTitle(getEquippedTitle());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOwnedShopItems(getOwnedShopItems());
    };
    const loadXP = () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setXpInfo(getXPInfo());
    };

    load();
    loadChests();
    loadShop();
    loadXP();
    setDuelWins(getDuelWins());
    setUnlockedAchievements(getUnlockedAchievements());
    setAudioOn(isAudioEnabled());
    checkAchievements();

    const name = localStorage.getItem("pythonkids_username");
    async function loadFriends() {
      if (!name) return;
      try {
        const profilesRaw = localStorage.getItem("pythonkids_profiles");
        const localNames: string[] = profilesRaw
          ? (JSON.parse(profilesRaw) as Array<{ name: string }>)
              .map((p) => p.name)
              .filter((n) => n !== name)
          : [];

        const friendsRes = await apiFetch(`/api/friends?username=${encodeURIComponent(name)}`);
        const remoteNames: string[] = await friendsRes.json();

        const allNames = [...new Set([...localNames, ...remoteNames])];
        if (allNames.length === 0) { setFriendStatuses([]); return; }

        const actRes = await apiFetch(`/api/activity?friends=${allNames.map(encodeURIComponent).join(",")}`);
        const events: ActivityEvent[] = await actRes.json();
        const now = Date.now();
        const statuses: FriendStatus[] = allNames.map((f) => {
          const lastEvent = events.find((e) => e.username === f) ?? null;
          const online = lastEvent ? (now - new Date(lastEvent.timestamp).getTime()) < 30 * 60 * 1000 : false;
          return { name: f, lastEvent, online };
        });
        statuses.sort((a, b) => {
          if (a.online !== b.online) return a.online ? -1 : 1;
          const ta = a.lastEvent ? new Date(a.lastEvent.timestamp).getTime() : 0;
          const tb = b.lastEvent ? new Date(b.lastEvent.timestamp).getTime() : 0;
          return tb - ta;
        });
        setFriendStatuses(statuses);
      } catch {}
    }
    loadFriends();
    const pollInterval = setInterval(loadFriends, 30000);

    window.addEventListener("pythonkids:progress", load);
    window.addEventListener("pythonkids:xp", loadXP);
    window.addEventListener("pythonkids:chests", loadChests);
    window.addEventListener("pythonkids:gems", loadShop);
    window.addEventListener("pythonkids:shop", loadShop);
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("pythonkids:progress", load);
      window.removeEventListener("pythonkids:chests", loadChests);
      window.removeEventListener("pythonkids:gems", loadShop);
      window.removeEventListener("pythonkids:shop", loadShop);
      window.removeEventListener("pythonkids:xp", loadXP);
    };
  }, []);

  const totalLessons = Object.values(LEVELS_DATA).reduce((acc, l) => acc + l.lessons.length, 0);
  const doneLessons = Object.values(completedLessons).flat().length;

  const challengeStats = (["Facile", "Moyen", "Difficile"] as const).map((diff) => {
    const total = CHALLENGES.filter((c) => c.difficulty === diff).length;
    const done = mounted ? CHALLENGES.filter((c) => c.difficulty === diff && completedChallenges.includes(c.id)).length : 0;
    return { diff, done, total };
  });

  const currentLevelMeta = LEVELS.find((l) => l.id === playerLevel);
  const equippedSkinData = mounted && equippedSkin ? SHOP_SKINS.find((s) => s.id === equippedSkin) : null;
  const equippedCosmeticData = mounted && equippedCosmetic ? AVATAR_COSMETICS.find((c) => c.id === equippedCosmetic) : null;
  const equippedHeadData = mounted && equippedHeadId ? HEAD_SKINS.find((h) => h.id === equippedHeadId) : null;
  const effectiveGradient = equippedHeadData?.gradient ?? equippedSkinData?.gradient;
  const effectiveHairColor = equippedHeadData?.hairColor;

  const currentLevelEntry = Object.values(LEVELS_DATA).find((l) => l.id === playerLevel);
  const currentLevelTotal = currentLevelEntry ? currentLevelEntry.lessons.length : 1;
  const currentLevelDone = mounted ? (completedLessons[String(playerLevel)] ?? []).length : 0;
  const levelXP = Math.round(Math.min(100, (currentLevelDone / currentLevelTotal) * 100));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <AppHeader />

      <div className={`max-w-2xl mx-auto px-4 py-6 space-y-4 ${mounted ? "fade-in" : "opacity-0"}`}>

        {/* ── HERO CARD ── */}
        <div className="rounded-3xl overflow-hidden relative shadow-2xl"
             style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 55%, #1a0533 100%)" }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{ background: "linear-gradient(to right, transparent, rgba(167,139,250,0.6), transparent)" }} />

          <div className="relative z-10 flex flex-col items-center px-6 pt-7 pb-6">

            {currentLevelMeta && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-white/80"
                   style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <span>{currentLevelMeta.emoji}</span>
                <span>{t("level_badge", { id: currentLevelMeta.id, name: lf(currentLevelMeta, "name", locale) })}</span>
              </div>
            )}

            <PlayerAvatar
              username={username}
              playerLevel={mounted ? playerLevel : 0}
              skinGradient={effectiveGradient}
              hairColor={effectiveHairColor}
              equippedCosmeticEmoji={equippedCosmeticData?.emoji}
            />

            <h1 className="text-2xl font-extrabold text-white mt-1 tracking-tight"
                style={{ textShadow: "0 2px 16px rgba(167,139,250,0.5)" }}>
              {username || t("anonymous")}
            </h1>

            {mounted && (() => {
              const rank = getPlayerRank(earnedBadges);
              return (
                <div className="mt-2 mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                     style={{ background: rank.bgColor, color: "white" }}>
                  <span>{rank.emoji}</span>
                  <span className={rank.color}>{rank.title}</span>
                </div>
              );
            })()}

            {mounted && equippedTitle && (() => {
              const titleItem = SHOP_TITLES.find((titleObj) => titleObj.id === equippedTitle);
              return titleItem ? (
                <span className={`mt-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white bg-gradient-to-r ${titleItem.gradient}`}>
                  {titleItem.emoji} {titleItem.tagText}
                </span>
              ) : null;
            })()}

            {mounted && equippedStickers.length > 0 && (
              <div className="flex gap-1.5 mt-1.5">
                {equippedStickers.map((id) => {
                  const s = SHOP_STICKERS.find((st) => st.id === id);
                  return s ? <span key={id} className="text-xl">{s.emoji}</span> : null;
                })}
              </div>
            )}

            <div className="w-full max-w-xs mt-5">
              <div className="flex justify-between text-[11px] text-white/45 mb-1.5">
                <span>{t("level_prev", { n: playerLevel })}</span>
                <span className="text-white/70 font-semibold">{t("level_progress", { done: currentLevelDone, total: currentLevelTotal, pct: levelXP })}</span>
                {playerLevel < 5 && <span>{t("level_next", { n: playerLevel + 1 })}</span>}
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                     style={{ width: `${levelXP}%`, background: "linear-gradient(to right, #a78bfa, #f472b6)" }}>
                  <div className="absolute inset-0"
                       style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)", backgroundSize: "200% 100%", animation: "avatar-shimmer-anim 2.5s ease-in-out infinite" }} />
                </div>
              </div>
            </div>

            {mounted && (
              <div className="w-full max-w-xs mt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-xs font-extrabold ${xpInfo.rank.color}`}>
                    {xpInfo.rank.emoji} {xpInfo.rank.title}
                  </span>
                  <span className="text-[10px] text-white/50">
                    {xpInfo.xp} XP
                    {xpInfo.nextRank && ` / ${xpInfo.nextRank.minXP}`}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${xpInfo.progress}%`, background: `linear-gradient(to right, ${xpInfo.rank.bgGradient})` }}
                  />
                </div>
                {xpInfo.nextRank && (
                  <p className="text-[9px] text-white/35 mt-1 text-center">
                    {xpInfo.xpToNext} XP pour {xpInfo.nextRank.emoji} {xpInfo.nextRank.title}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-5 gap-2 mt-5 w-full">
              <StatChip value={score > 999 ? `${(score / 1000).toFixed(1)}k` : String(score)} label={t("stat_points")} emoji="⭐" />
              <StatChip value={String(mounted ? gems : 0)} label={t("stat_gems")} emoji="💎" />
              <StatChip value={`${streak.currentStreak}j`} label={t("stat_streak")} emoji="🔥" />
              <StatChip value={`${mounted ? earnedBadges.length : 0}`} label={t("stat_badges")} emoji="🏅" />
              <StatChip value={String(mounted ? duelWins : 0)} label={t("stat_duels")} emoji="⚔️" />
            </div>

            <div className="mt-5 w-full max-w-xs flex gap-2">
              <a
                href="/editor"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 active:scale-95 transition-all text-white font-bold text-sm rounded-2xl py-3 shadow-lg"
              >
                <span className="text-lg">💻</span> {t("cta_code")}
              </a>
              <button
                onClick={() => generateShareCard({ username, score, streak: streak.currentStreak, lessons: doneLessons, totalLessons, badges: earnedBadges.length, achievements: unlockedAchievements.length, duelWins, locale, tLabels: { points: t("card_points"), streak: t("card_streak"), lessons: t("card_lessons"), badges: t("card_badges"), duels: t("card_duels"), achievements: t("card_achievements") } })}
                className="px-3 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
                title={t("share_card_title")}
              >
                📸
              </button>
              <button
                onClick={() => {
                  const text = t("share_text", { username, rankEmoji: xpInfo.rank.emoji, rankTitle: xpInfo.rank.title, score, streak: streak.currentStreak, lessons: doneLessons, totalLessons, badges: earnedBadges.length });
                  if (navigator.share) {
                    navigator.share({ title: t("share_profile_title"), text }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(text).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); }).catch(() => {});
                  }
                }}
                className="px-3 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                style={{ background: shareCopied ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.12)", border: shareCopied ? "1px solid rgba(74,222,128,0.5)" : "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
                title={t("share_profile")}
              >
                {shareCopied ? "✓" : "🔗"}
              </button>
              <button
                onClick={() => { const next = toggleAudio(); setAudioOn(next); }}
                className="px-3 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
                title={audioOn ? t("sound_mute") : t("sound_unmute")}
              >
                {mounted ? (audioOn ? "🔊" : "🔇") : "🔊"}
              </button>
            </div>
          </div>
        </div>

        {mounted && <AccountSync username={username} />}

        {mounted && <FriendsWidget statuses={friendStatuses} t={t} />}

        {/* ── COLLECTION DE TÊTES ── */}
        <div className="rounded-3xl overflow-hidden shadow-lg relative"
             style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1e1040 60%, #0f1a26 100%)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
          <div className="relative z-10 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  {t("heads_title")}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">{t("heads_desc")}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-white">{mounted ? unlockedHeads.length : 0}</span>
                <span className="text-xs text-white/40">/{HEAD_SKINS.length}</span>
              </div>
            </div>

            <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                   style={{ width: `${mounted ? Math.round((unlockedHeads.length / HEAD_SKINS.length) * 100) : 0}%`, background: "linear-gradient(to right, #a78bfa, #f472b6)" }} />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {HEAD_SKINS.map((head) => {
                const owned = mounted && unlockedHeads.includes(head.id);
                const isEquipped = mounted && equippedHeadId === head.id;
                return (
                  <button
                    key={head.id}
                    onClick={owned ? () => { equipHead(isEquipped ? null : head.id); setEquippedHeadId(isEquipped ? null : head.id); } : undefined}
                    className={`relative flex flex-col items-center rounded-2xl pt-1 pb-2 px-1 transition-all ${owned ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default"}`}
                    style={{
                      background: owned ? RARITY_BG[head.rarity] : "rgba(255,255,255,0.03)",
                      border: isEquipped
                        ? `2px solid rgba(167,139,250,0.9)`
                        : owned
                          ? `1px solid ${RARITY_GLOW[head.rarity]}`
                          : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: isEquipped ? `0 0 16px rgba(167,139,250,0.5)` : owned ? `0 0 10px ${RARITY_GLOW[head.rarity]}` : "none",
                    }}
                  >
                    {isEquipped && (
                      <div className="absolute -top-1 -right-1 z-10 bg-purple-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-[9px] font-black">✓</div>
                    )}
                    <div style={{ width: 66, height: 76, overflow: "hidden", position: "relative", filter: owned ? "none" : "grayscale(1) brightness(0.35)" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, transform: "scale(0.445)", transformOrigin: "top left", width: 148 }}>
                        <PlayerAvatar
                          username={username || "?"}
                          playerLevel={mounted ? playerLevel : 0}
                          skinGradient={head.gradient}
                          hairColor={head.hairColor}
                          isStatic
                        />
                      </div>
                    </div>
                    <p className={`text-[9px] font-bold leading-tight text-center mt-0.5 truncate w-full px-0.5 ${owned ? "text-white/90" : "text-white/25"}`}>
                      {owned ? head.name : "🔒"}
                    </p>
                    {owned && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 bg-gradient-to-br ${RARITY_COLORS[head.rarity]}`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              {(["common", "rare", "epic", "legendary"] as const).map((r) => (
                <div key={r} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${RARITY_COLORS[r]}`} />
                  <span className="text-[9px] text-white/35">{RARITY_LABELS[r]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {mounted && (
          <DailySeries onChestReady={(chest) => setActiveChest(chest)} />
        )}

        {mounted && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-gray-700 dark:text-slate-200">{t("calendar_title")}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {streak.longestStreak > 0 && (
                  <span className="text-orange-500 dark:text-orange-400 font-semibold">{t("streak_record", { days: streak.longestStreak })}</span>
                )}
                <span className="text-gray-400 dark:text-slate-500">{streak.currentStreak > 1 ? t("streak_current_plural", { days: streak.currentStreak }) : t("streak_current", { days: streak.currentStreak })}</span>
              </div>
            </div>
            <StreakCalendar streakData={streak} />
          </div>
        )}

        {/* ── PROGRESSION GLOBALE ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📖</span>
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{t("lessons_title")}</span>
            </div>
            <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 leading-none">{doneLessons}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 mb-3">{t("lessons_out_of", { total: totalLessons })}</p>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                   style={{ width: `${Math.round((doneLessons / totalLessons) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 text-right">
              {Math.round((doneLessons / totalLessons) * 100)}%
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎯</span>
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{t("challenges_title")}</span>
            </div>
            <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 leading-none">{mounted ? completedChallenges.length : 0}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 mb-3">{t("challenges_out_of", { total: CHALLENGES.length })}</p>
            <div className="space-y-2">
              {challengeStats.map(({ diff, done, total }) => {
                const cfg = {
                  Facile:    { color: "from-emerald-400 to-green-500", label: "🟢" },
                  Moyen:     { color: "from-yellow-400 to-orange-400", label: "🟡" },
                  Difficile: { color: "from-purple-500 to-violet-600", label: "🔴" },
                }[diff];
                return (
                  <div key={diff} className="flex items-center gap-2">
                    <span className="text-xs w-3">{cfg.label}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-700`}
                           style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 w-7 text-right">{done}/{total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── PROGRESSION PAR NIVEAU ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-sm font-extrabold text-gray-800 dark:text-white">{t("level_progress_title")}</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {Object.values(LEVELS_DATA).map((level) => {
              const done = mounted ? (completedLessons[String(level.id)] ?? []).length : 0;
              const total = level.lessons.length;
              const pct = Math.round((done / total) * 100);
              const levelMeta = LEVELS.find((l) => l.id === level.id);
              const complete = done === total;
              return (
                <Link key={level.id} href={`/levels/${level.id}`}>
                  <div className={`px-5 py-3.5 flex items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${complete ? "bg-slate-50/80 dark:bg-slate-700/30" : ""}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-gradient-to-br ${levelMeta?.color ?? "from-gray-300 to-gray-400"}`}>
                      {complete ? "✅" : <span>{level.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">
                          {t("level_row", { id: level.id, name: lf(levelMeta ?? level, "name", locale) })}
                        </span>
                        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 ml-2 shrink-0">{done}/{total}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full bg-gradient-to-r ${level.color} transition-all duration-700`}
                             style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 dark:text-slate-500 shrink-0 w-8 text-right">{pct}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── COFFRES EN ATTENTE ── */}
        {mounted && pendingChests.length === 0 && doneLessons === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-6 text-center shadow-sm">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm font-bold text-gray-700 dark:text-slate-300">{t("chests_empty_title")}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              {t("chests_empty_desc")}
            </p>
          </div>
        )}
        {mounted && pendingChests.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              {t("chests_pending")}
              <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-xs font-extrabold px-2 py-0.5 rounded-full">{pendingChests.length}</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {pendingChests.map((chest) => {
                const rarity = getLevelRarity(chest.levelId);
                const chestEmoji = CHEST_EMOJI_BY_RARITY[rarity];
                return (
                  <button
                    key={chest.id}
                    onClick={() => setActiveChest(chest)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${RARITY_BORDER[rarity]} bg-white dark:bg-slate-800 hover:scale-105 active:scale-95 transition-transform shadow-md chest-card-glow`}
                    style={{ "--rarity": rarity } as React.CSSProperties}
                  >
                    <span className="text-4xl">{chestEmoji}</span>
                    <div className="text-center">
                      <p className="text-xs font-extrabold text-gray-800 dark:text-white">{t("chest_level", { id: chest.levelId })}</p>
                      <p className={`text-[10px] font-bold bg-gradient-to-r ${RARITY_COLORS[rarity]} bg-clip-text text-transparent`}>
                        {RARITY_LABELS[rarity]}
                      </p>
                    </div>
                    {chest.revealedCount > 0 && (
                      <span className="text-[10px] text-orange-500 font-semibold">
                        {t("chest_revealed", { done: chest.revealedCount, total: chest.rewards.length })}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EFFETS AVATAR ── */}
        {mounted && unlockedCosmetics.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-extrabold text-gray-800 dark:text-white">{t("avatar_effects_title")}</h2>
              <span className="text-xs text-purple-500 font-bold">{unlockedCosmetics.length}/{AVATAR_COSMETICS.length}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">{t("avatar_effects_desc")}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {AVATAR_COSMETICS.map((item) => {
                const owned = unlockedCosmetics.includes(item.id);
                const isEquipped = equippedCosmetic === item.id;
                return (
                  <div
                    key={item.id}
                    title={owned ? item.description : "🔒 Obtiens-le en ouvrant un coffre !"}
                    onClick={owned ? () => equipCosmetic(isEquipped ? null : item.id) : undefined}
                    className={`rounded-xl p-3 border flex flex-col items-center gap-1 text-center transition-all ${
                      owned
                        ? `bg-gradient-to-br ${RARITY_COLORS[item.rarity]} border-transparent shadow-sm cursor-pointer ${isEquipped ? "ring-2 ring-white ring-offset-1 dark:ring-offset-slate-800" : "hover:scale-105"}`
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-35 grayscale"
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <p className={`text-[10px] font-bold leading-tight ${owned ? "text-white" : "text-gray-600 dark:text-slate-400"}`}>
                      {item.name}
                    </p>
                    {owned && (
                      <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full text-white font-bold">
                        {isEquipped ? t("avatar_equipped") : RARITY_LABELS[item.rarity]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BADGES ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-800 dark:text-white">{t("badges_title")}</h2>
            {mounted && (
              <span className="text-xs font-bold text-purple-500">{earnedBadges.length}/{BADGES.length}</span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {BADGES.map((badge) => {
              const earned = mounted && earnedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 border-2 flex items-center gap-3 transition-all ${
                    earned
                      ? `bg-gradient-to-br ${badge.color} border-transparent shadow-md`
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-40 grayscale"
                  }`}
                >
                  <span className={`text-3xl shrink-0 ${earned ? "drop-shadow-md" : ""}`}>{badge.emoji}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${earned ? "text-white" : "text-gray-700 dark:text-slate-300"}`}>
                      {earned ? badge.name : `🔒 ${badge.name}`}
                    </p>
                    <p className={`text-[10px] leading-snug mt-0.5 ${earned ? "text-white/80" : "text-gray-400 dark:text-slate-500"}`}>
                      {earned ? badge.desc : badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SUCCÈS ── */}
        <AchievementsSection unlocked={mounted ? unlockedAchievements : []} t={t} />

        {/* ── ACTIONS ── */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          <Link href="/stats"
                className="col-span-3 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-3 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
            <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{t("stats_link")}</span>
            <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link href="/quiz"
                className="col-span-3 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-3 hover:border-teal-300 dark:hover:border-teal-600 transition-colors group">
            <span className="text-xl group-hover:scale-110 transition-transform">🧠</span>
            <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{t("quiz_link")}</span>
            <span className="text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link href="/shop"
                className="flex flex-col items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all group shadow-sm">
            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{t("shop_link")}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">{mounted ? gems : 0} 💎</span>
          </Link>
          <Link href="/leaderboard"
                className="flex flex-col items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-md transition-all group shadow-sm">
            <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{t("leaderboard_link")}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">{score.toLocaleString()} pts</span>
          </Link>
          <Link href="/challenges"
                className="flex flex-col items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all group shadow-sm">
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{t("challenges_link")}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">{mounted ? completedChallenges.length : 0}/{CHALLENGES.length}</span>
          </Link>
        </div>

      </div>

      {activeChest && (
        <ChestOpener
          chest={activeChest}
          onClose={() => {
            setActiveChest(null);
            setPendingChests(getPendingChests());
            setUnlockedCosmetics(getUnlockedCosmetics());
          }}
        />
      )}
    </div>
  );
}

function generateShareCard({ username, score, streak, lessons, totalLessons, badges, achievements, duelWins, locale, tLabels }: {
  username: string; score: number; streak: number; lessons: number; totalLessons: number;
  badges: number; achievements: number; duelWins: number; locale: string;
  tLabels: { points: string; streak: string; lessons: string; badges: string; duels: string; achievements: string };
}) {
  const W = 700, H = 370;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext("2d");
  if (!c) return;

  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0f0c29"); bg.addColorStop(0.55, "#302b63"); bg.addColorStop(1, "#1a0533");
  c.fillStyle = bg; c.fillRect(0, 0, W, H);

  const sh = c.createLinearGradient(0, 0, W, 0);
  sh.addColorStop(0, "transparent"); sh.addColorStop(0.5, "rgba(167,139,250,0.9)"); sh.addColorStop(1, "transparent");
  c.fillStyle = sh; c.fillRect(0, 0, W, 3);

  c.font = "bold 17px system-ui,sans-serif"; c.fillStyle = "rgba(255,255,255,0.55)";
  c.textAlign = "left"; c.textBaseline = "top"; c.fillText("🐍 PythonKids", 28, 22);

  const ax = W / 2, ay = 130, ar = 65;
  const ag = c.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar);
  ag.addColorStop(0, "#a78bfa"); ag.addColorStop(1, "#f472b6");
  c.beginPath(); c.arc(ax, ay, ar, 0, Math.PI * 2); c.fillStyle = ag; c.fill();
  c.font = "bold 54px system-ui,sans-serif"; c.fillStyle = "white";
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillText((username[0] ?? "?").toUpperCase(), ax, ay);

  const rank = getPlayerRank();
  c.font = "bold 15px system-ui,sans-serif"; c.fillStyle = "rgba(167,139,250,0.9)";
  c.textBaseline = "top"; c.fillText(rank.emoji + " " + rank.title, ax, 210);

  c.font = "bold 26px system-ui,sans-serif"; c.fillStyle = "white"; c.textBaseline = "top";
  c.fillText(username || "Codeur", ax, 232);

  const stats = [
    { emoji: "⭐", label: tLabels.points, val: score > 999 ? `${(score / 1000).toFixed(1)}k` : String(score) },
    { emoji: "🔥", label: tLabels.streak, val: `${streak}j` },
    { emoji: "📖", label: tLabels.lessons, val: `${lessons}/${totalLessons}` },
    { emoji: "🏅", label: tLabels.badges, val: String(badges) },
    { emoji: "⚔️", label: tLabels.duels, val: String(duelWins) },
    { emoji: "✨", label: tLabels.achievements, val: String(achievements) },
  ];
  const bw = 100, bh = 64, gap = 10;
  const totalW = stats.length * bw + (stats.length - 1) * gap;
  const bx0 = (W - totalW) / 2, by = 278;
  stats.forEach((s, i) => {
    const x = bx0 + i * (bw + gap);
    c.fillStyle = "rgba(255,255,255,0.08)";
    c.beginPath(); c.roundRect(x, by, bw, bh, 10); c.fill();
    c.font = "bold 18px system-ui,sans-serif"; c.fillStyle = "white"; c.textBaseline = "middle";
    c.fillText(s.emoji + " " + s.val, x + bw / 2, by + 22);
    c.font = "11px system-ui,sans-serif"; c.fillStyle = "rgba(255,255,255,0.45)";
    c.fillText(s.label, x + bw / 2, by + 48);
  });

  const today = new Date().toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  c.font = "12px system-ui,sans-serif"; c.fillStyle = "rgba(255,255,255,0.25)"; c.textBaseline = "bottom";
  c.fillText(today, W / 2, H - 12);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `pythonkids-${username || "profil"}.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

function AchievementsSection({ unlocked, t }: { unlocked: string[]; t: ReturnType<typeof useTranslations> }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold text-gray-800 dark:text-white">{t("achievements_title")}</h2>
        <span className="text-xs font-bold text-purple-500">{unlocked.length}/{ACHIEVEMENTS.length}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ACHIEVEMENTS.map((ach: Achievement) => {
          const earned = unlocked.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`rounded-2xl p-4 border-2 flex items-center gap-3 transition-all ${
                earned
                  ? `bg-gradient-to-br ${ach.color} border-transparent shadow-md`
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-40 grayscale"
              }`}
            >
              <span className={`text-3xl shrink-0 ${earned ? "drop-shadow-md" : ""}`}>{ach.emoji}</span>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${earned ? "text-white" : "text-gray-700 dark:text-slate-300"}`}>
                  {earned ? ach.name : `🔒 ${ach.name}`}
                </p>
                <p className={`text-[10px] leading-snug mt-0.5 ${earned ? "text-white/80" : "text-gray-400 dark:text-slate-500"}`}>
                  {ach.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getActivityVerbs(t: ReturnType<typeof useTranslations>): Record<ActivityEvent["type"], string> {
  return {
    lesson:    t("activity_lesson"),
    badge:     t("activity_badge"),
    challenge: t("activity_challenge"),
    streak:    t("activity_streak"),
  };
}

function timeAgo(iso: string, justNow: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return justNow;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

function FriendsWidget({ statuses, t }: { statuses: FriendStatus[]; t: ReturnType<typeof useTranslations> }) {
  const onlineCount = statuses.filter((s) => s.online).length;
  const activityVerbs = getActivityVerbs(t);

  if (statuses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">👥</span>
            <span className="text-sm font-extrabold text-gray-800 dark:text-white">{t("friends_title")}</span>
          </div>
          <a href="/friends" className="text-xs text-purple-500 dark:text-purple-400 font-semibold hover:underline">
            {t("friends_add")}
          </a>
        </div>
        <div className="px-5 pb-4 flex flex-col items-center gap-2 text-center">
          <span className="text-3xl">🤝</span>
          <p className="text-sm text-gray-500 dark:text-slate-400">{t("friends_no_friends")}</p>
          <a
            href="/friends"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-opacity mt-1"
          >
            {t("friends_find")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">👥</span>
          <span className="text-sm font-extrabold text-gray-800 dark:text-white">{t("friends_title")}</span>
          {onlineCount > 0 && (
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
              {t("friends_online", { count: onlineCount })}
            </span>
          )}
        </div>
        <a href="/friends" className="text-xs text-purple-500 dark:text-purple-400 font-semibold hover:underline">
          {t("friends_see_all")}
        </a>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {statuses.slice(0, 5).map((s) => (
          <div key={s.name} className="flex items-center gap-3 px-5 py-3">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                {s.name[0].toUpperCase()}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${s.online ? "bg-green-400" : "bg-slate-300 dark:bg-slate-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{s.name}</p>
              {s.lastEvent ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 truncate">
                  {activityVerbs[s.lastEvent.type]}
                  {s.lastEvent.type !== "streak" && (
                    <span className="text-purple-500 dark:text-purple-400"> · {s.lastEvent.detail}</span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-gray-300 dark:text-slate-600">{t("friends_no_activity")}</p>
              )}
            </div>
            {s.lastEvent && (
              <span className={`text-xs font-semibold shrink-0 ${s.online ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-slate-500"}`}>
                {timeAgo(s.lastEvent.timestamp, t("time_just_now"))}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatChip({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl py-3 px-1 text-center"
         style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
      <span className="text-base font-extrabold text-white leading-none">{value}</span>
      <span className="text-[9px] text-white/50 mt-1">{emoji} {label}</span>
    </div>
  );
}
