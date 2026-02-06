import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

// Public routes that do NOT require authentication
const PUBLIC_PREFIXES = ["/auth/", "/api/"];
const PUBLIC_EXACT = ["/", "/favicon.ico"];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// Next.js 16+ proxy function (replaces middleware) — deny-by-default
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through without auth check
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // All other routes require authentication
  const session = await auth();

  if (!session) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Deny-by-default: match everything except static assets
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
