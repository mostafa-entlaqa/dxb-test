"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from '@/lib/supabase/utils'

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

export async function getInvoices() {
  const supabase = getServerSupabase()

  // First get all invoices
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select()
    .order('created_at', { ascending: false })

  if (invoicesError) throw invoicesError
  if (!invoices) return []

  // Then get all referenced users
  const userIds = [...new Set(invoices.map(invoice => invoice.user_id))]
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, full_name, profile_pic_url')
    .in('id', userIds)

  if (usersError) throw usersError
  if (!users) return invoices

  // Merge the data
  const usersMap = new Map(users.map(user => [user.id, user]))
  const invoicesWithUsers = invoices.map(invoice => ({
    ...invoice,
    user_details: usersMap.get(invoice.user_id) || null
  }))

  return invoicesWithUsers
}

export async function getInvoiceById(id: string) {
  const supabase = getServerSupabase()

  // Get the invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select()
    .eq('id', id)
    .single()

  if (invoiceError) throw invoiceError
  if (!invoice) return null

  // Get the user details
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url')
    .eq('id', invoice.user_id)
    .single()

  if (userError) throw userError

  return {
    ...invoice,
    user_details: user || null
  }
}

export async function getInvoicesByUserId(userId: string) {
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

export async function updateInvoiceStatus(id: string, status: Invoice['status']) {
  const supabase = getServerSupabase()
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/dashboard/invoices')
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

export async function updateInvoice(id: string, data: Partial<Omit<Invoice, "user_details">>) {
  const supabase = getServerSupabase()
  const { data: updatedInvoice, error } = await supabase
    .from('invoices')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/invoices')
  return updatedInvoice
}

export async function deleteInvoice(id: string) {
  const supabase = getServerSupabase()
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/dashboard/invoices')
}
