import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import IntlProvider from "@/components/IntlProvider";
import GlobalUI from "@/components/GlobalUI";
import AchievementCelebration from "@/components/AchievementCelebration";
import FeedbackButton from "@/components/FeedbackButton";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const messagesMap = { fr, en } as Record<string, typeof fr>;

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = messagesMap[locale] ?? fr;
  const meta = messages.Metadata;

  return {
    title: {
      default: meta.title,
      template: `%s | PythonKids`,
    },
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "PythonKids",
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  const messages = messagesMap[locale] ?? fr;

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
      <GlobalUI />
      <AchievementCelebration />
      <FeedbackButton />
    </IntlProvider>
  );
}
