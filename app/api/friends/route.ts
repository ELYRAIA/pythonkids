import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "friends.json");

type FriendsData = Record<string, string[]>;

function readData(): FriendsData {
  try {
    if (!existsSync(DATA_FILE)) {
      mkdirSync(join(process.cwd(), "data"), { recursive: true });
      writeFileSync(DATA_FILE, "{}");
      return {};
    }
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as FriendsData;
  } catch {
    return {};
  }
}

function writeData(data: FriendsData): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) return Response.json({ error: "username required" }, { status: 400 });
  const data = readData();
  return Response.json(data[username] ?? []);
}

export async function POST(request: Request) {
  const body = await request.json() as {
    action: "add" | "remove";
    username: string;
    friend: string;
  };
  const { action, username, friend } = body;

  if (!username || !friend || username === friend) {
    return Response.json({ error: "Invalid" }, { status: 400 });
  }

  const data = readData();
  data[username] = data[username] ?? [];
  data[friend] = data[friend] ?? [];

  if (action === "add") {
    if (!data[username].includes(friend)) data[username].push(friend);
    if (!data[friend].includes(username)) data[friend].push(username);
  } else if (action === "remove") {
    data[username] = data[username].filter((f) => f !== friend);
    data[friend] = data[friend].filter((f) => f !== username);
  } else {
    return Response.json({ error: "Action inconnue" }, { status: 400 });
  }

  writeData(data);
  return Response.json({ ok: true });
}
