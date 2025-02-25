import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InterestedBuyer {
  id: string
  name: string
  image: string
  status: "New" | "Qualified" | "Negotiation" | "Won" | "Lost"
  hasUnreadMessages: boolean
}

const interestedBuyers: InterestedBuyer[] = [
  { id: "1", name: "John Doe", image: "/placeholder.svg", status: "New", hasUnreadMessages: true },
  { id: "2", name: "Jane Smith", image: "/placeholder.svg", status: "Qualified", hasUnreadMessages: false },
  { id: "3", name: "Bob Johnson", image: "/placeholder.svg", status: "Negotiation", hasUnreadMessages: true },
  { id: "4", name: "Alice Brown", image: "/placeholder.svg", status: "Won", hasUnreadMessages: false },
  { id: "5", name: "Charlie Davis", image: "/placeholder.svg", status: "Lost", hasUnreadMessages: false },
]

const statusColors = {
  New: "bg-blue-500",
  Qualified: "bg-green-500",
  Negotiation: "bg-yellow-500",
  Won: "bg-purple-500",
  Lost: "bg-red-500",
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={`bg-muted h-[calc(100vh-4rem)] overflow-hidden ${className}`}>
      <Card className="m-4 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold">Business Info</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm">
          <p>
            <strong>Type:</strong> Coffee Shop
          </p>
          <p>
            <strong>Location:</strong> Dubai, UAE
          </p>
          <p>
            <strong>Established:</strong> 2015
          </p>
          <p>
            <strong>Revenue:</strong> $730,000/year
          </p>
        </CardContent>
      </Card>
      <div className="px-4 py-2 font-semibold">Interested Buyers</div>
      <ScrollArea className="h-[calc(100vh-250px)]">
        {interestedBuyers.map((buyer) => (
          <div key={buyer.id} className="flex items-center p-4 hover:bg-accent/50 transition-colors">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage src={buyer.image} alt={buyer.name} />
              <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium flex items-center">
                {buyer.name}
                {buyer.hasUnreadMessages && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>}
              </div>
              <Badge className={`${statusColors[buyer.status]} text-white`}>{buyer.status}</Badge>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

