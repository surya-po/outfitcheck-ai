import { getCategories } from "@/app/actions/category";
import { getProduct } from "@/app/actions/boutique-product";
import ProductForm from "../../ProductForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Produk - Partner Dashboard",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const resolvedParams = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProduct(resolvedParams.id)
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Produk</h1>
        <p className="text-gray-500 dark:text-gray-400">Perbarui informasi produk {product.name}.</p>
      </div>

      <ProductForm categories={categories} initialData={product as any} />
    </div>
  );
}



