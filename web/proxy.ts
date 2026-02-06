import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16+ proxy function (replaces middleware)
export async function proxy(request: NextRequest) {
  const session = await auth();

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth/");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  // Allow auth pages and API routes through
  if (isAuthPage || isApiRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in
  if (!session) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect all authenticated routes
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/orders/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
