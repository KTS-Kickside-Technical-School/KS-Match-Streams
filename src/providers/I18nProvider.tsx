import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import zhCN from '../locales/zh-CN.json'
import type { Locale, TranslationTree } from '../types/i18n'

type I18nContextValue = {
    locale: Locale
    setLocale: (value: Locale) => void
    t: (key: string) => string
}

const dictionaries: Record<Locale, TranslationTree> = {
    en: en as TranslationTree,
    'zh-CN': zhCN as TranslationTree,
    fr: fr as TranslationTree,
}

const STORAGE_KEY = 'rindanet-locale'

const I18nContext = createContext<I18nContextValue | null>(null)

const getInitialLocale = (): Locale => {
    if (typeof window === 'undefined') {
        return 'en'
    }

    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh-CN' || saved === 'fr') {
        return saved
    }

    return 'en'
}

const getValueByPath = (tree: TranslationTree, path: string): string | undefined => {
    const segments = path.split('.')
    let current: string | TranslationTree = tree

    for (const segment of segments) {
        if (typeof current === 'string') {
            return undefined
        }

        current = current[segment]
        if (current === undefined) {
            return undefined
        }
    }

    return typeof current === 'string' ? current : undefined
}

type I18nProviderProps = {
    children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [locale, setLocale] = useState<Locale>(getInitialLocale)

    useEffect(() => {
        document.documentElement.lang = locale
        window.localStorage.setItem(STORAGE_KEY, locale)
    }, [locale])

    const value = useMemo(
        () => ({
            locale,
            setLocale,
            t: (key: string) => getValueByPath(dictionaries[locale], key) ?? key,
        }),
        [locale],
    )

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
    const context = useContext(I18nContext)

    if (!context) {
        throw new Error('useI18n must be used within I18nProvider')
    }

    return context
}
