import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';

import { getSiteUrl, seoTools, siteName, siteTagline } from '@/lib/site';
import './globals.css';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: { default: 'EditLocal — Free Video & Photo Tools, No Upload', template: '%s | EditLocal' },
  description: 'Free online video and photo editor without watermark. Reframe, compress, convert, add captions and voiceovers, remove green screens, and edit locally.',
  keywords: ['free video tools', 'private video editor', 'video aspect ratio converter', 'add captions to video', 'add voiceover to video', 'green screen remover', 'local image tools'],
  authors: [{ name: 'EditLocal' }],
  creator: 'EditLocal',
  publisher: 'EditLocal',
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName, title: 'EditLocal — Free Video & Photo Tools, No Upload', description: siteTagline, locale: 'en_US', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'EditLocal — Free video and photo tools with no uploads' }] },
  twitter: { card: 'summary_large_image', title: 'EditLocal — Free Private Media Tools', description: siteTagline, images: ['/og.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = { themeColor: '#6d28d9', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: siteName, description: siteTagline, inLanguage: 'en' },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}/#application`,
        name: siteName,
        url: siteUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any modern mobile or desktop browser',
        browserRequirements: 'Requires JavaScript and WebAssembly',
        description: 'A free browser-based toolkit that processes videos and photos locally without uploading media files.',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: seoTools.map((tool) => tool.name),
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        {children}
        <footer className="border-t border-border bg-[#17151f] px-5 py-10 text-white [content-visibility:auto] [contain-intrinsic-size:auto_360px]">
          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[1.2fr_1fr_1fr]">
            <div><p className="font-bold tracking-tight">EditLocal</p><p className="mt-2 max-w-sm text-sm leading-6 text-white/60">Free video and photo tools that process files on your device. No uploads, accounts, paid plans, or branded exports.</p></div>
            <nav aria-label="Popular tools"><p className="text-xs font-bold uppercase tracking-widest text-white/40">Popular tools</p><div className="mt-3 grid gap-2 text-sm text-white/70">{seoTools.slice(0, 5).map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="hover:text-white">{tool.name}</Link>)}</div></nav>
            <nav aria-label="EditLocal information"><p className="text-xs font-bold uppercase tracking-widest text-white/40">EditLocal</p><div className="mt-3 grid gap-2 text-sm text-white/70"><Link href="/tools" className="hover:text-white">All tools</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></div></nav>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
