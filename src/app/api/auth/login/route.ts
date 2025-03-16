// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Store these in environment variables in production!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "your-secure-password"
const JWT_SECRET = process.env.JWT_SECRET || "your-personal-secret-key"

export async function POST(request: Request) {
  const { password } = await request.json()

  console.log(ADMIN_PASSWORD, JWT_SECRET)

  // Simple password check
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  // Create JWT token
  const token = sign(
    { userId: "admin" }, // You can use any identifier
    JWT_SECRET,
    { expiresIn: "30d" }, // Longer expiry for personal use
  )

  // Set HTTP-only cookie
  const response = NextResponse.json({ success: true }, { status: 200 })

  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return response
}
