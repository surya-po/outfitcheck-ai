"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Check, CheckCircle2, Trash2, BellOff } from "lucide-react";
import { Notification, NotificationType, NotificationPriority } from "@prisma/client";
import { markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "@/app/actions/notification";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  initialNotifications: Notification[];
}

export default function NotificationClient({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isProcessing, setIsProcessing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.length - unreadCount;

  const handleMarkAsRead = async (notifId: string) => {
    setIsProcessing(true);
    const res = await markAsRead(notifId);
    if (res.success) {
      setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)));
    }
    setIsProcessing(false);
  };

  const handleDelete = async (notifId: string) => {
    setIsProcessing(true);
    const res = await deleteNotification(notifId);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      toast.success("Notifikasi dihapus");
    }
    setIsProcessing(false);
  };

  const handleMarkAllAsRead = async () => {
    setIsProcessing(true);
    const res = await markAllAsRead();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Semua ditandai sudah dibaca");
    }
    setIsProcessing(false);
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua notifikasi?")) return;
    setIsProcessing(true);
    const res = await deleteAllNotifications();
    if (res.success) {
      setNotifications([]);
      toast.success("Semua notifikasi dihapus");
    }
    setIsProcessing(false);
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
      case "FASHION_ASSISTANT": return "💬";
      default: return "🔔";
    }
  };

  const getPriorityAccent = (priority: NotificationPriority) => {
    switch (priority) {
      case "HIGH": return "border-destructive bg-destructive/10";
      case "NORMAL": return "border-primary bg-primary/5";
      case "LOW": return "border-muted-foreground bg-secondary/50";
      default: return "border-primary";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 mb-6 text-gray-200">
          <BellOff className="w-full h-full" strokeWidth={1} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada notifikasi.</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">Seluruh aktivitas OutfitCheck AI akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 text-sm font-medium">
          <div className="px-4 py-2 rounded-full bg-card border border-border/60 shadow-sm">
            Total Notifikasi: <span className="text-primary ml-1">{notifications.length}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-card border border-border/60 shadow-sm">
            Belum Dibaca: <span className="text-destructive ml-1">{unreadCount}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-card border border-border/60 shadow-sm">
            Sudah Dibaca: <span className="text-green-500 ml-1">{readCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isProcessing} className="text-primary border-primary hover:bg-primary/5 rounded-[var(--radius-button)]">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tandai Semua Sudah Dibaca
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleDeleteAll} disabled={isProcessing} className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive rounded-[var(--radius-button)]">
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Semua
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => {
          const meta = notif.metadata as Record<string, any> | null;
          return (
            <Card 
              key={notif.id} 
              className={`p-4 rounded-[var(--radius-card)] transition-all duration-200 overflow-hidden relative ${
                !notif.isRead 
                  ? `border-l-4 ${getPriorityAccent(notif.priority)} shadow-sm` 
                  : "border-l-4 border-transparent bg-card/60 opacity-75 hover:opacity-100 shadow-sm"
              }`}
            >
              <div className="flex gap-4">
                <div className="text-3xl shrink-0 pt-1">{getIcon(notif.type)}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-base ${!notif.isRead ? "font-heading font-bold text-foreground" : "font-heading font-medium text-muted-foreground"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: id })}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    {meta?.actionUrl && meta?.actionLabel && (
                      <Link 
                        href={meta.actionUrl}
                        className="inline-flex items-center justify-center rounded-[var(--radius-button)] bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                      >
                        {meta.actionLabel}
                      </Link>
                    )}
                    
                    <div className="flex-1" />

                    {!notif.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        disabled={isProcessing}
                        className="text-xs flex items-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Tandai Sudah Dibaca
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      disabled={isProcessing}
                      className="text-xs flex items-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


