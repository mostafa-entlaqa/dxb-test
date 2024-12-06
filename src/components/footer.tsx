'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function Footer() {
  const { t, language } = useLanguage()

  const footerLinks = [
    { href: '/', label: t("Home") },
    { href: '/about', label: t("About Us") },
    { href: '/buy', label: t("Buy a Business") },
    { href: '/sell', label: t("Sell a Business") },
    { href: '/contact', label: t("Contact Us") },
  ]

  return (
    <footer className="bg-background border-t text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className={cn(
            language === 'ar' ? 'text-right' : ''
          )}>
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="SellBusiness.ae"
                width={180}
                height={48}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className={cn(
              "text-lg text-muted-foreground",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {t("The Largest Business Marketplace in UAE")}
            </p>
          </div>

          {/* Quick Links */}
          <div className={cn(
            language === 'ar' ? 'text-right' : ''
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-4 text-foreground",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {t("Quick Links")}
            </h3>
            <ul className={cn(
              "space-y-2",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "text-lg text-muted-foreground hover:text-foreground transition-colors",
                      language === 'ar' ? 'font-arabic' : ''
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={cn(
            language === 'ar' ? 'text-right' : ''
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-4 text-foreground",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {t("Contact Info")}
            </h3>
            <ul className={cn(
              "space-y-2",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              <li className="text-lg text-muted-foreground">
                {t("Email")}: info@sellbusiness.ae
              </li>
              <li className="text-lg text-muted-foreground">
                {t("Phone")}: +971 4 123 4567
              </li>
              <li className="text-lg text-muted-foreground">
                {t("Address")}: {t("Dubai, UAE")}
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className={cn(
            language === 'ar' ? 'text-right' : ''
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-4 text-foreground",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              {t("Business Hours")}
            </h3>
            <ul className={cn(
              "space-y-2",
              language === 'ar' ? 'font-arabic' : ''
            )}>
              <li className="text-lg text-muted-foreground">
                {t("Monday - Friday")}: 9:00 AM - 6:00 PM
              </li>
              <li className="text-lg text-muted-foreground">
                {t("Saturday")}: 10:00 AM - 2:00 PM
              </li>
              <li className="text-lg text-muted-foreground">
                {t("Sunday")}: {t("Closed")}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={cn(
          "mt-8 border-t pt-8 text-center",
          language === 'ar' ? 'font-arabic' : ''
        )}>
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} SellBusiness.ae. {t("All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  )
}

