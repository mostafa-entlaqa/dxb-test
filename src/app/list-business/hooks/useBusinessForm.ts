import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, type FormData } from '../schemas/businessSchema'
import { useEffect } from 'react'

export function useBusinessForm(success: boolean | null) {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: success ? 'paid' : 'free',
      revenuePerYear: {},
      cost: {}
    }
  })

  // Load saved form data
  useEffect(() => {
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
  }, [success, methods])

  const saveFormData = () => {
    const formData = methods.getValues()
    sessionStorage.setItem('businessListingForm', JSON.stringify(formData))
  }

  const clearFormData = () => {
    sessionStorage.removeItem('businessListingForm')
  }

  return {
    methods,
    saveFormData,
    clearFormData
  }
} 