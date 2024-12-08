import '@/app/globals.css'
import '@/styles/rtl.css'
import { Oswald } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { LanguageProvider } from '@/contexts/language-context'
import { WeglotScript } from '@/components/weglot-script'

const oswald = Oswald({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
})

export const metadata = {
  title: 'SellBusiness.ae',
  description: 'Marketplace to buy & sell businesses in the UAE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${oswald.variable} font-sans`}>
        <WeglotScript />
        <LanguageProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
          >
            <div data-wg-translatable>
              <Header />
              {children}
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

