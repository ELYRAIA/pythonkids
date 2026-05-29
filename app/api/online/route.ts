import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "online.json");
const TTL_MS = 2 * 60 * 1000; // 2 minutes

type OnlineStore = Record<string, string>; // sessionId → ISO timestamp

function readData(): OnlineStore {
  try {
    if (!existsSync(DATA_FILE)) return {};
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as OnlineStore;
  } catch {
    return {};
  }
}

function writeData(data: OnlineStore): void {
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(data));
}

function countActive(data: OnlineStore): number {
  const cutoff = Date.now() - TTL_MS;
  return Object.values(data).filter((ts) => new Date(ts).getTime() > cutoff).length;
}

function purge(data: OnlineStore): OnlineStore {
  const cutoff = Date.now() - TTL_MS;
  return Object.fromEntries(
    Object.entries(data).filter(([, ts]) => new Date(ts).getTime() > cutoff)
  );
}

export async function GET() {
  const data = readData();
  return Response.json({ count: countActive(data) });
}

export async function POST(request: Request) {
  const body = await request.json() as { sessionId?: string };
  if (!body.sessionId || typeof body.sessionId !== "string" || body.sessionId.length > 64) {
    return Response.json({ error: "Invalid" }, { status: 400 });
  }

  const data = purge(readData());
  data[body.sessionId] = new Date().toISOString();
  writeData(data);
  return Response.json({ count: countActive(data) });
}
