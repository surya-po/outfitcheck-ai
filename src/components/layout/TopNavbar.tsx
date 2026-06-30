"use client";

import { Bell, Sun } from "lucide-react";
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

interface TopNavbarProps {
  user: {
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export function TopNavbar({ user }: TopNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : user.email.substring(0, 2).toUpperCase();

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-[#FDF2F8] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-x-4">
          {/* Theme Toggle (Placeholder) */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="sr-only">Ubah tema</span>
            <Sun className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="sr-only">Lihat notifikasi</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EC4899] ring-2 ring-white" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-3 outline-none rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#EC4899]">
              <span className="sr-only">Buka menu pengguna</span>
              <Avatar className="h-9 w-9 border border-[#FDF2F8]">
                <AvatarImage src={user.avatarUrl} alt={user.fullName || user.email} />
                <AvatarFallback className="bg-[#FFF7FB] text-[#EC4899] font-medium text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center">
                <span
                  className="text-sm font-semibold leading-none text-gray-900"
                  aria-hidden="true"
                >
                  {user.fullName || "User"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-[#FDF2F8] p-2 shadow-lg shadow-[#EC4899]/5">
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#FDF2F8]" />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-[#FFF7FB] focus:text-[#EC4899]">
                <Link href="/profile">Profil Saya</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-[#FFF7FB] focus:text-[#EC4899]">
                <Link href="/settings">Pengaturan</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#FDF2F8]" />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-600">
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
