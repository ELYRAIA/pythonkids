// Script de rappel push quotidien — à appeler par un cron job Railway ou cron-job.org
// Usage : node scripts/send-push.mjs
// Env requis : APP_URL, PUSH_SEND_SECRET

const url = `${process.env.APP_URL ?? "http://localhost:3000"}/api/push/send`;
const secret = process.env.PUSH_SEND_SECRET ?? "";

if (!secret) {
  console.error("PUSH_SEND_SECRET non défini");
  process.exit(1);
}

const res = await fetch(url, {
  method: "POST",
  headers: { "x-push-secret": secret },
});

const data = await res.json();
console.log(`Push envoyé : ${data.sent} abonnés, ${data.failed ?? 0} échecs`);
