import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Film, ShieldCheck } from 'lucide-react';

import { seoTools } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Free Video and Photo Tools — No Upload',
  description: 'Browse free tools to reframe, caption, add voiceovers, remove green screens, compress, convert, crop, merge, and clean media locally.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-[-0.03em]"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Film className="size-4" /></span>EditLocal</Link>
        <div className="mt-12 max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"><ShieldCheck className="size-3.5" /> Files never upload</span><h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Free video and photo tools, all in one private workspace.</h1><p className="mt-5 text-base leading-7 text-muted-foreground">Every EditLocal tool processes files on your device. There are no accounts, paid plans, credits, branded exports, or remote conversion queues.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{seoTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg"><h2 className="font-bold tracking-tight">{tool.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p><span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">Learn and open tool <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span></Link>)}</div>
      </div>
    </main>
  );
}
