import { GoogleGenAI } from "@google/genai";
import { AssistantMessage, ConversationContext } from "./assistant-types";
import { buildSystemPrompt } from "./system-prompt";
import { buildConversationMemory } from "./assistant-memory";

export async function processChatMessage(
  userMessage: string,
  history: AssistantMessage[],
  context: ConversationContext
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key tidak dikonfigurasi.");
  }

  // Requirement 7: Empty State (Short-circuit to prevent hallucination)
  if (!context.hasScanData) {
    return "Saya belum menemukan hasil Body Scan pada akun Anda. Silakan lakukan Body Scan terlebih dahulu agar saya dapat memberikan rekomendasi yang sesuai dengan bentuk tubuh, ukuran pakaian, dan warna yang paling cocok.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = buildSystemPrompt(context);
  const memory = buildConversationMemory(history);

  // Convert memory to Gemini Parts format
  const contents = memory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // Append current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7, // Good balance for a conversational assistant
    },
  });

  if (!response.text) {
    throw new Error("Gagal mendapatkan respons dari asisten.");
  }

  return response.text;
}
