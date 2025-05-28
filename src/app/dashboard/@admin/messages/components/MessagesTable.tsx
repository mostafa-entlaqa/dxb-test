'use client'

import { DataTable } from '@/components/data-table'
import { columns, MessageRoom } from '../columns'
import { FilterMessagesTable } from './FilterMessagesTable'

interface MessagesTableProps {
  data: MessageRoom[]
}

export function MessagesTable({ data }: MessagesTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      renderToolbar={(table) => <FilterMessagesTable table={table} />}
      tableName="messages-rooms"
    />
  )
} 