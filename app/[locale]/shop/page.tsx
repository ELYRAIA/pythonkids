"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTranslations } from "next-intl";
import AppHeader from "@/components/AppHeader";
import {
  SHOP_SKINS, SHOP_STICKERS, SHOP_TITLES, getOwnedShopItems, getEquippedSkin,
  getEquippedStickers, getEquippedTitle, purchaseItem, equipSkin, toggleSticker, toggleTitle, grantItem,
  RARITY_COLORS_SHOP, RARITY_LABELS_SHOP, RARITY_BORDER_SHOP,
  type ShopItem, type ShopRarity,
} from "@/lib/shop";
import { getGems, addGems, spendGems } from "@/lib/gems";
import { buyStreakFreeze, getStreakFreezeCount } from "@/lib/streak";
import { checkAchievements } from "@/lib/achievements";
import { playPurchaseSound } from "@/lib/sounds";
import {
  COLOR_THEMES, getOwnedThemes, getActiveThemeId, purchaseTheme, applyTheme,
} from "@/lib/themes";

type Tab = "skins" | "stickers" | "titles" | "consumables" | "themes" | "gems";
type RarityFilter = ShopRarity | "all";
type OwnedFilter = "all" | "owned" | "unowned";

const DAILY_DISCOUNT = 0.75;

const GEM_PACKS = [
  { id: "gems_100",  labelKey: "gem_pack_label",    amount: 100,  price: "1,99 €",  bonus: null,    color: "from-sky-400 to-cyan-500",      emoji: "💎" },
  { id: "gems_300",  labelKey: "gem_pack_bag",       amount: 300,  price: "4,99 €",  bonus: "+20%",  color: "from-violet-500 to-purple-600", emoji: "💎" },
  { id: "gems_700",  labelKey: "gem_pack_chest",     amount: 700,  price: "9,99 €",  bonus: "+40%",  color: "from-orange-400 to-pink-500",   emoji: "💎" },
  { id: "gems_1500", labelKey: "gem_pack_treasure",  amount: 1500, price: "19,99 €", bonus: "BEST",  color: "from-yellow-400 to-orange-500", emoji: "🌟" },
] as const;

type PromoReward = { gems: number } | { skinId: string; skinName: string };
const PROMO_CODES: Record<string, PromoReward> = {
  BIENVENUE:      { gems: 50 },
  PYTHON2025:     { gems: 100 },
  STREAKMASTER:   { gems: 75 },
  DUELCHAMPION:   { gems: 120 },
  MILLIONNAIRE:   { gems: 1000000 },
  SERPENTMAGIQUE: { skinId: "skin_serpent", skinName: "Écailles de Serpent" },
};
const USED_CODES_KEY = "pythonkids_used_codes";

function getDailyFeatured(items: ShopItem[]): ShopItem | null {
  const buyable = items.filter(i => i.price > 0 && !i.secret && !i.battlePass);
  if (!buyable.length) return null;
  const dateStr = new Date().toISOString().slice(0, 10);
  const hash = [...dateStr].reduce((a, c) => a + c.charCodeAt(0), 0);
  return buyable[hash % buyable.length];
}

function ItemCard({
  item, owned, equipped, gems, flash, onBuy, onEquip, t,
}: {
  item: ShopItem; owned: boolean; equipped: boolean; gems: number;
  flash: boolean; onBuy: (id: string) => void; onEquip: (id: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const canAfford = gems >= item.price;
  const isLegendary = item.rarity === "legendary";

  return (
    <div className={`rounded-2xl border-2 ${
      isLegendary ? "border-yellow-400 shop-legendary" : RARITY_BORDER_SHOP[item.rarity]
    } bg-white dark:bg-slate-800 p-4 flex flex-col gap-3 card-hover ${
      equipped ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900" : ""
    } ${flash ? "shop-buy-pop" : ""}`}>
      {item.type === "skin" ? (
        <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl shadow-sm`}>
          {item.emoji}
        </div>
      ) : item.type === "title" ? (
        <div className="w-full h-16 flex items-center justify-center">
          <span className={`px-3 py-1.5 rounded-full text-sm font-extrabold text-white bg-gradient-to-r ${item.gradient} shadow-sm`}>
            {item.emoji} {item.tagText}
          </span>
        </div>
      ) : (
        <div className="w-full h-16 flex items-center justify-center text-5xl">
          {item.emoji}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <p className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight">{item.name}</p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r ${RARITY_COLORS_SHOP[item.rarity]} text-white shrink-0`}>
            {RARITY_LABELS_SHOP[item.rarity]}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500">{item.description}</p>
      </div>
      {owned ? (
        <button
          onClick={() => onEquip(item.id)}
          className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${
            equipped
              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-300"
          }`}
        >
          {equipped ? t("equipped") : t("equip")}
        </button>
      ) : (
        <button
          onClick={() => onBuy(item.id)}
          disabled={!canAfford}
          className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${
            canAfford
              ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white hover:opacity-90 shadow-sm"
              : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
          }`}
        >
          {canAfford
            ? t("buy", { price: item.price })
            : t("not_enough", { price: item.price, shortage: item.price - gems })}
        </button>
      )}
    </div>
  );
}

export default function ShopPage() {
  const t = useTranslations("Shop");
  const [tab, setTab] = useState<Tab>("skins");
  const [gems, setGems] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [equippedSkin, setEquippedSkinState] = useState<string | null>(null);
  const [equippedStickers, setEquippedStickersState] = useState<string[]>([]);
  const [equippedTitle, setEquippedTitleState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [freezeCount, setFreezeCount] = useState(0);
  const [freezeBought, setFreezeBought] = useState(false);
  const [ownedThemes, setOwnedThemes] = useState<string[]>(["default"]);
  const [activeTheme, setActiveTheme] = useState("default");
  const [boughtPack, setBoughtPack] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "ok" | "ok_skin" | "used" | "invalid">("idle");
  const [promoSkinName, setPromoSkinName] = useState("");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [ownedFilter, setOwnedFilter] = useState<OwnedFilter>("all");
  const [purchaseFlash, setPurchaseFlash] = useState<string | null>(null);

  const refresh = () => {
    setGems(getGems());
    setOwned(getOwnedShopItems());
    setEquippedSkinState(getEquippedSkin());
    setEquippedStickersState(getEquippedStickers());
    setEquippedTitleState(getEquippedTitle());
    setFreezeCount(getStreakFreezeCount());
    setOwnedThemes(getOwnedThemes());
    setActiveTheme(getActiveThemeId());
  };

  useEffect(() => {
    setMounted(true);
    refresh();
    window.addEventListener("pythonkids:gems", refresh);
    window.addEventListener("pythonkids:shop", refresh);
    return () => {
      window.removeEventListener("pythonkids:gems", refresh);
      window.removeEventListener("pythonkids:shop", refresh);
    };
  }, []);

  const triggerFlash = (id: string) => {
    setPurchaseFlash(id);
    setTimeout(() => setPurchaseFlash(null), 500);
  };

  const handleBuy = (id: string) => {
    if (purchaseItem(id)) {
      playPurchaseSound();
      triggerFlash(id);
      refresh();
      checkAchievements();
    }
  };

  const handleBuyDaily = (item: ShopItem) => {
    const price = Math.floor(item.price * DAILY_DISCOUNT);
    if (!mounted || gems < price) return;
    if (spendGems(price)) {
      grantItem(item.id);
      playPurchaseSound();
      triggerFlash(item.id);
      refresh();
      checkAchievements();
      window.dispatchEvent(new CustomEvent("pythonkids:toast", {
        detail: { msg: `${item.name} débloqué avec -25% !`, emoji: "⚡", type: "normal" },
      }));
    }
  };

  const handleEquip = (id: string) => {
    const item = [...SHOP_SKINS, ...SHOP_STICKERS, ...SHOP_TITLES].find((i) => i.id === id);
    if (!item) return;
    if (item.type === "skin") {
      equipSkin(equippedSkin === id ? null : id);
    } else if (item.type === "title") {
      toggleTitle(id);
    } else {
      toggleSticker(id);
    }
    refresh();
    checkAchievements();
  };

  const redeemPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const reward = PROMO_CODES[code];
    if (!reward) { setPromoStatus("invalid"); return; }
    try {
      const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? "[]");
      if (used.includes(code)) { setPromoStatus("used"); return; }
      used.push(code);
      localStorage.setItem(USED_CODES_KEY, JSON.stringify(used));
    } catch {}
    if ("gems" in reward) {
      addGems(reward.gems);
      refresh();
      setPromoInput("");
      setPromoStatus("ok");
    } else {
      grantItem(reward.skinId);
      refresh();
      setPromoInput("");
      setPromoSkinName(reward.skinName);
      setPromoStatus("ok_skin");
      checkAchievements({ secretCode: true });
    }
  };

  const rawItems = tab === "skins" ? SHOP_SKINS : tab === "stickers" ? SHOP_STICKERS : SHOP_TITLES;

  const filteredItems = rawItems.filter((i) => {
    if (i.secret && !(mounted && owned.includes(i.id))) return false;
    if (rarityFilter !== "all" && i.rarity !== rarityFilter) return false;
    if (ownedFilter === "owned" && !(mounted && owned.includes(i.id))) return false;
    if (ownedFilter === "unowned" && mounted && owned.includes(i.id)) return false;
    return true;
  });

  const ownedCount = mounted ? rawItems.filter(i => !i.secret && !i.battlePass && owned.includes(i.id)).length : 0;
  const totalCount = rawItems.filter(i => !i.secret && !i.battlePass).length;
  const ownedPct = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

  const dailyFeatured = (() => {
    if (tab === "consumables" || tab === "themes" || tab === "gems") return null;
    const item = getDailyFeatured(rawItems);
    if (!item || (mounted && owned.includes(item.id))) return null;
    return item;
  })();

  const TABS = [
    { key: "skins" as Tab,       label: t("tab_skins") },
    { key: "stickers" as Tab,    label: t("tab_stickers") },
    { key: "titles" as Tab,      label: t("tab_titles") },
    { key: "consumables" as Tab, label: t("tab_consumables") },
    { key: "themes" as Tab,      label: t("tab_themes") },
    { key: "gems" as Tab,        label: t("tab_gems") },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="w-full px-6 py-8 max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">{t("title")}</h1>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t("subtitle")}</p>
          </div>
          <div className="shrink-0 bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-4 py-2 rounded-2xl text-center shadow-md">
            <p className="text-xl font-extrabold leading-none">{mounted ? gems : "—"}</p>
            <p className="text-[10px] font-bold opacity-80 leading-none mt-0.5">{t("gems_label")}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => { setTab(tb.key); setRarityFilter("all"); setOwnedFilter("all"); }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                tab === tb.key
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {tab !== "consumables" && tab !== "themes" && tab !== "gems" && (
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
                {tab === "skins" ? t("skins_desc") : tab === "titles" ? t("titles_desc") : t("stickers_desc")}
              </p>
              {mounted && (
                <div className="shrink-0 text-right min-w-[64px]">
                  <p className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">{ownedCount} / {totalCount}</p>
                  <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500" style={{ width: `${ownedPct}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex gap-1.5 flex-wrap">
                {(["all", "common", "rare", "epic", "legendary"] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      rarityFilter === r
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {r === "all" ? t("rarity_all") : RARITY_LABELS_SHOP[r]}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 ml-auto">
                {(["all", "unowned", "owned"] as const).map(o => (
                  <button
                    key={o}
                    onClick={() => setOwnedFilter(o)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      ownedFilter === o
                        ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {o === "all" ? t("owned_all") : o === "owned" ? t("owned_owned") : t("owned_unowned")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {dailyFeatured && (
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-0.5 shadow-lg">
            <div className="rounded-[14px] bg-white dark:bg-slate-800 p-4 flex items-center gap-4">
              <div className="text-4xl shrink-0">{dailyFeatured.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                    {t("daily_offer")}
                  </span>
                </div>
                <p className="font-extrabold text-gray-800 dark:text-white text-sm leading-tight">{dailyFeatured.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs line-through text-gray-400">{dailyFeatured.price} 💎</span>
                  <span className="text-sm font-extrabold text-orange-500">{Math.floor(dailyFeatured.price * DAILY_DISCOUNT)} 💎</span>
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                    {t("daily_discount")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleBuyDaily(dailyFeatured)}
                disabled={!mounted || gems < Math.floor(dailyFeatured.price * DAILY_DISCOUNT)}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-white disabled:opacity-40 hover:opacity-90 transition-all shadow-sm"
              >
                {t("equip")}
              </button>
            </div>
          </div>
        )}

        {tab !== "consumables" && tab !== "themes" && tab !== "gems" && (
          filteredItems.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-sm font-bold text-gray-400 dark:text-slate-500">{t("no_items")}</p>
              <button
                onClick={() => { setRarityFilter("all"); setOwnedFilter("all"); }}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-700 text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
              >
                {t("reset_filters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  owned={mounted && owned.includes(item.id)}
                  equipped={mounted && (item.type === "skin" ? equippedSkin === item.id : item.type === "title" ? equippedTitle === item.id : equippedStickers.includes(item.id))}
                  gems={mounted ? gems : 0}
                  flash={purchaseFlash === item.id}
                  onBuy={handleBuy}
                  onEquip={handleEquip}
                  t={t}
                />
              ))}
            </div>
          )
        )}

        {tab === "consumables" && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 dark:text-slate-500">{t("consumables_desc")}</p>
            <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-3xl shadow-md shrink-0">🧊</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-extrabold text-gray-800 dark:text-white">{t("streak_freeze")}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">{t("streak_freeze_rare")}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">{t("streak_freeze_desc")}</p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {t("streak_freeze_count", { count: mounted ? freezeCount : "—" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { if (buyStreakFreeze()) { setFreezeBought(true); refresh(); setTimeout(() => setFreezeBought(false), 2000); } }}
                  disabled={!mounted || gems < 50}
                  className={`flex-1 py-2.5 rounded-full text-sm font-extrabold transition-all ${mounted && gems >= 50 ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 shadow-sm" : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"}`}
                >
                  {freezeBought ? t("streak_freeze_bought") : t("streak_freeze_buy")}
                </button>
                {mounted && gems < 50 && (
                  <span className="text-xs text-gray-400">{t("streak_freeze_missing", { count: 50 - gems })}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "themes" && (
          <div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">{t("themes_desc")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOR_THEMES.map((theme) => {
                const isOwned = mounted && ownedThemes.includes(theme.id);
                const isActive = mounted && activeTheme === theme.id;
                const canAfford = mounted && gems >= theme.price;
                return (
                  <div key={theme.id} className={`rounded-2xl border-2 bg-white dark:bg-slate-800 p-4 flex flex-col gap-3 card-hover ${isActive ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900 border-purple-300 dark:border-purple-600" : "border-slate-200 dark:border-slate-700"}`}>
                    <div className={`w-full h-12 rounded-xl bg-gradient-to-br ${theme.preview} flex items-center justify-center text-2xl shadow-sm`}>{theme.emoji}</div>
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight">{theme.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{theme.description}</p>
                    </div>
                    {isOwned || theme.price === 0 ? (
                      <button onClick={() => { applyTheme(theme.id); setActiveTheme(theme.id); }} className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${isActive ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-300"}`}>
                        {isActive ? t("theme_active") : t("theme_apply")}
                      </button>
                    ) : (
                      <button onClick={() => { if (canAfford) { spendGems(theme.price); purchaseTheme(theme.id); applyTheme(theme.id); refresh(); } }} disabled={!canAfford} className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${canAfford ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white hover:opacity-90 shadow-sm" : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"}`}>
                        {canAfford ? t("buy", { price: theme.price }) : `${theme.price} 💎`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "gems" && (
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "", currency: "EUR" }}>
            <div className="space-y-6">
              <p className="text-xs text-gray-400 dark:text-slate-500">{t("gems_desc")}</p>
              <div className="grid grid-cols-2 gap-3">
                {GEM_PACKS.map((pack) => {
                  const justBought = boughtPack === pack.id;
                  return (
                    <div key={pack.id} className={`relative rounded-2xl border-2 bg-white dark:bg-slate-800 p-4 flex flex-col gap-3 ${pack.bonus === "BEST" ? "border-yellow-400 dark:border-yellow-500" : "border-slate-200 dark:border-slate-700"}`}>
                      {pack.bonus && (
                        <span className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${pack.bonus === "BEST" ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-green-400 to-emerald-500"}`}>
                          {pack.bonus === "BEST" ? t("gem_pack_best") : pack.bonus}
                        </span>
                      )}
                      <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${pack.color} flex items-center justify-center text-4xl shadow-sm`}>{pack.emoji}</div>
                      <div>
                        <p className="text-sm font-extrabold text-gray-800 dark:text-white">{t(pack.labelKey)}</p>
                        <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 leading-tight">{pack.amount} 💎</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">{pack.price}</p>
                      </div>
                      {justBought ? (
                        <div className="w-full py-2.5 rounded-xl text-sm font-extrabold text-center bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                          {t("gem_pack_received", { amount: pack.amount })}
                        </div>
                      ) : (
                        <PayPalButtons
                          style={{ layout: "vertical", shape: "pill", label: "pay", height: 40 }}
                          createOrder={async () => {
                            const res = await fetch("/api/paypal/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packId: pack.id }) });
                            const data = await res.json() as { id?: string; error?: string };
                            if (!data.id) throw new Error(data.error ?? t("gem_error"));
                            return data.id;
                          }}
                          onApprove={async (data) => {
                            const res = await fetch("/api/paypal/capture-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderID: data.orderID }) });
                            const result = await res.json() as { gems?: number; error?: string };
                            if (!result.gems) throw new Error(result.error ?? t("gem_payment_failed"));
                            addGems(result.gems);
                            refresh();
                            setBoughtPack(pack.id);
                            window.dispatchEvent(new CustomEvent("pythonkids:toast", { detail: { msg: t("gem_added", { amount: result.gems }), emoji: "💎", type: "normal" } }));
                            setTimeout(() => setBoughtPack(null), 3000);
                          }}
                          onError={() => {
                            window.dispatchEvent(new CustomEvent("pythonkids:toast", { detail: { msg: t("gem_cancelled"), emoji: "❌", type: "normal" } }));
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎁</span>
                  <p className="font-extrabold text-gray-800 dark:text-white text-sm">{t("promo_title")}</p>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">{t("promo_desc")}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus("idle"); }}
                    onKeyDown={(e) => e.key === "Enter" && redeemPromo()}
                    placeholder={t("promo_placeholder")}
                    maxLength={20}
                    className="flex-1 border-2 border-purple-200 dark:border-slate-600 rounded-xl px-4 py-2 text-sm font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-purple-400 dark:bg-slate-700 dark:text-white"
                  />
                  <button onClick={redeemPromo} disabled={!promoInput.trim()} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity">
                    {t("promo_button")}
                  </button>
                </div>
                {promoStatus === "ok" && <p className="text-green-600 dark:text-green-400 text-xs font-bold mt-2">{t("promo_ok")}</p>}
                {promoStatus === "ok_skin" && <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-2">{t("promo_ok_skin", { name: promoSkinName })}</p>}
                {promoStatus === "used" && <p className="text-orange-500 text-xs font-bold mt-2">{t("promo_used")}</p>}
                {promoStatus === "invalid" && <p className="text-red-500 text-xs font-bold mt-2">{t("promo_invalid")}</p>}
              </div>
              <p className="text-center text-[11px] text-gray-300 dark:text-slate-600">{t("payment_secure")}</p>
            </div>
          </PayPalScriptProvider>
        )}

        {tab !== "gems" && (
          <p className="text-center text-xs text-gray-300 dark:text-slate-600 mt-8">{t("gems_hint")}</p>
        )}
      </div>
    </div>
  );
}
