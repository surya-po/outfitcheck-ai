"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  // 1. Sign in with Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("User Login error:", error.message);
    return { error: error.message };
  }

  // 2. Handle remember me
  const remember = formData.get("remember") === "true";
  if (!remember) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        cookieStore.set(cookie.name, cookie.value, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }
    });
  }

  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  // Use x-forwarded-host for Vercel/proxy environments, fallback to origin header
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "outfitcheck-ai.vercel.app";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

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
    return { url: data.url };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
