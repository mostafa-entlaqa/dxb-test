import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
  status: 'sent' | 'delivered' | 'read'
}

interface User {
  id: string
  email: string
}

export function useMessages(businessId: string, buyerId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isBusinessOwner, setIsBusinessOwner] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Memoize fetch functions to prevent recreation
  const fetchMessages = useCallback(async () => {
    if (!currentUser) return

    let query = supabase
      .from('messages')
      .select('*')
      .eq('business_id', businessId)

    if (isBusinessOwner && buyerId) {
      query = query.or(`sender_id.eq.${buyerId},receiver_id.eq.${buyerId}`)
    } else {
      query = query.or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
    }

    const { data } = await query.order('created_at', { ascending: true })
    if (data) setMessages(data)
  }, [businessId, currentUser, isBusinessOwner, buyerId])

  // Initialize user and business owner status
  useEffect(() => {
    let mounted = true

    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return

        const { data: business } = await supabase
          .from('businesses')
          .select('user_id')
          .eq('id', businessId)
          .single()

        if (mounted) {
          setCurrentUser(user)
          setIsBusinessOwner(business?.user_id === user.id)
        }
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }

    initializeUser()
    return () => { mounted = false }
  }, [businessId])

  // Handle messages fetch and real-time updates
  useEffect(() => {
    if (!currentUser) return
    let mounted = true

    fetchMessages()

    // Single channel for all message updates
    const channel = supabase.channel(`messages_${businessId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          if (!mounted) return
          const newMessage = payload.new as Message

          // Only update if message is relevant to current view
          const isRelevantMessage = isBusinessOwner
            ? buyerId && (newMessage.sender_id === buyerId || newMessage.receiver_id === buyerId)
            : newMessage.sender_id === currentUser.id || newMessage.receiver_id === currentUser.id

          if (isRelevantMessage) {
            setMessages(current => [...current, newMessage])
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [businessId, currentUser, isBusinessOwner, buyerId, fetchMessages])

  return { messages, isBusinessOwner, currentUser }
} 