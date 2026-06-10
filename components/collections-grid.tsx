"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { apiFetch } from "@/lib/api"

const collectionsConfig = [
  {
    id: 1,
    name: "Gucci Pamuk Şal",
    description: "Lüks pamuk şallar",
    image: "/images/1.png",
    href: "/shop?category=Gucci%20Şal",
    categoryKey: "Gucci Şal"
  },
  {
    id: 2,
    name: "İmannoor Koleksiyonu",
    description: "Kaliteli pamuk şallar",
    image: "/images/2.png",
    href: "/shop?category=İmannoor%20Şal",
    categoryKey: "İmannoor Şal"
  },
  {
    id: 3,
    name: "Coach Şalları Keşfedin",
    description: "Farklı renk seçenekleri ile ...",
    image: "/images/3.png",
    href: "/shop?category=Coach%20Şal",
    categoryKey: "Coach Şal"
  },
]

export function CollectionsGrid() {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    "Gucci Şal": 0,
    "İmannoor Şal": 0,
    "Coach Şal": 0,
  })

  useEffect(() => {
    async function getProductCounts() {
      try {
        const products = await apiFetch("/products")
        const productCounts: { [key: string]: number } = {
          "Gucci Şal": 0,
          "İmannoor Şal": 0,
          "Coach Şal": 0,
        }
        products.forEach((data: any) => {
          if (data.categories && Array.isArray(data.categories)) {
            data.categories.forEach((cat: string) => {
              if (cat && cat in productCounts) {
                productCounts[cat]++
              }
            })
          } else {
            const cat = data.category
            if (cat && cat in productCounts) {
              productCounts[cat]++
            }
          }
        })
        setCounts(productCounts)
      } catch (e) {
        console.error("Failed to load collection product counts:", e)
      }
    }
    getProductCounts()
  }, [])

  return (
    <section id="collections" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4 font-medium">
            Koleksiyonlar
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light">
            Tarzınızı <span className="italic">Keşfedin</span>
          </h2>
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsConfig.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg block"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <p className="text-sm tracking-wider opacity-80 mb-2">
                  {counts[collection.categoryKey] || 0} Ürün
                </p>
                <h3 className="text-2xl lg:text-3xl font-light mb-2">
                  {collection.name}
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center gap-2 text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>KOLEKSİYONU GÖR</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
