/**
 * Script untuk mengubah role user menjadi PARTNER di database.
 * Jalankan: npx tsx scripts/make-partner.ts <email@user.com>
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Usage: npx tsx scripts/make-partner.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌ User dengan email "${email}" tidak ditemukan di database.`);
    console.log("💡 Tip: Pastikan user sudah pernah login/register terlebih dahulu di aplikasi.");
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { role: "PARTNER" },
  });

  // Pastikan juga punya boutique dan set ke VERIFIED
  const boutique = await prisma.boutique.findFirst({ where: { ownerId: user.id } });
  if (!boutique) {
    await prisma.boutique.create({
      data: {
        ownerId: user.id,
        name: "My Boutique",
        status: "VERIFIED",
      },
    });
    console.log("✅ Boutique baru berhasil dibuat dengan status VERIFIED.");
  } else {
    await prisma.boutique.update({
      where: { id: boutique.id },
      data: { status: "VERIFIED" }
    });
    console.log("✅ Status Boutique diperbarui menjadi VERIFIED.");
  }

  console.log(`✅ User "${email}" berhasil diubah menjadi PARTNER.`);
  console.log(`   Role sebelumnya: ${user.role}`);
  console.log(`   Role sekarang:   PARTNER`);
  console.log(`\n   Sekarang login di: http://localhost:3000/partner-login`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
