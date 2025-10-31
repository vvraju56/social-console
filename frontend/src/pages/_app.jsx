import '../styles/globals.css'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const t = saved || 'dark'
    setTheme(t)
    if (t === 'dark') document.documentElement.classList.add('dark')
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
