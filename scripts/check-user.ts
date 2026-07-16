import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'suryaakun0102@gmail.com';
  console.log(`Checking user: ${email}`);

  // Query auth.users
  const authUsers = await prisma.$queryRawUnsafe<Array<any>>(
    "SELECT id, email, encrypted_password, raw_app_meta_data->>'provider' as provider, raw_app_meta_data->>'providers' as providers FROM auth.users WHERE email = $1",
    email
  );

  if (authUsers.length === 0) {
    console.log("User not found in auth.users.");
  } else {
    for (const user of authUsers) {
      console.log(`\nFound User ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Has Password: ${user.encrypted_password ? 'Yes (Manual Registration/Password Set)' : 'No'}`);
      console.log(`Primary Provider: ${user.provider}`);
      console.log(`All Providers: ${user.providers}`);
    }
  }

  const publicUser = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  });

  console.log("\nPublic Schema User Record:", publicUser ? "Found" : "Not Found");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
