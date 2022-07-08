/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const production = process.env.NODE_ENV === 'production';

const ContentSecurityPolicy = `
  default-src 'self';
  connect-src 'self' https://api.covegg19.com vitals.vercel-insights.com;
  img-src 'self' lh3.googleusercontent.com res.cloudinary.com data: https:;
  style-src 'self'; object-src 'none';
`;

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Referrer-Policy',
    value: 'no-referrer',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    // https://github.com/GoogleChrome/workbox/issues/1790
    disable: !production,
    // https://github.com/shadowwalker/next-pwa/issues/288
    buildExcludes: [/middleware-manifest\.json$/],
  },
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
  swcMinify: true,
  async headers() {
    // only apply security headers in production
    return production
      ? [
          {
            source: '/(.*)',
            headers: securityHeaders,
          },
        ]
      : [];
  },
});
