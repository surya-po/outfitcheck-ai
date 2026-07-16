import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  });

  const fullName = profile?.firstName || profile?.lastName 
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() 
    : user.user_metadata?.full_name || user.user_metadata?.display_name || "";

  const avatarUrl = profile?.avatarUrl || user.user_metadata?.avatar_url || "";

  // Map Supabase user and Prisma profile to our internal format for the Navbar
  const userData = {
    email: user.email || "",
    fullName,
    avatarUrl,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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


