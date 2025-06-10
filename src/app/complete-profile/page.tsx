'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  FormDescription,
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
import { PhoneInput } from '@/components/ui/phone-input'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getClientSupabase } from '@/lib/supabase/client'
import { initCredits } from '@/actions/init-credits'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  interest: z.enum(['buying', 'selling', 'investing'], {
    required_error: 'Please select your interest',
  }),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  phoneNumber: z.string().min(8, 'Please enter a valid phone number'),
  profilePic: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || (files.length > 0 && files[0].size <= MAX_FILE_SIZE),
      'Max file size is 5MB'
    )
    .refine(
      (files) => !files || (files.length > 0 && ALLOWED_FILE_TYPES.includes(files[0].type)),
      'Only .jpg, .png, .webp formats are supported'
    ),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getClientSupabase()

  const form = useForm<ProfileFormData>({
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
        .select('*, profiles(*)')
        .eq('id', session.user.id)
        .single()

      setUser(session.user)
      setIsLoading(false)
    }

    checkSession()
  }, [router, supabase])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setIsLoading(true)
    try {
      let profilePicUrl = ''
      if (data.profilePic?.[0]) {
        const file = data.profilePic[0]
        const fileExt = file.name.split('.').pop()
        const filePath = `users/${user.id}/profile.${fileExt}`

        try {
          await supabase.storage
            .from('sellbusiness')
            .remove([filePath])
        } catch (error) {
          console.log('No existing profile picture to remove')
        }

        const { error: uploadError } = await supabase.storage
          .from('sellbusiness')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('sellbusiness')
          .getPublicUrl(filePath)

        profilePicUrl = publicUrl
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          interest: data.interest,
          linkedin_url: data.linkedinUrl || null,
          phone_number: data.phoneNumber,
          profile_pic_url: profilePicUrl || null,
          profile_completed: true
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Ensure credits are initialized after profile completion
      await initCredits(user.id)

      toast({
        title: 'Profile completed successfully',
        description: 'You can now use all features of the site',
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Profile update error:', error)
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
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am interested in</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your interest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buying">Buying Business</SelectItem>
                      <SelectItem value="selling">Selling Business</SelectItem>
                      <SelectItem value="investing">Investing in Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://linkedin.com/in/username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePic"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Profile Picture (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 