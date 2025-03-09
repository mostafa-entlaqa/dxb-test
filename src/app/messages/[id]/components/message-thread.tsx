'use client'

import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Check, CheckCheck } from "lucide-react"
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
  read_at: string | null
}

interface User {
  id: string
  email: string
  full_name: string | null
  profile_pic_url: string | null
}

interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Message
  old: Message | null
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
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const { isBusinessOwner, currentUser } = useMessages(businessId, buyerId)
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState<Record<string, User>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  console.log(messages)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMessages(initialMessages)
    }, 1000)
  }, [])

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
    const userId = currentUser?.id
    
    const loadMessages = async () => {
      if (!currentUser?.id || !buyerId) return
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
      }
    }

    // Set up real-time subscriptions
    const supabase = getClientSupabase()
    
    const channel = supabase
      .channel(`messages-${businessId}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `business_id=eq.${businessId}`,
        },
        async (payload: RealtimePayload) => {
          if (!mounted) return

          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Scroll to the latest message
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
              }
            }, 100)
          } else if (payload.eventType === 'UPDATE') {
            // Handle updates to messages (like read status changes)
            const updatedMessage = payload.new;
            setMessages((prevMessages) => 
              prevMessages.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        }
      )
      .subscribe()

    // Load initial messages
    loadMessages()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [businessId, buyerId, currentUser?.id])

  // Separate useEffect for handling visibility changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && currentUser?.id && buyerId) {
        const supabase = getClientSupabase()
        
        // Get the business owner's ID first to determine if current user is seller
        const { data: business } = await supabase
          .from('businesses')
          .select('user_id')
          .eq('id', businessId)
          .single()

        if (!business) return

        // Only proceed if:
        // 1. Current user is business owner and message is from buyer
        // 2. Current user is buyer and message is from business owner
        const isBusinessOwner = business.user_id === currentUser.id
        const senderId = isBusinessOwner ? buyerId : business.user_id

        // Mark unread messages where current user is the receiver AND message is from the other party
        const { data: unreadMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('business_id', businessId)
          .eq('receiver_id', currentUser.id)
          .eq('sender_id', senderId)
          .is('read_at', null)

        if (unreadMessages && unreadMessages.length > 0) {
          const timestamp = new Date().toISOString()
          const messageIds = unreadMessages.map(msg => msg.id)
          
          const { error } = await supabase
            .from('messages')
            .update({ read_at: timestamp })
            .in('id', messageIds)

          if (!error) {
            // Update local message state to reflect read status
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                messageIds.includes(msg.id) 
                  ? { ...msg, read_at: timestamp }
                  : msg
              )
            )
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Call once on mount to handle already visible tab
    if (document.visibilityState === 'visible') {
      handleVisibilityChange()
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [currentUser?.id, businessId, buyerId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !buyerId || sending) return

    setSending(true)
    try {
      const supabase = getClientSupabase()
      // Create initial contact if needed
      await createInitialContact(businessId)

      // Send message with read_at explicitly set to null
      const messageData = {
        business_id: parseInt(businessId),
        sender_id: currentUser.id,
        receiver_id: buyerId,
        content: newMessage.trim(),
        read_at: null // Explicitly set to null when sending
      }

      const { error: sendError } = await supabase
        .from('messages')
        .insert(messageData)

      if (sendError) throw sendError

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
          <BuyerTag businessId={businessId} buyerId={buyerId || ''} isLoading={false} />
        </div>
      </div>
    )
  }

  // Add a MessageStatus component to display read status
  function MessageStatus({ message, currentUserId }: { message: Message, currentUserId: string }) {
    if (message.sender_id !== currentUserId) return null;

    return (
      <div className="text-xs text-muted-foreground mt-1 flex justify-end">
        {message.read_at ? (
          <div className="flex items-center space-x-1">
            <CheckCheck size={12} className="text-green-500" />
            
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <Check size={12} />
            
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages container with normal scrolling */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="flex flex-col justify-end min-h-full">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.sender_id === currentUser?.id;
                const user = users[message.sender_id];

                return (
                  <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                      {/* Show avatar for both current user and other users */}
                      <Avatar className="h-8 w-8 mx-2">
                        {user?.profile_pic_url && (
                          <AvatarImage src={user.profile_pic_url} alt={user.full_name || user.email} />
                        )}
                        <AvatarFallback>
                          {(user?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg py-2 px-3 ${
                            isCurrentUser
                              ? 'bg-primary text-white rounded-tr-none' 
                              : 'bg-muted rounded-tl-none'
                          }`}
                        >
                          {message.content}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                          <div>
                            {new Date(message.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </div>
                          {currentUser && <MessageStatus message={message} currentUserId={currentUser.id} />}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Fixed input form at bottom */}
      <div className="border-t border-border bg-background flex-shrink-0">
        <form onSubmit={handleSendMessage} className="p-4">
          {isBusinessOwner && (
            <BuyerTag businessId={businessId} buyerId={buyerId || ''} isLoading={false} />
          )}
          <div className="flex mt-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
              disabled={sending}
            />
            <Button type="submit" disabled={sending}>
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
