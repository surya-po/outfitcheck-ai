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

  // Helper to ensure redirects use the correct domain
  const getRedirectUrl = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = ""; // clear query params if needed, or leave it depending on usage. Actually, just clear them to be safe for basic redirects.
    return url;
  };

  // --- Partner routes: redirect to /partner-login if not authenticated ---
  const isPartnerRoute =
    pathname.startsWith("/partner/") && pathname !== "/partner-login";

  if (!user && isPartnerRoute) {
    return NextResponse.redirect(getRedirectUrl("/partner-login"));
  }

  // If already logged in and trying to access /partner-login → redirect to partner dashboard
  if (user && pathname === "/partner-login") {
    // Prevent redirect loop if they were just redirected here due to unauthorized access
    if (!request.nextUrl.searchParams.has("error")) {
      return NextResponse.redirect(getRedirectUrl("/partner/dashboard"));
    }
  }

  // --- Regular routes: redirect to /login if not authenticated ---
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(getRedirectUrl("/login"));
  }

  // Fallback: If Supabase redirects to /?code=... due to misconfigured Redirect URIs
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    let redirectUrl;
    if (request.cookies.has("intended_partner_login")) {
      redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/partner-callback";
    } else {
      redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/callback";
    }
    
    const res = NextResponse.redirect(redirectUrl);
    if (request.cookies.has("intended_partner_login")) {
      res.cookies.delete("intended_partner_login");
    }
    return res;
  }

  // Redirect authenticated users away from landing and auth pages (not partner login)
  if (user && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(getRedirectUrl("/dashboard"));
  }

  return supabaseResponse;
}
