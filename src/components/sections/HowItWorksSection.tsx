import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { SectionHeading } from '../ui/SectionHeading'

export function HowItWorksSection() {
    const { t } = useI18n()

    const steps = [
        { key: 'step1', number: '01' },
        { key: 'step2', number: '02' },
        { key: 'step3', number: '03' },
    ]

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('how.title')} />

                <div className="grid gap-5 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <motion.article
                            key={step.key}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            className="rounded-2xl border border-border bg-surface p-6"
                        >
                            <p className="text-xs font-semibold tracking-widest text-primary">{step.number}</p>
                            <h3 className="mt-3 text-lg font-semibold text-text">{t(`how.${step.key}.title`)}</h3>
                            <p className="mt-2 text-sm text-muted">{t(`how.${step.key}.desc`)}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
