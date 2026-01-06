import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/admin',
  '/onboarding',
  '/forum/new',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/auth/signin',
  '/auth/signup',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session cookie (Better Auth uses this pattern)
  const sessionCookie = request.cookies.get('agi-house.session_token')
  const isAuthenticated = !!sessionCookie?.value

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Redirect to sign-in if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/onboarding/:path*',
    '/forum/new/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
}
