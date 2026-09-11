import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/account/*',
          '/checkout',
          '/checkout/*',
          '/order-confirmation',
          '/order-confirmation/*',
          '/reset-password',
          '/forgot-password',
          '/api/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/checkout',
          '/order-confirmation',
          '/api/*',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin',
          '/account',
          '/checkout',
          '/order-confirmation',
          '/api/*',
        ],
      },
    ],
    sitemap: 'https://soleva.in/sitemap.xml',
    host: 'https://soleva.in',
  };
}
