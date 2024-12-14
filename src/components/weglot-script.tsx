'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function WeglotScript() {
  useEffect(() => {
    const initializeWeglot = () => {
      try {
        if (!window.Weglot) return

        window.Weglot.initialize({
          api_key: 'wg_f648b9aa8dc0a5d8a2d23bb0d2f0f4762',
          originalLanguage: 'en',
          destinationLanguages: ['ar'],
          cache: true,
          hideLanguageSwitcher: true,
          autoSwitch: false,
          translateElements: '[data-wg-translatable]',
          languageBehavior: {
            ar: {
              direction: 'rtl'
            }
          },
          pageReady: () => {
            const storedLang = localStorage.getItem('selectedLanguage')
            if (storedLang === 'ar') {
              window.Weglot?.switchTo('ar')
            }
          }
        })

        console.log('Weglot initialized successfully')
      } catch (error) {
        console.error('Error initializing Weglot:', error)
      }
    }

    if (window.Weglot) {
      initializeWeglot()
    } else {
      const interval = setInterval(() => {
        if (window.Weglot) {
          initializeWeglot()
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <Script 
      src="https://cdn.weglot.com/weglot.min.js"
      strategy="afterInteractive"
    />
  )
} 