import type { MetadataRoute } from 'next';
import { getSiteUrl, seoTools } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date('2026-09-01');
  return [
    { url: siteUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    ...seoTools.map((tool) => ({ url: `${siteUrl}/tools/${tool.slug}`, lastModified, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${siteUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
