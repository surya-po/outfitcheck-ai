"use client";

import { useState } from "react";
import { User, Calendar, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/app/actions/profile";
import { format, isFuture } from "date-fns";
import { id as localeId } from "date-fns/locale";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditableProfileForm({ profile, userEmail, memberSince, latestScanData }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    gender: profile?.gender || "",
    dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
    heightCm: profile?.heightCm?.toString() || "",
    weightKg: profile?.weightKg?.toString() || "",
    avatarUrl: profile?.avatarUrl || "",
    avatarBase64: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      gender: profile?.gender || "",
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
      heightCm: profile?.heightCm?.toString() || "",
      weightKg: profile?.weightKg?.toString() || "",
      avatarUrl: profile?.avatarUrl || "",
      avatarBase64: "",
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    
    // Validation
    if (formData.firstName && formData.firstName.length > 50) {
      return setError("Nama Depan maksimal 50 karakter.");
    }
    if (formData.lastName && formData.lastName.length > 50) {
      return setError("Nama Belakang maksimal 50 karakter.");
    }
    if (formData.heightCm) {
      const h = parseInt(formData.heightCm);
      if (isNaN(h) || h < 80 || h > 250) return setError("Tinggi badan harus antara 80 dan 250 cm.");
    }
    if (formData.weightKg) {
      const w = parseInt(formData.weightKg);
      if (isNaN(w) || w < 20 || w > 300) return setError("Berat badan harus antara 20 dan 300 kg.");
    }
    if (formData.dateOfBirth) {
      const dobDate = new Date(formData.dateOfBirth);
      if (isFuture(dobDate)) return setError("Tanggal lahir tidak boleh di masa depan.");
    }

    setIsSaving(true);
    try {
      const payload = {
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        heightCm: formData.heightCm ? parseInt(formData.heightCm) : null,
        weightKg: formData.weightKg ? parseInt(formData.weightKg) : null,
        avatarUrl: formData.avatarUrl || null,
        avatarBase64: formData.avatarBase64 || null,
      };

      const res = await updateProfile(payload);
      
      if (res.success) {
        setSuccess("Profil berhasil diperbarui!");
        setIsEditing(false);
      } else {
        setError(res.error || "Gagal memperbarui profil.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentFullName = formData.firstName || formData.lastName 
    ? `${formData.firstName || ""} ${formData.lastName || ""}`.trim() 
    : "-";

  const displayDate = formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "dd MMMM yyyy", { locale: localeId }) : "-";

  return (
    <>
      {/* Global Edit Button & Messages */}
      <div className="flex flex-col md:flex-row md:justify-end mb-4 gap-2">
        {error && <div className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 mr-auto self-center">{error}</div>}
        {success && <div className="text-sm font-medium text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 mr-auto self-center">{success}</div>}
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl shadow-sm">
            Edit Profil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="rounded-xl">Batal</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl shadow-sm">
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Account Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#FDF2F8] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-[#FDF2F8] shadow-md mb-4">
              {formData.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            
            <h2 className="font-bold text-xl text-gray-900 truncate w-full px-2">
              {currentFullName !== "-" ? currentFullName : "Pengguna OutfitCheck"}
            </h2>
            <p className="text-sm text-gray-500 truncate w-full px-2 mb-4">{userEmail}</p>
            
            <div className="w-full pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center px-2">
              <span className="font-medium text-xs">Bergabung</span>
              <span className="text-gray-900 font-semibold">{memberSince}</span>
            </div>

            {isEditing && (
              <div className="w-full mt-6 text-left">
                <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Ganti Avatar
                </label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setFormData((prev) => ({
                          ...prev,
                          avatarBase64: base64String,
                          avatarUrl: base64String // use as preview
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FDF2F8] file:text-[#EC4899] hover:file:bg-[#FCE7F3] rounded-xl h-10 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Personal Info & AI Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#FDF2F8] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#EC4899]" /> Informasi Personal
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
              
              {/* First Name (Only shown in edit mode explicitly since it's combined in view mode) */}
              {isEditing && (
                <div className="space-y-1 col-span-2">
                  <label className="text-xs text-gray-500 font-medium">Nama Depan</label>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} className="rounded-xl h-10" />
                </div>
              )}
              {isEditing && (
                <div className="space-y-1 col-span-2">
                  <label className="text-xs text-gray-500 font-medium">Nama Belakang</label>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} className="rounded-xl h-10" />
                </div>
              )}

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-500 font-medium">Jenis Kelamin</span>
                {isEditing ? (
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Pilih...</option>
                    <option value="Male">Laki-laki (Male)</option>
                    <option value="Female">Perempuan (Female)</option>
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{formData.gender || "-"}</p>
                )}
              </div>
              
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-500 font-medium">Tanggal Lahir</span>
                {isEditing ? (
                  <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="rounded-xl h-10" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{displayDate}</p>
                )}
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-500 font-medium">Tinggi Badan</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} className="rounded-xl h-10" />
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{formData.heightCm ? `${formData.heightCm} cm` : "-"}</p>
                )}
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-500 font-medium">Berat Badan</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} className="rounded-xl h-10" />
                    <span className="text-sm text-gray-500">kg</span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{formData.weightKg ? `${formData.weightKg} kg` : "-"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#1E1E2D] to-gray-900 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#EC4899]" /> Ringkasan AI Terbaru
            </h3>

            {latestScanData.latestBodyShape !== "-" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#EC4899] font-bold block mb-1">
                    Bentuk Tubuh
                  </span>
                  <span className="text-white font-bold text-lg capitalize">{latestScanData.latestBodyShape}</span>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#EC4899] font-bold block mb-1">
                    Skor AI
                  </span>
                  <span className="text-white font-bold text-lg">{latestScanData.latestAiScore}</span>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#EC4899] font-bold block mb-1">
                    Tanggal Scan
                  </span>
                  <span className="text-white font-bold text-sm leading-tight">{latestScanData.latestScanDateStr}</span>
                </div>
              </div>
            ) : (
              <div className="text-white/60 text-sm py-4">Belum ada hasil scan.</div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}
