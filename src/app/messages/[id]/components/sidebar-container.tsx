import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getCategoryById } from '@/actions/user/bussiness-list/get-category-by-id'
import { getAreaById } from '@/actions/user/bussiness-list/get-area-by-id'
import { SidebarClient } from './sidebar'
import { getServerSupabase } from '@/lib/supabase/utils'

export async function SidebarContainer({ 
  businessId,
  business,
  className 
}: { 
  businessId: string
  business: BusinessDetails
  className?: string 
}) {
  const supabase = getServerSupabase()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get category and area data
  const [categoryResponse, areaResponse] = await Promise.all([
    getCategoryById(business.category_id),
    getAreaById(business.area_id)
  ])

  const isOwner = business.user_id === user.id

  // Get buyer statuses with user info
  const { data: buyerStatuses } = await supabase
    .from('buyer_status')
    .select(`
      id,
      business_id,
      buyer_id,
      status,
      has_unread
    `)
    .eq('business_id', businessId)

  // Get users data directly
  const { data: usersData } = await supabase
    .from('users')
    .select('id, email, full_name, profile_pic_url, interest')
    .in('id', buyerStatuses?.map(status => status.buyer_id) || [])

  const userMap = new Map(usersData?.map(user => [user.id, user]))

  const processedBuyerStatuses = buyerStatuses
    ?.filter(status => {
      if (isOwner) {
        // If owner, show all buyers except yourself
        return status.buyer_id !== user.id
      } else {
        // If buyer, show only the business owner's messages
        return status.buyer_id === business.user_id
      }
    })
    .map(status => {
      const userData = userMap.get(status.buyer_id)
      return {
        ...status,
        buyer: {
          id: status.buyer_id,
          email: userData?.email || '',
          full_name: userData?.full_name || userData?.email?.split('@')[0] || '',
          profile_pic_url: userData?.profile_pic_url || '',
          interest: userData?.interest || ''
        }
      }
    }) || []

  // Process the data
  const processedBusiness = {
    ...business,
    category: categoryResponse.data || { name: '' },
    area: areaResponse.data || { name: '' }
  }

  return (
    <SidebarClient
      business={processedBusiness}
      buyerStatuses={processedBuyerStatuses}
      currentUser={user}
      className={className}
    />
  )
} 