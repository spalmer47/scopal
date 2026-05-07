# Phase 1: Foundation + Live Skeleton — Pattern Map

**Mapped:** 2026-05-07
**Files analyzed:** 20 new files (greenfield — no prior source files exist)
**Analogs found:** 0 / 20 (codebase is a single placeholder `index.html`)

> **Greenfield note:** The repository contains only `index.html` (9 lines, "Hello World"
> placeholder). There are no existing Astro components, layouts, TypeScript utilities, CI
> workflows, or config files to analyze. All patterns below are sourced from Astro 6
> framework documentation and the prescriptive code examples in `01-RESEARCH.md`. The planner
> should treat RESEARCH.md §Code Examples as the canonical copy-from source for every file.

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `astro.config.mjs` | config | build-transform | RESEARCH.md Pattern 1 | framework-doc |
| `content.config.ts` | config | build-transform | RESEARCH.md Example C | framework-doc |
| `src/lib/constants.ts` | utility | transform (data source) | RESEARCH.md Example B | framework-doc |
| `src/layouts/BaseLayout.astro` | layout | request-response (SSG) | RESEARCH.md Pattern 3 | framework-doc |
| `src/layouts/MarketingLayout.astro` | layout | request-response (SSG) | RESEARCH.md Pattern 3 | framework-doc |
| `src/components/layout/Header.astro` | component | request-response (SSG) | Astro component pattern | framework-doc |
| `src/components/layout/Footer.astro` | component | request-response (SSG) | Astro component pattern | framework-doc |
| `src/components/legal/FooterDisclaimer.astro` | component | request-response (SSG) | Astro component pattern | framework-doc |
| `src/components/seo/SEO.astro` | component | request-response (SSG) | Astro component pattern | framework-doc |
| `src/components/seo/LegalServiceSchema.astro` | component | request-response (SSG) | RESEARCH.md Pattern 3 + constants | framework-doc |
| `src/pages/index.astro` | page/route | request-response (SSG) | RESEARCH.md Pattern 3 | framework-doc |
| `src/styles/global.css` | config | build-transform | RESEARCH.md Pattern 2 | framework-doc |
| `vercel.json` | config | request-response (edge) | RESEARCH.md Example A | framework-doc |
| `.github/workflows/ci.yml` | config | CI/batch | RESEARCH.md Example D | framework-doc |
| `.lighthouserc.json` | config | CI/batch | RESEARCH.md Example F | framework-doc |
| `scripts/banned-words.mjs` | utility | batch/transform | RESEARCH.md Example E | framework-doc |
| `.env.example` | config | — | RESEARCH.md Example H | framework-doc |
| `.gitignore` | config | — | RESEARCH.md Example G | framework-doc |
| `public/robots.txt` | config | request-response (static) | standard convention | framework-doc |
| `public/favicon.svg` | asset | — | Astro scaffold default | framework-doc |

---

## Pattern Assignments

### `astro.config.mjs` (config, build-transform)

**Source:** RESEARCH.md §Pattern 1 (lines verbatim)

**Full pattern** (copy exactly from RESEARCH.md Pattern 1):
```js
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://scopalfirm.com',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
});
```

**Critical rules:**
- `output: 'static'` — NOT `'server'`. Static pages hit the CDN; only Phase 4's contact endpoint gets `prerender = false`.
- `site` must be set before first deploy or sitemap/canonicals break.
- Do NOT add `tailwind.config.js` or `postcss.config.cjs`. Tailwind v4 configures via CSS `@theme`.
- `@astrojs/tailwind` is deprecated — `@tailwindcss/vite` is the correct plugin.

---

### `src/styles/global.css` (config, build-transform)

**Source:** RESEARCH.md §Pattern 2

**Full pattern:**
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-brand-blue-50:  oklch(0.97 0.02 240);
  --color-brand-blue-500: oklch(0.50 0.16 240);
  --color-brand-blue-900: oklch(0.25 0.07 240);
  --color-brand-orange-500: oklch(0.70 0.18 50);

  --font-display: "Playfair Display", "Georgia", serif;
  --font-body: "Inter", system-ui, sans-serif;
}

@layer base {
  html { font-family: var(--font-body); }
  h1, h2, h3 { font-family: var(--font-display); }
}
```

**Critical rules:**
- The single `@import "tailwindcss"` line replaces Tailwind v3's three-directive block.
- All brand tokens live here under `@theme {}` — nowhere else.
- No `tailwind.config.js`, no `postcss.config.cjs`.

---

### `src/lib/constants.ts` (utility, data-source)

**Source:** RESEARCH.md §Example B

**Full pattern** (copy verbatim; fill nulls from FIRM_BRIEF.md when known):
```ts
export const FIRM = {
  legalName: 'Scopal Firm, LLC',
  shortName: 'Scopal Firm',
  url: 'https://scopalfirm.com',
  email: 'scott@scopalfirm.com',
  phone: null as string | null,
  address: {
    streetAddress: null as string | null,
    addressLocality: 'Annandale',
    addressRegion: 'NJ',
    postalCode: null as string | null,
    addressCountry: 'US',
  },
  areaServed: { type: 'Country' as const, name: 'United States' },
  responsibleAttorney: 'Scott A. Palmer',
  attorneyAdvertising: 'Attorney Advertising. Prior results do not guarantee a similar outcome.',
  jurisdictionDisclaimer:
    'Scopal Firm, LLC attorneys are licensed to practice law in Maryland; New Jersey admission pending. ' +
    'This website is not intended to solicit clients in jurisdictions where the firm\'s attorneys are not licensed.',
  noAttorneyClientDisclaimer:
    'The information on this website is for general informational purposes only and does not constitute legal advice. ' +
    'Reading this website or contacting us does not create an attorney-client relationship.',
} as const;

export type BarAdmissionStatus = 'active' | 'pending';
export interface BarAdmission {
  state: string;
  year: number;
  status: BarAdmissionStatus;
}

export const ATTORNEYS = { ... } as const;   // see RESEARCH.md Example B
export const SOCIAL = { ... } as const;       // see RESEARCH.md Example B
export const BANNED_TERMS = [ ... ] as const; // see RESEARCH.md Example B
```

**Critical rule:** NAP in Footer, JSON-LD, and any future page MUST read from this file.
No raw strings like "Annandale" or "Maryland" outside `constants.ts` + its consumers.

---

### `content.config.ts` (config, build-transform)

**Source:** RESEARCH.md §Example C

**Full pattern** (Astro 6 root-level path, NOT `src/content/config.ts`):
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.literal('scott-palmer'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const practiceAreas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/practice-areas' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string().max(160),
    order: z.number(),
    icon: z.string().optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    isAttorney: z.boolean(),
    barAdmissions: z.array(z.object({
      state: z.string(),
      year: z.number(),
      status: z.enum(['active', 'pending']),
    })).default([]),
    education: z.array(z.string()).default([]),
    headshot: z.string(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
  }),
});

export const collections = { blog, practiceAreas, team };
```

**Critical rule:** Place file at repo root (`/content.config.ts`), not under `src/`.
Collections ship empty in Phase 1 — only `.gitkeep` files inside each folder.

---

### `src/layouts/BaseLayout.astro` (layout, request-response SSG)

**Source:** RESEARCH.md §Pattern 3

**Full pattern:**
```astro
---
import '../styles/global.css';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import SEO from '../components/seo/SEO.astro';
import LegalServiceSchema from '../components/seo/LegalServiceSchema.astro';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  emitOrgSchema?: boolean;
}
const { title, description, ogImage, ogType = 'website', noindex = false, emitOrgSchema = false } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO {title} {description} {ogImage} {ogType} {noindex} />
    {emitOrgSchema && <LegalServiceSchema />}
  </head>
  <body class="min-h-screen flex flex-col bg-white text-slate-900">
    <Header />
    <main class="flex-1"><slot /></main>
    <Footer />
  </body>
</html>
```

**Critical rule:** `<Footer />` is rendered unconditionally here. No page can accidentally
omit the required legal disclaimers because they live in Footer, and Footer lives in BaseLayout.

---

### `src/layouts/MarketingLayout.astro` (layout, request-response SSG)

**Source:** RESEARCH.md §Pattern 3

**Full pattern** (thin wrapper — all props forwarded to BaseLayout):
```astro
---
import BaseLayout from './BaseLayout.astro';
const { ...seo } = Astro.props;
---
<BaseLayout {...seo}><slot /></BaseLayout>
```

**Usage:** `src/pages/index.astro` imports `MarketingLayout` and passes `emitOrgSchema={true}`.

---

### `src/components/layout/Header.astro` (component, request-response SSG)

**Source:** Astro component pattern (no codebase analog; construct fresh)

**Pattern to follow:**
- Frontmatter imports `FIRM` from `../../lib/constants`
- Renders firm name/logo as `<a href="/">` linking to home
- Minimal nav placeholder — no real nav links in Phase 1 (content arrives in Phases 2–3)
- No client-side JS; pure static HTML
- Tailwind classes for layout (e.g., `flex items-center justify-between px-6 py-4`)

**Structural skeleton:**
```astro
---
import { FIRM } from '../../lib/constants';
---
<header class="...">
  <a href="/">{FIRM.shortName}</a>
  <nav aria-label="Main navigation">
    <!-- Phase 2 will populate links -->
  </nav>
</header>
```

---

### `src/components/layout/Footer.astro` (component, request-response SSG)

**Source:** Astro component pattern + RESEARCH.md constants

**Pattern to follow:**
- Import `FIRM` from `../../lib/constants`
- Import `FooterDisclaimer` from `../legal/FooterDisclaimer.astro`
- Render NAP block: firm name, locality/region, email
- Render `<FooterDisclaimer />` — the three disclaimer paragraphs
- Copyright line with `new Date().getFullYear()` or a static year

**Structural skeleton:**
```astro
---
import { FIRM } from '../../lib/constants';
import FooterDisclaimer from '../legal/FooterDisclaimer.astro';
---
<footer class="...">
  <div>
    <p>{FIRM.legalName}</p>
    <p>{FIRM.address.addressLocality}, {FIRM.address.addressRegion}</p>
    <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
  </div>
  <FooterDisclaimer />
  <p>&copy; {new Date().getFullYear()} {FIRM.legalName}. All rights reserved.</p>
</footer>
```

---

### `src/components/legal/FooterDisclaimer.astro` (component, request-response SSG)

**Source:** `FIRM.attorneyAdvertising`, `FIRM.jurisdictionDisclaimer`, `FIRM.noAttorneyClientDisclaimer`
from `src/lib/constants.ts` (RESEARCH.md Example B)

**Pattern to follow:**
- Import `FIRM` from `../../../lib/constants`
- Render all three disclaimer strings as `<p>` elements with small/muted Tailwind classes
- No logic — pure data-to-markup

**Structural skeleton:**
```astro
---
import { FIRM } from '../../../lib/constants';
---
<div class="text-xs text-slate-500 space-y-1">
  <p>{FIRM.attorneyAdvertising}</p>
  <p>{FIRM.jurisdictionDisclaimer}</p>
  <p>{FIRM.noAttorneyClientDisclaimer}</p>
</div>
```

---

### `src/components/seo/SEO.astro` (component, request-response SSG)

**Source:** Astro head management pattern (no codebase analog; construct fresh)

**Pattern to follow:**
- Props: `title`, `description`, `ogImage?`, `ogType?`, `noindex?`
- Renders into `<head>` (Astro components in `<head>` work natively)
- Include: `<title>`, `<meta name="description">`, canonical `<link>`, OG tags, `robots` meta
- `canonical` derives from `Astro.site` + `Astro.url.pathname`
- If `ogImage` is absent, omit `og:image` tag entirely (graceful degradation)
- Phase 1 ships a minimal version; full OG image handling is Phase 4

**Structural skeleton:**
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
<link rel="canonical" href={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonicalURL} />
{ogImage && <meta property="og:image" content={ogImage} />}
{noindex && <meta name="robots" content="noindex,nofollow" />}
```

---

### `src/components/seo/LegalServiceSchema.astro` (component, request-response SSG)

**Source:** RESEARCH.md Pattern 3 (`emitOrgSchema` usage) + constants

**Pattern to follow:**
- Import `FIRM` and `ATTORNEYS` from `../../lib/constants`
- Emit a `<script type="application/ld+json">` block (allowed by CSP — `type` is non-executable)
- Schema.org type: `LegalService` with nested `Person` for the attorney
- All NAP fields sourced from `FIRM` constant — never hardcoded strings

**Structural skeleton:**
```astro
---
import { FIRM, ATTORNEYS } from '../../lib/constants';
const scott = ATTORNEYS['scott-palmer'];
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: FIRM.legalName,
  url: FIRM.url,
  email: FIRM.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: FIRM.address.addressLocality,
    addressRegion: FIRM.address.addressRegion,
    addressCountry: FIRM.address.addressCountry,
  },
  areaServed: FIRM.areaServed,
  employee: {
    '@type': 'Person',
    name: scott.name,
    jobTitle: scott.role,
  },
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### `src/pages/index.astro` (page/route, request-response SSG)

**Source:** RESEARCH.md §Walking Skeleton step 9 + Pattern 3

**Pattern to follow:**
- Import and use `MarketingLayout` with `emitOrgSchema={true}`
- Minimal placeholder: one `<h1>`, one paragraph, one `mailto:` link
- WCAG compliance: `<h1>` present, `lang="en"` on `<html>` (inherited from BaseLayout), adequate contrast
- No real copy — Phase 2 replaces this entire file

**Structural skeleton:**
```astro
---
import MarketingLayout from '../layouts/MarketingLayout.astro';
import { FIRM } from '../lib/constants';
---
<MarketingLayout
  title="Scopal Firm — Business Legal Support for SaaS Companies"
  description="Outside General Counsel for growing technology companies. New site coming soon."
  emitOrgSchema={true}
>
  <section class="max-w-2xl mx-auto px-6 py-24 text-center">
    <h1 class="text-4xl font-display font-bold text-brand-blue-900 mb-6">
      {FIRM.legalName}
    </h1>
    <p class="text-lg text-slate-700 mb-8">
      Business-focused legal support for SaaS companies. New site coming soon.
    </p>
    <a href={`mailto:${FIRM.email}`} class="...">Get in touch</a>
  </section>
</MarketingLayout>
```

---

### `vercel.json` (config, request-response edge)

**Source:** RESEARCH.md §Example A (copy verbatim)

**Full pattern:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Verify at deploy time:** Confirm Vercel Analytics still loads from `va.vercel-scripts.com`
and `vitals.vercel-insights.com` — these CSP origins are based on Vercel's published docs
(Assumption A1 in RESEARCH.md) and should be validated in the browser console after first deploy.

---

### `.github/workflows/ci.yml` (config, CI/batch)

**Source:** RESEARCH.md §Example D (copy verbatim)

**Full pattern:**
```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  build-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run banned-words
      - run: npm run build
      - run: npm run linkcheck
      - run: npm run a11y
      - uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./.lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true
      - name: gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note on `a11y` script:** The `astro preview & sleep 3 && axe ...` pattern works on macOS/Linux.
For reliable CI, the planner should consider `start-server-and-test` (`npm i -D start-server-and-test`)
to avoid race conditions on slower CI runners.

---

### `.lighthouserc.json` (config, CI/batch)

**Source:** RESEARCH.md §Example F (copy verbatim)

**Full pattern:**
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["http://localhost/index.html"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance":    ["error", { "minScore": 0.9 }],
        "categories:accessibility":  ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo":            ["error", { "minScore": 0.9 }],
        "largest-contentful-paint":  ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift":   ["error", { "maxNumericValue": 0.05 }]
      }
    }
  }
}
```

---

### `scripts/banned-words.mjs` (utility, batch)

**Source:** RESEARCH.md §Example E + `FIRM.BANNED_TERMS` from constants

**Pattern to follow:**
- ESM script (`.mjs`), runs via `node scripts/banned-words.mjs`
- Walk `src/**/*.{astro,md,mdx,ts}` using `fs.globSync` (Node 22 built-in)
- Test each file's content against every term in `BANNED_TERMS` from constants
- Print filename + line number on any match; exit 1 if any match found
- Two implementation options (planner chooses):
  - Run via `tsx` so it can import `BANNED_TERMS` from `src/lib/constants.ts` directly
  - Duplicate the banned list as a plain array in the script (simpler, no tsx dependency)

**Structural skeleton:**
```js
#!/usr/bin/env node
import { readFileSync, globSync } from 'node:fs';

// Option A: duplicate list here (no tsx required)
const BANNED_TERMS = [
  'specialist', 'specializing in', 'expert', 'experts',
  'the best', '#1', 'leading', 'top-rated', 'super lawyer',
];

const files = globSync('src/**/*.{astro,md,mdx,ts}');
let found = false;

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const term of BANNED_TERMS) {
      if (line.toLowerCase().includes(term.toLowerCase())) {
        console.error(`BANNED TERM "${term}" at ${file}:${i + 1}`);
        found = true;
      }
    }
  });
}

if (found) process.exit(1);
console.log('Banned-words check passed.');
```

---

### `.env.example` (config)

**Source:** RESEARCH.md §Example H (copy verbatim)

```bash
# .env.example — documents every env var; commit to git WITHOUT VALUES
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

---

### `.gitignore` (config)

**Source:** RESEARCH.md §Example G (copy verbatim)

```
dist/
.astro/
.vercel/
node_modules/
.env
.env.local
.env.*.local
.DS_Store
Thumbs.db
.vscode/
.idea/
```

---

### `public/robots.txt` (config, static)

**Source:** Standard web convention + RESEARCH.md §Walking Skeleton step 11

**Pattern:**
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://scopalfirm.com/sitemap-index.xml
```

**Note:** `/api/` is disallowed now so it's already correct when Phase 4 adds `src/pages/api/contact.ts`.

---

### `public/favicon.svg` (asset)

**Source:** Astro scaffold default (`npm create astro` emits one)

**Pattern:** Accept whatever the `--template minimal` scaffold generates. Replace with a real logo SVG in Phase 2 or 3. Keep under 200 KB (trivial for an SVG).

---

### Content placeholder folders

Three empty directories with `.gitkeep` files (not real files to author, just to stage):
- `src/content/blog/.gitkeep`
- `src/content/practice-areas/.gitkeep`
- `src/content/team/.gitkeep`

These allow the build to succeed with empty collections before any content is written.

---

## Shared Patterns

### NAP Single Source of Truth
**Source:** `src/lib/constants.ts` → `FIRM` export
**Apply to:** `Footer.astro`, `FooterDisclaimer.astro`, `LegalServiceSchema.astro`, `SEO.astro` (site URL)
**Rule:** Never hardcode firm name, address, phone, email, or disclaimer text in any component.
All consumer components import `FIRM` from `../../lib/constants` (or the appropriate relative path).

### Disclaimer Injection via Layout
**Source:** `BaseLayout.astro` → `<Footer />` always rendered
**Apply to:** Every `.astro` page (inherited automatically — no per-page action required)
**Rule:** Disclaimers live in `FooterDisclaimer.astro`, rendered inside `Footer.astro`,
rendered unconditionally in `BaseLayout.astro`. A page author cannot omit them.

### Tailwind v4 CSS-First Config
**Source:** `src/styles/global.css` → `@theme {}` block
**Apply to:** All component files using Tailwind classes
**Rule:** Brand color tokens (`brand-blue-500`, `brand-orange-500`) and font tokens (`font-display`, `font-body`)
are defined once in `global.css` and referenced via Tailwind utility classes everywhere.
Do not repeat color values in component files.

### JSON-LD via Astro Component
**Source:** `LegalServiceSchema.astro` — `<script type="application/ld+json" set:html={...} />`
**Apply to:** Homepage (Phase 1). Later phases add `PersonSchema`, `ArticleSchema`, `FAQSchema` as separate components.
**Rule:** JSON-LD is always emitted via a dedicated `.astro` component, never as raw inline script in a page file.
This ensures the schema data can be tested and the `set:html` pattern (which bypasses Astro's HTML escaping for
the JSON string) is used consistently.

### Astro Props Interface Pattern
**Source:** RESEARCH.md Pattern 3 (`BaseLayout.astro` Props interface)
**Apply to:** All `.astro` layout and component files that accept props
**Rule:** Every component with props defines a TypeScript `interface Props { ... }` in the frontmatter fence.
Use `Astro.props` destructuring with defaults. This is the Astro-idiomatic pattern (vs. arbitrary prop spreading).

### Security Headers as Vercel Config
**Source:** `vercel.json` headers block
**Apply to:** All HTTP responses (automatic — one config file, no per-page action required)
**Rule:** HTTP security headers are set in `vercel.json`, not in Astro middleware or page files.
This is the canonical Vercel approach and applies to static assets as well as HTML responses.

---

## No Analog Found

All 20 files have no codebase analog (greenfield project). The table below records this
explicitly and points the planner to the authoritative pattern source for each:

| File | Role | Data Flow | Pattern Source |
|------|------|-----------|----------------|
| `astro.config.mjs` | config | build-transform | RESEARCH.md §Pattern 1 (verbatim) |
| `src/styles/global.css` | config | build-transform | RESEARCH.md §Pattern 2 (verbatim) |
| `src/lib/constants.ts` | utility | data-source | RESEARCH.md §Example B (verbatim) |
| `content.config.ts` | config | build-transform | RESEARCH.md §Example C (verbatim) |
| `src/layouts/BaseLayout.astro` | layout | SSG | RESEARCH.md §Pattern 3 (verbatim) |
| `src/layouts/MarketingLayout.astro` | layout | SSG | RESEARCH.md §Pattern 3 (verbatim) |
| `src/components/layout/Header.astro` | component | SSG | Astro component pattern (construct) |
| `src/components/layout/Footer.astro` | component | SSG | Astro component pattern + constants |
| `src/components/legal/FooterDisclaimer.astro` | component | SSG | constants.ts disclaimer fields |
| `src/components/seo/SEO.astro` | component | SSG | Astro head pattern (construct) |
| `src/components/seo/LegalServiceSchema.astro` | component | SSG | RESEARCH.md §Pattern 3 + constants |
| `src/pages/index.astro` | page | SSG | RESEARCH.md §Walking Skeleton step 9 |
| `vercel.json` | config | edge | RESEARCH.md §Example A (verbatim) |
| `.github/workflows/ci.yml` | config | CI | RESEARCH.md §Example D (verbatim) |
| `.lighthouserc.json` | config | CI | RESEARCH.md §Example F (verbatim) |
| `scripts/banned-words.mjs` | utility | batch | RESEARCH.md §Example E (adapt) |
| `.env.example` | config | — | RESEARCH.md §Example H (verbatim) |
| `.gitignore` | config | — | RESEARCH.md §Example G (verbatim) |
| `public/robots.txt` | config | static | Standard web convention |
| `public/favicon.svg` | asset | — | Astro scaffold default |

---

## Metadata

**Analog search scope:** Full repository (`/Users/spalmer/Documents/Claude Code/Scopal Website/`)
**Files scanned:** 1 source file (`index.html` — 9-line HTML placeholder; no patterns extractable)
**Conclusion:** Zero codebase analogs exist. Planner must use RESEARCH.md examples as the
primary copy-from source. Files marked "verbatim" in the table above should be authored
exactly as shown in RESEARCH.md. Files marked "construct" or "adapt" require the planner to
author from the structural skeleton provided in this document.
**Pattern extraction date:** 2026-05-07
