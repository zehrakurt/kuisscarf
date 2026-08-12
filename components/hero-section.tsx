"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-end pb-16 md:items-center md:pb-0">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Image */}
        <Image
          src="/images/banner.png"
          alt="Kuisscarf Hero Desktop"
          fill
          className="hidden md:block object-cover object-center"
          priority
        />
        {/* Mobile Image */}
        <Image
          src="/images/mobil.png"
          alt="Kuisscarf Hero Mobile"
          fill
          className="block md:hidden object-cover object-center"
          priority
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#5C0612] [text-shadow:_0_1.5px_2px_rgba(255,255,255,0.9)] mb-3 md:mb-4 font-semibold">
            imannoor Koleksiyon 2026
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-4 md:mb-6 text-balance text-black md:text-foreground">
            Zarafet <br />
            <span className="italic font-normal">Her Anınızda</span>
          </h1>
          <p className="text-[15px] sm:text-base md:text-lg lg:text-xl text-black font-semibold md:font-normal [text-shadow:_0_1.5px_2px_rgba(255,255,255,0.9)] md:[text-shadow:none] md:text-muted-foreground mb-6 md:mb-10 max-w-lg leading-relaxed">
            Premium kalite pamuk şallarla tarzınızı yansıtın. <br />
            Türkiye&apos;nin en seçkin hijab koleksiyonu.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              asChild
              size="lg"
              className="group text-sm sm:text-base tracking-wider px-6 sm:px-8 py-4 sm:py-6 bg-primary hover:bg-primary/90 w-fit"
            >
              <Link href="/shop?category=İmannoor%20Şal">
                KOLEKSİYONU KEŞFEDİN
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
