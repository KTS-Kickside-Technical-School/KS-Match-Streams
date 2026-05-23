import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { BoltIcon, ChinaNodeIcon, DevicesIcon, PlayIcon, RouteIcon, SwitchIcon } from '../ui/icons'
import { SectionHeading } from '../ui/SectionHeading'

export function FeaturesSection() {
    const { t } = useI18n()

    const features = [
        { key: 'fast', icon: <BoltIcon className="h-5 w-5" /> },
        { key: 'kill', icon: <SwitchIcon className="h-5 w-5" /> },
        { key: 'multi', icon: <DevicesIcon className="h-5 w-5" /> },
        { key: 'routing', icon: <RouteIcon className="h-5 w-5" /> },
        { key: 'china', icon: <ChinaNodeIcon className="h-5 w-5" /> },
        { key: 'streaming', icon: <PlayIcon className="h-5 w-5" /> },
    ]

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8" id="features">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('features.title')} />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.28, delay: index * 0.06 }}
                            className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-primary"
                        >
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-primary">
                                {feature.icon}
                            </div>
                            <h3 className="text-base font-semibold text-text">{t(`features.items.${feature.key}`)}</h3>
                            <p className="mt-2 text-sm text-muted">
                                Enterprise-ready protection tuned for modern workloads and demanding network routes.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
