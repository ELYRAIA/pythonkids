import { PACK_CATALOG } from "@/lib/paypal";

const PAYPAL_API = process.env.PAYPAL_API_URL ?? "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
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
  const { packId } = await request.json() as { packId: string };
  const pack = PACK_CATALOG[packId];
  if (!pack) return Response.json({ error: "Pack inconnu" }, { status: 400 });

  try {
    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: packId,
          amount: { currency_code: "EUR", value: pack.amount },
          description: pack.description,
        }],
      }),
    });
    const order = await res.json() as { id: string };
    return Response.json({ id: order.id });
  } catch {
    return Response.json({ error: "Erreur PayPal" }, { status: 500 });
  }
}
