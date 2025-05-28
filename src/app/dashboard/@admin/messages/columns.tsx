import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

export type MessageRoom = {
  room_id: string
  business_id: string
  business_name: string
  seller: {
    id: string
    full_name: string
    profile_pic_url?: string
  } | null
  buyer: {
    id: string
    full_name: string
    profile_pic_url?: string
  } | null
  last_message: string
  last_date: string
}

function UserCell({ user }: { user: MessageRoom["seller"] }) {
  if (!user) return <span className="text-muted-foreground">Unknown</span>
  return (
    <div className="flex items-center gap-2">
      {user.profile_pic_url ? (
        <Image src={user.profile_pic_url} alt={user.full_name} width={32} height={32} className="rounded-full w-8 h-8 object-cover" />
      ) : (
        <span className="inline-block w-8 h-8 rounded-full bg-gray-200" />
      )}
      <span>{user.full_name}</span>
    </div>
  )
}

export const columns: ColumnDef<MessageRoom>[] = [
  {
    accessorKey: "business_name",
    header: "Business Name",
  },
  {
    accessorKey: "seller",
    header: "Seller",
    cell: ({ row }) => <UserCell user={row.original.seller} />,
  },
  {
    accessorKey: "buyer",
    header: "Buyer",
    cell: ({ row }) => <UserCell user={row.original.buyer} />,
  },
  {
    accessorKey: "last_message",
    header: "Last Message",
    cell: ({ row }) => {
      const msg = row.getValue("last_message") as string
      return <span className="truncate max-w-[200px]" title={msg}>{msg}</span>
    },
  },
  {
    accessorKey: "last_date",
    header: "Last Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const room = row.original
      return (
        <div className="flex gap-2 items-center">
          <a href={`/dashboard/messages/${room.business_id}?sender=${room.seller?.id}&receiver=${room.buyer?.id}`} className="text-blue-600 underline">View Room</a>
          <button
            className="ml-2 text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => navigator.clipboard.writeText(room.room_id)}
            title="Copy Room ID"
          >
            Copy Room ID
          </button>
        </div>
      )
    },
  },
] 