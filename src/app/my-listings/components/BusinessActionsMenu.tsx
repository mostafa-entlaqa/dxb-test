'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getClientSupabase } from "@/lib/supabase/client"
import { getSupabase } from "@/utils/supabase-client"
import { Crown, Edit, Eye, MessageSquare, MoreHorizontal, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from '@/hooks/use-toast'; // Adjust the import based on your setup
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BusinessActionsMenuProps {
    businessId: string
    isFeatured: boolean
    onUpgrade: (id: string) => Promise<void>
    ApproveStatus: string
}

export function BusinessActionsMenu({ businessId, isFeatured, onUpgrade, ApproveStatus }: BusinessActionsMenuProps) {
    const router = useRouter()

    const handleClose = async () => {
        // Validate the businessId
        if (!businessId) {
            toast({
                title: "Error",
                description: "Business ID is required",
                variant: "destructive"
            });
            return;
        }
        const supabase = getClientSupabase()
        // Update the approve_status to 'close'
        const { data, error } = await supabase
            .from('businesses') // Adjust the table name if necessary
            .update({ approve_status: 'close' })
            .eq('id', businessId);

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
            return;
        }

        // Optionally, you can refresh the data or update the UI here
        toast({
            title: "Success",
            description: "Business closed successfully.",
            variant: "default"
        });

        window.location.reload()


    };

    return (
        <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-secondary h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/buy/${businessId}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/edit/${businessId}`)}>
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
                    <DropdownMenuItem onClick={() => router.push(`/messages/${businessId}`)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                    </DropdownMenuItem>
                    {ApproveStatus !== "close" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} // Prevents closing the menu
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Close Business
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently close your business.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClose}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}