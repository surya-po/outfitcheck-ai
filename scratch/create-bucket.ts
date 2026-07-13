import { prisma } from '../src/lib/prisma';

async function createBucket() {
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('outfitcheck-images', 'outfitcheck-images', true) 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Bucket created successfully!");
  } catch (err) {
    console.error("Error creating bucket:", err);
  }
}

createBucket();
