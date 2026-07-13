"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  User, Palette, Globe, Shield, HardDrive, 
  Lock, LogOut, Key, Trash2, Eraser
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsSwitch } from "@/components/settings/SettingsSwitch";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { SettingsActionCard } from "@/components/settings/SettingsActionCard";
import { SettingsDangerZone } from "@/components/settings/SettingsDangerZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { deleteAllScanHistory } from "@/app/actions/history";
import { changeUserPassword } from "@/app/actions/settings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SettingsClient({ user, profile, stats }: any) {
  const router = useRouter();
  const supabase = createClient();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" });
  
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Change Password States
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const openComingSoonDialog = (title: string, description: string = "Fitur ini akan segera tersedia pada versi berikutnya.") => {
    setDialogContent({ title, description });
    setDialogOpen(true);
  };

  const handleClearCache = () => {
    // Clear purely frontend cache related to the app
    localStorage.clear();
    // Keep theme and lang default
    localStorage.setItem("theme", "system");
    localStorage.setItem("language", "id");
    alert("Cache aplikasi berhasil dibersihkan.");
    window.location.reload();
  };

  const handleClearHistory = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua riwayat scan? Tindakan ini tidak dapat dibatalkan.")) return;
    
    setIsClearingHistory(true);
    try {
      await deleteAllScanHistory();
      alert("Semua riwayat scan berhasil dihapus.");
      router.refresh();
    } catch (error) {
      alert("Gagal menghapus riwayat scan.");
    } finally {
      setIsClearingHistory(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSubmitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword.length < 6) {
      setPasswordError("Password minimal 6 karakter.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const result = await changeUserPassword(newPassword);
      if (result.success) {
        alert("Password berhasil diubah.");
        setChangePasswordOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.error || "Gagal mengubah password.");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fullName = profile?.firstName || profile?.lastName 
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() 
    : "Pengguna OutfitCheck";

  const memberSince = user?.createdAt 
    ? format(new Date(user.createdAt), "MMMM yyyy", { locale: localeId }) 
    : "-";
    
  const lastLogin = user?.updatedAt 
    ? format(new Date(user.updatedAt), "dd MMM yyyy, HH:mm", { locale: localeId }) 
    : "Baru saja";

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in-50 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E2D] tracking-tight">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola preferensi akun, tampilan, dan privasi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* 1. AKUN */}
          <SettingsSection title="Akun" description="Informasi profil dan akun Anda." icon={User}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 truncate">{fullName}</h3>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                  <span className="text-xs text-gray-400">Member sejak {memberSince}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => router.push("/profile")} className="w-full bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl">
                Edit Profil
              </Button>
              <Button onClick={() => router.push("/profile")} variant="outline" className="w-full rounded-xl">
                Lihat Profil
              </Button>
            </div>
          </SettingsSection>

          {/* 2. TAMPILAN */}
          <SettingsSection title="Tampilan" description="Sesuaikan tema aplikasi." icon={Palette}>
            <SettingsSelect 
              storageKey="theme"
              label="Tema Aplikasi"
              defaultValue="system"
              options={[
                { label: "Terang (Light)", value: "light" },
                { label: "Gelap (Dark)", value: "dark" },
                { label: "Mengikuti Sistem", value: "system" },
              ]}
            />
          </SettingsSection>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* 5. PRIVASI */}
          <SettingsSection title="Privasi" description="Kontrol data dan privasi Anda." icon={Shield}>
            <div className="divide-y divide-gray-50">
              <SettingsSwitch storageKey="privacy_save_history" label="Simpan Riwayat Scan" description="Menyimpan foto dan hasil analisis Anda." defaultChecked={true} />
              <SettingsSwitch storageKey="privacy_ai_analytics" label="Izinkan AI Analitik" description="Meningkatkan akurasi rekomendasi (Anonim)." defaultChecked={true} />
              <SettingsSwitch storageKey="privacy_public_profile" label="Tampilkan Profil Publik" description="Izinkan pengguna lain melihat outfit Anda." defaultChecked={false} />
            </div>
          </SettingsSection>

          {/* 6. PENYIMPANAN */}
          <SettingsSection title="Penyimpanan" description="Kelola data dan memori aplikasi." icon={HardDrive}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 font-medium block mb-1">Total Scan</span>
                <span className="text-xl font-bold text-gray-900">{stats.scans}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 font-medium block mb-1">Outfit Favorit</span>
                <span className="text-xl font-bold text-gray-900">{stats.outfits}</span>
              </div>
            </div>
            
            <div className="mb-6 flex justify-between items-center text-sm">
              <span className="text-gray-500">Estimasi Penyimpanan Digunakan</span>
              <span className="font-semibold text-gray-900">~{((stats.scans * 2.5) + (stats.outfits * 0.5)).toFixed(1)} MB</span>
            </div>

            <div className="space-y-3">
              <SettingsDangerZone 
                icon={Eraser}
                title="Hapus Cache Aplikasi"
                description="Membersihkan data sementara di peramban."
                actionLabel="Bersihkan"
                onClick={handleClearCache}
              />
              <SettingsDangerZone 
                icon={Trash2}
                title="Hapus Riwayat Scan"
                description="Menghapus permanen semua riwayat."
                actionLabel="Hapus Data"
                onClick={handleClearHistory}
                isLoading={isClearingHistory}
              />
            </div>
          </SettingsSection>

          {/* 9. KEAMANAN */}
          <SettingsSection title="Keamanan" description="Pengaturan sesi dan kata sandi." icon={Lock}>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 block">Sesi Saat Ini</span>
                  <span className="text-sm font-semibold text-gray-900">{user?.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Login Terakhir</span>
                  <span className="text-sm font-medium text-gray-900">{lastLogin}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <SettingsActionCard 
                icon={Key}
                title="Ganti Password"
                description="Perbarui kata sandi akun Anda."
                actionLabel="Ubah"
                onClick={() => setChangePasswordOpen(true)}
              />
              <SettingsDangerZone 
                icon={LogOut}
                title="Keluar (Logout)"
                description="Akhiri sesi Anda di perangkat ini."
                actionLabel="Logout"
                onClick={handleLogout}
                isLoading={isLoggingOut}
              />
            </div>
          </SettingsSection>



        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setDialogOpen(false)} className="bg-[#1E1E2D] text-white hover:bg-gray-800">
              Mengerti
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ganti Password</DialogTitle>
            <DialogDescription>
              Masukkan kata sandi baru untuk akun Anda.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitChangePassword} className="space-y-4 pt-4">
            {passwordError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {passwordError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password Baru</label>
              <Input 
                type="password" 
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
              <Input 
                type="password" 
                placeholder="Masukkan ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isChangingPassword} className="bg-pink-500 hover:bg-pink-600 text-white">
                {isChangingPassword ? "Menyimpan..." : "Simpan Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
