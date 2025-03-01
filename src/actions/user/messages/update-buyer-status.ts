'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateBuyerStatus(businessId: string, buyerId: string, status: string) {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase
    .from('buyer_status')
    .upsert({
      business_id: businessId,
      buyer_id: buyerId,
      status,
      updated_at: new Date().toISOString()
    })

  if (error) {
    throw new Error('Failed to update buyer status')
  }

  revalidatePath('/messages/[id]', 'page')
  return { success: true }
}
