"use server"

import { getServerSupabase } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type Invoice = {
  id: string
  user_id: string
  business_id: string
  amount: number
  currency: string
  status: string
  stripe_payment_intent_id: string | null
  stripe_invoice_id: string | null
  payment_date: string | null
}

const supabase = getServerSupabase()


export async function getInvoices(status?: string): Promise<Invoice[]> {
  try {
    const supabase = getServerSupabase()

    let query = supabase.from("invoices").select("*")

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("id", { ascending: false })

    if (error) {
      console.error("Error fetching invoices:", error)
      throw new Error("Failed to fetch invoices")
    }

    return data
  } catch (error) {
    console.error("Error in getInvoices:", error)
    throw error
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = getServerSupabase()

  try {
    const { data, error } = await supabase.from("invoices").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching invoice:", error)
      throw new Error("Failed to fetch invoice")
    }

    return data
  } catch (error) {
    console.error("Error in getInvoiceById:", error)
    throw error
  }
}

export async function getInvoicesByUserId(userId: string): Promise<Invoice[]> {

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false })

    if (error) {
      console.error("Error fetching user invoices:", error)
      throw new Error("Failed to fetch user invoices")
    }

    return data
  } catch (error) {
    console.error("Error in getInvoicesByUserId:", error)
    throw error
  }
}

export async function getInvoicesByBusinessId(businessId: string): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("business_id", businessId)
      .order("id", { ascending: false })

    if (error) {
      console.error("Error fetching business invoices:", error)
      throw new Error("Failed to fetch business invoices")
    }

    return data
  } catch (error) {
    console.error("Error in getInvoicesByBusinessId:", error)
    throw error
  }
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  try {
    const updateData: Partial<Invoice> = {
      status: status,
    }

    // If marking as paid, set the payment date
    if (status === "paid") {
      updateData.payment_date = new Date().toISOString()
    }

    const { data, error } = await supabase.from("invoices").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating invoice status:", error)
      throw new Error("Failed to update invoice status")
    }

    revalidatePath("/transactions/pending")
    revalidatePath("/transactions/approved")
    revalidatePath("/transactions/rejected")
    revalidatePath("/transactions/cancelled")
    revalidatePath("/transactions/closed")
    revalidatePath(`/transactions/${id}`)

    return data
  } catch (error) {
    console.error("Error in updateInvoiceStatus:", error)
    throw error
  }
}

export async function createInvoice(invoiceData: Omit<Invoice, "id">): Promise<Invoice> {
  try {
    const { data, error } = await supabase.from("invoices").insert(invoiceData).select().single()

    if (error) {
      console.error("Error creating invoice:", error)
      throw new Error("Failed to create invoice")
    }

    revalidatePath("/transactions/pending")

    return data
  } catch (error) {
    console.error("Error in createInvoice:", error)
    throw error
  }
}

export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const { data, error } = await supabase.from("invoices").update(invoiceData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating invoice:", error)
      throw new Error("Failed to update invoice")
    }

    revalidatePath("/transactions/pending")
    revalidatePath("/transactions/approved")
    revalidatePath("/transactions/rejected")
    revalidatePath("/transactions/cancelled")
    revalidatePath("/transactions/closed")
    revalidatePath(`/transactions/${id}`)

    return data
  } catch (error) {
    console.error("Error in updateInvoice:", error)
    throw error
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("invoices").delete().eq("id", id)

    if (error) {
      console.error("Error deleting invoice:", error)
      throw new Error("Failed to delete invoice")
    }

    revalidatePath("/transactions/pending")
    revalidatePath("/transactions/approved")
    revalidatePath("/transactions/rejected")
    revalidatePath("/transactions/cancelled")
    revalidatePath("/transactions/closed")
  } catch (error) {
    console.error("Error in deleteInvoice:", error)
    throw error
  }
}
