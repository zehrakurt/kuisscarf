"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingBag, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart()
  const [loading, setLoading] = useState(false)

  const shippingFee = cartTotal >= 2000 ? 0 : 200
  const finalTotal = cartTotal + shippingFee

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Turkiye",
    postcode: "34000",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validations
    if (cartItems.length === 0) {
      toast.error("Sepetiniz boş.")
      return
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error("Lütfen zorunlu alanları doldurun.")
      return
    }

    setLoading(true)
    try {
      // Send shipping details and cart items to the server-side Shopier redirect generator
      const res = await fetch("/api/iyzico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingInfo: formData,
          items: cartItems,
          total: finalTotal,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Ödeme oturumu başlatılamadı.")
      }

      const data = await res.json()

      if (data.paymentPageUrl) {
        // Redirect the user's browser directly to iyzico hosted 3D Secure payment page
        window.location.href = data.paymentPageUrl
      } else {
        throw new Error("Ödeme yönlendirme adresi alınamadı.")
      }
    } catch (error: any) {
      console.error("Checkout Error:", error)
      toast.error(error.message || "Bir hata oluştu, lütfen tekrar deneyin.")
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-light tracking-wide text-foreground">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mt-2">
              Sipariş verebilmek için sepetinize en az bir ürün eklemelisiniz.
            </p>
          </div>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 px-8">
              Alışverişe Başla
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Alışverişe Geri Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Checkout Form - Left (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-light tracking-wide mb-2">Teslimat Bilgileri</h1>
              <p className="text-muted-foreground">Siparişinizin gönderileceği adres ve iletişim bilgilerini girin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">Ad *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Adınız"
                    className="bg-card border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Soyad *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Soyadınız"
                    className="bg-card border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">E-posta Adresi *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@mail.com"
                    className="bg-card border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Telefon Numarası *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05xxxxxxxxx"
                    className="bg-card border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Açık Adres (Sokak, Mahalle, No, Daire) *</Label>
                <Textarea
                  id="address"
                  name="address"
                  required
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Teslimat adresi"
                  className="bg-card border-border resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="city" className="text-sm font-medium">Şehir *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="İstanbul"
                    className="bg-card border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode" className="text-sm font-medium">Posta Kodu *</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    required
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="34000"
                    className="bg-card border-border"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-medium tracking-wide"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Ödeme Sayfasına Yönlendiriliyorsunuz...
                    </>
                  ) : (
                    "SİPARİŞİ ONAYLA VE ÖDE"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Cart Summary - Right (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6">
              <h2 className="text-2xl font-light tracking-wide pb-4 border-b border-border">Sipariş Özeti</h2>

              {/* Items List */}
              <div className="divide-y divide-border/50 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative h-16 w-12 rounded bg-muted overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{item.price * item.quantity}₺</div>
                  </div>
                ))}
              </div>

              {/* Costs summary */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span className="font-medium">{cartTotal}₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kargo Ücreti</span>
                  <span className={shippingFee === 0 ? "text-accent font-medium" : "font-medium"}>
                    {shippingFee === 0 ? "Ücretsiz" : `${shippingFee}₺`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-muted-foreground text-right -mt-2">
                    2000₺ üzeri ücretsiz kargo fırsatı!
                  </p>
                )}
                <div className="flex justify-between text-base pt-3 border-t border-border/80">
                  <span className="font-semibold text-foreground">Toplam Tutar</span>
                  <span className="font-bold text-xl text-primary">{finalTotal}₺</span>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="flex flex-col gap-4 bg-muted/30 border border-border/50 rounded-lg p-4 text-xs text-muted-foreground leading-normal">
                <div className="flex gap-3">
                  <ShieldCheck className="h-8 w-8 text-accent flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">iyzico Güvencesiyle Ödeme</span>
                    Ödemeniz 256-bit SSL güvenlik korumasıyla 3D Secure onaylı olarak iyzico üzerinden güvenli bir şekilde alınmaktadır.
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2.5 border-t border-border/40 justify-center">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground mr-1 select-none">Kabul Edilen Kartlar:</span>
                  
                  {/* Visa Badge */}
                  <div className="bg-white px-2 py-0.5 rounded shadow-xs flex items-center justify-center h-5.5 w-9">
                    <svg className="h-2.5 w-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title>Visa</title>
                      <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" fill="#1A1F71" />
                    </svg>
                  </div>

                  {/* Mastercard Badge */}
                  <div className="bg-white px-2 py-0.5 rounded shadow-xs flex items-center justify-center h-5.5 w-9">
                    <svg className="h-3 w-auto" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
                      <title>Mastercard</title>
                      <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
                      <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" />
                      <path d="M12 7.5c0 2.25-1.02 4.25-2.62 5.58A7.48 7.48 0 0014.62 1.92c1.6 1.33 2.62 3.33 2.62 5.58z" fill="#FF5F00" />
                    </svg>
                  </div>

                  {/* Troy Badge */}
                  <div className="bg-white px-2 py-0.5 rounded shadow-xs flex items-center justify-center h-5.5 w-9">
                    <svg className="h-3 w-auto" viewBox="0 0 40 18" xmlns="http://www.w3.org/2000/svg">
                      <title>Troy</title>
                      <text x="20" y="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="10" textAnchor="middle" letterSpacing="-0.3">
                        <tspan fill="#005792">tr</tspan>
                        <tspan fill="#84bd00">oy</tspan>
                      </text>
                      <path d="M 6,14.5 Q 20,17 34,14.5" stroke="url(#troy-grad-checkout)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <defs>
                        <linearGradient id="troy-grad-checkout" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#005792" />
                          <stop offset="100%" stopColor="#84bd00" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
