import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key){
    console.error(
      "[Fitcheck] Supabase environment variables are missing or invalid.\n" +
      `  NEXT_PUBLIC_SUPABASE_URL: ${url ? "✓ set" : "✗ MISSING"}\n` +
      `  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? (key.startsWith("eyJ") ? "✓ valid JWT" : `✗ INVALID (starts with "${key.substring(0, 15)}...")`) : "✗ MISSING"}\n` +
      "  → Get your keys from: Supabase Dashboard → Settings → API"
    );
  }

  return createBrowserClient(url!, key!);
}
