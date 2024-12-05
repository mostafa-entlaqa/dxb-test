import { Suspense } from 'react'
import BusinessList from '@/components/business-list'
import BusinessFilters from '@/components/business-filters'

export default function BuyBusinessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Buy a Business</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <BusinessFilters />
        </div>
        <div className="w-full md:w-2/3">
          <Suspense fallback={<div>Loading...</div>}>
            <BusinessList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

