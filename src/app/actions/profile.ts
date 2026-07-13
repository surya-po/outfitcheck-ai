"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificationService } from "@/lib/notification-service";

import { uploadBase64Image } from "@/lib/supabase/storage";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Ensure base user exists
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || `user-${user.id}@example.com`,
    }
  });

  const authAvatarUrl = user.user_metadata?.avatar_url;

  // Ensure profile exists
  let profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
    },
    include: {
      user: true
    }
  });

  if (!profile.avatarUrl && authAvatarUrl) {
    profile = await prisma.userProfile.update({
      where: { userId: user.id },
      data: { avatarUrl: authAvatarUrl },
      include: { user: true }
    });
  }

  return profile;
}

export async function updateProfile(data: {
  firstName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  heightCm?: number | null;
  weightKg?: number | null;
  avatarUrl?: string | null;
  avatarBase64?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    let finalAvatarUrl = data.avatarUrl;

    if (data.avatarBase64) {
      const fileName = `${user.id}/avatar-${Date.now()}.jpg`;
      finalAvatarUrl = await uploadBase64Image(data.avatarBase64, "scans", fileName);
    }

    const updated = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        avatarUrl: finalAvatarUrl,
      },
      create: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        avatarUrl: finalAvatarUrl,
      }
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    // Dispatch Notification
    await notificationService.notifyProfileUpdated(user.id);

    return { success: true, profile: updated };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { success: false, error: error.message || "Gagal menyimpan profil" };
  }
}
