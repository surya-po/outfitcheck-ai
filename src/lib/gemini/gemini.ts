"use server";

import { GoogleGenAI } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from "./prompt";
import { parseGeminiResponse } from "./parser";
import { GeminiVisionResult } from "./types";

export async function analyzeImageWithGemini(
  imageBase64: string,
  measurementsJson: string,
  retries = 1
): Promise<GeminiVisionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set.");
    return { isAvailable: false, error: "API key not configured." };
  }

  // Remove the data URI prefix if it exists
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const ai = new GoogleGenAI({ apiKey });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data,
                },
              },
              {
                text: `Analyze this image and return the JSON profile. Here is the absolute body measurements calculated by Computer Vision: ${measurementsJson}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
          temperature: 0.2, // Low temperature for consistent JSON
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsedData = parseGeminiResponse(text);
      return { isAvailable: true, data: parsedData };
    } catch (error) {
      console.error(`Gemini Vision attempt ${attempt + 1} failed:`, error);
      if (attempt === retries) {
        return { 
          isAvailable: true, // It is configured, just failed
          error: error instanceof Error ? error.message : "Unknown AI Error" 
        };
      }
    }
  }

  return { isAvailable: true, error: "Exhausted retries" };
}
