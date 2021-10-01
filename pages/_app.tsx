import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-ocean.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
