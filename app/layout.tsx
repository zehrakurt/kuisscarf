import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { FavoritesProvider } from '@/context/favorites-context'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant"
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kuisscarf.com.tr'),
  title: 'Kuisscarf | Premium Hijab & Şal Koleksiyonu',
  description: 'En kaliteli ipek, pamuk ve modal şallar. Türkiye\'nin en şık ve kaliteli hijab markası. Ücretsiz kargo ve hızlı teslimat.',
  keywords: 'hijab, şal, eşarp, ipek şal, modal şal, pamuk şal, tesettür, başörtüsü, kuisscarf şal modelleri',
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Kuisscarf | Premium Hijab & Şal Koleksiyonu',
    description: 'En kaliteli ipek, pamuk ve modal şallar. Türkiye\'nin en şık ve kaliteli hijab markası. Ücretsiz kargo ve hızlı teslimat.',
    url: 'https://kuisscarf.com.tr',
    siteName: 'Kuisscarf',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuisscarf | Premium Hijab & Şal Koleksiyonu',
    description: 'En kaliteli ipek, pamuk ve modal şallar. Türkiye\'nin en şık ve kaliteli hijab markası.',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <html lang="tr" className="bg-background">
        <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
          <CartProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </CartProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    )
  }
