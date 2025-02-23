import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EditListingPreview from '../components/business-details/EditListingPreview'

async function getBusinessData(businessId: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Authentication required' }
    }

    // Get business data, ensuring it belongs to the current user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select(`
        *,
        category:business_categories(id, name),
        area:areas(id, name)
      `)
      .eq('id', businessId)
      .eq('user_id', user.id)
      .single()

    if (businessError || !business) {
      return { error: 'Business not found or access denied' }
    }

    // Get categories and areas for dropdowns
    const [categoriesResponse, areasResponse] = await Promise.all([
      supabase.from('business_categories').select('*'),
      supabase.from('areas').select('*')
    ])

    return {
      business,
      categories: categoriesResponse.data || [],
      areas: areasResponse.data || []
    }
  } catch (error) {
    console.error('Error fetching business data:', error)
    return { error: 'Failed to load business data' }
  }
}

export default async function EditBusinessPage({ params }: { params: { id: string } }) {
  const data = await getBusinessData(params.id)

  if ('error' in data) {
    if (data.error === 'Authentication required') {
      redirect('/login')
    }
    return <div className="container mx-auto p-4">{data.error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Business Listing</h1>
      <EditListingPreview 
        business={data.business}
        category={data.categories}
        area={data.areas}
      />
    </div>
  )
} 