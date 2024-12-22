'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import { ChevronRight, ChevronLeft, DollarSign, Building, FileText, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '../../../components/ui/use-toast'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types/supabase'
import { PostBusinessSchema } from './dto'




type FormData = z.infer<typeof PostBusinessSchema>

export default function BusinessListingWizard(): JSX.Element {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  const methods = useForm<FormData>({
    resolver: zodResolver(PostBusinessSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: success ? 'paid' : 'free',
      revenuePerYear: {},
      cost: {}
    }
  })

  useEffect(() => {
    // Load saved form data from session storage
    const savedData = sessionStorage.getItem('businessListingForm')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        Object.keys(parsedData).forEach(key => {
          methods.setValue(key as keyof FormData, parsedData[key])
        })
      } catch (error) {
        console.error('Error parsing saved form data:', error)
      }
    }
  }, [methods])

  // const verifyPaymentStatus = async (userId: string): Promise<boolean> => {
  //   try {
  //     const { data: invoices, error } = await supabase
  //       .from('invoices')
  //       .select('*')
  //       .eq('user_id', userId)
  //       .eq('status', 'paid')
  //       .order('created_at', { ascending: false })
  //       .limit(1)

  //     if (error) {
  //       console.error('Error verifying payment:', error)
  //       return false
  //     }

  //     return invoices && invoices.length > 0
  //   } catch (error) {
  //     console.error('Error verifying payment:', error)
  //     return false
  //   }
  // }

  const handleNext = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with your business listing.",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    const fields = getFieldsForStep(step)
    const isValid = await methods.trigger(fields)
    
    if (isValid) {
      if (step < 5) {
        // Save form data to session storage
        const formData = methods.getValues()
        sessionStorage.setItem('businessListingForm', JSON.stringify(formData))
        setStep(step + 1)
      } else {
        // Handle final submission
        const data = methods.getValues()
        const wantsPremium = data.listingType === 'paid'

        try {
          // Verify payment status if user selected premium
          const isPaid = searchParams.get('success') ?? false

          // Handle file uploads
          const imageUrls = []
          if (data.images?.length) {
            for (const file of data.images) {
              const fileExt = file.name.split('.').pop()
              const fileName = `${uuidv4()}.${fileExt}`
              const { error: uploadError, data: uploadData } = await supabase.storage
                .from('business-images')
                .upload(fileName, file)

              if (uploadError) throw uploadError
              if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                  .from('business-images')
                  .getPublicUrl(fileName)
                imageUrls.push(publicUrl)
              }
            }
          }

          let presentationUrl = null
          if (data.presentation?.[0]) {
            const file = data.presentation[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${uuidv4()}.${fileExt}`
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('presentations')
                .upload(fileName, file)

            if (uploadError) throw uploadError
            if (uploadData) {
              const { data: { publicUrl } } = supabase.storage
                .from('presentations')
                .getPublicUrl(fileName)
              presentationUrl = publicUrl
            }
          }

          let financialStatementUrl = null
          if (data.financialStatement?.[0]) {
            const file = data.financialStatement[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${uuidv4()}.${fileExt}`
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('financial-statements')
                .upload(fileName, file)

            if (uploadError) throw uploadError
            if (uploadData) {
              const { data: { publicUrl } } = supabase.storage
                .from('financial-statements')
                .getPublicUrl(fileName)
              financialStatementUrl = publicUrl
            }
          }

  

          console.log('isPaid', isPaid)
         
          const { error: businessError } = await supabase.from('businesses').insert({
            user_id: session.user.id,
            featured: isPaid, // Set featured based on payment verification
            business_name: data.businessName,
            opportunity_name: data.opportunityName,
            description: data.description,
            area_id: data.area_id,
            monthly_revenue: data.monthlyRevenue,
            profit_margin: data.profitMargin,
            selling_price: data.sellingPrice,
            revenue: data.revenuePerYear,
            cost: data.cost,
            acquisition_type: data.acquisition_type,
            images: imageUrls,
            presentation_file: presentationUrl,
            financials_file: financialStatementUrl,
            category_id: data.category_id,
            min_price: data.sellingPrice * 0.9,
            max_price: data.sellingPrice * 1.1,
            min_profit_margin: data.profitMargin * 0.9,
            max_profit_margin: data.profitMargin * 1.1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

          console.log(data)
          if (businessError) throw businessError

          // Clear session storage after successful submission
          sessionStorage.removeItem('businessListingForm')

          // Show appropriate success message
          const message = wantsPremium 
            ? isPaid 
              ? "Your premium business listing has been submitted successfully."
              : "Your business listing has been submitted as a free listing. You can upgrade to premium later."
            : "Your free business listing has been submitted successfully."

          toast({
            title: "Success!",
            description: message,
          })
          
          // router.push('/dashboard')
        } catch (error) {
          console.error('Error submitting form:', error)
          toast({
            title: "Error",
            description: "Failed to submit your business listing. Please try again.",
            variant: "destructive"
          })
        }
      }
    } else {
      const errors = methods.formState.errors
      console.log('Validation errors:', errors)
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly before proceeding.",
        variant: "destructive"
      })
    }
  }

  const getFieldsForStep = (currentStep: number): (keyof FormData)[] => {
    switch (currentStep) {
      case 1:
        return ['listingType']
      case 2:
        return ['businessName', 'description', 'opportunityName', 'acquisition_type', 'investmentPercentage', 'area_id', 'category_id']
      case 3:
        return ['monthlyRevenue', 'profitMargin', 'sellingPrice', 'revenuePerYear', 'cost']
      case 4:
        return ['images', 'presentation', 'financialStatement']
      case 5:
        return []
      default:
        return []
    }
  }

  const goToPrevious = () => {
    if (step > 1) {
      // Save form data before going back
      const formData = methods.getValues()
      sessionStorage.setItem('businessListingForm', JSON.stringify(formData))
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 icon={DollarSign} />
      case 2:
        return <Step2 icon={Building} />
      case 3:
        return <Step3 icon={FileText} />
      case 4:
        return <Step4 icon={FileText} />
      case 5:
        return <Step5 icon={CheckCircle} />
      default:
        return null
    }
  }

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold">List Your Business for Sale</CardTitle>
          <div className="flex justify-between items-center mt-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  step >= stepNumber ? 'text-white' : 'text-blue-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  step >= stepNumber ? 'bg-white text-blue-600' : 'border-blue-300'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <ChevronRight className="w-4 h-4 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <div>
            {renderStep()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevious}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center ml-auto"
          >
            {step === 5 ? 'Submit' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  )
}
