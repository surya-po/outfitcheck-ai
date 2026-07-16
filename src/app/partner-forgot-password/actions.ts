"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function resetPasswordForPartnerEmail(email: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  if (!email) {
    return { error: "Email is required." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/partner-reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
