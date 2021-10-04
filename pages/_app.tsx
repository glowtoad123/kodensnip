import type { AppProps } from 'next/app'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-ocean.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
