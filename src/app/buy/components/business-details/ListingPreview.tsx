"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, Brain, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import BusinessPhotoSlider from "./BusinessPhotoSlider"
import BusinessDetails from "./BusinessDetails"
import FinancialPerformance from "./FinancialPerformance"
import Documents from "./Documents"
import FinancialsWidget from "./FinancialsWidget"
import AIAnalysis from "./AIAnalysis"
import { Business, Category, Area } from "../../type"

interface ListingPreviewProps {
  business: Business
  category: Category
  area: Area
  initialUnlockStatus: boolean
  userCredits: number
}

export default function ListingPreview({
  business,
  category,
  area,
  initialUnlockStatus,
  userCredits: initialCredits
}: ListingPreviewProps) {
  const [isUnlocked, setIsUnlocked] = useState(initialUnlockStatus)
  const [userCredits, setUserCredits] = useState(initialCredits)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [aiData, setAiData] = useState<{
    strength: number;
    deepAnalysis: {
      'Business overview': string;
      'Deal assessment': string;
      'Financial analysis': string;
      'Market overview': string;
      'Standard AI disclaimer': string;
    };
  } | null>(null)

  const { toast } = useToast()

  const handleUnlock = async () => {
    if (isUnlocked) return // Already unlocked

    try {
      const response = await fetch('/api/credits/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400) {
          toast({
            title: "Insufficient Credits",
            description: data.error,
            variant: "destructive"
          })
        }
        throw new Error(data.error)
      }

      setIsUnlocked(true)
      setUserCredits(data.remainingCredits)

      toast({
        title: "Success",
        description: `Business unlocked! You have ${data.remainingCredits} credits remaining.`
      })
    } catch (error) {
      console.error('Error unlocking business:', error)
      toast({
        title: "Error",
        description: "Failed to unlock business. Please try again.",
        variant: "destructive"
      })
    }
  }


  const handleAIAnalysis = async () => {
    try {
      const response = await fetch('/api/generate-analysis  ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: business.id,
          businessName: business.opportunity_name,
          businessDescription: business.opportunity_description,
          category: category.name,
          area: area.name,
          sellingPrice: business.selling_price,
          sellingType: business.acquisition_type,
          monthlyRevenue: business.monthly_revenue,
          revenuePerYear: business.revenue as Record<string, number>['revenuePerYear'],
          costPerYear: business.cost as Record<string, number>['costPerYear'],
          profitMargin: business.profit_margin
        })
      })

      const analysis = await response.json()
      setAiData(analysis)
      console.log('analysis', analysis)
      setShowAIAnalysis(true)
    } catch (error) {
      console.error('Error generating AI analysis:', error)
      toast({
        title: "Error",
        description: "Failed to generate AI analysis. Please try again later.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Card className="bg-white shadow-lg mb-8">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-blue-800">
                {business.opportunity_name}
              </h1>
              <BusinessPhotoSlider photos={business.images} />
              <p className="mt-4 text-gray-700">
                {business.opportunity_description}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-8">
            <CardContent className="p-6">
              <BusinessDetails
                isUnlocked={isUnlocked}
                opportunity_name={business.opportunity_name}
                acquisition_type={business.acquisition_type}
                category={category.name}
                area={area.name}
                description={business.description}
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-8 z-50">
            <CardContent className="p-6">
              <FinancialPerformance
                isUnlocked={isUnlocked}
                revenue={business.revenue as Record<string, number>}
                cost={business.cost as Record<string, number>}
                minProfitMargin={business.min_profit_margin}
                maxProfitMargin={business.max_profit_margin}
              />
            </CardContent>
          </Card>


          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <Documents
                isUnlocked={isUnlocked}
                presentation_file={business.presentation_file}
                financials_file={business.financials_file}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          <Card className={`bg-white shadow-lg  top-4 ${!showAIAnalysis ? "sticky" : ""}`}>
            <CardContent className="p-6">
              <FinancialsWidget
                isUnlocked={isUnlocked}
                selling_price={business.selling_price}
                monthly_revenue={business.monthly_revenue}
                profit_margin={business.profit_margin}
              />

              <div className="mt-6 space-y-4">

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleUnlock}
                  disabled={isUnlocked || userCredits < 1}

                >
                  {isUnlocked ? <Unlock className="mr-2" /> : <Lock className="mr-2" />}
                  {isUnlocked ? "Unlocked" : `Unlock Opportunity (${userCredits} credits)`}
                </Button>




                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!isUnlocked}
                  onClick={handleAIAnalysis}
                >
                  <Brain className="mr-2" />
                  AI Analysis
                </Button>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!isUnlocked}
                >
                  <Mail className="mr-2" />
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>



          {showAIAnalysis && (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <AIAnalysis
                  isUnlocked={isUnlocked}
                  aiData={aiData || {
                    strength: 0,
                    deepAnalysis: {
                      'Business overview': '',
                      'Deal assessment': '',
                      'Financial analysis': '',
                      'Market overview': '',
                      'Standard AI disclaimer': ''
                    }
                  }}
                />
              </CardContent>

            </Card>

          )}
        </div>
      </div>
    </div>
  )
}


