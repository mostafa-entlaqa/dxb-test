'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, LogOut, LayoutDashboard, UserCircle, KeyRound, Briefcase } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface UserMenuProps {
  user: {
    id: string
    email?: string
    full_name?: string
    profile_pic_url?: string
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.profile_pic_url || ''} />
          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name || 'User'}</p>
            <p className="text-xs leading-none text-gray-500">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="cursor-pointer flex items-center"
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className="cursor-pointer flex items-center"
        >
          <UserCircle className="h-4 w-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/settings/password')}
          className="cursor-pointer flex items-center"
        >
          <KeyRound className="h-4 w-4 mr-2" />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/my-listings')}
          className="cursor-pointer flex items-center"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          My Business Listings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 flex items-center"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 