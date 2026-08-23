import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const cleanHost = hostname.toLowerCase().split(":")[0];

  // 1. Security Headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 2. Custom Domain Mapping
  // If request is from a custom domain (not nxcverse.in or localhost)
  const isDefaultDomain =
    cleanHost === "nxcverse.in" ||
    cleanHost === "www.nxcverse.in" ||
    cleanHost === "localhost" ||
    cleanHost === "127.0.0.1" ||
    cleanHost.endsWith(".pages.dev") ||
    cleanHost.endsWith(".workers.dev");

  if (!isDefaultDomain && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/_next")) {
    // Rewrite hostname directly to custom domain resolver route
    url.pathname = `/_custom_domain/${cleanHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Auth Protected Routes
  if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin")) {
    const token = request.cookies.get("nxc_auth_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
