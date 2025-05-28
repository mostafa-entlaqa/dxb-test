'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Table } from '@tanstack/react-table'
import { MessageRoom } from '../columns'

interface FilterMessagesTableProps {
  table: Table<MessageRoom>
}

export function FilterMessagesTable({ table }: FilterMessagesTableProps) {
  return (
    <div className="flex w-full md:items-center flex-col md:flex-row md:justify-between mb-6 gap-2">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search business name..."
            value={(table.getColumn('business_name')?.getFilterValue() as string) ?? ''}
            onChange={event => table.getColumn('business_name')?.setFilterValue(event.target.value)}
            className="pl-8 w-[220px]"
          />
        </div>
        <Input
          placeholder="Search User 1 ID..."
          value={(table.getColumn('user1_id')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('user1_id')?.setFilterValue(event.target.value)}
          className="w-[180px]"
        />
        <Input
          placeholder="Search User 2 ID..."
          value={(table.getColumn('user2_id')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('user2_id')?.setFilterValue(event.target.value)}
          className="w-[180px]"
        />
      </div>
    </div>
  )
} 