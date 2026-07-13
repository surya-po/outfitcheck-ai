import { getCategories } from "@/app/actions/category";
import CategoryClient from "./CategoryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori - Partner Dashboard",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Kategori</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola kategori global yang akan digunakan untuk pengelompokan produk.</p>
      </div>

      <CategoryClient initialCategories={categories} />
    </div>
  );
}
