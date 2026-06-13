import { Resend } from "resend";

export async function POST(request: Request) {
  const { email, username, stats } = await request.json() as {
    email: string;
    username: string;
    stats: {
      doneLessons: number;
      totalLessons: number;
      completedChallenges: number;
      currentStreak: number;
      longestStreak: number;
      earnedBadges: number;
      totalBadges: number;
      bpLevel: number;
      timeMinutes: number;
    };
  };

  if (!email?.includes("@") || !username) {
    return Response.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_VOTRE")) {
    return Response.json({ ok: true, fallback: true });
  }

  const resend = new Resend(apiKey);
  const timeH = Math.floor(stats.timeMinutes / 60);
  const timeM = stats.timeMinutes % 60;
  const timeStr = timeH > 0 ? `${timeH}h ${timeM}min` : `${timeM} min`;

  try {
    await resend.emails.send({
      from: "PythonKids <onboarding@resend.dev>",
      to: email,
      subject: `📊 Rapport de progression PythonKids — ${username}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px;background:#f8f9fa;border-radius:16px">
          <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <div style="font-size:48px;margin-bottom:8px">🐍</div>
            <h1 style="color:white;margin:0;font-size:22px">Rapport de progression</h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:15px">${username} · PythonKids</p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
              <div style="font-size:28px;font-weight:900;color:#7c3aed">${stats.doneLessons}/${stats.totalLessons}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:4px">📖 Leçons</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
              <div style="font-size:28px;font-weight:900;color:#f59e0b">${stats.currentStreak}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:4px">🔥 Jours consécutifs</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
              <div style="font-size:28px;font-weight:900;color:#10b981">${stats.completedChallenges}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:4px">🎯 Défis réussis</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
              <div style="font-size:28px;font-weight:900;color:#3b82f6">${timeStr}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:4px">⏱️ Temps d'apprentissage</div>
            </div>
          </div>

          <div style="background:white;border-radius:12px;padding:16px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
            <h3 style="margin:0 0 12px;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.05em">Autres stats</h3>
            <div style="space-y:8px">
              <p style="margin:6px 0;font-size:14px;color:#4b5563">🏅 <strong>${stats.earnedBadges}</strong> badges obtenus sur ${stats.totalBadges}</p>
              <p style="margin:6px 0;font-size:14px;color:#4b5563">⚔️ Niveau Pass de Combat : <strong>${stats.bpLevel}</strong></p>
              <p style="margin:6px 0;font-size:14px;color:#4b5563">🔥 Meilleure série : <strong>${stats.longestStreak} jours</strong></p>
            </div>
          </div>

          <div style="background:#ede9fe;border-radius:12px;padding:16px;margin-bottom:20px">
            <p style="margin:0;font-size:13px;color:#5b21b6">
              💡 <strong>Conseil :</strong> Encouragez ${username} à pratiquer un peu chaque jour.
              Même 10 minutes suffisent pour maintenir la progression et le streak !
            </p>
          </div>

          <p style="text-align:center;font-size:12px;color:#9ca3af;margin:0">
            Rapport généré par <a href="https://pythonkids.fr" style="color:#7c3aed">PythonKids</a>
          </p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
