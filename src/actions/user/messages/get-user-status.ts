'use server'

import { getServerSupabase } from '@/lib/supabase/utils'

export async function getUserStatus(businessId: string) {
  const supabase = getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: business } = await supabase
    .from('businesses')
    .select('user_id')
    .eq('id', businessId)
    .single()

  return {
    currentUser: user,
    isBusinessOwner: business?.user_id === user.id
  }
} 