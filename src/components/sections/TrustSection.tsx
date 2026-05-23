import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { NoLogsIcon, ServerIcon, ShieldIcon, SpeedIcon } from '../ui/icons'
import { SectionHeading } from '../ui/SectionHeading'

const iconWrapClass = 'grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-primary'

export function TrustSection() {
    const { t } = useI18n()

    const cards = [
        {
            key: 'encryption',
            icon: <ShieldIcon className="h-5 w-5" />,
        },
        {
            key: 'servers',
            icon: <ServerIcon className="h-5 w-5" />,
        },
        {
            key: 'nologs',
            icon: <NoLogsIcon className="h-5 w-5" />,
        },
        {
            key: 'performance',
            icon: <SpeedIcon className="h-5 w-5" />,
        },
    ]

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('trust.title')} />

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card, index) => (
                        <motion.article
                            key={card.key}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <div className={iconWrapClass}>{card.icon}</div>
                            <h3 className="mt-4 text-base font-semibold text-text">{t(`trust.items.${card.key}.title`)}</h3>
                            <p className="mt-2 text-sm text-muted">{t(`trust.items.${card.key}.desc`)}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
