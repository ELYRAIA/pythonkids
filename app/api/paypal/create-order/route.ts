const PAYPAL_API = process.env.PAYPAL_API_URL ?? "https://api-m.sandbox.paypal.com";

export const PACK_CATALOG = {
  gems_100:  { amount: "1.99",  gems: 100,  description: "100 gemmes PythonKids"  },
  gems_300:  { amount: "4.99",  gems: 300,  description: "300 gemmes PythonKids"  },
  gems_700:  { amount: "9.99",  gems: 700,  description: "700 gemmes PythonKids"  },
  gems_1500: { amount: "19.99", gems: 1500, description: "1500 gemmes PythonKids" },
} as const;

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
  const { packId } = await request.json() as { packId: string };
  const pack = PACK_CATALOG[packId as keyof typeof PACK_CATALOG];
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
