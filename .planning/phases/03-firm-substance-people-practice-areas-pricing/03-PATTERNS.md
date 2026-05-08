# Phase 3: Firm Substance — People, Practice Areas, Pricing — Pattern Map

**Mapped:** 2026-05-07
**Files analyzed:** 13 new/modified files
**Analogs found:** 13 / 13 (all have at least a role-match or partial analog in the codebase)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/layouts/PracticeAreaLayout.astro` | layout | request-response | `src/layouts/MarketingLayout.astro` | role-match |
| `src/pages/practice-areas/[slug].astro` | page (dynamic route) | batch (SSG) | `src/pages/index.astro` | partial-match |
| `src/content/practice-areas/corporate-law.mdx` | content (MDX) | transform | `content.config.ts` practiceAreas schema | role-match |
| `src/content/practice-areas/fractional-general-counsel.mdx` | content (MDX) | transform | `content.config.ts` practiceAreas schema | role-match |
| `src/content/coaching/legal-executive-coaching.mdx` | content (MDX) | transform | `content.config.ts` blog schema | partial-match |
| `src/pages/coaching.astro` | page (static) | request-response | `src/pages/contact.astro` | role-match |
| `src/pages/attorneys/scott-palmer.astro` | page (static) | request-response | `src/pages/contact.astro` | role-match |
| `src/pages/team/rachel-palmer.astro` | page (static) | request-response | `src/pages/contact.astro` | role-match |
| `src/pages/pricing.astro` | page (static) | request-response | `src/pages/contact.astro` | role-match |
| `src/components/seo/FAQSchema.astro` | component (schema) | transform | `src/components/seo/LegalServiceSchema.astro` | exact |
| `src/components/seo/BreadcrumbSchema.astro` | component (schema) | transform | `src/components/seo/LegalServiceSchema.astro` | exact |
| `src/components/seo/PersonSchema.astro` | component (schema) | transform | `src/components/seo/LegalServiceSchema.astro` | exact |
| `src/components/seo/ServiceSchema.astro` | component (schema) | transform | `src/components/seo/LegalServiceSchema.astro` | exact |
| `src/components/legal/DisclaimerCallout.astro` | component (legal) | request-response | `src/components/legal/FooterDisclaimer.astro` | role-match |
| `src/components/layout/Header.astro` | component (layout, modified) | request-response | `src/components/layout/Header.astro` (self) | self |
| `content.config.ts` | config (modified) | transform | `content.config.ts` (self) | self |

---

## Pattern Assignments

### `src/layouts/PracticeAreaLayout.astro` (layout, request-response)

**Analog:** `src/layouts/MarketingLayout.astro` (lines 1–14) and `src/layouts/BaseLayout.astro` (lines 1–39)

**Imports pattern** — copy MarketingLayout's BaseLayout pass-through, then add injected components:
```astro
---
import MarketingLayout from './MarketingLayout.astro';
import CTASection from '../components/sections/CTASection.astro';
import DisclaimerCallout from '../components/legal/DisclaimerCallout.astro';
import FAQSchema from '../components/seo/FAQSchema.astro';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema.astro';
import ServiceSchema from '../components/seo/ServiceSchema.astro';
```

**Props interface pattern** — copy from `MarketingLayout.astro` lines 3–11 (every component with props declares `interface Props {}`):
```astro
interface Props {
  title: string;
  description: string;
  faqs: Array<{ q: string; a: string }>;
  slug: string;
  serviceDescription?: string;
}
const { title, description, faqs, slug, serviceDescription } = Astro.props;
```

**Layout wrapping pattern** — `MarketingLayout.astro` line 13 shows the thin pass-through:
```astro
<MarketingLayout {title} {description}>
  <!-- schema components go in <head> via slot, or at top of body before visible content -->
  <FAQSchema {faqs} />
  <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: title, url: `/practice-areas/${slug}` }]} />
  <ServiceSchema name={title} description={serviceDescription ?? description} />
  ...
  <slot />
  ...
  <CTASection />
</MarketingLayout>
```

**Container + spacing pattern** — copy from `src/pages/contact.astro` lines 9–10 and `src/components/sections/Hero.astro` line 6:
```astro
<div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
```

**Prose class for MDX body** — `@tailwindcss/typography` is already installed; use:
```astro
<div class="prose prose-lg max-w-prose mx-auto mt-8">
  <slot />
</div>
```

**FAQ block rendering pattern** — copy the card grid from `src/components/sections/Plan.astro` lines 28–50 but as a `<dl>`:
```astro
{faqs.length > 0 && (
  <section aria-labelledby="faq-heading" class="mt-16 max-w-prose mx-auto">
    <h2 id="faq-heading" class="font-display font-semibold text-2xl md:text-[28px] text-ink leading-[1.25]">
      Frequently Asked Questions
    </h2>
    <dl class="mt-8 space-y-8">
      {faqs.map(({ q, a }) => (
        <div>
          <dt class="font-semibold text-ink">{q}</dt>
          <dd class="mt-2 text-base leading-relaxed text-ink-muted">{a}</dd>
        </div>
      ))}
    </dl>
  </section>
)}
```

---

### `src/pages/practice-areas/[slug].astro` (page, dynamic route / SSG batch)

**Analog:** `src/pages/index.astro` for the MarketingLayout wrapping pattern; RESEARCH.md Pattern 1 for the `getStaticPaths` shape.

**Imports pattern** (copy index.astro's MarketingLayout import, swap for PracticeAreaLayout):
```astro
---
import { getCollection, render } from 'astro:content';
import PracticeAreaLayout from '../../layouts/PracticeAreaLayout.astro';
```

**getStaticPaths pattern** — Astro 6 uses `entry.id`, not the deprecated `entry.slug`:
```astro
export async function getStaticPaths() {
  const entries = await getCollection('practice-areas');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
```

**Layout invocation** — pass all required `PracticeAreaLayout` props from frontmatter:
```astro
---
<PracticeAreaLayout
  title={entry.data.title}
  description={entry.data.description}
  faqs={entry.data.faqs}
  slug={entry.id}
>
  <Content />
</PracticeAreaLayout>
```

---

### `src/content/practice-areas/corporate-law.mdx` and `fractional-general-counsel.mdx` (content, MDX)

**Analog:** `content.config.ts` lines 25–35 — practiceAreas Zod schema defines required frontmatter fields.

**Required frontmatter fields** (Zod schema; any missing non-optional field breaks the build):
```mdx
---
title: "Client-focused H1 string here (not the service name)"
shortTitle: "Corporate Law"
description: "160-char max meta description"
order: 1
icon: "briefcase"
faqs:
  - q: "Question one?"
    a: "Answer one."
  - q: "Question two?"
    a: "Answer two."
---

MDX body (800–1,500+ words) begins here...
```

**Critical:** `icon` is optional (Zod `.optional()`); all other fields are required. `faqs` defaults to `[]` but must be present or omitted (never `null`).

---

### `src/content/coaching/legal-executive-coaching.mdx` (content, MDX)

**Analog:** `content.config.ts` lines 11–23 — blog schema shows the defineCollection + Zod pattern to replicate for the new `coaching` collection.

**New collection definition to add to `content.config.ts`** (model exactly after the blog collection block):
```ts
const coaching = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/coaching' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    audience: z.string(),
  }),
});
// Add coaching to the collections export:
export const collections = { blog, practiceAreas, team, coaching };
```

**MDX frontmatter for the coaching file:**
```mdx
---
title: "Coaching page H1 here"
description: "160-char max meta description"
audience: "In-house attorneys and GCs"
---
```

---

### `src/pages/coaching.astro` (page, static)

**Analog:** `src/pages/contact.astro` (lines 1–26) — exact same pattern: MarketingLayout wrapper, constants import, `<h1>` with display font, `<p>` with body text.

**Imports pattern** (copy from contact.astro lines 2–4):
```astro
---
import MarketingLayout from '../layouts/MarketingLayout.astro';
import CTASection from '../components/sections/CTASection.astro';
import { getCollection, render } from 'astro:content';
import { FIRM } from '../lib/constants';
---
```

**Layout invocation** (copy contact.astro lines 6–8 then swap content):
```astro
<MarketingLayout
  title="Legal Executive Coaching | Scopal Firm"
  description="..."
>
```

**Content container pattern** (copy contact.astro line 9):
```astro
<div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
```

**H1 pattern** (copy contact.astro lines 10–12 — font-display, font-semibold, text-4xl/5xl):
```astro
<h1 class="font-display font-semibold text-4xl md:text-5xl text-ink leading-[1.15] mb-8">
  Heading here
</h1>
```

**Prose/MDX body pattern** — import and render the coaching MDX file:
```astro
const entries = await getCollection('coaching');
const entry = entries[0];
const { Content } = await render(entry);
// in template:
<div class="prose prose-lg max-w-prose">
  <Content />
</div>
```

---

### `src/pages/attorneys/scott-palmer.astro` (page, static)

**Analog:** `src/pages/contact.astro` for the MarketingLayout + constants import pattern.

**Imports pattern** — extends contact.astro's pattern with schema, Image, and constants:
```astro
---
import MarketingLayout from '../../layouts/MarketingLayout.astro';
import PersonSchema from '../../components/seo/PersonSchema.astro';
import CTASection from '../../components/sections/CTASection.astro';
import { Image } from 'astro:assets';
import { ATTORNEYS, formatBarStatus } from '../../lib/constants';
import scottHeadshot from '../../assets/team/scott-palmer.jpg';
const scott = ATTORNEYS['scott-palmer'];
---
```

**Layout invocation** (contact.astro lines 6–9 pattern, with ogType="profile"):
```astro
<MarketingLayout
  title="Scott A. Palmer — Principal Attorney | Scopal Firm"
  description="..."
  ogType="profile"
>
  <PersonSchema />
```

**Bar admissions — NEVER hardcode** — use `formatBarStatus()` from constants.ts line 84:
```astro
<p class="text-sm text-ink-muted mt-4">
  Bar Admissions: {formatBarStatus()}
</p>
```

**Headshot pattern** — `astro:assets` `<Image />` (never raw `<img>`):
```astro
<Image
  src={scottHeadshot}
  alt="Scott A. Palmer, Principal Attorney at Scopal Firm"
  width={400}
  height={400}
  class="rounded-xl object-cover"
  loading="eager"
/>
```

---

### `src/pages/team/rachel-palmer.astro` (page, static)

**Analog:** `src/pages/contact.astro` — identical layout pattern; key difference is NO schema components and NO attorney-specific content.

**Imports pattern** (simpler than Scott's — no PersonSchema, no formatBarStatus):
```astro
---
import MarketingLayout from '../../layouts/MarketingLayout.astro';
import { Image } from 'astro:assets';
import rachelHeadshot from '../../assets/team/rachel-palmer.jpg';
---
```

**Critical UPL compliance:** Rachel's role title must appear visually near her name (e.g., "Head of Operations — not an attorney") and no schema of type `Person` with `worksFor` a LegalService should be emitted for this page. Her page must not sit under `/attorneys/`.

---

### `src/pages/pricing.astro` (page, static)

**Analog:** `src/pages/contact.astro` for layout pattern; `src/components/sections/Plan.astro` lines 28–50 for the feature-card grid pattern.

**Imports pattern:**
```astro
---
import MarketingLayout from '../layouts/MarketingLayout.astro';
import CTASection from '../components/sections/CTASection.astro';
import { FIRM } from '../lib/constants';
---
```

**Feature card grid** — copy Plan.astro's grid (lines 28–49) and adapt from 3 steps to 5 service-area cards:
```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {serviceAreas.map((area) => (
    <div class="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
      <!-- icon placeholder -->
      <h3 class="font-display font-semibold text-2xl text-ink leading-[1.25]">{area.name}</h3>
      <p class="text-base leading-relaxed text-ink">{area.description}</p>
    </div>
  ))}
</div>
```

**CTA pattern** — copy Plan.astro line 53–61 for mid-page CTA; use CTASection at bottom:
```astro
<a
  href="/contact"
  class="inline-block bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-base font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2"
>
  Book a Fit Call
</a>
```

---

### `src/components/seo/FAQSchema.astro` (component, schema)

**Analog:** `src/components/seo/LegalServiceSchema.astro` — exact pattern: no HTML output, only a `<script type="application/ld+json">` tag using `set:html={JSON.stringify(schema)}`.

**Complete pattern** (copy LegalServiceSchema.astro lines 1–27 structure verbatim):
```astro
---
interface Props {
  faqs: Array<{ q: string; a: string }>;
}
const { faqs } = Astro.props;
const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### `src/components/seo/BreadcrumbSchema.astro` (component, schema)

**Analog:** `src/components/seo/LegalServiceSchema.astro` — same `set:html` pattern; adds `FIRM.url` import from constants.

**Complete pattern:**
```astro
---
import { FIRM } from '../../lib/constants';
interface Props {
  items: Array<{ name: string; url: string }>;
}
const { items } = Astro.props;
const schema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${FIRM.url}${item.url}`,
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### `src/components/seo/PersonSchema.astro` (component, schema)

**Analog:** `src/components/seo/LegalServiceSchema.astro` lines 1–27 — same imports-from-constants, same `set:html` output pattern. `ATTORNEYS['scott-palmer']` and `formatBarStatus()` are already exported from `constants.ts`.

**Complete pattern** (note: uses `Person` type, NOT the deprecated `Attorney` type per D-23):
```astro
---
import { FIRM, ATTORNEYS, formatBarStatus } from '../../lib/constants';
const scott = ATTORNEYS['scott-palmer'];
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: scott.name,
  jobTitle: scott.role,
  url: `${FIRM.url}/attorneys/scott-palmer`,
  worksFor: {
    '@type': 'LegalService',
    name: FIRM.legalName,
    url: FIRM.url,
  },
  alumniOf: [
    { '@type': 'EducationalOrganization', name: 'University of Baltimore School of Law' },
    { '@type': 'EducationalOrganization', name: 'University of Maryland, College Park' },
  ],
  hasCredential: scott.barAdmissions
    .filter((b) => b.status === 'active')
    .map((b) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Bar Admission',
      recognizedBy: { '@type': 'GovernmentOrganization', name: `${b.state} State Bar` },
    })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### `src/components/seo/ServiceSchema.astro` (component, schema)

**Analog:** `src/components/seo/LegalServiceSchema.astro` — same pattern. Emits `Service` type (schema.org/Service) for individual practice area pages.

**Complete pattern:**
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

---

### `src/components/legal/DisclaimerCallout.astro` (component, legal)

**Analog:** `src/components/legal/FooterDisclaimer.astro` lines 1–8 — imports `FIRM` from constants, renders disclaimer text. The callout version is a styled inline box instead of small-print footer text.

**Imports pattern** (copy FooterDisclaimer.astro lines 1–3):
```astro
---
import { FIRM } from '../../lib/constants';
---
```

**Rendering pattern** — uses `FIRM.noAttorneyClientDisclaimer` (same constant as FooterDisclaimer line 7):
```astro
<div
  class="border-l-4 border-brand-blue-500 bg-surface-muted px-6 py-4 text-sm text-ink-muted leading-relaxed rounded-r-lg"
  role="note"
  aria-label="Legal disclaimer"
>
  <strong class="text-ink">Note:</strong> {FIRM.noAttorneyClientDisclaimer}
</div>
```

---

### `src/components/layout/Header.astro` (component, modified)

**Analog:** `src/components/layout/Header.astro` (self) — the modification extends the existing file. Read the full current file before editing.

**Existing vanilla JS script pattern** to extend (lines 68–93) — the dropdown script must mirror this exact structure:
```js
// Copy this null-check guard pattern from lines 69–72:
const hamburger = document.getElementById('hamburger') as HTMLButtonElement | null;
const mobileNav = document.getElementById('mobile-nav') as HTMLElement | null;
if (hamburger && mobileNav) { ... }

// Escape-key close pattern from lines 84–91 — replicate for dropdown:
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.add('hidden');
    hamburger.focus();
  }
});
```

**Desktop nav link style** — copy from lines 18–19 for all new nav items:
```astro
class="text-base text-ink hover:text-brand-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500 transition-colors"
```

**CTA button style** — copy from lines 21–26 (unchanged for "Book a Fit Call"):
```astro
class="bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-base font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2"
```

**Dropdown trigger pattern** — replace the static `<a href="/practice-areas">` (line 18) with:
```astro
<div class="relative">
  <button
    id="practice-btn"
    type="button"
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="practice-dropdown"
    class="text-base text-ink hover:text-brand-blue-500 flex items-center gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500"
  >
    Practice Areas
    <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
      <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>
  </button>
  <ul id="practice-dropdown" hidden
      class="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-lg shadow-md py-2 z-50">
    <li><a href="/practice-areas/corporate-law" class="block px-4 py-2 text-base text-ink hover:text-brand-blue-500 hover:bg-surface-muted transition-colors">Corporate Law</a></li>
    <li><a href="/practice-areas/fractional-general-counsel" class="block px-4 py-2 text-base text-ink hover:text-brand-blue-500 hover:bg-surface-muted transition-colors">Fractional GC</a></li>
  </ul>
</div>
```

**New nav order** (D-06) — replace desktop nav links (lines 17–27) in this order: Practice Areas dropdown | Coaching | Scott Palmer | Pricing | Book a Fit Call.

**Mobile nav additions** — add below existing Practice Areas link (line 55) in the mobile panel:
```astro
<a href="/coaching" class="text-base text-ink hover:text-brand-blue-500 py-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-500">Coaching</a>
```
Replace static Practice Areas link with a disclosure group listing Corporate Law and Fractional GC.

**Dropdown JS to add inside existing `<script>` block** (use same guard pattern as lines 69–71):
```js
const practiceBtn = document.getElementById('practice-btn') as HTMLButtonElement | null;
const practiceDropdown = document.getElementById('practice-dropdown') as HTMLElement | null;

if (practiceBtn && practiceDropdown) {
  practiceBtn.addEventListener('click', () => {
    const isOpen = practiceBtn.getAttribute('aria-expanded') === 'true';
    practiceBtn.setAttribute('aria-expanded', String(!isOpen));
    practiceDropdown.hidden = isOpen;
  });
  document.addEventListener('click', (e) => {
    if (!practiceBtn.contains(e.target as Node) && !practiceDropdown.contains(e.target as Node)) {
      practiceBtn.setAttribute('aria-expanded', 'false');
      practiceDropdown.hidden = true;
    }
  });
  // Escape key — extend existing keydown listener rather than adding a new one
}
```

---

### `content.config.ts` (config, modified)

**Analog:** `content.config.ts` itself (lines 11–23) — the blog collection block is the pattern to copy for the new `coaching` collection.

**Pattern to copy** (lines 11–23, blog collection):
```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ ... }),
});
```

**New coaching collection to add** (insert before the `export` line 55):
```ts
const coaching = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/coaching' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    audience: z.string(),
  }),
});
```

**Export line to update** (line 55 becomes):
```ts
export const collections = { blog, practiceAreas, team, coaching };
```

---

## Shared Patterns

### JSON-LD Emission
**Source:** `src/components/seo/LegalServiceSchema.astro` line 27 and `src/components/seo/WebSiteSchema.astro` line 18
**Apply to:** `FAQSchema.astro`, `BreadcrumbSchema.astro`, `PersonSchema.astro`, `ServiceSchema.astro`
```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```
This is the ONLY permitted pattern for JSON-LD. Never write inline `<script>` with JSON directly in page files.

### Constants Import (NAP Single-Source Rule)
**Source:** `src/components/seo/LegalServiceSchema.astro` lines 2–3, `src/components/legal/FooterDisclaimer.astro` lines 2
**Apply to:** All new components and pages that reference any firm data
```astro
import { FIRM, ATTORNEYS, formatBarStatus } from '../../lib/constants';
// or for pages:
import { FIRM, ATTORNEYS, formatBarStatus } from '../lib/constants';
```
Never hardcode `FIRM.legalName`, `FIRM.url`, `FIRM.email`, or bar admission strings. The `formatBarStatus()` function (constants.ts line 84) produces the exact D-22 string.

### Props Interface Declaration
**Source:** `src/layouts/MarketingLayout.astro` lines 3–11, `src/layouts/BaseLayout.astro` lines 9–17
**Apply to:** Every new component that accepts props
```astro
interface Props {
  propName: type;
  optionalProp?: type;
}
const { propName, optionalProp } = Astro.props;
```

### Container + Spacing
**Source:** `src/pages/contact.astro` line 9, `src/components/sections/Hero.astro` line 6
**Apply to:** All new page content areas
```astro
<div class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
```
Max-width is always `max-w-[1200px]`. Horizontal padding uses `px-md md:px-lg lg:px-xl` (design token scale, not raw pixel values).

### Heading Typography
**Source:** `src/pages/contact.astro` lines 10–12, `src/components/sections/Hero.astro` lines 11–13
**Apply to:** H1 on all new pages
```astro
<!-- H1 -->
<h1 class="font-display font-semibold text-4xl md:text-5xl text-ink leading-[1.15]">
<!-- H2 sections -->
<h2 class="font-display font-semibold text-2xl md:text-[28px] text-ink leading-[1.25]">
```

### CTA Link Style
**Source:** `src/components/sections/CTASection.astro` lines 15–18, `src/components/sections/Plan.astro` lines 53–60, `src/components/sections/Hero.astro` lines 17–20
**Apply to:** All inline CTA links on new pages (pricing mid-page, bio page, coaching page)
```astro
<a
  href="/contact"
  class="inline-block bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-base font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2"
>
  Book a Fit Call
</a>
```
CTA text: "Book a Fit Call" (primary) or "Schedule a Consultation" (secondary). Never "Buy Now", "Sign Up", or "Contact Us".

### Vanilla JS Guard Pattern
**Source:** `src/components/layout/Header.astro` lines 68–71
**Apply to:** All new `<script>` blocks in components
```js
const el = document.getElementById('element-id') as HTMLButtonElement | null;
if (el) {
  // all event listener code inside this guard
}
```
No bare `document.getElementById()` calls without null guard. TypeScript `as Type | null` assertion required.

### Color Token Rules
**Source:** `src/components/sections/CTASection.astro` (bg-ink background), Hero.astro (bg-surface), Plan.astro (border-brand-orange-500 accent only)
**Apply to:** All new pages and components
- `brand-blue-500` / `brand-blue-600` — CTAs, links, focus rings, border accents
- `brand-orange-500` — decorative accents ONLY (e.g., step number circle border in Plan.astro line 33). Never use for CTAs, links, or body text.
- `bg-surface` — primary page background
- `bg-surface-muted` — card/aside backgrounds (e.g., DisclaimerCallout)
- `text-ink` — primary body text
- `text-ink-muted` — secondary/supporting text

---

## No Analog Found

All files in Phase 3 have at least a partial analog in the codebase. No files require falling back to RESEARCH.md patterns exclusively — RESEARCH.md patterns for `PracticeAreaLayout` and schema components are consistent with the established codebase patterns confirmed above.

| File | Notes |
|------|-------|
| `src/pages/practice-areas/[slug].astro` | No dynamic route exists yet, but `getStaticPaths` + `getCollection` is documented in RESEARCH.md Pattern 1 and is consistent with Astro 6 conventions already used in the project |
| `src/components/legal/DisclaimerCallout.astro` | `FooterDisclaimer.astro` is the closest analog; the callout version is a styled box rather than footer small-print, but imports and constant usage are identical |

---

## Metadata

**Analog search scope:** `src/layouts/`, `src/pages/`, `src/components/`, `src/lib/`, `content.config.ts`
**Files scanned:** 16 source files read
**Pattern extraction date:** 2026-05-07
