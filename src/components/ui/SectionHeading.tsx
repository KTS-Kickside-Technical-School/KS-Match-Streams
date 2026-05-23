import { motion } from 'framer-motion'

type SectionHeadingProps = {
    title: string
    subtitle?: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mx-auto mb-10 max-w-2xl text-center"
        >
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-text md:text-4xl">{title}</h2>
            {subtitle ? <p className="mt-3 text-pretty text-sm text-muted md:text-base">{subtitle}</p> : null}
        </motion.div>
    )
}
