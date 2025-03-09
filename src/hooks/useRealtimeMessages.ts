import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { getClientSupabase } from '@/lib/supabase/client'

interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
  status: 'sent' | 'delivered' | 'read'
  business_id: string
}

export function useRealtimeMessages(businessId: string, buyerId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isBusinessOwner, setIsBusinessOwner] = useState(false)
  const router = useRouter()

  // Initialize user and business owner status
  useEffect(() => {
    const supabase = getClientSupabase()
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: business } = await supabase
          .from('businesses')
          .select('user_id')
          .eq('id', businessId)
          .single()

        setCurrentUser(user)
        setIsBusinessOwner(business?.user_id === user.id)

        // Initial messages fetch
        let query = supabase
          .from('messages')
          .select('*')
          .eq('business_id', businessId)

        if (isBusinessOwner && buyerId) {
          query = query.or(`sender_id.eq.${buyerId},receiver_id.eq.${buyerId}`)
        } else if (user) {
          query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        }

        const { data: initialMessages, error: fetchError } = await query
          .order('created_at', { ascending: true })

        if (fetchError) {
          console.error('Error fetching initial messages:', fetchError)
          return
        }

        if (initialMessages) {
          setMessages(initialMessages)
        }
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }

    initializeUser()
  }, [businessId, buyerId, isBusinessOwner])

  // Set up realtime subscription
  useEffect(() => {
    if (!currentUser || !businessId) return

    const supabase = getClientSupabase()

    // Create channel for this specific business's messages
    const channel = supabase.channel(`messages:${businessId}`)

    // Subscribe to INSERT changes
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const newMessage = payload.new as Message
          
          // Check if message belongs to current conversation
          const isRelevantMessage = isBusinessOwner
            ? buyerId 
              ? (newMessage.sender_id === buyerId || newMessage.receiver_id === buyerId)
              : true
            : (newMessage.sender_id === currentUser.id || newMessage.receiver_id === currentUser.id)

          if (isRelevantMessage) {
            setMessages(prev => [...prev, newMessage])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const updatedMessage = payload.new as Message
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          )
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to messages channel')
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to messages channel')
        }
      })

    // Cleanup subscription
    return () => {
      channel.unsubscribe()
    }
  }, [businessId, currentUser, isBusinessOwner, buyerId])

  // Auth state change listener
  useEffect(() => {
    const supabase = getClientSupabase()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return { messages, isBusinessOwner, currentUser }
}
