import { getBoutiqueProducts } from "@/app/actions/boutique-product";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import ProductListClient from "./ProductListClient";
import { Metadata } from "next";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Produk - Partner Dashboard",
};

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const boutique = user
    ? await prisma.boutique.findFirst({
        where: { ownerId: user.id },
        select: { verified: true },
      })
    : null;

  const products = await getBoutiqueProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">Katalog Produk</h1>
        <p className="text-muted-foreground">Kelola semua produk butik Anda. Pastikan detail produk lengkap untuk hasil rekomendasi AI yang maksimal.</p>
      </div>



      <ProductListClient initialProducts={products as any} />
    </div>
  );
}



