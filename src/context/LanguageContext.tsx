import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language } from '@/types/language'

interface LanguageContextProps {
  language: Language
  setLanguage: (newLang: Language) => void
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('lang')
      return storedLang ? JSON.parse(storedLang) : { lang: 'eng', name: 'Eng' }
    }
    return { lang: 'eng', name: 'Eng' }
  }

  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lang') {
        setLanguageState(event.newValue ? JSON.parse(event.newValue) : { lang: 'eng', name: 'Eng' })
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    localStorage.setItem('lang', JSON.stringify(newLang))
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export { LanguageProvider, useLanguage }
