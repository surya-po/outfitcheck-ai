const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const topRecommended = await prisma.product.findMany({
      where: { boutiqueId: 'some-id' },
      include: {
        _count: {
          select: { productRecommendations: true }
        }
      },
      orderBy: {
        productRecommendations: {
          _count: 'desc'
        }
      },
      take: 5
    });
    console.log('Query success:', topRecommended[0] ? topRecommended[0]._count : 'no items');
  } catch(e) {
    console.error('Prisma Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
