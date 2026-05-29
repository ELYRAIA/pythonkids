import webpush from "web-push";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const SUBS_FILE = path.join(DATA_DIR, "push-subscriptions.json");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT ?? "mailto:contact@pythonkids.fr",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export async function POST(request: Request) {
  const secret = request.headers.get("x-push-secret");
  if (secret !== process.env.PUSH_SEND_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  let subs: PushSubscriptionJSON[] = [];
  try {
    const raw = await fs.readFile(SUBS_FILE, "utf-8");
    subs = JSON.parse(raw) as PushSubscriptionJSON[];
  } catch {
    return Response.json({ sent: 0, message: "Aucun abonné" });
  }

  const payload = JSON.stringify({
    title: "🐍 PythonKids — Ta leçon du jour !",
    body: "N'oublie pas ta leçon Python aujourd'hui pour garder ton streak 🔥",
    url: "/",
    icon: "/manifest.json",
  });

  let sent = 0;
  const failed: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub as Parameters<typeof webpush.sendNotification>[0], payload);
        sent++;
      } catch {
        failed.push(sub.endpoint ?? "");
      }
    })
  );

  // Nettoyer les subscriptions mortes
  if (failed.length > 0) {
    const valid = subs.filter((s) => !failed.includes(s.endpoint ?? ""));
    await fs.writeFile(SUBS_FILE, JSON.stringify(valid, null, 2));
  }

  return Response.json({ sent, failed: failed.length });
}
