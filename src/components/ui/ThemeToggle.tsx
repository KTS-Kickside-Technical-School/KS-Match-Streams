import { useTheme } from '../../providers/ThemeProvider'
import { useI18n } from '../../providers/I18nProvider'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const { t } = useI18n()

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-text transition hover:border-primary hover:bg-surface"
        >
            <span
                className={`h-2.5 w-2.5 rounded-full ${theme === 'dark' ? 'bg-status-connecting' : 'bg-primary'}`}
                aria-hidden="true"
            />
            {theme === 'dark' ? t('common.dark') : t('common.light')}
        </button>
    )
}
