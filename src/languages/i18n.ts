// i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ru, eng, uz } from '.'

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    eng: { translation: eng },
  },
  lng:
    (typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem('lang')!)?.lang) ??
    'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
})

export default i18n
