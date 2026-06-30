"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ScanFace, Heart, User } from "lucide-react";

const mobileNavigation = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scan Tubuh", href: "/body-scan", icon: ScanFace },
  { name: "Koleksi", href: "/collection", icon: Heart },
  { name: "Profil", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#FDF2F8] pb-safe">
      <nav className="flex items-center justify-around px-2 h-16">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                isActive ? "text-[#EC4899]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
