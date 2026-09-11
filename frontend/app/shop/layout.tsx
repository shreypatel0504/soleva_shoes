import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Footwear | SOLEVA India — Running, Sneakers, Court & Trail',
  description:
    'Explore the full SOLEVA India luxury and performance footwear catalogue. Discover carbon-plate marathon runners, handcrafted Italian calfskin sneakers, all-terrain Gore-X trainers, and limited edition drops. Free delivery across India.',
  keywords: [
    'buy shoes online India',
    'luxury running sneakers',
    'marathon racing shoes India',
    'high-top sneakers',
    'mens sneakers India',
    'womens running shoes',
    'court sneakers',
    'SOLEVA catalog',
  ],
  alternates: {
    canonical: 'https://soleva.in/shop',
  },
  openGraph: {
    title: 'Shop All Footwear | SOLEVA India',
    description:
      'Engineered for ultimate velocity and street dominance. Explore all 24 luxury athletic silhouettes.',
    url: 'https://soleva.in/shop',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
        width: 1200,
        height: 630,
        alt: 'SOLEVA Luxury Footwear Catalog',
      },
    ],
  },
};

const jsonLdShopBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://soleva.in',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Shop All Footwear',
      item: 'https://soleva.in/shop',
    },
  ],
};

const jsonLdCollection = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'SOLEVA Luxury Footwear Collection',
  url: 'https://soleva.in/shop',
  description:
    'Complete collection of progressive performance runners, carbon racing silhouettes, and luxury street footwear.',
  provider: {
    '@type': 'Organization',
    name: 'SOLEVA India',
    url: 'https://soleva.in',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdShopBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }}
      />
      {children}
    </>
  );
}
