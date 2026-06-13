"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
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
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4 font-medium">
            imannoor Koleksiyon 2026
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-6 text-balance">
            Zarafet <br />
            <span className="italic font-normal">Her Anınızda</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Premium kalite pamuk şallarla tarzınızı yansıtın.
            Türkiye&apos;nin en seçkin hijab koleksiyonu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="group text-base tracking-wider px-8 py-6 bg-primary hover:bg-primary/90"
            >
              <Link href="/shop?category=İmannoor%20Şal">
                KOLEKSİYONU KEŞFEDİN
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
