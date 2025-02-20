import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let adminClient: ReturnType<typeof createClient<Database>> | null = null

export const getAdminSupabase = () => {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing required environment variables for Supabase admin client')
  }

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })

  return adminClient
}
