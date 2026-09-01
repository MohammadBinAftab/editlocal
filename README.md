# EditLocal

EditLocal is a private video and photo toolkit. Media is read, analyzed, processed, and exported inside the browser on the current device. There is no upload API, account, or remote media-processing service. Vercel Web Analytics measures page visits after a Vercel deployment but never receives the selected media files.

Every tool and quality setting is free and unlocked. There are no subscriptions, paid plans, credits, watermarked exports, usage quotas, or account requirements.

## Start locally

Requirements: Node.js 22.13 or newer.

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000` in Chrome or Edge. The first media operation loads the bundled local FFmpeg WebAssembly engine; it does not download the engine from a CDN.

You can also run `./start-editlocal.ps1` from PowerShell. It installs dependencies on the first run and starts the local interface.

## Included tools

- Motion-and-detail smart reframing for 9:16, 16:9, 1:1, and 4:5
- Background fill and full-frame fit modes
- Video compression, conversion, trim, crop, merge, speed, audio extraction, and GIF creation
- Image compression, conversion, resizing, cropping, and visible-overlay cleanup
- Authorized visible-watermark cleanup for video and photos
- Fast, High, and Maximum quality settings, all included for everyone

Every editor is available from the mobile all-tools menu and quick selector. The editor supports screens down to 320 pixels wide, uses touch-sized controls, and does not remove photo tools or advanced settings on mobile.

## Important notes

- Aspect conversion that fills a differently shaped frame must crop, pad, deform, or generate pixels. EditLocal exposes the choice rather than hiding it.
- Smart reframe analyzes low-resolution samples and produces a smoothed camera path before the final full-resolution render.
- Merge uses stream copying and therefore expects compatible clips. Convert incompatible clips to the same format first.
- Browser memory limits vary. Long 4K files work best on a desktop with other memory-heavy applications closed.
- Cleanup is intended only for media you own or are authorized to edit. It does not remove DRM or provenance data.

## Validation

The production build is generated with:

```powershell
npm run build
```

## Production SEO and analytics setup

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the final public HTTPS origin, without a trailing slash.
2. Add the Google Search Console HTML verification token as `GOOGLE_SITE_VERIFICATION`.
3. Deploy the site to Vercel and enable Web Analytics for the project. The `@vercel/analytics` component is already installed in the root layout.
4. Submit `https://your-domain.example/sitemap.xml` in Google Search Console and request indexing for the home page and key tool pages.

The generated robots file, sitemap, canonical URLs, per-tool metadata, internal links, and structured data all use `NEXT_PUBLIC_SITE_URL`. Search engines ultimately control crawling, indexing, and ranking, so no position can be guaranteed.

## Measuring search rankings

Use Google Search Console after the public site is verified:

1. Open **Performance → Search results** and enable **Average position**, **Clicks**, **Impressions**, and **CTR**.
2. Open **Queries** and filter an exact feature phrase such as `compress video online free`.
3. Open **Pages** to confirm that the matching EditLocal feature page is ranking.
4. Compare country, mobile versus desktop, and the last 28 days against the previous period.

A manual Google search like the screenshot is useful for a quick spot check, but it can vary by search history, location, device, language, and live ranking changes. Search Console trends are the better measurement. Test public loading performance with Google PageSpeed Insights for both mobile and desktop after every significant release.
