import { createServerFn } from "@tanstack/react-start";

export interface AIServerRequest {
  question: string;
  structuredFacts: string;
  isSupported: boolean;
  fallbackAnswer: string;
}

export interface AIServerResponse {
  answer: string;
  source: string;
}

export const queryGeminiServerFn = createServerFn({ method: "POST" })
  .validator((data: AIServerRequest) => data)
  .handler(async ({ data }): Promise<AIServerResponse> => {
    const { question, structuredFacts, isSupported, fallbackAnswer } = data;

    if (!isSupported) {
      return {
        answer: "I can't help with that. I can only answer questions about the available Sales & Operations data.",
        source: "Dataset Guardrails",
      };
    }

    const apiKey = process.env["GEMINI_API_KEY"];

    if (!apiKey) {
      return {
        answer: fallbackAnswer,
        source: "PulseOps Data Engine",
      };
    }

    try {
      const prompt = `You are the PulseOps Technologies B2B Sales & Operations Intelligence Assistant.
User question: "${question}"
Verified Dataset Fact: "${structuredFacts}"

STRICT INSTRUCTIONS:
1. Formulate a 1 to 3 sentence concise, natural response based ONLY on the verified dataset facts provided.
2. Maintain exact numbers and currency (PKR) without modification.
3. Do NOT invent, estimate, calculate, or add extraneous facts.
4. Keep tone professional, direct, and executive-ready.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250, temperature: 0.2 },
          }),
        },
      );

      if (!response.ok) {
        return {
          answer: fallbackAnswer,
          source: "PulseOps Data Engine (Server Direct)",
        };
      }

      const resData = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const geminiText =
        resData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? fallbackAnswer;

      return {
        answer: geminiText,
        source: "Gemini 2.0 AI + PulseOps Data Engine",
      };
    } catch {
      return {
        answer: fallbackAnswer,
        source: "PulseOps Data Engine (Fallback)",
      };
    }
  });
