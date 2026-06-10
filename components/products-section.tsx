"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 5,
    name: "Ekru Naia Air Jakar Şal",
    price: 389,
    originalPrice: null,
    image: "/images/ekru-air-jakar.jpg",
    colors: ["#E8DCC4", "#D2C2A4"],
    isNew: true,
    isBestseller: true,
    category: "Yeni Gelenler",
  },
  {
    id: 1,
    name: "İpek Krem Şal",
    price: 349,
    originalPrice: 449,
    image: "/images/product-1.png",
    colors: ["#F5F0E6", "#D4C4B0", "#8B7355"],
    isNew: true,
    isBestseller: false,
    category: "İmannoor Şal",
  },
  {
    id: 2,
    name: "Modal Pembe Şal",
    price: 289,
    originalPrice: null,
    image: "/images/product-2.png",
    colors: ["#D4A5A5", "#E8C4C4", "#A67B7B"],
    isNew: false,
    isBestseller: true,
    category: "Coach Şal",
  },
  {
    id: 3,
    name: "Pamuk Yeşil Şal",
    price: 259,
    originalPrice: 319,
    image: "/images/product-3.png",
    colors: ["#8FA876", "#B8C9A3", "#5C6B4A"],
    isNew: true,
    isBestseller: false,
    category: "Gucci Şal",
  },
  {
    id: 4,
    name: "İpek Kahve Şal",
    price: 379,
    originalPrice: null,
    image: "/images/product-4.png",
    colors: ["#A67B5B", "#8B5A2B", "#D4A574"],
    isNew: false,
    isBestseller: true,
    category: "Dior Şal",
  },
]

import { apiFetch } from "@/lib/api"

export function ProductsSection() {
  const [productsList, setProductsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollAmount = clientWidth * 0.75
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount
      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const docs = await apiFetch("/products")
        setProductsList(docs)
      } catch (e) {
        console.error("Failed to load products from API:", e)
        setProductsList([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    // Small timeout to allow the DOM to render before calculating scroll widths
    const timer = setTimeout(() => {
      handleScroll()
    }, 100)

    window.addEventListener("resize", handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleScroll)
    }
  }, [productsList, loading])

  // Show only "Yeni Gelenler" products on the homepage
  const newArrivals = productsList.filter(p => 
    (p.categories && Array.isArray(p.categories) && p.categories.includes("Yeni Gelenler")) || 
    p.category === "Yeni Gelenler" || 
    !p.category
  )

  return (
    <section id="new" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4 font-medium">
              Yeni Gelenler
            </p>
            <h2 className="text-4xl md:text-5xl font-light">
              En Çok <span className="italic">Sevilenler</span>
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="link" className="text-foreground mt-4 md:mt-0 justify-start md:justify-end px-0 cursor-pointer">
              Tümünü Gör →
            </Button>
          </Link>
        </div>

        {/* Products slider */}
        <div className="relative group/slider">
          {/* Left Arrow Button */}
          {showLeftArrow && !loading && newArrivals.length > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background text-foreground border border-border h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 hidden md:flex"
              aria-label="Önceki ürünler"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {showRightArrow && !loading && newArrivals.length > 0 && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background text-foreground border border-border h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 hidden md:flex"
              aria-label="Sonraki ürünler"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div 
                    key={`skeleton-prod-${index}`} 
                    className="w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] flex-shrink-0 snap-start space-y-4"
                  >
                    <div className="aspect-[3/4] bg-card/60 animate-pulse rounded-lg" />
                    <div className="h-5 bg-card/60 animate-pulse rounded w-2/3" />
                    <div className="h-4 bg-card/60 animate-pulse rounded w-1/3" />
                  </div>
                ))
              : newArrivals.length === 0
                ? (
                  <div className="w-full text-center py-20 text-muted-foreground text-sm">
                    Henüz yeni gelen ürün eklenmedi.
                  </div>
                )
                : newArrivals.map((product) => (
                    <div 
                      key={product.id} 
                      className="w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] flex-shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { toast } from "sonner"

function ProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorited } = useFavorites()

  const isFav = isFavorited(String(product.id))

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast.success(`${product.name} sepete eklendi!`, {
      description: "Alışverişe devam edebilir veya sepetinizi kontrol edebilirsiniz.",
      action: {
        label: "Sepete Git",
        onClick: () => {
          // Trigger the cart sheet trigger click (handled by page state or trigger element click)
          const cartBtn = document.getElementById("cart-trigger")
          if (cartBtn) cartBtn.click()
        }
      }
    })
  }

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card mb-4">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs tracking-wider rounded-full">
              YENİ
            </span>
          )}
          {product.isBestseller && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs tracking-wider rounded-full">
              ÇOK SATAN
            </span>
          )}
          {product.originalPrice && (
            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs tracking-wider rounded-full">
              İNDİRİM
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite({
            id: String(product.id),
            name: product.name,
            price: Number(product.price),
            image: product.image
          })}
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center transition-all hover:bg-card"
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors",
              isFav ? "fill-destructive text-destructive" : "text-foreground/60"
            )} 
          />
        </button>

        {/* Quick actions */}
        <div 
          className={cn(
            "absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button className="w-full bg-card/90 backdrop-blur text-foreground hover:bg-card text-sm">
              <Eye className="h-4 w-4 mr-2" />
              Detaylar
            </Button>
          </Link>
          <Button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-sm text-primary-foreground"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Sepete Ekle
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-2">
        {/* Color options */}
        <div className="flex gap-2">
          {product.colors?.map((color: string, index: number) => (
            <button
              key={color}
              onClick={() => setSelectedColor(index)}
              className={cn(
                "h-5 w-5 rounded-full border-2 transition-all",
                selectedColor === index ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Renk seçeneği ${index + 1}`}
            />
          ))}
        </div>

        {/* Name and price */}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-foreground">
            {product.price}₺
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice}₺
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
