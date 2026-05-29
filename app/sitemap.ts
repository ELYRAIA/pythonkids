import type { MetadataRoute } from "next";

const BASE_URL = "https://pythonkids.app";

const STATIC_ROUTES = [
  "",
  "/challenges",
  "/shop",
  "/leaderboard",
  "/battle-pass",
  "/editor",
  "/duel",
  "/pet",
  "/certificate",
  "/detente",
  "/quiz",
  "/stats",
  "/friends",
  "/mistakes",
  "/avatars",
  "/projects",
  "/parent",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "en"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
