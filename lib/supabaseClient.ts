// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase PUBLIC (ANON)
 * ✅ Utilisé côté client uniquement
 * ❌ Ne JAMAIS utiliser la Service Role ici
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL manquante.");
}
if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY manquante.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // garde la session
    autoRefreshToken: true,     // refresh auto
    detectSessionInUrl: true,   // nécessaire pour OAuth / magic link
  },
});
