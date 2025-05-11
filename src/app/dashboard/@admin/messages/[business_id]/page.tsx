import { getServerSupabase } from "@/lib/supabase/server"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Suspense } from "react"
import ChatMessages from "./ChatMessages"

async function getUserInfo(user_id: string) {
  const supabase = getServerSupabase()
  const { data: user } = await supabase
    .from("users")
    .select("id, full_name, profile_pic_url")
    .eq("id", user_id)
    .single()
  return user
}

async function getBusinessInfo(business_id: string) {
  const supabase = getServerSupabase()
  const { data: business } = await supabase
    .from("businesses")
    .select("id, opportunity_name, user_id")
    .eq("id", business_id)
    .single()
  return business
}

export default async function AdminMessageRoomPage({
  params,
  searchParams,
}: {
  params: { business_id: string }
  searchParams: { sender?: string; receiver?: string }
}) {
  const business_id = params.business_id
  const sender_id = searchParams.sender
  const receiver_id = searchParams.receiver

  if (!sender_id || !receiver_id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold">Missing Information</h2>
          <p className="mt-2">Sender or receiver information is missing.</p>
          <Link href="/admin" className="mt-4 inline-flex items-center text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Fetch business info and both users
  const [business, sender, receiver] = await Promise.all([
    getBusinessInfo(business_id),
    getUserInfo(sender_id),
    getUserInfo(receiver_id),
  ])

  // Determine seller and buyer
  const seller = business && business.user_id === sender_id ? sender : receiver
  const buyer = business && business.user_id === sender_id ? receiver : sender

  const supabase = getServerSupabase()
  // Fetch all messages for this business and these two users, including attachments
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, created_at, attachments")
    .eq("business_id", business_id)
    .in("sender_id", [sender_id, receiver_id])
    .in("receiver_id", [sender_id, receiver_id])
    .order("created_at", { ascending: true })

  function formatMessageTime(timestamp: string) {
    const date = new Date(timestamp)
    if (new Date().toDateString() === date.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with user info */}
      <div className="hidden md:flex w-80 flex-col border-r border-border bg-muted/30">
        <div className="p-4 border-b border-border">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          <h2 className="text-xl font-bold">{business?.opportunity_name || "Business Chat"}</h2>
          <p className="text-sm text-muted-foreground mt-1">ID: {business_id}</p>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">PARTICIPANTS</h3>

          <div className="space-y-4">
            {/* Seller info */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
              <Image
                src={seller?.profile_pic_url || "/default-avatar.png"}
                alt={seller?.full_name || "Seller"}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{seller?.full_name || "Unknown Seller"}</div>
                <Badge variant="outline" className="mt-1">
                  Seller
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">ID: {seller?.id}</p>
              </div>
            </div>

            {/* Buyer info */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
              <Image
                src={buyer?.profile_pic_url || "/default-avatar.png"}
                alt={buyer?.full_name || "Buyer"}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{buyer?.full_name || "Unknown Buyer"}</div>
                <Badge variant="outline" className="mt-1">
                  Buyer
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">ID: {buyer?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b border-border flex items-center gap-3">
          <Link href="/admin" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">{business?.opportunity_name || "Chat"}</h1>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Message Room</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Image
                src={seller?.profile_pic_url || "/default-avatar.png"}
                alt={seller?.full_name || "Seller"}
                width={32}
                height={32}
                className="rounded-full border-2 border-background"
              />
              <Image
                src={buyer?.profile_pic_url || "/default-avatar.png"}
                alt={buyer?.full_name || "Buyer"}
                width={32}
                height={32}
                className="rounded-full border-2 border-background"
              />
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-sm font-medium">{business?.opportunity_name}</div>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <ChatMessages messages={messages} seller={seller} buyer={buyer} />
        </ScrollArea>

        {/* Message input area - disabled in admin view */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground text-center">
            This is an admin view. You cannot send messages in this interface.
          </div>
        </div>
      </div>
    </div>
  )
}
