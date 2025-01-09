// React Imports
import { Fragment, ReactNode } from 'react'

// Next Imports
import type { NextPage } from 'next'
import { Router } from 'next/router'
import type { AppProps } from 'next/app'
import Head from 'next/head'

// Next-i18next
import { appWithTranslation } from 'next-i18next'

// Loader Import
import NProgress from 'nprogress'
import NextNProgress from 'nextjs-progressbar'

// Config Imports
import themeConfig from '@/configs/themeConfig'
import BlankLayoutWithSidebar from '@/components/layout/BlankLayoutWithSidebar'
import { store } from '@/store'
import { Provider } from 'react-redux'
import GuestGuard from '@/components/auth/GuestGuard'
import AuthGuard from '@/components/auth/AuthGuard'
import ThemeComponent from '@/components/ThemeComponent'
import WindowWrapper from '@/components/window-wrapper'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import Loading from '@/components/Loading'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/languages/i18n'

// Css
import 'react-toastify/dist/ReactToastify.css'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '@/styles/globals.scss'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

// Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<h1>Loading1</h1>}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <Fragment>{children}</Fragment>
  } else {
    return <AuthGuard fallback={<h1>Loading2</h1>}>{children}</AuthGuard>
  }
}

// Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, pageProps } = props

  // Variables
  // const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <BlankLayoutWithSidebar>{page}</BlankLayoutWithSidebar>)

  // const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  return (
    <Provider store={store}>
      <Head>
        <title>List</title>
        <meta name='description' />
        <link rel='icon' href='/logo/logo.png' />
        <meta name='keywords' content='List, list, ...' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <meta name='application-name' content='List' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='List' />
        <meta name='description' content='The Best List App in the world' />
        {/* <link rel='manifest' href='./manifest.json' /> */}
      </Head>

      <LanguageProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ThemeComponent>
              <WindowWrapper>
                <Guard authGuard={authGuard} guestGuard={guestGuard}>
                  <NextNProgress color={themeConfig.themeColor} />
                  {getLayout(<Component {...pageProps} />)}
                </Guard>
              </WindowWrapper>
            </ThemeComponent>
          </AuthProvider>
        </I18nextProvider>
      </LanguageProvider>
    </Provider>
  )
}

export default appWithTranslation(App)
