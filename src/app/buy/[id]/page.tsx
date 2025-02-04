import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ListingPreview from '../components/business-details/ListingPreview'

async function getBusinessData(businessId: string) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Get user data
    const { data: { user } } = await supabase.auth.getUser()

    // Get business data, category, and area
    const [businessResponse, userCreditsResponse] = await Promise.all([
      supabase.from('businesses').select('*').eq('id', businessId).single(),
      user ? supabase.from('users_credits').select('credits').eq('user_id', user.id).single() : null
    ])

    if (!businessResponse.data) {
      return { error: 'Business not found' }
    }

    // Get category and area data
    const [categoryResponse, areaResponse] = await Promise.all([
      supabase.from('business_categories').select('*').eq('id', businessResponse.data.category_id).single(),
      supabase.from('areas').select('*').eq('id', businessResponse.data.area_id).single()
    ])

    // Check if business is already unlocked for this user
    let unlockStatus = false
    if (user) {
      const { data: unlockData } = await supabase
        .from('unlocked_businesses')
        .select('*')
        .eq('user_id', user.id)
        .eq('business_id', businessId)
        .single()

      unlockStatus = !!unlockData
    }

    return {
      business: businessResponse.data,
      category: categoryResponse.data,
      area: areaResponse.data,
      isUnlocked: unlockStatus,
      userCredits: userCreditsResponse?.data?.credits ?? 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { error: 'Failed to load business data' }
  }
}

export default async function BusinessPage({ params }: { params: { id: string } }) {
  const data = await getBusinessData(params.id)

  if ('error' in data) {
    return <div>{data.error}</div>
  }

  return (
    <ListingPreview
      business={data.business}
      category={data.category}
      area={data.area}
      initialUnlockStatus={data.isUnlocked}
      userCredits={data.userCredits}
    />
  )
}

