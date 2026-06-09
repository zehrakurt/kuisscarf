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
        <Image
          src="/images/banner.png"
          alt="Kuisscarf Hero"
          fill
          className="object-cover object-center"
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
              size="lg"
              className="group text-base tracking-wider px-8 py-6 bg-primary hover:bg-primary/90"
            >
              KOLEKSİYONU KEŞFEDİN
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <div className="w-8 h-1 bg-primary rounded-full" />
        <div className="w-2 h-1 bg-primary/40 rounded-full" />
        <div className="w-2 h-1 bg-primary/40 rounded-full" />
      </div>
    </section>
  )
}
