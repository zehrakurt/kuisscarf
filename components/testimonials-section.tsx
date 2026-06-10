"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Ayşe Y.",
    location: "İstanbul",
    rating: 5,
    text: "İpek şallarının kalitesi muhteşem! Hem yumuşak hem de dayanıklı. Her rengi birbirinden güzel.",
    product: "Dior Yeşil Şal",
  },
  {
    id: 2,
    name: "Fatma K.",
    location: "Ankara",
    rating: 5,
    text: "Kargo çok hızlı geldi ve paketleme gerçekten özenli. Ürünler tam beklediğim gibi çıktı.",
    product: "İmannoor Siyah Şal",
  },
  {
    id: 3,
    name: "Zeynep A.",
    location: "İstanbul",
    rating: 5,
    text: "Artık şal ihtiyacım için tek adresim burası. Renk seçenekleri ve kalite mükemmel!",
    product: "İmannoor Bordo Şal",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4 font-medium">
            Müşteri Yorumları
          </p>
          <h2 className="text-4xl md:text-5xl font-light">
            Mutlu <span className="italic">Müşterilerimiz</span>
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card p-8 rounded-xl border border-border relative"
            >
              {/* Quote icon */}
              <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Product */}
              <p className="text-sm text-primary mb-4">{testimonial.product}</p>

              {/* Author */}
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
