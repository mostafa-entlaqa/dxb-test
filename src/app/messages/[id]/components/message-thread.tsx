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

        // Only mark messages as read where the current user is the RECEIVER (not the sender)
        if (data && data.length > 0) {
          // Find messages where current user is the receiver and they're unread
          const unreadMessagesForCurrentUser = data.filter(
            message => message.receiver_id === currentUser.id && message.read_at === null
          )
          
          // Only perform update if there are unread messages for current user
          if (unreadMessagesForCurrentUser.length > 0) {
            const messageIds = unreadMessagesForCurrentUser.map(msg => msg.id)
            
            // Update ONLY the specific messages where current user is the receiver
            const { error: updateError } = await supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .in('id', messageIds)

            if (updateError) {
              console.error('Error updating read status for received messages:', updateError)
            }
          }
        }

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
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `business_id=eq.${businessId}`,
    },
    async (payload) => {
      if (!mounted) return

      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new as Message
        
        // If this is a message intended for the current user, mark it as read immediately
        if (newMessage.receiver_id === userId) {
          // Update read_at in the database
          const timestamp = new Date().toISOString();
          const { error } = await supabase
            .from('messages')
            .update({ read_at: timestamp })
            .eq('id', newMessage.id)
          
          if (error) {
            console.error('Error marking message as read:', error);
            // Add message with original read_at status
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          } else {
            // Add message with updated read_at status to frontend state
            setMessages((prevMessages) => [
              ...prevMessages, 
              { ...newMessage, read_at: timestamp }
            ]);
          }
        } else {
          // This is a message sent by the current user, just add it
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        // Scroll to the latest message
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }, 100)
      } else if (payload.eventType === 'UPDATE') {
        // Handle updates to messages (like read status changes)
        const updatedMessage = payload.new as Message;
        
        // Update the message in our state
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
      <span className="ml-2 flex items-center text-xs text-gray-500">
        {message.read_at ? (
          <CheckCheck className="h-4 w-4 text-green-500" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </span>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages container with normal scrolling */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="flex flex-col justify-end min-h-full">
         
            <div className="p-4 space-y-4">
              {loading ? (
                <div className="flex  items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = currentUser?.id === message.sender_id
                  const messageUser = users[message.sender_id]

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`flex items-start ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={messageUser?.profile_pic_url || undefined} />
                          <AvatarFallback>
                            {messageUser?.full_name?.charAt(0) || messageUser?.email?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {messageUser?.full_name || messageUser?.email?.split('@')[0]}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-end gap-2">
                            <div
                              className={`rounded-lg px-4 py-2 max-w-md break-words ${
                                isCurrentUser
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {message.content}
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
