import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const LOCALE_REDIRECTS = [
  "challenges", "shop", "leaderboard", "battle-pass", "editor",
  "duel", "pet", "certificate", "detente", "quiz", "stats",
  "friends", "mistakes", "avatars", "projects", "parent",
  "profile", "profiles", "levels",
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["web-push"],
  async redirects() {
    return [
      ...LOCALE_REDIRECTS.map((route) => ({
        source: `/${route}`,
        destination: `/fr/${route}`,
        permanent: false,
      })),
      ...LOCALE_REDIRECTS.map((route) => ({
        source: `/${route}/:path*`,
        destination: `/fr/${route}/:path*`,
        permanent: false,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
