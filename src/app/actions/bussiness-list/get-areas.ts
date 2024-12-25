import { getServerSupabase } from '@/lib/supabase/utils'

export async function getAreas() {
  const supabase = getServerSupabase()
  const { data, error } = await supabase.from('areas').select('*')
  if (error) {
    console.error('Error fetching areas:', error)
    return { data: [], error: error.message }
  }  
  return { data, error: null }
}


