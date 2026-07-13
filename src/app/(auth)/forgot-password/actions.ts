"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
