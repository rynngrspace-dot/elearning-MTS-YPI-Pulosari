import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "default_secret_key_change_me";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Get session from cookies
  const session = request.cookies.get("session")?.value;

  // 2. Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });
      
      // Basic Role consistency check (Optional: but good for Clean Code)
      // e.g. If trying to access /dashboard/admin but role is TEACHER -> redirect to /dashboard/guru
      const role = payload.role;
      if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL(getRolePath(role), request.url));
      }
      if (pathname.startsWith("/dashboard/guru") && role !== "TEACHER") {
        return NextResponse.redirect(new URL(getRolePath(role), request.url));
      }
      if (pathname.startsWith("/dashboard/siswa") && role !== "STUDENT") {
        return NextResponse.redirect(new URL(getRolePath(role), request.url));
      }

    } catch (error) {
      // Invalid session
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Prevent logged-in users from accessing /login
  if (pathname === "/login") {
    if (session) {
      try {
        const { payload } = await jwtVerify(session, key, {
          algorithms: ["HS256"],
        });
        return NextResponse.redirect(new URL(getRolePath(payload.role), request.url));
      } catch (error) {
        // Session invalid, let them see login page
      }
    }
  }

  return NextResponse.next();
}

function getRolePath(role) {
  switch (role) {
    case "ADMIN": return "/dashboard/admin";
    case "TEACHER": return "/dashboard/guru";
    case "STUDENT": return "/dashboard/siswa";
    default: return "/dashboard";
  }
}

// Matching paths
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
