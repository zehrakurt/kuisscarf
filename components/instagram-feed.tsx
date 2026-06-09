"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"

export function InstagramFeed() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-secondary/10">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center">
          <Link
            href="https://www.instagram.com/kuisscarf/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm tracking-[0.3em] uppercase text-primary mb-4 font-medium hover:opacity-80 transition-opacity"
          >
            <Instagram className="h-4 w-4" />
            @kuisscarf
          </Link>
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            Bizi <span className="italic">Instagram&apos;da</span> Takip Edin
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Stil ilhamı için hesabımızı takip edin ve paylaşımlarınızda #kuisscarf etiketini kullanın
          </p>
        </div>
      </div>
    </section>
  )
}
