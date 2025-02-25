import { BusinessOpportunityHeader } from "./components/business-opportunity-header"
import { MessageThread } from "./components/message-thread"
import { Sidebar } from "./components/sidebar"

export default function DashboardPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <Sidebar className="w-64 border-r border-border" />
      <div className="flex flex-col flex-1">
        <BusinessOpportunityHeader className="border-b border-border" />
        <MessageThread className="flex-1" />
      </div>
    </div>
  )
}
