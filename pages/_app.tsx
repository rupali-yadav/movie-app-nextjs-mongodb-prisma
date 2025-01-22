import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ProfileProvider } from '@/src/context/profileContext';
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps?.session}>
      <ProfileProvider>
        <Component {...pageProps} />
      </ProfileProvider>
    </SessionProvider>
  )
}
