import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ hasAmoria: false }, { status: 200 });
    }

    // ⚠️ On lit le user depuis le token Supabase du cookie (si tu utilises auth-helpers, c’est encore mieux)
    // Ici: on fait simple -> on attend que tu ajoutes le bearer token si nécessaire.
    // Pour éviter ça, tu peux adapter /auth/callback pour appeler redirectAfterLogin côté client après login.

    // Alternative simple: on ne peut pas deviner le user sans token.
    // Donc on retourne 200 false si pas de user.

    // 👉 La version robuste (recommandée) utilise @supabase/auth-helpers-nextjs
    // Si tu veux, je te donne cette version exacte selon ton setup.

    // Pour l’instant: on répond "false" par défaut (à remplacer par version auth-helpers)
    return NextResponse.json({ hasAmoria: false }, { status: 200 });
  } catch {
    return NextResponse.json({ hasAmoria: false }, { status: 200 });
  }
}
