export interface WeglotInstance {
  initialize: (config: {
    api_key: string
    originalLanguage: string
    destinationLanguages: string[]
    cache?: boolean
    hideLanguageSwitcher?: boolean
    autoSwitch?: boolean
    translateElements?: string
    languageBehavior?: {
      [key: string]: {
        direction: 'rtl' | 'ltr'
      }
    }
    pageReady?: () => void
  }) => void
  switchTo: (lang: string) => void
  refresh: () => void
  translate: (options: {
    elements: Array<{
      element: Element
      text: string
      translation: string
      type: string
      node: Element
    }>
    language: string
    ignoredClasses?: string[]
  }) => Promise<void>
}

declare global {
  interface Window {
    Weglot?: WeglotInstance
  }
}

export {} 