// ---------------------------------------------------------------------------
// Mistral-klient. Kaldes KUN server-side (server actions) — nøglen findes
// alene i miljøet og når aldrig klienten. Erstatter prototypens Cloudflare
// Worker-relay, som kun eksisterede pga. CORS under test.
// ---------------------------------------------------------------------------

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

export type MistralModel = "mistral-large-latest" | "mistral-medium-latest" | "mistral-small-latest";

export async function callMistral<T>(
  model: MistralModel,
  systemPrompt: string,
  userPrompt: string,
  temperature: number
): Promise<T> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY er ikke sat - tilføj den i .env (server-side).");
  }

  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mistral svarede HTTP ${res.status}: ${body.slice(0, 500)}`);
  }

  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return JSON.parse(data.choices[0].message.content) as T;
}

// Modellen kan trods JSON-mode finde på at pakke værdier ind i arrays/objekter —
// asText folder alt ned til én almindelig tekststreng (fra prototypen).
export function asText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(asText).join(" ");
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    for (const key of ["text", "tekst", "value", "sætning", "content", "body"]) {
      if (typeof obj[key] === "string") return obj[key] as string;
    }
    return Object.values(obj).map(asText).join(" ");
  }
  return String(v);
}
