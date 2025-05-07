"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from "@/lib/supabase/server"

export type Invoice = {
  id: string
  user_id: string
  full_name: string
  currency: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  stripe_payment_intent_id: string | null
  stripe_invoice_id: string | null
  payment_date: string | null
  created_at: string
  updated_at: string
  user_details?: {
    email: string
    full_name: string | null
    profile_pic_url: string | null
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const supabase = getServerSupabase()
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching invoices:", error)
      throw new Error("Failed to fetch invoices")
    }

    if (!invoices) return []

    // Get all unique user IDs
    const userIds = [...new Set(invoices.map(invoice => invoice.user_id))]

    // Get user details for all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, full_name, profile_pic_url")
      .in("id", userIds)

    if (usersError) {
      console.error("Error fetching users:", usersError)
      throw new Error("Failed to fetch user details")
    }

    // Create a map of user details
    const userMap = new Map(users?.map(user => [user.id, user]) || [])

    // Combine invoices with user details
    return invoices.map(invoice => ({
      ...invoice,
      user_details: userMap.get(invoice.user_id) || null
    }))
  } catch (error) {
    console.error("Error in getInvoices:", error)
    throw error
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const supabase = getServerSupabase()
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching invoice:", error)
      throw new Error("Failed to fetch invoice")
    }

    if (!invoice) return null

    // Get user details
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name, profile_pic_url")
      .eq("id", invoice.user_id)
      .single()

    // If user is not found, user will be null
    return {
      ...invoice,
      user_details: user || null
    }
  } catch (error) {
    console.error("Error in getInvoiceById:", error)
    throw error
  }
}

export async function z(userId: string) {
  const supabase = getServerSupabase()

  // Get invoices for user
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (invoicesError) throw invoicesError
  if (!invoices) return []

  // Get user details
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url')
    .eq('id', userId)
    .single()

  if (userError) throw userError

  // Add user details to all invoices
  return invoices.map(invoice => ({
    ...invoice,
    user_details: user || null
  }))
}

export async function updateInvoiceStatus(id: string, status: "pending" | "paid" | "failed"): Promise<Invoice> {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("invoices")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating invoice status:", error)
      throw new Error("Failed to update invoice status")
    }

    revalidatePath("/dashboard/@admin")
    return data
  } catch (error) {
    console.error("Error in updateInvoiceStatus:", error)
    throw error
  }
}

export async function createInvoice(data: Omit<Invoice, "id" | "created_at" | "updated_at" | "user_details">) {
  const supabase = getServerSupabase()
  const { data: newInvoice, error } = await supabase
    .from('invoices')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/invoices')
  return newInvoice
}

export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("invoices")
      .update(invoiceData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating invoice:", error)
      throw new Error("Failed to update invoice")
    }

    revalidatePath("/dashboard/@admin")
    return data
  } catch (error) {
    console.error("Error in updateInvoice:", error)
    throw error
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    const supabase = getServerSupabase()
    const { error } = await supabase.from("invoices").delete().eq("id", id)

    if (error) {
      console.error("Error deleting invoice:", error)
      throw new Error("Failed to delete invoice")
    }

    revalidatePath("/dashboard/@admin")
  } catch (error) {
    console.error("Error in deleteInvoice:", error)
    throw error
  }
}
