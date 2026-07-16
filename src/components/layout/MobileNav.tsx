"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ScanFace, Heart, User, Wand2 } from "lucide-react";

const mobileNavigation = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scan", href: "/body-scan", icon: ScanFace },
  { name: "Mix & Match", href: "/mix-match", icon: Wand2 },
  { name: "Wardrobe", href: "/collection", icon: Heart },
  { name: "Profil", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border pb-safe">
      <nav className="flex items-center justify-around px-2 h-16">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
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


