import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("[MIDDLEWARE] Request to:", pathname);

  // Proteksi admin routes
  if (pathname.startsWith("/admin")) {
    const authToken = request.cookies.get("auth_token");
    console.log(
      "[MIDDLEWARE] Admin route - auth_token present:",
      !!authToken,
      "Value:",
      authToken?.value
    );

    if (!authToken) {
      // Redirect ke login jika tidak ada auth_token
      console.log("[MIDDLEWARE] No auth token, redirecting to login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    console.log("[MIDDLEWARE] Auth token valid, allowing access");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
