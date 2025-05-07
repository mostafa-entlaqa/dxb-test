import type { ReactNode } from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}
      <div className="flex w-full">
        <Sidebar className="w-64" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
