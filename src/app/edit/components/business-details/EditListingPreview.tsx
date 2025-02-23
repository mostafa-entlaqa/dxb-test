'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import EditBusinessDetails from './EditBusinessDetails'
import EditFinancialPerformance from './EditFinancialPerformance'
import EditDocuments from './EditDocuments'
import EditFinancialsWidget from './EditFinancialsWidget'
import BusinessPhotoSlider from '@/app/buy/components/business-details/BusinessPhotoSlider'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EditImages from './EditImages'

interface Business {
  id: number
  business_name: string
  images: string[]
  area_id: number
  category_id: number
  [key: string]: any  // For other properties
}

interface EditListingPreviewProps {
  business: any
  category: any
  area: any
}

export default function EditListingPreview({
  business,
  category,
  area,
}: EditListingPreviewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedData, setModifiedData] = useState<Business>(business)
  const [isDirty, setIsDirty] = useState(false)
  const supabase = createClientComponentClient()

  const handleFieldUpdate = (updates: Partial<Business>) => {
    setModifiedData((prev: Business) => {
      const newData = {
        ...prev,
        ...updates
      }
      // Check if anything has changed
      const hasChanges = Object.keys(updates).some(key => {
        // Handle nested objects (like revenue, cost)
        if (typeof updates[key] === 'object' && updates[key] !== null) {
          return JSON.stringify(updates[key]) !== JSON.stringify(business[key])
        }
        return updates[key] !== business[key]
      })
      
      setIsDirty(hasChanges || isDirty)
      return newData
    })
  }

  // Reset dirty state when business data changes
  useEffect(() => {
    setModifiedData(business)
    setIsDirty(false)
  }, [business])

  const handleSaveAll = async () => {
    try {
      setIsLoading(true)
      
      const dataToUpdate = {
        ...modifiedData,
        area_id: modifiedData.area_id || business.area_id,
        category_id: modifiedData.category_id || business.category_id,
        area: undefined,
        category: undefined,
        approve_status: "pending",
      }

      const { error } = await supabase
        .from('businesses')
        .update(dataToUpdate)
        .eq('id', business.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Business listing updated successfully and sent for approval",
      })
      setIsDirty(false) // Reset dirty state after successful save
      router.refresh()
      
    } catch (error) {
      console.error('Error updating business:', error)
      toast({
        title: "Error",
        description: "Failed to update business listing",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <EditImages 
            business={modifiedData}
            onSave={handleFieldUpdate}
          />

          <Card className="shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-blue-800">
                  {business.opportunity_name}
                </h1>
                {business.featured && (
                  <Badge className="bg-blue-600">Featured Listing</Badge>
                )}
              </div>
              <BusinessPhotoSlider photos={business.images} />
            </CardContent>
          </Card>

          <Card className="shadow-lg mb-8">
            <CardContent className="p-6">
              <EditBusinessDetails
                business={modifiedData}
                category={category}
                area={area}
                onSave={handleFieldUpdate}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg mb-8 dark:bg-gray-900 ">
            <CardContent className="p-6">
              <EditFinancialPerformance
                business={modifiedData}
                onSave={handleFieldUpdate}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <EditDocuments
                business={modifiedData}
                onSave={handleFieldUpdate}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          <Card className="shadow-lg sticky top-4">
            <CardContent className="p-6">
              <EditFinancialsWidget
                business={modifiedData}
                onSave={handleFieldUpdate}
              />
              <div className="mt-6 space-y-4">
                <Button
                  className="w-full"
                  onClick={() => router.back()}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSaveAll}
                  disabled={isLoading || !isDirty}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 