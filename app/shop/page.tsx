"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import AppHeader from "@/components/AppHeader";
import {
  SHOP_SKINS, SHOP_STICKERS, getOwnedShopItems, getEquippedSkin,
  getEquippedStickers, purchaseItem, equipSkin, toggleSticker,
  RARITY_COLORS_SHOP, RARITY_LABELS_SHOP, RARITY_BORDER_SHOP,
  type ShopItem,
} from "@/lib/shop";
import { getGems, addGems } from "@/lib/gems";
import { buyStreakFreeze, getStreakFreezeCount } from "@/lib/streak";
import {
  COLOR_THEMES, getOwnedThemes, getActiveThemeId, purchaseTheme, applyTheme,
} from "@/lib/themes";
import { spendGems } from "@/lib/gems";

type Tab = "skins" | "stickers" | "consumables" | "themes" | "gems";

const GEM_PACKS = [
  { id: "gems_100",  label: "Sachet",  amount: 100,  price: "1,99 €",  bonus: null,    color: "from-sky-400 to-cyan-500",     emoji: "💎" },
  { id: "gems_300",  label: "Sac",     amount: 300,  price: "4,99 €",  bonus: "+20%",  color: "from-violet-500 to-purple-600", emoji: "💎" },
  { id: "gems_700",  label: "Coffre",  amount: 700,  price: "9,99 €",  bonus: "+40%",  color: "from-orange-400 to-pink-500",  emoji: "💎" },
  { id: "gems_1500", label: "Trésor",  amount: 1500, price: "19,99 €", bonus: "BEST",  color: "from-yellow-400 to-orange-500", emoji: "🌟" },
] as const;

const PROMO_CODES: Record<string, number> = {
  BIENVENUE:     50,
  PYTHON2025:   100,
  STREAKMASTER:  75,
  DUELCHAMPION: 120,
  MILLIONNAIRE: 1000000,
};
const USED_CODES_KEY = "pythonkids_used_codes";

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
  const [boughtPack, setBoughtPack] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "ok" | "used" | "invalid">("idle");

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

  const redeemPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const amount = PROMO_CODES[code];
    if (!amount) { setPromoStatus("invalid"); return; }
    try {
      const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? "[]");
      if (used.includes(code)) { setPromoStatus("used"); return; }
      used.push(code);
      localStorage.setItem(USED_CODES_KEY, JSON.stringify(used));
    } catch {}
    addGems(amount);
    refresh();
    setPromoInput("");
    setPromoStatus("ok");
    window.dispatchEvent(new CustomEvent("pythonkids:toast", {
      detail: { msg: `Code promo : +${amount} gemmes !`, emoji: "🎁", type: "normal" },
    }));
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
            { key: "gems", label: "💎 Recharger" },
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
        {tab !== "consumables" && tab !== "themes" && tab !== "gems" && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
            {tab === "skins"
              ? "Les skins changent la couleur de fond de ton avatar. Tu peux en équiper un seul à la fois."
              : "Les stickers s'affichent sur ton profil. Tu peux en équiper jusqu'à 3 en même temps."}
          </p>
        )}

        {/* Grid skins / stickers */}
        {tab !== "consumables" && tab !== "themes" && tab !== "gems" && (
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

        {/* Gemmes — recharge */}
        {tab === "gems" && (
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "", currency: "EUR" }}>
          <div className="space-y-6">

            {/* Packs */}
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
                Recharge ton solde de gemmes pour débloquer des skins, stickers et thèmes exclusifs !
              </p>
              <div className="grid grid-cols-2 gap-3">
                {GEM_PACKS.map((pack) => {
                  const justBought = boughtPack === pack.id;
                  return (
                    <div
                      key={pack.id}
                      className={`relative rounded-2xl border-2 bg-white dark:bg-slate-800 p-4 flex flex-col gap-3 ${
                        pack.bonus === "BEST"
                          ? "border-yellow-400 dark:border-yellow-500"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {/* Badge bonus */}
                      {pack.bonus && (
                        <span className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                          pack.bonus === "BEST"
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : "bg-gradient-to-r from-green-400 to-emerald-500"
                        }`}>
                          {pack.bonus === "BEST" ? "⭐ Meilleur prix" : pack.bonus}
                        </span>
                      )}

                      {/* Visuel */}
                      <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${pack.color} flex items-center justify-center text-4xl shadow-sm`}>
                        {pack.emoji}
                      </div>

                      {/* Info */}
                      <div>
                        <p className="text-sm font-extrabold text-gray-800 dark:text-white">{pack.label}</p>
                        <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 leading-tight">
                          {pack.amount} 💎
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">{pack.price}</p>
                      </div>

                      {/* Bouton PayPal ou confirmation */}
                      {justBought ? (
                        <div className="w-full py-2.5 rounded-xl text-sm font-extrabold text-center bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                          ✓ {pack.amount} gemmes reçues !
                        </div>
                      ) : (
                        <PayPalButtons
                          style={{ layout: "vertical", shape: "pill", label: "pay", height: 40 }}
                          createOrder={async () => {
                            const res = await fetch("/api/paypal/create-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ packId: pack.id }),
                            });
                            const data = await res.json() as { id?: string; error?: string };
                            if (!data.id) throw new Error(data.error ?? "Erreur création commande");
                            return data.id;
                          }}
                          onApprove={async (data) => {
                            const res = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ orderID: data.orderID }),
                            });
                            const result = await res.json() as { gems?: number; error?: string };
                            if (!result.gems) throw new Error(result.error ?? "Paiement échoué");
                            addGems(result.gems);
                            refresh();
                            setBoughtPack(pack.id);
                            window.dispatchEvent(new CustomEvent("pythonkids:toast", {
                              detail: { msg: `+${result.gems} gemmes reçues !`, emoji: "💎", type: "normal" },
                            }));
                            setTimeout(() => setBoughtPack(null), 3000);
                          }}
                          onError={() => {
                            window.dispatchEvent(new CustomEvent("pythonkids:toast", {
                              detail: { msg: "Paiement annulé", emoji: "❌", type: "normal" },
                            }));
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Code promo */}
            <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🎁</span>
                <p className="font-extrabold text-gray-800 dark:text-white text-sm">Code promo</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">
                Tu as un code cadeau ? Entre-le ici pour recevoir tes gemmes.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus("idle"); }}
                  onKeyDown={(e) => e.key === "Enter" && redeemPromo()}
                  placeholder="EX : BIENVENUE"
                  maxLength={20}
                  className="flex-1 border-2 border-purple-200 dark:border-slate-600 rounded-xl px-4 py-2 text-sm font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-purple-400 dark:bg-slate-700 dark:text-white"
                />
                <button
                  onClick={redeemPromo}
                  disabled={!promoInput.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  Valider
                </button>
              </div>
              {promoStatus === "ok" && (
                <p className="text-green-600 dark:text-green-400 text-xs font-bold mt-2">
                  ✓ Code validé ! Gemmes ajoutées à ton solde.
                </p>
              )}
              {promoStatus === "used" && (
                <p className="text-orange-500 text-xs font-bold mt-2">
                  ⚠️ Ce code a déjà été utilisé sur cet appareil.
                </p>
              )}
              {promoStatus === "invalid" && (
                <p className="text-red-500 text-xs font-bold mt-2">
                  ❌ Code invalide. Vérifie l'orthographe !
                </p>
              )}
            </div>

            <p className="text-center text-[11px] text-gray-300 dark:text-slate-600">
              Paiement sécurisé via PayPal · Les gemmes sont créditées instantanément
            </p>
          </div>
          </PayPalScriptProvider>
        )}

        {/* Hint */}
        {tab !== "gems" && (
        <p className="text-center text-xs text-gray-300 dark:text-slate-600 mt-8">
          💎 Gagne des gemmes en ouvrant des coffres dans la série quotidienne ou en terminant des niveaux !
        </p>
        )}
      </div>
    </div>
  );
}
