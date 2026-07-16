"use client";

import { useState } from "react";
import { User, Mail, UserRound, Calendar, Ruler, Weight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/app/actions/profile";
import { format } from "date-fns";

 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileClient({ profile }: { profile: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    gender: profile.gender || "",
    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
    heightCm: profile.heightCm?.toString() || "",
    weightKg: profile.weightKg?.toString() || "",
    avatarUrl: profile.avatarUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    
    // Basic validation
    if (formData.heightCm && isNaN(Number(formData.heightCm))) {
      setError("Tinggi badan harus berupa angka.");
      return;
    }
    if (formData.weightKg && isNaN(Number(formData.weightKg))) {
      setError("Berat badan harus berupa angka.");
      return;
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
      };

      const res = await updateProfile(payload);
      
      if (res.success) {
        setSuccess("Profil berhasil diperbarui!");
        setIsEditing(false);
        // Optional: show toast here if sonner is setup
      } else {
        setError(res.error || "Gagal memperbarui profil.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayDate = profile.dateOfBirth ? format(new Date(profile.dateOfBirth), "dd MMMM yyyy") : "-";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E2D] tracking-tight flex items-center gap-2">
            <UserRound className="w-6 h-6 text-[#EC4899]" /> Profil Anda
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola informasi pribadi dan preferensi Anda.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-[var(--radius-button)]">
            Edit Profil
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-[var(--radius-button)] text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-[var(--radius-button)] text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="col-span-1">
          <div className="bg-white border border-[#FDF2F8] rounded-[var(--radius-card)] p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm mb-4">
              {formData.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <h2 className="font-bold text-lg text-gray-900">
              {profile.firstName || profile.lastName ? `${profile.firstName || ""} ${profile.lastName || ""}` : "User"}
            </h2>
            <p className="text-sm text-gray-500">{profile.user.email}</p>
            
            {isEditing && (
              <div className="w-full mt-6 text-left">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Camera className="w-3 h-3" /> URL Avatar
                </label>
                <Input 
                  name="avatarUrl" 
                  value={formData.avatarUrl} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  className="rounded-[var(--radius-button)] h-10 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white border border-[#FDF2F8] rounded-[var(--radius-card)] p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Informasi Personal
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5" /> Nama Depan
                </label>
                {isEditing ? (
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} className="rounded-[var(--radius-button)] h-11" />
                ) : (
                  <div className="h-11 flex items-center text-sm font-medium text-gray-900">
                    {profile.firstName || "-"}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5" /> Nama Belakang
                </label>
                {isEditing ? (
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} className="rounded-[var(--radius-button)] h-11" />
                ) : (
                  <div className="h-11 flex items-center text-sm font-medium text-gray-900">
                    {profile.lastName || "-"}
                  </div>
                )}
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <div className="h-11 flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-3 rounded-[var(--radius-button)] border border-gray-100 cursor-not-allowed">
                  {profile.user.email}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Jenis Kelamin
                </label>
                {isEditing ? (
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="flex h-11 w-full items-center justify-between rounded-[var(--radius-button)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Pilih...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                ) : (
                  <div className="h-11 flex items-center text-sm font-medium text-gray-900">
                    {profile.gender || "-"}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Lahir
                </label>
                {isEditing ? (
                  <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="rounded-[var(--radius-button)] h-11" />
                ) : (
                  <div className="h-11 flex items-center text-sm font-medium text-gray-900">
                    {displayDate}
                  </div>
                )}
              </div>

              {/* Height */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Tinggi Badan (cm)
                </label>
                {isEditing ? (
                  <Input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} className="rounded-[var(--radius-button)] h-11" />
                ) : (
                  <div className="h-11 flex items-center text-sm font-medium text-gray-900">
                    {profile.heightCm ? `${profile.heightCm} cm` : "-"}
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5" /> Berat Badan (kg)
                </label>
                {isEditing ? (
                  <Input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} className="rounded-[var(--radius-button)] h-11" />
                ) : (
                  <div className="h-11 flex items-center text-sm font-medium text-gray-900">
                    {profile.weightKg ? `${profile.weightKg} kg` : "-"}
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            {isEditing && (
              <div className="mt-8 flex items-center gap-3 justify-end pt-6 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)} 
                  disabled={isSaving}
                  className="rounded-[var(--radius-button)]"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-[var(--radius-button)]"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


