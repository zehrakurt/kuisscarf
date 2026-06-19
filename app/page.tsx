import { Header } from "@/components/header"
import { ProductVideoBanner } from "@/components/product-video-banner"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CollectionsGrid } from "@/components/collections-grid"
import { ProductsSection } from "@/components/products-section"
import { BannerSection } from "@/components/banner-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      <HeroSection />
      <FeaturesSection />
      <CollectionsGrid />
      <ProductsSection />
      <BannerSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
