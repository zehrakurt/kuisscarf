"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

function FailedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""

  return (
    <div className="max-w-md w-full text-center space-y-6 bg-card border border-border rounded-xl p-8 lg:p-12 shadow-sm animate-in zoom-in duration-300">
      <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
        <AlertTriangle className="h-12 w-12 stroke-[1.5]" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-wide text-foreground">Ödeme Başarısız</h1>
        <p className="text-muted-foreground">
          Ödemeniz banka veya sistem kaynaklı bir hata nedeniyle tamamlanamadı ya da iptal edildi.
        </p>
      </div>

      {orderId && orderId !== "unknown" && (
        <div className="bg-muted p-4 rounded-lg text-sm font-medium space-y-1">
          <span className="text-muted-foreground block text-xs">Sipariş Referansı</span>
          <span className="text-foreground tracking-wide font-semibold">{orderId}</span>
        </div>
      )}

      <div className="pt-2">
        <p className="text-xs text-muted-foreground leading-normal">
          Lütfen kart bilgilerinizi, limitinizi ve 3D Secure onay adımlarını kontrol ederek tekrar deneyin. Sorununuz devam ederse bankanızla iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <Link href="/checkout">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ödemeyi Tekrar Dene
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
            Anasayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center py-20">
          <p className="text-muted-foreground animate-pulse">Sipariş bilgileri yükleniyor...</p>
        </div>
      }>
        <FailedContent />
      </Suspense>
    </div>
  )
}
