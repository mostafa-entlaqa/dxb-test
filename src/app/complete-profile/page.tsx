'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  interest: z.enum(['buying', 'selling', 'investing']),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  phoneNumber: z.string().min(8, 'Phone number must be at least 8 characters'),
  profilePic: z.any().optional(),
})

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      interest: 'buying',
      linkedinUrl: '',
      phoneNumber: '',
      profilePic: undefined,
    },
  })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile?.profile_completed) {
        router.push('/dashboard')
        return
      }

      setUser(session.user)
      setIsLoading(false)
    }

    checkSession()
  }, [router, supabase])

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return

    setIsLoading(true)
    try {
      let profilePicUrl = ''
      if (data.profilePic?.[0]) {
        const file = data.profilePic[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('profile-pics')
          .upload(fileName, file)

        if (uploadError) throw uploadError
        profilePicUrl = uploadData.path
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          interest: data.interest,
          linkedin_url: data.linkedinUrl,
          phone_number: data.phoneNumber,
          profile_pic_url: profilePicUrl,
          profile_completed: true
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Profile completed successfully',
        description: 'You can now use all features of the site',
      })

      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Please provide some additional information to complete your profile
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form fields from the previous profile form */}
          </form>
        </Form>
      </div>
    </div>
  )
} 