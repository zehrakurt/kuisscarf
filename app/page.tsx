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
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kuisscarf",
    "alternateName": ["Kuis scarf", "Kuis Scarf", "Kuisscarf Hijab", "Kuis Şal"],
    "url": "https://kuisscarf.com.tr",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kuisscarf.com.tr/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kuisscarf",
    "url": "https://kuisscarf.com.tr",
    "logo": "https://kuisscarf.com.tr/icon.svg",
    "sameAs": [
      "https://www.instagram.com/kuisscarf/"
    ]
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
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
