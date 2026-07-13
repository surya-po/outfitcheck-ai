import { AssistantMessage } from "./assistant-types";

const MAX_MEMORY_MESSAGES = 6; // Keep last 3 exchanges (user + assistant = 6)

export function buildConversationMemory(history: AssistantMessage[]): AssistantMessage[] {
  if (!history || history.length === 0) {
    return [];
  }
  
  // Return the last N messages to preserve context without blowing up token limit
  return history.slice(-MAX_MEMORY_MESSAGES);
}
