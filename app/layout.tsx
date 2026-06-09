import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
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
  title: 'Kuisscarf | Premium Hijab & Şal Koleksiyonu',
  description: 'En kaliteli ipek, pamuk ve modal şallar. Türkiye\'nin en şık hijab markası. Ücretsiz kargo ve hızlı teslimat.',
  keywords: 'hijab, şal, eşarp, ipek şal, modal şal, pamuk şal, tesettür, başörtüsü',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        },
      ],
      apple: '/apple-icon.png',
    },
  }
  
  import { FavoritesProvider } from '@/context/favorites-context'

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
