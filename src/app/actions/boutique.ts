"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBoutiqueProfile() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  let boutique = await prisma.boutique.findFirst({
    where: { ownerId: authUser.id }
  });

  if (!boutique) {
    // Ensure user exists
    const userExists = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!userExists) {
      await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email || "",
          profile: { create: {} }
        }
      });
    }

    // Auto-create boutique
    boutique = await prisma.boutique.create({
      data: {
        ownerId: authUser.id,
        name: "Boutique Baru",
        status: "PENDING",
      }
    });
  }

  return boutique;
}

export async function updateBoutiqueProfile(id: string, data: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Ensure the boutique belongs to the user
    const existing = await prisma.boutique.findFirst({
      where: { id, ownerId: user.id }
    });
    if (!existing) throw new Error("Unauthorized");

    await prisma.boutique.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram,
        website: data.website,
        mapsUrl: data.mapsUrl,
        address: data.address,
        openingHours: data.openingHours,
        logo: data.logo,
        banner: data.banner,
      }
    });

    revalidatePath("/partner/profile");
    revalidatePath("/partner/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating boutique:", error);
    return { success: false, error: error.message };
  }
}
