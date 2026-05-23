import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { FAQSection } from './components/sections/FAQSection'
import { FeaturesSection } from './components/sections/FeaturesSection'
import { HeroSection } from './components/sections/HeroSection'
import { HowItWorksSection } from './components/sections/HowItWorksSection'
import { MapSection } from './components/sections/MapSection'
import { PlatformSection } from './components/sections/PlatformSection'
import { PricingSection } from './components/sections/PricingSection'
import { TestimonialsSection } from './components/sections/TestimonialsSection'
import { TrustSection } from './components/sections/TrustSection'
import { useI18n } from './providers/I18nProvider'

function App() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [showTopButton, setShowTopButton] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 420)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-bg"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
              <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
              <p className="text-sm font-medium text-text">RindaNet</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Navbar />
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <MapSection />
        <HowItWorksSection />
        <PlatformSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <Footer />
      </motion.main>

      <AnimatePresence>
        {showTopButton ? (
          <motion.button
            key="back-top"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            type="button"
            className="fixed bottom-6 right-6 z-50 rounded-full bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-strong"
            aria-label={t('common.backToTop')}
          >
            {t('common.backToTop')}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default App
