export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationContext {
  hasScanData: boolean;
  userProfile?: {
    firstName?: string;
    gender?: string;
    heightCm?: number;
    weightKg?: number;
  };
  latestScan?: {
    bodyShape?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    proportions?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    measurements?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geminiAnalysis?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recommendation?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clothingSize?: any;
    // Fashion Profile fields — Single Source of Truth
    gender?: string;           // "Female" | "Male" | "Unknown"
    genderConfidence?: number;
    fashionPersona?: string;   // e.g. "Minimalist", "Elegant"
    skinTone?: string;
    undertone?: string;
    recommendedColors?: { name: string; hex: string; reason?: string }[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedOutfits?: any[];
}

export interface AssistantResponse {
  success: boolean;
  message?: AssistantMessage;
  error?: string;
}

export interface ChatSession {
  messages: AssistantMessage[];
  context: ConversationContext;
}
