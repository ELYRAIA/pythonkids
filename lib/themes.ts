export interface ColorTheme {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
  preview: string;  // Tailwind gradient classes for preview swatch
  bodyFrom: string; // CSS hex color
  bodyTo:   string;
  bodyVia:  string;
  darkBodyFrom: string;
  darkBodyTo:   string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "default",
    name: "Violet (défaut)",
    emoji: "💜",
    price: 0,
    description: "Le thème original de PythonKids",
    preview: "from-indigo-400 via-purple-400 to-pink-400",
    bodyFrom: "#eef2ff", bodyVia: "#f5f3ff", bodyTo: "#fdf2f8",
    darkBodyFrom: "#020617", darkBodyTo: "#0f0a1f",
  },
  {
    id: "green",
    name: "Forêt",
    emoji: "🌿",
    price: 100,
    description: "Tons naturels verts et émeraude",
    preview: "from-green-400 via-emerald-400 to-teal-400",
    bodyFrom: "#f0fdf4", bodyVia: "#ecfdf5", bodyTo: "#f0fdfa",
    darkBodyFrom: "#020d06", darkBodyTo: "#041a12",
  },
  {
    id: "ocean",
    name: "Océan",
    emoji: "🌊",
    price: 100,
    description: "Bleus profonds comme la mer",
    preview: "from-blue-400 via-cyan-400 to-sky-400",
    bodyFrom: "#eff6ff", bodyVia: "#ecfeff", bodyTo: "#f0f9ff",
    darkBodyFrom: "#020612", darkBodyTo: "#021a2a",
  },
  {
    id: "sunset",
    name: "Coucher de soleil",
    emoji: "🌅",
    price: 150,
    description: "Oranges et roses flamboyants",
    preview: "from-orange-400 via-amber-400 to-yellow-400",
    bodyFrom: "#fff7ed", bodyVia: "#fffbeb", bodyTo: "#fefce8",
    darkBodyFrom: "#150800", darkBodyTo: "#1a0e00",
  },
  {
    id: "rose",
    name: "Fleurs de cerisier",
    emoji: "🌸",
    price: 150,
    description: "Roses doux et romantiques",
    preview: "from-pink-400 via-rose-400 to-red-300",
    bodyFrom: "#fdf2f8", bodyVia: "#fff1f2", bodyTo: "#ffe4e6",
    darkBodyFrom: "#120008", darkBodyTo: "#200010",
  },
  {
    id: "night",
    name: "Nuit étoilée",
    emoji: "🌌",
    price: 200,
    description: "Thème sombre et mystérieux",
    preview: "from-slate-600 via-indigo-800 to-purple-900",
    bodyFrom: "#0f172a", bodyVia: "#1e1b4b", bodyTo: "#0f0c29",
    darkBodyFrom: "#000000", darkBodyTo: "#0a0015",
  },
];

const KEY = "pythonkids_color_theme";
const KEY_OWNED = "pythonkids_owned_themes";

export function getActiveThemeId(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem(KEY) ?? "default";
}

export function getOwnedThemes(): string[] {
  if (typeof window === "undefined") return ["default"];
  try {
    const raw = localStorage.getItem(KEY_OWNED);
    const owned = raw ? (JSON.parse(raw) as string[]) : [];
    return owned.includes("default") ? owned : ["default", ...owned];
  } catch { return ["default"]; }
}

export function purchaseTheme(id: string): void {
  const owned = getOwnedThemes();
  if (!owned.includes(id)) {
    localStorage.setItem(KEY_OWNED, JSON.stringify([...owned, id]));
  }
}

export function applyTheme(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, id);
  const theme = COLOR_THEMES.find((t) => t.id === id);
  if (!theme) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const from = isDark ? theme.darkBodyFrom : theme.bodyFrom;
  const to   = isDark ? theme.darkBodyTo   : theme.bodyTo;
  const via  = isDark ? theme.darkBodyTo   : (theme.bodyVia ?? theme.bodyFrom);
  document.body.style.background = `linear-gradient(135deg, ${from}, ${via}, ${to})`;
  document.body.style.minHeight = "100vh";
}
