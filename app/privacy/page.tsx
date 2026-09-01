import type { Metadata } from 'next';
import Link from 'next/link';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy — Your Media Never Uploads',
  description: 'EditLocal processes videos and photos locally. Learn what stays on your device and what page-level Vercel Analytics measures.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <main className="min-h-screen bg-background px-5 py-12 text-foreground"><article className="mx-auto max-w-3xl"><Link href="/" className="flex items-center gap-2.5 font-bold"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Film className="size-4" /></span>EditLocal</Link><h1 className="mt-12 text-4xl font-bold tracking-[-0.05em]">Privacy at EditLocal</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Your selected videos, photos, and extracted audio are processed on your device and are not uploaded to EditLocal, Vercel Analytics, or a remote conversion server.</p><h2 className="mt-10 text-2xl font-bold">Media processing</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground"><li>Files are opened only after you select or drop them.</li><li>The local browser engine reads and writes temporary data for the current operation.</li><li>Results are delivered as local downloadable files.</li><li>EditLocal does not create an account or remote media library.</li></ul><h2 className="mt-10 text-2xl font-bold">Vercel Web Analytics</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">After the website is deployed to a Vercel project with Web Analytics enabled, Vercel may receive page-view and visitor measurement data through its analytics routes. This integration is used to understand visits and navigation. It is separate from the media engine and does not receive file names, media bytes, previews, exports, or editing selections.</p><h2 className="mt-10 text-2xl font-bold">Visible-overlay cleanup</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Cleanup tools are intended only for media the user owns or is authorized to modify. They target a selected visible region and do not remove DRM or authenticity/provenance systems.</p><p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">Last updated: September 1, 2026</p></article></main>;
}
