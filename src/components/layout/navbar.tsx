"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Bell, ChevronDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileSidebar } from "@/components/layout/sidebar"

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname()

  // Function to get the current page title based on the pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/users" || pathname.startsWith("/users/")) return "Users Management"
    if (pathname.startsWith("/transactions/")) {
      const status = pathname.split("/").pop()
      return `Transactions - ${status?.charAt(0).toUpperCase()}${status?.slice(1)}`
    }
    if (pathname.startsWith("/business/")) {
      const status = pathname.split("/").pop()
      return `Business - ${status?.charAt(0).toUpperCase()}${status?.slice(1)}`
    }
    if (pathname === "/analytics") return "Analytics"
    if (pathname === "/settings") return "Settings"
    return "Admin Portal"
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6",
        className,
      )}
    >
      <MobileSidebar />

      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:justify-end">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-48 rounded-lg bg-background pl-8 md:w-64 lg:w-80" />
        </form>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>New user registration</DropdownMenuItem>
          <DropdownMenuItem>5 pending transactions</DropdownMenuItem>
          <DropdownMenuItem>3 business approvals waiting</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-sm font-normal">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline-flex">Admin User</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
