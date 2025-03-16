import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Your secret key - store in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || "your-personal-secret-key"

// Public paths that don't require authentication
const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for auth token
  const authToken = request.cookies.get("auth-token")?.value

  if (!authToken) {
    // Redirect to login if no token
    console.log("No token found")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify JWT token with jose
    await jwtVerify(authToken, new TextEncoder().encode(JWT_SECRET))
    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    console.error("Invalid token", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
