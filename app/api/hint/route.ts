import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  const { code, instruction, expectedOutput, currentOutput, levelName, hintCount } = await request.json() as {
    code: string;
    instruction: string;
    expectedOutput: string;
    currentOutput?: string;
    levelName?: string;
    hintCount?: number;
  };

  if (!code || !instruction) {
    return Response.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith("sk-ant-VOTRE")) {
    return Response.json({ hint: "Configure ta clé ANTHROPIC_API_KEY dans .env.local pour activer les indices IA !" });
  }

  try {
    const isEasy = (hintCount ?? 0) < 2;
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: `Tu es un professeur de Python bienveillant pour enfants (8-18 ans).
Tu donnes UN SEUL indice court, encourageant et adapté à l'âge.
${isEasy ? "Donne un indice vague qui fait réfléchir sans donner la réponse." : "Donne un indice plus précis car l'élève est bloqué depuis un moment."}
Termine toujours par une phrase d'encouragement.
Réponds en français. Max 3 phrases.`,
      messages: [
        {
          role: "user",
          content: `Exercice : ${instruction}
Sortie attendue : ${expectedOutput}
Code de l'élève :
\`\`\`python
${code}
\`\`\`
${currentOutput ? `Sa sortie actuelle : ${currentOutput}` : ""}
${levelName ? `Niveau : ${levelName}` : ""}

Donne un indice adapté.`,
        },
      ],
    });

    const hint = (message.content[0] as { type: string; text: string }).text;
    return Response.json({ hint });
  } catch {
    return Response.json({ error: "Erreur IA" }, { status: 500 });
  }
}
