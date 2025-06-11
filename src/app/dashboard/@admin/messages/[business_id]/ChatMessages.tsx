"use client"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { useRef, useEffect } from "react"

function AvatarFallback({ name }: { name: string }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  // Generate a consistent color based on the name
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
    <div className={`w-8 h-8 rounded-full ${gradientClass} flex items-center justify-center ring-2 ring-background shadow-sm`}>
      <span className="text-sm font-semibold text-white">{initial}</span>
    </div>
  )
}

export default function ChatMessages({ messages, seller, buyer, scrollContainerRef }: any) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollContainerRef && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }
  }, [messages, scrollContainerRef])

  function formatMessageTime(timestamp: string) {
    const date = new Date(timestamp)
    if (new Date().toDateString() === date.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    // For older messages, show relative time
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      // less than a week
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      return days === 0 ? "Yesterday" : `${days} days ago`
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      {messages && messages.length > 0 ? (
        messages.map((msg: any) => {
          const isSeller = msg.sender_id === seller?.id
          const user = isSeller ? seller : buyer
          let attachments: string[] = []
          if (msg.attachments && Array.isArray(msg.attachments)) {
            attachments = msg.attachments
          } else if (msg.attachments && typeof msg.attachments === "string") {
            try {
              attachments = JSON.parse(msg.attachments)
            } catch {
              attachments = []
            }
          }
          return (
            <div key={msg.id} className={`flex ${isSeller ? "justify-start" : "justify-end"} group`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${isSeller ? "flex-row" : "flex-row-reverse"}`}>
                <div className="relative">
                  {user?.profile_pic_url ? (
                    <Image
                      src={user.profile_pic_url}
                      alt={user?.full_name || ""}
                      width={32}
                      height={32}
                      className="rounded-full object-cover border-2 border-background"
                    />
                  ) : (
                    <AvatarFallback name={user?.full_name || ""} />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl shadow-sm ${isSeller
                    ? "bg-muted border border-border rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                    } w-full`}
                >
                  <div className="text-xs font-medium mb-1">
                    {isSeller ? seller?.full_name : buyer?.full_name}
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                  {attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attachments.map((url, idx) =>
                        url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Image
                              src={url}
                              alt="attachment"
                              width={120}
                              height={120}
                              className="rounded-lg border object-cover max-h-32"
                            />
                          </a>
                        ) : (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs underline text-primary"
                          >
                            Attachment {idx + 1}
                          </a>
                        )
                      )}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1 text-right">{formatMessageTime(msg.created_at)}</div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm text-muted-foreground mt-1">This conversation is empty.</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
} 