import { NextResponse } from "next/server";

export async function middleware() {
  // For now, we'll skip middleware protection and handle auth in the components
  // You can implement proper middleware protection later with JWT tokens

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
