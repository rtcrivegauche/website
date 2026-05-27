import Header from '@/components/public/Header'
import Hero from '@/components/public/Hero'
import HeroLabels from '@/components/public/HeroLabels'
import ImpactStats from '@/components/public/ImpactStats'
import AboutPreview from '@/components/public/AboutPreview'
import ActionsSection from '@/components/public/ActionsSection'
import FeaturedEvent from '@/components/public/FeaturedEvent'
import FeaturedMembers from '@/components/public/FeaturedMembers'
import GalleryPreview from '@/components/public/GalleryPreview'
import BlogPreview from '@/components/public/BlogPreview'
import FinalCTA from '@/components/public/FinalCTA'
import Footer from '@/components/public/Footer'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import NewsletterPopup from '@/components/public/NewsletterPopup'
import ReportsPreview from '@/components/public/ReportsPreview'

export default function Home() {
  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24">
        <Hero />
        <HeroLabels />
        <ImpactStats />
        <AboutPreview />
        <ActionsSection />
        <FeaturedEvent />
        <FeaturedMembers />
        <GalleryPreview />
        <TestimonialsSection />
        <BlogPreview />
        <ReportsPreview />
        <FinalCTA />
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  )
}
