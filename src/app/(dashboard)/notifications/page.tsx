import { getNotifications } from "@/app/actions/notification";
import NotificationClient from "./NotificationClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifikasi - OutfitCheck AI",
};

export default async function NotificationsPage() {
  const initialNotifications = await getNotifications();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifikasi</h1>
      </div>
      
      <NotificationClient initialNotifications={initialNotifications} />
    </div>
  );
}


