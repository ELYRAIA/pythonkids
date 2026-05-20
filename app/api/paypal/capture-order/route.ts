import { PACK_CATALOG } from "@/app/api/paypal/create-order/route";

const PAYPAL_API = process.env.PAYPAL_API_URL ?? "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function POST(request: Request) {
  const { orderID } = await request.json() as { orderID: string };
  if (!orderID) return Response.json({ error: "orderID manquant" }, { status: 400 });

  try {
    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const order = await res.json() as {
      status: string;
      purchase_units: Array<{ custom_id?: string }>;
    };

    if (order.status !== "COMPLETED") {
      return Response.json({ error: "Paiement non complété" }, { status: 400 });
    }

    const packId = order.purchase_units[0]?.custom_id as keyof typeof PACK_CATALOG | undefined;
    const pack = packId ? PACK_CATALOG[packId] : null;
    if (!pack) return Response.json({ error: "Pack introuvable" }, { status: 400 });

    return Response.json({ gems: pack.gems, status: "COMPLETED" });
  } catch {
    return Response.json({ error: "Erreur PayPal" }, { status: 500 });
  }
}
