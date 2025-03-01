'use client'

import { useState, useEffect } from 'react'
import { getClientSupabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserStatus {
  currentUser: User | null
  isBusinessOwner: boolean
}

export function useMessages(businessId: string, buyerId: string | null) {
  const [userStatus, setUserStatus] = useState<UserStatus>({ 
    currentUser: null, 
    isBusinessOwner: false 
  })

  // Initialize user status
  useEffect(() => {
    let mounted = true
    const supabase = getClientSupabase()

    const initUserStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!mounted || !user) return

        const { data: business } = await supabase
          .from('businesses')
          .select('user_id')
          .eq('id', businessId)
          .single()

        if (mounted) {
          setUserStatus({
            currentUser: user,
            isBusinessOwner: business?.user_id === user.id
          })
        }
      } catch (error) {
        console.error('Error initializing user status:', error)
      }
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted && session?.user) {
          initUserStatus()
        }
      }
    )

    initUserStatus()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [businessId])

  return {
    currentUser: userStatus.currentUser,
    isBusinessOwner: userStatus.isBusinessOwner
  }
} 