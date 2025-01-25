import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const UNLOCK_COST = 1 // Credits needed to unlock a business

export async function POST(request: Request) {
  const { businessId } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user credits from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('User error:', userError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    const currentCredits = userData?.credits || 0

    if (currentCredits < UNLOCK_COST) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        creditsNeeded: UNLOCK_COST,
        currentCredits: currentCredits 
      }, { status: 400 })
    }

    // Update user credits in users table
    const { error: creditUpdateError } = await supabase
      .from('users')
      .update({ credits: currentCredits - UNLOCK_COST })
      .eq('id', user.id)

    if (creditUpdateError) {
      console.error('Credit update error:', creditUpdateError)
      return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 })
    }

    // Record the unlock
    const { error: unlockError } = await supabase
      .from('unlocked_businesses')
      .insert({
        user_id: user.id,
        business_id: businessId
      })

    if (unlockError) {
      console.error('Unlock error:', unlockError)
      // Rollback credits if unlock fails
      await supabase
        .from('users')
        .update({ credits: currentCredits })
        .eq('id', user.id)
      
      return NextResponse.json({ error: 'Failed to record unlock' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      remainingCredits: currentCredits - UNLOCK_COST 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Failed to unlock business' }, { status: 500 })
  }
} 