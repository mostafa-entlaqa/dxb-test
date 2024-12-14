import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        // If there's an error, redirect to login with error message
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
        )
      }
    }

    // Successful auth - redirect to the next URL or dashboard
    return NextResponse.redirect(new URL(next, request.url))
  } catch (error) {
    // Handle any unexpected errors
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/login?error=Authentication%20failed', request.url)
    )
  }
} 