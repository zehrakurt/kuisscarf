import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts } from "@/lib/blog-posts"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { ShareButton } from "@/components/share-button"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Support pre-rendering for SEO
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

async function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug) || null
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Makale Bulunamadı | Kuisscarf Blog",
      description: "Aradığınız blog yazısı kuisscarf blogunda bulunamadı.",
    }
  }

  const title = `${post.title} | Kuisscarf Blog`
  const description = post.excerpt

  return {
    title,
    description,
    keywords: post.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: "2026-06-15T12:00:00.000Z", // Can be hardcoded or parsed
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 800,
          height: 500,
          alt: post.title,
        },
      ],
      url: `https://kuisscarf.com.tr/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.image],
    },
    alternates: {
      canonical: `https://kuisscarf.com.tr/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Structured Data (JSON-LD Schema) for Google Blog posting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [
      post.image
    ],
    "datePublished": "2026-06-15T12:00:00.000Z",
    "dateModified": "2026-06-15T12:00:00.000Z",
    "author": [{
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole,
      "url": "https://kuisscarf.com.tr"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Kuisscarf",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kuisscarf.com.tr/placeholder-logo.png"
      }
    },
    "description": post.excerpt
  }

  // Find other articles for recommendations
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Yazılara Dön
          </Link>

          {/* Article Header */}
          <header className="space-y-6 mb-10">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs tracking-wider rounded-full font-medium uppercase">
              {post.category}
            </span>
            
            <h1 className="text-3xl lg:text-4xl font-light font-serif tracking-wide leading-tight text-foreground">
              {post.title}
            </h1>

            {/* Meta details */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-primary">
                    {post.author[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">{post.author}</span>
                    <span className="text-3xs text-muted-foreground">{post.authorRole}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              {/* Tag / Category Badge */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs">Paylaş:</span>
                <ShareButton title={post.title} excerpt={post.excerpt} />
              </div>
            </div>
          </header>

          {/* Main image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 shadow-sm border border-border/40">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Article Content */}
          <article 
            className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:tracking-wide prose-a:text-primary prose-img:rounded-xl leading-relaxed text-sm text-foreground/80 space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags list */}
          <div className="flex flex-wrap gap-2 pt-10 border-t border-border/60 mt-12">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Other posts section */}
          {otherPosts.length > 0 && (
            <div className="pt-16 border-t border-border/80 mt-16 space-y-8">
              <h4 className="text-lg font-light tracking-wide font-serif text-center md:text-left">
                İlginizi Çekebilecek <span className="italic">Diğer Makaleler</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherPosts.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/blog/${other.slug}`}
                    className="group flex gap-4 bg-card border border-border/40 p-4 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={other.image}
                        alt={other.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 overflow-hidden flex flex-col justify-center">
                      <span className="text-3xs text-primary uppercase font-bold tracking-wider block">
                        {other.category}
                      </span>
                      <h5 className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {other.title}
                      </h5>
                      <p className="text-3xs text-muted-foreground line-clamp-1">{other.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
