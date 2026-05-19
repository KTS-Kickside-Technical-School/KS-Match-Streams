import { useI18n } from '../../providers/I18nProvider'
import type { Locale } from '../../types/i18n'

const options: { label: string; value: Locale }[] = [
    { label: 'EN', value: 'en' },
    { label: '简中', value: 'zh-CN' },
    { label: 'FR', value: 'fr' },
]

type LanguageSwitcherProps = {
    compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
    const { locale, setLocale } = useI18n()

    return (
        <div className={`inline-flex rounded-full border border-border bg-surface p-1 ${compact ? '' : 'shadow-soft'}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => setLocale(option.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${locale === option.value ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-text'
                        }`}
                    aria-label={`Switch language to ${option.label}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
