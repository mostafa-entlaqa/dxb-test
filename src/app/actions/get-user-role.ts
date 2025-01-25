'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getUserRole() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { userRole: null }

    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    return { userRole: data?.role || 'user' }
  } catch (error) {
    console.error('Error getting user role:', error)
    return { userRole: null }
  }
} 