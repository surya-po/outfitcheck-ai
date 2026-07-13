import { prisma } from '../src/lib/prisma';

async function createPolicies() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable all for outfitcheck-images" 
      ON storage.objects FOR ALL 
      USING (bucket_id = 'outfitcheck-images') 
      WITH CHECK (bucket_id = 'outfitcheck-images');
    `);
    console.log("Policy created successfully!");
  } catch (err) {
    console.error("Error creating policy:", err);
  }
}

createPolicies();
