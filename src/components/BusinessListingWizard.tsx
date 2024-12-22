'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import { ChevronRight, ChevronLeft, DollarSign, Building, FileText, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from './ui/use-toast'
import { v4 as uuidv4 } from 'uuid'

const baseSchema = z.object({
  listingType: z.enum(['free', 'paid'], {
    required_error: "Please select a listing type",
    invalid_type_error: "Please select either free or paid listing"
  }),
  paymentStatus: z.enum(['pending', 'completed', 'failed']).default('pending'),
  businessName: z.string().min(1, 'Business name is required').max(255, 'Business name must be less than 255 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  opportunityName: z.string()
    .min(1, 'Opportunity name is required')
    .max(255, 'Opportunity name must be less than 255 characters'),
  acquisition_type: z.enum(['Buy', 'Invest'], {
    required_error: "Please select an acquisition type",
    invalid_type_error: "Please select either buy or invest"
  }),
  investmentPercentage: z.number()
    .min(1, 'Investment percentage must be at least 1%')
    .max(100, 'Investment percentage cannot exceed 100%')
    .optional()
    .nullable(),
  images: z.any().optional(),
  area_id: z.number({
    required_error: "Please select an area",
    invalid_type_error: "Please select a valid area"
  }),
  category_id: z.number({
    required_error: "Please select a business category",
    invalid_type_error: "Please select a valid category"
  }),
  monthlyRevenue: z.number({
    required_error: "Monthly revenue is required",
    invalid_type_error: "Please enter a valid number"
  }).min(0, 'Monthly revenue must be a positive number'),
  profitMargin: z.number({
    required_error: "Profit margin is required",
    invalid_type_error: "Please enter a valid number"
  }).min(0, 'Profit margin must be at least 0%')
    .max(100, 'Profit margin cannot exceed 100%'),
  sellingPrice: z.number({
    required_error: "Selling price is required",
    invalid_type_error: "Please enter a valid number"
  }).min(0, 'Selling price must be a positive number'),
  revenuePerYear: z.record(z.string(), z.number()).optional().default({}),
  cost: z.record(z.string(), z.number()).optional().default({}),
  presentation: z.any().optional(),
  financialStatement: z.any().optional(),
})

const schema = baseSchema.superRefine((data, ctx) => {
  if (data.acquisition_type === 'Invest' && !data.investmentPercentage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Investment percentage is required for investment opportunities",
      path: ["investmentPercentage"]
    });
  }
  if (data.listingType === 'paid' && data.paymentStatus !== 'completed') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payment must be completed for premium listing",
      path: ["paymentStatus"]
    });
  }
});

type FormData = z.infer<typeof schema>

export default function BusinessListingWizard() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      revenuePerYear: {},
      cost: {},
      paymentStatus: 'pending'
    }
  })

  const handleNext = async () => {
    // Check authentication only when trying to proceed
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
        setStep(step + 1)
      } else {
        // Handle final submission
        const data = methods.getValues()
        const isPaid = data.listingType === 'paid'
        
        try {
          // Handle file uploads first
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

          // Handle other file uploads similarly
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

          // Insert the business listing
          const { data: business, error: businessError } = await supabase.from('businesses').insert({
            user_id: session.user.id,
            featured: isPaid,
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
          }).select().single()

          if (businessError) throw businessError

          // Create invoice for paid listings
          if (isPaid && business) {
            const { error: invoiceError } = await supabase.from('invoices').insert({
              user_id: session.user.id,
              business_id: business.id,
              amount: 1499,
              currency: 'AED',
              status: 'paid',
              payment_date: new Date().toISOString()
            })

            if (invoiceError) throw invoiceError
          }

          toast({
            title: "Success!",
            description: "Your business listing has been submitted successfully.",
          })
          
          router.push('/dashboard')
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
        return ['listingType', 'paymentStatus']
      case 2:
        return ['businessName', 'description', 'opportunityName', 'acquisition_type', 'investmentPercentage', 'area_id', 'category_id']
      case 3:
        return ['monthlyRevenue', 'profitMargin', 'sellingPrice', 'revenuePerYear', 'cost']
      case 4:
        return []
      case 5:
        return []
      default:
        return []
    }
  }

  const goToPrevious = () => {
    if (step > 1) {
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
