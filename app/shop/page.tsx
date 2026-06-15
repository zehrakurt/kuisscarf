import { Metadata } from "next"
import ShopClient from "./shop-client"

interface ShopPageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kuisscarf-backend.onrender.com/api'
  try {
    const res = await fetch(`${baseUrl}/products`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.error("Error fetching products on shop server page:", err)
    return []
  }
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams
  const category = params.category || "Tümü"
  const search = params.search || ""

  let title = "Tüm Koleksiyonlar | Premium Şal & Hijab | Kuisscarf"
  let description = "Kuisscarf en yeni şal modelleri, İmannoor şallar, lüks ipek ve modal eşarplar. Türkiye'nin en şık tesettür şal koleksiyonu."

  if (search) {
    title = `"${search}" Arama Sonuçları | Kuisscarf`
    description = `Kuisscarf mağazasında "${search}" aramasına uygun premium şal modelleri ve fiyatları.`
  } else if (category !== "Tümü") {
    title = `${category} Koleksiyonu | Kuisscarf`
    description = `Kuisscarf ${category} modelleri ve fiyatları. En kaliteli ve şık ${category} modellerini keşfetmek için tıklayın.`
  }

  return {
    title,
    description,
    keywords: `kuisscarf şal, şal modelleri, ${category.toLowerCase() === "tümü" ? "ipek şal" : category.toLowerCase()}, modal şal, gucci şal, dior şal, coach şal, indirimli şallar`,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://kuisscarf.com.tr/shop${category !== "Tümü" ? `?category=${encodeURIComponent(category)}` : ""}`,
    },
    alternates: {
      canonical: `https://kuisscarf.com.tr/shop${category !== "Tümü" ? `?category=${encodeURIComponent(category)}` : ""}`,
    }
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Trigger products fetch on server side to load faster and populate DOM for crawler SEO indexing
  const products = await getProducts()

  return (
    <ShopClient initialProducts={products} />
  )
}
