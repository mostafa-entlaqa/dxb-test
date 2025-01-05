'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {  ChevronLeft, ChevronRight } from 'lucide-react'
import { getBusinesses } from '@/app/actions/user/buy/get-businesses'
import { useEffect, useState } from 'react'
import type { Business } from '@/app/actions/user/buy/get-businesses'
import BusinessCard from './business-card'

interface FilterParams {
  categoryId?: string
  areaId?: string
  minPrice?: string
  maxPrice?: string
  minProfitMargin?: string
  maxProfitMargin?: string
  sortBy?: string
  page?: number
}

interface BusinessListProps {
  filters: FilterParams
}

const ITEMS_PER_PAGE = 12

export default function BusinessList({ filters }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getBusinesses(filters)
        setBusinesses(data.businesses)
        setTotalCount(data.count)
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', page.toString())
    router.push(`/buy?${newSearchParams.toString()}`)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const currentPage = filters?.page || 1

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search criteria
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessCard business={business} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
