'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import * as Icons from "lucide-react"

interface DashboardNavProps {
    items: {
        title: string
        href: string
        icon: keyof typeof Icons
        variant: "default" | "ghost"
    }[]
}

export function DashboardNav({ items }: DashboardNavProps) {
    const pathname = usePathname()

    if (!items?.length) {
        return null
    }

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                // Get the base path without /dashboard prefix
                const basePathname = pathname.replace("/dashboard", "")
                const isActive = item.href === "/"
                    ? basePathname === "/"
                    : basePathname.startsWith(item.href)

                const Icon = Icons[item.icon]

                return (
                    <Link
                        key={index}
                        href={`/dashboard${item.href}`}
                        className={cn(
                            buttonVariants({ variant: isActive ? "default" : "ghost" }),
                            "justify-start"
                        )}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    )
} 