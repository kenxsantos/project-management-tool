import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/projects", "/profile", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const isLoggedIn = req.cookies.get("auth_token");

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*", "/profile/:path*", "/settings/:path*"],
};
