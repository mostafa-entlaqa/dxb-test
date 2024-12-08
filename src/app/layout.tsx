import '@/app/globals.css'
import { Oswald } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/header'
import Footer from '@/components/footer'

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} font-sans`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="theme-preference"
        >
          <div className="flex flex-col min-h-screen">
            <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
              <Header />
              <main className="flex-grow">{children}</main>
            </div>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

