'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface LanguageContextType {
  currentLanguage: string
  isReady: boolean
  setLanguage: (lang: string) => void
  translateElement: (element: HTMLElement) => void
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  isReady: false,
  setLanguage: () => {},
  translateElement: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isReady, setIsReady] = useState(false)

  // Update document direction based on language
  const updateDirection = (lang: string) => {
    const isRTL = lang === 'ar'
    
    // Update HTML element
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.classList.remove('rtl', 'ltr')
    document.documentElement.classList.add(isRTL ? 'rtl' : 'ltr')

    // Update all RTL-sensitive containers
    document.querySelectorAll('[data-rtl-container]').forEach(element => {
      if (element instanceof HTMLElement) {
        element.dir = isRTL ? 'rtl' : 'ltr'
        element.classList.remove('rtl', 'ltr')
        element.classList.add(isRTL ? 'rtl' : 'ltr')
      }
    })
  }

  // Initialize language from storage or default
  useEffect(() => {
    const initLanguage = () => {
      try {
        const storedLang = localStorage.getItem('selectedLanguage')
        const validLang = storedLang && ['en', 'ar'].includes(storedLang) ? storedLang : 'en'
        
        setCurrentLanguage(validLang)
        updateDirection(validLang)
        
        if (!storedLang || !['en', 'ar'].includes(storedLang)) {
          localStorage.setItem('selectedLanguage', validLang)
        }
      } catch (error) {
        console.error('Error initializing language:', error)
        setCurrentLanguage('en')
        updateDirection('en')
      }
      setIsReady(true)
    }

    initLanguage()
  }, [])

  // Add this new effect to handle page transitions
  useEffect(() => {
    if (window.Weglot && isReady) {
      const storedLang = localStorage.getItem('selectedLanguage')
      if (storedLang === 'ar') {
        // Re-apply Arabic translation on page change
        window.Weglot.switchTo('ar')
        updateDirection('ar')
      }
    }
  }, [pathname, isReady])

  // Modify the translation effect to run on pathname changes
  useEffect(() => {
    if (window.Weglot && isReady) {
      const translateContent = () => {
        try {
          // Force re-translation of the entire page
          window.Weglot.refresh()

          const translatableElements = document.querySelectorAll('[data-wg-translatable]')
          if (translatableElements.length === 0) return

          // Format elements according to Weglot's expected structure
          const elements = Array.from(translatableElements).map(element => ({
            element: element,
            text: element.textContent || '',
            translation: element.textContent || '',
            type: 'text',
            node: element
          }))

          if (elements.length > 0) {
            window.Weglot.translate({
              elements,
              language: currentLanguage,
              ignoredClasses: ['no-translate']
            }).catch(error => {
              console.warn('Translation error:', error)
            })
          }
        } catch (error) {
          console.warn('Error in translateContent:', error)
        }
      }

      // Run translation with a slight delay to ensure DOM is ready
      const timeoutId = setTimeout(translateContent, 200)

      return () => clearTimeout(timeoutId)
    }
  }, [currentLanguage, isReady, pathname])

  const setLanguage = (lang: string) => {
    if (window.Weglot) {
      try {
        // Update Weglot and local state
        window.Weglot.switchTo(lang)
        localStorage.setItem('selectedLanguage', lang)
        setCurrentLanguage(lang)
        updateDirection(lang)
        
        // Force reflow to ensure styles are applied
        const root = document.documentElement
        root.style.display = 'none'
        root.offsetHeight // Force reflow
        root.style.display = ''
      } catch (error) {
        console.error('Error switching language:', error)
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      isReady, 
      setLanguage,
      translateElement: () => {}
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext) 