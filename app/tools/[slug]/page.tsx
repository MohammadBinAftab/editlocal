import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Film, LockKeyhole, ShieldCheck } from 'lucide-react';

import { findSeoTool, getSiteUrl, seoTools, siteName } from '@/lib/site';

type ToolPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return seoTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = findSeoTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      type: 'website',
      url: `/tools/${tool.slug}`,
      siteName,
      title: tool.title,
      description: tool.description,
    },
    twitter: { card: 'summary', title: tool.title, description: tool.description },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = findSeoTool(slug);
  if (!tool) notFound();

  const siteUrl = getSiteUrl();
  const related = seoTools.filter((item) => item.slug !== tool.slug).slice(0, 4);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.name} by ${siteName}`,
    url: `${siteUrl}/tools/${tool.slug}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any modern desktop browser',
    browserRequirements: 'Requires JavaScript and WebAssembly',
    description: tool.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: tool.features,
    isAccessibleForFree: true,
  };
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EditLocal', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${siteUrl}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${siteUrl}/tools/${tool.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, '\\u003c') }} />

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-[-0.03em]"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Film className="size-4" /></span>EditLocal</Link>
          <nav className="ml-auto flex items-center gap-5 text-sm text-muted-foreground"><Link href="/tools" className="hover:text-foreground">All tools</Link><Link href="/privacy" className="hover:text-foreground">Privacy</Link></nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-muted-foreground"><Link href="/">EditLocal</Link> <span className="mx-2">/</span> <Link href="/tools">Tools</Link> <span className="mx-2">/</span> {tool.name}</nav>
        <div className="rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-7 sm:p-11">
          <div className="mb-5 flex flex-wrap gap-2"><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">Free forever</span><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">No file upload</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">No watermark</span></div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.05em] sm:text-5xl">{tool.title.replace(/ — /g, '. ')}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{tool.answer}</p>
          <Link href={`/?tool=${tool.toolId}`} className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700">Open {tool.name}<ArrowRight className="size-4" /></Link>
        </div>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.035em]">What this tool does</h2>
            <ul className="mt-5 space-y-3">{tool.features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-6"><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-3" /></span>{feature}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <LockKeyhole className="size-6 text-violet-600" />
            <h2 className="mt-4 text-xl font-bold tracking-tight">Your media stays on your device</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">EditLocal uses browser APIs and a bundled WebAssembly media engine. The selected file is not sent to EditLocal, Vercel, or a remote conversion server. Vercel Analytics records page-level visits after deployment, not media contents.</p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-[-0.035em]">How to use {tool.name}</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">{tool.steps.map((step, index) => <li key={step} className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-bold uppercase tracking-widest text-violet-600">Step {index + 1}</span><p className="mt-2 text-sm leading-6">{step}</p></li>)}</ol>
        </section>

        <section className="mt-14 rounded-2xl bg-[#17151f] p-7 text-white sm:p-9">
          <ShieldCheck className="size-6 text-violet-300" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">An honest quality note</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">{tool.limitations}</p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-[-0.035em]">Common questions</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card px-6">{tool.faq.map((item) => <details key={item.question} className="group py-5"><summary className="cursor-pointer list-none pr-8 text-sm font-semibold marker:hidden">{item.question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{item.answer}</p></details>)}</div>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-xl font-bold tracking-tight">More free local tools</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-xl border border-border bg-card p-4 text-sm font-semibold transition hover:border-violet-300 hover:bg-violet-50">{item.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">{item.description}</span></Link>)}</div>
        </section>
      </article>
    </main>
  );
}
