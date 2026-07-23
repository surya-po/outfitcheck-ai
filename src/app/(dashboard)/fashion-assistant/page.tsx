import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { FashionAssistantClient } from "./FashionAssistantClient";
import { Metadata } from "next";
import { AssistantMessage } from "@/lib/fashion-assistant/assistant-types";

export const metadata: Metadata = {
  title: "Fashion Assistant | Fitcheck AI",
  description: "AI Personal Stylist Anda",
};

export default async function FashionAssistantPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch basic user profile
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  // Fetch latest scan summary for the UI
  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      fashionAnalysisJson: true,
      geminiAnalysisJson: true,
      recommendationJson: true,
      createdAt: true,
    },
  });

  // Prepare a safe summary object to pass to the client
  const scanSummary = latestScan ? {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bodyShape: (latestScan.fashionAnalysisJson as any)?.shape?.shape,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    season: (latestScan.geminiAnalysisJson as any)?.seasonalColor,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style: (latestScan.recommendationJson as any)?.primaryStyle,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topSize: (latestScan.fashionAnalysisJson as any)?.sizing?.topSize?.size,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bottomSize: (latestScan.fashionAnalysisJson as any)?.sizing?.bottomSize?.size,
    createdAt: latestScan.createdAt.toISOString(),
  } : null;

  // Fetch Chat History (using raw query to avoid restart requirement)
  const historyRecords = await prisma.$queryRaw<any[]>`SELECT * FROM assistant_messages WHERE user_id = ${user.id} ORDER BY timestamp ASC`;

  const initialMessages: AssistantMessage[] = historyRecords.map((record) => ({
    id: record.id,
    role: record.role as "user" | "assistant",
    content: record.content,
    timestamp: new Date(record.timestamp).toISOString(),
  }));

  return (
    <FashionAssistantClient 
      user={{
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
      }}
      scanSummary={scanSummary}
      initialMessages={initialMessages}
    />
  );
}


