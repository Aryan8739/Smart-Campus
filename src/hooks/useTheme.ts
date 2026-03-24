import { useEffect, useState } from 'react'

function getInitialTheme() {
  const storedTheme = window.localStorage.getItem('theme')
  return storedTheme === 'dark'
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((previous) => !previous)
  }

  return { isDark, toggleTheme }
}
