"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useFavorites } from "@/context/favorites-context"
import {
  ShoppingBag,
  ArrowLeft,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Truck,
  Sparkles
} from "lucide-react"

interface ProductDetailClientProps {
  product: any
  relatedProducts: any[]
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [activeImage, setActiveImage] = useState<string>(product?.image || "/images/placeholder.jpg")
  const { toggleFavorite, isFavorited } = useFavorites()
  const isFav = isFavorited(String(product?.id))

  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return
    const currentIndex = product.images.indexOf(activeImage)
    const prevIndex = currentIndex <= 0 ? product.images.length - 1 : currentIndex - 1
    setActiveImage(product.images[prevIndex])
  }

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return
    const currentIndex = product.images.indexOf(activeImage)
    const nextIndex = currentIndex >= product.images.length - 1 ? 0 : currentIndex + 1
    setActiveImage(product.images[nextIndex])
  }

  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>("fabric")

  const handleAddToCart = () => {
    if (!product) return
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Lütfen bir seçenek/varyant seçin.")
      return
    }
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      variant: selectedVariant || undefined,
    }, quantity)
    toast.success(`${product.name} sepete eklendi!`, {
      description: `${selectedVariant ? `Seçenek: ${selectedVariant}, ` : ""}Miktar: ${quantity} adet`,
      action: {
        label: "Sepete Git",
        onClick: () => {
          const cartBtn = document.getElementById("cart-trigger")
          if (cartBtn) cartBtn.click()
        }
      }
    })
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-light">Ürün Bulunamadı</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Aradığınız ürün mağazamızda bulunamadı ya da kaldırılmış olabilir. Diğer şal modellerimizi incelemek için ana sayfamıza dönebilirsiniz.
          </p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

          {/* Breadcrumbs / Back button */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Koleksiyona Geri Dön
            </Link>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Ana Sayfa / Şallar / {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Image Gallery - Left (6 Cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-card border border-border/40 group">
                <Image
                  src={activeImage || "/images/placeholder.jpg"}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-750 group-hover:scale-105"
                />

                {/* Slider Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handlePrevImage()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur hover:bg-card text-foreground flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 z-20 md:opacity-0 group-hover:opacity-100 duration-300"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleNextImage()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur hover:bg-card text-foreground flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 z-20 md:opacity-0 group-hover:opacity-100 duration-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/85 backdrop-blur flex items-center justify-center transition-all hover:bg-card shadow-sm z-20"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${isFav ? "fill-destructive text-destructive" : "text-foreground/60"}`}
                  />
                </button>
              </div>

              {/* Thumbnails Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-[3/4] w-20 rounded-md overflow-hidden bg-muted border-2 flex-shrink-0 transition-all ${activeImage === img ? "border-primary scale-95 shadow-sm" : "border-transparent opacity-75 hover:opacity-100"}`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Görsel ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - Right (6 Cols) */}
            <div className="md:col-span-6 space-y-8">

              {/* Name & Pricing */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-light tracking-wide leading-tight text-foreground">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-semibold text-primary">{product.price}₺</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">{product.originalPrice}₺</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-destructive/10 text-destructive rounded">
                        %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-border/80 pt-6 space-y-6">

                {/* Color Selection */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Renk Seçeneği
                  </span>
                  <div className="flex gap-3">
                    {product.colors?.map((color: string, index: number) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(index)}
                        className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === index ? "border-foreground scale-110 shadow" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Renk ${index + 1}`}
                      >
                        {selectedColor === index && (
                          <span className="h-2 w-2 rounded-full bg-card invert" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Seçenek / Varyant
                    </span>
                    <select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-full h-12 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all cursor-pointer"
                    >
                      <option value="">Seçim Yapınız</option>
                      {product.variants.map((variant: string) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity and Cart button */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Adet Belirleyin
                  </span>

                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border rounded-lg bg-card h-12 w-32 justify-between px-2">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-lg"
                      >
                        -
                      </button>
                      <span className="font-semibold text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 h-12 text-sm font-medium tracking-wide uppercase shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      SEPETE EKLE
                    </Button>
                  </div>
                </div>

              </div>

              {/* Accordion Info */}
              <div className="border-t border-border pt-6 divide-y divide-border/60">

                {/* 1. Fabric Section */}
                <div className="py-4 first:pt-0">
                  <button
                    onClick={() => toggleSection("fabric")}
                    className="w-full flex justify-between items-center text-left text-sm font-semibold tracking-wide"
                  >
                    <span>KUMAŞ & DOKU DETAYLARI</span>
                    {openSection === "fabric" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {openSection === "fabric" && (
                    <div className="mt-3 text-xs text-muted-foreground leading-relaxed space-y-2 animate-in fade-in duration-200">
                      <p>
                        Kuisscarf şal modellerimiz; yumuşacık dokusu, hafif yapısı ve kaliteli kumaşıyla gün boyu konforlu ve şık bir kullanım sunar. Günlük ve özel gün kombinleriniz için özenle tasarlanmıştır.
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>İçerik:</strong> Premium kaliteli kumaş ve lüks dokuma</li>
                        <li><strong>Mevsim:</strong> 4 mevsim kullanıma uygundur</li>
                        <li><strong>Özellik:</strong> Başta kayma yapmaz, gün boyu şeklini korur</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 2. Wash Instructions */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("wash")}
                    className="w-full flex justify-between items-center text-left text-sm font-semibold tracking-wide"
                  >
                    <span>YIKAMA & BAKIM REHBERİ</span>
                    {openSection === "wash" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {openSection === "wash" && (
                    <div className="mt-3 text-xs text-muted-foreground leading-relaxed space-y-2 animate-in fade-in duration-200">
                      <p>
                        Şalınızın dokusunun ve renklerinin ilk günkü canlılığını koruması için hassas bakım önerilir.
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>30°C'de elde veya çamaşır makinesinde hassas/ipek ayarında yıkayınız.</li>
                        <li>Ağartıcı (çamaşır suyu) kesinlikle kullanmayınız.</li>
                        <li>Direkt güneş ışığına maruz bırakmadan, sererek kurutunuz.</li>
                        <li>Çok hafif ısıda tersten ütüleme yapabilirsiniz.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 3. Delivery Section */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("delivery")}
                    className="w-full flex justify-between items-center text-left text-sm font-semibold tracking-wide"
                  >
                    <span>KARGO & İADE POLİTİKASI</span>
                    {openSection === "delivery" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {openSection === "delivery" && (
                    <div className="mt-3 text-xs text-muted-foreground leading-relaxed space-y-2 animate-in fade-in duration-200">
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Gönderim:</strong> Siparişleriniz 24 saat içinde kargoya teslim edilir.</li>
                        <li><strong>Teslimat Süresi:</strong> Kargo firmasına bağlı olarak ortalama 1-3 iş günüdür.</li>
                        <li><strong>İade & Değişim:</strong> Hijyen açısından iade ve değişim mevcut değildir . </li>
                      </ul>
                    </div>
                  )}
                </div>

              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-border/80 text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>Hızlı & Güvenli Teslimat</span>
              </div>

            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 lg:mt-32 pt-12 border-t border-border/80 space-y-10">
              <div className="text-center md:text-left">
                <p className="text-xs tracking-[0.25em] uppercase text-primary mb-2 font-semibold">
                  Sizin İçin Seçtiklerimiz
                </p>
                <h3 className="text-2xl md:text-3xl font-light tracking-wide">
                  İlginizi Çekebilecek <span className="italic">Diğer Şallar</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {relatedProducts.map((prod) => (
                  <div key={prod.id} className="group">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card mb-4">
                      <Link href={`/product/${prod.id}`} className="block w-full h-full">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div>
                      <Link href={`/product/${prod.id}`} className="block">
                        <h4 className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate">{prod.name}</h4>
                      </Link>
                      <span className="text-sm font-semibold text-primary block mt-1">{prod.price}₺</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
