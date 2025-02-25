import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface BusinessOpportunity {
  id: string
  title: string
  lastMessage: string
}

const opportunities: BusinessOpportunity[] = [
  { id: "1", title: "Coffee Shop for Sale", lastMessage: "I'm interested in your business." },
  { id: "2", title: "Tech Startup Acquisition", lastMessage: "Can we discuss the financials?" },
  { id: "3", title: "Restaurant Franchise", lastMessage: "What's the asking price?" },
]

export function BusinessOpportunityList({ className }: { className?: string }) {
  return (
    <div className={`bg-secondary ${className}`}>
      <div className="p-4 font-semibold text-lg text-secondary-foreground">Business Opportunities</div>
      <ScrollArea className="h-[calc(100vh-60px)]">
        {opportunities.map((opp) => (
          <Button key={opp.id} variant="ghost" className="w-full justify-start p-4 h-auto hover:bg-primary/10">
            <div className="text-left">
              <div className="font-medium text-secondary-foreground">{opp.title}</div>
              <div className="text-sm text-secondary-foreground/70 truncate">{opp.lastMessage}</div>
            </div>
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}

