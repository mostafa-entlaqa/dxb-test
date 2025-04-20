"use server"

import { cookies } from "next/headers"
import { getServerSupabase } from "@/lib/supabase/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Type for user profile
export type UserProfile = {
  id: string
  email: string
  full_name?: string
  email_verified: boolean
  verification_code?: string
  verification_code_expires_at?: string
  created_at: string
  updated_at: string
  profile_completed: boolean
  is_premium: boolean
  profile_pic_url?: string
  linkedin_url?: string
  phone_number?: string
}

// Type for user credits
export type UserCredits = {
  id: string
  user_id: string
  ai_credits: number
  created_at: string
  updated_at: string
  credits: number
  last_credits_added_at: string | null
  joined_at: string | null
}

// Get Supabase client for server actions


// Fetch user profile from Supabase
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = getServerSupabase()

    const { data, error } = await supabase
      .from("users")
      .select(`
       *
      `)
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// Fetch user credits from Supabase
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  try {
    const supabase = getServerSupabase()

    const { data, error } = await supabase
      .from("users_credits")
      .select(`
        id, user_id, ai_credits, created_at, updated_at, 
        credits, last_credits_added_at, joined_at
      `)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching user credits:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user credits:", error)
    return null
  }
}

// Schema for profile update
const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone_number: z.string().min(8, "Phone number must be at least 8 digits").max(15).optional(),
  profile_pic_url: z.string().url("Invalid URL").optional(),
})

// Update user profile using Supabase
export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    // Parse and validate the form data
    const data = {
      full_name: formData.get("full_name") as string,
      linkedin_url: formData.get("linkedin_url") as string,
      phone_number: formData.get("phone_number") as string,
      profile_pic_url: formData.get("profile_pic_url") as string,
    }

    // Special handling for profile_pic_url - allow empty string
    const validatedData = profileUpdateSchema.parse({
      ...data,
      profile_pic_url: data.profile_pic_url || undefined // Convert empty string to undefined for validation
    })
    
    // Update the user profile in Supabase
    const supabase = getServerSupabase()

    const updateData = {
      full_name: validatedData.full_name,
      linkedin_url: validatedData.linkedin_url,
      phone_number: validatedData.phone_number,
      profile_pic_url: data.profile_pic_url, // Use original value to allow empty string
      profile_completed: true,
      updated_at: new Date().toISOString(),
    }


    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)

    if (error) {
      console.error("Error updating user profile:", error)
      return {
        success: false,
        errors: { _form: "Failed to update profile. Please try again." },
      }
    }

    // Revalidate the profile page to reflect the changes
    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message
            return acc
          },
          {} as Record<string, string>,
        ),
      }
    }

    console.error("Error updating user profile:", error)
    return {
      success: false,
      errors: { _form: "Failed to update profile. Please try again." },
    }
  }
}

// Upload profile picture to Supabase Storage
export async function uploadProfilePicture(userId: string, base64Data: string) {
  try {
    const supabase = getServerSupabase()

    // Remove the data URL prefix to get just the base64 string
    const base64String = base64Data.split(',')[1]
    // Convert base64 to buffer
    const buffer = Buffer.from(base64String, 'base64')

    // Generate a unique file name
    const fileName = `${userId}-${Date.now()}.jpg`
    const filePath = `${userId}/${fileName}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("sellbusiness/users")
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        cacheControl: "3600",
        upsert: true,
      })

    if (error) {
      console.error("Error uploading profile picture:", error)
      return { success: false, error: "Failed to upload profile picture" }
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("sellbusiness/users").getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Error uploading profile picture:", error)
    return { success: false, error: "Failed to upload profile picture" }
  }
}

