'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function verifyPaymentStatus(userId: string, sessionId: string | null): Promise<boolean> {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'paid')
      
    if (sessionId) {
      // If sessionId is provided, check for specific invoice
      return invoices?.some(invoice => invoice.stripe_invoice_id === sessionId) ?? false
    }
    

      console.log(invoices, 'invoices')
    // Otherwise check if user has any paid invoices
    return (invoices || []).length > 0
  } catch (error) {
    console.error('Error verifying payment:', error)
    return false
  }
} 