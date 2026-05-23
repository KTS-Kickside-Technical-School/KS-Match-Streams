import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { SectionHeading } from '../ui/SectionHeading'

export function TestimonialsSection() {
    const { t } = useI18n()

    const items = ['one', 'two', 'three']

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('testimonials.title')} />

                <div className="grid gap-5 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <motion.figure
                            key={item}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.28, delay: index * 0.08 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <blockquote className="text-sm leading-7 text-text">“{t(`testimonials.items.${item}.quote`)}”</blockquote>
                            <figcaption className="mt-5 border-t border-border pt-4">
                                <p className="text-sm font-semibold text-text">{t(`testimonials.items.${item}.name`)}</p>
                                <p className="text-xs text-muted">{t(`testimonials.items.${item}.role`)}</p>
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
