import { getServerSupabase } from '@/lib/supabase/utils'

export async function getAreaById(id: string) {
  const supabase = getServerSupabase()
  const { data, error } = await supabase.from('areas').select('*').eq('id', id).single()
  if (error) {
    console.error('Error fetching categories:', error)
    return { data: [], error: error.message }
  }  
  return { data, error: null }
}


