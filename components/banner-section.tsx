"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function BannerSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden min-h-[500px] lg:min-h-[600px] flex items-center">
          {/* Background Video */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            loop
            muted
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
          
          {/* Dark Overlay with Warm Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl p-8 lg:p-16 text-white">
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4 font-semibold">
              Özel Koleksiyon
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
              Kültürlerin <br />
              <span className="italic">Harmonisi</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-md leading-relaxed font-light">
              Geleneksel zanaat ve modern tasarımın buluştuğu özel koleksiyonumuzla 
              benzersiz bir şıklığı keşfedin.
            </p>
            <div>
              <Button 
                size="lg" 
                variant="secondary"
                className="group text-base tracking-wider px-8 bg-white text-foreground hover:bg-white/90 transition-colors"
              >
                KOLEKSİYONU İNCELE
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
