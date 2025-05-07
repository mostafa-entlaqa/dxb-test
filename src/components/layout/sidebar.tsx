"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Building,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Users,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("hidden border-r bg-background lg:block min-h-screen", className)}>
      <div className="flex h-full max-h-screen flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex h-16 items-center border-b px-4 lg:h-[70px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <Image src="/logo.png" width={100} height={100} alt="Logo" />
              
            </Link>
          </div>
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="flex flex-col gap-2">
              <div className="text-xs text-muted-foreground mb-2 mt-2">Main</div>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/business"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/dashboard/business" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <Building className="h-4 w-4" />
                Business
              </Link>
              <Link
                href="/dashboard/users"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/dashboard/users" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link
                href="/dashboard/invoices"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/dashboard/invoices" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <CreditCard className="h-4 w-4" />
                Invoices
              </Link>
            </nav>
          </ScrollArea>
        </div>
        {/* Footer */}
        {/* <div className="border-t p-4">
          <Button variant="ghost" className="w-full flex justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            &copy; {new Date().getFullYear()} Sell Business
          </div>
        </div> */}
      </div>
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <Sidebar className="border-0" />
      </SheetContent>
    </Sheet>
  )
}
