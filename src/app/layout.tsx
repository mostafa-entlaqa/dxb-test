import '@/app/globals.css'
import { Oswald, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/header'
import Footer from '@/components/footer'

const oswald = Oswald({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-sans-arabic',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} ${ibmPlexSansArabic.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
                <Header />
                <main className="flex-grow">{children}</main>
              </div>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

