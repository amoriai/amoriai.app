import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware neutre : laisse tout passer, aucune redirection
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// (optionnel) si tu avais un config avant, tu peux l’enlever
// ou laisser ceci :
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
