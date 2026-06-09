"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Clock,
  Loader2,
  ShoppingBag
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function SupportPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams?.get("tab") || "yardim"
  
  const [activeTab, setActiveTab] = useState("yardim")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)

  useEffect(() => {
    if (["yardim", "faq", "kargo", "iletisim"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/support?tab=${tab}`)
  }

  const handleSupportContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsContactSubmitting(true)
    try {
      const response = await fetch("https://formsubmit.co/ajax/kuisscarf@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
          _subject: "Kuisscarf Destek Sayfası Mesajı"
        })
      })
      
      if (response.ok) {
        toast.success("Mesajınız başarıyla gönderildi!", {
          description: "En kısa sürede e-posta adresiniz üzerinden sizinle iletişime geçeceğiz."
        })
        setContactName("")
        setContactEmail("")
        setContactSubject("")
        setContactMessage("")
      } else {
        toast.error("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Bağlantı hatası. Lütfen internetinizi kontrol edin.")
    } finally {
      setIsContactSubmitting(false)
    }
  }

  const faqs = [
    {
      q: "Siparişim ne zaman kargoya verilir?",
      a: "Siparişleriniz ödeme onayından sonra genellikle 24 saat içerisinde hazırlanıp kargoya teslim edilmektedir. Hafta sonu ve resmi tatil günlerinde verilen siparişler takip eden ilk iş gününde kargo firmasına teslim edilir."
    },
    {
      q: "İade ve değişim politikanız nedir?",
      a: "Şal ve eşarp modellerimiz; doğrudan ten ve saç ile temas eden hijyen hassasiyetine sahip ürünler olması sebebiyle, yasal mevzuatlar gereği kesinlikle iade ve değişim kabul edilmemektedir. Satın alım gerçekleştirmeden önce ürün detaylarını ve renk tonlarını dikkatle incelemenizi rica ederiz."
    },
    {
      q: "Kargo ücreti ne kadar?",
      a: "2000₺ ve üzeri alışverişlerinizde kargo tamamen ücretsizdir! 2000₺ altındaki siparişlerinizde ise 200₺ sabit kargo ücreti ödeme adımında sepetinize eklenmektedir."
    },
    {
      q: "Hangi ödeme yöntemlerini kullanabilirim?",
      a: "Web sitemiz üzerinden iyzico altyapısı ve güvencesiyle tüm banka ve kredi kartlarınızı kullanarak 3D Secure güvenli ödeme sistemi ile alışverişinizi gerçekleştirebilirsiniz."
    },
    {
      q: "Siparişimi nasıl takip edebilirim?",
      a: "Siparişiniz kargoya verildikten sonra e-posta ve SMS yoluyla gönderilecek olan takip numarası ile kargo firmasının web sitesi üzerinden kargo durumunu anlık olarak sorgulayabilirsiniz."
    }
  ]

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col">
      {/* Title Banner */}
      <section className="bg-card py-16 border-b border-border/40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-semibold">
            Destek ve İletişim
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-wider uppercase">
            Müşteri <span className="italic">Destek Merkezi</span>
          </h1>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="border-b border-border bg-card sticky top-20 z-30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex overflow-x-auto gap-8 justify-start md:justify-center py-4 scrollbar-thin scrollbar-none">
            {[
              { id: "yardim", name: "Yardım Merkezi", icon: HelpCircle },
              { id: "faq", name: "Sıkça Sorulan Sorular", icon: MessageCircle },
              { id: "kargo", name: "Kargo Bilgileri", icon: Truck },
              { id: "iletisim", name: "İletişim Formu", icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 text-sm tracking-wider uppercase font-semibold pb-2 border-b-2 transition-all flex-shrink-0 cursor-pointer",
                    isActive 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
        {/* 1. YARDIM MERKEZİ TAB */}
        {activeTab === "yardim" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-light">Size Nasıl Yardımcı Olabiliriz?</h2>
              <p className="text-sm text-muted-foreground">KUISSCARF alışveriş deneyiminizle ilgili en yaygın konuları aşağıda bulabilirsiniz.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border/40 p-6 rounded-xl space-y-4 shadow-xs">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base">Hızlı Destek Hattı</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sorularınız, sipariş güncellemeleriniz veya bilgi almak için WhatsApp hattımızdan bize anında ulaşın.
                </p>
                <a 
                  href="https://wa.me/905061721248" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-bold hover:underline block pt-2"
                >
                  WhatsApp ile Başlat &rarr;
                </a>
              </div>

              <div className="bg-card border border-border/40 p-6 rounded-xl space-y-4 shadow-xs">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base">Kolay Kargo Takip</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kargolarımız faturalandırıldıktan hemen sonra gönderilen SMS linkinden sipariş durumunu takip edebilirsiniz.
                </p>
                <button
                  onClick={() => handleTabChange("kargo")}
                  className="text-xs text-primary font-bold hover:underline block pt-2 cursor-pointer"
                >
                  Kargo Detayları &rarr;
                </button>
              </div>

              <div className="bg-card border border-border/40 p-6 rounded-xl space-y-4 shadow-xs">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base">Dolap & Gardrops</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dilerseniz Dolap ve Gardrops uygulamaları üzerinden <strong>kuisscarf</strong> kullanıcı adımızla ürünlerimizi inceleyip güvenle sipariş verebilirsiniz.
                </p>
                <div className="flex gap-3 pt-2">
                  <a 
                    href="https://dolap.com/profil/kuisscarf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Dolap Mağazası
                  </a>
                  <span className="text-muted-foreground/40 text-xs">|</span>
                  <a 
                    href="https://www.gardrops.com/kuisscarf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Gardrops Mağazası
                  </a>
                </div>
              </div>
            </div>

            {/* Support Highlight Block */}
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-semibold text-sm">Bir sorununuz mu var?</h4>
                <p className="text-xs text-muted-foreground">Bizimle doğrudan iletişime geçmekten çekinmeyin. Ekibimiz size memnuniyetle yardımcı olacaktır.</p>
              </div>
              <Button 
                onClick={() => handleTabChange("iletisim")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase px-6"
              >
                İletişim Formunu Aç
              </Button>
            </div>
          </div>
        )}

        {/* 2. SIKÇA SORULAN SORULAR TAB */}
        {activeTab === "faq" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-light">Sıkça Sorulan Sorular</h2>
              <p className="text-sm text-muted-foreground">Alışveriş öncesi ve sonrasında aklınıza takılabilecek genel soruların yanıtları.</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={index} className="py-1">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center text-left p-5 text-sm font-semibold tracking-wide text-foreground/90 hover:bg-secondary/10 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 3. KARGO BİLGİLERİ TAB */}
        {activeTab === "kargo" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-light">Kargo & Teslimat Süreçleri</h2>
              <p className="text-sm text-muted-foreground">Siparişlerinizin size ulaşma süreci ve politikalarımız.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border/40 p-6 rounded-xl space-y-4">
                <h3 className="font-semibold text-sm border-b pb-2 flex items-center gap-2 text-primary">
                  <Truck className="h-4 w-4" />
                  Gönderim Süresi & Kargo Firmaları
                </h3>
                <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-3 leading-relaxed">
                  <li>Siparişleriniz ödeme onayından sonra **24 saat içinde** kargoya teslim edilmektedir.</li>
                  <li>Gönderimlerimizi Türkiye&apos;nin en güvenilir firmalarından **Aras Kargo** ve **Yurtiçi Kargo** ile yapmaktayız.</li>
                  <li>2000₺ üzeri tüm siparişlerinizde kargo **tamamen ücretsizdir**.</li>
                </ul>
              </div>

              <div className="bg-card border border-border/40 p-6 rounded-xl space-y-4">
                <h3 className="font-semibold text-sm border-b pb-2 flex items-center gap-2 text-primary">
                  <Clock className="h-4 w-4" />
                  Ortalama Teslimat Süreleri
                </h3>
                <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-3 leading-relaxed">
                  <li>**İstanbul ve Marmara Bölgesi:** 1-2 iş günü.</li>
                  <li>**Diğer İller ve Bölgeler:** Kargo firmasının yoğunluğuna göre ortalama 2-3 iş günü.</li>
                  <li>Kargo çıkışı yapıldığında takip linkiniz kayıtlı telefon numaranıza SMS olarak gönderilecektir.</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border/40 p-6 rounded-xl space-y-4 mt-6">
              <h3 className="font-semibold text-sm text-primary">Önemli Hatırlatma</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Şal ve eşarp modellerimiz; doğrudan ten ve saç ile temas eden hijyen hassasiyetine sahip ürünler olması sebebiyle, yasal mevzuatlar gereği <strong>kesinlikle iade ve değişim kabul edilmemektedir</strong>. Kargonuzu teslim alırken paketinizin hasar görmemiş olduğundan emin olmanızı, hasarlı paketler için kargo görevlisine tutanak tutturmanızı rica ederiz.
              </p>
            </div>
          </div>
        )}

        {/* 4. İLETİŞİM TAB */}
        {activeTab === "iletisim" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 animate-in fade-in duration-300">
            {/* Contact details */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-light">Bize Ulaşın</h2>
                <p className="text-xs text-muted-foreground">Tüm soru ve görüşleriniz için iletişim bilgilerimiz veya yandaki form üzerinden bize yazabilirsiniz.</p>
              </div>

              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border/30">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Müşteri Destek</h4>
                    <p>0506 172 12 48</p>
                    <p className="text-[10px] text-muted-foreground">7/24 WhatsApp & Arama</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border/30">
                  <ShoppingBag className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Dolap & Gardrops</h4>
                    <p>Kullanıcı Adı: <strong>kuisscarf</strong></p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border/30">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">E-Posta Adresi</h4>
                    <p>kuisscarf@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border/30">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Mağaza Adresi</h4>
                    <p>Eyüp, İstanbul</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7">
              <div className="bg-card border border-border/40 p-6 rounded-xl shadow-xs">
                <form 
                  onSubmit={handleSupportContactSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Adınız Soyadınız *</Label>
                      <Input
                        id="contact-name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        disabled={isContactSubmitting}
                        placeholder="Örn: Ayşe Yılmaz"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">E-posta Adresiniz *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        disabled={isContactSubmitting}
                        placeholder="Örn: ayse@example.com"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">Konu</Label>
                    <Input
                      id="contact-subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Örn: Sipariş Durumu"
                      disabled={isContactSubmitting}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Mesajınız *</Label>
                    <Textarea
                      id="contact-message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      disabled={isContactSubmitting}
                      placeholder="Sorunuzu veya mesajınızı buraya yazın..."
                      rows={4}
                      className="text-xs resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isContactSubmitting}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs uppercase h-11 tracking-wider font-semibold flex items-center justify-center gap-2"
                  >
                    {isContactSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        GÖNDERİLİYOR...
                      </>
                    ) : (
                      "Mesajı Gönder"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SupportPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-secondary/10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground mt-4">Destek sayfası yükleniyor...</p>
        </div>
      }>
        <SupportPageContent />
      </Suspense>
      <Footer />
    </main>
  )
}
