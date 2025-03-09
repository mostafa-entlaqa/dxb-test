import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getCategoryById } from '@/actions/user/bussiness-list/get-category-by-id'
import { getAreaById } from '@/actions/user/bussiness-list/get-area-by-id'
import { SidebarClient } from './sidebar'
import { getServerSupabase } from '@/lib/supabase/utils'
import { BusinessDetails, Message, Business, BuyerStatus } from '../type'

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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const isOwner = business.user_id === user.id

  if (isOwner) {
    // Owner view - show buyers for this business
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
  
    // Get users data
    
    const { data: usersData } = await supabase
      .from('users')
      .select('id, email, full_name, profile_pic_url, interest')
      .in('id', buyerStatuses?.map(status => status.buyer_id) || [])

    const userMap = new Map(usersData?.map(user => [user.id, user]))

    const processedBuyerStatuses = buyerStatuses
      ?.filter(status => status.buyer_id !== user.id)
      .map(status => ({
        ...status,
        buyer: {
          id: status.buyer_id,
          email: userMap.get(status.buyer_id)?.email || '',
          full_name: userMap.get(status.buyer_id)?.full_name || '',
          profile_pic_url: userMap.get(status.buyer_id)?.profile_pic_url || '',
        }
      })) || []

    return (
      <SidebarClient
        business={business}
        buyerStatuses={processedBuyerStatuses}
        currentUser={user}
        className={className}
      />
    )

  } else {
    // Buyer view - show all businesses where user is a buyer
    const { data: buyerStatuses } = await supabase
      .from('buyer_status')
      .select(`
        id,
        business_id,
        status,
        has_unread,
        business:businesses (
          id,
          opportunity_name,
          selling_price,
          user_id,
          category:business_categories(name),
          area:areas(name)
        )
      `)
      .eq('buyer_id', user.id)

    const processedBuyerStatuses = buyerStatuses?.map(status => ({
      id: status.id,
      business_id: status.business_id,
      buyer_id: user.id,
      status: status.status,
      has_unread: status.has_unread,
      business: status.business
    })) || []

    return (
      <SidebarClient
        business={business}
        buyerStatuses={processedBuyerStatuses}
        currentUser={user}
        className={className}
        isBuyerView={true}
      />
    )
  }
} 