'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

const footerLinks = [
  { href: '/', label: "Home" },
  { href: '/about', label: "About Us" },
  { href: '/buy', label: "Buy a Business" },
  { href: '/sell', label: "Sell a Business" },
  { href: '/contact', label: "Contact Us" },
]

export default function Footer() {
  const pathname = usePathname()

  // Hide footer if the pathname starts with "/messages/"
  if (pathname.startsWith('/messages/')) {
    return null
  }

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="SellBusiness.ae"
              width={180}
              height={48}
              className="h-12 w-auto object-contain"
            />
            <p className="text-muted-foreground">
              The Largest Business Marketplace in UAE
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {footerLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <p className="text-muted-foreground">
                  1912, Park Lane Tower,<br />
                  Business Bay, Dubai, UAE<br />
                  (Marca LLC)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <a 
                  href="tel:+971507510669"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +971 50 751 0669
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  support (at) sellbusiness.ae
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SellBusiness.ae. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
