# Architecture Patterns — Scopal Firm Website

**Domain:** Law firm marketing site (Corporate / Fractional GC / Legal Coaching)
**Stack:** Astro 6 + Tailwind CSS v4 + Vercel
**Researched:** 2026-05-07
**Overall confidence:** HIGH for stack patterns; MEDIUM for opinionated URL choices

---

## Executive Summary

Scopal is a content-heavy marketing site (~15-20 pages at launch + a growing
blog) with **one** dynamic surface: the contact form. The recommended
architecture is therefore an Astro static-first site with **a single server
route** (`/api/contact`), deployed on Vercel via `@astrojs/vercel`. Everything
else prerenders to HTML for Lighthouse 90+ out of the box.

The site uses **content collections** for blog, practice areas, and team
bios so copy, schema, and disclaimers stay in version-controlled
markdown/MDX rather than scattered across `.astro` files. SEO meta, JSON-LD,
and the firm-wide attorney-client disclaimer are injected via a layered
layout system (`BaseLayout` → `MarketingLayout` / `BlogPostLayout` /
`PracticeAreaLayout`).

---

## 1. URL Structure & Site Map

### Decision: `/practice-areas/[slug]` (HIGH confidence)

Both `/services/` and `/practice-areas/` are SEO-acceptable; Google ranks on
URL clarity and keyword inclusion, not folder name. For a **law firm**,
`/practice-areas/` is the established convention readers expect, matches
how legal directories link out, and reads as more authoritative than
"services" (which evokes consumer/SaaS product pages).

The non-negotiable rule from the project brief — "each practice area on its
own URL" — is satisfied by either prefix; we pick `/practice-areas/` for
domain-fit.

### Recommended Site Map (v1)

```
/                                       Homepage (StoryBrand structured)
/about                                  Firm story, values, AI-native positioning
/practice-areas/                        Index of all 3 practice areas
/practice-areas/corporate-law           Corporate / commercial contracting
/practice-areas/fractional-general-counsel    Outside GC / fractional GC
/practice-areas/legal-executive-coaching      Coaching offering
/attorneys/                             Team index (Scott + Rachel)
/attorneys/scott-palmer                 Principal attorney bio
/team/rachel-palmer                     Operations bio (non-attorney → /team/, not /attorneys/)
/pricing                                Engagement model: subscription + flat-fee
/blog/                                  Blog index, paginated
/blog/[slug]                            Individual posts
/contact                                Contact form (with disclaimer above submit)
/legal/disclaimer                       Long-form disclaimer (linked from footer)
/legal/privacy                          Privacy policy (NJ + general)
/legal/terms                            Terms of use
/sitemap.xml                            Auto-generated (@astrojs/sitemap)
/robots.txt                             Static
/api/contact                            POST-only serverless route (NOT indexed)
```

### Why separate `/attorneys/` and `/team/`?

Bar ethics rules in many jurisdictions distinguish licensed attorneys from
non-attorney staff. Putting Rachel under `/attorneys/rachel-palmer` could
imply she's an attorney. `/team/` for non-attorneys is the safest pattern
and matches what NJ and MD bar opinions on attorney advertising prefer.

### Slugs

- All slugs **kebab-case**, lowercase, no trailing slashes (Vercel default).
- Keep slugs 45-75 chars total URL length where possible (SEO sweet spot).
- Practice-area slugs include the keyword someone would Google
  ("fractional-general-counsel", not "outside-gc").

---

## 2. Astro Project Directory Structure

This is the recommended Astro 6 layout for this project. It uses **content
collections with the v6 glob loader pattern** and co-locates schema with
the data.

```
scopal-website/
├── public/                              Static assets served as-is
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-default.jpg                   Default Open Graph image (1200x630)
│   ├── robots.txt
│   └── fonts/                           Self-hosted woff2 (see §8 perf)
│
├── src/
│   ├── assets/                          Images Astro should optimize
│   │   ├── headshots/
│   │   │   ├── scott-palmer.jpg
│   │   │   └── rachel-palmer.jpg
│   │   ├── og/                          Per-page OG images (auto-generated optional)
│   │   └── icons/
│   │
│   ├── content/                         Content collections
│   │   ├── blog/
│   │   │   ├── 2026-05-07-what-is-fractional-gc.mdx
│   │   │   └── ...
│   │   ├── practice-areas/
│   │   │   ├── corporate-law.mdx
│   │   │   ├── fractional-general-counsel.mdx
│   │   │   └── legal-executive-coaching.mdx
│   │   └── team/
│   │       ├── scott-palmer.mdx
│   │       └── rachel-palmer.mdx
│   │
│   ├── content.config.ts                v6 collection schemas (Zod)
│   │
│   ├── components/                      Reusable .astro components
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   └── MobileMenu.astro
│   │   ├── seo/
│   │   │   ├── SEO.astro                <title>, meta, OG, Twitter, canonical
│   │   │   ├── JsonLd.astro             Generic JSON-LD <script> wrapper
│   │   │   ├── LegalServiceSchema.astro Homepage schema
│   │   │   ├── PersonSchema.astro       Attorney bios
│   │   │   ├── ArticleSchema.astro      Blog posts
│   │   │   ├── BreadcrumbSchema.astro   Interior pages
│   │   │   └── FAQSchema.astro          Practice area FAQs
│   │   ├── marketing/
│   │   │   ├── Hero.astro
│   │   │   ├── CTASection.astro
│   │   │   ├── PracticeAreaCard.astro
│   │   │   ├── TeamMemberCard.astro
│   │   │   ├── PricingCard.astro
│   │   │   ├── ProblemAgitation.astro   StoryBrand "the problem" block
│   │   │   ├── HowItWorks.astro         StoryBrand 3-step plan
│   │   │   ├── SocialProofStrip.astro
│   │   │   └── FAQ.astro                Renders FAQ + emits FAQSchema
│   │   ├── content/
│   │   │   ├── Prose.astro              Tailwind typography wrapper
│   │   │   ├── Callout.astro            Info / disclaimer callouts
│   │   │   └── BlogCard.astro
│   │   ├── form/
│   │   │   ├── ContactForm.astro        Form markup + client validation
│   │   │   ├── FormField.astml          Generic input + label + error
│   │   │   ├── Honeypot.astro           Hidden anti-spam field
│   │   │   └── DisclaimerNotice.astro   Above-submit ABA 477R notice
│   │   └── legal/
│   │       └── FooterDisclaimer.astro   Site-wide attorney-client disclaimer
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro             <html>, <head>, fonts, SEO, Header, Footer
│   │   ├── MarketingLayout.astro        Wraps BaseLayout for marketing pages
│   │   ├── BlogPostLayout.astro         Wraps BaseLayout, adds prose, post disclaimer
│   │   └── PracticeAreaLayout.astro     Wraps BaseLayout, adds FAQ + practice disclaimer
│   │
│   ├── pages/
│   │   ├── index.astro                  /
│   │   ├── about.astro                  /about
│   │   ├── pricing.astro                /pricing
│   │   ├── contact.astro                /contact
│   │   ├── practice-areas/
│   │   │   ├── index.astro              /practice-areas/
│   │   │   └── [slug].astro             /practice-areas/[slug] (from collection)
│   │   ├── attorneys/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── team/
│   │   │   └── [slug].astro
│   │   ├── blog/
│   │   │   ├── index.astro              Paginated index
│   │   │   └── [slug].astro
│   │   ├── legal/
│   │   │   ├── disclaimer.astro
│   │   │   ├── privacy.astro
│   │   │   └── terms.astro
│   │   ├── api/
│   │   │   └── contact.ts               POST endpoint (server-rendered)
│   │   ├── 404.astro
│   │   └── rss.xml.ts                   RSS feed for blog
│   │
│   ├── lib/                             Pure TS utilities (no .astro)
│   │   ├── seo.ts                       buildCanonical(), buildOg(), defaults
│   │   ├── schema/
│   │   │   ├── legalService.ts          Builds LegalService JSON-LD object
│   │   │   ├── person.ts
│   │   │   ├── article.ts
│   │   │   └── breadcrumb.ts
│   │   ├── contact/
│   │   │   ├── validate.ts              Zod schema (shared client+server)
│   │   │   ├── rateLimit.ts             IP-based limiter
│   │   │   └── notify.ts                Email/DB dispatcher (provider TBD)
│   │   └── constants.ts                 NAP, bar admissions, social URLs
│   │
│   └── styles/
│       └── global.css                   Tailwind v4 directives + tokens
│
├── astro.config.mjs                     Integrations: vercel, sitemap, mdx
├── tailwind.config.mjs                  (Tailwind v4: most config in CSS)
├── tsconfig.json
├── vercel.json                          Security headers (per FIRM_BRIEF)
├── .env.example                         Documents required env vars
├── .gitignore                           Includes .env, .env.local, dist/
└── package.json
```

### Content collection schema (`src/content.config.ts`)

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.literal('scott-palmer'),     // brief: every post attributed to Scott
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const practiceAreas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/practice-areas' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),               // for nav
    description: z.string().max(160),
    order: z.number(),                    // controls index page sort
    icon: z.string().optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    isAttorney: z.boolean(),
    barAdmissions: z.array(z.object({
      state: z.string(), year: z.number(), status: z.enum(['active','pending']),
    })).default([]),
    education: z.array(z.string()).default([]),
    headshot: z.string(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
  }),
});

export const collections = { blog, practiceAreas, team };
```

---

## 3. Component Inventory

Component contracts (props) for the build. All `.astro` components unless noted.

### Layout components

| Component | Props | Responsibility |
|---|---|---|
| `Header` | `currentPath: string` | Logo, nav, sticky CTA button |
| `Nav` | `items: NavItem[]; currentPath: string` | Renders desktop nav, marks active |
| `MobileMenu` | `items: NavItem[]` | Slide-out drawer (vanilla JS, no React) |
| `Footer` | `barAdmissions: BarAdmission[]` | NAP, social, legal links, **firm-wide disclaimer** |

### SEO components

| Component | Props | Responsibility |
|---|---|---|
| `SEO` | `title; description; canonical?; ogImage?; ogType?='website'; noindex?=false` | Renders all `<meta>` + Twitter + canonical in `<head>` |
| `JsonLd` | `data: object` | Single typed `<script type="application/ld+json">` |
| `LegalServiceSchema` | (none — reads constants) | Renders firm-level JSON-LD on homepage + about |
| `PersonSchema` | `attorney: TeamEntry` | Per-attorney JSON-LD |
| `ArticleSchema` | `post: BlogEntry; url: string` | Per-blog-post JSON-LD |
| `BreadcrumbSchema` | `crumbs: { name; url }[]` | Interior pages |
| `FAQSchema` | `faqs: { q; a }[]` | Practice area pages |

### Marketing components

| Component | Props | Responsibility |
|---|---|---|
| `Hero` | `eyebrow?; headline; subhead; primaryCta: {label,href}; secondaryCta?` | Above-fold StoryBrand hero |
| `CTASection` | `headline; subhead?; ctaLabel='Schedule a Consultation'; ctaHref='/contact'; variant?='dark'` | Reusable CTA band |
| `PracticeAreaCard` | `title; description; href; icon?` | Grid card on home + index |
| `TeamMemberCard` | `name; role; headshot; href; isAttorney` | Grid card |
| `PricingCard` | `tier; price; cadence; features: string[]; ctaHref; featured?=false` | Subscription tiers + flat-fee |
| `ProblemAgitation` | `external; internal; philosophical` | Names the 3 problem layers |
| `HowItWorks` | `steps: { n; title; body }[]` | The plan, removes ambiguity |
| `SocialProofStrip` | `items: string[]` | Client types / deal types |
| `FAQ` | `faqs; emitSchema?=true` | Renders Q/A + optional JSON-LD |

### Content components

| Component | Props | Responsibility |
|---|---|---|
| `Prose` | (slot) | Tailwind typography wrapper |
| `Callout` | `variant: 'info'\|'disclaimer'\|'warning'` | Boxed callout |
| `BlogCard` | `post: BlogEntry` | Index card |

### Form components

| Component | Props | Responsibility |
|---|---|---|
| `ContactForm` | `endpoint='/api/contact'` | Form markup, progressive enhancement, client validation |
| `FormField` | `name; label; type='text'; required?; error?; helpText?` | Label + input + error slot |
| `Honeypot` | `name='_gotcha'` | Visually hidden anti-spam input |
| `DisclaimerNotice` | (none) | Required ABA 477R notice above submit |

### Legal components

| Component | Props | Responsibility |
|---|---|---|
| `FooterDisclaimer` | `barAdmissions` | Site-wide disclaimer + jurisdiction statement |

---

## 4. Layout System

Astro layouts compose by **nesting**, not inheritance. The recommended
hierarchy:

```
BaseLayout                                (always outermost)
├── <html><head> + SEO + JSON-LD slot
├── <Header />
├── <slot />                              ← child layout renders here
├── <Footer /> (contains FooterDisclaimer)
└── </body></html>
       │
       ├── MarketingLayout
       │   └── <slot />                   ← page content (.astro files)
       │
       ├── BlogPostLayout
       │   ├── <Breadcrumb />
       │   ├── <ArticleSchema />
       │   ├── <article><Prose><slot/></Prose></article>
       │   ├── <Callout variant="disclaimer">…blog disclaimer…</Callout>
       │   └── <CTASection />
       │
       └── PracticeAreaLayout
           ├── <Breadcrumb />
           ├── <Hero />
           ├── <slot />                   ← practice area body
           ├── <FAQ faqs={frontmatter.faqs} />
           ├── <Callout variant="disclaimer">…practice area disclaimer…</Callout>
           └── <CTASection />
```

**`BaseLayout.astro` is the only layout that emits `<html>`.** Nested
layouts are just components that render a `<slot/>` and hand off to
`BaseLayout` themselves. Pattern:

```astro
---
// BlogPostLayout.astro
import BaseLayout from './BaseLayout.astro';
const { post, ...seo } = Astro.props;
---
<BaseLayout {...seo} ogType="article">
  <article class="prose">
    <slot />
  </article>
  <Callout variant="disclaimer">{BLOG_DISCLAIMER}</Callout>
  <CTASection />
</BaseLayout>
```

### Where each non-negotiable disclaimer lives

| Disclaimer | Lives in | Renders on |
|---|---|---|
| Footer attorney-client disclaimer | `Footer.astro` → `FooterDisclaimer.astro` | Every page (via `BaseLayout`) |
| Blog post disclaimer | `BlogPostLayout.astro` | Every blog post |
| Practice-area disclaimer | `PracticeAreaLayout.astro` | Every practice-area page |
| Contact form ABA 477R notice | `DisclaimerNotice.astro` (in `ContactForm`) | `/contact` |
| Jurisdiction statement (MD active, NJ pending) | `FooterDisclaimer.astro` | Every page |

This guarantees that adding a new page **cannot** accidentally omit a required disclaimer — the layout enforces it.

---

## 5. SEO Architecture

### `BaseLayout` head additions

```astro
---
// BaseLayout.astro
import SEO from '@/components/seo/SEO.astro';
import JsonLd from '@/components/seo/JsonLd.astro';
import { buildCanonical } from '@/lib/seo';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  jsonLd?: object | object[];
}
const { title, description, ogImage, ogType, noindex, jsonLd } = Astro.props;
const canonical = buildCanonical(Astro.url);
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO {title} {description} {canonical} {ogImage} {ogType} {noindex} />
    {jsonLd && <JsonLd data={jsonLd} />}
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <Header currentPath={Astro.url.pathname} />
    <main><slot /></main>
    <Footer />
  </body>
</html>
```

### `SEO.astro` outputs (every page)

- `<title>` — `${pageTitle} — ${city} | Scopal Firm` (≤60 chars)
- `<meta name="description">` — ≤155 chars
- `<link rel="canonical" href={canonical}>`
- Open Graph: `og:title`, `og:description`, `og:url`, `og:type`,
  `og:image`, `og:site_name`, `og:locale`
- Twitter: `twitter:card=summary_large_image`, `twitter:title`,
  `twitter:description`, `twitter:image`
- `<meta name="robots" content="noindex">` only when `noindex=true`
  (used on `/legal/*` per firm preference, never on practice areas)

### JSON-LD strategy

One JSON-LD strategy per page type. **Never duplicate `LegalService` on
every page** — Google treats that as spammy. Place it on `/` and `/about`
only. Use `BreadcrumbList` everywhere else.

| Page | JSON-LD types |
|---|---|
| `/` | `LegalService` (which is-a `LocalBusiness`) + `WebSite` (with `SearchAction`) |
| `/about` | `LegalService` reference + `Organization` |
| `/attorneys/[slug]` | `Person` + `BreadcrumbList` |
| `/practice-areas/[slug]` | `Service` + `FAQPage` + `BreadcrumbList` |
| `/blog/[slug]` | `Article` (or `BlogPosting`) + `BreadcrumbList` |
| `/contact` | `ContactPage` + `BreadcrumbList` |

### Sitemap & robots

- `@astrojs/sitemap` integration generates `/sitemap-index.xml` automatically.
- Static `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /api/
  Sitemap: https://scopalfirm.com/sitemap-index.xml
  ```

---

## 6. Local SEO (Annandale, NJ — National Service)

### Structured-data approach

Use `LegalService` (subclass of `LocalBusiness`) with a **physical
location in Annandale** and a **national `areaServed`**. This is the
correct pattern for a firm with one office that serves nationally.

```jsonc
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": "https://scopalfirm.com/#firm",
  "name": "Scopal Firm, LLC",
  "url": "https://scopalfirm.com",
  "logo": "https://scopalfirm.com/logo.png",
  "image": "https://scopalfirm.com/og-default.jpg",
  "telephone": "+1-XXX-XXX-XXXX",         // confirm with Scott before launch
  "email": "scott@scopalfirm.com",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[street]",
    "addressLocality": "Annandale",
    "addressRegion": "NJ",
    "postalCode": "[zip]",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "knowsAbout": [
    "Corporate law", "Commercial contracting", "SaaS contracts",
    "Data privacy", "AI governance", "Fractional general counsel"
  ],
  "founder": { "@id": "https://scopalfirm.com/attorneys/scott-palmer#person" },
  "employee": [{ "@id": "https://scopalfirm.com/attorneys/scott-palmer#person" }],
  "hasOfferCatalog": { ... services list ... }
}
```

### NAP — yes, required

NAP (Name / Address / Phone) **must** be consistent across:
1. Site footer (visible)
2. JSON-LD `LegalService` (machine-readable)
3. Google Business Profile
4. Any directory listings (Avvo, Martindale, NJ Bar)

Even though Scopal serves nationally, AI answer engines (Perplexity,
ChatGPT, Google AI Overviews) cross-reference NAP across sources to
decide which firm to cite. Inconsistency = no citation.

**Decision needed before launch:** confirm whether to publish a real
street address or a registered-agent address. Many fully-remote firms
use a P.O. box or registered agent for the public address while keeping
the residential address private. Scott should choose; both are
ABA-permissible.

---

## 7. Contact Form Architecture

### Astro 6 output mode

Set `output: 'static'` and selectively prerender. The **only** server
route is `/api/contact`. Mark it `export const prerender = false;` and
leave every other route prerendered. This keeps the entire marketing site
on Vercel's CDN edge with HTML cached aggressively, while the form
submission handler runs as a single Vercel Function.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://scopalfirm.com',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [mdx(), sitemap()],
});
```

### Data flow (end-to-end)

```
┌────────────────────┐   1. User fills form on /contact
│  Browser           │   2. Client-side Zod validation (instant feedback)
│  ContactForm.astro │   3. fetch('/api/contact', { method: 'POST', body: JSON })
└──────────┬─────────┘
           │ HTTPS POST + JSON body
           ▼
┌────────────────────────────────────────┐
│  Vercel Function: /api/contact.ts      │
│  ─────────────────────────────────────  │
│  a. Verify Origin header (CSRF guard) │
│  b. Check honeypot (_gotcha empty?)   │  ← bot reject (silent 200)
│  c. Rate limit by IP (max 5 / 10 min) │  ← over-limit reject (429)
│  d. Server-side Zod re-validate       │  ← malformed reject (400)
│  e. Strip / sanitize fields           │
│  f. Persist lead (provider TBD)       │
│  g. Notify Scott (email, provider TBD)│
│  h. Return { ok: true, id }           │
└──────────┬──────────────────┬──────────┘
           │                  │
           ▼                  ▼
   ┌──────────────┐    ┌─────────────────┐
   │  Lead store  │    │  Email to Scott │
   │  (TBD)       │    │  (TBD provider) │
   │  RLS on tbl  │    │  + reply-to=user│
   └──────────────┘    └─────────────────┘
           │
           ▼
┌────────────────────┐
│  Browser           │   4. Show success state inline (no redirect)
│                    │   5. Optionally surface Calendly link in success
└────────────────────┘
```

### `/api/contact.ts` skeleton

```ts
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { contactSchema } from '@/lib/contact/validate';
import { rateLimit } from '@/lib/contact/rateLimit';
import { notify } from '@/lib/contact/notify';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // a. Origin check
  const origin = request.headers.get('origin') ?? '';
  if (!origin.endsWith('scopalfirm.com') && !origin.includes('localhost')) {
    return new Response('Forbidden', { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return new Response('Bad Request', { status: 400 }); }

  // b. Honeypot
  if ((body as any)?._gotcha) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // c. Rate limit
  if (!(await rateLimit(clientAddress))) {
    return new Response('Too Many Requests', { status: 429 });
  }

  // d. Validate
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ errors: parsed.error.flatten() }),
      { status: 400, headers: { 'content-type': 'application/json' } });
  }

  // e-g. Persist + notify (provider chosen in contact-form phase)
  const id = await notify(parsed.data);

  return new Response(JSON.stringify({ ok: true, id }),
    { status: 200, headers: { 'content-type': 'application/json' } });
};
```

### Provider decision (deferred — per `.claude/CLAUDE.md`)

Three viable paths; Scott picks based on his intake workflow:

1. **Supabase + Resend** — leads stored in Postgres with RLS, email via
   Resend. Best if Scott wants searchable history.
2. **Formspree / Web3Forms** — third-party form backend, no DB. Simplest,
   works without writing storage code.
3. **Direct email via Resend / Postmark only** — no DB, just a
   notification email. Fine for a referral-driven firm at v1 volume.

All three plug into the same `/api/contact.ts` shape via the
`notify()` adapter.

---

## 8. Performance Architecture (Lighthouse 90+)

### Image strategy

- **All site images live in `src/assets/`** (not `public/`) so Astro's
  built-in `astro:assets` pipeline can hash, resize, and reformat them.
- Use the `<Image />` component (from `astro:assets`) with explicit
  `widths` and `sizes` — this auto-emits `srcset` and prevents CLS by
  inferring `width`/`height`.
- Use `<Picture />` for art-directed hero images, with `formats={['avif','webp']}`
  and a JPEG fallback.
- **Above-the-fold image** (hero on `/`): `loading="eager"` + `fetchpriority="high"`.
  Every other image: `loading="lazy"` + `decoding="async"`.
- 200 KB max committed source per the brief; export targets typically 30-80 KB
  after AVIF conversion.

### Font loading

- **Self-host woff2** in `public/fonts/`. No Google Fonts in production
  (extra DNS, CSP complexity, GDPR concerns).
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the one
  weight used above the fold.
- `font-display: swap` in `@font-face` to prevent invisible text.
- Limit to 2 families × 2 weights total (one display, one body × 400/600).

### CSS strategy (Tailwind v4)

- Tailwind v4 uses the Lightning CSS engine and JIT — no purge config
  needed; only used utilities ship.
- Global tokens (brand orange, blue, font stacks) defined in
  `src/styles/global.css` via `@theme` block.
- Astro automatically scopes per-component `<style>`, no CSS-in-JS overhead.

### JavaScript budget

- **Default: zero JS shipped.** Astro renders to static HTML.
- The few interactive bits (mobile menu, contact form) use **vanilla JS in
  a `<script>` block** at the page level — no React/Vue/Solid island
  unless we hit a real need (we won't on v1).
- This keeps the JS payload under ~5 KB, the largest single Lighthouse-90 lever.

### Vercel-specific wins

- `vercel.json` `headers` block sets long `Cache-Control` on `/_astro/*`
  (Astro hashes filenames so this is safe).
- HTML pages get `s-maxage=0, stale-while-revalidate=60` so edits ship fast
  but the edge still serves cached HTML for repeat visitors.
- Vercel's image optimizer is **not** used — Astro handles it at build time
  for static pages, which is faster and avoids per-request optimization cost.

### Core Web Vitals targets (must hit on launch)

| Metric | Target | How we get there |
|---|---|---|
| LCP | < 2.0s | Preload hero image + hero font, AVIF, edge-cached HTML |
| CLS | < 0.05 | Astro `<Image>` infers dimensions; reserve hero space |
| INP | < 100ms | Zero React; vanilla event handlers only |
| TTFB | < 400ms | Vercel edge HTML, no SSR for marketing pages |

---

## 9. Decisions Summary (one-line each)

1. URLs: `/practice-areas/[slug]`, `/attorneys/[slug]`, `/team/[slug]` (non-attorneys separated for ethics).
2. Output mode: `static` with `prerender = false` only on `/api/contact`.
3. Content: Astro v6 content collections via `glob` loader + Zod schemas.
4. Layouts: 4-tier nesting — `BaseLayout` → `Marketing` / `BlogPost` / `PracticeArea`.
5. Disclaimers: enforced by layouts, not by remembering to include them on each page.
6. SEO: one `SEO.astro` in `BaseLayout` head; per-page-type JSON-LD components.
7. Schema: `LegalService` (with national `areaServed`) on home + about only; `Service` + `FAQPage` on practice areas.
8. NAP: required; consistent across footer, JSON-LD, GBP, directories.
9. Form: progressive-enhancement `<form>` posting JSON to single Vercel Function.
10. Performance: `astro:assets` for images, self-host fonts, zero JS by default.

---

## 10. Open Questions for Implementation Phases

These are flagged for the relevant phase, not blockers now:

- **Public address** (Annandale street vs. registered agent vs. P.O. box) —
  decide before any JSON-LD goes live.
- **Phone number** — confirm whether a published number is desired or
  whether the contact form is the sole intake channel.
- **NJ bar status** — copy must say "admission pending" everywhere until
  swearing-in; layout supports this via `barAdmissions[].status`.
- **Form provider** — Supabase+Resend vs Formspree vs email-only — defer
  to contact-form phase per `.claude/CLAUDE.md`.
- **Calendly / scheduler** — should the form success state link to a
  scheduler? Affects success-state component.
- **Attorney Advertising disclosure** — confirm NJ + MD bar requirements;
  may need an "Attorney Advertising" line in footer.

---

## Sources

- [Astro Content Collections (Astro Docs)](https://docs.astro.build/en/guides/content-collections/) — HIGH (official)
- [Astro Layouts (Astro Docs)](https://docs.astro.build/en/basics/layouts/) — HIGH (official)
- [Astro Images (Astro Docs)](https://docs.astro.build/en/guides/images/) — HIGH (official)
- [Astro Vercel adapter (Astro Docs)](https://docs.astro.build/en/guides/integrations-guide/vercel/) — HIGH (official)
- [Astro on Vercel (Vercel Docs)](https://vercel.com/docs/frameworks/frontend/astro) — HIGH (official)
- [schema.org/LegalService](https://schema.org/LegalService) — HIGH (canonical schema spec)
- [Vercel Rate Limiting SDK](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk) — HIGH (official)
- [Law Firm SEO and URL Structures (custom.legal)](https://custom.legal/knowledge/law-firm-seo-and-url-structures/) — MEDIUM (industry source)
- [Site Architecture for Legal SEO (legalbrandmarketing.com)](https://www.legalbrandmarketing.com/site-architecture-for-legal-seo-structure/) — MEDIUM (industry source)
- [Better Images in Astro (astro.build/blog)](https://astro.build/blog/images/) — HIGH (official)
- [Astro Form Handling (StaticForm 2026 Guide)](https://staticform.app/blog/astro-form-handling/) — MEDIUM (third-party, verified against Astro docs)
- Internal: `.planning/FIRM_BRIEF.md`, `.planning/PROJECT.md`, `.planning/LAW_FIRM_WEBSITE_GUIDE.md`, `.claude/CLAUDE.md` — HIGH (project source-of-truth)
