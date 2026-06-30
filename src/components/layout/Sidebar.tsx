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
} from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";

const navigation = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scan Tubuh", href: "/body-scan", icon: ScanFace },
  { name: "Rekomendasi Outfit", href: "/recommendations", icon: Sparkles },
  { name: "Koleksi", href: "/collection", icon: Heart },
  { name: "Profil", href: "/profile", icon: User },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[#FDF2F8] bg-white z-50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#FDF2F8]">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1E1E2D]">
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
                    ? "bg-[#FFF7FB] text-[#EC4899]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-[#EC4899]"
                      : "text-gray-400 group-hover:text-gray-600"
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
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500 transition-colors" />
              Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
