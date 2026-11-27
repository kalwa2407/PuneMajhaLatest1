'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, getTranslation, languageOptions } from '@/lib/translations'
import { siteConfig } from '@/lib/siteConfig'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('hi')

  useEffect(() => {
    const savedLang =
      localStorage.getItem(siteConfig.storageKeys.language) ||
      localStorage.getItem(siteConfig.storageKeys.legacyLanguage)
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang)
    }
  }, [])

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang)
      localStorage.setItem(siteConfig.storageKeys.language, newLang)
    }
  }

  const t = (key) => getTranslation(language, key)

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languageOptions }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: 'hi',
      changeLanguage: () => {},
      t: (key) => getTranslation('hi', key),
      languageOptions,
    }
  }
  return context
}

export default LanguageContext
