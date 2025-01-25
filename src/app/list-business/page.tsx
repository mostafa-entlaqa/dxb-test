import { Suspense } from 'react'

import BusinessListingWizard from './components/BusinessListingWizard'
import { getServerSupabase } from '@/lib/supabase/server'
import { getCategory } from '@/actions/user/bussiness-list/get-category'
import { getAreas } from '@/actions/user/bussiness-list/get-areas'

export default async function ListBusinessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  
  const success = searchParams.success === 'true'
  const canceled = searchParams.canceled === 'true'
  const sessionId = searchParams.session_id as string | undefined

  // Pre-fetch any necessary data here
  const { data: categories } = await getCategory()
  const { data: areas } = await getAreas()

  const { data: invoice } = sessionId ? await supabase
    .from('invoices')
    .select('*')
    .eq('stripe_invoice_id', sessionId)
    .single() : { data: null }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container py-10 mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-center text-blue-800">
          List Your Business for Sale
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <BusinessListingWizard 
          
            userId={session?.user.id}
            hasExistingInvoice={!!invoice}
            categories={categories}
            areas={areas}
          />
        </Suspense>
      </div>
    </div>
  )
}
