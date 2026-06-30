"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function signUpWithEmail(data: {
  fullName: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  // 1. First check if the email already exists and find its provider securely via the server
  try {

    // We query the auth.users table using Prisma's direct connection to Postgres
    // This allows us to check for existing users without needing the SERVICE_ROLE_KEY
    const existingUsers = await prisma.$queryRawUnsafe<Array<{ provider: string | null; providers: string | null }>>(
      "SELECT raw_app_meta_data->>'provider' as provider, raw_app_meta_data->>'providers' as providers FROM auth.users WHERE email = $1 LIMIT 1",
      data.email
    );

    if (existingUsers && existingUsers.length > 0) {
      const user = existingUsers[0];
      const providers: string[] = user.providers ? JSON.parse(user.providers) : [];
      const primaryProvider = user.provider;
      
      const isGoogle = providers.includes("google") || primaryProvider === "google";
      
      if (isGoogle) {
        return { error: "Email ini sudah terdaftar menggunakan Google. Silakan login menggunakan Google." };
      } else {
        return { error: "Email ini sudah terdaftar. Silakan login." };
      }
    }
  } catch (err) {
    console.error("Failed to check existing user:", err);
    // If Prisma fails, we just continue to Supabase standard signup and let it handle the error
  }

  // 2. If no user exists, proceed with normal registration
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        display_name: data.fullName,
      },
    },
  });

  if (error) {
    console.error("[signUpWithEmail] Supabase error:", error.message, "| Status:", error.status);

    // Provide user-friendly error messages for common issues
    if (error.message.includes("Invalid API key") || error.message.includes("Invalid API Key")) {
      return {
        error:
          "Server configuration error — the Supabase API key is invalid. " +
          "Please set a valid NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.",
      };
    }
    
    // Fallback if Prisma check didn't catch it
    if (error.message.includes("already registered") || 
        error.message.includes("already been registered") || 
        error.message.includes("Email already exists") || 
        error.message.includes("Identity already exists")) {
      return { error: "Email ini sudah terdaftar. Silakan login." };
    }
    
    if (error.message.includes("Password should be")) {
      return { error: error.message };
    }

    return { error: error.message };
  }

  return { success: true, message: "Account created successfully! Redirecting to login..." };
}

export async function signUpWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}
