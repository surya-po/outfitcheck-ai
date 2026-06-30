import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticCard } from "@/components/ui/StatisticCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ScanFace,
  Sparkles,
  Heart,
  Shirt,
  Calendar,
  LogOut,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name || user.user_metadata?.display_name || "Style Icon";
  const firstName = fullName.split(" ")[0];
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = firstName.substring(0, 2).toUpperCase();

  // Helper to determine greeting based on time of day (server-side static for now or can just say Welcome)
  const greeting = "Welcome";

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      
      {/* 1. Welcome Hero Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-xl shadow-[#EC4899]/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-white/20 shadow-lg">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">
              {greeting}, {firstName} 👋
            </h1>
            <p className="mt-2 text-white/90 max-w-md leading-relaxed">
              Ready to discover outfits that perfectly match your body shape?
            </p>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Link href="/body-scan">
            <Button className="w-full sm:w-auto bg-white text-[#EC4899] hover:bg-white/90 shadow-lg border-0 font-semibold rounded-xl h-11 px-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Start AI Body Scan
            </Button>
          </Link>
          <Link href="/collection">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6 transition-colors">
              View Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Body Scans"
          value="0"
          icon={<ScanFace className="h-5 w-5" />}
        />
        <StatisticCard
          title="Recommendations"
          value="0"
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatisticCard
          title="Saved Looks"
          value="0"
          icon={<Heart className="h-5 w-5" />}
        />
        <StatisticCard
          title="Collections"
          value="0"
          icon={<Shirt className="h-5 w-5" />}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* 2. AI Body Scan Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <CardHeader className="border-b border-[#FFF7FB] bg-[#FFF7FB]/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <ScanFace className="h-5 w-5 text-[#EC4899]" />
                AI Body Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EmptyState
                icon={ScanFace}
                title="No body analysis yet"
                description="Start scanning your body to receive personalized fashion recommendations powered by AI."
                action={
                  <Link href="/body-scan">
                    <Button className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl px-8 h-11 shadow-lg shadow-[#EC4899]/25 transition-all hover:scale-105 mt-2">
                      Start Scan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                }
                className="border-none min-h-[250px] bg-transparent"
              />
            </CardContent>
          </Card>

          {/* 3. Outfit Recommendation Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-[#FFF7FB] bg-[#FFF7FB]/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#EC4899]" />
                Outfit Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Complete your body scan first</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                We need to understand your unique body shape to provide accurate and personalized outfit recommendations.
              </p>
              <Button disabled className="rounded-xl px-8">
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* 5. Profile Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-[#FFF7FB] shadow-md mb-4">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback className="bg-[#FDF2F8] text-[#EC4899] text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-[#1E1E2D]">{fullName}</h3>
                <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                <Link href="/profile" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl border-[#EC4899]/20 text-[#EC4899] hover:bg-[#FFF7FB] hover:text-[#EC4899]">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 4. Collection Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#EC4899]" />
                Saved Outfits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-12 w-12 rounded-full bg-[#FFF7FB] flex items-center justify-center text-[#EC4899] mb-3">
                  <Heart className="h-6 w-6" />
                </div>
                <p className="text-sm text-gray-500 mb-4">You haven&apos;t saved any outfits yet.</p>
                <Link href="/collection">
                  <Button variant="secondary" className="rounded-xl w-full bg-gray-100 hover:bg-gray-200 text-gray-900">
                    View Collection
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 7. Recent Activity */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF7FB] text-[#EC4899]">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Latest Login</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF7FB] text-[#EC4899]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Account Created</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
