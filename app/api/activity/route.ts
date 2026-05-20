import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "activity.json");
const MAX_EVENTS = 500;

export interface ActivityEvent {
  username: string;
  type: "lesson" | "badge" | "challenge" | "streak";
  detail: string;
  timestamp: string;
}

function readData(): ActivityEvent[] {
  try {
    if (!existsSync(DATA_FILE)) {
      mkdirSync(join(process.cwd(), "data"), { recursive: true });
      writeFileSync(DATA_FILE, "[]");
      return [];
    }
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as ActivityEvent[];
  } catch {
    return [];
  }
}

function writeData(data: ActivityEvent[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const friends = url.searchParams.get("friends")?.split(",").filter(Boolean) ?? [];
  const all = readData();
  if (friends.length === 0) return Response.json([]);
  const filtered = all
    .filter((e) => friends.includes(e.username))
    .slice(-100)
    .reverse();
  return Response.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<ActivityEvent>;
  if (!body.username || !body.type || !body.detail) {
    return Response.json({ error: "Invalid" }, { status: 400 });
  }

  const data = readData();
  data.push({
    username: body.username,
    type: body.type,
    detail: body.detail,
    timestamp: new Date().toISOString(),
  });

  if (data.length > MAX_EVENTS) data.splice(0, data.length - MAX_EVENTS);
  writeData(data);
  return Response.json({ ok: true });
}
