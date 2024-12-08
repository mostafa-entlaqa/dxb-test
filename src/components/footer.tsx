'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const footerLinks = [
    { href: '/', label: "Home" },
    { href: '/about', label: "About Us" },
    { href: '/buy', label: "Buy a Business" },
    { href: '/sell', label: "Sell a Business" },
    { href: '/contact', label: "Contact Us" },
  ]

  return (
    <footer className="bg-background border-t text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="SellBusiness.ae"
                width={180}
                height={48}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-lg text-muted-foreground">
              The Largest Business Marketplace in UAE
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Contact Info
            </h3>
            <ul className="space-y-2">
              <li className="text-lg text-muted-foreground">
                Email: info@sellbusiness.ae
              </li>
              <li className="text-lg text-muted-foreground">
                Phone: +971 4 123 4567
              </li>
              <li className="text-lg text-muted-foreground">
                Address: Dubai, UAE
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Business Hours
            </h3>
            <ul className="space-y-2">
              <li className="text-lg text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM
              </li>
              <li className="text-lg text-muted-foreground">
                Saturday: 10:00 AM - 2:00 PM
              </li>
              <li className="text-lg text-muted-foreground">
                Sunday: Closed
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} SellBusiness.ae. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

