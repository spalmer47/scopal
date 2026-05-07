# Technology Stack — Scopal Firm, LLC

**Project:** Scopal Firm law firm website
**Researched:** 2026-05-07
**Stack (locked):** Astro 6 + Tailwind CSS v4 + Vercel
**Operator profile:** Non-developer attorney; Claude Code is the maintainer
**Overall confidence:** HIGH (all major decisions verified against official docs as of May 2026)

---

## TL;DR — Recommended Concrete Stack

| Layer | Choice | Version | Rationale |
|------|--------|---------|-----------|
| Framework | Astro | `^6.3` | Latest stable; content-first, ships zero JS by default |
| CSS | Tailwind CSS | `^4.x` | CSS-first config, faster builds, no PostCSS/JS config |
| Tailwind ↔ Astro glue | `@tailwindcss/vite` | latest | **Required**; replaces deprecated `@astrojs/tailwind` |
| Hosting | Vercel | — | Static + on-demand routes, image optimization |
| Adapter | `@astrojs/vercel` | latest | Enables API routes/Actions on Vercel |
| Output mode | `static` with selective server routes | — | Site is mostly static; only contact form needs server |
| Form handling | Astro Actions + Resend | — | Type-safe, zod-validated, single-vendor for email |
| Email API | Resend | latest SDK | Simple API, generous free tier, deliverability |
| Sitemap | `@astrojs/sitemap` | latest | Official, zero-config |
| Content | Astro Content Collections (Markdown/MDX) | built-in | Practice areas, attorneys, blog as typed Zod-validated content |
| Optional MDX | `@astrojs/mdx` | latest | Only if blog posts need embedded components |
| Type safety | TypeScript (strict) | latest | Astro is TS-native; helps Claude pick up context |

**One sentence:** Astro 6 in `static` mode with one server-rendered Action for the contact form, Tailwind v4 via the `@tailwindcss/vite` plugin, deployed on Vercel with the `@astrojs/vercel` adapter, and Resend for email delivery.

---

## 1. Astro 6 — What's New & Patterns for Content-Heavy Sites

### Astro 6 vs Astro 5 (verified)
Astro 6.0 shipped **March 10, 2026**; the current minor is **6.3 (May 7, 2026)**.

Material changes that affect this project:

| Change | Impact on Scopal |
|--------|------------------|
| Refactored dev server | Faster local iteration; nothing to configure |
| Experimental Rust compiler | Opt-in only; **leave disabled** for stability |
| Live content collections | Optional. We will use **build-time** collections (data is static) |
| CSP support | Available; we'll add a basic CSP via `vercel.json` headers |
| Resilient island hydration (6.3) | Irrelevant — site is mostly static |
| `content.config.ts` (replaces `src/content/config.ts`) | Use new path; v5 path still works but is legacy |
| Image optimization improvements | Use `<Image />` from `astro:assets` everywhere |

**Decision:** Use stable features only. No experimental flags. If Claude resumes a session, every behavior should be predictable from the docs.

### Project Layout (recommended for content-heavy law firm site)

```
src/
  layouts/
    BaseLayout.astro          # <html>, <head>, global meta, nav, footer
    PageLayout.astro          # extends BaseLayout; standard marketing page
    PostLayout.astro          # extends BaseLayout; blog post w/ JSON-LD BlogPosting
    AttorneyLayout.astro      # extends BaseLayout; attorney bio w/ JSON-LD Person
    PracticeAreaLayout.astro  # extends BaseLayout; practice area w/ JSON-LD Service
  components/
    SEO.astro                 # <title>, meta description, OG, canonical, JSON-LD
    Nav.astro
    Footer.astro
    ContactForm.astro         # Astro Action client wiring
    Prose.astro               # typography wrapper for markdown bodies
  pages/
    index.astro
    about.astro
    contact.astro
    practice-areas/
      index.astro             # lists collection entries
      [slug].astro            # renders one practice area
    attorneys/
      index.astro
      [slug].astro
    blog/
      index.astro
      [slug].astro
  content/
    practice-areas/*.md
    attorneys/*.md
    blog/*.md
  actions/
    index.ts                  # contact form action
  styles/
    global.css                # @import "tailwindcss"; theme tokens
content.config.ts             # collection schemas (Astro 6 location)
astro.config.mjs
```

This layout is conventional and lets Claude orient quickly: every URL maps to a file under `src/pages`, every content type maps to a folder under `src/content`.

### Routing Patterns
- **Static pages** → file in `src/pages/*.astro`
- **Dynamic from a collection** → `src/pages/blog/[slug].astro` exporting `getStaticPaths()` that maps `getCollection('blog')` to params
- **API/server routes** → `src/pages/api/*.ts` with `export const prerender = false`. Required because the project default will be `output: 'static'`.

### Astro 6 + Tailwind v4 Gotchas (verified against Astro docs)

1. **`@astrojs/tailwind` is DEPRECATED.** Do not install it. Use `@tailwindcss/vite` directly. Astro docs explicitly redirect to the styling guide.
2. **`astro add tailwind`** (in Astro 5.2+ and all of v6) wires up the Vite plugin automatically — prefer this command over manual setup.
3. The CSS file with `@import "tailwindcss";` must be imported in a layout (typically `BaseLayout.astro`) — Astro does not auto-inject it.
4. Tailwind's automatic content detection respects `.gitignore` — no `content` array to configure, but anything ignored won't be scanned. Don't `.gitignore` your `src/`.
5. Astro's scoped styles (`<style>` blocks in components) coexist with Tailwind. Mixing both is fine; prefer Tailwind utilities for consistency, scoped styles only for genuinely component-local edge cases.
6. **Class-based dark mode in v4** uses `@custom-variant dark (&:where(.dark, .dark *));` in CSS — different from v3's `darkMode: 'class'` JS config. Not needed unless we add dark mode (recommend skipping for a law firm).

---

## 2. Tailwind CSS v4 — Configuration & Astro Integration

### What Changed from v3 → v4 (verified)

| Area | v3 | v4 |
|------|----|----|
| Config file | `tailwind.config.js` (JS) | `@theme { ... }` block in CSS |
| Imports | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` (single line) |
| Build engine | PostCSS | Native Vite plugin (`@tailwindcss/vite`) |
| Content paths | Manually configured | Auto-detected (respects `.gitignore`) |
| Color space | `rgb` | `oklch` (wider gamut) |
| Container queries | Plugin | Built-in |
| Performance | Baseline | 3.5–5× full build, 8–100× incremental |

### Concrete Setup for Astro 6

**Install** (use the CLI to avoid hand-wiring):
```bash
npx astro add tailwind
```

If hand-installing:
```bash
npm install tailwindcss @tailwindcss/vite
```

**`astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.scopalfirm.com', // REQUIRED for sitemap + canonical URLs
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**`src/styles/global.css`:**
```css
@import "tailwindcss";

@theme {
  /* Brand tokens — adjust to Scopal palette */
  --color-brand-50:  oklch(0.97 0.02 250);
  --color-brand-500: oklch(0.55 0.15 250);
  --color-brand-900: oklch(0.25 0.06 250);

  --font-display: "Playfair Display", "Georgia", serif;
  --font-body: "Inter", system-ui, sans-serif;

  --breakpoint-3xl: 1920px;
}

/* Optional: site-wide base typography */
@layer base {
  html { font-family: var(--font-body); }
  h1, h2, h3 { font-family: var(--font-display); }
}
```

**Import once in BaseLayout** (`src/layouts/BaseLayout.astro`):
```astro
---
import '../styles/global.css';
---
```

### Gotchas (verified)
- **No `tailwind.config.js`.** Don't create one — v4 ignores it unless you opt into a JS-config compatibility shim. Keep config in CSS for predictability.
- **Plugins (e.g., `@tailwindcss/typography`)** install as packages and are loaded with `@plugin "@tailwindcss/typography";` in CSS. **Recommend installing `@tailwindcss/typography`** for blog post body styles.
- Browser support is **modern only** (Safari 16.4+, Chrome 111+, Firefox 128+). Acceptable for a 2026 law firm site.
- `@apply` still works but is discouraged — favor utilities directly in markup.

---

## 3. Vercel + Astro

### Adapter

`@astrojs/vercel` is the only supported adapter. Install:
```bash
npx astro add vercel
```

### Static vs SSR — Decision

**Verdict: `output: 'static'` with per-route opt-in to server rendering for the contact form.**

Why:
- Practice areas, attorney bios, blog, home, about, contact (the form's display) are all content that doesn't change per request.
- Static pages get free CDN distribution, lowest latency, lowest cost, best SEO crawling.
- Astro 6 supports **hybrid** behavior in static mode: any route or action can opt into server rendering with `export const prerender = false`.

The contact form needs server execution to (a) keep the Resend API key off the client, (b) validate input, (c) protect against spam. We achieve this with an Astro Action — Actions run server-side automatically when the adapter is configured.

### Configuration (in `astro.config.mjs`)

Useful adapter options for this project:

| Option | Value | Why |
|--------|-------|-----|
| `webAnalytics.enabled` | `true` | Free, privacy-friendly analytics; one less third party |
| `imageService` | `true` | Vercel handles `<Image>` optimization in production |
| `maxDuration` | `10` | Plenty for a Resend POST; default fine |
| `isr` | not used | Site is fully static |
| `middlewareMode` | not used | No middleware needed |

### `vercel.json` (recommended at repo root)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}
```

### Deployment Gotchas
1. **`site` in `astro.config.mjs` is mandatory** for sitemap and canonical URLs. Set it before first deploy.
2. **Environment variables** (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`) must be added in Vercel project settings → Environment Variables. Use `astro:env` for type-safe access.
3. **Preview vs production envs** — Resend "from" address must be on a verified domain in production; Resend's `onboarding@resend.dev` works in preview.
4. **Function region** — for a US-based firm, set Vercel functions region to `iad1` (Washington, DC) or `cle1` (Cleveland) — closer to most US users than the default global edge.
5. **Build command** `astro build` is auto-detected. Output dir is auto-detected. No `vercel.json` build config needed.
6. **Don't use Edge runtime for the contact form** — Resend SDK uses Node APIs cleanly in serverless runtime; Edge adds complexity for no benefit on a low-traffic form.

---

## 4. Contact Form — Decision Matrix

### Options Evaluated

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Astro Actions + Resend** | Type-safe, zod-validated, server-side, no client JS framework needed, single vendor for email, free tier covers a small firm | Requires SSR adapter (already needed) | **RECOMMENDED** |
| Vercel serverless function + Resend | Same outcome, more boilerplate | Manually parse FormData, manual zod, manual fetch wiring | Skip — Actions are strictly better |
| Formspree / StaticForm | No code, no server | Third-party data path, monthly fee, harder to customize, vendor lock-in | Skip — the project already needs SSR for nothing-fancy reasons |
| Supabase + Resend | Adds DB-backed lead storage | Two vendors, two API keys, overkill for v1 | Defer — add later if leads need persistence |
| SendGrid / Mailgun | Established | Worse DX than Resend, harder onboarding | Skip — Resend is the modern default |
| Native fetch from client | Trivial | Exposes API key, bypasses validation | **Never** |

### Why Astro Actions for a Non-Developer-Operated Site

- **One concept, not three.** No separate `pages/api/*` route, no manual `request.formData()` parsing, no manual validation. The Action *is* the endpoint *and* the validator.
- **Zod schema doubles as documentation.** When Claude resumes the project, the schema in `src/actions/index.ts` describes the contact form contract in one place.
- **Errors are typed.** `error.fields` gives field-by-field feedback without custom error mapping.
- **HTML form fallback works.** Actions degrade gracefully if JS is disabled — important for accessibility-conscious legal sites.

### Concrete Implementation Pattern

**`src/actions/index.ts`:**
```ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { Resend } from 'resend';
import { RESEND_API_KEY, CONTACT_TO_EMAIL } from 'astro:env/server';

const resend = new Resend(RESEND_API_KEY);

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      phone: z.string().max(40).optional(),
      message: z.string().min(10).max(5000),
      // honeypot: bots fill this; humans don't see it
      website: z.string().max(0).optional(),
    }),
    handler: async ({ name, email, phone, message, website }) => {
      if (website && website.length > 0) {
        // Silently succeed for bots
        return { ok: true };
      }
      const { error } = await resend.emails.send({
        from: 'Scopal Website <noreply@scopalfirm.com>',
        to: [CONTACT_TO_EMAIL],
        replyTo: email,
        subject: `New inquiry from ${name}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone ?? '—')}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      });
      if (error) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Email failed to send' });
      }
      return { ok: true };
    },
  }),
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]!));
}
```

**`src/pages/contact.astro` (form usage):**
```astro
---
import { actions } from 'astro:actions';
import { getActionResult } from 'astro:actions';
import BaseLayout from '../layouts/BaseLayout.astro';

const result = Astro.getActionResult(actions.contact);
---
<BaseLayout title="Contact — Scopal Firm">
  <form method="POST" action={actions.contact}>
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <input type="tel" name="phone" />
    <textarea name="message" required></textarea>
    <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" />
    <button type="submit">Send</button>
  </form>

  {result?.data?.ok && <p>Thanks — we'll be in touch.</p>}
  {result?.error && <p>Something went wrong. Try again or email us directly.</p>}
</BaseLayout>
```

**Environment (`src/env.d.ts` plus `astro.config.mjs` env schema):**
```js
// astro.config.mjs (env block)
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  // ...
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'public' }),
    },
  },
});
```

### Operator Simplicity Notes
- **One secret to rotate** (`RESEND_API_KEY`) in Vercel dashboard.
- **One inbound email** (`CONTACT_TO_EMAIL`) — easy to change without touching code.
- Resend dashboard provides delivery logs the attorney can check directly.

### Spam Mitigation (build into v1)
1. **Honeypot field** (above) — catches 80%+ of bots.
2. **`replyTo` is the user's email**, `from` is your verified domain — keeps you out of spam folders.
3. Consider adding **Cloudflare Turnstile** in v2 if spam volume grows; not worth the friction on day one.

---

## 5. Content Collections — Schemas

Define collections in **`content.config.ts`** (Astro 6 location, at repo root level next to `astro.config.mjs`).

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const practiceAreas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/practice-areas' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string().optional(),         // override file-based slug if needed
    summary: z.string().max(200),         // 1-line lead for index pages
    icon: z.string().optional(),          // lucide icon name
    heroImage: image().optional(),
    order: z.number().default(100),       // controls listing order
    featured: z.boolean().default(false),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

const attorneys = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/attorneys' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    title: z.string(),                    // e.g., "Founding Partner"
    photo: image(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    barAdmissions: z.array(z.string()).default([]),
    education: z.array(z.object({
      school: z.string(),
      degree: z.string(),
      year: z.number().optional(),
    })).default([]),
    practiceAreas: z.array(z.string()).default([]),  // slugs of practice-areas
    linkedin: z.string().url().optional(),
    order: z.number().default(100),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160),     // matches meta description length
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),                   // attorney slug
    heroImage: image().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { practiceAreas, attorneys, blog };
```

### Querying Patterns

```ts
// List page: src/pages/practice-areas/index.astro
import { getCollection } from 'astro:content';
const areas = (await getCollection('practiceAreas'))
  .sort((a, b) => a.data.order - b.data.order);

// Detail page: src/pages/practice-areas/[slug].astro
export async function getStaticPaths() {
  const entries = await getCollection('practiceAreas');
  return entries.map(entry => ({
    params: { slug: entry.id.replace(/\.md$/, '') },
    props: { entry },
  }));
}
const { entry } = Astro.props;
const { Content } = await entry.render();
```

### Notes
- **`image()` in schema** validates and optimizes via `astro:assets`. The image must live alongside the markdown or in `src/assets/`.
- **Filter drafts** in production: `getCollection('blog', ({ data }) => import.meta.env.PROD ? !data.draft : true)`.
- **Don't store author bios in the blog frontmatter** — reference attorney slugs and look them up. Single source of truth.

---

## 6. SEO with Astro

### Approach: One `<SEO />` component per layout

Build a single `src/components/SEO.astro` that emits **all** head metadata: title, description, canonical, Open Graph, Twitter, and JSON-LD. Import it into each layout; pass page-specific props.

### `src/components/SEO.astro`

```astro
---
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}
const {
  title,
  description,
  canonical = new URL(Astro.url.pathname, Astro.site).href,
  ogImage = new URL('/og-default.jpg', Astro.site).href,
  noindex = false,
  jsonLd,
} = Astro.props;

const fullTitle = `${title} | Scopal Firm`;
---
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex" />}

<meta property="og:type" content="website" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

{jsonLd && (
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
)}
```

### Site-Wide JSON-LD (in BaseLayout)

Every page gets the firm's `LegalService` graph:

```ts
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  '@id': 'https://www.scopalfirm.com/#organization',
  name: 'Scopal Firm, LLC',
  url: 'https://www.scopalfirm.com',
  telephone: '+1-XXX-XXX-XXXX',
  email: 'contact@scopalfirm.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '...',
    addressLocality: '...',
    addressRegion: '..',
    postalCode: '.....',
    addressCountry: 'US',
  },
  priceRange: '$$',
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    opens: '09:00',
    closes: '17:00',
  }],
  areaServed: { '@type': 'State', name: '...' },
};
```

### Page-Type JSON-LD

| Layout | JSON-LD `@type` | Notes |
|--------|------------------|-------|
| BaseLayout (every page) | `LegalService` (firm) | Hardcoded in BaseLayout |
| AttorneyLayout | `Person` with `worksFor` linking to firm `@id` | **Do not use deprecated `Attorney` type** — use `Person` |
| PracticeAreaLayout | `Service` with `provider` linking to firm `@id` | |
| PostLayout | `BlogPosting` with `author` (Person) and `publisher` (LegalService) | |
| FAQ sections (e.g., on practice area pages) | `FAQPage` | Eligible for rich results |

**Verified note:** Schema.org's `Attorney` type is deprecated; `LegalService` + `Person` is the current correct pattern.

### Sitemap

`@astrojs/sitemap` is zero-config once `site` is set. Add it to integrations and you get `sitemap-index.xml` automatically. Optionally filter:

```js
sitemap({
  filter: (page) => !page.includes('/draft/'),
  changefreq: 'monthly',
  priority: 0.7,
})
```

### `robots.txt`

Astro auto-serves anything in `public/`. Drop `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://www.scopalfirm.com/sitemap-index.xml
```

### Other SEO Hygiene
- **Canonical URLs**: handled by SEO component using `Astro.site` + `Astro.url.pathname`.
- **`hreflang`**: not needed (single language v1).
- **Structured data testing**: Google's Rich Results Test before each deploy of the Attorney/PracticeArea pages.
- **Page speed**: Astro 6 + Tailwind v4 + Vercel image service hits 95+ Lighthouse out of the box; do not add client-side JS frameworks unless required.

---

## Alternatives Considered (and why we said no)

| Category | Recommended | Alternative | Why not |
|----------|-------------|-------------|---------|
| Tailwind integration | `@tailwindcss/vite` | `@astrojs/tailwind` | Officially deprecated |
| Form host | Astro Actions | Formspree | External data path; project already needs SSR adapter for image optimization & analytics |
| Email | Resend | SendGrid | Worse DX; harder onboarding; Resend has become the de-facto Astro default |
| CMS | Markdown collections | Sanity / Contentful | Attorney isn't editing daily; markdown in git is auditable & free; Claude can edit it directly |
| Output | `static` + per-route SSR | Full `server` mode | Static is faster, cheaper, better-SEO'd; we only need one server route |
| Analytics | Vercel Web Analytics | GA4 / Plausible | Already paying for Vercel; one less third-party script; privacy-friendly |
| Hosting | Vercel (locked) | Netlify / Cloudflare Pages | Locked by user requirement |

---

## Installation Cheat Sheet (copy-paste for Phase 1)

```bash
# Bootstrap
npm create astro@latest -- --template minimal --typescript strict

# Tailwind v4
npx astro add tailwind

# Vercel adapter
npx astro add vercel

# Sitemap
npm install @astrojs/sitemap

# Markdown typography (recommended for blog)
npm install @tailwindcss/typography

# Email
npm install resend

# Optional: MDX (only if blog needs embedded components)
npx astro add mdx
```

---

## Sources

### Primary (HIGH confidence)
- [Astro Blog — releases & Astro 6.0 announcement](https://astro.build/blog/)
- [Astro Docs — Styling & Tailwind](https://docs.astro.build/en/guides/styling/)
- [Astro Docs — Vercel Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/)
- [Astro Docs — Deploy to Vercel](https://docs.astro.build/en/guides/deploy/vercel/)
- [Astro Docs — Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Docs — Actions](https://docs.astro.build/en/guides/actions/)
- [Astro Docs — API Reference](https://docs.astro.build/en/reference/api-reference/)
- [Astro Docs — @astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Tailwind CSS v4 Release Notes](https://tailwindcss.com/blog/tailwindcss-v4)
- [Resend — Send with Astro](https://resend.com/docs/send-with-astro)

### Secondary (MEDIUM confidence — community/blog corroboration)
- [Contact forms in Astro with server actions and Resend — Content Island](https://contentisland.net/en/blog/astro-contact-form-server-actions-resend/)
- [Add JSON-LD Structured Data in Astro — John Dalesandro](https://johndalesandro.com/blog/astro-add-json-ld-structured-data-to-your-website-for-rich-search-results/)
- [Astro SEO complete guide — Joost.blog](https://joost.blog/astro-seo-complete-guide/)
- [Schema Markup for Law Firms — JL Faverio](https://jlfaverio.com/schema-for-law-firms-guide/)
- [Schema.org LegalService](https://schema.org/LegalService)
- [Schema.org Attorney (deprecated — use LegalService + Person)](https://schema.org/Attorney)
