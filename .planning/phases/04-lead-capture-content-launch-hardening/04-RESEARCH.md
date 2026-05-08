# Phase 4: Lead Capture + Content + Launch Hardening — Research

**Researched:** 2026-05-08
**Domain:** Astro 6 Actions + Resend email, blog content collections, SEO/schema, legal compliance, security hardening, performance
**Confidence:** HIGH (most findings verified against codebase + Context7 official Astro docs)

---

## Summary

Phase 4 is the final launch gate for scopalfirm.com. It consists of five parallel workstreams: (1) replacing the `/contact` placeholder with a fully secured Astro Actions form that emails Scott via a chosen provider, (2) activating the blog system with BlogPostLayout, paginated index, RSS feed, and at least one published post, (3) building a `<SEO />` upgrade and four `/legal/*` pages, (4) auditing security headers and secrets for pre-launch readiness, and (5) verifying image/font/Lighthouse performance across all page types.

The most consequential open question is **Q3 (contact form provider)**. CLAUDE.md explicitly forbids assuming Resend or Supabase — Scott must choose. This research presents three realistic options with enough detail for Scott to decide in one conversation. All other workstreams are fully deterministic from the existing codebase and decisions D1–D17.

**Primary recommendation:** Plan Phase 4 as five parallel plan files (form, blog, SEO+legal, security, performance) with the form plan gated on Scott's provider decision (Q3). Everything else can be executed autonomously.

---

<user_constraints>
## User Constraints (from CONTEXT.md / STATE.md)

### Locked Decisions
- **D1:** Astro 6 (`^6.3`) `output: 'static'`; `prerender = false` only on the contact endpoint
- **D2:** Tailwind CSS v4 via `@tailwindcss/vite`; CSS-first config in `src/styles/global.css`; no `tailwind.config.js`
- **D3:** `@astrojs/vercel` adapter; `imageService: true`; region `iad1`
- **D4:** Contact form = Astro Actions + Zod + server-side email; **provider TBD per Scott's intake workflow**
- **D5:** Content collections via Astro 6 `glob` loader at `src/content.config.ts`; `blog` collection already defined
- **D6:** URLs kebab-case, no trailing slashes; blog posts at `/blog/[slug]`
- **D7:** Layout hierarchy `BaseLayout` → `MarketingLayout` / `BlogPostLayout` / `PracticeAreaLayout`; disclaimers enforced by layouts
- **D8:** JSON-LD: `Article` + `BreadcrumbList` on blog posts; `LegalService` only on `/` and `/about`
- **D9:** NAP: `areaServed: Country=US`; exact consistency across footer/JSON-LD
- **D10:** Self-host fonts (woff2) in `public/fonts/`; no Google Fonts; max 2 families × 2 weights; preload above-fold weight; `font-display: swap`
- **D11:** All images via `astro:assets` `<Image />`; hero `loading="eager"` + `fetchpriority="high"`; 200 KB committed-source ceiling
- **D12:** Zero JS by default; form = vanilla `<script>`; no React/Vue islands in v1
- **D13:** `vercel.json` ships security headers from day one
- **D14:** Banned vocabulary CI-enforced: "specialist," "specializing in," "expert," "experts," "the best," "#1," "leading," "top-rated," "super lawyer"
- **D15:** Single source of truth: `src/lib/constants.ts`
- **D16:** Pricing anchor "starting at $4,500/month"; CTAs "Book a Fit Call"/"Schedule a Consultation"; never "Free Consultation"
- **D17:** Bar status copy: "Maryland (2009); New Jersey admission pending" — NJ never implied active

### Claude's Discretion
- Which wave structure / parallelization to use inside Phase 4
- BlogPostLayout internal design (prose styling, CTA placement)
- OG default image dimensions and design approach
- Legal page content wording (within ABA safe-baseline constraint from Q8 default)
- First blog post topic selection

### Deferred Ideas (OUT OF SCOPE)
- Calendar scheduler embed (Calendly/SavvyCal) — Q4 default: no scheduler v1
- Testimonials — Q5 default: defer
- Newsletter signup
- Downloadable resources
- Client portal
- Headless CMS
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-01 | Contact form: name, email, company, brief description; no sensitive matter details | Astro Actions `accept: 'form'` + Zod schema; 4 fields documented |
| FORM-02 | ABA 477R disclaimer ABOVE submit button | Inline disclaimer block pattern; text from FIRM constants |
| FORM-03 | Seven mandatory server-side controls | All 7 controls mapped to implementation patterns below |
| FORM-04 | HTML fallback without JavaScript | Astro Actions `action={actions.contact}` on `<form>` element; zero-JS path confirmed |
| FORM-05 | Email notification to Scott via chosen provider | Three provider options analyzed; RESEND_API_KEY already in `astro.config.mjs` env schema |
| FORM-06 | Confirmation page with thank-you, 2-business-day window, no-ARC restatement | `/contact/thank-you` page pattern with `Astro.redirect()` on success |
| BLOG-01 | `/blog/` paginated index + `/blog/[slug]` individual posts using MDX collection | `paginate()` in `getStaticPaths`; `getCollection('blog')` with `render(post)`; collection already defined |
| BLOG-02 | `BlogPostLayout` auto-injects prose, disclaimer, Article JSON-LD, breadcrumbs, CTA | New layout needed; modeled on `PracticeAreaLayout` pattern |
| BLOG-03 | Draft filtering via `draft: true` frontmatter | `getCollection('blog', ({ data }) => !data.draft)` for prod; schema already has `draft: z.boolean().default(false)` |
| BLOG-04 | RSS feed at `/rss.xml` | `@astrojs/rss` 4.0.18 already in dependencies; `GET` endpoint pattern confirmed |
| BLOG-05 | At least 1 published post ships at launch | First post topic recommendation provided |
| SEO-01 | `<SEO />` component with correct title format, description, canonical, OG, JSON-LD | Current `SEO.astro` exists but lacks OG image fallback; needs upgrade |
| SEO-02 | `@astrojs/sitemap` generates sitemap; robots.txt allows crawlers + disallows `/api/` | Sitemap integration already in `astro.config.mjs`; robots.txt already correct |
| SEO-03 | Default OG image `1200×630` in `public/` | `public/og-default.jpg` needs creating; pattern documented |
| SEO-04 | JSON-LD via schema components; no free-form JSON-LD in page files | `ArticleSchema.astro` missing — needs creating; all other schema components exist |
| SEO-05 | Every page type validated with Google Rich Results Test | Pre-launch checklist item; automated validation approach documented |
| LEGAL-01 | Footer on every page: NAP, attorney advertising, responsible attorney, jurisdictions, no-ARC, privacy/terms links | Footer already has most content; privacy/terms links need adding |
| LEGAL-02 | Jurisdictional UPL disclaimer in footer | Already in `FooterDisclaimer.astro` via `FIRM.jurisdictionDisclaimer` |
| LEGAL-03 | Four legal pages: `/legal/disclaimer`, `/legal/privacy`, `/legal/terms`, `/legal/accessibility-statement` | Content requirements and ABA/NJ/MD language documented below |
| LEGAL-04 | `<Testimonial>` and `<CaseResult>` components require `disclaimer` prop | Build-time enforcement pattern documented; no existing components to patch |
| SEC-01 | Security headers verified in production | CSP already in `vercel.json`; action endpoint may need `form-action` CSP update |
| SEC-02 | `dist/` audited for exposed credentials | Pre-launch checklist step; `grep -r` audit command documented |
| SEC-03 | API keys in Vercel env vars only | `RESEND_API_KEY` already in `astro.config.mjs` env schema as server-secret |
| SEC-04 | Supabase RLS on all tables if Supabase chosen | Conditional on Q3 decision; RLS pattern documented |
| SEC-05 | Pre-launch security audit passes | Checklist with all 5 SEC items documented |
| PERF-01 | All images via `astro:assets`; committed sources ≤200 KB; WebP/AVIF hero via `<Picture />` | `<Picture formats={['avif', 'webp']} />` pattern confirmed; audit approach documented |
| PERF-02 | Fonts self-hosted; max 2 families × 2 weights; above-fold preloaded; `font-display: swap` | `public/fonts/` directory does NOT yet contain font files — gap to resolve |
| PERF-03 | Lighthouse mobile ≥ 90 across all page types | Lighthouse CI already in `.github/workflows/ci.yml`; per-page-type strategy documented |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Contact form rendering | Frontend (Astro page) | — | Static HTML with vanilla script enhancement |
| Contact form submission handling | API / Backend (Astro Action) | — | `prerender = false`; Zod validation + email dispatch |
| Email delivery | External Service (Resend/Formspree) | — | No email server; outbound API call from action handler |
| Blog index + pagination | Frontend (static) | — | `getStaticPaths({ paginate })` at build time |
| Blog post rendering | Frontend (static) | — | MDX + `BlogPostLayout` |
| RSS feed | Frontend (static endpoint) | — | `GET` function in `src/pages/rss.xml.js` |
| SEO meta tags + JSON-LD | Frontend (layout components) | — | `<SEO />` in `BaseLayout`; schema components per layout |
| Sitemap generation | CDN / Static | — | `@astrojs/sitemap` at build time |
| Security headers | CDN / Static (Vercel) | — | `vercel.json` applied at edge before response |
| Legal page content | Frontend (static pages) | — | Static Astro pages under `/legal/` |
| Font assets | CDN / Static | — | `public/fonts/` served from Vercel edge |
| Image optimization | CDN / Static (Vercel) | Frontend | `@astrojs/vercel` imageService transforms at build/edge |

---

## Standard Stack

### Core (already in package.json — no new installs needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^6.3.1 | Framework; Actions; content collections | Project foundation (D1) |
| @astrojs/mdx | ^5.0.4 | MDX processing for blog posts | Already installed |
| @astrojs/sitemap | ^3.7.2 | Auto-generates sitemap.xml | Already installed |
| @astrojs/rss | 4.0.18 | RSS feed endpoint | Already installed |
| @tailwindcss/typography | ^0.5.19 | `.prose` styles for blog MDX | Already installed; used in PracticeAreaLayout |

### New Install Required
| Library | Version | Purpose | When to Add |
|---------|---------|---------|-------------|
| resend | ^4.x | Email delivery SDK | If Scott chooses Resend (Q3 Option A) |

**Version check:** [VERIFIED: npm registry] `resend` latest = 4.0.18

```bash
npm install resend
```

Formspree and EmailJS require no npm package (HTTP POST to their API endpoint).

### Alternatives Considered (for Q3 — Scott must decide)

| Option | Setup | Cost | ABA 477R Notes | Vercel Compat | Recommendation |
|--------|-------|------|----------------|---------------|----------------|
| **A: Resend** (default in env schema) | Domain DNS verification + RESEND_API_KEY env var | Free: 3,000/mo, 100/day | TLS in transit; credentials server-only; meets 477R "reasonable efforts" standard | First-class; already in `astro.config.mjs` env schema | Best for code-owned control |
| **B: Formspree** | Paste endpoint URL; no server code needed | Free: 50/mo; $10/mo for 200 | HTTPS form POST; data stored on Formspree servers (third-party processor) — review 477R data-at-rest obligations | Works with HTML `action=` POST | Best if Scott wants zero backend code |
| **C: Supabase + Resend** | Supabase project + leads table + RLS + Resend for outbound | Supabase free tier generous | Leads stored in Supabase (requires SEC-04 RLS); most control over data | Vercel env vars for both keys | Best if Scott wants to query/export leads later |

**Q3 framing for Scott:**
> "Do you want to (A) receive an email the moment someone submits the form with no stored record — simplest, code-owned; (B) use a form service that handles delivery but stores submissions on their servers; or (C) store every submission in a database you own, plus get an email — most data control but more setup. What does your current client intake workflow look like? Do you use a CRM?"

---

## Architecture Patterns

### System Architecture Diagram

```
Visitor fills /contact (static HTML form)
      |
      | form action="{actions.sendContact}" method="POST"
      v
Astro Action handler [src/actions/index.ts]  — prerender=false on page
      |
      +-- Zod re-validate all fields
      +-- Origin/CSRF check (security.checkOrigin = true, built-in Astro 6)
      +-- Honeypot field check (reject if filled)
      +-- IP rate limit check (in-memory Map, ≤5/hour per Astro.clientAddress)
      +-- HTML escape body / CRLF rejection on name+email
      |
      +-- [SEC-04: if Supabase chosen] INSERT into leads table (RLS-protected)
      |
      +-- Call email provider API (Resend SDK / Formspree HTTP / EmailJS HTTP)
            Fixed From: / Subject: (never user-supplied)
      |
      v
Astro.redirect('/contact/thank-you')   [static page]
```

### Recommended Project Structure (Phase 4 additions)

```
src/
├── actions/
│   └── index.ts              # Astro Actions: export const server = { sendContact }
├── content/
│   └── blog/
│       └── when-saas-needs-a-lawyer.mdx   # First published post (BLOG-05)
├── layouts/
│   └── BlogPostLayout.astro  # New: wraps MarketingLayout, injects prose + disclaimer + ArticleSchema + BreadcrumbList + CTASection
├── components/
│   ├── seo/
│   │   └── ArticleSchema.astro  # New: Article JSON-LD for blog posts
│   └── legal/
│       ├── Testimonial.astro    # New: requires disclaimer prop (LEGAL-04)
│       └── CaseResult.astro     # New: requires disclaimer prop (LEGAL-04)
├── pages/
│   ├── contact.astro         # Replace placeholder; export const prerender = false
│   ├── contact/
│   │   └── thank-you.astro   # Confirmation page (FORM-06)
│   ├── blog/
│   │   ├── [...page].astro   # Paginated index (BLOG-01)
│   │   └── [slug].astro      # Individual post (BLOG-01)
│   ├── rss.xml.js            # RSS feed endpoint (BLOG-04)
│   └── legal/
│       ├── disclaimer.astro
│       ├── privacy.astro
│       ├── terms.astro
│       └── accessibility-statement.astro
public/
├── og-default.jpg            # 1200×630 default OG image (SEO-03)
└── fonts/                    # CURRENTLY EMPTY — font woff2 files needed (PERF-02)
```

### Pattern 1: Astro Actions Contact Form (Zero-JS-capable)

**What:** `src/actions/index.ts` defines the server action. `contact.astro` page has `export const prerender = false` and uses `action={actions.sendContact}` on the `<form>` — this enables the no-JS POST path. `Astro.getActionResult()` handles redirect on success.

**Why zero-JS works:** When `action` is set to the Astro action URL, a plain HTML POST submits to the Astro server handler. No fetch/XHR required. [VERIFIED: Context7 /withastro/docs]

```typescript
// src/actions/index.ts
// Source: https://docs.astro.build/en/guides/actions/
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  sendContact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1).max(100)
        .refine(v => !/[\r\n]/.test(v), 'Invalid characters'),  // CRLF rejection
      email: z.string().email().max(254)
        .refine(v => !/[\r\n]/.test(v), 'Invalid characters'),  // CRLF rejection
      company: z.string().max(200).optional(),
      description: z.string().min(1).max(2000),
      honeypot: z.string().max(0).optional(),  // honeypot: must be empty
    }),
    handler: async (input, context) => {
      // 1. Honeypot check
      if (input.honeypot && input.honeypot.length > 0) {
        throw new Error('Bot detected');
      }
      // 2. IP rate limit (in-memory; resets on function cold start)
      const ip = context.clientAddress ?? 'unknown';
      checkRateLimit(ip);  // throws ActionError if exceeded
      // 3. HTML-escape body before sending
      const safeDescription = escapeHtml(input.description);
      // 4. Send email with fixed From/Subject (never user-supplied)
      await sendEmail({ name: input.name, email: input.email, company: input.company, description: safeDescription });
    },
  }),
};
```

```astro
---
// src/pages/contact.astro
export const prerender = false;
import { actions } from 'astro:actions';
import MarketingLayout from '../layouts/MarketingLayout.astro';
import { FIRM } from '../lib/constants';

const result = Astro.getActionResult(actions.sendContact);
if (result && !result.error) {
  return Astro.redirect('/contact/thank-you');
}
---
<MarketingLayout title="Contact — Annandale, NJ | Scopal Firm" description="...">
  <form method="POST" action={actions.sendContact}>
    <!-- fields: name, email, company, description -->
    <!-- honeypot hidden field (visually hidden, not display:none) -->
    <!-- ABA 477R disclaimer block ABOVE submit button -->
    <button type="submit">Send Message</button>
  </form>
</MarketingLayout>
```

### Pattern 2: FORM-03 Seven Security Controls Implementation

| Control | Implementation | Notes |
|---------|---------------|-------|
| 1. Origin/CSRF check | `security.checkOrigin: true` (Astro 6 default for on-demand routes) | Built-in; no code needed [VERIFIED: Context7] |
| 2. Honeypot field | Hidden `<input type="text" name="honeypot" tabindex="-1" aria-hidden="true" />` + Zod `z.string().max(0)` | CSS: `position: absolute; left: -9999px` — bots fill it, humans don't |
| 3. IP rate limit | In-memory `Map<string, {count, resetAt}>` in action module scope; ≤5 per hour per `context.clientAddress` | Resets on cold start; acceptable for low-volume law firm form; `context.clientAddress` available on Vercel [VERIFIED: Context7] |
| 4. Zod re-validation | `accept: 'form'` with Zod schema on action `input` | Runs server-side even if browser validation bypassed |
| 5. HTML-escape body | `escapeHtml()` utility on `description` field before embedding in email body | Prevents HTML injection in email clients |
| 6. CRLF rejection | `.refine(v => !/[\r\n]/.test(v), ...)` on `name` and `email` fields (header-bound) | Prevents email header injection |
| 7. Fixed From/Subject | Email provider call uses `from: 'contact@scopalfirm.com'` and `subject: 'New Contact Form Submission'` — never user-supplied values | Hardcoded in action handler, not interpolated from form fields |

**CSP note:** The current `vercel.json` CSP has `form-action 'self'`. Astro Actions POST to the same origin, so this is compatible. [VERIFIED: codebase read]

### Pattern 3: BlogPostLayout

**What:** New `src/layouts/BlogPostLayout.astro` wrapping `MarketingLayout`, auto-injecting all blog-specific concerns.

```astro
---
// src/layouts/BlogPostLayout.astro
import MarketingLayout from './MarketingLayout.astro';
import ArticleSchema from '../components/seo/ArticleSchema.astro';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema.astro';
import DisclaimerCallout from '../components/legal/DisclaimerCallout.astro';
import CTASection from '../components/sections/CTASection.astro';
import { FIRM } from '../lib/constants';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  ogImage?: string;
}
const { title, description, pubDate, slug, ogImage } = Astro.props;
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: title, url: `/blog/${slug}` },
];
---
<MarketingLayout {title} {description} ogType="article" ogImage={ogImage}>
  <ArticleSchema {title} {description} {pubDate} {slug} />
  <BreadcrumbSchema items={breadcrumbs} />
  <article class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
    <DisclaimerCallout />
    <div class="prose prose-lg max-w-prose mx-auto mt-8">
      <slot />
    </div>
  </article>
  <CTASection />
</MarketingLayout>
```

### Pattern 4: ArticleSchema Component

```astro
---
// src/components/seo/ArticleSchema.astro
import { FIRM } from '../../lib/constants';
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  updatedDate?: Date;
}
const { title, description, pubDate, slug, updatedDate } = Astro.props;
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  datePublished: pubDate.toISOString(),
  dateModified: (updatedDate ?? pubDate).toISOString(),
  author: {
    '@type': 'Person',
    name: 'Scott A. Palmer',
    url: `${FIRM.url}/attorneys/scott-palmer`,
  },
  publisher: {
    '@type': 'LegalService',
    name: FIRM.legalName,
    url: FIRM.url,
  },
  mainEntityOfPage: `${FIRM.url}/blog/${slug}`,
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Pattern 5: Blog Index with Pagination

```astro
---
// src/pages/blog/[...page].astro
// Source: https://docs.astro.build/en/guides/routing/#pagination
import { getCollection } from 'astro:content';

export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return paginate(sorted, { pageSize: 10 });
}

const { page } = Astro.props;
---
```

### Pattern 6: RSS Feed

```javascript
// src/pages/rss.xml.js
// Source: https://docs.astro.build/en/recipes/rss/
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { FIRM } from '../lib/constants';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: `${FIRM.legalName} — Insights`,
    description: 'Legal insights for SaaS founders from Scott A. Palmer, fractional general counsel.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
```

### Pattern 7: SEO Component Upgrade

The current `SEO.astro` is missing the OG image fallback (`og:image` only renders if `ogImage` prop is passed). It needs: (a) fallback to `/og-default.jpg` when no per-page image is provided, (b) `og:site_name`, and (c) `twitter:card` for completeness.

```astro
---
// src/components/seo/SEO.astro (upgraded)
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}
const { title, description, ogImage, ogType = 'website', noindex = false } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const resolvedOgImage = ogImage ?? '/og-default.jpg';
const absoluteOgImage = resolvedOgImage.startsWith('http')
  ? resolvedOgImage
  : new URL(resolvedOgImage, Astro.site).toString();
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL.toString()} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonicalURL.toString()} />
<meta property="og:image" content={absoluteOgImage} />
<meta property="og:site_name" content="Scopal Firm" />
<meta name="twitter:card" content="summary_large_image" />
{noindex && <meta name="robots" content="noindex,nofollow" />}
```

### Anti-Patterns to Avoid

- **Free-form JSON-LD strings in page files:** Never write `<script type="application/ld+json">` directly in a page's frontmatter or template. Use the schema components in `src/components/seo/`. (D8 / SEO-04)
- **Hardcoding disclaimer text in pages:** All disclaimer text comes from `FIRM` constants or layout components. Never duplicate strings. (D15)
- **`display: none` on honeypot:** Use `position: absolute; left: -9999px` instead. Screen readers + some bots see `display:none` and skip the field, but CSS-hidden fields still get filled by bots.
- **User-supplied From/Subject in email:** Always hardcode these. Never interpolate `name` or `email` into the email From or Subject header — that's the CRLF injection vector.
- **`import.meta.glob` for blog posts:** Astro 6 uses `getCollection('blog')` only. Legacy glob loader patterns are removed in Astro 6. [VERIFIED: Context7]
- **Trailing slash on blog routes:** D6 says no trailing slashes; ensure `getStaticPaths` uses `post.id` not `post.id + '/'`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP connection | Resend SDK / Formspree API | SPF/DKIM/DMARC setup is complex; deliverability requires domain reputation management |
| CSRF protection | Custom token generation + cookie | `security.checkOrigin: true` (Astro 6 built-in) | Built-in; CVE-2024-56140 already patched in Astro 6.3+ |
| Sitemap generation | Manual `sitemap.xml` | `@astrojs/sitemap` (already installed) | Auto-discovers all routes; updates with every build |
| MDX prose styling | Custom CSS for headings/lists/blockquotes | `@tailwindcss/typography` `.prose` class (already installed) | Handles all HTML elements generated from MDX |
| RSS XML serialization | String template | `@astrojs/rss` (already installed) | Handles XML encoding, date formats, channel metadata |

---

## Open Question: Q3 — Contact Form Provider Decision

**This is the only blocking question for Phase 4 planning.** Everything else can be planned autonomously.

### Option A: Resend (Recommended default — already wired in codebase)

**Setup:** DNS verification for `scopalfirm.com` domain on Resend dashboard (adds SPF/DKIM records) + `RESEND_API_KEY` env var in Vercel + 1 npm package.

**Cost:** Free tier: 3,000 emails/month, 100/day — more than sufficient for a law firm contact form. [VERIFIED: WebSearch from resend.com]

**ABA 477R:** TLS in transit (HTTPS API call); credentials server-side only; no third-party data storage — cleanest compliance posture.

**Code in action handler:**
```typescript
import { Resend } from 'resend';
const resend = new Resend(import.meta.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'contact@scopalfirm.com',      // Fixed — verified domain required
  to: 'scott@scopalfirm.com',          // from FIRM.email constant
  subject: 'New Contact Form Submission — Scopal Firm',  // Fixed
  html: `<p><strong>Name:</strong> ${name}</p>...`,
});
```

**Pro:** Code-owned, no third-party data storage, already in env schema, first-class Vercel integration, domain verification improves deliverability.
**Con:** Requires DNS change + domain verification step (5–15 minutes). Can test with `onboarding@resend.dev` from address before domain is verified.

### Option B: Formspree (Zero backend code)

**Setup:** Create Formspree account + form endpoint → paste URL as `action` attribute on `<form>`. No server code needed.

**Cost:** Free: 50 submissions/month; $10/month for 200. [VERIFIED: WebSearch]

**ABA 477R:** Submissions stored on Formspree's servers (third-party data processor). Review whether storing pre-engagement inquiries on a third-party server satisfies 477R's "reasonable efforts" obligation. Formspree uses HTTPS and is widely used by professional services firms, but data-at-rest is not on your infrastructure.

**Code:** Plain HTML `<form action="https://formspree.io/f/YOUR_ID" method="POST">`. Works without Astro Actions.

**Pro:** Simplest possible setup; no npm package; no server code; handles spam filtering.
**Con:** 50/month free limit is tight; third-party data storage; loses control over email delivery and submission records; Astro Actions architecture (D4) would not be used.

**Note:** If Scott chooses Formspree, D4 changes — Astro Actions becomes unnecessary for the form. FORM-03's 7 server-side controls would partially devolve to Formspree's platform (spam filtering, basic validation) rather than code we own. The honeypot, CRLF rejection, and HTML escaping would be moot.

### Option C: Supabase + Resend (Full data ownership)

**Setup:** Supabase project + `leads` table + RLS enabled (SEC-04) + `SUPABASE_URL` + `SUPABASE_ANON_KEY` + `RESEND_API_KEY` in Vercel env.

**Cost:** Supabase free tier is generous (500 MB, 2 projects). Resend free tier as above.

**ABA 477R:** Leads stored in Supabase (Postgres); you own the data; RLS prevents unauthorized access. Best data-control posture.

**Pro:** Scott can query/export leads; CRM integration later; full audit trail.
**Con:** Most setup; two services to configure; requires SEC-04 RLS verification; more env vars.

---

## Common Pitfalls

### Pitfall 1: `prerender = false` Missing on `/contact`

**What goes wrong:** Astro builds the contact page as a static HTML file. The Astro Action handler doesn't execute. Form submissions return 404 or a static page.
**Why it happens:** The site uses `output: 'static'` (D1). Individual pages need `export const prerender = false` to opt into server rendering.
**How to avoid:** Every page that calls an Astro Action (or reads `Astro.getActionResult()`) must export `prerender = false` at the top of its frontmatter.
**Warning signs:** Build succeeds but form submission goes nowhere; Vercel logs show no function invocations.

### Pitfall 2: `security.checkOrigin` Not in astro.config.mjs

**What goes wrong:** CSRF protection silently disabled; bots can POST to the action endpoint from any origin.
**Why it happens:** `security.checkOrigin` defaults to `true` in Astro 5+ but should be explicitly confirmed in config for static+hybrid projects.
**How to avoid:** Verify `astro.config.mjs` does not set `security: { checkOrigin: false }`. Current config does not — it's enabled by default. [VERIFIED: codebase read + Context7]

### Pitfall 3: Astro Actions CSRF Bypass via Content-Type (CVE-2024-56140)

**What goes wrong:** Old Astro versions allowed `Content-Type: application/x-www-form-urlencoded; anything` to bypass CSRF. Bots could skip the Origin check.
**Why it happens:** Semicolon-delimited Content-Type parameters were not stripped before comparison.
**How to avoid:** Use Astro 6.3.1+ (already the project version). The vulnerability was patched. Keep Astro updated.
**Warning signs:** If ever downgrading Astro version, re-check CVE-2024-56140.

### Pitfall 4: Blog Slug Collision with `post.id` vs `post.slug`

**What goes wrong:** In Astro 6 Content Layer API, `post.id` is the file path relative to the base (e.g., `when-saas-needs-a-lawyer` without `.mdx`). Legacy `post.slug` property no longer exists.
**Why it happens:** Astro 6 removed legacy content collection support. Some tutorials still reference `post.slug`.
**How to avoid:** Use `post.id` in `getStaticPaths` params and route links. [VERIFIED: Context7 — "Astro 6 removes all legacy content collection support"]

### Pitfall 5: Font Files Missing from `public/fonts/`

**What goes wrong:** PERF-02 requires self-hosted fonts. The current `global.css` references `"Fraunces"` and `"Inter"` but `public/fonts/` is empty (no `.woff2` files committed). The site currently falls back to system fonts.
**Why it happens:** Phase 1 CLAUDE.md TODO comment in `BaseLayout.astro` says "Add Fraunces 600 preload link once woff2 file is committed to public/fonts/" — this was never completed.
**How to avoid:** Phase 4 must: download Fraunces (display, 600 weight) and Inter (body, 400 + 600 weights) as `.woff2` files, commit them to `public/fonts/`, add `@font-face` declarations to `global.css`, add preload `<link>` tags for above-fold weights in `BaseLayout.astro`.
**Warning signs:** DevTools → Network tab shows no font files loading from `/fonts/`; Fraunces headings render in Georgia fallback.

### Pitfall 6: RSS Feed Includes Draft Posts

**What goes wrong:** Draft posts appear in `/rss.xml` even if not visible on `/blog/`.
**Why it happens:** RSS feed `GET` handler forgets to filter `draft: true`.
**How to avoid:** `getCollection('blog', ({ data }) => !data.draft)` in both `[...page].astro` and `rss.xml.js`.

### Pitfall 7: OG Image Path Is Relative, Not Absolute

**What goes wrong:** Social media scrapers (Twitter/X, LinkedIn, Slack) cannot load the OG image because `og:image` resolves to a relative URL like `/og-default.jpg` rather than an absolute `https://scopalfirm.com/og-default.jpg`.
**Why it happens:** `SEO.astro` doesn't prepend `Astro.site` to the path.
**How to avoid:** Use `new URL(resolvedOgImage, Astro.site).toString()` as shown in Pattern 7 above.

### Pitfall 8: CSP Blocks Astro Actions in Production

**What goes wrong:** Form submission fails silently in production; no JS errors visible unless DevTools is open.
**Why it happens:** The CSP `form-action 'self'` is correct, but if `connect-src` is too restrictive and the enhanced (fetch-based) submission path is used, it could be blocked.
**How to avoid:** Astro Actions with `accept: 'form'` and HTML `action=` attribute use a standard form POST (not fetch), so `form-action 'self'` is sufficient. Current CSP already includes this. [VERIFIED: codebase — vercel.json `"form-action 'self'"`]

---

## Legal Page Content Requirements

### /legal/disclaimer

**Required content (ABA 7.1 + NJ RPC 7.1 safe baseline):**
- No attorney-client relationship formed by visiting or using the site
- Content is general informational purposes only; not legal advice
- Past results do not guarantee future outcomes
- Attorney advertising statement with responsible attorney name
- Jurisdictional disclaimer (MD licensed; NJ pending)
- Effective date

**NJ-specific note:** NJ RPC 7.2 requires "No aspect of this advertisement has been approved by the Supreme Court of New Jersey" when making comparative or award-type claims. Since the site does not currently make comparative claims or cite awards, this boilerplate is not required — but include as a safe harbor on the disclaimer page. [CITED: njcourts.gov RPC 7.2 + CAMG NJ attorney advertising white paper]

**MD-specific note:** Maryland MARPC 7.2 requires the name of at least one attorney responsible for website content. Already covered by `FIRM.responsibleAttorney`. Specialization disclaimer ("The Supreme Court of Maryland does not certify specialists in the practice of law") is only required if specialization is claimed — not applicable here given D14 (banned vocabulary). [CITED: camginc.com/white-papers/maryland/]

### /legal/privacy

**Required content:**
- What data is collected (form submissions: name, email, company, description)
- How it is used (to respond to inquiry; not sold or shared except with email delivery provider)
- Data retention policy (how long form submissions are kept — ASSUMED; needs Scott's input)
- Third-party services: Resend (or chosen provider), Vercel Analytics if enabled
- Contact for data requests: scott@scopalfirm.com
- Effective date

**Note:** The site does not use cookies beyond session state (no analytics unless Vercel web analytics is enabled — currently `webAnalytics: { enabled: false }` in `astro.config.mjs`). Privacy policy can be brief.

### /legal/terms

**Required content (service firm standard):**
- Use of site content (general information only; no reproduction without permission)
- No attorney-client relationship
- No warranty on accuracy of content
- Links to third-party sites (not endorsed)
- Governing law: New Jersey (firm location) [ASSUMED — verify with Scott]
- Effective date

### /legal/accessibility-statement

**Required content (W3C WAI standard):** [CITED: w3.org/WAI/planning/statements/]
- Commitment to WCAG 2.1 AA conformance
- Known limitations (if any)
- Technical prerequisites (modern browser required)
- Contact for accessibility issues: scott@scopalfirm.com
- Date of last review
- Measures taken (axe-core CI, keyboard navigation testing, etc.)

### Footer Privacy/Terms Links

The current `Footer.astro` does not link to `/legal/privacy` or `/legal/terms`. These links need adding to satisfy LEGAL-01. [VERIFIED: codebase read]

---

## SEO Component Audit

**Current state of `SEO.astro`:** [VERIFIED: codebase read]
- Has: `<title>`, `<meta description>`, canonical, `og:title`, `og:description`, `og:type`, `og:url`, conditional `og:image`, conditional noindex
- Missing: OG image fallback to `/og-default.jpg`, `og:site_name`, `twitter:card`, `og:image:width/height`

**Title format compliance check:** The requirement is `${pageTitle} — Annandale, NJ | Scopal Firm` (≤60 chars). Current pages already follow this format (e.g., "Contact — Annandale, NJ | Scopal Firm" = 40 chars). No change needed to the format — only pages being created in Phase 4 need to follow it.

**Sitemap:** Already configured in `astro.config.mjs` with `sitemap()`. Produces `sitemap-index.xml`. The `robots.txt` already references `https://scopalfirm.com/sitemap-index.xml`. [VERIFIED: codebase read] No changes needed for SEO-02.

**robots.txt audit:** [VERIFIED: codebase read — `public/robots.txt`]
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://scopalfirm.com/sitemap-index.xml
```
This satisfies SEO-02 exactly. No changes needed.

---

## Performance Audit

### PERF-01: Image Audit

**Current state:** [VERIFIED: codebase read]
- `src/assets/team/scott-palmer.jpg` and `rachel-palmer.jpg` — used via `astro:assets` in bio pages
- `public/images/logos/*.svg` — SVGs; no optimization needed
- `public/images/team/scott-palmer.png` — in `public/` (not `src/assets/`); this bypasses `astro:assets` optimization

**Gap identified:** `public/images/team/scott-palmer.png` should either be moved to `src/assets/` (so `astro:assets` can optimize it) or verified it is not referenced in any page. A copy already exists at `src/assets/team/scott-palmer.jpg`. The `public/` version may be a duplicate or legacy file.

**Hero image:** Homepage hero should use `<Picture formats={['avif', 'webp']} loading="eager" fetchpriority="high" />` per D11. Verify this is in place on `index.astro`.

**OG image:** `/public/og-default.jpg` does not yet exist. Must be created at 1200×630 — can be a simple branded image with firm name/tagline. Committed source must be ≤200 KB.

### PERF-02: Font Audit

**Current state:** [VERIFIED: codebase read — `global.css` + `public/fonts/` directory listing]
- `global.css` declares `--font-body: "Inter"` and `--font-display: "Fraunces"` — these are CSS custom properties referencing fonts by name
- `public/fonts/` directory exists but contains NO font files (only `.DS_Store` in the public directory listing)
- `BaseLayout.astro` has a TODO comment: "Add Fraunces 600 preload link once woff2 file is committed to public/fonts/"
- There are NO `@font-face` declarations in `global.css`

**Conclusion:** Fonts are currently falling back to system stacks (`Georgia`, `system-ui`). PERF-02 is completely unimplemented.

**What Phase 4 must do:**
1. Download `Inter-Regular.woff2` (400), `Inter-SemiBold.woff2` (600), `Fraunces-SemiBold.woff2` (600) from Google Fonts or Fontsource
2. Verify each ≤200 KB (Inter woff2 files are ~65 KB each; Fraunces ~80 KB)
3. Commit to `public/fonts/`
4. Add `@font-face` rules to `global.css`
5. Add `<link rel="preload" as="font" type="font/woff2" href="/fonts/Inter-Regular.woff2" crossorigin>` to `BaseLayout.astro` `<head>`

**Tool to generate `@font-face` stacks:** Use `fontsource` npm package or `google-webfonts-helper.herokuapp.com` to download self-hosted woff2 subsets. [ASSUMED — standard approach; specific tool may vary]

### PERF-03: Lighthouse Strategy

**Lighthouse CI already configured** in `package.json` via `@lhci/cli`. The `.lighthouserc.json` file (referenced in STATE.md plan 01-04) enforces the mobile ≥90 budget.

**Page types to verify at launch:**
1. Homepage (`/`) — StoryBrand layout with hero image
2. Practice area page (`/practice-areas/corporate-law`) — long-form MDX with FAQ
3. Blog post (`/blog/[slug]`) — new in Phase 4
4. Contact page (`/contact`) — server-rendered (`prerender = false`) — **cannot be audited by Lighthouse CI against the static build; must be tested manually on Vercel preview URL**
5. Legal pages (`/legal/disclaimer`) — simple content pages

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in v1 |
| V3 Session Management | No | No sessions in v1 |
| V4 Access Control | Partial | `prerender = false` only on contact endpoint; no public API routes |
| V5 Input Validation | Yes | Zod schema on Astro Action; CRLF rejection; HTML escaping |
| V6 Cryptography | No | TLS provided by Vercel; no custom crypto needed |
| V7 Error Handling | Yes | `ActionError` returns user-safe messages; no stack traces to client |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Email header injection | Tampering | CRLF rejection on `name`/`email` fields (Zod refine); fixed `From:`/`Subject:` |
| HTML injection in email body | Tampering | `escapeHtml()` on `description` before email body construction |
| Bot form spam | Denial of Service | Honeypot field + IP rate limit (≤5/hour per IP) |
| CSRF cross-origin form submission | Spoofing | `security.checkOrigin: true` (Astro 6 default) |
| Secrets in `dist/` output | Information Disclosure | `RESEND_API_KEY` marked `context: 'server', access: 'secret'` in `astro.config.mjs` env schema — never exposed to client bundle |
| Secrets in git history | Information Disclosure | `gitleaks` in CI (FOUND-03); `.env` in `.gitignore` |

### CSP Compatibility with Astro Actions

Current CSP: `form-action 'self'` — compatible with Astro Actions HTML form POST to same origin. [VERIFIED: codebase]

If Vercel web analytics is later enabled (`webAnalytics: { enabled: true }`), the CSP already includes `connect-src ... https://vitals.vercel-insights.com`. [VERIFIED: vercel.json]

### Pre-Launch Security Checklist (SEC-05)

- [ ] `grep -r "RESEND_API_KEY\|sk_\|re_" dist/` returns no results
- [ ] Vercel project settings: `RESEND_API_KEY` visible only to production+preview (not logged)
- [ ] `dist/` contains no `.env` files
- [ ] Astro Actions endpoint (`/contact`) returns 403 for cross-origin POST (test from different origin)
- [ ] Honeypot field: fill it and verify 400 response
- [ ] Rate limit: submit 6 times in rapid succession; verify 6th is rejected
- [ ] All security headers present on `curl -I https://scopalfirm.com` response

---

## Header Nav Update

The current `Header.astro` desktop nav order is: Practice Areas | Coaching | Scott Palmer | Pricing | [Book a Fit Call]

**Recommendation:** Add "Blog" as a direct link before the CTA button.

Proposed order: Practice Areas | Coaching | Scott Palmer | Pricing | Blog | [Book a Fit Call]

**Rationale:** Blog is lightweight content navigation; it doesn't need a dropdown. Placing it before the CTA keeps the CTA visually last and most prominent. [ASSUMED — no design system constraint against this placement]

The mobile nav `<details>` block needs a matching `<a href="/blog">` entry.

---

## First Blog Post Strategy (BLOG-05)

The first post must exist at launch but does not need to be long. It must:
- Be attributed to Scott A. Palmer
- Not trigger banned-words CI
- Auto-inject `DisclaimerCallout` via `BlogPostLayout`
- Have `draft: false` (or omit `draft` since schema defaults to `false`)

**Recommended topic:** "When Does a SaaS Company Need a Lawyer? A Practical Guide"

**Rationale:** This is the #1 question Scott's ideal client types into Google. It names the client type ("SaaS company"), directly answers a specific question (AEO pattern from the LAW_FIRM_WEBSITE_GUIDE), and is naturally 800–1,200 words. It creates a content cluster pillar around "fractional general counsel."

**MDX frontmatter for the first post:**
```mdx
---
title: "When Does a SaaS Company Need a Lawyer?"
description: "Most SaaS founders wait too long to get legal help. Here's how to know when it's time — and what to look for."
pubDate: 2026-05-XX
author: scott-palmer
tags: ["saas", "startup-legal", "fractional-gc"]
draft: false
---
```

Note: `title` max is 70 chars (Zod schema); `description` max is 160 chars. Both fit.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | @lhci/cli 0.15.1 + @axe-core/cli 4.11.3 + linkinator 7.6.1 |
| Config file | `.lighthouserc.json` (created in Phase 1, plan 01-04) |
| Quick run command | `npm run banned-words` (banned words only, < 5s) |
| Full suite command | `npm run build && npm run a11y && npx lhci autorun` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-02 | ABA 477R disclaimer appears above submit button | Manual visual + axe-core | `npm run a11y` (checks rendered page) | ✅ axe-core wired |
| FORM-03 | 7 server-side controls enforced | Manual adversarial test | Manual: submit with honeypot filled; submit 6x rapidly | No automated test |
| BLOG-03 | Drafts excluded from production | Build verification | `npm run build && grep -r "draft-post" dist/` | No test file needed |
| BLOG-04 | RSS feed validates | Manual | `npx --yes feed-validator dist/rss.xml` | ❌ Wave 0 gap |
| SEO-01 | Title ≤60 chars on all pages | Build-time lint | Add title length check to `banned-words.mjs` | ❌ Wave 0 gap (optional) |
| SEO-04 | No free-form JSON-LD in page files | Lint | `grep -r 'application/ld+json' src/pages/` | No config needed |
| PERF-01–03 | Lighthouse mobile ≥90 | Lighthouse CI | `npx lhci autorun` | ✅ wired in CI |
| LEGAL-04 | `<Testimonial>` build fails without disclaimer prop | TypeScript compile | `npm run build` | ❌ Wave 0 — components don't exist yet |
| SEC-02 | No credentials in `dist/` | Pre-launch manual | `grep -r "re_\|sk_" dist/` | No config needed |

### Wave 0 Gaps

- [ ] `<Testimonial disclaimer="...">` component — covers LEGAL-04; enforced at TypeScript compile time via required prop
- [ ] `<CaseResult disclaimer="...">` component — covers LEGAL-04
- [ ] First blog post MDX file at `src/content/blog/when-saas-needs-a-lawyer.mdx` — covers BLOG-05
- [ ] `public/og-default.jpg` — covers SEO-03 (create before SEO tests)
- [ ] `public/fonts/*.woff2` — covers PERF-02 (commit before Lighthouse runs)

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥22 | astro build | ✓ (per engines field) | ≥22.12.0 | — |
| Vercel CLI | Deploy | Not checked locally | — | Vercel dashboard |
| Resend API key | FORM-05 (Option A) | ✗ (not yet created) | — | Formspree / Option B |
| Resend domain verification | FORM-05 (Option A) | ✗ (DNS not yet configured) | — | Test with onboarding@resend.dev |
| Supabase project | FORM-05 (Option C) | ✗ (if chosen) | — | Skip if Option A/B |
| `public/fonts/*.woff2` | PERF-02 | ✗ (directory empty) | — | Download in Wave 0 |
| `public/og-default.jpg` | SEO-03 | ✗ (does not exist) | — | Must create before launch |

**Missing dependencies blocking execution (no fallback):**
- Scott's Q3 decision before contact form plan can be finalized
- Font woff2 files before Lighthouse performance testing
- OG default image before SEO validation

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Governing law for Terms page is New Jersey (firm location) | Legal Pages | Could be Maryland; Scott should confirm |
| A2 | Data retention policy for form submissions is not yet defined by Scott | Legal Pages | Privacy policy needs a real retention period |
| A3 | Blog link placement in nav should be before the CTA button | Header Nav Update | Scott may prefer different nav ordering |
| A4 | Font files can be obtained from Fontsource/google-webfonts-helper for self-hosting | PERF-02 | License terms are permissive (OFL) for Inter and Fraunces — standard, but verify |
| A5 | First blog post topic "When Does a SaaS Company Need a Lawyer?" | Blog Strategy | Scott may have a different topic in mind; either works |
| A6 | IP rate limit via in-memory Map is acceptable for production on Vercel | FORM-03 | Vercel serverless functions may have multiple instances; in-memory map is per-instance. For a low-volume law firm form this is acceptable (each instance still limits to 5/hour), but a distributed rate limiter (KV store) would be more robust if needed |

---

## Open Questions

1. **Q3: Contact form provider (BLOCKING)**
   - What we know: Three viable options (Resend, Formspree, Supabase+Resend) with different trade-offs
   - What's unclear: Scott's existing client intake workflow; whether he wants a lead database
   - Recommendation: Present options using the framing in this document; wait for Scott's answer before creating the form plan

2. **Q1: Public street address for NAP**
   - What we know: Current default is `addressLocality: "Annandale", addressRegion: "NJ"` only (no street address)
   - What's unclear: Whether Scott wants to add a street address before launch
   - Recommendation: Ship with default; note it can be added to `constants.ts` anytime

3. **Q2: Phone number vs. contact-form-only**
   - What we know: `FIRM.phone = null` in constants.ts; current default is no phone
   - Recommendation: Ship without phone; note it can be added by setting `FIRM.phone` in constants.ts

4. **Q8: MD + NJ state-specific attorney-advertising disclaimer wording**
   - What we know: ABA 7.1/7.2 safe baseline is sufficient for both states at launch; NJ requires "No aspect of this advertisement has been approved by the Supreme Court of New Jersey" only for comparative/award claims (not applicable here)
   - Recommendation: Ship ABA safe baseline; include NJ advisory language on `/legal/disclaimer` as safe harbor

5. **Font file weight: does Inter need 400 AND 600, or just 400?**
   - What we know: `global.css` uses Inter for body; headings use Fraunces; `font-semibold` utility class maps to 600
   - Recommendation: Include Inter 400 (body) + Inter 600 (strong/semibold) + Fraunces 600 (display headings) = 3 woff2 files, within the 2-families × 2-weights constraint (D10)

---

## Sources

### Primary (HIGH confidence)
- Context7 `/withastro/docs` — Astro Actions `defineAction`, `getActionResult`, form action HTML pattern, `prerender = false`, `getCollection`, `paginate`, `clientAddress`, `security.checkOrigin`, `<Picture>` component, RSS feed, sitemap integration
- Codebase read — `astro.config.mjs`, `vercel.json`, `package.json`, `src/content.config.ts`, `src/lib/constants.ts`, all layout and component files, `public/robots.txt`, `public/fonts/` (empty)

### Secondary (MEDIUM confidence)
- [Resend + Vercel Functions docs](https://resend.com/docs/send-with-vercel-functions) — API setup, RESEND_API_KEY env var
- [Resend pricing/free tier](https://resend.com/pricing) — 3,000/mo, 100/day free tier [WebSearch verified]
- [Formspree pricing](https://www.saasworthy.com/product/formspree-io/pricing) — 50/mo free, $10/mo 200 [WebSearch verified]
- [ABA Opinion 477R (LawPay summary)](https://www.lawpay.com/about/blog/protection-of-client-information-what-aba-opinion-477r-means-for-you/) — reasonable efforts standard; fact-specific approach
- [NJ RPC 7.2 (njcourts.gov)](https://www.njcourts.gov/attorneys/rules-of-court/advertising) — comparative advertising disclaimer requirement
- [Maryland MARPC 7.2 (CAMG)](https://www.camginc.com/white-papers/maryland/) — responsible attorney name requirement
- [W3C WAI Accessibility Statement guide](https://www.w3.org/WAI/planning/statements/) — required content for accessibility statement
- [CVE-2024-56140 Astro CSRF advisory](https://github.com/withastro/astro/security/advisories/GHSA-c4pw-33h3-35xw) — patched in Astro 4.16.17+; Astro 6 is safe

### Tertiary (LOW confidence — flag for validation)
- Fontsource/google-webfonts-helper as font download tools [ASSUMED — not verified in this session]
- NJ governing law for Terms page [ASSUMED — needs Scott confirmation]

---

## Metadata

**Confidence breakdown:**
- Contact form architecture: HIGH — Astro Actions pattern verified against Context7 docs; CSP compatibility verified against codebase
- Blog system: HIGH — all patterns verified against Context7; collection schema already in codebase
- SEO/sitemap: HIGH — sitemap already configured; robots.txt correct; gap in SEO.astro identified from codebase read
- Legal page content: MEDIUM — ABA/NJ/MD requirements cited from official/authoritative sources; specific wording is ASSUMED safe-baseline
- Security controls: HIGH — all 7 FORM-03 controls mapped; CSRF patch confirmed for Astro 6.3.1+
- Performance: HIGH — font gap definitively identified from codebase; PERF-02 is zero implementation
- Provider options (Q3): MEDIUM — pricing and setup verified; ABA 477R analysis is research-based reasoning, not a formal ethics opinion

**Research date:** 2026-05-08
**Valid until:** 2026-07-08 (Astro stable; Resend pricing stable)
