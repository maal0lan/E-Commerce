import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectTheme } from '../features/theme/themeSlice'

const ThemeSync = () => {
  const theme = useSelector(selectTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = resolvedTheme
    }

    applyTheme()

    if (theme === 'system') {
      media.addEventListener('change', applyTheme)
      return () => media.removeEventListener('change', applyTheme)
    }

    return undefined
  }, [theme])

  return null
}

export default ThemeSync
