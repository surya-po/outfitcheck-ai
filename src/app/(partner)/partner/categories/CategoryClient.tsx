"use client";

import { useState } from "react";
import { Category } from "@prisma/client";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  initialCategories: Category[];
}

export default function CategoryClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsProcessing(true);
    const slug = generateSlug(newName);
    const res = await createCategory(newName, slug);
    if (res.success && res.category) {
      setCategories([...categories, res.category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      setIsCreating(false);
      toast.success("Kategori berhasil ditambahkan");
    } else {
      toast.error(res.error || "Gagal menambah kategori");
    }
    setIsProcessing(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setIsProcessing(true);
    const slug = generateSlug(editName);
    const res = await updateCategory(id, editName, slug);
    if (res.success && res.category) {
      setCategories(categories.map(c => c.id === id ? res.category! : c).sort((a, b) => a.name.localeCompare(b.name)));
      setIsEditing(null);
      toast.success("Kategori berhasil diperbarui");
    } else {
      toast.error(res.error || "Gagal memperbarui kategori");
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    setIsProcessing(true);
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Kategori berhasil dihapus");
    } else {
      toast.error(res.error || "Gagal menghapus kategori");
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Cari kategori..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 border-border/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-secondary/20 dark:text-gray-400 border-b border-border/60 border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Ditambahkan Pada</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isCreating && (
                <tr className="bg-secondary/20 dark:bg-primary/5 border-b border-border/60 border-border/60">
                  <td className="px-6 py-4">
                    <Input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      placeholder="Nama Kategori"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      className="h-8"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-400">{generateSlug(newName) || "slug-otomatis"}</td>
                  <td className="px-6 py-4 hidden md:table-cell">-</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setIsCreating(false)} disabled={isProcessing}>Batal</Button>
                    <Button size="sm" onClick={handleCreate} disabled={isProcessing} className="bg-primary hover:opacity-90 text-white">Simpan</Button>
                  </td>
                </tr>
              )}
              
              {filteredCategories.length === 0 && !isCreating ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada kategori ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCategories.map(category => (
                  <tr key={category.id} className="border-b last:border-0 border-border/60 hover:bg-gray-50 border-border/60 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {isEditing === category.id ? (
                        <Input 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          onKeyDown={(e) => e.key === "Enter" && handleUpdate(category.id)}
                          className="h-8 max-w-[200px]"
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {isEditing === category.id ? generateSlug(editName) : category.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      {format(new Date(category.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing === category.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setIsEditing(null)} disabled={isProcessing} className="h-8 px-2">
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => handleUpdate(category.id)} disabled={isProcessing} className="h-8 px-3 bg-primary hover:opacity-90 text-white">
                            Simpan
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setIsEditing(category.id);
                              setEditName(category.name);
                            }}
                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}



