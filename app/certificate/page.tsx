"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProgress, BADGES } from "@/lib/progress";
import { getCompletedChallenges } from "@/lib/challenges";

const ALL_LEVEL_BADGES = ["level_0", "level_1", "level_2", "level_3", "level_4", "level_5"];

function downloadCertificatePNG(username: string, badgeCount: number, challengeCount: number, date: string) {
  const W = 1200, H = 848;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fond blanc avec bordure dégradée simulée
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Bordure dorée
  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ec4899";
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // En-tête gradient simulé (rectangle violet)
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#9333ea");
  grad.addColorStop(1, "#ec4899");
  ctx.fillStyle = grad;
  ctx.fillRect(40, 40, W - 80, 8);
  ctx.fillRect(40, H - 48, W - 80, 8);

  // Serpent décoratif (coins)
  ctx.font = "48px serif";
  ctx.globalAlpha = 0.15;
  ctx.fillText("🐍", 50, 90);
  ctx.fillText("🐍", W - 95, 90);
  ctx.fillText("🐍", 50, H - 50);
  ctx.fillText("🐍", W - 95, H - 50);
  ctx.globalAlpha = 1;

  // Logo
  ctx.font = "bold 56px serif";
  ctx.fillStyle = "#9333ea";
  ctx.textAlign = "center";
  ctx.fillText("🐍", W / 2, 130);

  ctx.font = "bold 48px sans-serif";
  const titleGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
  titleGrad.addColorStop(0, "#9333ea");
  titleGrad.addColorStop(1, "#ec4899");
  ctx.fillStyle = titleGrad;
  ctx.fillText("PythonKids", W / 2, 200);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("ACADÉMIE DE PROGRAMMATION PYTHON", W / 2, 235);

  // Ligne séparatrice
  ctx.strokeStyle = "#e9d5ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 300, 260);
  ctx.lineTo(W / 2 + 300, 260);
  ctx.stroke();

  // Texte principal
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("CERTIFICAT D'EXCELLENCE", W / 2, 305);

  ctx.font = "22px sans-serif";
  ctx.fillStyle = "#374151";
  ctx.fillText("Ceci certifie que", W / 2, 350);

  ctx.font = "bold 64px sans-serif";
  ctx.fillStyle = titleGrad;
  ctx.fillText(username || "Codeur", W / 2, 430);

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#4b5563";
  const desc = "a brillamment complété les niveaux de PythonKids et maîtrise";
  ctx.fillText(desc, W / 2, 480);
  ctx.fillText("les fondamentaux de la programmation Python.", W / 2, 510);

  // Ligne séparatrice
  ctx.beginPath();
  ctx.moveTo(W / 2 - 300, 545);
  ctx.lineTo(W / 2 + 300, 545);
  ctx.stroke();

  // Stats
  const statsY = 610;
  const cols = [W / 2 - 280, W / 2, W / 2 + 280];
  const statsData = [
    { emoji: "🏅", value: String(badgeCount), label: "badges gagnés" },
    { emoji: "🎯", value: String(challengeCount), label: "défis réussis" },
    { emoji: "📅", value: date, label: "date d'obtention" },
  ];
  statsData.forEach(({ emoji, value, label }, i) => {
    ctx.font = "36px serif";
    ctx.fillStyle = "#374151";
    ctx.fillText(emoji, cols[i], statsY - 10);
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#9333ea";
    ctx.fillText(value, cols[i], statsY + 28);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(label, cols[i], statsY + 52);
  });

  // Signature
  ctx.font = "italic bold 28px serif";
  ctx.fillStyle = titleGrad;
  ctx.fillText("PythonKids Academy", W / 2, H - 90);

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("pythonkids.app · Apprendre à coder, c'est super ! 🚀", W / 2, H - 60);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificat-pythonkids-${(username || "codeur").toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function CertificatePage() {
  const [username, setUsername] = useState("");
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [completionDate, setCompletionDate] = useState("");
  const [challengeCount, setChallengeCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem("pythonkids_username") ?? "Codeur";
    const progress = getProgress();
    const challenges = getCompletedChallenges();

    setUsername(name);
    setEarnedBadges(progress.earnedBadges);
    setChallengeCount(challenges.length);

    const levelsDone = ALL_LEVEL_BADGES.filter((b) => progress.earnedBadges.includes(b));
    const done = levelsDone.length >= 5; // au moins 5 niveaux sur 6
    setAllDone(done);

    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });
    setCompletionDate(date);
  }, []);

  const badgesToShow = BADGES.filter((b) => mounted && earnedBadges.includes(b.id));

  if (!mounted || !allDone) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 text-center ${mounted ? "fade-in" : "invisible"}`}>
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-3">
          Certificat non disponible
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 max-w-sm">
          Tu dois terminer au moins 5 niveaux pour obtenir ton certificat. Continue à apprendre !
        </p>
        <Link href="/" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center py-10 px-4">
      {/* Boutons hors certificat */}
      <div className="flex gap-3 mb-8 print:hidden flex-wrap justify-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 font-medium self-center">
          ← Accueil
        </Link>
        <span className="text-gray-300 self-center">|</span>
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
        >
          📄 Imprimer / PDF
        </button>
        <button
          onClick={() => downloadCertificatePNG(username, badgesToShow.length, challengeCount, completionDate)}
          className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
        >
          🖼️ Télécharger PNG
        </button>
        <button
          onClick={async () => {
            const text = `🎓 ${username} vient d'obtenir son certificat PythonKids ! Il/elle maîtrise les fondamentaux de Python. #PythonKids #Code`;
            if (typeof navigator !== "undefined" && navigator.share) {
              try { await navigator.share({ title: "Mon certificat PythonKids 🎓", text, url: window.location.href }); } catch {}
            } else {
              await navigator.clipboard.writeText(text + "\n" + window.location.href);
              alert("Lien copié dans le presse-papier !");
            }
          }}
          className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
        >
          📤 Partager
        </button>
        <Link href="/parent" className="text-sm text-blue-500 hover:text-blue-700 font-medium self-center">
          👨‍👩‍👦 Vue parent
        </Link>
      </div>

      {/* Certificat */}
      <div
        id="certificate"
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-double border-purple-300 dark:border-purple-600 max-w-2xl w-full p-10 text-center relative overflow-hidden"
      >
        {/* Coins décoratifs */}
        <div className="absolute top-4 left-4 text-4xl opacity-20">🐍</div>
        <div className="absolute top-4 right-4 text-4xl opacity-20">🐍</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">🐍</div>
        <div className="absolute bottom-4 right-4 text-4xl opacity-20">🐍</div>

        {/* Header */}
        <div className="mb-6">
          <div className="text-5xl mb-3">🐍</div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-1">
            PythonKids
          </h1>
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-widest">
            Académie de Programmation Python
          </p>
        </div>

        {/* Titre */}
        <div className="border-t border-b border-purple-100 dark:border-purple-800 py-5 mb-6">
          <p className="text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Certificat d&apos;Excellence
          </p>
          <p className="text-base text-gray-600 dark:text-slate-300">Ceci certifie que</p>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent my-3">
            {username}
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            a brillamment complété les niveaux de <strong>PythonKids</strong> et maîtrise
            les fondamentaux de la programmation Python, incluant les variables,
            les conditions, les boucles, les fonctions et la programmation orientée objet.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { emoji: "🏅", value: `${badgesToShow.length}`, label: "badges gagnés" },
            { emoji: "🎯", value: `${challengeCount}`, label: "défis réussis" },
            { emoji: "📅", value: completionDate, label: "date d'obtention" },
          ].map((s) => (
            <div key={s.label} className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-3">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-bold text-purple-700 dark:text-purple-300 text-sm">{s.value}</div>
              <div className="text-xs text-gray-400 dark:text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {badgesToShow.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Badges obtenus</p>
            <div className="flex flex-wrap justify-center gap-3">
              {badgesToShow.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gradient-to-r ${badge.color} text-white rounded-xl px-3 py-2 flex items-center gap-2 text-sm shadow-md`}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="font-bold text-xs">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="border-t border-purple-100 dark:border-purple-800 pt-5">
          <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-serif italic">
            PythonKids Academy
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            🌐 pythonkids.app · Apprendre à coder, c&apos;est super ! 🚀
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate {
            position: fixed !important;
            top: 0; left: 0;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: 4px double #a855f7 !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
          }
          .dark\\:bg-slate-800 { background: white !important; }
          .dark\\:text-white { color: black !important; }
          .bg-gradient-to-r { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
