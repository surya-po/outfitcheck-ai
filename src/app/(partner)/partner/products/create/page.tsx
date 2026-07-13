import { getCategories } from "@/app/actions/category";
import ProductForm from "../ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Produk - Partner Dashboard",
};

export default async function CreateProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Produk Baru</h1>
        <p className="text-gray-500 dark:text-gray-400">Lengkapi detail produk dengan akurat agar AI dapat memberikan rekomendasi terbaik untuk pelanggan.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
