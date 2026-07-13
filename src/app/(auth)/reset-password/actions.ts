"use server";

import { createClient } from "@/lib/supabase/server";

export async function resetPassword(password: string) {
  const supabase = await createClient();

  if (!password) {
    return { error: "Password is required." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
