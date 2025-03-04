'use client'

import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { BuyerTag } from "./buyer-tag"
import { useMessages } from "@/hooks/useMessages"
import { createInitialContact } from "@/actions/user/messages/create-contact"
import { getClientSupabase } from "@/lib/supabase/client"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  business_id: number
}

interface User {
  id: string
  email: string
  full_name: string | null
  profile_pic_url: string | null
}

export function MessageThread({ 
  businessId, 
  buyerId,
  initialMessages,
  className 
}: { 
  businessId: string
  buyerId: string | null
  initialMessages: Message[]
  className?: string 
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const { isBusinessOwner, currentUser } = useMessages(businessId, buyerId)
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState<Record<string, User>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load user profiles
  useEffect(() => {
    const loadUsers = async () => {
      if (!currentUser?.id || !buyerId) return
      
      const supabase = getClientSupabase()
      
      // Get the business owner's ID first
      const { data: business } = await supabase
        .from('businesses')
        .select('user_id')
        .eq('id', businessId)
        .single()
      
      if (!business) return

      // Load both buyer and seller profiles
      const userIds = new Set([currentUser.id, buyerId, business.user_id].filter(Boolean))
      
      const { data } = await supabase
        .from('users')
        .select('id, email, full_name, profile_pic_url')
        .in('id', Array.from(userIds))

      if (data) {
        const userMap = data.reduce((acc, user) => ({
          ...acc,
          [user.id]: user
        }), {})
        setUsers(userMap)
      }
    }

    loadUsers()
  }, [currentUser?.id, buyerId, businessId])

  // Load messages and handle real-time updates
  useEffect(() => {
    let mounted = true
    
    const loadMessages = async () => {
      if (!currentUser?.id || !buyerId) return
      setLoading(true)
      try {
        const supabase = getClientSupabase()
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('business_id', businessId)
          .or(`sender_id.eq.${buyerId},receiver_id.eq.${buyerId}`)
          .order('created_at', { ascending: true })

        if (mounted && data) {
          setMessages(data)
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
          }, 100)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // Set up real-time subscriptions
    const supabase = getClientSupabase()
    
    const channel = supabase
      .channel(`messages-${businessId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `business_id=eq.${businessId}`,
      }, (payload) => {
        if (!mounted) return
        
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message
          setMessages(prevMessages => [...prevMessages, newMessage])
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
          }, 100)
        }
      })
      .subscribe()

    // Load initial messages
    loadMessages()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [businessId, buyerId, currentUser?.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !buyerId || sending) return

    setSending(true)
    try {
      const supabase = getClientSupabase()
      // Create initial contact if needed
      await createInitialContact(businessId)

      const messageData = {
        business_id: parseInt(businessId),
        sender_id: currentUser.id,
        receiver_id: buyerId,
        content: newMessage.trim()
      }

      const { error } = await supabase
        .from('messages')
        .insert(messageData)

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  // Show placeholder for business owner with no selected buyer
  if (isBusinessOwner && !buyerId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="mb-4">Select a buyer to view messages</p>
          <BuyerTag businessId={businessId} buyerId={buyerId || ''} isLoading={loading} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages container with normal scrolling */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="flex flex-col justify-end min-h-full">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.sender_id === currentUser?.id
                const user = users[message.sender_id]
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                      <Avatar className="w-8 h-8 border overflow-hidden">
                        {user?.profile_pic_url ? (
                          <AvatarImage src={user.profile_pic_url} alt={user.full_name || user.email} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(user?.full_name?.[0] || user?.email[0] || 'U').toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className={`mx-2 p-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-muted-foreground rounded-tl-none"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed input form at bottom */}
      <div className="border-t border-border bg-background flex-shrink-0">
        <form onSubmit={handleSendMessage} className="p-4">
          {isBusinessOwner && (
            <BuyerTag businessId={businessId} buyerId={buyerId || ''} isLoading={loading} />
          )}
          <div className="flex mt-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
              disabled={loading || sending}
            />
            <Button type="submit" disabled={loading || sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
