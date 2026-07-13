"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, AlertTriangle, Loader2 } from "lucide-react";
import { updatePartnerPassword } from "@/app/partner-reset-password/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SettingsClient() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      const result = await updatePartnerPassword(newPassword);
      if (result?.error) {
        setPasswordError(result.error || "Gagal mengubah password.");
      } else {
        alert("Password berhasil diubah.");
        setChangePasswordOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Butik</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola keamanan dan pengaturan akun butik Anda.</p>
      </div>

      <div className="space-y-6">

        {/* Privacy */}
        <Card className="p-6 border-[#FDF2F8] dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <Eye className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profil Publik & Keamanan</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tampilkan Profil Butik ke Publik</h4>
                <p className="text-xs text-gray-500 mt-1">Jika dimatikan, produk Anda hanya muncul sebagai rekomendasi AI dan profil butik tidak dapat diakses langsung.</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-gray-100 dark:border-gray-800">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Kata Sandi Akun</h4>
                <p className="text-xs text-gray-500 mt-1">Terakhir diubah 3 bulan lalu.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setChangePasswordOpen(true)}>
                Ubah Kata Sandi
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100 dark:border-red-900/30">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Hapus Akun Butik</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tindakan ini akan menghapus permanen seluruh profil butik dan katalog produk Anda. 
                Proses ini tidak dapat dibatalkan.
              </p>
            </div>
            <Button variant="destructive" size="sm">Hapus Akun</Button>
          </div>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ganti Password</DialogTitle>
            <DialogDescription>
              Masukkan password baru Anda di bawah ini. Minimal 6 karakter.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitChangePassword} className="space-y-4 pt-4">
            {passwordError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {passwordError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Baru</label>
              <input 
                type="password" 
                required 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Konfirmasi Password Baru</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Simpan Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
