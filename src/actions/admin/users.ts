"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from "@/lib/supabase/server"

export type User = {
  id: string
  email: string
  full_name: string
  interest: string
  linkedin_url: string
  profile_pic_url: string
  phone_number: string
  role: string
}

export type UserWithCredits = User & {
  credits?: number
  ai_credits?: number
}
const supabase = getServerSupabase()  


export async function getUsers(): Promise<UserWithCredits[]> {
  try {
    const { data: users, error } = await supabase.from("users").select("*")

    if (error) {
      console.error("Error fetching users:", error)
      throw new Error("Failed to fetch users")
    }

    // Fetch credits for each user
    const usersWithCredits = await Promise.all(
      users.map(async (user) => {
        const { data: credits, error: creditsError } = await supabase
          .from("users_credits")
          .select("credits, ai_credits")
          .eq("user_id", user.id)
          .single()

        if (creditsError) {
          console.error(`Error fetching credits for user ${user.id}:`, creditsError)
          return user
        }

        return {
          ...user,
          credits: credits?.credits || 0,
          ai_credits: credits?.ai_credits || 0,
        }
      }),
    )

    return usersWithCredits
  } catch (error) {
    console.error("Error in getUsers:", error)
    throw error
  }
}

export async function getUserById(id: string): Promise<UserWithCredits | null> {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching user:", error)
      throw new Error("Failed to fetch user")
    }

    // Fetch user credits
    const { data: credits, error: creditsError } = await supabase
      .from("users_credits")
      .select("credits, ai_credits")
      .eq("user_id", id)
      .single()

    if (creditsError && creditsError.code !== "PGRST116") {
      // Not found is ok
      console.error(`Error fetching credits for user ${id}:`, creditsError)
    }

    return {
      ...user,
      credits: credits?.credits || 0,
      ai_credits: credits?.ai_credits || 0,
    }
  } catch (error) {
    console.error("Error in getUserById:", error)
    throw error
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  try {
    const { data, error } = await supabase.from("users").update(userData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating user:", error)
      throw new Error("Failed to update user")
    }

    revalidatePath("/users")
    revalidatePath(`/users/${id}`)

    return data
  } catch (error) {
    console.error("Error in updateUser:", error)
    throw error
  }
}

export async function updateUserCredits(userId: string, credits: number, aiCredits?: number): Promise<void> {
  try {
    const { data: existingCredits, error: fetchError } = await supabase
      .from("users_credits")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // Not found is ok
      console.error("Error fetching user credits:", fetchError)
      throw new Error("Failed to fetch user credits")
    }

    const now = new Date().toISOString()

    if (existingCredits) {
      // Update existing record
      const { error } = await supabase
        .from("users_credits")
        .update({
          credits: credits,
          ai_credits: aiCredits !== undefined ? aiCredits : existingCredits.ai_credits,
          updated_at: now,
          last_credits_added_at: now,
        })
        .eq("user_id", userId)

      if (error) {
        console.error("Error updating user credits:", error)
        throw new Error("Failed to update user credits")
      }
    } else {
      // Create new record
      const { error } = await supabase.from("users_credits").insert({
        user_id: userId,
        credits: credits,
        ai_credits: aiCredits || 0,
        created_at: now,
        updated_at: now,
        last_credits_added_at: now,
        joined_at: now,
      })

      if (error) {
        console.error("Error creating user credits:", error)
        throw new Error("Failed to create user credits")
      }
    }

    revalidatePath("/users")
    revalidatePath(`/users/${userId}`)
  } catch (error) {
    console.error("Error in updateUserCredits:", error)
    throw error
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    // Delete user credits first (if they exist)
    await supabase.from("users_credits").delete().eq("user_id", id)

    // Then delete the user
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) {
      console.error("Error deleting user:", error)
      throw new Error("Failed to delete user")
    }

    revalidatePath("/users")
  } catch (error) {
    console.error("Error in deleteUser:", error)
    throw error
  }
}
