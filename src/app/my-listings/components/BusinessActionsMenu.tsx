'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Edit, Eye, MessageSquare, MoreHorizontal } from "lucide-react"

interface BusinessActionsMenuProps {
    businessId: string
    isFeatured: boolean
    onUpgrade: (id: string) => Promise<void>
}

export function BusinessActionsMenu({ businessId, isFeatured, onUpgrade }: BusinessActionsMenuProps) {
    return (
        <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-secondary h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => console.log("View", businessId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Edit", businessId)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    {!isFeatured && (
                        <DropdownMenuItem
                            onClick={() => onUpgrade(businessId)}
                            className="text-purple-600 focus:text-purple-600 focus:bg-purple-50"
                        >
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade to Premium
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => console.log("Messages", businessId)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
           
        </div>
    )
} 