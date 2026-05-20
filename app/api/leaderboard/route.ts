import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "leaderboard.json");

export interface LeaderboardEntry {
  username: string;
  score: number;
  updatedAt: string;
  skinGradient?: string;
}

function readData(): LeaderboardEntry[] {
  try {
    if (!existsSync(DATA_FILE)) {
      mkdirSync(join(process.cwd(), "data"), { recursive: true });
      writeFileSync(DATA_FILE, "[]");
      return [];
    }
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

function writeData(data: LeaderboardEntry[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readData();
  const sorted = [...data].sort((a, b) => b.score - a.score).slice(0, 50);
  return Response.json(sorted);
}

export async function POST(request: Request) {
  const body = await request.json() as { username?: string; score?: number; skinGradient?: string };
  const { username, score, skinGradient } = body;

  if (!username || typeof score !== "number" || score < 0) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const data = readData();
  const idx = data.findIndex((e) => e.username === username);

  if (idx >= 0) {
    const updated: LeaderboardEntry = {
      ...data[idx],
      updatedAt: new Date().toISOString(),
      ...(skinGradient ? { skinGradient } : {}),
    };
    if (score > data[idx].score) updated.score = score;
    data[idx] = updated;
  } else {
    data.push({ username, score, updatedAt: new Date().toISOString(), ...(skinGradient ? { skinGradient } : {}) });
  }

  writeData(data);
  return Response.json({ ok: true });
}
