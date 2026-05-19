import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'dark' | 'light'

type ThemeContextValue = {
    theme: Theme
    toggleTheme: () => void
}

const STORAGE_KEY = 'rindanet-theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'dark'
    }

    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
        return saved
    }

    return getSystemTheme()
}

type ThemeProviderProps = {
    children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        window.localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')

        const onChange = () => {
            const saved = window.localStorage.getItem(STORAGE_KEY)
            if (!saved) {
                setTheme(getSystemTheme())
            }
        }

        mediaQuery.addEventListener('change', onChange)

        return () => {
            mediaQuery.removeEventListener('change', onChange)
        }
    }, [])

    const value = useMemo(
        () => ({
            theme,
            toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
        }),
        [theme],
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }

    return context
}
