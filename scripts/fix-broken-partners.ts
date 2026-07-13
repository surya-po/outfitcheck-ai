import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log("Fetching auth users...");
  // Unfortunately with anon key we can't easily list users, so we'll just rely on the emails we know
  // The user "islatuladha08@gmail.com" is one of them.
  // Wait, I can query Prisma for users that are NOT in public.User but in auth.users?
  // Prisma doesn't have access to auth schema directly in PrismaClient unless we use $queryRaw.
  
  try {
    const authUsers: any[] = await prisma.$queryRawUnsafe(`SELECT id, email, raw_user_meta_data FROM auth.users`);
    
    for (const authUser of authUsers) {
      const publicUser = await prisma.user.findUnique({ where: { id: authUser.id } });
      
      if (!publicUser) {
        console.log(`Found missing user in public.User: ${authUser.email}`);
        
        await prisma.user.create({
          data: {
            id: authUser.id,
            email: authUser.email,
            role: "PARTNER",
          }
        });
        
        await prisma.boutique.create({
          data: {
            ownerId: authUser.id,
            name: authUser.raw_user_meta_data?.full_name || "My Boutique",
            status: "VERIFIED",
          }
        });
        console.log(`✅ Fixed user and created boutique for ${authUser.email}`);
      }
    }
  } catch (err) {
    console.error("Error fixing users:", err);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
