require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Creating Storage RLS Policies for 'scans' bucket...");

    // Insert policy
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable insert for authenticated users on scans" 
      ON storage.objects FOR INSERT 
      TO authenticated 
      WITH CHECK ( bucket_id = 'scans' );
    `);
    
    // Update policy (since we use upsert: true)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable update for authenticated users on scans" 
      ON storage.objects FOR UPDATE 
      TO authenticated 
      USING ( bucket_id = 'scans' );
    `);

    // Select policy (just in case they need to list files)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable select for authenticated users on scans" 
      ON storage.objects FOR SELECT 
      TO authenticated 
      USING ( bucket_id = 'scans' );
    `);

    console.log("Policies created successfully!");
  } catch (e) {
    // If the policies already exist, it will throw an error, which is fine
    console.log("Error or policies might already exist:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
