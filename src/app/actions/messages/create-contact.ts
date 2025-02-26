'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function createInitialContact(businessId: string) {
  const supabase = createServerActionClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Create buyer status if doesn't exist
    const { data: existingStatus } = await supabase
      .from('buyer_status')
      .select('id')
      .eq('business_id', businessId)
      .eq('buyer_id', user.id)
      .single()

    if (!existingStatus) {
      await supabase.from('buyer_status').insert({
        business_id: parseInt(businessId),
        buyer_id: user.id,
        status: 'New',
        has_unread: false
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating contact:', error)
    return { error: 'Failed to create contact' }
  }
} 