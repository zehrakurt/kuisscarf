import { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-posts"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kuisscarf.com.tr"
  
  // 1. Static routes
  const staticRoutes = [
    "",
    "/shop",
    "/blog",
    "/support",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  // 2. Category routes
  const categories = ["Yeni Gelenler", "İmannoor Şal", "Gucci Şal", "Dior Şal", "Coach Şal", "İndirimli Ürünler"]
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // 3. Blog post routes
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // 4. Product routes (fetched dynamically from Backend API)
  let productRoutes: any[] = []
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kuisscarf-backend.onrender.com/api'
  try {
    const res = await fetch(`${apiBaseUrl}/products`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const products = await res.json()
      productRoutes = products.map((prod: any) => ({
        url: `${baseUrl}/product/${prod.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }))
    }
  } catch (err) {
    console.error("Sitemap product fetch failed:", err)
  }

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes, ...productRoutes]
}
