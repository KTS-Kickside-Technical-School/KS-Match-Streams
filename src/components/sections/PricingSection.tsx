import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { SectionHeading } from '../ui/SectionHeading'

export function PricingSection() {
    const { t } = useI18n()

    const plans = [
        { key: 'starter', highlighted: false },
        { key: 'pro', highlighted: true },
        { key: 'enterprise', highlighted: false },
    ]

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8" id="pricing">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('pricing.title')} />

                <div className="grid gap-5 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.article
                            key={plan.key}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            className={`rounded-3xl border p-7 ${plan.highlighted
                                    ? 'border-primary bg-surface shadow-soft'
                                    : 'border-border bg-surface'
                                }`}
                        >
                            <h3 className="text-lg font-semibold text-text">{t(`pricing.${plan.key}.name`)}</h3>
                            <p className="mt-2 text-sm text-muted">{t(`pricing.${plan.key}.desc`)}</p>

                            <div className="mt-6 flex items-end gap-1">
                                <span className="text-4xl font-semibold tracking-tight text-text">{t(`pricing.${plan.key}.price`)}</span>
                                <span className="pb-1 text-xs text-muted">{t('pricing.monthly')}</span>
                            </div>

                            <button
                                type="button"
                                className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition ${plan.highlighted
                                        ? 'bg-primary text-primary-foreground hover:bg-primary-strong'
                                        : 'border border-border bg-bg text-text hover:border-primary'
                                    }`}
                            >
                                {t('pricing.cta')}
                            </button>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
