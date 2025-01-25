"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, Brain, Mail } from "lucide-react"
import BusinessPhotoSlider from "./BusinessPhotoSlider"
import BusinessDetails from "./BusinessDetails"
import FinancialPerformance from "./FinancialPerformance"
import Documents from "./Documents"
import FinancialsWidget from "./FinancialsWidget"
import AIAnalysis from "./AIAnalysis"
import { Business, Category, Area } from "../../type"

export default function ListingPreview({ business,category,area }: { business: Business,category: Category,area: Area }) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [userCredits, setUserCredits] = useState(5)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

console.log('category',category)
  console.log(business)
  const handleUnlock = () => {
    if (userCredits > 0) {
      setIsUnlocked(true)
      setUserCredits(userCredits - 1)
    }
  }

  const handleAIAnalysis = () => {
    if (isUnlocked && userCredits >= 3) {
      setShowAIAnalysis(true)
      setUserCredits(userCredits - 3)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Card className="bg-white shadow-lg mb-8">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-blue-800">{business.opportunity_name}</h1>
              <BusinessPhotoSlider photos={business.images} />
              <p className="mt-4 text-gray-700">{business.opportunity_description}</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-8">
            <CardContent className="p-6">
              <BusinessDetails isUnlocked={isUnlocked}  acquisition_type={business.acquisition_type} category={category.name} area={area.name} description={business.description} opportunity_name={business.opportunity_name} />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-8">
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
              <Documents isUnlocked={isUnlocked} presentation_file={business.presentation_file} financials_file={business.financials_file} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          <Card className="bg-white shadow-lg sticky top-4">
            <CardContent className="p-6">
              <FinancialsWidget isUnlocked={isUnlocked} selling_price={business.selling_price} monthly_revenue={business.monthly_revenue} profit_margin={business.profit_margin} />

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
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAIAnalysis}
                  disabled={!isUnlocked || userCredits < 3}
                >
                  <Brain className="mr-2" />
                  Analyze with AI (3 credits)
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={!isUnlocked}>
                  <Mail className="mr-2" />
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>

          {showAIAnalysis && (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <AIAnalysis />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

