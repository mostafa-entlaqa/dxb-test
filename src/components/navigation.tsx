'use client'

import Link from 'next/link'

interface NavigationProps {
  links: {
    href: string
    label: string
  }[]
}

export default function Navigation({ links }: NavigationProps) {
  return (
    <nav>
      <ul className="flex items-center gap-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
} 