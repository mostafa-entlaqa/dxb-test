"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updateUserProfile, uploadProfilePicture, type UserProfile } from "@/actions/user/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, User, Linkedin, Phone, Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LinkedinUrlField } from "./linkedin-url-field"

// Form schema using zod
const formSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  phone_number: z.string().min(8, "Phone number must be at least 8 digits").max(15).optional(),
  profile_pic_url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

interface ProfileFormProps {
  user: UserProfile
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(user.profile_pic_url || null)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  // Initialize form with user data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.full_name || "",
      linkedin_url: user.linkedin_url || "",
      phone_number: user.phone_number || "",
      profile_pic_url: user.profile_pic_url || "",
    },
  })

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isDirty = Object.entries(value).some(([key, val]) => {
        const initialValue = user[key as keyof UserProfile]
        return val !== (initialValue || "")
      })
      setIsFormDirty(isDirty)
    })
    return () => subscription.unsubscribe()
  }, [form.watch, user])

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const fileType = file.type
    if (!fileType.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("No active session")
      }

      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Upload the image
      const result = await uploadProfilePicture(session.user.id, base64Data)

      if (result.success && result.url) {
        // Update the form with the new profile picture URL
        form.setValue("profile_pic_url", result.url, { shouldDirty: true })
        setProfilePicUrl(result.url)
        setIsFormDirty(true)
        toast({
          title: "Image uploaded",
          description: "Your profile picture has been uploaded successfully",
        })
      } else {
        throw new Error(result.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle profile picture removal
  const handleRemoveProfilePic = () => {
    form.setValue("profile_pic_url", "", { shouldDirty: true })
    setProfilePicUrl(null)
    setIsFormDirty(true)
  }

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Create FormData object
      const formData = new FormData()

      // Always include profile_pic_url (even if empty to allow clearing)
      formData.append("profile_pic_url", data.profile_pic_url || "")
      
      // Add other fields only if they have values
      if (data.full_name) formData.append("full_name", data.full_name)
      if (data.linkedin_url !== undefined) formData.append("linkedin_url", data.linkedin_url || "")
      if (data.phone_number) formData.append("phone_number", data.phone_number)

      console.log("Submitting form data:", Object.fromEntries(formData.entries()))

      // Submit the form data
      const result = await updateUserProfile(user.id, formData)

      if (result.success) {
        setIsFormDirty(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
        // Update the local state to reflect the changes
        setProfilePicUrl(data.profile_pic_url || null)
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            if (field === "_form") {
              toast({
                title: "Error",
                description: message,
                variant: "destructive",
              })
            } else {
              form.setError(field as any, { message })
            }
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePicUrl || ""} alt={form.watch("full_name")} />
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">Click the upload button to change your profile picture</p>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload new image"}
              </Button>

              {profilePicUrl && (
                <Button type="button" variant="destructive" size="sm" onClick={handleRemoveProfilePic} disabled={isUploading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="profile_pic_url"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email field - read only */}
          <div className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input value={user.email} disabled className="bg-muted cursor-not-allowed" />
            <p className="text-sm text-muted-foreground">
              {user.email_verified ? "Your email is verified." : "Your email is not verified."}
            </p>
          </div>

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      +971
                    </span>
                    <Input
                      className="rounded-l-none"
                      placeholder="5X XXX XXXX"
                      {...field}
                      value={field.value?.replace(/^\+971/, "") || ""}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/[^0-9]/g, "")
                        field.onChange(value ? `+971${value}` : "")
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>Enter your UAE phone number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>LinkedIn Profile</FormLabel>
            <LinkedinUrlField defaultValue={user.linkedin_url} />
            <FormDescription>Connect your LinkedIn profile to enhance your professional presence</FormDescription>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || !isFormDirty} 
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  )
}

