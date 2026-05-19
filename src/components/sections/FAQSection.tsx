import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useI18n } from '../../providers/I18nProvider'
import { SectionHeading } from '../ui/SectionHeading'

export function FAQSection() {
    const { t } = useI18n()
    const [openIndex, setOpenIndex] = useState(0)

    const items = [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
    ]

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8" id="faq">
            <div className="mx-auto w-full max-w-4xl">
                <SectionHeading title={t('faq.title')} />

                <div className="space-y-3">
                    {items.map((item, index) => {
                        const isOpen = openIndex === index

                        return (
                            <div key={item.q} className="overflow-hidden rounded-2xl border border-border bg-surface">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-sm font-semibold text-text">{item.q}</span>
                                    <span className="text-lg text-primary">{isOpen ? '−' : '+'}</span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen ? (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22 }}
                                        >
                                            <p className="px-5 pb-5 text-sm text-muted">{item.a}</p>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
