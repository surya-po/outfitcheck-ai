"use client";

import { useState, useEffect } from "react";
import { Boutique } from "@prisma/client";
import { updateBoutiqueProfile } from "@/app/actions/boutique";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Store, MapPin, AtSign, Globe, Mail, Phone, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initialData: Boutique;
}

export default function ProfileClient({ initialData }: Props) {
  const [formData, setFormData] = useState<Partial<Boutique>>(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(initialData);
  }, [initialData]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}-${Math.random()}.${fileExt}`;
      const filePath = `boutiques/${initialData.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Fitcheck-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('Fitcheck-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [field]: publicUrl }));
      toast.success(`Gambar ${field} berhasil diunggah`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Gagal mengunggah gambar ${field}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = (field: "logo" | "banner") => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const res = await updateBoutiqueProfile(initialData.id, formData);
    if (res.success) {
      toast.success("Profil butik berhasil disimpan");
    } else {
      toast.error(res.error || "Gagal menyimpan profil");
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Visual Assets */}
      <Card className="p-6 border-border/60 border-border/60">
        <h3 className="text-lg font-semibold mb-4">Aset Visual</h3>
        <div className="space-y-6">
          {/* Banner */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner Butik (Disarankan 16:9)</label>
            {formData.banner ? (
              <div className="relative w-full h-48 rounded-[var(--radius-button)] overflow-hidden group">
                <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="destructive" onClick={() => handleRemoveImage("banner")} disabled={isProcessing}>
                    <X className="w-4 h-4 mr-2" /> Hapus Banner
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border/60 border-border/60 rounded-[var(--radius-button)] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                  <Upload className="w-8 h-8 mb-3 text-primary" />
                  <p className="mb-2 text-sm font-semibold">Klik untuk unggah banner</p>
                  <p className="text-xs">SVG, PNG, JPG atau GIF (Maks. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "banner")} disabled={isProcessing} />
              </label>
            )}
          </div>

          {/* Logo */}
          <div className="flex items-end gap-6">
            <div className="shrink-0 relative group">
              {formData.logo ? (
                <div className="w-32 h-32 rounded-[var(--radius-card)] overflow-hidden border-4 border-white border-border/60 shadow-sm">
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[var(--radius-card)]">
                    <button type="button" onClick={() => handleRemoveImage("logo")} className="text-white hover:text-red-500 transition-colors" disabled={isProcessing}>
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="w-32 h-32 rounded-[var(--radius-card)] border-2 border-dashed border-border/60 border-border/60 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors shadow-sm">
                  <Upload className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-xs font-medium text-gray-500">Logo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "logo")} disabled={isProcessing} />
                </label>
              )}
            </div>
            <div className="pb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Logo akan ditampilkan di profil butik dan katalog produk. Gunakan gambar berbentuk persegi (1:1).</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card className="p-6 border-border/60 border-border/60">
        <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Butik <span className="text-red-500">*</span></label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                required
                className="pl-10"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Zara Jakarta"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
            <Textarea 
              rows={4}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ceritakan tentang butik dan koleksi pakaian Anda..."
            />
          </div>
        </div>
      </Card>

      {/* Contact & Location */}
      <Card className="p-6 border-border/60 border-border/60">
        <h3 className="text-lg font-semibold mb-4">Kontak & Lokasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="6281234567890"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10"
                value={formData.instagram || ""}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="email"
                className="pl-10"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@butik.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10"
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.butik.com"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Jam Operasional</label>
            <Input 
              value={formData.openingHours || ""}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              placeholder="Senin - Minggu, 10:00 - 22:00"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Alamat Lengkap</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea 
                className="pl-10"
                rows={3}
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Alamat fisik butik Anda..."
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Google Maps URL</label>
            <Input 
              value={formData.mapsUrl || ""}
              onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
              placeholder="https://goo.gl/maps/..."
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          disabled={isProcessing}
          onClick={() => setFormData(initialData)}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={isProcessing}
          className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}



