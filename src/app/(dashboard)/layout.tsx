import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Map Supabase user to our internal format for the Navbar
  const userData = {
    email: user.email || "",
    fullName: user.user_metadata?.full_name || user.user_metadata?.display_name || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF7FB]">
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 h-full">
        <TopNavbar user={userData} />
        
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
