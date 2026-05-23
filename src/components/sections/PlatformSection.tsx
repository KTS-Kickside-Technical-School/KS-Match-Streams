import { motion } from 'framer-motion'
import { useI18n } from '../../providers/I18nProvider'
import { SectionHeading } from '../ui/SectionHeading'

const platforms = ['Windows', 'macOS', 'Linux', 'Android', 'iPhone']

export function PlatformSection() {
    const { t } = useI18n()

    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8" id="platforms">
            <div className="mx-auto w-full max-w-7xl">
                <SectionHeading title={t('platforms.title')} />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.24, delay: index * 0.05 }}
                            className="rounded-2xl border border-border bg-surface px-4 py-5 text-center text-sm font-semibold text-text"
                        >
                            {platform}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
