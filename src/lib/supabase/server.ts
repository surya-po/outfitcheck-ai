import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function validateEnvVars() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const errors: string[] = [];

  if (!url || !url.startsWith("https://") || !url.includes(".supabase.co")) {
    errors.push(
      `NEXT_PUBLIC_SUPABASE_URL is invalid: "${url ?? "(not set)"}". ` +
      `Expected format: https://your-project.supabase.co`
    );
  }

  if (!key || key.length < 100 || !key.startsWith("eyJ")) {
    errors.push(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY is invalid. ` +
      `The key should be a JWT starting with "eyJ" and be ~200+ characters long. ` +
      `Current value starts with: "${key ? key.substring(0, 20) + "..." : "(not set)"}". ` +
      `Get your real anon key from: Supabase Dashboard → Settings → API → Project API keys → anon (public)`
    );
  }

  if (errors.length > 0) {
    console.error(
      "\n⚠️  [Fitcheck AI] Supabase configuration error:\n" +
      errors.map((e) => `   → ${e}`).join("\n") +
      "\n"
    );
    return false;
  }

  return true;
}

export async function createClient() {
  validateEnvVars();

  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
  return client;
}
