"use server";

import { createClient } from "@/lib/supabase/server";
import { AssistantMessage, AssistantResponse } from "@/lib/fashion-assistant/assistant-types";
import { buildConversationContext } from "@/lib/fashion-assistant/context";
import { processChatMessage } from "@/lib/fashion-assistant/chat-service";
import { prisma } from "@/lib/prisma";

export async function sendMessage(
  message: string,
  history: AssistantMessage[]
): Promise<AssistantResponse> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Harap login kembali." };
    }

    // Build user context from database
    const context = await buildConversationContext(user.id, message);

    // Call Gemini
    const replyText = await processChatMessage(message, history, context);

    // Save messages to database (using raw query to avoid restart requirement)
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO assistant_messages (id, user_id, role, content, timestamp)
      VALUES 
      (${id1}, ${user.id}, 'user', ${message}, NOW()),
      (${id2}, ${user.id}, 'assistant', ${replyText}, NOW())
    `;

    return {
      success: true,
      message: {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyText,
        timestamp: new Date().toISOString(),
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Assistant error:", error);
    return {
      success: false,
      error: `[DEBUG INFO]: ${error.message}\nStack: ${error.stack}`,
    };
  }
}
