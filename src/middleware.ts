import { getSession } from "@/lib/session.server";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = (() => {
    // white list
    if (["/api/web-clipper", "/auth/"].find((p) => path.startsWith(p))) {
      return false;
    }
    // black list
    if (
      [
        "/api/",
        "/upload/",
        "/note",
        "/quick-access",
        "/settings",
        "/sub",
        "/tools",
        "/account",
      ].find((p) => path.startsWith(p))
    ) {
      return true;
    }
    // home
    if (path === "/") {
      return true;
    }
    return false;
  })();
  if (isProtectedRoute) {
    const session = await getSession();
    if (session.userRole !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }
  }
  return NextResponse.next();
}
