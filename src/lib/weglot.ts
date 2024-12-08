import Weglot from 'weglot-js'

export const weglotInstance = new Weglot({
  api_key: process.env.NEXT_PUBLIC_WEGLOT_API_KEY,
  originalLanguage: 'en',
  destinationLanguages: ['ar'],
  cache: true
})

export const getCurrentLanguage = () => {
  if (typeof window === 'undefined') return 'en'
  return localStorage.getItem('selectedLanguage') || 'en'
}

export const setLanguage = (lang: string) => {
  localStorage.setItem('selectedLanguage', lang)
  weglotInstance.switchTo(lang)
} 