import { getServerSupabase } from "@/lib/supabase/server"

export async function getUserCredits(): Promise<{ userCredit: number | null; error: string | null }> {
  const supabase = await getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { userCredit: null, error: 'No authenticated user' }
  }
  const { data: userCredit, error } = await supabase.from('users').select('credits').eq('id', user.id).single()
  if (error) {
    console.error('Database error:', error)
    return { userCredit: null, error: error.message }
  }
  return { userCredit: userCredit.credits, error: null }
}