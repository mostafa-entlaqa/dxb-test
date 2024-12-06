'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Facebook, Twitter, LinkedinIcon as LinkedIn, Instagram } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-background border-t text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="SellBusiness.ae"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className={`text-lg text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t("The Largest Business Marketplace in UAE")}
            </p>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Quick Links")}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className={`text-lg text-muted-foreground hover:text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Home")}</Link></li>
              <li><Link href="/about" className={`text-lg text-muted-foreground hover:text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("About Us")}</Link></li>
              <li><Link href="/buy" className={`text-lg text-muted-foreground hover:text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Buy a Business")}</Link></li>
              <li><Link href="/sell" className={`text-lg text-muted-foreground hover:text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Sell a Business")}</Link></li>
              <li><Link href="/contact" className={`text-lg text-muted-foreground hover:text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Contact Us")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Newsletter")}</h3>
            <form className="space-y-2">
              <Input type="email" placeholder={t("Enter your email")} className={language === 'ar' ? 'font-arabic text-right' : ''} />
              <Button type="submit" className={language === 'ar' ? 'font-arabic' : ''}>{t("Subscribe")}</Button>
            </form>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 text-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>{t("Follow Us")}</h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <LinkedIn />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
            &copy; 2023 SellBusiness.ae. {t("All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  )
}

