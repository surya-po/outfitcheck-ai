import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { PartnerSidebar } from "@/components/partner/Sidebar";
import { PartnerTopNavbar } from "@/components/partner/TopNavbar";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/partner-login");
  }

  // Fetch the actual user record to check their role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true }
  });

  if (!dbUser || dbUser.role !== "PARTNER") {
    // If not a partner, redirect to the partner login page (which should block them and sign out)
    redirect("/partner-login?error=unauthorized");
  }

  const profile = dbUser.profile;

  const fullName = profile?.firstName || profile?.lastName 
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() 
    : user.user_metadata?.full_name || user.user_metadata?.display_name || "";

  const avatarUrl = profile?.avatarUrl || user.user_metadata?.avatar_url || "";

  const userData = {
    email: user.email || "",
    fullName,
    avatarUrl,
  };

  // Ensure boutique profile exists for this user (since it's a partner dashboard)
  const boutique = await prisma.boutique.findFirst({
    where: { ownerId: user.id }
  });

  if (!boutique) {
    await prisma.boutique.create({
      data: {
        ownerId: user.id,
        name: "My Boutique",
        status: "PENDING",
      }
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (Desktop) */}
      <PartnerSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64 h-full">
        <PartnerTopNavbar user={userData} />
        
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}



