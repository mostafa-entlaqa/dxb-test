import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings']
  const authRoutes = ['/login', '/signup', '/forgot-password']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirect to dashboard if logged in user tries to access auth routes
  if (session && isAuthRoute) {
    
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If logged in but profile not completed
  if (session) {
    const { data: profile } = await supabase
      .from('users')
      .select('profile_completed')
      .eq('id', session.user.id)
      .single()

    if (!profile?.profile_completed && !req.nextUrl.pathname.startsWith('/complete-profile')) {
      return NextResponse.redirect(new URL('/complete-profile', req.url))
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
    '/forgot-password'
  ],
} 