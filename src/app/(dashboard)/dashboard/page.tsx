import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
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
  ArrowRight,
  Bot
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch Profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  });

  // Fetch Stats
  const [scanCount, recommendationsCount, savedLooksCount] = await Promise.all([
    prisma.scanHistory.count({ where: { userId: user.id } }),
    prisma.productRecommendation.count({ where: { userId: user.id } }),
    prisma.savedOutfit.count({ where: { userId: user.id } })
  ]);
  const collectionsCount = savedLooksCount; // For now mapping Collections to Saved Looks

  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  let fullName = "Style Icon";
  if (profile?.firstName || profile?.lastName) {
    fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  } else if (user.user_metadata?.full_name || user.user_metadata?.display_name) {
    fullName = user.user_metadata.full_name || user.user_metadata.display_name;
  }

  const firstName = fullName.split(" ")[0];
  const avatarUrl = profile?.avatarUrl || user.user_metadata?.avatar_url;
  const initials = firstName.substring(0, 2).toUpperCase();

  const greeting = "Halo";

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
              Siap menemukan gaya berpakaian yang paling cocok dengan bentuk tubuh Anda?
            </p>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Link href="/body-scan">
            <Button className="w-full sm:w-auto bg-white text-[#EC4899] hover:bg-white/90 shadow-lg border-0 font-semibold rounded-xl h-11 px-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Mulai Scan Tubuh
            </Button>
          </Link>
          <Link href="/collection">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6 transition-colors">
              Lihat Koleksi
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Scan Tubuh"
          value={scanCount.toString()}
          icon={<ScanFace className="h-5 w-5" />}
        />
        <StatisticCard
          title="Rekomendasi"
          value={recommendationsCount.toString()}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatisticCard
          title="Disimpan"
          value={savedLooksCount.toString()}
          icon={<Heart className="h-5 w-5" />}
        />
        <StatisticCard
          title="Koleksi"
          value={collectionsCount.toString()}
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
                Analisis Tubuh AI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {latestScan ? (
                <div className="flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 shadow-sm">
                    <ScanFace className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analisis Selesai!</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    Profil bentuk tubuh Anda telah dianalisis. Anda siap menerima rekomendasi gaya berpakaian dari AI.
                  </p>
                  <Link href="/history">
                    <Button className="bg-white border-2 border-[#EC4899] text-[#EC4899] hover:bg-[#FFF7FB] rounded-xl px-8 h-11 font-medium transition-all hover:scale-105">
                      Lihat Hasil
                    </Button>
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={ScanFace}
                  title="Belum ada data analisis"
                  description="Mulai scan tubuh Anda untuk mendapatkan rekomendasi pakaian yang dipersonalisasi khusus untuk Anda."
                  action={
                    <Link href="/body-scan">
                      <Button className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl px-8 h-11 shadow-lg shadow-[#EC4899]/25 transition-all hover:scale-105 mt-2">
                        Mulai Scan <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  }
                  className="border-none min-h-[250px] bg-transparent"
                />
              )}
            </CardContent>
          </Card>

          {/* 3. Outfit Recommendation Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-[#FFF7FB] bg-[#FFF7FB]/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#EC4899]" />
                Rekomendasi Pakaian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8 text-center">
              {latestScan ? (
                <>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7FB] text-[#EC4899] mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Siap untuk penataan gaya</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    Kami telah menyiapkan rekomendasi pakaian yang akan membuat Anda tampil memukau.
                  </p>
                  <Link href="/recommendations">
                    <Button className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl px-8 h-11 shadow-md hover:scale-105 transition-all">
                      Lihat Rekomendasi
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selesaikan scan tubuh terlebih dahulu</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    Kami perlu menganalisis bentuk tubuh Anda terlebih dahulu untuk memberikan rekomendasi yang akurat.
                  </p>
                  <Button disabled className="rounded-xl px-8">
                    Lihat Rekomendasi
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* 3.5 AI Fashion Assistant Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <CardHeader className="border-b border-[#FFF7FB] bg-[#FFF7FB]/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#EC4899]" />
                Tanya Fashion Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EmptyState
                icon={Bot}
                title="AI Personal Stylist"
                description="Dapatkan rekomendasi gaya, warna, dan kombinasi pakaian yang paling cocok dengan bentuk tubuh Anda."
                action={
                  <Link href="/fashion-assistant">
                    <Button className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl px-8 h-11 shadow-lg shadow-[#EC4899]/25 transition-all hover:scale-105 mt-2">
                      Mulai Ngobrol <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                }
                className="border-none min-h-[200px] bg-transparent"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* 5. Profile Card */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Profil Saya</CardTitle>
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
                    Edit Profil
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
                Pakaian Disimpan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedLooksCount > 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-[#FFF7FB] flex items-center justify-center text-[#EC4899] mb-3">
                    <Heart className="h-6 w-6" fill="currentColor" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Anda memiliki {savedLooksCount} pakaian tersimpan!</p>
                  <p className="text-xs text-gray-500 mb-4">Terus temukan gaya baru yang menarik.</p>
                  <Link href="/collection">
                    <Button variant="secondary" className="rounded-xl w-full bg-[#FFF7FB] text-[#EC4899] hover:bg-[#FDF2F8]">
                      Lihat Koleksi
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-[#FFF7FB] flex items-center justify-center text-[#EC4899] mb-3">
                    <Heart className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Anda belum menyimpan pakaian apa pun.</p>
                  <Link href="/collection">
                    <Button variant="secondary" className="rounded-xl w-full bg-gray-100 hover:bg-gray-200 text-gray-900">
                      Lihat Koleksi
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 7. Recent Activity */}
          <Card className="border-[#FDF2F8] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF7FB] text-[#EC4899]">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Login Terakhir</p>
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
                    <p className="text-sm font-medium text-gray-900">Akun Dibuat</p>
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
