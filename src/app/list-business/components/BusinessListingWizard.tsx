'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, DollarSign, Building, FileText, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/components/ui/use-toast'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types/supabase'
import { uploadFile, uploadImages } from '@/app/actions/upload'
import { verifyPaymentStatus } from '@/app/actions/verify-payment'

import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import { formBusinessSchema } from '../schemas/businessSchema'
import { usePaymentVerification } from '../hooks/usePaymentVerification'





type FormData = z.infer<typeof formBusinessSchema>



export default function BusinessListingWizard(): JSX.Element {
  const [step, setStep] = useState(sessionStorage.getItem('step') ? parseInt(sessionStorage.getItem('step') as string) : 1)
  const router = useRouter()
  const [freeMode, setFreeMode] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const { verifyPayment } = usePaymentVerification()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const sessionId = searchParams.get('session_id')

  const methods = useForm<FormData>({
    resolver: zodResolver(formBusinessSchema),
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
        if(!success) {
          methods.setValue('listingType', 'free')
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error)
      }
    }





    const createInvoice = async () => {
      if (success && sessionId) {
        try {
          const response = await fetch('/api/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId })
          })

          if (!response.ok) {
            throw new Error('Failed to verify payment')
          }

          const session = await response.json()
          
          if (session.payment_status === 'paid') {
            const { error } = await supabase.from('invoices').insert({
              user_id: session.metadata.userId,
              amount: session.amount_total / 100,
              currency: session.currency?.toUpperCase() || 'AED',
              status: 'paid',
              stripe_payment_intent_id: session.payment_intent,
              stripe_invoice_id: session.id,
              payment_date: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

            if (error) {
              console.error('Error creating invoice:', error)
            }
          }
        } catch (error) {
          console.error('Error processing payment:', error)
        }
      }
    }

    createInvoice()
  }, [success, sessionId, supabase, methods])

 
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
    
    const handleNextStep = (TheStep: number) => {
      setStep(TheStep)
      sessionStorage.setItem('step', TheStep.toString())
    }
    
    if (isValid) {
      if (step < 5) {
        // Save form data to session storage
        const formData = methods.getValues()
        sessionStorage.setItem('businessListingForm', JSON.stringify(formData))
        handleNextStep(step + 1)
      } else {
        // Handle final submission
        const data = methods.getValues()
        const wantsPremium = data.listingType === 'paid'

        try {
          // // Early payment verification for premium listings
          // if (wantsPremium && !sessionId) {
          //   toast({
          //     title: "Payment Required",
          //     description: "Please complete the payment process before submitting a premium listing.",
          //     variant: "destructive"
          //   })
          //   return
          // }
          const isPaid = await verifyPayment(wantsPremium, sessionId, session.user.id)

          // // Verify payment status if user selected premium
          // const isPaid = wantsPremium ? await verifyPaymentStatus(session.user.id, sessionId) : false
          // if (wantsPremium && !isPaid) {
          //   toast({
          //     title: "Payment Verification Failed",
          //     description: "Your payment could not be verified. Please try again or contact support.",
          //     variant: "destructive"
          //   })
          //   return
          // }

          // Handle file uploads
          let imageUrls: string[] = []
          if (data.images && Array.isArray(data.images)) {
            try {
              imageUrls = await uploadImages(data.images, 'business-images')
              console.log('Uploaded image URLs:', imageUrls) // Debug log
            } catch (error) {
              console.error('Error uploading images:', error)
              toast({
                title: "Error",
                description: "Failed to upload images. Please try again.",
                variant: "destructive"
              })
              return
            }
          }

          let presentationUrl = null
          if (data.presentation?.[0]) {
            presentationUrl = await uploadFile(data.presentation[0],'presentations')
          }

          let financialStatementUrl = null
          if (data.financialStatement?.[0]) {
            financialStatementUrl = await uploadFile(data.financialStatement[0], 'financial-statements')
          }
           if (methods.getValues('listingType') === 'paid') {
            const { error } = await supabase.from('invoices').select('*').eq('stripe_invoice_id', sessionId).single()
            if (error) {
              setFreeMode(true)
            }
           }

           console.log('data',data)
           console.log('freeMode',freeMode)
           console.log('sessionId',sessionId)
           console.log('isPaid',isPaid)
           // Insert business listing with verified payment status
           const { data: business, error: businessError } = await supabase.from('businesses').insert({
            user_id: session.user.id,
            session_id: !freeMode ? sessionId : null,
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
            form_status: isPaid ? 'published' : 'pending',
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

          // Update invoice with business_id if payment was successful
          if (isPaid && sessionId) {
            await supabase.from('invoices')
              .update({ business_id: business.id })
              .eq('stripe_invoice_id', sessionId)
          }
          sessionStorage.removeItem('businessListingForm')
          sessionStorage.removeItem('step')
          setStep(1)

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
          
          router.push('/dashboard')
          setStep(1)
       }
          // Clear session storage after successful submission
      
         catch (error: unknown) {
          console.error('Error submitting form:', error)
          if ((error as any).code === '23505') {
            toast({
              title: "Error", 
              description: "You have already submitted a business listing with this session ID. Please try again with a different session ID.",
              variant: "destructive"
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to submit your business listing. Please try again.",
              variant: "destructive"
            })
          }
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
