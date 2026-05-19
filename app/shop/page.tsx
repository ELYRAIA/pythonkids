"use client";

import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import {
  SHOP_SKINS, SHOP_STICKERS, getOwnedShopItems, getEquippedSkin,
  getEquippedStickers, purchaseItem, equipSkin, toggleSticker,
  RARITY_COLORS_SHOP, RARITY_LABELS_SHOP, RARITY_BORDER_SHOP,
  type ShopItem,
} from "@/lib/shop";
import { getGems } from "@/lib/gems";
import { buyStreakFreeze, getStreakFreezeCount } from "@/lib/streak";
import {
  COLOR_THEMES, getOwnedThemes, getActiveThemeId, purchaseTheme, applyTheme,
} from "@/lib/themes";
import { spendGems } from "@/lib/gems";

type Tab = "skins" | "stickers" | "consumables" | "themes";

function ItemCard({
  item,
  owned,
  equipped,
  gems,
  onBuy,
  onEquip,
}: {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  gems: number;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
}) {
  const canAfford = gems >= item.price;

  return (
    <div className={`rounded-2xl border-2 ${RARITY_BORDER_SHOP[item.rarity]} bg-white dark:bg-slate-800 p-4 flex flex-col gap-3 ${equipped ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900" : ""}`}>

      {/* Preview */}
      {item.type === "skin" ? (
        <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl shadow-sm`}>
          {item.emoji}
        </div>
      ) : (
        <div className="w-full h-16 flex items-center justify-center text-5xl">
          {item.emoji}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <p className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight">{item.name}</p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r ${RARITY_COLORS_SHOP[item.rarity]} text-white shrink-0`}>
            {RARITY_LABELS_SHOP[item.rarity]}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500">{item.description}</p>
      </div>

      {/* Action */}
      {owned ? (
        <button
          onClick={() => onEquip(item.id)}
          className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${
            equipped
              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-300"
          }`}
        >
          {equipped ? "✓ Équipé" : "Équiper"}
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
          {canAfford ? `Acheter — ${item.price} 💎` : `${item.price} 💎 (manque ${item.price - gems})`}
        </button>
      )}
    </div>
  );
}

export default function ShopPage() {
  const [tab, setTab] = useState<Tab>("skins");
  const [gems, setGems] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [equippedSkin, setEquippedSkinState] = useState<string | null>(null);
  const [equippedStickers, setEquippedStickersState] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [freezeCount, setFreezeCount] = useState(0);
  const [freezeBought, setFreezeBought] = useState(false);
  const [ownedThemes, setOwnedThemes] = useState<string[]>(["default"]);
  const [activeTheme, setActiveTheme] = useState("default");

  const refresh = () => {
    setGems(getGems());
    setOwned(getOwnedShopItems());
    setEquippedSkinState(getEquippedSkin());
    setEquippedStickersState(getEquippedStickers());
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

  const handleBuy = (id: string) => {
    if (purchaseItem(id)) refresh();
  };

  const handleEquip = (id: string) => {
    const item = [...SHOP_SKINS, ...SHOP_STICKERS].find((i) => i.id === id);
    if (!item) return;
    if (item.type === "skin") {
      equipSkin(equippedSkin === id ? null : id);
    } else {
      toggleSticker(id);
    }
    refresh();
  };

  const items = tab === "skins" ? SHOP_SKINS : SHOP_STICKERS;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="w-full px-6 py-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">🛒 Boutique</h1>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Dépense tes gemmes pour personnaliser ton avatar !</p>
          </div>
          <div className="shrink-0 bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-4 py-2 rounded-2xl text-center shadow-md">
            <p className="text-xl font-extrabold leading-none">{mounted ? gems : "—"}</p>
            <p className="text-[10px] font-bold opacity-80 leading-none mt-0.5">💎 gemmes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "skins", label: "🎨 Skins" },
            { key: "stickers", label: "🏷️ Stickers" },
            { key: "consumables", label: "⚡ Consommables" },
            { key: "themes", label: "🎨 Thèmes" },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                tab === t.key
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Description */}
        {tab !== "consumables" && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
            {tab === "skins"
              ? "Les skins changent la couleur de fond de ton avatar. Tu peux en équiper un seul à la fois."
              : "Les stickers s'affichent sur ton profil. Tu peux en équiper jusqu'à 3 en même temps."}
          </p>
        )}

        {/* Grid skins / stickers */}
        {tab !== "consumables" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                owned={mounted && owned.includes(item.id)}
                equipped={
                  mounted &&
                  (item.type === "skin"
                    ? equippedSkin === item.id
                    : equippedStickers.includes(item.id))
                }
                gems={mounted ? gems : 0}
                onBuy={handleBuy}
                onEquip={handleEquip}
              />
            ))}
          </div>
        )}

        {/* Consommables */}
        {tab === "consumables" && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Les consommables s&apos;utilisent automatiquement au bon moment. Achète-en plusieurs pour constituer un stock !
            </p>

            {/* Streak freeze */}
            <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-3xl shadow-md shrink-0">
                  🧊
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-extrabold text-gray-800 dark:text-white">Bouclier de streak</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Rare</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">
                    Protège ton streak si tu rates un jour. Utilisé automatiquement le lendemain.
                  </p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    🧊 Stock actuel : {mounted ? freezeCount : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (buyStreakFreeze()) {
                      setFreezeBought(true);
                      refresh();
                      setTimeout(() => setFreezeBought(false), 2000);
                    }
                  }}
                  disabled={!mounted || gems < 50}
                  className={`flex-1 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                    mounted && gems >= 50
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 shadow-sm"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {freezeBought ? "✓ Acheté !" : `Acheter — 50 💎`}
                </button>
                {mounted && gems < 50 && (
                  <span className="text-xs text-gray-400">Il te manque {50 - gems} 💎</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Thèmes */}
        {tab === "themes" && (
          <div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
              Les thèmes changent les couleurs de fond de toute l&apos;interface. Achète-les une fois, utilise-les pour toujours !
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOR_THEMES.map((theme) => {
                const isOwned = mounted && ownedThemes.includes(theme.id);
                const isActive = mounted && activeTheme === theme.id;
                const canAfford = mounted && gems >= theme.price;

                return (
                  <div
                    key={theme.id}
                    className={`rounded-2xl border-2 bg-white dark:bg-slate-800 p-4 flex flex-col gap-3 ${
                      isActive ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900 border-purple-300 dark:border-purple-600" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {/* Swatch */}
                    <div className={`w-full h-12 rounded-xl bg-gradient-to-br ${theme.preview} flex items-center justify-center text-2xl shadow-sm`}>
                      {theme.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight">{theme.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{theme.description}</p>
                    </div>

                    {/* Action */}
                    {isOwned || theme.price === 0 ? (
                      <button
                        onClick={() => {
                          applyTheme(theme.id);
                          setActiveTheme(theme.id);
                        }}
                        className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${
                          isActive
                            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-300"
                        }`}
                      >
                        {isActive ? "✓ Actif" : "Appliquer"}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            spendGems(theme.price);
                            purchaseTheme(theme.id);
                            applyTheme(theme.id);
                            refresh();
                          }
                        }}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded-full text-xs font-extrabold transition-all ${
                          canAfford
                            ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white hover:opacity-90 shadow-sm"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {canAfford ? `Acheter — ${theme.price} 💎` : `${theme.price} 💎`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hint */}
        <p className="text-center text-xs text-gray-300 dark:text-slate-600 mt-8">
          💎 Gagne des gemmes en ouvrant des coffres dans la série quotidienne ou en terminant des niveaux !
        </p>
      </div>
    </div>
  );
}
