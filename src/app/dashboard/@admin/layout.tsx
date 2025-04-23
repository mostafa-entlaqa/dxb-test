'use client'
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex overflow-hidden">
            {/* Desktop Sidebar */}
            {/* <Sidebar className="hidden lg:block" /> */}

            <div className="flex-1 overflow-y-auto">
                <div className="">
                    {/* Mobile Sidebar */}
                    <MobileSidebar />
                </div>

                <main className="flex-1 space-y-4 p-4 pt-6">
                    {children}
                </main>
            </div>
        </div>
    )
} 