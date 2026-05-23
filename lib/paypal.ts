export type Pack = {
  amount: string;
  gems: number;
  description: string;
  isPremium?: boolean;
};

export const PACK_CATALOG: Record<string, Pack> = {
  gems_100:   { amount: "1.99",  gems: 100,  description: "100 gemmes PythonKids"                        },
  gems_300:   { amount: "4.99",  gems: 300,  description: "300 gemmes PythonKids"                        },
  gems_700:   { amount: "9.99",  gems: 700,  description: "700 gemmes PythonKids"                        },
  gems_1500:  { amount: "19.99", gems: 1500, description: "1500 gemmes PythonKids"                       },
  premium_bp: { amount: "4.99",  gems: 0,    description: "Pass de Combat Premium – PythonKids", isPremium: true },
};
