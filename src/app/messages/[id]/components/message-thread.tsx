'use client'

import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Check, CheckCheck, Image as ImageIcon, Paperclip, X } from "lucide-react"
import { BuyerTag } from "./buyer-tag"
import { useMessages } from "@/hooks/useMessages"
import { createInitialContact } from "@/actions/user/messages/create-contact"
import { getClientSupabase } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  business_id: number
  read_at: string | null
  attachments?: string[]
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
  const [uploading, setUploading] = useState(false)
  const { isBusinessOwner, currentUser } = useMessages(businessId, buyerId)
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState<Record<string, User>>({})
  const [attachmentPreviews, setAttachmentPreviews] = useState<{ url: string; type: 'image' | 'file'; name: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)


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
        const { data: unreadMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('business_id', businessId)
          .eq('receiver_id', currentUser.id)
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

  const handleFileUpload = async (file: File) => {
    if (!currentUser?.id) return;
    
    try {
      setUploading(true);
      const supabase = getClientSupabase()
      
      // Client-side validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return null;
      }
      
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${businessId}/${currentUser.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        toast.error('Failed to upload file');
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);
        
      toast.success('File uploaded successfully');
      
      // Add to preview
      const isImage = file.type.startsWith('image/');
      setAttachmentPreviews(prev => [...prev, {
        url: publicUrl,
        type: isImage ? 'image' : 'file',
        name: file.name
      }]);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && attachmentPreviews.length === 0) || !currentUser || !buyerId || sending || uploading) return

    setSending(true)
    try {
      const supabase = getClientSupabase()

      // Get all attachment URLs
      const attachments = attachmentPreviews.map(preview => preview.url);
      
      // For business owners, they are always the receiver when buyer sends, and sender when responding
      // For buyers, they are always the sender when initiating, and receiver when business owner responds
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: isBusinessOwner ? buyerId : (await getBusinessOwnerId()),
        content: newMessage,
        business_id: businessId,
        attachments
      };

      // Create message
      const { error } = await supabase
        .from('messages')
        .insert(messageData)
        
      if (error) throw error

      setNewMessage('')
      setAttachmentPreviews([])
      
      // Message will be added to state through real-time subscription
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Helper function to get business owner ID
  const getBusinessOwnerId = async () => {
    const supabase = getClientSupabase();
    const { data } = await supabase
      .from('businesses')
      .select('user_id')
      .eq('id', businessId)
      .single();
    
    return data?.user_id;
  };

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
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((url, index) => {
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                                return isImage ? (
                                  <div key={index} className="relative">
                                    <img 
                                      src={url} 
                                      alt="Attachment" 
                                      className="max-w-[200px] rounded-md"
                                      onClick={() => window.open(url, '_blank')}
                                    />
                                  </div>
                                ) : (
                                  <a 
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm hover:underline"
                                  >
                                    <Paperclip className="h-4 w-4" />
                                    <span>{url.split('/').pop()}</span>
                                  </a>
                                );
                              })}
                            </div>
                          )}
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
          
          {/* Upload buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-muted rounded-md"
              disabled={sending || uploading}
            >
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-muted rounded-md"
              disabled={sending || uploading}
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </button>
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>

          {/* Attachment previews */}
          {attachmentPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachmentPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  {preview.type === 'image' ? (
                    <div className="relative">
                      <img 
                        src={preview.url} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative bg-muted p-2 rounded-md">
                      <Paperclip className="h-4 w-4 mb-1" />
                      <div className="text-xs truncate max-w-[72px]">{preview.name}</div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message input */}
          <div className="flex">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
              disabled={sending || uploading}
            />
            <Button type="submit" disabled={sending || uploading || (!newMessage.trim() && attachmentPreviews.length === 0)}>
              {sending || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {uploading ? 'Uploading...' : 'Sending...'}
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>

          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleFileUpload(file);
              e.target.value = '';
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleFileUpload(file);
              e.target.value = '';
            }}
          />
        </form>
      </div>
    </div>
  )
}