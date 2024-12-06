import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?status=confirmation-error&message=Invalid verification link', request.url)
      )
    }

    // First, exchange the code for a session
    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (authError) throw authError
    if (!session?.user) throw new Error('No user found')

    // Disable RLS temporarily for this check
    const { data: profile, error: profileError } = await supabase.rpc('get_user_profile', {
      user_id: session.user.id
    })

    if (profileError) {
      console.error('Profile check error:', profileError)
      // If error is "function not found", we need to create it
      await supabase.rpc('create_user_profile', {
        user_id: session.user.id,
        user_email: session.user.email
      })
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }

    // Profile exists, check completion status
    if (profile?.profile_completed) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }

  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/login?status=confirmation-error&message=Authentication failed', request.url)
    )
  }
} 