'use client'

import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BuyerTag } from "./buyer-tag"
import { useMessages } from "@/hooks/useMessages"
import { createInitialContact } from '@/app/actions/messages/create-contact'
import {getClientSupabase} from '@/lib/supabase/client'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  status: "sent" | "delivered" | "read"
  receiver_id: string
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
  const { isBusinessOwner, currentUser } = useMessages(businessId, buyerId)
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Only handle real-time updates
  useEffect(() => {
    if (!currentUser?.id) return
    const supabase = getClientSupabase()
    const channel = supabase.channel(`messages_${businessId}_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `business_id=eq.${businessId}`
      }, (payload) => {
        const newMessage = payload.new as Message
        setMessages(current => [...current, newMessage])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, currentUser?.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Show placeholder for business owner with no selected buyer
  if (isBusinessOwner && !buyerId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a buyer to view messages
      </div>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    try {
      const supabase = getClientSupabase()
      // Create initial contact if needed
      await createInitialContact(businessId)

      const { data: business } = await supabase
        .from('businesses')
        .select('user_id')
        .eq('id', businessId)
        .single()

      if (!business) throw new Error('Business not found')

      const receiverId = isBusinessOwner ? buyerId! : business.user_id
    
      

      await supabase.from('messages').insert({
        business_id: parseInt(businessId),
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: newMessage,
      }).throwOnError()

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages container with normal scrolling */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="flex flex-col justify-end min-h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${
                  message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex items-start ${
                  message.sender_id === currentUser?.id ? "flex-row-reverse" : "flex-row"
                }`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.sender_id === currentUser?.id ? 'Me' : 'Other'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`mx-2 p-3 rounded-lg ${
                    message.sender_id === currentUser?.id
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
            ))}
          </div>
        </div>
      </div>

      {/* Fixed input form at bottom */}
      <div className="border-t border-border bg-background flex-shrink-0">
        <form onSubmit={handleSendMessage} className="p-4">
          {isBusinessOwner && buyerId && <BuyerTag businessId={businessId} buyerId={buyerId} />}
          <div className="flex mt-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
