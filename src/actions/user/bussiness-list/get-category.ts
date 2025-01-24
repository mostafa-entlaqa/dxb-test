import { getServerSupabase } from '@/lib/supabase/utils'

export async function getCategory() {
  const supabase = getServerSupabase()
  const { data, error } = await supabase.from('business_categories').select('*')
  if (error) {
    console.error('Error fetching categories:', error)
    return { data: [], error: error.message }
  }  
  return { data, error: null }
}


