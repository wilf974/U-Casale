import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
  const isOnLogin = nextUrl.pathname.startsWith("/login")

  // Redirect to login if accessing dashboard without auth
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Redirect to dashboard if logged in and on login page
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

// Protect these routes
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
