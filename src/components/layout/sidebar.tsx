"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Building,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("hidden border-r bg-background lg:block", className)}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>Admin Portal</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4 py-2">
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="dashboard/users"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/users" || pathname.startsWith("/users/")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 flex flex-col gap-1">
                <Link
                  href="dashboard/transactions/pending"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/transactions/pending" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Pending
                </Link>
                <Link
                  href="dashboard/transactions/approved"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "dashboard/transactions/approved"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Approved
                </Link>
                <Link
                  href="dashboard/transactions/rejected"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "dashboard/transactions/rejected"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Rejected
                </Link>
                <Link
                  href="dashboard/transactions/cancelled"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "dashboard/transactions/cancelled"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Cancelled
                </Link>
                <Link
                  href="dashboard/transactions/closed"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "dashboard/transactions/closed" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Closed
                </Link>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4" />
                  Business
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 flex flex-col gap-1">
                <Link
                  href="/business/pending"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/business/pending" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Pending
                </Link>
                <Link
                  href="/business/approved"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/business/approved" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Approved
                </Link>
                <Link
                  href="/business/rejected"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/business/rejected" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Rejected
                </Link>
                <Link
                  href="/business/cancelled"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/business/cancelled" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Cancelled
                </Link>
                <Link
                  href="/business/closed"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/business/closed" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  Closed
                </Link>
              </CollapsibleContent>
            </Collapsible>
            <Link
              href="/analytics"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/analytics" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </ScrollArea>
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
