"use client"

import { useState } from "react"
import Link from "next/link"
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const footerLinks = {
  shop: [
    { name: "Yeni Gelenler", href: "/shop?category=Yeni%20Gelenler" },
    { name: "İmannoor Şal", href: "/shop?category=İmannoor%20Şal" },
    { name: "Gucci Şal", href: "/shop?category=Gucci%20Şal" },
    { name: "Dior Şal", href: "/shop?category=Dior%20Şal" },
    { name: "Coach Şal", href: "/shop?category=Coach%20Şal" },
    { name: "İndirimli Ürünler", href: "/shop?category=İndirimli%20Ürünler" },
  ],

  support: [
    { name: "Yardım Merkezi", href: "/support?tab=yardim" },
    { name: "Sıkça Sorulan Sorular", href: "/support?tab=faq" },
    { name: "Kargo Bilgileri", href: "/support?tab=kargo" },
    { name: "İletişim", href: "/support?tab=iletisim" },
    { name: "Blog / Stil Rehberi", href: "/blog" },
  ],
}

const legalLinks = [
  { id: "gizlilik", name: "Gizlilik Politikası" },
  { id: "kullanim", name: "Kullanım Koşulları" },
  { id: "cerez", name: "Çerez Politikası" },
  { id: "kvkk", name: "KVKK" },
  { id: "mesafeli", name: "Mesafeli Satış Sözleşmesi" },
  { id: "iade", name: "İade ve İptal Politikası" },
]

const legalTexts: { [key: string]: { title: string; content: string[] } } = {
  gizlilik: {
    title: "Gizlilik Politikası",
    content: [
      "KUISSCARF olarak, müşterilerimizin kişisel verilerinin korunmasına ve güvenliğine büyük önem veriyoruz.",
      "Web sitemiz üzerinden paylaştığınız ad, soyad, e-posta adresi, telefon numarası ve kargo adresi gibi kişisel verileriniz, yalnızca siparişlerinizin işleme alınması, teslim edilmesi ve üyelik işlemlerinizin yürütülmesi amacıyla kullanılmaktadır.",
      "Ödeme işlemleriniz iyzico ödeme geçidi üzerinden güvenli bir şekilde şifrelenerek gerçekleştirilir. Kredi kartı veya banka kartı bilgileriniz sunucularımızda kesinlikle saklanmaz ve işlenmez.",
      "Kişisel verileriniz veri sorumlusu sıfatıyla KUISSCARF tarafından korunmakta ve yasal mevzuatın gerektirdiği durumlar haricinde üçüncü şahıslarla paylaşılmamaktadır."
    ]
  },
  kullanim: {
    title: "Kullanım Koşulları",
    content: [
      "KUISSCARF web sitesine giriş yaparak ve alışveriş gerçekleştirerek bu kullanım koşullarını kabul etmiş bulunmaktasınız.",
      "Sitede yer alan tüm tasarım, logo, görseller, ürün fotoğrafları ve yazılı metinler KUISSCARF'a ait olup izinsiz kopyalanamaz veya ticari amaçla kullanılamaz.",
      "Siparişler, stok durumuna bağlı olarak işleme alınır. Fiyatlarda, kampanyalarda veya ürün detaylarında önceden bildirim yapılmaksızın değişiklik yapma hakkımız saklıdır.",
      "Sitede sunulan hizmetlerin kötüye kullanılması, güvenlik açıklarından faydalanılması veya yetkisiz erişim denemeleri yasal takibat sebebidir."
    ]
  },
  cerez: {
    title: "Çerez Politikası",
    content: [
      "KUISSCARF, web sitemizin performansını artırmak, kullanıcı deneyiminizi kişiselleştirmek ve alışveriş tercihlerinizi analiz etmek amacıyla çerezler (cookies) kullanmaktadır.",
      "Çerezler, sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır.",
      "Tarayıcı ayarlarınız üzerinden çerez kullanımını kısıtlama, silme veya engelleme hakkına sahipsiniz.",
      "Çerezlerin engellenmesi durumunda, alışveriş sepetinizin hatırlanması veya üye girişi gibi bazı sitenin temel işlevleri düzgün çalışmayabilir."
    ]
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    content: [
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, veri sorumlusu sıfatıyla KUISSCARF olarak;",
      "Ad, soyad, telefon, adres ve e-posta gibi kişisel verileriniz siparişlerin ifası, faturalandırma işlemlerinin yapılması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla sınırlı olarak işliyoruz.",
      "Kişisel verileriniz, yasal mevzuatın gerektirdiği durumlar ve kargo firmasıyla paylaşım haricinde kesinlikle üçüncü şahıslarla paylaşılmamaktadır.",
      "KVKK'nın 11. maddesi kapsamındaki haklarınız (bilgi talep etme, düzeltme, silme vb.) doğrultusunda başvurularınızı kuisscarf@gmail.com adresinden bizimle iletişime geçerek yapabilirsiniz."
    ]
  },
  mesafeli: {
    title: "Mesafeli Satış Sözleşmesi",
    content: [
      "1. TARAFLAR: İşbu sözleşme KUISSCARF (Fatmatüzzehra Kurt - Eyüp, İstanbul) ile web sitesinden sipariş veren ALICI (Müşteri) arasında, sipariş esnasında girilen bilgiler doğrultusunda akdedilmiştir.",
      "2. SÖZLEŞMENİN KONUSU: Sözleşmenin konusu, ALICI'nın SATICI'ya ait web sitesinden elektronik ortamda siparişini verdiği ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.",
      "3. ÜRÜN VE TESLİMAT: Sipariş edilen ürünler, ALICI'nın belirttiği adrese kargo vasıtasıyla teslim edilir. Kargo ücreti 2000 TL altı siparişlerde 200 TL olup ALICI tarafından ödenir. 2000 TL üzeri siparişlerde kargo ücretsizdir.",
      "4. CAYMA HAKKI: Şal ve eşarp ürünleri doğrudan ten ve saç ile temas eden hijyen ve kişisel kullanım ürünleri sınıfına girdiğinden, ambalajı veya koruma bandı açılmış, kullanılmış ürünlerde mevzuat gereği cayma hakkı (iade ve değişim) kullanılamaz.",
      "5. UYUŞMAZLIKLAR: İşbu sözleşmeden doğan uyuşmazlıklarda, T.C. Ticaret Bakanlığı tarafından ilan edilen değere kadar Tüketici Hakem Heyetleri ve İstanbul Mahkemeleri yetkilidir."
    ]
  },
  iade: {
    title: "İade ve İptal Politikası",
    content: [
      "KUISSCARF bünyesinde satışı yapılan şal ve eşarp modellerimiz, doğrudan saç ve ten ile temas eden kişisel ve hijyen hassasiyetine sahip ürünlerdir.",
      "6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; teslimatından sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan hijyenik ürünlerde cayma hakkı (iade ve değişim) geçerli değildir.",
      "Bu nedenle ambalajı açılmış, kullanılmış, parfüm veya deterjan kokan ya da deforme olmuş ürünlerin iadesi veya değişimi kesinlikle kabul edilmemektedir.",
      "Sadece üretim kaynaklı bir hata veya defo bulunması durumunda, teslimat tarihinden itibaren 14 gün içerisinde kuisscarf@gmail.com veya WhatsApp hattımız üzerinden bizimle iletişime geçerek değişim talep edebilirsiniz."
    ]
  }
}

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/kuisscarf/" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
]

export function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main footer */}
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-semibold tracking-[0.2em]">KUISSCARF</span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed max-w-xs">
              Premium kalite hijab ve şallar ile zarafetinizi tamamlayın.
              2020&apos;ten beri Türkiye&apos;nin güvenilir şal markası.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <span>Eyüp, İstanbul</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span>0506 172 12 48</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>kuisscarf@gmail.com</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="h-10 w-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-medium mb-6 tracking-wider">ALIŞVERİŞ</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-medium mb-6 tracking-wider">DESTEK</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-medium mb-6 tracking-wider">YASAL</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveModal(link.id)}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors text-left bg-transparent border-0 p-0 cursor-pointer outline-none block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2020 Kuisscarf. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2 select-none">
            {/* Visa Logo Badge */}
            <div className="bg-white px-2 py-1 rounded shadow-sm flex items-center justify-center h-7 w-11 hover:opacity-90 transition-opacity">
              <svg className="h-3.5 w-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Visa</title>
                <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" fill="#1A1F71" />
              </svg>
            </div>

            {/* Mastercard Logo Badge */}
            <div className="bg-white px-2 py-1 rounded shadow-sm flex items-center justify-center h-7 w-11 hover:opacity-90 transition-opacity">
              <svg className="h-4.5 w-auto" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
                <title>Mastercard</title>
                <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
                <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" />
                <path d="M12 7.5c0 2.25-1.02 4.25-2.62 5.58A7.48 7.48 0 0014.62 1.92c1.6 1.33 2.62 3.33 2.62 5.58z" fill="#FF5F00" />
              </svg>
            </div>

            {/* Troy Logo Badge */}
            <div className="bg-white px-2 py-1 rounded shadow-sm flex items-center justify-center h-7 w-11 hover:opacity-90 transition-opacity">
              <svg className="h-4 w-auto" viewBox="0 0 40 18" xmlns="http://www.w3.org/2000/svg">
                <title>Troy</title>
                <text x="20" y="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="10" textAnchor="middle" letterSpacing="-0.3">
                  <tspan fill="#005792">tr</tspan>
                  <tspan fill="#84bd00">oy</tspan>
                </text>
                <path d="M 6,14.5 Q 20,17 34,14.5" stroke="url(#troy-grad-footer)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <defs>
                  <linearGradient id="troy-grad-footer" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#005792" />
                    <stop offset="100%" stopColor="#84bd00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {activeModal && legalTexts[activeModal] && (
        <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-lg bg-card text-foreground border border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-light tracking-wider border-b pb-2 text-primary uppercase">
                {legalTexts[activeModal].title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground max-h-[350px] overflow-y-auto pr-2">
              {legalTexts[activeModal].content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </footer>
  )
}
