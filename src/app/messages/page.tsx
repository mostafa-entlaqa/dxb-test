import { getServerSupabase } from "@/lib/supabase/server"
import { MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Message, Business } from "./[id]/type"
import { Separator } from "@/components/ui/separator"

interface DatabaseMessage {
  id: string
  business_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  attachments?: string[]
  businesses: {
    id: string
    opportunity_name: string
    selling_price: number
    category_id: number
    area_id: string
    user_id: string
    images: string[]
  }
  sender: {
    id: string
    full_name: string
    profile_pic_url?: string
  }
  receiver: {
    id: string
    full_name: string
    profile_pic_url?: string
  }
}

interface Conversation {
  business: Business
  otherUser: {
    id: string
    full_name: string
    profile_pic_url?: string
  }
  lastMessage: Message
  unreadCount: number
}

async function getConversations(userId: string) {
  const supabase = getServerSupabase()
  
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id,
      business_id,
      sender_id,
      receiver_id,
      content,
      created_at,
      attachments,
      businesses (
        id,
        opportunity_name,
        selling_price,
        category_id,
        area_id,
        user_id,
        images
      ),
      sender:users!messages_sender_id_fkey (
        id,
        full_name,
        profile_pic_url
      ),
      receiver:users!messages_receiver_id_fkey (
        id,
        full_name,
        profile_pic_url
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (!messages) return []

  const conversations = messages.reduce((acc: Record<string, Conversation>, message: any) => {
    if (!message.businesses || !message.sender || !message.receiver) return acc

    const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id
    const otherUser = message.sender_id === userId ? message.receiver : message.sender
    const key = `${message.business_id}-${otherUserId}`

    if (!acc[key]) {
      acc[key] = {
        business: {
          id: message.businesses.id,
          opportunity_name: message.businesses.opportunity_name,
          selling_price: message.businesses.selling_price,
          category: { name: '' },
          area: { name: '' },
          user_id: message.businesses.user_id
        },
        otherUser,
        lastMessage: {
          id: message.id,
          business_id: parseInt(message.business_id),
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          created_at: message.created_at,
          read_at: null,
          attachments: message.attachments
        },
        unreadCount: 0
      }
    }
    return acc
  }, {})

  return Object.values(conversations)
}

function AvatarFallback({ name }: { name: string }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
  ]
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const gradientClass = colors[colorIndex]

  return (
    <div className={`w-10 h-10 rounded-full ${gradientClass} flex items-center justify-center ring-2 ring-background shadow-sm`}>
      <span className="text-sm font-semibold text-white">{initial}</span>
    </div>
  )
}

export default async function MessagesPage() {
  const supabase = getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="mt-2">Please sign in to view your messages.</p>
          <Link href="/login" className="mt-4 inline-flex items-center text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const conversations = await getConversations(user.id)

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Messages</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            <div className="divide-y divide-border">
              {conversations.map((conversation) => (
                <Link
                  key={`${conversation.business.id}-${conversation.otherUser.id}`}
                  href={`/messages/${conversation.business.id}?buyer=${conversation.otherUser.id}`}
                  className="block p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      {conversation.otherUser.profile_pic_url ? (
                        <Image
                          src={conversation.otherUser.profile_pic_url}
                          alt={conversation.otherUser.full_name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback name={conversation.otherUser.full_name} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium truncate">{conversation.otherUser.full_name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(conversation.lastMessage.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {conversation.business.opportunity_name}
                        </Badge>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your conversations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">Select a conversation</h3>
            <p className="text-sm mt-1">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 