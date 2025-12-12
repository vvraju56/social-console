import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    setIsDark(saved === 'dark')
  }, [])
  const toggle = () => {
    const d = !isDark
    setIsDark(d)
    const theme = d ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', d)
  }
  return (
    <button onClick={toggle} className="px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-sm">
      {isDark ? 'Dark' : 'Light'} mode
    </button>
  )
}
