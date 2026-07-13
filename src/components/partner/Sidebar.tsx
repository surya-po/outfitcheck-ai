"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Store, 
  Settings,
  BarChart3
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
  { name: "Produk", href: "/partner/products", icon: Package },
  { name: "Kategori", href: "/partner/categories", icon: Tags },
  { name: "Analytics", href: "/partner/analytics", icon: BarChart3 },
  { name: "Profil Butik", href: "/partner/profile", icon: Store },
  { name: "Pengaturan", href: "/partner/settings", icon: Settings },
];

export function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[#FDF2F8] bg-white/80 backdrop-blur-xl px-6 pb-4 shadow-sm dark:bg-gray-900/80 dark:border-gray-800">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]">
            Partner Center
          </span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200
                          ${isActive 
                            ? "bg-gradient-to-r from-[#FFF7FB] to-white text-[#EC4899] shadow-sm border border-[#FDF2F8] dark:from-[#EC4899]/10 dark:to-transparent dark:border-[#EC4899]/20" 
                            : "text-gray-600 hover:text-[#EC4899] hover:bg-[#FFF7FB] dark:text-gray-400 dark:hover:bg-gray-800"
                          }
                        `}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            isActive ? "text-[#EC4899]" : "text-gray-400 group-hover:text-[#EC4899]"
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
