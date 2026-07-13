"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScanFace,
  Sparkles,
  Heart,
  User,
  Settings,
  LogOut,
  History,
  Bot,
  Wand2,
  Store
} from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";

const navigation = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scan Tubuh", href: "/body-scan", icon: ScanFace },
  { name: "Padu Padan", href: "/mix-match", icon: Wand2 },
  { name: "Riwayat", href: "/history", icon: History },
  { name: "Asisten Fashion", href: "/fashion-assistant", icon: Bot },
  { name: "Rekomendasi", href: "/recommendations", icon: Sparkles },
  { name: "Lemari Digital", href: "/collection", icon: Heart },
  { name: "Toko Belanja", href: "/marketplace", icon: Store },
  { name: "Profil", href: "/profile", icon: User },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card z-50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            OutfitCheck <span className="text-[#EC4899]">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6">
          <form action={signOut}>
            <button
              type="submit"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5 shrink-0 text-muted-foreground/70 group-hover:text-destructive transition-colors" />
              Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
