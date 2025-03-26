'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader2, Check, CheckCheck, Image as ImageIcon, Paperclip, X } from "lucide-react"
import { useMessages } from "@/hooks/useMessages"
import { getClientSupabase } from "@/lib/supabase/client"
import MessageList from './message-list'
import PlaceholderBusiness from './placeholder-business'
import { Message } from '../type'
import MessageInput from './message-input'



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
  currentBuyerId,
  businessOwnerId
}: {
  businessId: string
  buyerId: string | null
  initialMessages: Message[]
  className?: string
  currentBuyerId: string | undefined
  businessOwnerId: string | undefined
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const { isBusinessOwner, currentUser } = useMessages(businessId, buyerId)
  const [users, setUsers] = useState<Record<string, User>>({})
  const scrollRef = useRef<HTMLDivElement>(null)


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
      const userIds = new Set([currentUser.id, buyerId, businessOwnerId].filter(Boolean))

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
      try {
        const supabase = getClientSupabase()

        // For business owners, show all messages in the business thread with this buyer
        // For buyers, show messages where they are sender or receiver
        const query = supabase
          .from('messages')
          .select('*')
          .eq('business_id', businessId)

        if (!isBusinessOwner) {
          query.or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        } else {
          query.or(`sender_id.eq.${buyerId},receiver_id.eq.${buyerId}`)
        }

        const { data } = await query.order('created_at', { ascending: true })

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
    const setupRealtimeSubscription = async () => {
      const supabase = getClientSupabase()

      // Get business owner ID if needed
      let ownerId = null;
      if (!isBusinessOwner) {
        const { data } = await supabase
          .from('businesses')
          .select('user_id')
          .eq('id', businessId)
          .single();
        ownerId = data?.user_id;
      }

      const channel = supabase
        .channel(`messages-${businessId}-${currentUser?.id}`)
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
              // For business owners, show all messages in their business with this buyer
              // For buyers, show messages where they are sender/receiver
              const shouldShow = isBusinessOwner
                ? (newMessage.sender_id === buyerId || newMessage.receiver_id === buyerId)
                : (newMessage.sender_id === currentUser?.id || newMessage.receiver_id === currentUser?.id ||
                  newMessage.sender_id === ownerId || newMessage.receiver_id === ownerId);

              if (shouldShow) {
                // Check if message already exists to prevent duplicates
                setMessages((prevMessages) => {
                  const exists = prevMessages.some(msg => msg.id === newMessage.id);
                  if (exists) return prevMessages;
                  return [...prevMessages, newMessage];
                });

                // Scroll to the latest message
                setTimeout(() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                  }
                }, 100)
              }
            } else if (payload.eventType === 'UPDATE') {
              // Handle updates to messages (like read status changes)
              const updatedMessage = payload.new;
              const shouldUpdate = isBusinessOwner
                ? (updatedMessage.sender_id === buyerId || updatedMessage.receiver_id === buyerId)
                : (updatedMessage.sender_id === currentUser?.id || updatedMessage.receiver_id === currentUser?.id ||
                  updatedMessage.sender_id === ownerId || updatedMessage.receiver_id === ownerId);

              if (shouldUpdate) {
                setMessages((prevMessages) =>
                  prevMessages.map(msg =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                  )
                );
              }
            }
          }
        )
        .subscribe()

      return channel;
    }

    // Load initial messages and set up subscription
    loadMessages()
    let channel: any;
    setupRealtimeSubscription().then(ch => {
      channel = ch;
    });

    return () => {
      mounted = false
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [businessId, buyerId, currentUser?.id, isBusinessOwner])

  // Separate useEffect for handling visibility changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && currentUser?.id && buyerId) {
        const supabase = getClientSupabase()

        // Mark unread messages where current user is the receiver

        const { data: unreadMessages, error: fetchError } = await supabase
          .from('messages')
          .select('id, receiver_id, sender_id')
          .eq('business_id', businessId)
          .eq('receiver_id', currentUser.id)
          .is('read_at', null);

        if (fetchError) {
          console.error('Error fetching messages:', fetchError);
          return;
        }

        console.log('Unread Messages:', unreadMessages);
        console.log('Current Buyer ID:', currentBuyerId);
        console.log('Business Owner ID:', businessOwnerId);

        // Filter messages where sender is the current buyer
        const buyerMessages = unreadMessages?.filter(msg => msg.sender_id === currentBuyerId) || [];
        const ownerMessages = unreadMessages?.filter(msg => msg.sender_id === businessOwnerId) || [];

        // Function to update messages
        const updateMessages = async (messages: { id: string }[]) => {
          if (messages.length === 0) return;

          const timestamp = new Date().toISOString();
          const messageIds = messages.map(msg => msg.id);

          console.log('Updating messages:', messageIds);

          const { error } = await supabase
            .from('messages')
            .update({ read_at: timestamp })
            .in('id', messageIds);

          if (!error) {
            console.log('Messages updated successfully');
            setMessages(prevMessages =>
              prevMessages.map(msg =>
                messageIds.includes(msg.id) ? { ...msg, read_at: timestamp } : msg
              )
            );
          } else {
            console.error('Error updating messages:', error);
          }
        };

        // Update messages for the current buyer
        if (currentBuyerId && buyerMessages.length > 0) {
          console.log('Updating buyer messages');
          await updateMessages(buyerMessages);
        }

        // Update messages for the business owner
        if (businessOwnerId && ownerMessages.length > 0) {
          console.log('Updating business owner messages');
          await updateMessages(ownerMessages);
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



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: any, attachments: string[]) => {
    console.log('onSend called with:', { content, attachments });
    console.log('Current User ID:', currentUser?.id);
    console.log('Buyer ID:', buyerId);
    console.log('Business ID:', businessId);

    if (!currentUser?.id || !buyerId) {
      throw new Error('Missing required user or buyer ID');
    }

    try {
      const supabase = getClientSupabase();
      const messageData = {
        sender_id: currentUser?.id,
        receiver_id: isBusinessOwner ? buyerId : businessOwnerId,
        content,
        business_id: businessId,
        attachments
      };
      console.log('Message Data:', messageData);

      const { error } = await supabase.from('messages').insert(messageData);
      if (error) {
        console.error('Supabase Insert Error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in onSend:', error);
      throw error;
    }
  };


  if (isBusinessOwner && !buyerId) {
    return (
      <PlaceholderBusiness businessId={businessId} buyerId={buyerId} />
    )
  }

  // Add a MessageStatus component to display read status


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
                return (
                  <MessageList key={message.id} currentUserId={currentUser?.id} users={users} message={message} />
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Fixed input form at bottom */}
      <div className="border-t border-border bg-background flex-shrink-0">
        <MessageInput
          onSend={handleSendMessage}
          businessId={businessId}
          currentUserId={currentUser?.id}
          isBusinessOwner={isBusinessOwner}
          buyerId={buyerId}
        />
      </div>
    </div>
  )
} 