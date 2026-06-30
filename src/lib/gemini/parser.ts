import { GeminiVisionResponse } from "./types";

export function parseGeminiResponse(rawText: string): GeminiVisionResponse {
  try {
    // Sometimes LLMs return markdown code blocks despite being told not to.
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "");
    }
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "");
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/```$/, "");
    }

    const data = JSON.parse(cleaned.trim());

    // Basic validation to ensure the schema matches
    if (
      typeof data.skinTone !== "string" ||
      typeof data.confidence !== "number" ||
      !Array.isArray(data.recommendedColors)
    ) {
      throw new Error("Invalid schema structure");
    }

    return data as GeminiVisionResponse;
  } catch (error) {
    console.error("Gemini JSON Parsing Error:", error, rawText);
    throw new Error("Failed to parse Gemini response");
  }
}
