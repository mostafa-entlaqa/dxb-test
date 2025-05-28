import { getMessageRooms } from '@/actions/admin/messages'
import { MessagesTable } from './components/MessagesTable'

export default async function AdminMessagesPage() {
  const data = await getMessageRooms()
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Messages Rooms</h1>
      <MessagesTable data={data} />
    </div>
  )
} 