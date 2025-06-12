"use server"

import { getServerSupabase } from "@/lib/supabase/server"

export async function getSubscriptions() {
  const supabase = await getServerSupabase()

  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching subscriptions:", error)
      return []
    }

    return subscriptions || []
  } catch (error) {
    console.error("Error in getSubscriptions:", error)
    return []
  }
}

export async function getActiveSubscriptions() {
  const supabase = await getServerSupabase()

  try {
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching active subscriptions:", error)
      return []
    }

    return subscriptions || []
  } catch (error) {
    console.error("Error in getActiveSubscriptions:", error)
    return []
  }
}
