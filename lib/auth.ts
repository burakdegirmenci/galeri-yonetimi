import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const COOKIE_NAME = 'auth_token'

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('[verifyToken] Attempting to verify token with JWT_SECRET:', JWT_SECRET ? 'EXISTS' : 'MISSING')
    console.log('[verifyToken] Token length:', token.length)
    const result = jwt.verify(token, JWT_SECRET) as JWTPayload
    console.log('[verifyToken] SUCCESS - Token verified')
    return result
  } catch (error) {
    console.log('[verifyToken] FAILED - Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie()
  if (!token) return null
  return verifyToken(token)
}
