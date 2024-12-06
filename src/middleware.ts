import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not logged in, allow the request
  if (!session) {
    return res
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('profile_completed')
    .eq('id', session.user.id)
    .single()

  // If profile is not completed and user is not on complete-profile page
  if (!profile?.profile_completed && !req.nextUrl.pathname.startsWith('/complete-profile')) {
    return NextResponse.redirect(new URL('/complete-profile', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    // Add other protected routes
  ],
} 