"use server";

import { createClient } from "@/lib/supabase/server";

export async function updatePartnerPassword(password: string) {
  const supabase = await createClient();

  if (!password || password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
