"use client"

import { useFavorites } from "@/context/favorites-context"
import { useCart } from "@/context/cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export function FavoritesSheet() {
  const { favorites, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    })
    toast.success(`${item.name} sepete eklendi!`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          id="favorites-trigger"
          className="relative p-2 text-foreground hover:text-primary transition-colors focus:outline-none"
          aria-label="Favorilerim"
        >
          <Heart className="h-6 w-6 stroke-[1.5]" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold animate-in zoom-in duration-200">
              {favorites.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-card flex flex-col h-full border-l border-border p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-2xl font-light tracking-wide flex items-center gap-3">
            <Heart className="h-6 w-6 text-destructive fill-destructive" />
            Favorilerim
          </SheetTitle>
        </SheetHeader>

        {/* Favorites list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Favorileriniz Boş</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Beğendiğiniz ürünleri favorilerinize ekleyerek burada listeleyebilirsiniz.
                </p>
              </div>
              <SheetClose asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                  Ürünleri İncele
                </Button>
              </SheetClose>
            </div>
          ) : (
            favorites.map((item) => (
              <div key={item.id} className="flex gap-4 items-center pb-6 border-b border-border/50 last:border-b-0 last:pb-0">
                {/* Item Image Link */}
                <SheetClose asChild>
                  <Link 
                    href={`/product/${item.id}`} 
                    className="relative h-20 w-16 rounded bg-muted overflow-hidden flex-shrink-0 block hover:opacity-85 transition-opacity"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </SheetClose>

                {/* Item Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <SheetClose asChild>
                    <Link 
                      href={`/product/${item.id}`} 
                      className="hover:text-primary transition-colors block cursor-pointer"
                    >
                      <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                    </Link>
                  </SheetClose>
                  <p className="text-sm font-semibold text-primary">{item.price}₺</p>
                  
                  {/* Quick Buy Button */}
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="h-8 mt-2 bg-primary hover:bg-primary/95 text-xs text-primary-foreground flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Sepete Ekle
                  </Button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Favorilerden kaldır"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
