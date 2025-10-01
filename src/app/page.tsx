import { Metadata } from 'next'
import HeroCarousel from "@/components/sections/hero-carousel"
import BrandIntroduction from "@/components/sections/brand-introduction"
import GiftCollectionsShowcase from "@/components/sections/gift-collections-showcase"
import BrandValues from "@/components/sections/brand-values"
import PromotionalBanners from "@/components/sections/promotional-banners"
import WhatsNew from "@/components/sections/whats-new"
import CollectionsGrid from "@/components/sections/collections-grid"
import MostLovedProducts from "@/components/sections/most-loved-products"
import LuxuryBrandStory from "@/components/sections/luxury-brand-story"
import CustomerTestimonials from "@/components/sections/customer-testimonials"
import InstagramGallery from "@/components/sections/instagram-gallery"
import NewsletterSignup from "@/components/sections/newsletter-signup"
import Footer from "@/components/sections/footer"

export const metadata: Metadata = {
  title: "Mevi Living - Luxury Home Decor & Artisanal Serveware",
  description: "Discover sophisticated luxury home decor with artisanal ceramic serveware and drinkware. Handcrafted pieces that embody elegance, sustainability, and mindful living.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroCarousel />
      <BrandIntroduction />
      <GiftCollectionsShowcase />
      <BrandValues />
      <PromotionalBanners />
      <WhatsNew />
      <CollectionsGrid />
      <MostLovedProducts />
      <LuxuryBrandStory />
      <CustomerTestimonials />
      <InstagramGallery />
      <NewsletterSignup />
      <Footer />
    </main>
  )
}