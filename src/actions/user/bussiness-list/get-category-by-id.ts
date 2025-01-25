import { getServerSupabase } from '@/lib/supabase/utils'

export async function getCategoryById(id: number) {
  const supabase = getServerSupabase()
  const {data, error} = await supabase.from('business_categories').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching categories:', error)
    return { data: null, error: error.message }
  }  
  return { data, error: null }
}


