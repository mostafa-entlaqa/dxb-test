import { Suspense } from 'react'
import BusinessList from '@/app/buy/components/business-list'
import BusinessFilters from '@/app/buy/components/business-filters'
import { Building2, ArrowDownWideNarrow, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInsights } from '@/actions/user/buy/get-insights'
import { getFilterOptions } from '@/actions/user/buy/get-filter-options'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BuyBusinessPage({ searchParams }: PageProps) {
  const [insights, filterOptions] = await Promise.all([
    getInsights(),
    getFilterOptions()
  ])

  const filters = {
    categoryId: searchParams.categoryId as string,
    areaId: searchParams.areaId as string,
    minPrice: searchParams.minPrice as string,
    maxPrice: searchParams.maxPrice as string,
    minProfitMargin: searchParams.minProfitMargin as string,
    maxProfitMargin: searchParams.maxProfitMargin as string,
    sortBy: searchParams.sortBy as string,
    page: searchParams.page ? parseInt(searchParams.page as string) : 1
  }

  const insightCards = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Active Listings",
      value: insights.active_listings,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <ArrowDownWideNarrow className="h-5 w-5" />,
      title: "Price Range",
      value: (!insights.price_range_min && !insights.price_range_max)
        ? "No listings"
        : `${new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            maximumFractionDigits: 0
          }).format(insights.price_range_min)} - ${new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            maximumFractionDigits: 0
          }).format(insights.price_range_max)}`,
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: <LayoutGrid className="h-5 w-5" />,
      title: "Industries",
      value: insights.industries_count,
      color: "text-orange-600 dark:text-orange-400"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buy a Business</h1>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {insightCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className={cn("flex items-center gap-2 mb-2", card.color)}>
              {card.icon}
              <h3 className="font-semibold">{card.title}</h3>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-8">
        
        <BusinessFilters 
          initialFilters={filters} 
          initialCategories={filterOptions.categories}
          initialAreas={filterOptions.areas}
        />
      </div>

      
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      }>
        <BusinessList filters={filters} />
      </Suspense>
    </div>
  )
}
