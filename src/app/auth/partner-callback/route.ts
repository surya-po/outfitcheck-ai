import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/partner/dashboard";

  // Use the origin from the request URL to ensure redirects go to the correct domain automatically
  const appOrigin = origin;

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authData?.user) {
      // Ensure we have the user in Prisma (wait a bit for trigger if just signed up)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      try {
        // Ensure they exist and are upgraded to PARTNER
        const user = await prisma.user.upsert({
          where: { id: authData.user.id },
          update: { role: "PARTNER" },
          create: {
            id: authData.user.id,
            email: authData.user.email || "",
            role: "PARTNER",
          }
        });

          // Ensure they have a boutique
          const boutique = await prisma.boutique.findFirst({
            where: { ownerId: user.id },
          });

          if (!boutique) {
            await prisma.boutique.create({
              data: {
                ownerId: user.id,
                name: authData.user.user_metadata?.full_name 
                  ? `Butik ${authData.user.user_metadata.full_name}` 
                  : "My Boutique",
                status: "VERIFIED",
              },
            });
          }
      } catch (err) {
        console.error("Partner callback role upgrade error:", err);
      }

      return NextResponse.redirect(`${appOrigin}${next}`);
    }
  }

  // Return the user to login with an error
  return NextResponse.redirect(`${appOrigin}/partner-login?error=auth_callback_error`);
}
