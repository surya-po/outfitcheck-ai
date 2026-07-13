import { prisma } from "@/lib/prisma";
import { NotificationType, NotificationPriority } from "@prisma/client";

// This file contains the centralized notification logic and must only be called from Server Actions.

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

async function createNotification(params: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        priority: params.priority || NotificationPriority.NORMAL,
        metadata: params.metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

export const notificationService = {
  notifyBodyScan: async (userId: string, scanId: string) => {
    return createNotification({
      userId,
      title: "Body Scan Berhasil",
      message: "Hasil Body Scan berhasil disimpan.",
      type: NotificationType.BODY_SCAN,
      priority: NotificationPriority.HIGH,
      metadata: {
        scanId,
        actionUrl: `/history/${scanId}`,
        actionLabel: "Lihat Hasil",
      },
    });
  },

  notifyAiAnalysis: async (userId: string, scanId: string) => {
    return createNotification({
      userId,
      title: "Analisis AI Selesai",
      message: "Analisis AI telah selesai. Lihat rekomendasi outfit terbaru Anda.",
      type: NotificationType.AI_ANALYSIS,
      priority: NotificationPriority.HIGH,
      metadata: {
        scanId,
        actionUrl: `/history/${scanId}`,
        actionLabel: "Lihat Hasil",
      },
    });
  },

  notifyWardrobeAdded: async (userId: string, productId: string) => {
    return createNotification({
      userId,
      title: "Outfit Disimpan",
      message: "Outfit berhasil disimpan ke Koleksi.",
      type: NotificationType.WARDROBE,
      priority: NotificationPriority.NORMAL,
      metadata: {
        productId,
        actionUrl: "/collection",
        actionLabel: "Buka Koleksi",
      },
    });
  },

  notifyWardrobeRemoved: async (userId: string, productId: string) => {
    return createNotification({
      userId,
      title: "Outfit Dihapus",
      message: "Outfit telah dihapus dari Koleksi.",
      type: NotificationType.WARDROBE,
      priority: NotificationPriority.LOW,
      metadata: {
        productId,
      },
    });
  },

  notifyProfileUpdated: async (userId: string) => {
    return createNotification({
      userId,
      title: "Profil Diperbarui",
      message: "Profil Anda berhasil diperbarui.",
      type: NotificationType.PROFILE,
      priority: NotificationPriority.NORMAL,
    });
  },

  notifySettingsUpdated: async (userId: string) => {
    return createNotification({
      userId,
      title: "Pengaturan Disimpan",
      message: "Pengaturan berhasil disimpan.",
      type: NotificationType.SETTINGS,
      priority: NotificationPriority.LOW,
    });
  },

  // Future Ready Actions
  notifyPromotion: async (userId: string, productId: string, title: string, message: string) => {
    return createNotification({
      userId,
      title,
      message,
      type: NotificationType.PROMOTION,
      priority: NotificationPriority.HIGH,
      metadata: {
        productId,
        actionUrl: "/marketplace",
        actionLabel: "Lihat Produk",
      },
    });
  },

  notifyProduct: async (userId: string, productId: string, title: string, message: string) => {
    return createNotification({
      userId,
      title,
      message,
      type: NotificationType.PRODUCT,
      priority: NotificationPriority.NORMAL,
      metadata: {
        productId,
        actionUrl: "/marketplace",
        actionLabel: "Lihat Produk",
      },
    });
  },

  notifyBoutique: async (userId: string, boutiqueId: string, title: string, message: string) => {
    return createNotification({
      userId,
      title,
      message,
      type: NotificationType.BOUTIQUE,
      priority: NotificationPriority.NORMAL,
      metadata: {
        boutiqueId,
      },
    });
  },
};
