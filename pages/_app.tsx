import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import reportWebVitals from '@/lib/reportWebVitals'

// Start measuring performance
reportWebVitals()

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}