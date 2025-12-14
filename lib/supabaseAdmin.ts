// lib/supabaseAdmin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase ADMIN (Service Role)
 * ✅ À utiliser UNIQUEMENT côté serveur (API routes / server actions)
 * ❌ Ne jamais importer dans un fichier "use client"
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL manquante (Vercel env).");
}
if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante (Vercel env).");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
