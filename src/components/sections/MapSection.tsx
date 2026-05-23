import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { SectionHeading } from '../ui/SectionHeading'

const nodes = [
    { top: '20%', left: '14%', color: 'bg-primary' },
    { top: '30%', left: '35%', color: 'bg-status-connected' },
    { top: '55%', left: '52%', color: 'bg-accent' },
    { top: '36%', left: '70%', color: 'bg-primary' },
    { top: '64%', left: '80%', color: 'bg-status-connected' },
]

export function MapSection() {
    const { t } = useI18n()

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8" id="network">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('map.title')} subtitle={t('map.desc')} />

                <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="relative min-h-[300px] overflow-hidden rounded-3xl border border-border bg-surface p-6"
                    >
                        <div className="absolute inset-0 bg-map-pattern opacity-30" />
                        <div className="map-overlay absolute inset-0" />
                        {nodes.map((node, index) => (
                            <motion.span
                                key={`${node.left}-${node.top}`}
                                className={`absolute h-4 w-4 rounded-full ${node.color}`}
                                style={{ top: node.top, left: node.left }}
                                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.2 + index * 0.2 }}
                            />
                        ))}

                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                            <path d="M14 12 C30 20, 35 18, 52 34" stroke="var(--color-primary)" strokeWidth="0.45" fill="none" />
                            <path d="M35 18 C42 12, 57 15, 70 21" stroke="var(--color-accent)" strokeWidth="0.45" fill="none" />
                            <path d="M52 34 C62 38, 71 36, 80 42" stroke="var(--color-primary)" strokeWidth="0.45" fill="none" />
                        </svg>
                    </motion.div>

                    <motion.aside
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid gap-4"
                    >
                        <div className="glass-card rounded-2xl p-5">
                            <p className="text-xs uppercase tracking-wider text-muted">{t('map.online')}</p>
                            <p className="mt-2 text-3xl font-semibold text-text">120+</p>
                        </div>
                        <div className="glass-card rounded-2xl p-5">
                            <p className="text-xs uppercase tracking-wider text-muted">{t('map.uptime')}</p>
                            <p className="mt-2 text-3xl font-semibold text-text">99.99%</p>
                        </div>
                        <div className="glass-card rounded-2xl p-5">
                            <p className="text-xs uppercase tracking-wider text-muted">SLA</p>
                            <p className="mt-2 text-3xl font-semibold text-text">24/7</p>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </section>
    )
}
