"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product, ProductStatus } from "@prisma/client";
import { 
  deleteBoutiqueProduct, 
  bulkDeleteProducts,
  bulkUpdateProductStatus
} from "@/app/actions/boutique-product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Trash2, Eye, CheckSquare, Square, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductWithCategory extends Product {
  categoryRel?: { name: string } | null;
}

interface Props {
  initialProducts: ProductWithCategory[];
}

const ITEMS_PER_PAGE = 10;

export default function ProductListClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.categoryRel?.name || p.category));
    return Array.from(cats).filter(Boolean);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const result = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.categoryRel?.name || p.category).toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "ALL" || (p.categoryRel?.name || p.category) === categoryFilter;
      const matchStatus = statusFilter === "ALL" || p.productStatus === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });

    switch (sortOption) {
      case "A-Z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "PRICE_LOW":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "PRICE_HIGH":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "OLDEST":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "NEWEST":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, search, categoryFilter, statusFilter, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Ensure current page is valid when filters change
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  const toggleSelectAll = () => {
    if (selectedIds.length === currentProducts.length && currentProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Actions
  const confirmDelete = (id: string | null) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    setIsProcessing(true);
    
    if (productToDelete) {
      // Single Delete
      const res = await deleteBoutiqueProduct(productToDelete);
      if (res.success) {
        setProducts(products.filter(p => p.id !== productToDelete));
        setSelectedIds(selectedIds.filter(i => i !== productToDelete));
        toast.success("Produk berhasil dihapus");
      } else {
        toast.error(res.error || "Gagal menghapus produk");
      }
    } else if (selectedIds.length > 0) {
      // Bulk Delete
      const res = await bulkDeleteProducts(selectedIds);
      if (res.success) {
        setProducts(products.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        toast.success(`${selectedIds.length} produk berhasil dihapus`);
      } else {
        toast.error(res.error || "Gagal menghapus produk");
      }
    }
    
    setIsProcessing(false);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleBulkStatus = async (status: ProductStatus) => {
    if (selectedIds.length === 0) return;
    
    setIsProcessing(true);
    const res = await bulkUpdateProductStatus(selectedIds, status);
    if (res.success) {
      setProducts(products.map(p => 
        selectedIds.includes(p.id) ? { ...p, productStatus: status, status: status === "PUBLISHED" ? "available" : "unavailable" } : p
      ));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} produk berhasil diperbarui menjadi ${status === "PUBLISHED" ? "Aktif" : status}`);
    } else {
      toast.error(res.error || "Gagal memperbarui status");
    }
    setIsProcessing(false);
  };

  const handleToggleActive = async (id: string, currentStatus: ProductStatus) => {
    const newStatus = currentStatus === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    setIsProcessing(true);
    const res = await bulkUpdateProductStatus([id], newStatus);
    if (res.success) {
      setProducts(products.map(p => 
        p.id === id ? { ...p, productStatus: newStatus, status: newStatus === "PUBLISHED" ? "available" : "unavailable" } : p
      ));
      toast.success(`Status berhasil diperbarui menjadi ${newStatus === "PUBLISHED" ? "Aktif" : "Tersembunyi"}`);
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
    setIsProcessing(false);
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "PUBLISHED": return <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Aktif</span>;
      case "DRAFT": return <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Draft</span>;
      case "HIDDEN": return <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">Tersembunyi</span>;
      case "SOLDOUT": return <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Habis</span>;
      default: return <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Cari nama atau kategori..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 bg-white dark:bg-gray-900 border-[#FDF2F8] dark:border-gray-800 focus-visible:ring-[#EC4899]"
            />
          </div>
          
          <select 
            className="h-10 rounded-md border border-[#FDF2F8] dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 focus:ring-offset-background"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Kategori (Semua)</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select 
            className="h-10 rounded-md border border-[#FDF2F8] dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 focus:ring-offset-background"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Status (Semua)</option>
            <option value="PUBLISHED">Aktif</option>
            <option value="DRAFT">Draft</option>
            <option value="HIDDEN">Tersembunyi</option>
            <option value="SOLDOUT">Habis</option>
          </select>

          <select 
            className="h-10 rounded-md border border-[#FDF2F8] dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 focus:ring-offset-background"
            value={sortOption}
            onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
          >
            <option value="NEWEST">Terbaru</option>
            <option value="OLDEST">Terlama</option>
            <option value="A-Z">Nama A-Z</option>
            <option value="Z-A">Nama Z-A</option>
            <option value="PRICE_LOW">Termurah</option>
            <option value="PRICE_HIGH">Termahal</option>
          </select>
        </div>
        
        <Link href="/partner/products/create" className="shrink-0">
          <Button className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-[#FFF7FB] dark:bg-[#EC4899]/10 border border-[#FDF2F8] dark:border-[#EC4899]/30 rounded-xl p-3 px-5 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <span className="text-sm font-semibold text-[#EC4899] dark:text-[#FBCFE8]">
            {selectedIds.length} produk dipilih
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-white hover:text-green-600 hover:border-green-200" onClick={() => handleBulkStatus("PUBLISHED")} disabled={isProcessing}>Aktifkan</Button>
            <Button size="sm" variant="outline" className="bg-white hover:text-yellow-600 hover:border-yellow-200" onClick={() => handleBulkStatus("HIDDEN")} disabled={isProcessing}>Sembunyikan</Button>
            <Button size="sm" variant="destructive" onClick={() => confirmDelete(null)} disabled={isProcessing}>Hapus Semua</Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <Card className="overflow-hidden border-[#FDF2F8] dark:border-gray-800 shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b border-[#FDF2F8] dark:border-gray-800">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-[#EC4899] transition-colors focus:outline-none">
                    {currentProducts.length > 0 && selectedIds.length === currentProducts.length ? 
                      <CheckSquare className="w-5 h-5 text-[#EC4899]" /> : 
                      <Square className="w-5 h-5" />
                    }
                  </button>
                </th>
                <th className="px-2 py-4 font-semibold w-16">Foto</th>
                <th className="px-4 py-4 font-semibold min-w-[200px]">Produk</th>
                <th className="px-4 py-4 font-semibold hidden lg:table-cell">Kategori</th>
                <th className="px-4 py-4 font-semibold">Harga</th>
                <th className="px-4 py-4 font-semibold text-center w-20">Stok</th>
                <th className="px-4 py-4 font-semibold text-center">Status</th>
                <th className="px-4 py-4 font-semibold text-center w-24">Tampil</th>
                <th className="px-4 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center text-gray-500 bg-white dark:bg-gray-950">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tidak ada produk</h3>
                      <p className="text-sm mb-6 text-gray-500">Pencarian Anda tidak menemukan hasil, atau Anda belum menambahkan produk ke katalog ini.</p>
                      {products.length === 0 && (
                        <Link href="/partner/products/create">
                          <Button className="bg-[#EC4899] hover:bg-[#BE185D] text-white">Mulai Tambah Produk</Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentProducts.map(product => (
                  <tr key={product.id} className="border-b last:border-0 border-[#FDF2F8] hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50 transition-colors group">
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => toggleSelect(product.id)} className="text-gray-400 hover:text-[#EC4899] transition-colors focus:outline-none">
                        {selectedIds.includes(product.id) ? 
                          <CheckSquare className="w-5 h-5 text-[#EC4899]" /> : 
                          <Square className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        }
                      </button>
                    </td>
                    <td className="px-2 py-4">
                      <div className="w-12 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0 border border-[#FDF2F8] dark:border-gray-700 shadow-sm">
                        {product.thumbnail || product.image ? (
                          <img src={product.thumbnail || product.image || ""} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{format(new Date(product.createdAt), "dd MMM yyyy", { locale: localeId })}</div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="font-medium text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md inline-block text-xs">{product.categoryRel?.name || product.category}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {product.discountPrice ? (
                        <div>
                          <div className="font-bold text-[#EC4899]">{formatPrice(product.discountPrice)}</div>
                          <div className="text-xs text-gray-400 line-through mt-0.5">{formatPrice(product.price)}</div>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-900 dark:text-gray-200">{formatPrice(product.price)}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center font-medium">
                      <span className={product.stock === 0 ? "text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md text-xs" : ""}>
                        {product.stock !== null ? product.stock : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(product.productStatus)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <Switch 
                          checked={product.productStatus === "PUBLISHED"} 
                          onCheckedChange={() => handleToggleActive(product.id, product.productStatus)}
                          disabled={isProcessing}
                          className="data-[state=checked]:bg-[#EC4899]"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link href={`/partner/products/${product.id}`} className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800" title="Preview">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => confirmDelete(product.id)}
                          disabled={isProcessing}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-100 dark:border-gray-800"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#FDF2F8] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="text-sm text-gray-500">
              Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + (filteredProducts.length > 0 ? 1 : 0)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} dari {filteredProducts.length} produk
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium px-3">
                {currentPage} / {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete 
                ? "Produk ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan." 
                : `${selectedIds.length} produk yang dipilih akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); executeDelete(); }} 
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
