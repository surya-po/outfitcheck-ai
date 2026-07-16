import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'suryaakun0102@gmail.com';
  console.log(`Modifying user: ${email}`);

  // 1. Get user ID
  const authUsers = await prisma.$queryRawUnsafe<Array<any>>(
    "SELECT id, raw_app_meta_data FROM auth.users WHERE email = $1",
    email
  );

  if (authUsers.length === 0) {
    console.log("User not found.");
    return;
  }

  const user = authUsers[0];
  const userId = user.id;
  let rawAppMetaData = user.raw_app_meta_data || {};
  
  if (typeof rawAppMetaData === 'string') {
    rawAppMetaData = JSON.parse(rawAppMetaData);
  }

  // Update metadata
  rawAppMetaData.provider = 'google';
  rawAppMetaData.providers = ['google'];

  // 2. Update auth.users (remove password, update metadata)
  await prisma.$executeRawUnsafe(
    "UPDATE auth.users SET encrypted_password = NULL, raw_app_meta_data = $1::jsonb WHERE id = $2::uuid",
    JSON.stringify(rawAppMetaData),
    userId
  );
  console.log("Cleared password and updated raw_app_meta_data in auth.users.");

  // 3. Delete 'email' identity from auth.identities
  await prisma.$executeRawUnsafe(
    "DELETE FROM auth.identities WHERE user_id = $1::uuid AND provider = 'email'",
    userId
  );
  console.log("Deleted 'email' provider identity from auth.identities.");

  console.log("\nSuccess! The account can now only be accessed via Google.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
