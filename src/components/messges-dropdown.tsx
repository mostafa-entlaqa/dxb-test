"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "./ui/scroll-area"

export function MessageDropdown({ user }: { user: any }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const supabase = createClientComponentClient()
  const pathname = usePathname()


  // Check if user is already on the messages page
  const isOnMessagesPage = pathname?.startsWith("/messages")

  // Load initial unread message count
  useEffect(() => {
    if (!user || isOnMessagesPage) return

    const countUnreadMessages = async () => {
      try {
        const { count, error } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("receiver_id", user.id)
          .is("read_at", null)

        if (error) throw error

        setUnreadCount(count || 0)
      } catch (error) {
        console.error("Error counting unread messages:", error)
      }
    }

    countUnreadMessages()

    // Set up real-time subscription for new messages count
    const subscription = supabase
      .channel("unread-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          // Just increment the count when a new message arrives
          setUnreadCount((prev) => prev + 1)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          // If a message was marked as read, decrement the count
          if (payload.new.read_at && !payload.old.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, supabase, isOnMessagesPage])

  // Fetch unread messages when dropdown opens
  useEffect(() => {
    if (!user || !isOpen || hasLoaded || isLoading) return

    const fetchUnreadMessages = async () => {
      setIsLoading(true)
      try {
        // Simple query to get unread messages
        const { data, error } = await supabase
          .from("messages")
          .select(`
            id,
            sender_id,
            receiver_id,
            content,
            attachments,
            created_at,
            business_id,
            business:businesses(id, opportunity_name, user_id)
          `)
          .eq("receiver_id", user.id)
          .is("read_at", null)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error

        // Get all sender IDs
        const senderIds = [...new Set(data.map((message) => message.sender_id))]

        // Fetch user information for all senders in a single request
        const { data: senders, error: sendersError } = await supabase
          .from("users")
          .select("id, full_name, profile_pic_url")
          .in("id", senderIds)

        if (sendersError) throw sendersError

        // Create a map of sender data for quick lookup
        const senderMap = senders.reduce(
          (acc, sender) => {
            acc[sender.id] = sender
            return acc
          },
          {} as Record<string, any>,
        )

        // Add sender info to each message
        const messagesWithSenders = data.map((message) => ({
          ...message,
          sender: senderMap[message.sender_id] || null,
        }))

        setUnreadMessages(messagesWithSenders)
        setHasLoaded(true)
      } catch (error) {
        console.error("Error fetching unread messages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnreadMessages()
  }, [user, supabase, isOpen, hasLoaded, isLoading])

  // Reset hasLoaded when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setHasLoaded(false)
    }
  }, [isOpen])

  // Mark a message as read
  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", messageId)

      if (error) throw error

      setUnreadMessages((prev) => prev.filter((message) => message.id !== messageId))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  // Mark all messages as read
  const markAllAsRead = async () => {
    if (unreadMessages.length === 0) return

    try {
      const messageIds = unreadMessages.map((message) => message.id)

      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", messageIds)

      if (error) throw error

      setUnreadMessages([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all messages as read:", error)
    }
  }

  // Helper function to safely format dates
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Recently"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Recently"
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name.charAt(0).toUpperCase()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">View messages</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80" forceMount>
        <div className="flex items-center justify-between p-2 border-b">
          <h3 className="font-medium">Messages</h3>
          {unreadMessages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px] overflow-auto">
        {isLoading ? (
            <div className="py-4 text-center text-muted-foreground">Loading messages...</div>
          ) : unreadMessages.length > 0 ? (
            unreadMessages.map((message) => (
              <DropdownMenuItem key={message.id} className="p-0 focus:bg-transparent">
                <Link
                  href={
                    // Check if the user is the business owner (receiver is the owner)
                    message.business?.user_id === user.id 
                      ? `/messages/${message.business_id}?buyer=${message.sender_id}`
                      : `/messages/${message.business_id || ""}`
                  }
                  className="flex items-start gap-3 p-3 w-full hover:bg-accent rounded-md"
                  onClick={() => markAsRead(message.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender?.profile_pic_url || ""} />
                    <AvatarFallback>{getInitials(message.sender?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{message.sender?.full_name || "Unknown"}</p>
                      <span className="text-xs text-muted-foreground">{formatMessageDate(message.created_at)}</span>
                    </div>
                    {message.business && (
                      <p className="text-xs text-muted-foreground">Re: {message.business.opportunity_name}</p>
                    )}
                    <p className="text-sm line-clamp-2">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        {message.attachments.map((attachment: string) => (
                          <div key={attachment} className="text-xs text-muted-foreground">
                            <img src={attachment} alt="Attachment" width={100} height={100} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">No unread messages</div>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/my-listings">View my listings</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

