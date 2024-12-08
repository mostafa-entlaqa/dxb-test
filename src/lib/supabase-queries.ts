import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function getTranslatedCategories() {
  const supabase = createClientComponentClient()
  const currentLang = typeof window !== 'undefined' ? 
    (localStorage.getItem('selectedLanguage') || 'en') : 'en'
  
  const { data } = await supabase
    .from('business_categories')
    .select('id, name, name_ar, slug')
    .order('name')

  return data?.map(category => ({
    ...category,
    name: currentLang === 'ar' ? category.name_ar : category.name
  })) || []
}

export async function getTranslatedAreas() {
  const supabase = createClientComponentClient()
  const currentLang = typeof window !== 'undefined' ? 
    (localStorage.getItem('selectedLanguage') || 'en') : 'en'
  
  const { data } = await supabase
    .from('areas')
    .select('id, name, name_ar, slug')
    .order('name')

  return data?.map(area => ({
    ...area,
    name: currentLang === 'ar' ? area.name_ar : area.name
  })) || []
} 