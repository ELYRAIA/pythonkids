import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "duels.json");

export interface DuelPlayer {
  username: string;
  status: "waiting" | "coding" | "solved";
  solvedAt: string | null;
}

export interface DuelRoom {
  roomId: string;
  challengeId: string;
  players: DuelPlayer[];
  createdAt: string;
}

function readData(): DuelRoom[] {
  try {
    if (!existsSync(DATA_FILE)) { writeFileSync(DATA_FILE, "[]"); return []; }
    const all = JSON.parse(readFileSync(DATA_FILE, "utf-8")) as DuelRoom[];
    // Nettoyer les rooms de plus de 2h
    const cutoff = Date.now() - 2 * 60 * 60 * 1000;
    return all.filter((r) => new Date(r.createdAt).getTime() > cutoff);
  } catch { return []; }
}

function writeData(data: DuelRoom[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");
  const rooms = readData();
  if (!roomId) return Response.json(rooms);
  const room = rooms.find((r) => r.roomId === roomId);
  if (!room) return Response.json({ error: "Room introuvable" }, { status: 404 });
  return Response.json(room);
}

export async function POST(request: Request) {
  const body = await request.json() as {
    action: "create" | "join" | "solve";
    roomId?: string;
    username?: string;
    challengeId?: string;
  };

  const rooms = readData();

  if (body.action === "create") {
    if (!body.username || !body.challengeId) return Response.json({ error: "Invalid" }, { status: 400 });
    const room: DuelRoom = {
      roomId: randomId(),
      challengeId: body.challengeId,
      players: [{ username: body.username, status: "coding", solvedAt: null }],
      createdAt: new Date().toISOString(),
    };
    rooms.push(room);
    writeData(rooms);
    return Response.json(room);
  }

  if (body.action === "join") {
    if (!body.username || !body.roomId) return Response.json({ error: "Invalid" }, { status: 400 });
    const idx = rooms.findIndex((r) => r.roomId === body.roomId);
    if (idx === -1) return Response.json({ error: "Room introuvable" }, { status: 404 });
    const room = rooms[idx];
    if (room.players.length >= 2) return Response.json({ error: "Room pleine" }, { status: 409 });
    if (room.players.find((p) => p.username === body.username)) return Response.json(room);
    room.players.push({ username: body.username, status: "coding", solvedAt: null });
    writeData(rooms);
    return Response.json(room);
  }

  if (body.action === "solve") {
    if (!body.username || !body.roomId) return Response.json({ error: "Invalid" }, { status: 400 });
    const idx = rooms.findIndex((r) => r.roomId === body.roomId);
    if (idx === -1) return Response.json({ error: "Room introuvable" }, { status: 404 });
    const player = rooms[idx].players.find((p) => p.username === body.username);
    if (player && player.status !== "solved") {
      player.status = "solved";
      player.solvedAt = new Date().toISOString();
    }
    writeData(rooms);
    return Response.json(rooms[idx]);
  }

  return Response.json({ error: "Action inconnue" }, { status: 400 });
}
