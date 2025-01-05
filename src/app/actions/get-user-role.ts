'use server'

import { getServerSupabase } from "@/lib/supabase/server"

interface UserRole {
  role: 'admin' | 'user'
}

interface GetUserRoleResponse {
  userRole: UserRole | null
  error: string | null
}

export async function getUserRole(): Promise<GetUserRoleResponse> {
  try {
    const supabase = await getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { userRole: null, error: 'No authenticated user' }
    }

    const { data: userRole, error } = await supabase.from('users').select('role').eq('id', user.id).single()
    
    if (error) {
      console.error('Database error:', error)
      return { userRole: null, error: error.message }
    }

    return { userRole, error: null }
  } catch (error) {
    console.error('Connection error:', error)
    return { userRole: null, error: 'Failed to connect to the database' }
  }
}

