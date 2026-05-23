import logo from '../../assets/logo-256.png'
import { useI18n } from '../../providers/I18nProvider'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'

export function Footer() {
    const { t } = useI18n()

    return (
        <footer className="border-t border-border bg-surface">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
                <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="RindaNet" className="h-9 w-9 rounded-lg object-cover" />
                        <div>
                            <p className="text-base font-semibold text-text">{t('brand.name')}</p>
                            <p className="text-xs text-muted">{t('brand.tagline')}</p>
                        </div>
                    </div>
                    <p className="max-w-md text-sm text-muted">
                        RindaNet builds enterprise-grade VPN infrastructure for secure, high-speed, borderless internet access.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-text">{t('footer.product')}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                        <li>
                            <a href="#features" className="transition hover:text-text">
                                {t('nav.features')}
                            </a>
                        </li>
                        <li>
                            <a href="#pricing" className="transition hover:text-text">
                                {t('nav.pricing')}
                            </a>
                        </li>
                        <li>
                            <a href="#faq" className="transition hover:text-text">
                                {t('nav.faq')}
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-text">{t('footer.legal')}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                        <li>
                            <a href="#" className="transition hover:text-text">
                                {t('footer.privacy')}
                            </a>
                        </li>
                        <li>
                            <a href="#" className="transition hover:text-text">
                                {t('footer.terms')}
                            </a>
                        </li>
                    </ul>

                    <h3 className="mt-5 text-sm font-semibold text-text">{t('footer.company')}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                        <li>
                            <a href="https://x.com" className="transition hover:text-text">
                                X / Twitter
                            </a>
                        </li>
                        <li>
                            <a href="https://linkedin.com" className="transition hover:text-text">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com" className="transition hover:text-text">
                                GitHub
                            </a>
                        </li>
                    </ul>

                    <div className="mt-4">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>

            <div className="border-t border-border px-4 py-4 text-center text-xs text-muted sm:px-6 lg:px-8">
                © {new Date().getFullYear()} RindaNet. {t('footer.copyright')}
            </div>
        </footer>
    )
}
