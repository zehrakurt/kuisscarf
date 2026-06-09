"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("https://formsubmit.co/ajax/kuisscarf@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: "Kuisscarf İletişim Formu Mesajı (Anasayfa)"
        })
      })
      
      if (response.ok) {
        toast.success("Mesajınız başarıyla gönderildi!", {
          description: "En kısa sürede e-posta adresiniz üzerinden sizinle iletişime geçeceğiz."
        })
        setName("")
        setEmail("")
        setMessage("")
      } else {
        toast.error("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Bağlantı hatası. Lütfen internetinizi kontrol edin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 lg:py-32 bg-secondary/50" id="contact">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4 font-medium">
              İletişim
            </p>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Bize <span className="italic">Ulaşın</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Sorularınız, önerileriniz veya talepleriniz için aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 md:p-10 rounded-2xl border border-border shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Adınız Soyadınız</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-background border-border text-base px-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">E-posta Adresiniz</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e-posta@örnek.com"
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-background border-border text-base px-4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Mesajınız</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Mesajınızı buraya yazın..."
                required
                disabled={isSubmitting}
                className="bg-background border-border text-base px-4 py-3 min-h-[120px]"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="w-full h-12 tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  GÖNDERİLİYOR...
                </>
              ) : (
                "GÖNDER"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
