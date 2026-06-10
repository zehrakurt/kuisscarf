"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

const categories = ["Tümü", "Yeni Gelenler", "İmannoor Şal", "Gucci Şal", "Dior Şal", "Coach Şal", "İndirimli Ürünler"]

function ShopCatalogContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get("category") || "Tümü"

  const [productsList, setProductsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Tümü")

  // Sync state with URL parameter if changed
  useEffect(() => {
    if (categories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    } else {
      setActiveCategory("Tümü")
    }
  }, [categoryParam])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const docs = await apiFetch("/products")
        setProductsList(docs)
      } catch (e) {
        console.error("Failed to load shop products:", e)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const searchVal = searchParams?.get("search") || ""

  const filteredProducts = productsList.filter(p => {
    // 1. Category check
    let matchesCategory = false
    if (activeCategory === "Tümü") {
      matchesCategory = true
    } else if (activeCategory === "İndirimli Ürünler") {
      matchesCategory = 
        (p.categories && Array.isArray(p.categories) && p.categories.includes("İndirimli Ürünler")) || 
        p.category === "İndirimli Ürünler" || 
        !!(p.originalPrice && Number(p.originalPrice) > Number(p.price))
    } else {
      matchesCategory = 
        (p.categories && Array.isArray(p.categories) && p.categories.includes(activeCategory)) || 
        p.category === activeCategory
    }

    // 2. Search query check
    const matchesSearch = !searchVal || 
      p.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchVal.toLowerCase()) ||
      (p.categories && Array.isArray(p.categories) && p.categories.some((c: string) => c.toLowerCase().includes(searchVal.toLowerCase())))

    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Centered, stylish Category Name Heading */}
      <div className="flex flex-col items-center text-center py-6 mb-8">
        <h2 className="text-3xl lg:text-4xl font-light tracking-[0.2em] text-foreground uppercase relative pb-4">
          {searchVal ? `ARAMA: "${searchVal}"` : (activeCategory === "Tümü" ? "TÜM ÜRÜNLER" : activeCategory)}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-primary" />
        </h2>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground mt-4">Koleksiyon yükleniyor...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border/40 rounded-xl space-y-4">
          <p className="text-lg font-light text-foreground/80">Bu kategoride henüz ürün bulunmuyor.</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Yeni ürünler eklendiğinde burada listelenecektir. Lütfen diğer kategorilerimizi inceleyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ShopProductCard({ product }: { product: any }) {
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
      action: {
        label: "Sepete Git",
        onClick: () => {
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
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card mb-4 border border-border/40">
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
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs tracking-wider rounded-full font-medium">
              YENİ
            </span>
          )}
          {product.isBestseller && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs tracking-wider rounded-full font-medium">
              ÇOK SATAN
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite({
            id: String(product.id),
            name: product.name,
            price: Number(product.price),
            image: product.image
          })}
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center transition-all hover:bg-card shadow-sm"
        >
          <Heart className={cn("h-5 w-5 transition-colors", isFav ? "fill-destructive text-destructive" : "text-foreground/60")} />
        </button>

        {/* Quick actions */}
        <div className={cn("absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300", isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button className="w-full bg-card/90 backdrop-blur text-foreground hover:bg-card text-sm">
              <Eye className="h-4 w-4 mr-2" />
              Detaylar
            </Button>
          </Link>
          <Button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary/90 text-sm text-primary-foreground">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ekle
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          {product.colors?.map((color: string, index: number) => (
            <button
              key={color}
              onClick={() => setSelectedColor(index)}
              className={cn("h-5 w-5 rounded-full border-2 transition-all", selectedColor === index ? "border-foreground scale-110" : "border-transparent")}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-base font-medium text-foreground hover:text-primary transition-colors truncate">{product.name}</h3>
        </Link>
        <span className="text-sm font-semibold text-foreground">{product.price}₺</span>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground mt-4">Koleksiyonlar yükleniyor...</p>
            </div>
          }>
            <ShopCatalogContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
