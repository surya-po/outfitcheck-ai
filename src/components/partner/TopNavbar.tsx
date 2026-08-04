"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(auth)/login/actions";
import Link from "next/link";
import { useState, useEffect } from "react";

interface PartnerTopNavbarProps {
  user: {
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export function PartnerTopNavbar({ user }: PartnerTopNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : user.email.substring(0, 2).toUpperCase();

  return (
    <header
      className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-200 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-x-4">
          {/* Theme Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="sr-only">Ubah tema</span>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}


          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-3 outline-none rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary">
              <span className="sr-only">Buka menu pengguna</span>
              <Avatar className="h-9 w-9 border border-border/60">
                <AvatarImage src={user.avatarUrl} alt={user.fullName || user.email} />
                <AvatarFallback className="bg-primary/5 text-primary font-medium text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center">
                <span
                  className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100"
                  aria-hidden="true"
                >
                  {user.fullName || "Partner"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-[var(--radius-card)] border-border/60 p-2 shadow-sm">
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-heading font-medium leading-none text-foreground">
                    {user.fullName || "Partner"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem asChild className="rounded-[var(--radius-button)] cursor-pointer focus:bg-primary/5 focus:text-primary">
                <Link href="/partner/profile">Profil Butik</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-[var(--radius-button)] cursor-pointer focus:bg-primary/5 focus:text-primary">
                <Link href="/partner/settings">Pengaturan</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem asChild className="rounded-[var(--radius-button)] cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                <form action={signOut} className="w-full">
                  <button type="submit" className="w-full text-left">
                    Keluar
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


