"use client"

import { useCart } from "@/context/cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartSheet() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          id="cart-trigger"
          className="relative p-2 text-foreground hover:text-primary transition-colors focus:outline-none"
          aria-label="Sepetim"
        >
          <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold animate-in zoom-in duration-200">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-card flex flex-col h-full border-l border-border p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-2xl font-light tracking-wide flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Alışveriş Sepetim
          </SheetTitle>
        </SheetHeader>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Sepetiniz Boş</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sepetinize henüz bir ürün eklemediniz.
                </p>
              </div>
              <SheetClose asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                  Alışverişe Başla
                </Button>
              </SheetClose>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.variant || ""}`} className="flex gap-4 items-start pb-6 border-b border-border/50 last:border-b-0 last:pb-0">
                {/* Item Image */}
                <div className="relative h-20 w-16 rounded bg-muted overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground">Seçenek: {item.variant}</p>
                  )}
                  <p className="text-sm font-semibold text-primary">{item.price}₺</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id, item.variant)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Ürünü sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info (total, checkout) */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/40 space-y-4">
            <div className="flex justify-between items-center text-base">
              <span className="text-muted-foreground">Toplam Tutar</span>
              <span className="font-semibold text-xl text-foreground">{cartTotal}₺</span>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg p-3 text-xs leading-relaxed space-y-1">
              <span className="font-semibold block text-amber-400">Güvenli Ödeme & Sipariş Bildirimi</span>
              Siparişinizi kredi kartı, taksit veya kargo avantajlarıyla tamamlamak için lütfen **Shopier** veya **Dolap** dükkanlarımızı kullanın.
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a 
                href="https://www.shopier.com/kuisscarff" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full block"
              >
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  SHOPIER İLE SATIN AL
                </Button>
              </a>

              <a 
                href="https://dolap.com/profil/kuisscarff" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full block"
              >
                <Button variant="outline" className="w-full py-5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5">
                  DOLAP İLE SATIN AL
                </Button>
              </a>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
