// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase PUBLIC (ANON)
 * ✅ Utilisé côté client uniquement
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL manquante.");
if (!supabaseAnonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY manquante.");

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,

    // ✅ IMPORTANT: on veut le flow PKCE (code dans l'URL) pour que /auth/callback échange le code.
    flowType: "pkce",

    // ✅ IMPORTANT: empêche Supabase de traiter #access_token dans l'URL (implicit flow)
    detectSessionInUrl: false,
  },
});
