import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get user only for protected routes or auth routes
  const protectedRoutes = ['/dashboard', '/settings', '/buy', '/sell', '/business', '/profile', '/my-listings']
  const authRoutes = ['/login', '/signup', '/forgot-password']

  const isProtectedRoute = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Check for complete-profile page first
  if (req.nextUrl.pathname === '/complete-profile') {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('profile_completed')
        .eq('id', user.id)
        .single()

      if (profile?.profile_completed) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  // Only check user if needed
  if (isProtectedRoute || isAuthRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Redirect to dashboard if logged in user tries to access auth routes
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect to login if accessing protected route without user
    if (isProtectedRoute && !user) {
      const returnUrl = req.nextUrl.pathname + req.nextUrl.search
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(returnUrl)}`, req.url))
    }

    // Only check profile completion for protected routes
    if (user && isProtectedRoute && !req.nextUrl.pathname.startsWith('/complete-profile')) {
      const { data: profile } = await supabase
        .from('users')
        .select('profile_completed')
        .eq('id', user.id)
        .single()

      if (!profile?.profile_completed) {
        return NextResponse.redirect(new URL('/complete-profile', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/complete-profile',
    '/login',
    '/signup',
    '/forgot-password',
    '/buy/:path*',
    '/sell/:path*',
    '/business/:path*',
    '/profile/:path*',
    '/my-listings/:path*',
  ],
}