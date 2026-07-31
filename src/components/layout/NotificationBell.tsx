"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { id } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications, markAsRead } from "@/app/actions/notification";
import { Notification, NotificationType, NotificationPriority } from "@prisma/client";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    };
    fetchNotifications();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notifId: string) => {
    await markAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const formatBadge = (count: number) => {
    if (count === 0) return null;
    if (count > 999) return "999+";
    if (count > 99) return "99+";
    if (count > 9) return "9+";
    return count.toString();
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "BODY_SCAN": return "📷";
      case "AI_ANALYSIS": return "🤖";
      case "WARDROBE": return "❤️";
      case "PROFILE": return "⚙️";
      case "SETTINGS": return "⚙️";
      case "PRODUCT": return "👕";
      case "BOUTIQUE": return "🏬";
      case "PROMOTION": return "🎉";
      default: return "🔔";
    }
  };

  const getGroupedNotifications = () => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const older: Notification[] = [];
    
    notifications.slice(0, 8).forEach(notif => {
      const date = new Date(notif.createdAt);
      if (isToday(date)) today.push(notif);
      else if (isYesterday(date)) yesterday.push(notif);
      else older.push(notif);
    });
    
    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getGroupedNotifications();

  const renderNotificationItem = (notif: Notification) => {
    const meta = notif.metadata as Record<string, any> | null;
    return (
      <div 
        key={notif.id}
        className={`p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? "bg-[#FFF7FB]/50" : ""}`}
        onClick={() => handleMarkAsRead(notif.id)}
      >
        <div className="flex gap-3">
          <div className="text-xl shrink-0">{getIcon(notif.type)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start gap-2">
              <p className={`text-sm ${!notif.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                {notif.title}
              </p>
              <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: id })}
              </span>
            </div>
            <p className={`text-xs ${!notif.isRead ? "text-gray-700" : "text-gray-500"}`}>
              {notif.message}
            </p>
            {meta?.actionUrl && meta?.actionLabel && (
              <Link 
                href={meta.actionUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-block mt-2 text-[10px] font-medium text-[#EC4899] hover:underline bg-[#FFF7FB] px-2 py-1 rounded"
              >
                {meta.actionLabel}
              </Link>
            )}
          </div>
          {!notif.isRead && (
            <div className="shrink-0 pt-1">
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none">
        <span className="sr-only">Notifikasi</span>
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-red-600 px-1 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {formatBadge(unreadCount)}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 mt-2 rounded-[var(--radius-button)] border-[#FDF2F8] p-0 shadow-sm shadow-[#EC4899]/5 overflow-hidden">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b flex justify-between items-center">
          <h3 className="font-semibold text-sm">Notifikasi</h3>
          <Link href="/notifications" className="text-xs text-[#EC4899] hover:underline">
            Lihat Semua
          </Link>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Belum ada notifikasi
            </div>
          ) : (
            <>
              {today.length > 0 && (
                <div className="py-2">
                  <div className="px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Hari Ini</div>
                  {today.map(renderNotificationItem)}
                </div>
              )}
              {yesterday.length > 0 && (
                <div className="py-2 border-t">
                  <div className="px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Kemarin</div>
                  {yesterday.map(renderNotificationItem)}
                </div>
              )}
              {older.length > 0 && (
                <div className="py-2 border-t">
                  <div className="px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Sebelumnya</div>
                  {older.map(renderNotificationItem)}
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


