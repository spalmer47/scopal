# Phase 4: Lead Capture + Content + Launch Hardening — Pattern Map

**Mapped:** 2026-05-08
**Files analyzed:** 21 new/modified files
**Analogs found:** 17 / 21

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/actions/index.ts` | service / API handler | request-response | _(no existing action)_ | no analog |
| `src/pages/contact.astro` | page (modify) | request-response | `src/pages/contact.astro` (current placeholder) | exact (replace) |
| `src/pages/contact/thank-you.astro` | page | request-response | `src/pages/pricing.astro` | role-match |
| `src/layouts/BlogPostLayout.astro` | layout | transform | `src/layouts/PracticeAreaLayout.astro` | exact |
| `src/components/seo/ArticleSchema.astro` | component / SEO | transform | `src/components/seo/ServiceSchema.astro` | exact |
| `src/components/legal/Testimonial.astro` | component | transform | `src/components/legal/DisclaimerCallout.astro` | role-match |
| `src/components/legal/CaseResult.astro` | component | transform | `src/components/legal/DisclaimerCallout.astro` | role-match |
| `src/pages/blog/[...page].astro` | page (dynamic) | CRUD / batch | `src/pages/practice-areas/[slug].astro` | role-match |
| `src/pages/blog/[slug].astro` | page (dynamic) | CRUD | `src/pages/practice-areas/[slug].astro` | exact |
| `src/pages/rss.xml.js` | endpoint | batch | _(no existing endpoint)_ | no analog |
| `src/pages/legal/disclaimer.astro` | page | request-response | `src/pages/pricing.astro` | role-match |
| `src/pages/legal/privacy.astro` | page | request-response | `src/pages/pricing.astro` | role-match |
| `src/pages/legal/terms.astro` | page | request-response | `src/pages/pricing.astro` | role-match |
| `src/pages/legal/accessibility-statement.astro` | page | request-response | `src/pages/pricing.astro` | role-match |
| `src/components/seo/SEO.astro` | component / SEO (modify) | transform | `src/components/seo/SEO.astro` (current) | exact (upgrade) |
| `src/components/layout/Header.astro` | component / layout (modify) | request-response | `src/components/layout/Header.astro` (current) | exact (add link) |
| `src/components/layout/Footer.astro` | component / layout (modify) | request-response | `src/components/layout/Footer.astro` (current) | exact (add links) |
| `src/styles/global.css` | config / styles (modify) | transform | `src/styles/global.css` (current) | exact (add rules) |
| `src/layouts/BaseLayout.astro` | layout (modify) | transform | `src/layouts/BaseLayout.astro` (current) | exact (add preload) |
| `public/fonts/` | static asset | file-I/O | _(no existing fonts)_ | no analog |
| `public/og-default.jpg` | static asset | file-I/O | _(no existing OG image)_ | no analog |

---

## Pattern Assignments

### `src/actions/index.ts` (service, request-response)

**Analog:** No existing actions in the codebase. Use RESEARCH.md Pattern 1 directly.

**Key structural rules:**
- Export `const server = { sendContact: defineAction(...) }` — Astro Actions convention
- `accept: 'form'` enables the HTML no-JS POST path (FORM-04)
- `context.clientAddress` is available on Vercel (needed for rate limit)
- Use `ActionError` (from `astro:actions`) for user-safe error messages — never throw raw `Error` with stack traces to client (V7 security)

**Imports pattern** (from RESEARCH.md Pattern 1):
```typescript
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
// Provider import (one of the following, per Scott's Q3 decision):
// Option A: import { Resend } from 'resend';
// Option B/C: no additional import needed for HTTP POST
```

**Core action pattern** (from RESEARCH.md Pattern 1):
```typescript
export const server = {
  sendContact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1).max(100)
        .refine(v => !/[\r\n]/.test(v), 'Invalid characters'),
      email: z.string().email().max(254)
        .refine(v => !/[\r\n]/.test(v), 'Invalid characters'),
      company: z.string().max(200).optional(),
      description: z.string().min(1).max(2000),
      honeypot: z.string().max(0).optional(),
    }),
    handler: async (input, context) => {
      if (input.honeypot && input.honeypot.length > 0) {
        throw new ActionError({ code: 'FORBIDDEN', message: 'Submission rejected.' });
      }
      const ip = context.clientAddress ?? 'unknown';
      checkRateLimit(ip);   // module-scope Map<string, {count, resetAt}>
      // Pass raw values — sendEmail escapes all fields internally (FORM-03 Control 5)
      await sendEmail({ name: input.name, email: input.email, company: input.company, description: input.description });
    },
  }),
};
```

**Email helper pattern** (Option A — Resend; hardcoded From/Subject per FORM-03 control 7; escapeHtml on ALL user-supplied fields per FORM-03 Control 5):
```typescript
import { Resend } from 'resend';
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Control 5: escapeHtml applied to ALL user-supplied fields before embedding in HTML body.
// name, email, company, and description are all untrusted input — escape every one.
async function sendEmail(data: { name: string; email: string; company?: string; description: string }) {
  await resend.emails.send({
    from: 'contact@scopalfirm.com',   // Fixed — never user-supplied
    to: 'scott@scopalfirm.com',       // from FIRM.email constant
    subject: 'New Contact Form Submission — Scopal Firm',  // Fixed
    html: `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
           <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
           <p><strong>Company:</strong> ${data.company ? escapeHtml(data.company) : '—'}</p>
           <p><strong>Message:</strong> ${escapeHtml(data.description)}</p>`,
  });
}
```

**Rate-limit helper pattern** (module scope, in-memory):
```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return;
  }
  if (entry.count >= 5) {
    throw new ActionError({ code: 'TOO_MANY_REQUESTS', message: 'Too many submissions. Try again later.' });
  }
  entry.count++;
}
```

---

### `src/pages/contact.astro` (page, request-response — MODIFY/REPLACE)

**Analog:** Current `src/pages/contact.astro` (replace entirely)

**Critical rule:** `export const prerender = false` MUST be the first line of the frontmatter — without it the action never runs (Pitfall 1).

**Imports pattern** (lines 1-5 of current file, extended):
```astro
---
export const prerender = false;
import { actions } from 'astro:actions';
import MarketingLayout from '../layouts/MarketingLayout.astro';
import { FIRM } from '../lib/constants';
---
```

**Core page pattern** (from current contact.astro structure + RESEARCH.md Pattern 1):
```astro
---
export const prerender = false;
import { actions } from 'astro:actions';
import MarketingLayout from '../layouts/MarketingLayout.astro';
import { FIRM } from '../lib/constants';

const result = Astro.getActionResult(actions.sendContact);
if (result && !result.error) {
  return Astro.redirect('/contact/thank-you');
}
---
<MarketingLayout
  title="Contact — Annandale, NJ | Scopal Firm"
  description="Reach out to Scott Palmer at Scopal Firm to start a conversation about fractional general counsel for your SaaS company."
>
  <div class="mx-auto max-w-prose px-md py-12 md:py-16">
    <h1 class="font-display font-semibold text-4xl md:text-5xl text-ink leading-[1.15] mb-8">
      Get in Touch
    </h1>
    <form method="POST" action={actions.sendContact} novalidate>
      <!-- Honeypot: CSS-hidden, NOT display:none (Pitfall, Anti-pattern) -->
      <div style="position: absolute; left: -9999px;" aria-hidden="true">
        <input type="text" name="honeypot" tabindex="-1" autocomplete="off" />
      </div>
      <!-- Fields: name, email, company, description -->
      <!-- ABA 477R disclaimer block ABOVE submit button (FORM-02) -->
      <div class="border-l-4 border-brand-blue-500 bg-surface-muted px-6 py-4 text-sm text-ink-muted leading-relaxed rounded-r-lg mb-6" role="note">
        <strong class="text-ink">Note:</strong> {FIRM.noAttorneyClientDisclaimer}
      </div>
      <button type="submit" class="bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-base font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2">
        Send Message
      </button>
    </form>
  </div>
</MarketingLayout>
```

**CTA / link style pattern** (from `src/pages/contact.astro` lines 18-23 — copy focus-visible + hover classes):
```astro
class="text-ink underline underline-offset-2 hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500 transition-colors"
```

---

### `src/pages/contact/thank-you.astro` (page, request-response — NEW)

**Analog:** `src/pages/pricing.astro`

**Imports pattern** (from `src/pages/pricing.astro` lines 1-5):
```astro
---
import MarketingLayout from '../../layouts/MarketingLayout.astro';
import CTASection from '../../components/sections/CTASection.astro';
import { FIRM } from '../../lib/constants';
---
```

**Core page pattern** (simple static confirmation — no CTASection needed; model section structure on pricing.astro hero section lines 34-49):
```astro
<MarketingLayout
  title="Message Received — Annandale, NJ | Scopal Firm"
  description="Your message has been received. Scott Palmer will respond within 2 business days."
  noindex={true}
>
  <section class="bg-surface py-16 md:py-24">
    <div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl">
      <div class="max-w-2xl">
        <h1 class="font-display font-semibold text-4xl md:text-5xl text-ink leading-[1.15]">
          Message Received
        </h1>
        <p class="mt-6 text-base md:text-lg leading-relaxed text-ink-muted">
          Scott reads every message and responds within 2 business days.
          {FIRM.noAttorneyClientDisclaimer}
        </p>
      </div>
    </div>
  </section>
</MarketingLayout>
```

**Note:** `noindex={true}` prevents thank-you page from appearing in search results. `SEO.astro` already supports this prop (line 7, line 20).

---

### `src/layouts/BlogPostLayout.astro` (layout, transform — NEW)

**Analog:** `src/layouts/PracticeAreaLayout.astro` (exact structural match)

**Imports pattern** (from `PracticeAreaLayout.astro` lines 1-7, extended for blog):
```astro
---
import MarketingLayout from './MarketingLayout.astro';
import ArticleSchema from '../components/seo/ArticleSchema.astro';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema.astro';
import DisclaimerCallout from '../components/legal/DisclaimerCallout.astro';
import CTASection from '../components/sections/CTASection.astro';
import { FIRM } from '../lib/constants';
---
```

**Props interface pattern** (from `PracticeAreaLayout.astro` lines 9-16 — same shape, different fields):
```astro
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  updatedDate?: Date;
  ogImage?: string;
}
const { title, description, pubDate, slug, updatedDate, ogImage } = Astro.props;
```

**Breadcrumbs pattern** (from `PracticeAreaLayout.astro` lines 18-21 — copy exactly, change path):
```astro
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: title, url: `/blog/${slug}` },
];
```

**Core layout pattern** (from `PracticeAreaLayout.astro` lines 23-49 — copy structure; swap ServiceSchema/FAQSchema for ArticleSchema; remove FAQ rendering block):
```astro
<MarketingLayout {title} {description} ogType="article" {ogImage}>
  <ArticleSchema {title} {description} {pubDate} {slug} {updatedDate} />
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

**Key difference from PracticeAreaLayout:** No `FAQSchema`, no FAQ rendering block. Add `ogType="article"` on `MarketingLayout` (passes through `BaseLayout` → `SEO.astro` line 9).

---

### `src/components/seo/ArticleSchema.astro` (component/SEO, transform — NEW)

**Analog:** `src/components/seo/ServiceSchema.astro` (exact structural match — same pattern: FIRM import, interface Props, build schema object, emit `<script type="application/ld+json">`)

**Full analog file** (`src/components/seo/ServiceSchema.astro` lines 1-24):
```astro
---
import { FIRM } from '../../lib/constants';
interface Props {
  name: string;
  description: string;
}
const { name, description } = Astro.props;
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'LegalService',
    name: FIRM.legalName,
    url: FIRM.url,
  },
  areaServed: {
    '@type': FIRM.areaServed.type,
    name: FIRM.areaServed.name,
  },
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Adapted for Article** (copy ServiceSchema structure, change `@type` and fields):
```astro
---
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

**Emit pattern** (from `ServiceSchema.astro` line 24 — copy exactly):
```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### `src/components/legal/Testimonial.astro` (component, transform — NEW)

**Analog:** `src/components/legal/DisclaimerCallout.astro`

**Full analog file** (`src/components/legal/DisclaimerCallout.astro` lines 1-10):
```astro
---
import { FIRM } from '../../lib/constants';
---
<div
  class="border-l-4 border-brand-blue-500 bg-surface-muted px-6 py-4 text-sm text-ink-muted leading-relaxed rounded-r-lg"
  role="note"
  aria-label="Legal disclaimer"
>
  <strong class="text-ink">Note:</strong> {FIRM.noAttorneyClientDisclaimer}
</div>
```

**Adapted pattern** (LEGAL-04: `disclaimer` is a REQUIRED prop — TypeScript enforces this at build time):
```astro
---
interface Props {
  quote: string;
  attribution: string;
  disclaimer: string;  // Required — build fails if omitted (LEGAL-04)
}
const { quote, attribution, disclaimer } = Astro.props;
---
<figure class="border-l-4 border-brand-blue-500 bg-surface-muted px-6 py-4 rounded-r-lg">
  <blockquote class="text-base leading-relaxed text-ink italic">
    <p>{quote}</p>
  </blockquote>
  <figcaption class="mt-2 text-sm text-ink-muted">— {attribution}</figcaption>
  <div
    class="mt-3 text-sm text-ink-muted leading-relaxed"
    role="note"
    aria-label="Legal disclaimer"
  >
    <strong class="text-ink">Note:</strong> {disclaimer}
  </div>
</figure>
```

---

### `src/components/legal/CaseResult.astro` (component, transform — NEW)

**Analog:** `src/components/legal/DisclaimerCallout.astro` (same as Testimonial)

**Adapted pattern** (same LEGAL-04 required-prop enforcement; different content shape):
```astro
---
interface Props {
  outcome: string;
  context: string;
  disclaimer: string;  // Required — build fails if omitted (LEGAL-04)
}
const { outcome, context, disclaimer } = Astro.props;
---
<div class="bg-surface border border-border rounded-lg p-6">
  <p class="font-display font-semibold text-xl text-ink leading-[1.25]">{outcome}</p>
  <p class="mt-2 text-base leading-relaxed text-ink-muted">{context}</p>
  <div
    class="mt-4 border-l-4 border-brand-blue-500 px-4 py-3 text-sm text-ink-muted leading-relaxed rounded-r-lg bg-surface-muted"
    role="note"
    aria-label="Legal disclaimer"
  >
    <strong class="text-ink">Note:</strong> {disclaimer}
  </div>
</div>
```

---

### `src/pages/blog/[...page].astro` (page/dynamic, batch — NEW)

**Analog:** `src/pages/practice-areas/[slug].astro` (same getStaticPaths + collection pattern)

**Full analog file** (`src/pages/practice-areas/[slug].astro` lines 1-23):
```astro
---
import { getCollection, render } from 'astro:content';
import PracticeAreaLayout from '../../layouts/PracticeAreaLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('practiceAreas');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<PracticeAreaLayout ...>
  <Content />
</PracticeAreaLayout>
```

**Adapted pattern** (paginate instead of map; draft filter per BLOG-03; use `post.id` not `post.slug` per Pitfall 4):
```astro
---
import { getCollection } from 'astro:content';
import MarketingLayout from '../../layouts/MarketingLayout.astro';
import { FIRM } from '../../lib/constants';

export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return paginate(sorted, { pageSize: 10 });
}

const { page } = Astro.props;
---
<MarketingLayout
  title="Blog — Annandale, NJ | Scopal Firm"
  description="Legal insights for SaaS founders from Scott A. Palmer, fractional general counsel."
>
  <!-- post list, pagination controls -->
</MarketingLayout>
```

**Post link pattern** (use `post.id` — Astro 6 removes `post.slug`, Pitfall 4):
```astro
<a href={`/blog/${post.id}`}>{post.data.title}</a>
```

---

### `src/pages/blog/[slug].astro` (page/dynamic, CRUD — NEW)

**Analog:** `src/pages/practice-areas/[slug].astro` (exact structural match)

**Adapted pattern** (same getStaticPaths shape; draft filter; use `BlogPostLayout`; pass frontmatter props):
```astro
---
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },   // post.id, NOT post.slug (Pitfall 4)
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogPostLayout
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  updatedDate={post.data.updatedDate}
  slug={post.id}
  ogImage={post.data.heroImage}
>
  <Content />
</BlogPostLayout>
```

---

### `src/pages/rss.xml.js` (endpoint, batch — NEW)

**Analog:** No existing endpoint in codebase. Use RESEARCH.md Pattern 6 directly.

**Full pattern** (from RESEARCH.md Pattern 6 — draft filter critical per Pitfall 6):
```javascript
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
      link: `/blog/${post.id}/`,   // trailing slash allowed in RSS items (not page URLs)
    })),
    customData: `<language>en-us</language>`,
  });
}
```

**Note:** This is a `.js` file, not `.astro`. It uses the Astro static endpoint convention (`export async function GET`). The `@astrojs/rss` package is already in `package.json` at version 4.0.18.

---

### `src/pages/legal/disclaimer.astro` (page, request-response — NEW)
### `src/pages/legal/privacy.astro` (page, request-response — NEW)
### `src/pages/legal/terms.astro` (page, request-response — NEW)
### `src/pages/legal/accessibility-statement.astro` (page, request-response — NEW)

**Analog:** `src/pages/pricing.astro` (same static page pattern: MarketingLayout wrapper, section/div content structure, FIRM constants, CTASection at bottom)

**Imports pattern** (from `src/pages/pricing.astro` lines 1-5):
```astro
---
import MarketingLayout from '../../layouts/MarketingLayout.astro';
import CTASection from '../../components/sections/CTASection.astro';
import { FIRM } from '../../lib/constants';
---
```

**Hero section pattern** (from `src/pages/pricing.astro` lines 34-49 — copy section/div structure):
```astro
<MarketingLayout
  title="[Page Title] — Annandale, NJ | Scopal Firm"
  description="[Page description ≤160 chars]"
>
  <section class="bg-surface py-16 md:py-24">
    <div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl">
      <div class="max-w-2xl">
        <h1 class="font-display font-semibold text-4xl md:text-5xl text-ink leading-[1.15]">
          [Page Heading]
        </h1>
        <!-- body content using prose-style divs -->
      </div>
    </div>
  </section>
  <CTASection />
</MarketingLayout>
```

**Prose paragraph pattern** (from `src/pages/pricing.astro` lines 43-47):
```astro
<p class="mt-6 text-base md:text-lg leading-relaxed text-ink-muted">
  [Paragraph text]
</p>
```

**FIRM constants to use in legal pages:**
- `FIRM.legalName` — "Scopal Firm, LLC"
- `FIRM.email` — "scott@scopalfirm.com"
- `FIRM.responsibleAttorney` — "Scott A. Palmer"
- `FIRM.attorneyAdvertising` — "Attorney Advertising. Prior results do not guarantee a similar outcome."
- `FIRM.jurisdictionDisclaimer` — full jurisdiction text
- `FIRM.noAttorneyClientDisclaimer` — full no-ARC disclaimer text

**Title format** (all ≤60 chars, following existing page pattern):
- `"Legal Disclaimer — Annandale, NJ | Scopal Firm"` (47 chars)
- `"Privacy Policy — Annandale, NJ | Scopal Firm"` (45 chars)
- `"Terms of Use — Annandale, NJ | Scopal Firm"` (43 chars)
- `"Accessibility Statement — Annandale, NJ | Scopal Firm"` (54 chars)

---

### `src/components/seo/SEO.astro` (component/SEO, transform — MODIFY)

**Analog:** `src/components/seo/SEO.astro` (current — upgrade in place)

**Current file** (`src/components/seo/SEO.astro` lines 1-20 — full file):
```astro
---
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}
const { title, description, ogImage, ogType = 'website', noindex = false } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL.toString()} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonicalURL.toString()} />
{ogImage && <meta property="og:image" content={ogImage} />}
{noindex && <meta name="robots" content="noindex,nofollow" />}
```

**What to add** (lines to insert after line 10, before `---`):
```typescript
const resolvedOgImage = ogImage ?? '/og-default.jpg';
const absoluteOgImage = resolvedOgImage.startsWith('http')
  ? resolvedOgImage
  : new URL(resolvedOgImage, Astro.site).toString();
```

**What to replace** (line 19 — conditional becomes unconditional with fallback; add new tags):
```astro
<!-- Replace: {ogImage && <meta property="og:image" content={ogImage} />} -->
<!-- With: -->
<meta property="og:image" content={absoluteOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Scopal Firm" />
<meta name="twitter:card" content="summary_large_image" />
{noindex && <meta name="robots" content="noindex,nofollow" />}
```

**Pitfall to avoid:** OG image must be absolute URL — social crawlers reject relative paths (Pitfall 7). `new URL(path, Astro.site).toString()` converts `/og-default.jpg` to `https://scopalfirm.com/og-default.jpg`.

---

### `src/components/layout/Header.astro` (component/layout, request-response — MODIFY)

**Analog:** `src/components/layout/Header.astro` (current — add one nav link in two locations)

**Desktop nav — where to insert** (after line 54, before the CTA `<a>` element at line 55):
```astro
<!-- Insert this line after the Pricing link (line 54) -->
<a href="/blog" class="text-base text-ink hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500 transition-colors">Blog</a>
```

**Copy link class from** existing nav links (lines 52-54):
```
class="text-base text-ink hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500 transition-colors"
```

**Mobile nav — where to insert** (after line 103, before the CTA `<a>` element at line 104):
```astro
<!-- Insert this line after the Pricing mobile link (line 103) -->
<a href="/blog" class="text-base text-ink hover:text-brand-blue-500 py-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500">Blog</a>
```

**Copy mobile link class from** existing mobile nav links (lines 101-103):
```
class="text-base text-ink hover:text-brand-blue-500 py-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500"
```

---

### `src/components/layout/Footer.astro` (component/layout, request-response — MODIFY)

**Analog:** `src/components/layout/Footer.astro` (current — add privacy/terms links)

**Current copyright bar** (`src/components/layout/Footer.astro` lines 23-28):
```astro
<div class="border-t border-[oklch(0.30_0.04_250)]">
  <p class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-md text-sm">
    &copy; {year} {FIRM.legalName}. All rights reserved.
  </p>
</div>
```

**Replace `<p>` with a flex row** (add privacy/terms links alongside copyright):
```astro
<div class="border-t border-[oklch(0.30_0.04_250)]">
  <div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-md flex flex-wrap gap-4 items-center justify-between text-sm">
    <p>&copy; {year} {FIRM.legalName}. All rights reserved.</p>
    <nav aria-label="Legal pages" class="flex flex-wrap gap-4">
      <a href="/legal/privacy" class="underline underline-offset-2 hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500">Privacy Policy</a>
      <a href="/legal/terms" class="underline underline-offset-2 hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500">Terms of Use</a>
      <a href="/legal/disclaimer" class="underline underline-offset-2 hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500">Disclaimer</a>
    </nav>
  </div>
</div>
```

**Link style reference** — copy from existing footer email link (`src/components/layout/Footer.astro` lines 13-16):
```
class="underline underline-offset-2 hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500"
```

---

### `src/styles/global.css` (config/styles, transform — MODIFY)

**Analog:** `src/styles/global.css` (current — append `@font-face` rules)

**Current file structure** (full file, 59 lines): Tailwind v4 `@import` → `@plugin` → `@theme` block (color, typography, spacing tokens) → `@layer base` block.

**Where to add:** Append `@font-face` declarations AFTER the `@layer base` block (after line 59), BEFORE the end of the file. Do not insert inside `@theme` or `@layer base`.

**Pattern to add** (Tailwind v4 CSS-first; `font-display: swap` per D10):
```css
/* SELF-HOSTED FONTS — Phase 4 / PERF-02
 * Files committed to public/fonts/. No Google Fonts CDN.
 * font-display: swap per D10. Two families × two weights (D10 constraint).
 * Authoritative: .planning/phases/04-*/04-RESEARCH.md §PERF-02
 */
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
}

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
}

@font-face {
  font-family: "Fraunces";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/Fraunces-SemiBold.woff2') format('woff2');
}
```

**Note:** The `--font-body` and `--font-display` CSS custom properties already reference `"Inter"` and `"Fraunces"` by name (lines 27-28 of current file). The `@font-face` declarations activate those references — no change to the `@theme` block is needed.

---

### `src/layouts/BaseLayout.astro` (layout, transform — MODIFY)

**Analog:** `src/layouts/BaseLayout.astro` (current — replace TODO comment with actual preload links)

**Current TODO comment** (`src/layouts/BaseLayout.astro` line 25):
```astro
<!-- TODO: Add Fraunces 600 preload link once woff2 file is committed to public/fonts/ -->
```

**Replace with** (preload above-fold weights per D10; `crossorigin` attribute required for font preloads):
```astro
<link rel="preload" as="font" type="font/woff2" href="/fonts/Inter-Regular.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/Fraunces-SemiBold.woff2" crossorigin />
```

**Context:** `BaseLayout.astro` `<head>` structure (lines 20-26):
```astro
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- TODO: Add Fraunces 600 preload link once woff2 file is committed to public/fonts/ -->
  <SEO {title} {description} {ogImage} {ogType} {noindex} />
  {emitOrgSchema && <LegalServiceSchema />}
  {emitWebSiteSchema && <WebSiteSchema />}
</head>
```

Preload links must come before `<SEO>` in `<head>` order to maximize render-blocking benefit.

---

### `public/fonts/` woff2 files (static asset — NEW)
### `public/og-default.jpg` (static asset — NEW)

**No code analog.** These are binary assets; no code pattern applies.

**Font acquisition approach** (PERF-02 gap from RESEARCH.md):
- Download from: Fontsource (`npm install @fontsource/inter @fontsource/fraunces`) or google-webfonts-helper
- Files needed: `Inter-Regular.woff2`, `Inter-SemiBold.woff2`, `Fraunces-SemiBold.woff2`
- Size constraint: Each must be ≤200 KB (Inter ~65 KB each; Fraunces ~80 KB — all well within limit)
- Destination: `public/fonts/`

**OG image spec** (SEO-03):
- Dimensions: 1200×630 px
- Format: JPEG (jpg)
- Size: ≤200 KB committed source (D11)
- Content: Firm name/tagline — simple branded design
- Destination: `public/og-default.jpg`

---

## Shared Patterns

### FIRM Constants (Single Source of Truth — D15)
**Source:** `src/lib/constants.ts` (all 89 lines)
**Apply to:** Every new file that references firm name, email, disclaimer text, jurisdiction info

Key exports and their uses in Phase 4:
```typescript
// Copy these import lines into every new file that needs firm data:
import { FIRM } from '../lib/constants';      // pages/layouts
import { FIRM } from '../../lib/constants';   // components (two levels deep)
import { FIRM } from '../../lib/constants';   // src/actions/index.ts

// Values used in Phase 4:
FIRM.email                    // contact@scopalfirm.com — email action To: address
FIRM.legalName                // "Scopal Firm, LLC" — legal pages, RSS feed title
FIRM.responsibleAttorney      // "Scott A. Palmer" — legal pages
FIRM.url                      // "https://scopalfirm.com" — ArticleSchema URLs
FIRM.noAttorneyClientDisclaimer  // contact form disclaimer block (FORM-02), thank-you page
FIRM.attorneyAdvertising      // legal pages disclaimer section
FIRM.jurisdictionDisclaimer   // legal pages disclaimer section
```

### DisclaimerCallout Pattern (Layouts auto-inject — D7)
**Source:** `src/components/legal/DisclaimerCallout.astro` (lines 1-10)
**Apply to:** `BlogPostLayout.astro` — import and render above `<slot />`, matching `PracticeAreaLayout.astro` line 28

```astro
<!-- Copy from PracticeAreaLayout.astro lines 27-29: -->
<article class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
  <DisclaimerCallout />
  <div class="prose prose-lg max-w-prose mx-auto mt-8">
```

### Schema Component Emit Pattern (SEO-04 anti-pattern enforcement)
**Source:** `src/components/seo/ServiceSchema.astro` line 24 / `src/components/seo/FAQSchema.astro` line 16
**Apply to:** `ArticleSchema.astro`

Always emit JSON-LD via a schema component, never inline in page files:
```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Tailwind Link Class Pattern (accessibility)
**Source:** `src/components/layout/Header.astro` lines 52-54 / `src/components/layout/Footer.astro` lines 13-16
**Apply to:** All new `<a>` elements in pages and components

Standard link class set (choose one variant):
```astro
<!-- Nav link (no underline): -->
class="text-base text-ink hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500 transition-colors"

<!-- Footer/body link (with underline): -->
class="underline underline-offset-2 hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500"
```

### CTA Button Pattern
**Source:** `src/pages/pricing.astro` lines 68-72 / `src/components/layout/Header.astro` lines 55-59
**Apply to:** `contact.astro` submit button, `thank-you.astro` any CTAs, legal pages if they include a CTA

```astro
class="inline-block bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-base font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2"
```

### Content Collection Query Pattern (draft filter)
**Source:** `src/pages/practice-areas/[slug].astro` lines 2, 5-10 — extended per RESEARCH.md
**Apply to:** `blog/[...page].astro`, `blog/[slug].astro`, `rss.xml.js`

```typescript
// Always filter drafts in production paths (BLOG-03, Pitfall 6):
const posts = await getCollection('blog', ({ data }) => !data.draft);

// Use post.id — NOT post.slug (Astro 6 removes post.slug, Pitfall 4):
params: { slug: post.id }
```

### Page Section / Spacing Pattern
**Source:** `src/pages/pricing.astro` lines 34-49
**Apply to:** All new static pages (`thank-you.astro`, all `/legal/*` pages)

```astro
<section class="bg-surface py-16 md:py-24">
  <div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl">
    <div class="max-w-2xl">
      <!-- content -->
    </div>
  </div>
</section>
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/actions/index.ts` | service/API handler | request-response | No existing Astro Actions in the codebase — use RESEARCH.md Pattern 1 |
| `src/pages/rss.xml.js` | endpoint | batch | No existing static endpoints — use RESEARCH.md Pattern 6; `@astrojs/rss` already installed |
| `public/fonts/*.woff2` | static asset | file-I/O | Binary assets; obtain from Fontsource or google-webfonts-helper |
| `public/og-default.jpg` | static asset | file-I/O | Binary asset; create as 1200×630 JPEG ≤200 KB |

---

## Critical Anti-Patterns (from RESEARCH.md)

| Anti-Pattern | Consequence | Correct Approach |
|--------------|------------|-----------------|
| Missing `export const prerender = false` on `contact.astro` | Action never runs; 404 on form submit | First line of frontmatter, before all imports |
| Using `post.slug` in Astro 6 | Build error or wrong routes | Use `post.id` — Astro 6 removes `post.slug` |
| `display: none` on honeypot field | Bots skip it; spam gets through | Use `position: absolute; left: -9999px` |
| Free-form JSON-LD `<script>` in page files | Violates D8/SEO-04 | Always use schema components in `src/components/seo/` |
| Relative URL in `og:image` | Social crawlers reject it | `new URL(path, Astro.site).toString()` |
| Draft posts in RSS feed | BLOG-03 + Pitfall 6 violation | `getCollection('blog', ({ data }) => !data.draft)` in both blog routes and `rss.xml.js` |
| User-supplied From/Subject in email | CRLF injection vector | Hardcode `from:` and `subject:` in action handler |
| Unescaped user input in email HTML body | HTML injection in email client | `escapeHtml()` on ALL user-supplied fields — name, email, company, description — inside `sendEmail()` |

---

## Metadata

**Analog search scope:** `/Users/spalmer/Documents/Claude Code/Scopal Website/src/` (all files)
**Files scanned:** 40 source files read directly
**Pattern extraction date:** 2026-05-08
