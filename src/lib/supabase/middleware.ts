import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  console.log("==========");
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("==========");
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add logic between createServerClient and supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/", 
    "/login", 
    "/register", 
    "/forgot-password", 
    "/reset-password",
    "/partner-register",
    "/partner-forgot-password",
    "/partner-reset-password"
  ];
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/") ||
    pathname === "/partner-login"; // Partner login is also public

  // --- Partner routes: redirect to /partner-login if not authenticated ---
  const isPartnerRoute =
    pathname.startsWith("/partner/") && pathname !== "/partner-login";

  if (!user && isPartnerRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/partner-login";
    return NextResponse.redirect(url);
  }

  // If already logged in and trying to access /partner-login → redirect to partner dashboard
  if (user && pathname === "/partner-login") {
    // Prevent redirect loop if they were just redirected here due to unauthorized access
    if (!request.nextUrl.searchParams.has("error")) {
      const url = request.nextUrl.clone();
      url.pathname = "/partner/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // --- Regular routes: redirect to /login if not authenticated ---
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from landing and auth pages (not partner login)
  if (user && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Fallback: If Supabase redirects to /?code=... due to misconfigured Redirect URIs
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
