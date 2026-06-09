import { Truck, Shield, Headphones, Clock } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Ücretsiz Kargo",
    description: "2000₺ ve üzeri siparişlerinizde kargo ücretsiz", // Header'daki 2000TL ile eşleştirelim
  },
  {
    icon: Shield,
    title: "Güvenli Ödeme",
    description: "256-bit SSL şifreleme ile güvenli alışveriş",
  },
  {
    icon: Headphones,
    title: "Kesintisiz Destek",
    description: "Tüm sorularınız için bize ulaşabilirsiniz",
  },
  {
    icon: Clock,
    title: "Hızlı Teslimat",
    description: "1-3 iş günü içinde kapınızda",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
