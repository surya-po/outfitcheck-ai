"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "outfitcheck-ai.vercel.app";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  if (!email) {
    return { error: "Email is required." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    // We typically shouldn't leak whether an email exists for security reasons.
    // Supabase handles this by returning success even if the email is not found,
    // but if there's a rate limit or actual error, we catch it here.
    return { error: error.message };
  }

  return { success: true };
}
