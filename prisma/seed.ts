import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Atasan', slug: 'atasan' },
    { name: 'Bawahan', slug: 'bawahan' },
    { name: 'Dress', slug: 'dress' },
    { name: 'Outerwear', slug: 'outerwear' },
    { name: 'Sepatu', slug: 'sepatu' },
    { name: 'Sandal', slug: 'sandal' },
    { name: 'Tas', slug: 'tas' },
    { name: 'Hijab', slug: 'hijab' },
    { name: 'Aksesoris', slug: 'aksesoris' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        name: category.name,
        slug: category.slug,
      },
    })
  }

  console.log('Seed: Categories successfully upserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
