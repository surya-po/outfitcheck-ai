"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export async function signInAsPartner(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  // 1. Sign in with Supabase Auth
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Partner Login error:", error.message);
    return { error: error.message };
  }

  // 2. Validate that this account has PARTNER role
  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id }
  });

  if (!dbUser || dbUser.role !== "PARTNER") {
    // Sign out since they are not a partner
    await supabase.auth.signOut();
    return {
      error:
        "Akun Anda tidak memiliki izin sebagai Partner. Silakan daftar sebagai Partner terlebih dahulu atau gunakan halaman Login Pengguna.",
    };
  }

  // Also check if they have a boutique, if not create one
  const boutique = await prisma.boutique.findFirst({
    where: { ownerId: data.user.id },
  });

  if (!boutique) {
    await prisma.boutique.create({
      data: {
        ownerId: data.user.id,
        name: "My Boutique",
        status: "PENDING",
      }
    });
  }

  // 3. Handle remember me
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

  redirect("/partner/dashboard");
}

export async function signOutPartner() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/partner-login");
}

export async function signUpAsPartner(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const boutiqueName = formData.get("boutiqueName") as string;

  if (!email || !password || !boutiqueName) {
    return { error: "Semua kolom wajib diisi." };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    if (existingUser.role === "PARTNER") {
      return { error: "Email ini sudah terdaftar sebagai Partner. Silakan login." };
    } else {
      return { error: "Email ini sudah terdaftar sebagai Pengguna biasa. Gunakan email lain atau upgrade menggunakan script." };
    }
  }

  // 1. Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: boutiqueName,
        display_name: boutiqueName,
      },
    },
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Gagal mendaftar akun." };
  }

  // Wait 1 second to ensure the Supabase DB trigger has created the User in Prisma
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 2. Update role to PARTNER and create Boutique
  try {
    await prisma.user.upsert({
      where: { id: authData.user.id },
      update: { role: "PARTNER" },
      create: {
        id: authData.user.id,
        email: email,
        role: "PARTNER",
      }
    });

    await prisma.boutique.create({
      data: {
        ownerId: authData.user.id,
        name: boutiqueName,
        status: "VERIFIED", // Auto-verify for easy testing
      }
    });
  } catch (err) {
    console.error("Failed to upgrade to partner or create boutique", err);
    // Even if it fails, they are registered. They might just need to retry login.
  }

  // Sign out the session so they are forced to log in again normally? Or just redirect?
  // Let's redirect to partner dashboard, they are already signed in!
  redirect("/partner/dashboard");
}

export async function signInWithGooglePartner() {
  const supabase = await createClient();
  const headersList = await headers();
  // Use x-forwarded-host for Vercel/proxy environments, fallback to origin header
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "outfitcheck-ai.vercel.app";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/partner-callback`,
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
    const cookieStore = await cookies();
    cookieStore.set("intended_partner_login", "true", { path: "/", maxAge: 60 * 5 });
    return { url: data.url };
  }
}
