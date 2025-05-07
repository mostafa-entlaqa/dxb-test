'use client'

interface UserLayoutProps {
    children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <main className="flex-1 space-y-4 p-4 pt-6">
                    {children}
                </main>
            </div>
        </div>
    )
} 