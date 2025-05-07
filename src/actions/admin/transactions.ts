"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from '@/lib/supabase/utils'

export type Transaction = {
    id: string
    amount: number
    status: 'pending' | 'completed' | 'failed' | 'refunded'
    created_at: string
    user: {
        id: string
        name: string | null
        email: string
    }
    business: {
        id: string
        name: string
    }
    payment_method: string
    invoice_id: string
}

export async function getTransactions(): Promise<Transaction[]> {
    try {
        const supabase = getServerSupabase()

        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                user:users (
                    id,
                    name,
                    email
                ),
                business:businesses (
                    id,
                    opportunity_name
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching transactions:', error)
            throw error
        }

        if (!data) return []

        return data.map(transaction => ({
            id: transaction.id,
            amount: transaction.amount,
            status: transaction.status,
            created_at: transaction.created_at,
            user: {
                id: transaction.user.id,
                name: transaction.user.name,
                email: transaction.user.email
            },
            business: {
                id: transaction.business.id,
                name: transaction.business.opportunity_name
            },
            payment_method: transaction.payment_method,
            invoice_id: transaction.invoice_id
        }))
    } catch (error) {
        console.error('Error in getTransactions:', error)
        throw error
    }
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
    try {
        const supabase = getServerSupabase()

        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                user:users (
                    id,
                    name,
                    email
                ),
                business:businesses (
                    id,
                    opportunity_name
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching transaction:', error)
            throw error
        }

        if (!data) return null

        return {
            id: data.id,
            amount: data.amount,
            status: data.status,
            created_at: data.created_at,
            user: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email
            },
            business: {
                id: data.business.id,
                name: data.business.opportunity_name
            },
            payment_method: data.payment_method,
            invoice_id: data.invoice_id
        }
    } catch (error) {
        console.error('Error in getTransactionById:', error)
        throw error
    }
}

export async function updateTransactionStatus(id: string, status: Transaction['status']) {
    try {
        const supabase = getServerSupabase()

        const { error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id)

        if (error) {
            console.error('Error updating transaction status:', error)
            throw error
        }

        revalidatePath('/dashboard/transactions')
    } catch (error) {
        console.error('Error in updateTransactionStatus:', error)
        throw error
    }
} 