import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// For server-side usage (Server Components, API routes, Server Actions)
export const getServerSupabase = () => {
  return createServerComponentClient<Database>({ cookies })
}

// For client-side usage (Client Components)
export const getClientSupabase = () => {
  return createClientComponentClient<Database>()
}