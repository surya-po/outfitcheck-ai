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

    // Ensure gender defaults to Unknown if missing or invalid
    if (!["Female", "Male", "Unknown"].includes(data.gender)) {
      data.gender = "Unknown";
      data.genderConfidence = 0;
    }

    // Ensure genderConfidence is a number
    if (typeof data.genderConfidence !== "number") {
      data.genderConfidence = 50;
    }

    // Ensure fashionPersona defaults to Unknown if missing
    const validPersonas = [
      "Minimalist", "Elegant", "Casual", "Chic", "Feminine",
      "Streetwear", "Smart Casual", "Relaxed", "Contemporary", "Classic", "Unknown"
    ];
    if (!validPersonas.includes(data.fashionPersona)) {
      data.fashionPersona = "Unknown";
    }

    return data as GeminiVisionResponse;
  } catch (error) {
    console.error("Gemini JSON Parsing Error:", error, rawText);
    throw new Error("Failed to parse Gemini response");
  }
}
