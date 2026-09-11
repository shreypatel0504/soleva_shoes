import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const viewport: Viewport = {
  themeColor: '#0C0C0E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://soleva.in'),
  title: {
    default: 'SOLEVA India | Engineered Performance & Luxury Footwear',
    template: '%s | SOLEVA India',
  },
  description:
    'Experience the future of movement. SOLEVA India crafts progressive athletic silhouettes, carbon-plate marathon racers, and artisanal luxury sneakers engineered in Bengaluru. Free insured delivery across India.',
  keywords: [
    'SOLEVA India',
    'luxury sneakers India',
    'running shoes India',
    'carbon plate marathon shoes',
    'athletic footwear',
    'streetwear sneakers',
    'performance running shoes',
    'AeroCell kinetic',
    'buy shoes online India',
    'premium sports footwear Bengaluru',
  ],
  authors: [{ name: 'SOLEVA India Atelier', url: 'https://soleva.in' }],
  creator: 'SOLEVA India',
  publisher: 'SOLEVA Footwear Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://soleva.in',
  },
  openGraph: {
    title: 'SOLEVA India | Engineered Performance & Luxury Footwear',
    description:
      'Engineered for ultimate velocity, street dominance, and unyielding comfort across every Indian terrain. Free delivery across India on orders over ₹14,000.',
    url: 'https://soleva.in',
    siteName: 'SOLEVA India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
        width: 1200,
        height: 630,
        alt: 'SOLEVA AeroCell Kinetic Runner — Luxury Footwear India',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLEVA India | Engineered Performance & Luxury Footwear',
    description:
      'Progressive performance footwear designed for discerning movement. Engineered in Bengaluru.',
    site: '@solevaindia',
    creator: '@solevaindia',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SOLEVA India',
  legalName: 'SOLEVA Footwear Private Limited',
  url: 'https://soleva.in',
  logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
  description:
    'Manufacturer and retailer of luxury engineered footwear, marathon running shoes, and artisanal sneakers in India.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'UB City, Level 14, Concorde Block, Vittal Mallya Road',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-1800-209-8888',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/solevaindia',
    'https://twitter.com/solevaindia',
    'https://www.youtube.com/@solevaindia',
  ],
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SOLEVA India',
  url: 'https://soleva.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://soleva.in/shop?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-[#0C0C0E] text-[#EDEDED] antialiased selection:bg-white selection:text-black">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AnnouncementBar />
                <Navbar />
                <CartDrawer />
                <main className="flex-1">{children}</main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
