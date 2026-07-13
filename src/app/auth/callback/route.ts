import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Use VERCEL_URL (auto-set by Vercel) to ensure we always redirect to the live domain.
  // Fall back to the request origin if running locally.
  const appOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : origin;

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure user exists in Prisma
      if (authData?.user) {
        try {
          await prisma.user.upsert({
            where: { id: authData.user.id },
            update: {},
            create: {
              id: authData.user.id,
              email: authData.user.email || "",
              role: "USER",
            },
          });
        } catch (err) {
          console.error("Callback Prisma user creation error:", err);
        }
      }
      return NextResponse.redirect(`${appOrigin}${next}`);
    }
  }

  // Return the user to login with an error
  return NextResponse.redirect(`${appOrigin}/login?error=auth_callback_error`);
}
