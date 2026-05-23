import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'

export function HeroSection() {
    const { t } = useI18n()

    return (
        <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8" id="top">
            <div className="hero-glow hero-glow-top" />
            <div className="hero-glow hero-glow-side" />

            <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="space-y-7"
                >
                    <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                        {t('brand.tagline')}
                    </span>
                    <h1 className="text-balance text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
                        {t('hero.headline')}
                    </h1>
                    <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">{t('hero.subtext')}</p>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="#pricing"
                            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-strong"
                        >
                            {t('hero.getStarted')}
                        </a>
                        <a
                            href="#platforms"
                            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-text transition hover:border-primary"
                        >
                            {t('hero.download')}
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.12 }}
                    className="rounded-3xl border border-border bg-surface p-5 shadow-soft backdrop-blur"
                >
                    <div className="rounded-2xl border border-border bg-bg p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-text">{t('hero.statusTitle')}</h3>
                            <span className="inline-flex items-center gap-2 rounded-full border border-status-connected bg-surface px-3 py-1 text-xs font-semibold text-status-connected">
                                <span className="status-dot" aria-hidden="true" />
                                {t('hero.status')}
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="glass-card rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-muted">{t('hero.server')}</p>
                                <p className="mt-2 text-lg font-semibold text-text">CN-SH → SG-01</p>
                            </div>
                            <div className="glass-card rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-muted">{t('hero.latency')}</p>
                                <p className="mt-2 text-lg font-semibold text-text">28ms</p>
                            </div>
                            <div className="glass-card rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-muted">{t('hero.speed')}</p>
                                <p className="mt-2 text-lg font-semibold text-text">1.8Gbps</p>
                            </div>
                            <div className="glass-card rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-muted">Tunnel</p>
                                <p className="mt-2 text-lg font-semibold text-text">WireGuard</p>
                            </div>
                        </div>

                        <motion.div
                            animate={{ opacity: [0.55, 1, 0.55] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.8 }}
                            className="mt-4 rounded-xl border border-status-connected bg-surface px-4 py-3 text-sm text-status-connected"
                        >
                            {t('hero.shield')}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
