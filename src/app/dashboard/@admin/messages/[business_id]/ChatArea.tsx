"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatMessages from "./ChatMessages"

interface ChatAreaProps {
  messages: any[]
  seller: any
  buyer: any
}

export default function ChatArea({ messages, seller, buyer }: ChatAreaProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Add a small delay to ensure the content is rendered
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
      <div className="p-4">
        <ChatMessages 
          messages={messages} 
          seller={seller} 
          buyer={buyer} 
          scrollContainerRef={scrollContainerRef} 
        />
      </div>
    </div>
  )
} 