import { Metadata } from "next"
import ProductDetailClient from "./product-client"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kuisscarf-backend.onrender.com/api'
  try {
    const res = await fetch(`${baseUrl}/products/${id}`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error("Error fetching product on server:", err)
    return null
  }
}

async function getRelatedProducts(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kuisscarf-backend.onrender.com/api'
  try {
    const res = await fetch(`${baseUrl}/products`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const list = await res.json()
    return list.filter((p: any) => String(p.id) !== String(id)).slice(0, 4)
  } catch (err) {
    console.error("Error fetching related products on server:", err)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Kuisscarf",
      description: "Aradığınız şal modeli kuisscarf mağazasında bulunamadı.",
    }
  }

  const title = `${product.name} - Premium Hijab & Şal | Kuisscarf`
  const description = `${product.name} şal modeli en uygun fiyat ve premium kalite ile Kuisscarf'ta. ${product.category || "Şal"} koleksiyonumuzu hemen keşfedin. Ücretsiz kargo imkanı.`

  return {
    title,
    description,
    keywords: `${product.name}, kuisscarf, şal modelleri, hijab, tesettür şal, premium şal, ${product.category || "şallar"}`,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 1067,
          alt: product.name,
        },
      ],
      url: `https://kuisscarf.com.tr/product/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://kuisscarf.com.tr/product/${id}`,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)
  const related = await getRelatedProducts(id)

  // Structured Data (JSON-LD Schema) for Google Product listings
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": [product.image, ...(product.images || [])],
        "description": `${product.name} lüks şal modeli. Günlük ve özel günleriniz için rahat, yumuşacık ve premium dokulu başörtüsü / şal kumaşı.`,
        "sku": `KS-${product.id}`,
        "brand": {
          "@type": "Brand",
          "name": "Kuisscarf"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://kuisscarf.com.tr/product/${id}`,
          "priceCurrency": "TRY",
          "price": product.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Kuisscarf"
          }
        }
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient product={product} relatedProducts={related} />
    </>
  )
}

