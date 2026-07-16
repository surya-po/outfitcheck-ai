import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return notFound();
  }

  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      profile: true,
      _count: {
        select: {
          scanHistories: true,
          savedOutfits: true,
        },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email || "",
        profile: {
          create: {}
        }
      },
      include: {
        profile: true,
        _count: {
          select: {
            scanHistories: true,
            savedOutfits: true,
          },
        },
      },
    });
  }

  const stats = {
    scans: user._count.scanHistories,
    outfits: user._count.savedOutfits,
  };

  const providers = authUser.app_metadata?.providers || [];
  const isEmailUser = providers.includes("email");

  return (
    <div className="w-full">
      <SettingsClient 
        user={user} 
        profile={user.profile} 
        stats={stats} 
        isEmailUser={isEmailUser}
      />
    </div>
  );
}


