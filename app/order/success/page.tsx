"use client"

import { useEffect, Suspense } from "react"
import { useCart } from "@/context/cart-context"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""

  // Clear cart on successful order landing
  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="max-w-md w-full text-center space-y-6 bg-card border border-border rounded-xl p-8 lg:p-12 shadow-sm animate-in zoom-in duration-300">
      <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
        <CheckCircle2 className="h-12 w-12 stroke-[1.5] fill-accent/5" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-wide text-foreground">Siparişiniz Alındı!</h1>
        <p className="text-muted-foreground">
          Ödemeniz başarıyla tamamlandı. Siparişiniz hazırlanma aşamasına alınmıştır.
        </p>
      </div>

      {orderId && (
        <div className="bg-muted p-4 rounded-lg text-sm font-medium space-y-1">
          <span className="text-muted-foreground block text-xs">Sipariş Numarası</span>
          <span className="text-foreground tracking-wide font-semibold">{orderId}</span>
        </div>
      )}

      <div className="pt-2">
        <p className="text-xs text-muted-foreground leading-normal">
          Sipariş detaylarınız ve kargo takip kodunuz e-posta adresinize gönderilecektir. Bizi tercih ettiğiniz için teşekkür ederiz.
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <Link href="/">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Alışverişe Devam Et
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center py-20">
          <p className="text-muted-foreground animate-pulse">Sipariş bilgileri yükleniyor...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
