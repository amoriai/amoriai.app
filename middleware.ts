import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware neutre : il laisse tout passer
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
