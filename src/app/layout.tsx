import '@/app/globals.css'
import '@/styles/rtl.css'
import { Oswald } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster as ShadcnToaster } from '@/components/ui/toaster'
import { Toaster } from 'sonner'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { LanguageProvider } from '@/contexts/language-context'
import { WeglotScript } from '@/components/weglot-script'
import NextTopLoader from 'nextjs-toploader'

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
      <body className={`${oswald.variable} font-sans flex flex-col min-h-screen`}>
        <NextTopLoader 
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <WeglotScript />
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <div className="flex flex-col min-h-screen" data-wg-translatable>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ShadcnToaster />
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
