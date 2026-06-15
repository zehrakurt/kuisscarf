import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts } from "@/lib/blog-posts"
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Kuisscarf Blog | Premium Hijab Moda Rehberi & Şal Kombinleri",
  description: "Şal kumaş rehberi, ipek ve modal şal temizliği, pratik şal bağlama modelleri ve en son hijab modası trendleri Kuisscarf blogunda.",
  keywords: "kuisscarf, şal kombinleri, ipek şal bakımı, modal şal temizliği, şal bağlama modelleri, tesettür giyim rehberi",
  alternates: {
    canonical: "https://kuisscarf.com.tr/blog",
  },
  openGraph: {
    title: "Kuisscarf Blog | Premium Hijab Moda Rehberi",
    description: "Şal kumaş rehberi, ipek ve modal şal temizliği, pratik şal bağlama modelleri ve en son hijab modası trendleri Kuisscarf blogunda.",
    type: "website",
    url: "https://kuisscarf.com.tr/blog",
  }
}

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs tracking-wider rounded-full font-medium uppercase">
              <BookOpen className="h-3 w-3" />
              Zarafet ve Stil Rehberi
            </div>
            <h1 className="text-4xl lg:text-5xl font-light tracking-wide font-serif">
              Kuisscarf <span className="italic">Blog</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hijab modasının en yeni trendleri, şal bağlama teknikleri, kumaş özellikleri ve ürünlerimizin ömrünü uzatacak hassas bakım önerileri burada.
            </p>
            <div className="w-16 h-[2px] bg-primary mx-auto mt-4" />
          </div>

          {/* Featured Post (First post in list) */}
          {blogPosts.length > 0 && (
            <div className="group bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="relative aspect-[4/3] md:aspect-[16/10] md:col-span-7 w-full h-full min-h-[300px] overflow-hidden">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  priority
                  className="object-cover transition-transform duration-750 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs tracking-wider rounded-full font-medium">
                  {blogPosts[0].category}
                </span>
              </div>
              <div className="p-6 md:p-8 md:col-span-5 space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-light font-serif tracking-wide leading-tight group-hover:text-primary transition-colors">
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    {blogPosts[0].title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-primary">
                      {blogPosts[0].author[0]}
                    </div>
                    <span className="text-xs font-medium text-foreground/80">{blogPosts[0].author}</span>
                  </div>
                  <Link
                    href={`/blog/${blogPosts[0].slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                  >
                    Oku
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article
                key={post.slug}
                className="group bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-750 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-card/90 backdrop-blur text-foreground text-xs tracking-wider rounded-full font-medium shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-light font-serif tracking-wide leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-2xs font-semibold text-primary">
                      {post.author[0]}
                    </div>
                    <span className="text-2xs font-medium text-foreground/80">{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                  >
                    Oku
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
