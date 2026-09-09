import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Run Supabase session cookie refresh & verify token
  const { supabaseResponse, user } = await updateSession(request);

  const isStudentRoute = pathname.startsWith("/student");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // If visiting protected student or admin routes
  if (isStudentRoute || isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = user.user_metadata?.role as string | undefined;

    // Restrict student access to admin routes
    if (isAdminRoute && userRole !== "ADMIN") {
      const studentRedirect = new URL("/student/dashboard", request.url);
      studentRedirect.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(studentRedirect);
    }

    // Restrict admin access to student-only routes (redirect to admin dashboard)
    if (isStudentRoute && userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // If already authenticated and accessing login/register, forward to respective dashboard
  if (isAuthRoute && user && !searchParams.has("force")) {
    const userRole = user.user_metadata?.role as string | undefined;
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static images / assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
