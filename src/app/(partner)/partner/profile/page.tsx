import { getBoutiqueProfile } from "@/app/actions/boutique";
import ProfileClient from "./ProfileClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Butik - Partner Dashboard",
};

export default async function ProfilePage() {
  const boutique = await getBoutiqueProfile();

  if (!boutique) {
    return <div>Butik tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Butik</h1>
        <p className="text-gray-500 dark:text-gray-400">Lengkapi informasi butik Anda agar lebih dipercaya oleh pelanggan dan sistem rekomendasi kami.</p>
      </div>

      <ProfileClient initialData={boutique} />
    </div>
  );
}
