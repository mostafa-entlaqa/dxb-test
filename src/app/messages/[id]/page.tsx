import { Suspense } from 'react'
import { BusinessOpportunityHeader } from "./components/business-opportunity-header"
import { MessageThread } from "./components/message-thread"
import { SidebarContainer } from "./components/sidebar-container"
import { getServerSupabase } from '@/lib/supabase/utils'
import { getCategoryById } from '@/actions/user/bussiness-list/get-category-by-id'
import { getAreaById } from '@/actions/user/bussiness-list/get-area-by-id'

export default async function MessagesPage({ params, searchParams }: { 
  params: { id: string },
  searchParams: { buyer?: string }
}) {
  const buyerId = searchParams.buyer || null
  const supabase = getServerSupabase()

  // Fetch business details
  const { data: business } = await supabase
    .from('businesses')
    .select(`
      id,
      opportunity_name,
      selling_price,
      category_id,
      area_id,
      user_id,
      images
    `)
    .eq('id', params.id)
    .single()

  if (!business) return null

  // Get category and area data
  const [categoryResponse, areaResponse] = await Promise.all([
    getCategoryById(business.category_id),
    getAreaById(business.area_id)
  ])

  const processedBusiness = {
    ...business,
    category: categoryResponse.data || { name: '' },
    area: areaResponse.data || { name: '' }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <Suspense fallback={<div className="w-64" />}>
        {/* @ts-expect-error Async Server Component */}
        <SidebarContainer businessId={params.id} business={processedBusiness} className="w-64 border-r border-border" />
      </Suspense>
      <div className="flex flex-col flex-1">
        <BusinessOpportunityHeader business={processedBusiness} className="border-b border-border" />
        <MessageThread businessId={params.id} buyerId={buyerId} className="flex-1" />
      </div>
    </div>
  )
}
