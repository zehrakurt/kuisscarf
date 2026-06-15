"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Menu, X, Search, ShoppingBag, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartSheet } from "@/components/cart-sheet"
import { FavoritesSheet } from "@/components/favorites-sheet"
import { apiFetch } from "@/lib/api"

const navigation = [
  { name: "Yeni Gelenler", href: "/shop?category=Yeni%20Gelenler" },
  { name: "İmannoor Şal", href: "/shop?category=İmannoor%20Şal" },
  { name: "Gucci Şal", href: "/shop?category=Gucci%20Şal" },
  { name: "Dior Şal", href: "/shop?category=Dior%20Şal" },
  { name: "Coach Şal", href: "/shop?category=Coach%20Şal" },
  { name: "Blog", href: "/blog" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()

  // Fetch products for instant search
  useEffect(() => {
    if (isSearchOpen && products.length === 0) {
      const fetchProducts = async () => {
        try {
          const list = await apiFetch("/products")
          setProducts(list)
        } catch (e) {
          console.error("Search fetch products failed:", e)
        }
      }
      fetchProducts()
    }
  }, [isSearchOpen, products.length])

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const filteredInstantProducts = searchQuery.trim()
    ? products.filter((p) => {
        const query = searchQuery.toLowerCase().trim()
        const nameMatch = p.name?.toLowerCase().includes(query)
        const catMatch = p.category?.toLowerCase().includes(query)
        const categoriesMatch = p.categories && Array.isArray(p.categories) && p.categories.some((c: string) => c.toLowerCase().includes(query))
        return nameMatch || catMatch || categoriesMatch
      })
    : []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Sliding Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-background z-50 flex items-center px-4 lg:px-8 border-b border-border animate-in slide-in-from-top duration-300">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3 bg-secondary/30 border border-border px-4 py-2 rounded-full relative">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Şal, eşarp veya marka arayın..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground text-foreground"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit()
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold flex-shrink-0 mr-1"
                >
                  Temizle
                </button>
              )}
              
              {/* Instant Results Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-[400px] flex flex-col">
                  <div className="p-3 bg-secondary/20 border-b border-border text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Anlık Sonuçlar
                  </div>
                  <div className="overflow-y-auto divide-y divide-border/60">
                    {filteredInstantProducts.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Eşleşen ürün bulunamadı.
                      </div>
                    ) : (
                      filteredInstantProducts.slice(0, 5).map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.id}`}
                          onClick={() => {
                            setIsSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className="p-3 hover:bg-secondary/30 flex gap-3 items-center transition-colors block text-left"
                        >
                          <div className="relative h-12 w-9 rounded overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{prod.category}</p>
                          </div>
                          <div className="text-xs font-bold text-primary">{prod.price}₺</div>
                        </Link>
                      ))
                    )}
                  </div>
                  {filteredInstantProducts.length > 5 && (
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="p-3 bg-secondary/40 hover:bg-secondary/60 text-xs font-bold text-center text-primary border-t border-border tracking-wider transition-colors w-full"
                    >
                      TÜM SONUÇLARI GÖR ({filteredInstantProducts.length}) &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSearchOpen(false)
                setSearchQuery("")
              }}
              className="text-foreground"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Kapat</span>
            </Button>
          </div>
        </div>
      )}
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm tracking-wide">
        <p>ÜCRETSİZ KARGO • 2000₺ ve üzeri siparişlerde • HIZLI TESLİMAT</p>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background">
              <nav className="flex flex-col gap-6 mt-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-light tracking-wide text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl lg:text-4xl font-semibold tracking-[0.2em] text-foreground">
              KUISSCARF
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm tracking-wider uppercase text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground/80 hover:text-foreground"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Ara</span>
            </Button>
            <FavoritesSheet />
            <Button variant="ghost" size="icon" className="hidden sm:flex text-foreground/80 hover:text-foreground">
              <User className="h-5 w-5" />
              <span className="sr-only">Hesabım</span>
            </Button>
            <CartSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
