import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import logo from '../../assets/logo-256.png'
import { useI18n } from '../../providers/I18nProvider'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { ThemeToggle } from '../ui/ThemeToggle'

const navItemClass = 'text-sm font-medium text-muted transition hover:text-text'

export function Navbar() {
    const { t } = useI18n()
    const [open, setOpen] = useState(false)

    const items = [
        { href: '#features', label: t('nav.features') },
        { href: '#network', label: t('nav.map') },
        { href: '#pricing', label: t('nav.pricing') },
        { href: '#faq', label: t('nav.faq') },
    ]

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-bg backdrop-blur-xl">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <a href="#top" className="flex items-center gap-3">
                    <img src={logo} alt="RindaNet logo" className="h-8 w-8 rounded-lg object-cover" />
                    <div>
                        <p className="text-sm font-semibold text-text">{t('brand.name')}</p>
                        <p className="text-xs text-muted">{t('brand.tagline')}</p>
                    </div>
                </a>

                <div className="hidden items-center gap-7 md:flex">
                    {items.map((item) => (
                        <a key={item.href} href={item.href} className={navItemClass}>
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <LanguageSwitcher compact />
                    <ThemeToggle />
                    <a
                        href="#pricing"
                        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-strong"
                    >
                        {t('nav.getStarted')}
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="inline-flex rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold text-text md:hidden"
                    aria-label={open ? t('common.close') : t('common.menu')}
                    aria-expanded={open}
                >
                    {open ? t('common.close') : t('common.menu')}
                </button>
            </nav>

            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border bg-bg px-4 py-5 md:hidden"
                    >
                        <div className="mx-auto flex max-w-7xl flex-col gap-4">
                            {items.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="text-sm font-medium text-text"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="flex items-center justify-between gap-2">
                                <LanguageSwitcher compact />
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </header>
    )
}
