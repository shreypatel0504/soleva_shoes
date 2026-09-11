import { MetadataRoute } from 'next';

const BASE_URL = 'https://soleva.in';

const PRODUCT_SLUGS = [
  'aerocell-kinetic-runner',
  'veloce-monaco-minimalist',
  'stratos-terra-hybrid-gore-x',
  'apexlab-hypervelocity-carbon',
  'soleva-street-drift-low',
  'aeropulse-swiftstride-slip-on',
  'apexlab-gravity-court-high-top',
  'veloce-riviera-suede-driver',
  'soleva-apex-phantom-triple-black',
  'aeropulse-cloudburst-endurance',
  'stratos-alpine-trekker-mid',
  'veloce-firenze-chelsea-boot-sneaker',
  'soleva-aeroglide-velocity-3',
  'aeropulse-studio-flow-trainer',
  'apexlab-quantum-warp-tech',
  'stratos-canyon-sandal-hybrid',
  'soleva-urban-drift-high',
  'veloce-roma-perforated-derby',
  'aeropulse-freespirit-flex-knit',
  'apexlab-aeroshield-cross-trainer',
  'soleva-skyhop-junior-spark',
  'stratos-stormchaser-winter-boot',
  'veloce-venezia-knit-loafer',
  'apexlab-orbit-fly-low-drop',
];

const CATEGORIES = [
  'running',
  'sneakers',
  'lifestyle',
  'sports',
  'basketball',
  'casual',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Primary static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Category collection routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/shop?category=${cat}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Gender & Feature collection routes
  const featureRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/shop?gender=men`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/shop?gender=women`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/shop?gender=kids`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/shop?isNewArrival=true`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/shop?onSale=true`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
  ];

  // Dynamic Product Pages (all 24 luxury models)
  const productRoutes: MetadataRoute.Sitemap = PRODUCT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...featureRoutes, ...categoryRoutes, ...productRoutes];
}
