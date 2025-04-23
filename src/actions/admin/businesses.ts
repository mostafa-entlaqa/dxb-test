"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from '@/lib/supabase/utils'

export type Business = {
  id: string
  name: string
  acquisition_type: 'Invest' | 'Buy'
  Featured: boolean
  images: string[]
  files: string[]
  form_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'closed'
  created_at: string
  session_id?: string
  opportunity_description?: string
  investment_percentage?: number
  approveAt?: string | null
}

export async function getBusinesses(status?: string): Promise<Business[]> {
  try {
    const supabase = getServerSupabase()

    let query = supabase
      .from('businesses')
      .select()

    if (status) {
      query = query.eq('form_status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses:', error)
      throw error
    }

    if (!data) return []

    // Transform the data to match our expected format
    return data.map(business => ({
      id: business.id,
      name: business.opportunity_name || '',
      type: (business.type as 'investment' | 'buy') || 'buy',
      Featured: !!business.featured,
      images: Array.isArray(business.images) ? business.images : [],
      files: Array.isArray(business.files) ? business.files : [],
      form_status: business.approve_status || 'pending',
      created_at: business.created_at || new Date().toISOString(),
      acquisition_type: business.acquisition_type,
      opportunity_description: business.opportunity_description,
      investment_percentage: business.investment_percentage,
      approveAt: business.approveAt,
      subscription_end_date: business.subscription_end_date
    }))
  } catch (error) {
    console.error('Error in getBusinesses:', error)
    throw error
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  try {
    const supabase = getServerSupabase()

    const { data, error } = await supabase.from("businesses").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching business:", error)
      throw new Error("Failed to fetch business")
    }

    return data
  } catch (error) {
    console.error("Error in getBusinessById:", error)
    throw error
  }
}

export async function updateBusinessStatus(id: string, newStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'closed') {
  try {
    const supabase = getServerSupabase()

    const now = new Date().toISOString()
    const updateData = {
      approve_status: newStatus,
      ...(newStatus === "approved" ? { approveAt: now } : {})
    }

    const { error } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", id)

    if (error) {
      console.error("Error updating business status:", error)
      throw new Error("Failed to update business status")
    }

    revalidatePath("/dashboard/business")
  } catch (error) {
    console.error("Error in updateBusinessStatus:", error)
    throw error
  }
}

export async function updateBusiness(id: string, businessData: Partial<Business>): Promise<Business> {
  try {
    const supabase = getServerSupabase()

    const { data, error } = await supabase.from("businesses").update(businessData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating business:", error)
      throw new Error("Failed to update business")
    }

    revalidatePath("/business/pending")
    revalidatePath("/business/approved")
    revalidatePath("/business/rejected")
    revalidatePath("/business/cancelled")
    revalidatePath("/business/closed")
    revalidatePath(`/business/${id}`)

    return data
  } catch (error) {
    console.error("Error in updateBusiness:", error)
    throw error
  }
}

export async function deleteBusiness(id: string): Promise<void> {
  try {
    const supabase = getServerSupabase()

    const { error } = await supabase.from("businesses").delete().eq("id", id)

    if (error) {
      console.error("Error deleting business:", error)
      throw new Error("Failed to delete business")
    }

    revalidatePath("/business/pending")
    revalidatePath("/business/approved")
    revalidatePath("/business/rejected")
    revalidatePath("/business/cancelled")
    revalidatePath("/business/closed")
  } catch (error) {
    console.error("Error in deleteBusiness:", error)
    throw error
  }
}

export async function updateBusinessFeatured(id: string, Featured: boolean) {
  try {
    const supabase = getServerSupabase()

    const { error } = await supabase
      .from('businesses')
      .update({ Featured })
      .eq('id', id)

    if (error) {
      console.error('Error updating business featured status:', error)
      throw error
    }

    revalidatePath("/dashboard/business")
  } catch (error) {
    console.error('Error in updateBusinessFeatured:', error)
    throw error
  }
}
