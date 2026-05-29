import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const SUBS_FILE = path.join(DATA_DIR, "push-subscriptions.json");

async function readSubs(): Promise<PushSubscriptionJSON[]> {
  try {
    const raw = await fs.readFile(SUBS_FILE, "utf-8");
    return JSON.parse(raw) as PushSubscriptionJSON[];
  } catch {
    return [];
  }
}

async function writeSubs(subs: PushSubscriptionJSON[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SUBS_FILE, JSON.stringify(subs, null, 2));
}

export async function POST(request: Request) {
  const sub = await request.json() as PushSubscriptionJSON;
  if (!sub?.endpoint) return Response.json({ error: "Subscription invalide" }, { status: 400 });

  const subs = await readSubs();
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    await writeSubs(subs);
  }
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { endpoint } = await request.json() as { endpoint: string };
  const subs = await readSubs();
  await writeSubs(subs.filter((s) => s.endpoint !== endpoint));
  return Response.json({ ok: true });
}
