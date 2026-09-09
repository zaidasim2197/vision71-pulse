import { createServerFn } from "@tanstack/react-start";

export interface AIServerRequest {
  question: string;
  structuredFacts: string;
  isSupported: boolean;
  fallbackAnswer: string;
  chatHistory?: { sender: "user" | "ai"; text: string }[];
}

export interface AIServerResponse {
  answer: string;
  source: string;
}

export const queryGeminiServerFn = createServerFn({ method: "POST" })
  .validator((data: AIServerRequest) => data)
  .handler(async ({ data }): Promise<AIServerResponse> => {
    const { question, structuredFacts, isSupported, fallbackAnswer, chatHistory } = data;

    if (!isSupported) {
      return {
        answer: "I can't help with that. I can only answer questions about the available Sales & Operations data.",
        source: "Dataset Guardrails",
      };
    }

    const apiKey = process.env["GEMINI_API_KEY"] || "AIzaSyCrOmG9m2xjel91Aqb2KlQxIuepNXeUvL8";

    try {
      const historyText =
        chatHistory && chatHistory.length > 0
          ? `Recent Conversation Context:\n` +
            chatHistory
              .slice(-6)
              .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
              .join("\n") +
            `\n\n`
          : "";

      const prompt = `You are the PulseOps Technologies B2B Sales & Operations Intelligence Assistant.

${historyText}Current User Question: "${question}"
Verified Data Facts from Engine: "${structuredFacts}"

STRICT GUIDELINES:
1. Carefully read and directly answer the user's specific question using executive business reasoning grounded in the verified data facts.
2. If the user asks for advice or opinion (e.g., purchasing items, going outside to buy products, restocking, strategy), evaluate the verified inventory and sales facts, and provide clear, actionable executive guidance directly addressing their intent.
3. If the user asks for clarification (e.g. "sorry?", "pardon?", "what do you mean?"), explain or clarify the preceding response clearly.
4. ALWAYS BOLD ALL KEY METRICS, VALUES, PRODUCT NAMES, CUSTOMER NAMES, AND NUMBERS (e.g., **PKR 113.62M**, **7 Out of Stock**, **20.25%**, **52 orders**).
5. Do NOT include conversational filler like "Based on dataset records...". State facts directly, cleanly, and authoritatively. Never hallucinate.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1000, temperature: 0.1 },
          }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          answer: fallbackAnswer,
          source: "PulseOps Data Engine",
        };
      }

      const resData = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const geminiText =
        resData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? fallbackAnswer;

      return {
        answer: geminiText,
        source: "Gemini 3.5 AI + PulseOps Data Engine",
      };
    } catch {
      return {
        answer: fallbackAnswer,
        source: "PulseOps Data Engine",
      };
    }
  });
