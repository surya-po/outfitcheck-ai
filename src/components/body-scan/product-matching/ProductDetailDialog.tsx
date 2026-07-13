import { Product } from "@/lib/product-matching-engine/product-types";
import { X, Store, MapPin, Phone, AtSign, Globe, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailDialogProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailDialog({ product, onClose }: ProductDetailDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="relative w-full max-w-2xl bg-[#1E1E2D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{product.name}</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Image */}
            <div className="w-full sm:w-1/3 aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-white/5 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-[#EC4899] font-bold text-sm uppercase tracking-wider mb-1">
                  {product.category} • {product.style}
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EC4899]/10 text-[#EC4899] text-xs font-semibold border border-[#EC4899]/20">
                  <span>{product.compatibilityScore}% Cocok</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-white/50 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Alasan Rekomendasi</p>
                    <p className="text-xs text-white/70 leading-relaxed">{product.recommendationReason}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">Potongan (Fit)</p>
                  <p className="text-sm text-white font-medium">{product.fit}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Material</p>
                  <p className="text-sm text-white font-medium">{product.material || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Warna Tersedia</p>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.length > 0 ? product.colors.map(c => (
                      <span key={c} className="text-xs px-2 py-0.5 bg-white/10 rounded-md text-white/80">{c}</span>
                    )) : <span className="text-sm text-white">-</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Ukuran</p>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.length > 0 ? product.sizes.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-white/10 rounded-md text-white/80">{s}</span>
                    )) : <span className="text-sm text-white">-</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Store className="w-5 h-5 text-gray-400" />
                Informasi Toko
              </h3>
              {!product.storeInfo.isPartner && (
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md uppercase tracking-wider">
                  Segera Hadir
                </span>
              )}
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-white/40"><Store className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-white/50">Nama Toko</p>
                    <p className="text-sm text-white/90">{product.storeInfo.name || "Belum tersedia"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-white/40"><MapPin className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-white/50">Alamat</p>
                    <p className="text-sm text-white/90">{product.storeInfo.address || "Belum tersedia"}</p>
                    {product.storeInfo.mapsUrl && (
                      <a 
                        href={product.storeInfo.mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-[#EC4899] hover:underline mt-1 inline-block"
                      >
                        Buka di Google Maps
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-white/40"><Phone className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-white/50">WhatsApp</p>
                    <p className="text-sm text-white/90">{product.storeInfo.phone || "Belum tersedia"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-white/40"><AtSign className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-white/50">Instagram</p>
                    <p className="text-sm text-white/90">{product.storeInfo.instagram || "Belum tersedia"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-white/40"><Globe className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-white/50">Website</p>
                    <p className="text-sm text-white/90">{product.storeInfo.website || "Belum tersedia"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-white/40"><Clock className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-white/50">Jam Operasional</p>
                    <p className="text-sm text-white/90">{product.storeInfo.openingHours || "Belum tersedia"}</p>
                  </div>
                </div>

              </div>

              {!product.storeInfo.isPartner && (
                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                  <p className="text-xs text-white/50 italic">Status: Belum menjadi Mitra OutfitCheck AI</p>
                </div>
              )}
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
          <Button 
            onClick={onClose}
            className="w-full sm:w-auto bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
