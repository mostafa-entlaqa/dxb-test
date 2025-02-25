import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { BuyerTag } from "./buyer-tag"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read"
}

const StatusIcon = ({ status }: { status: Message["status"] }) => {
  switch (status) {
    case "sent":
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )
    case "delivered":
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7M5 13l4 4L19 7" />
        </svg>
      )
    case "read":
      return (
        <svg className="w-4 h-4 text-blue-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7M5 13l4 4L19 7" />
        </svg>
      )
    default:
      return null
  }
}

const messages: Message[] = [
  {
    id: "1",
    sender: "Buyer",
    content: "I'm interested in your coffee shop. Can you tell me more about the daily operations?",
    timestamp: "2023-05-01 10:30",
    status: "read",
  },
  {
    id: "2",
    sender: "Seller",
    content:
      "We operate from 6 AM to 8 PM, seven days a week. We have a staff of 10 part-time baristas and 2 full-time managers.",
    timestamp: "2023-05-01 11:15",
    status: "read",
  },
  {
    id: "3",
    sender: "Buyer",
    content: "That sounds good. What's the average daily revenue?",
    timestamp: "2023-05-01 11:45",
    status: "delivered",
  },
  {
    id: "4",
    sender: "Seller",
    content: "Our average daily revenue is around $2,000, with weekends typically being busier.",
    timestamp: "2023-05-01 12:30",
    status: "sent",
  },
]

export function MessageThread({ className }: { className?: string }) {
  return (
    <div className={`flex  flex-col ${className}`}>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === "Buyer" ? "justify-start" : "justify-end"}`}>
            <div className={`flex items-start ${message.sender === "Buyer" ? "flex-row" : "flex-row-reverse"}`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`mx-2 p-3 rounded-lg ${
                  message.sender === "Buyer"
                    ? "bg-muted text-muted-foreground rounded-tl-none"
                    : "bg-primary text-primary-foreground rounded-tr-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-xs opacity-70">{message.timestamp}</span>
                  {message.sender === "Seller" && <StatusIcon status={message.status} />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <BuyerTag />
        <div className="flex mt-2">
          <Input placeholder="Type your message..." className="flex-1 mr-2" />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  )
}

