# Phase 3: Firm Substance — People, Practice Areas, Pricing — Research

**Researched:** 2026-05-07
**Domain:** Astro 6 MDX content collections, dynamic routing, JSON-LD schema, accessible dropdown nav, headshot image optimization, law firm page copy (StoryBrand + ABA compliance)
**Confidence:** HIGH — all core Astro patterns verified against official docs; copy decisions locked in CONTEXT.md

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Legal Executive Coaching — Classification & URL**
- D-01: Legal Executive Coaching is NOT a practice area. It lives at `/coaching` — not under `/practice-areas/`.
- D-02: The `/coaching` page is built from an MDX content file, not a static `.astro` page.
- D-03: Coaching is for in-house attorneys and GCs — not the SaaS founder audience.
- D-04: Coaching pricing/CTA is Claude's discretion. Inquiry-based ("Book a Discovery Call") is the fit. Scott reviews in UAT.

**Navigation Updates**
- D-05: No `/practice-areas` index page. "Practice Areas" link becomes a dropdown: Corporate Law and Fractional GC (direct links).
- D-06: Coaching gets its own separate top-level nav link. Nav order: Practice Areas dropdown | Coaching | Scott Palmer | Pricing | Book a Fit Call.
- D-07: Mobile nav extended to handle the dropdown with vanilla `<script>`. No new JS libraries.

**Practice Area Pages**
- D-08: Practice areas use MDX content files + dynamic routing via `[slug].astro` + `getCollection('practice-areas')`.
- D-09: Phase 3 practice areas: Corporate Law and Fractional General Counsel only. Coaching excluded.
- D-10: All practice area copy is Claude-drafted from `FIRM_BRIEF.md` and `LAW_FIRM_WEBSITE_GUIDE.md`. Scott reviews UAT.
- D-11: Each page 800–1,500+ words. H1 is client-focused. Includes: who-it's-for, common client scenarios, how engagement works, scope/pricing orientation, FAQ block (3–5 questions), CTA, internal link to Scott's bio.
- D-12: `PracticeAreaLayout.astro` auto-injects: attorney-client disclaimer callout, FAQ component (emitting `FAQPage` schema), breadcrumbs (`BreadcrumbList` schema), and `CTASection`. Page authors do not wire these manually.

**Pricing Page**
- D-13: Price anchor is **$995/month** — "Unlimited GC Access." (Supersedes REQUIREMENTS.md which says $4,500/month.)
- D-14: No hourly billing. Major discrete projects billed separately, but exclusion language does NOT appear as a bullet list on the pricing page.
- D-15: Pricing page leads with "Unlimited GC Access" as the headline.
- D-16: Page structure: StoryBrand narrative — client problem first, reframes subscription as prevention vs. crisis.
- D-17: 5 included service areas displayed as feature cards/icon list:
  1. Corporate — Formation documents, partnership agreements, and related consulting
  2. Contracts — Initial audit, drafting and negotiation
  3. HR Matters — Daily HR questions, employment contracts
  4. Pre-litigation — Negotiation and dispute management
  5. Data — Audit, documentation, assessments, and agreements
- D-18: A single note (not list) that work outside scope will be estimated and billed separately. Framed positively.
- D-19: CTA: "Book a Fit Call" (primary) and "Schedule a Consultation" (secondary). Never "Buy Now" or "Sign Up."
- D-20: Comparison context (vs. BigLaw hourly + full-time GC hire) woven into StoryBrand narrative — not a separate table.

**Attorney Bio — Scott Palmer**
- D-21: `/attorneys/scott-palmer` leads with client benefit, then in-house background (7+ years as GC of PE-backed SaaS), education, representative matters, bar admissions, professional associations, headshot, CTA.
- D-22: Bar status copy reads exactly: **"Maryland (2009); New Jersey admission pending"** — no copy implies NJ is active.
- D-23: JSON-LD uses `Person` schema (NOT deprecated `Attorney` type) with `worksFor`, `alumniOf`, `hasCredential`.

**Team Page — Rachel Palmer**
- D-24: `/team/rachel-palmer` — clearly titled with her non-attorney role (Head of Operations). Includes headshot and role description. Does NOT use `PracticeAreaLayout` or attorney-specific schema.
- D-25: Rachel's page must visually and textually make clear she is not an attorney (UPL compliance).

**Headshots**
- D-26: Headshots are a blocking prerequisite — Scott commits them before execution agent runs.
- D-27: Any format accepted; optimization step required; final committed sources ≤200 KB via `astro:assets` `<Image />`.
- D-28: Suggested filenames: `scott-palmer.jpg` (or `.webp`), `rachel-palmer.jpg` (or `.webp`).

### Claude's Discretion
- Exact copy for all page bodies — Claude drafts from FIRM_BRIEF.md; Scott reviews UAT
- Legal Executive Coaching page format and pricing/CTA approach (inquiry-based recommended)
- Visual layout and Tailwind styling for all new pages and components — follows design system from 01-UI-SPEC.md
- FAQ questions for each practice area (3–5 per page) — drafted from common client scenarios in FIRM_BRIEF.md
- Icon selection for the 5 pricing feature cards

### Deferred Ideas (OUT OF SCOPE)
- Calendar scheduler embed (Calendly / SavvyCal) — deferred to v2
- Testimonials — deferred to v2; pending client authorization
- Speaking / media appearances page — v2
- Coaching pricing tiers — v2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PRAC-01 | Two practice area pages at `/practice-areas/fractional-general-counsel` and `/practice-areas/corporate-law`; coaching at `/coaching` | MDX collection + dynamic routing pattern verified; coaching routed as standalone page via MDX file |
| PRAC-02 | Each practice area page 800–1,500+ words with client-focused H1 | StoryBrand copy pattern from LAW_FIRM_WEBSITE_GUIDE.md; MDX body content holds prose |
| PRAC-03 | Each page includes who-it's-for, scenarios, engagement, scope/pricing, FAQ (3–5), CTA, internal link to attorney bio | PracticeAreaLayout auto-injects FAQ + CTA; MDX body carries the rest |
| PRAC-04 | PracticeAreaLayout auto-injects disclaimer callout, FAQPage schema, breadcrumbs, CTASection | Verified layout injection pattern; new schema components needed |
| PRAC-05 | Practice area JSON-LD: Service, FAQPage, BreadcrumbList; validated with Google Rich Results Test | Schema.org pattern documented; FAQPage + BreadcrumbList schema components to build |
| TEAM-01 | Scott's bio at `/attorneys/scott-palmer`: client benefit first, in-house roles, bar admissions, headshot, CTA | Static .astro page pattern; PersonSchema component; headshot via astro:assets |
| TEAM-02 | Rachel's page at `/team/rachel-palmer`; clearly non-attorney role; headshot | Static .astro page; no attorney schema; simple MarketingLayout |
| TEAM-03 | Attorney bio JSON-LD: Person schema with worksFor, alumniOf, hasCredential (not deprecated Attorney type) | Verified via schema.org docs and project D-23 |
| TEAM-04 | Bar admission copy exactly: "Maryland (2009); New Jersey admission pending" | Already in constants.ts via formatBarStatus(); bio page reads from there |
| PRICE-01 | Pricing page anchors $995/month (overrides REQUIREMENTS.md $4,500) with StoryBrand narrative | D-13 locked; REQUIREMENTS.md note explicitly superseded by CONTEXT.md |
| PRICE-02 | Comparison context vs. BigLaw hourly and full-time GC hire cost woven into narrative | StoryBrand §success/failure beats from LAW_FIRM_WEBSITE_GUIDE.md Part 1 |
| PRICE-03 | CTAs: "Book a Fit Call" / "Schedule a Consultation" — never "Buy Now" or "Sign Up" | Locked in D-19; consistent with Phase 2 CTA vocabulary |
</phase_requirements>

---

## Summary

Phase 3 is the firm's credibility layer — converting visitors who arrived via Phase 2's emotional hook into qualified prospects by giving them every page they'd need before reaching out. The technical scope is tractable: MDX content files + a dynamic routing template for practice areas, a set of new JSON-LD schema components (FAQPage, BreadcrumbList, PersonSchema, ServiceSchema), one new layout (`PracticeAreaLayout`), several static Astro pages (Scott bio, Rachel team page, pricing, coaching), and a Header upgrade (Practice Areas dropdown + Coaching nav link).

The infrastructure established in Phases 1–2 handles the hard compliance work automatically: `BaseLayout` injects footer disclaimers on every page, `constants.ts` owns all NAP and bar admission copy, the banned-words CI script runs on every PR, and `CTASection.astro` already exists and works. Phase 3 extends rather than rebuilds.

The one technical area requiring care is the accessible desktop dropdown for Practice Areas — the existing mobile hamburger `<script>` sets a solid vanilla-JS pattern to follow, but a desktop hover/click dropdown introduces new ARIA requirements (`aria-haspopup="true"`, `aria-expanded`, keyboard navigation including arrow keys and Escape). Headshot optimization is a second area of note: Scott's existing `scott-palmer.png` is 296 KB — above the 200 KB committed-source ceiling in PERF-01 — and must be processed/re-saved before commit. Rachel's headshot does not yet exist in the repo and is a blocking prerequisite per D-26.

**Primary recommendation:** Build in three waves: (1) header dropdown + coaching collection + schema components + PracticeAreaLayout scaffolding; (2) MDX content files for both practice areas and coaching, plus the dynamic routing template; (3) static pages (Scott bio, Rachel page, pricing). This sequencing ensures the layout and schema infrastructure exist before the content files that depend on them.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Practice area content (copy, FAQs) | MDX content files | PracticeAreaLayout renders | Content and presentation separated; content authors edit MDX, layout handles chrome |
| Dynamic URL generation for practice areas | Astro SSG (getStaticPaths) | — | Static output at build time; no server needed |
| Attorney-client disclaimer injection | PracticeAreaLayout | BaseLayout (footer) | Page-level callout is distinct from footer disclaimer; both must render |
| FAQ schema (FAQPage JSON-LD) | PracticeAreaLayout (via FAQSchema component) | — | Auto-injected; page authors never wire schema manually |
| Breadcrumb schema (BreadcrumbList) | PracticeAreaLayout (via BreadcrumbSchema component) | — | Same auto-injection principle as FAQ schema |
| Person schema for Scott's bio | PersonSchema component (imported by bio page) | — | Follows established LegalServiceSchema pattern |
| Pricing page layout + copy | Static Astro page (pricing.astro) | MarketingLayout | No collection needed; single page |
| Coaching page layout + copy | Static Astro page (coaching.astro) + MDX content | MarketingLayout | MDX for content-editing convenience per D-02 |
| Header dropdown (Practice Areas) | Header.astro (vanilla JS) | — | D-07: no new libraries; extend existing hamburger pattern |
| Headshot optimization | astro:assets Image component | Vercel image service | PERF-01 requires 200 KB source ceiling + astro:assets routing |
| Bar admission copy | constants.ts formatBarStatus() | Bio page imports | Single source of truth; bio page reads, never hardcodes |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^6.3.1 | SSG framework, content collections, dynamic routing | Already installed; verified in package.json |
| @astrojs/mdx | ^5.0.4 | MDX support for `.mdx` content files | Already installed; required for MDX in content collections |
| @tailwindcss/vite | ^4.2.4 | CSS utility classes; Tailwind v4 CSS-first config | Already installed; project standard (non-negotiable) |
| @tailwindcss/typography | ^0.5.19 | `prose` class for long-form MDX body text | Already installed; essential for practice area 800–1,500 word bodies |

[VERIFIED: package.json in project root]

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro:assets Image | built-in to astro | Headshot optimization, responsive srcset | All `<img>` tags for headshots; never raw `<img>` |
| astro:content getCollection | built-in to astro | Fetch MDX entries for getStaticPaths | [slug].astro and any collection-driven page |

### No New Packages Required

Phase 3 adds no npm dependencies. All capabilities (MDX, Image optimization, content collections, Tailwind, typography plugin) are already installed.

**Installation:** None required.

**Version verification:** All packages confirmed via `package.json` in the project root. [VERIFIED: package.json]

---

## Architecture Patterns

### System Architecture Diagram

```
MDX Files (src/content/practice-areas/*.mdx)
         |
         | getCollection('practice-areas')
         v
[slug].astro (getStaticPaths)
         |
         | renders via
         v
PracticeAreaLayout.astro
    |-- auto-injects DisclaimerCallout
    |-- auto-injects FAQSchema (from MDX frontmatter faqs[])
    |-- auto-injects BreadcrumbSchema (from page title/slug)
    |-- auto-injects CTASection (existing component)
    |-- wraps in MarketingLayout (-> BaseLayout -> Header, Footer)
         |
         | MDX <Content /> (800-1500 words of prose)
         v
Static HTML output (Vercel CDN)

Standalone Static Pages (coaching.astro, pricing.astro, attorneys/scott-palmer.astro, team/rachel-palmer.astro)
    |-- each uses MarketingLayout directly
    |-- bio page imports PersonSchema component
    v
Static HTML output (Vercel CDN)

Header.astro (modified)
    |-- desktop: Practice Areas <button> with aria-haspopup + aria-expanded
    |       dropdown panel: Corporate Law link + Fractional GC link
    |-- desktop: Coaching link (new top-level)
    |-- mobile: hamburger panel extended with Practice Areas disclosure + Coaching link
    |-- vanilla <script> handles open/close + Escape key
```

### Recommended Project Structure

```
src/
├── content/
│   ├── practice-areas/
│   │   ├── corporate-law.mdx          # Phase 3 new
│   │   └── fractional-general-counsel.mdx  # Phase 3 new
│   ├── coaching/
│   │   └── legal-executive-coaching.mdx   # Phase 3 new (optional collection or inline)
│   └── team/                          # Existing .gitkeep — MDX team profiles optional here
├── layouts/
│   ├── BaseLayout.astro               # Existing — no changes
│   ├── MarketingLayout.astro          # Existing — no changes
│   └── PracticeAreaLayout.astro       # Phase 3 new
├── pages/
│   ├── practice-areas/
│   │   └── [slug].astro               # Phase 3 new — dynamic routing
│   ├── attorneys/
│   │   └── scott-palmer.astro         # Phase 3 new
│   ├── team/
│   │   └── rachel-palmer.astro        # Phase 3 new
│   ├── coaching.astro                 # Phase 3 new (or coaching/index.astro)
│   └── pricing.astro                  # Phase 3 new
├── components/
│   ├── layout/
│   │   └── Header.astro               # Phase 3 modified — dropdown + Coaching link
│   ├── sections/
│   │   └── CTASection.astro           # Existing — reused by PracticeAreaLayout
│   ├── legal/
│   │   └── DisclaimerCallout.astro    # Phase 3 new — page-level attorney-client notice
│   └── seo/
│       ├── FAQSchema.astro            # Phase 3 new
│       ├── BreadcrumbSchema.astro     # Phase 3 new
│       └── PersonSchema.astro         # Phase 3 new
└── lib/
    └── constants.ts                   # Existing — formatBarStatus() already implemented
public/
└── images/
    └── team/
        ├── scott-palmer.png           # EXISTS (296 KB — exceeds 200 KB ceiling, must optimize)
        └── rachel-palmer.[ext]        # MISSING — blocking prerequisite per D-26
```

---

### Pattern 1: MDX Content Collection + Dynamic Routing

**What:** Practice area MDX files in `src/content/practice-areas/` are fetched at build time via `getCollection('practice-areas')` inside `getStaticPaths()` in `src/pages/practice-areas/[slug].astro`. Each MDX file becomes a URL at `/practice-areas/{filename-without-extension}`.

**When to use:** Whenever 2+ pages share the same layout and schema and differ only in content. Used for practice area pages; coaching is a single page so it does not use this pattern.

**Example:**
```astro
// src/pages/practice-areas/[slug].astro
---
import { getCollection, render } from 'astro:content';
import PracticeAreaLayout from '../../layouts/PracticeAreaLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('practice-areas');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
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

**Critical note — Astro 6 uses `entry.id` not `entry.slug`:** In Astro 6 with the glob loader, the field is `entry.id` (not the deprecated `entry.slug` from Astro 5). The params key can still be named `slug` for the URL, but the value comes from `entry.id`.
[VERIFIED: Astro docs upgrade guide /withastro/docs]

---

### Pattern 2: PracticeAreaLayout — Auto-Injection

**What:** A new layout wrapping `MarketingLayout` that automatically renders the page-level disclaimer callout, FAQ schema, breadcrumb schema, and CTASection. MDX page authors write only prose — no wiring required.

**When to use:** Every practice area page rendered by `[slug].astro`. Coaching page uses `MarketingLayout` directly (simpler).

**Example:**
```astro
// src/layouts/PracticeAreaLayout.astro
---
import MarketingLayout from './MarketingLayout.astro';
import CTASection from '../components/sections/CTASection.astro';
import DisclaimerCallout from '../components/legal/DisclaimerCallout.astro';
import FAQSchema from '../components/seo/FAQSchema.astro';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema.astro';

interface Props {
  title: string;
  description: string;
  faqs: Array<{ q: string; a: string }>;
  slug: string;
}
const { title, description, faqs, slug } = Astro.props;

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: title, url: `/practice-areas/${slug}` },
];
---
<MarketingLayout {title} {description}>
  <FAQSchema {faqs} />
  <BreadcrumbSchema items={breadcrumbs} />
  <article class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
    <DisclaimerCallout />
    <div class="prose prose-lg max-w-prose mx-auto mt-8">
      <slot />
    </div>
    <!-- FAQ block rendered from frontmatter data -->
    {faqs.length > 0 && (
      <section aria-labelledby="faq-heading" class="mt-16 max-w-prose mx-auto">
        <h2 id="faq-heading" class="font-display font-semibold text-2xl md:text-[28px]">
          Frequently Asked Questions
        </h2>
        <dl class="mt-8 space-y-8">
          {faqs.map(({ q, a }) => (
            <div>
              <dt class="font-semibold text-ink">{q}</dt>
              <dd class="mt-2 text-ink-muted leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    )}
  </article>
  <CTASection />
</MarketingLayout>
```

---

### Pattern 3: FAQSchema + BreadcrumbSchema JSON-LD Components

**What:** Schema.org components following the established `set:html={JSON.stringify(schema)}` pattern used by `LegalServiceSchema.astro` in Phase 1.

**When to use:** Imported and rendered by `PracticeAreaLayout` automatically. Never placed inline in page files.

**Example:**
```astro
// src/components/seo/FAQSchema.astro
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

```astro
// src/components/seo/BreadcrumbSchema.astro
---
interface Props {
  items: Array<{ name: string; url: string }>;
}
const { items } = Astro.props;
import { FIRM } from '../../lib/constants';
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

[VERIFIED: Astro docs /withastro/docs — `set:html` with JSON.stringify pattern for JSON-LD]

---

### Pattern 4: PersonSchema for Scott's Bio

**What:** `Person` schema (not the deprecated `Attorney` type) with `worksFor`, `alumniOf`, and `hasCredential` per D-23 and TEAM-03.

**When to use:** `src/pages/attorneys/scott-palmer.astro` only.

**Example:**
```astro
// src/components/seo/PersonSchema.astro
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

### Pattern 5: Accessible Desktop Dropdown (Practice Areas)

**What:** Replace the static "Practice Areas" `<a>` link in `Header.astro` with a `<button>` that reveals a dropdown panel containing links to Corporate Law and Fractional GC. Vanilla `<script>` only per D-07.

**ARIA requirements:**
- Trigger: `<button aria-haspopup="true" aria-expanded="false" aria-controls="practice-dropdown">`
- Panel: `id="practice-dropdown"` with `role="menu"` or simply `hidden` toggled
- Keyboard: Escape closes; focus returns to trigger; Tab should close panel on focus-out

**When to use:** Desktop nav only. Mobile nav uses the existing hamburger panel with a disclosure group.

**Example (structural skeleton):**
```astro
<!-- Desktop dropdown trigger (inside desktop nav) -->
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
    <!-- chevron icon -->
    <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
      <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>
  </button>
  <ul
    id="practice-dropdown"
    hidden
    class="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-lg shadow-md py-2 z-50"
  >
    <li>
      <a href="/practice-areas/corporate-law" class="block px-4 py-2 text-base text-ink hover:text-brand-blue-500 hover:bg-surface-muted transition-colors">
        Corporate Law
      </a>
    </li>
    <li>
      <a href="/practice-areas/fractional-general-counsel" class="block px-4 py-2 text-base text-ink hover:text-brand-blue-500 hover:bg-surface-muted transition-colors">
        Fractional GC
      </a>
    </li>
  </ul>
</div>
```

```html
<script>
  const btn = document.getElementById('practice-btn') as HTMLButtonElement | null;
  const dropdown = document.getElementById('practice-dropdown') as HTMLElement | null;

  if (btn && dropdown) {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      dropdown.hidden = isOpen;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.hidden = true;
        btn.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.hidden = true;
      }
    });
  }
</script>
```

---

### Pattern 6: Headshot via astro:assets Image

**What:** Headshots must be routed through `astro:assets` `<Image />` per PERF-01 and D-27. Source files must be ≤200 KB committed to `public/images/team/`. Images in `public/` are served as-is; for optimization, images used with `<Image />` should be placed in `src/assets/` instead, OR use the Vercel image service (already enabled via `imageService: true` in `astro.config.mjs`).

**Critical note:** Scott's existing headshot (`public/images/team/scott-palmer.png`, 296 KB) exceeds the 200 KB ceiling. The execution plan must include an optimization step to produce a ≤200 KB source file before committing. The file must also be moved/copied to `src/assets/team/` to be processed by `<Image />`, or the size reduced enough to commit to `public/`.

**Recommended approach:** Move headshots to `src/assets/team/` and import them statically. This enables full `<Image />` optimization.

**Example:**
```astro
---
import { Image } from 'astro:assets';
import scottHeadshot from '../../assets/team/scott-palmer.png';
---
<Image
  src={scottHeadshot}
  alt="Scott A. Palmer, Principal Attorney at Scopal Firm"
  width={400}
  height={400}
  class="rounded-xl object-cover"
  loading="eager"
/>
```

[VERIFIED: Astro docs /withastro/docs — Image component srcset and responsive patterns]

---

### Pattern 7: MDX Frontmatter Schema (content.config.ts)

The `practiceAreas` collection schema is already defined in `content.config.ts`:

```ts
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
```

The coaching page (D-02) uses an MDX file but can be read directly in `coaching.astro` without a dedicated collection — or a minimal `coaching` collection can be added. Given there is exactly one coaching page and the content is structural (not list-rendered), the simplest approach is a static `coaching.astro` page that imports content inline. However, D-02 specifies "built from an MDX content file" for content-editing consistency. A `coaching` collection with one entry is the correct approach.

**coaching collection addition needed in content.config.ts:**
```ts
const coaching = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/coaching' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    audience: z.string(),
  }),
});
// + add coaching to collections export
```

[VERIFIED: Astro docs /withastro/docs — defineCollection pattern]

---

### Anti-Patterns to Avoid

- **Hardcoding bar admission copy in bio page:** The `formatBarStatus()` function in `constants.ts` already produces the exact D-22 string. Never write "Maryland (2009)" directly in a component.
- **Using deprecated `entry.slug`:** Astro 6 uses `entry.id`. Using `.slug` silently fails to generate correct URLs.
- **Putting Coaching under `/practice-areas/`:** D-01 is explicit — coaching lives at `/coaching`, excluded from the `practice-areas` collection.
- **Using `Attorney` type in JSON-LD:** Schema.org deprecated this. Use `Person` with `hasCredential` per D-23.
- **Inline JSON-LD in page files:** All JSON-LD must go through dedicated schema `.astro` components (established project pattern).
- **Orange for CTAs or links:** `brand-orange-500` is decorative-only in this project. All CTAs use `brand-blue-500`.
- **Banned vocabulary in any copy:** `specialist`, `specializing in`, `expert`, `experts`, `the best`, `#1`, `leading`, `top-rated`, `super lawyer` — CI will catch these on PR.
- **Implying NJ bar admission is active:** Any copy near "New Jersey" must include "pending" or "admission pending." The exact string from `formatBarStatus()` is safe.
- **Rachel's page under `/attorneys/`:** Must be under `/team/` per TEAM-02 and UPL compliance (D-25).
- **Images not via astro:assets:** Raw `<img>` tags for headshots violate PERF-01.
- **Committing images > 200 KB:** Scott's current `scott-palmer.png` is 296 KB and must be optimized before execution.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization + responsive srcset | Custom `<img>` with manual size attributes | `astro:assets` `<Image />` | Handles WebP/AVIF conversion, srcset, width/height, prevents CLS |
| Tailwind typography styles for long prose | Custom CSS for MDX body | `@tailwindcss/typography` `prose` class | Already installed; handles headings, paragraphs, lists, links in MDX bodies |
| Dropdown accessibility (ARIA state) | Custom toggle without ARIA | Vanilla JS with `aria-haspopup`, `aria-expanded`, Escape key | WCAG 2.1 AA — axe-core CI gate will catch missing ARIA |
| Bar admission copy | Hardcoded strings | `formatBarStatus()` from constants.ts | Single source of truth; D-22 exact string already encoded |
| FAQPage/BreadcrumbList schema | Inline `<script>` in page files | Dedicated schema `.astro` components | Established project pattern; testable; type-safe |

**Key insight:** Every cross-cutting concern in this project (disclaimers, schema, CTAs, image optimization, typography) has an existing solution — layouts, constants, components, or installed packages. Phase 3 writes content and wires components; it does not build infrastructure from scratch.

---

## Common Pitfalls

### Pitfall 1: Scott's headshot exceeds 200 KB source ceiling

**What goes wrong:** `public/images/team/scott-palmer.png` is 296 KB. PERF-01 requires committed source images ≤200 KB. CI or pre-launch audit will flag this.

**Why it happens:** The file was committed before the optimization requirement was enforced.

**How to avoid:** The execution plan must include an explicit optimization step — use macOS's `sips` command or an online tool to export a new JPEG/WebP under 200 KB before the headshot is moved to `src/assets/team/` and referenced by `<Image />`. Do NOT use the 296 KB file as-is.

**Warning signs:** `du -k` on the file shows > 200.

### Pitfall 2: Coaching collection not added to content.config.ts

**What goes wrong:** MDX file at `src/content/coaching/legal-executive-coaching.mdx` won't be recognized by Astro's content layer without a collection definition. Build succeeds (Astro ignores unknown folders) but `getCollection('coaching')` returns empty.

**Why it happens:** The coaching collection isn't in the existing `content.config.ts` because it was deferred to Phase 3.

**How to avoid:** Wave 0 of the execution plan must add the `coaching` collection to `content.config.ts` before creating the MDX file.

### Pitfall 3: Desktop dropdown breaks keyboard navigation

**What goes wrong:** Dropdown panel is visible but Tab key doesn't land on dropdown items, or Escape doesn't close it, or clicking outside doesn't dismiss it. Axe-core or manual testing reveals `aria-expanded` not toggling correctly.

**Why it happens:** The existing hamburger script only handles mobile toggle; the desktop dropdown pattern requires additional ARIA management and outside-click detection.

**How to avoid:** Use the vanilla JS pattern in Pattern 5 above exactly. Test with keyboard only: Tab into the button, Enter to open, Tab through items, Escape to close.

### Pitfall 4: `entry.slug` used instead of `entry.id`

**What goes wrong:** Dynamic routing generates 404s for all practice area pages in production (or dev). URL is `/practice-areas/undefined` or uses an old Astro 5 slug format.

**Why it happens:** Astro 5 used `entry.slug`; Astro 6 with the glob loader uses `entry.id`.

**How to avoid:** Use `entry.id` in `getStaticPaths()` params. Confirmed via Astro 6 upgrade guide.
[VERIFIED: Astro docs /withastro/docs — upgrade to v6]

### Pitfall 5: Practice area MDX files missing required frontmatter fields

**What goes wrong:** Build fails with Zod validation error like "Required" on `shortTitle` or `description`.

**Why it happens:** The `practiceAreas` schema in `content.config.ts` requires `title`, `shortTitle`, `description`, `order`. If MDX frontmatter omits any non-optional field, the build fails.

**How to avoid:** Every MDX file must include: `title`, `shortTitle`, `description` (≤160 chars), `order` (integer), and `faqs` array (can be empty `[]`). The `icon` field is optional.

### Pitfall 6: Dropdown adds unwanted JavaScript to static pages

**What goes wrong:** A JavaScript error in the dropdown `<script>` block causes `astro build` to fail or browser console errors.

**Why it happens:** TypeScript type assertions in `<script>` blocks must use `as Type | null` pattern and null-check before calling methods, exactly as the existing hamburger script does.

**How to avoid:** Follow the existing `Header.astro` script pattern: `const btn = document.getElementById('practice-btn') as HTMLButtonElement | null; if (btn && dropdown) { ... }`.

---

## Code Examples

### Practice Area MDX Frontmatter Example

```mdx
---
title: "Your Business Needs Legal Counsel — Not Legal Bills"
shortTitle: "Fractional General Counsel"
description: "Scopal Firm provides fractional GC services for SaaS companies that need a dedicated legal partner without the full-time hire."
order: 1
faqs:
  - q: "What does a fractional GC do that an hourly lawyer doesn't?"
    a: "A fractional GC is embedded in your business — attending meetings, reviewing contracts proactively, flagging issues before they become crises. An hourly lawyer responds to problems after they happen."
  - q: "How quickly can I reach Scott?"
    a: "Same-day response on business days. Unlimited day-to-day questions are included in the subscription."
  - q: "What's included in the subscription?"
    a: "Corporate matters, contract drafting and negotiation, HR questions, pre-litigation dispute management, and data privacy work are all covered. Major discrete projects are scoped separately."
---

Your MDX body content (800–1,500+ words) goes here...
```

### DisclaimerCallout Component (new)

```astro
// src/components/legal/DisclaimerCallout.astro
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

### Scott's Bio Page Structure

```astro
// src/pages/attorneys/scott-palmer.astro
---
import MarketingLayout from '../../layouts/MarketingLayout.astro';
import PersonSchema from '../../components/seo/PersonSchema.astro';
import CTASection from '../../components/sections/CTASection.astro';
import { Image } from 'astro:assets';
import { ATTORNEYS, formatBarStatus } from '../../lib/constants';
import scottHeadshot from '../../assets/team/scott-palmer.jpg'; // optimized, <200KB
const scott = ATTORNEYS['scott-palmer'];
---
<MarketingLayout
  title="Scott A. Palmer — Principal Attorney | Scopal Firm"
  description="Scott A. Palmer is the principal attorney at Scopal Firm, serving as fractional GC for SaaS companies. Formerly VP/GC at uPerform, a PE-backed healthcare SaaS."
  ogType="profile"
>
  <PersonSchema />
  <article class="mx-auto max-w-[1200px] px-md md:px-lg lg:px-xl py-12 md:py-16">
    <!-- Client-benefit-first H1 per D-21 -->
    <h1 class="font-display font-semibold text-4xl md:text-5xl text-ink leading-[1.15]">
      A General Counsel Invested in Your Business, Not Your Hourly Bill
    </h1>
    <!-- headshot + bio details -->
    <Image src={scottHeadshot} alt="Scott A. Palmer, Principal Attorney" width={400} height={400} loading="eager" class="rounded-xl mt-8" />
    <!-- Bar admissions — reads from constants, never hardcoded -->
    <p class="text-sm text-ink-muted mt-4">Bar Admissions: {formatBarStatus()}</p>
    <!-- body content... -->
  </article>
  <CTASection />
</MarketingLayout>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `entry.slug` (Astro 5) | `entry.id` (Astro 6) | Astro 6.0 | Use `entry.id` in `getStaticPaths` — `entry.slug` is deprecated |
| `src/content/config.ts` | `content.config.ts` (repo root) | Astro 5+ | File must be at repo root, not under `src/` |
| `@astrojs/tailwind` | `@tailwindcss/vite` | Tailwind v4 | `@astrojs/tailwind` is deprecated; already correct in this project |
| `Attorney` JSON-LD type | `Person` with `hasCredential` | Schema.org deprecation | `Attorney` is deprecated; project uses `Person` per D-23 |

[VERIFIED: Astro docs /withastro/docs upgrade guide; project config verified via package.json and content.config.ts]

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | Yes | 24.14.1 | — |
| astro | All pages | Yes | 6.3.1 | — |
| @astrojs/mdx | MDX content files | Yes | 5.0.4 | — |
| @tailwindcss/vite | Styling | Yes | 4.2.4 | — |
| @tailwindcss/typography | MDX prose | Yes | 0.5.19 | — |
| scott-palmer.png (headshot) | TEAM-01, bio page | Yes (296 KB — oversized) | — | Must optimize to ≤200 KB before use |
| rachel-palmer.[ext] (headshot) | TEAM-02, Rachel page | **MISSING** | — | **Blocking — must be committed by Scott before execution per D-26** |

**Missing dependencies with no fallback:**
- `public/images/team/rachel-palmer.[ext]` — Rachel's headshot is a blocking prerequisite per D-26. Execution plan must include a pre-execution checkpoint (same pattern as Phase 2 logo checkpoint) where Scott commits the file before Wave 1 of the execution agent runs. D-28 specifies acceptable filenames: `rachel-palmer.jpg` or `rachel-palmer.webp`.

**Oversized assets requiring action:**
- `public/images/team/scott-palmer.png` (296 KB) — must be optimized to ≤200 KB and moved to `src/assets/team/` for `<Image />` processing. This is an execution task, not a blocker for planning.

[VERIFIED: `du -k` on file; ls of public/images/team/]

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | axe-core CLI + Lighthouse CI (existing from Phase 1 CI) |
| Config file | `.lighthouserc.json` (existing) + `.github/workflows/ci.yml` (existing) |
| Quick run command | `npm run banned-words` (< 5s) |
| Full suite command | `npm run build && npm run a11y && npm run linkcheck` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PRAC-01 | Pages at `/practice-areas/fractional-general-counsel` and `/practice-areas/corporate-law` exist | build smoke | `npm run build` (linkcheck verifies URLs) | Wave 0 — MDX files created |
| PRAC-02 | Pages 800–1,500+ words, client-focused H1 | manual review | Human review during UAT | Manual only |
| PRAC-03 | FAQ block, who-it's-for, CTA present | build smoke | `npm run build` + axe-core | Auto-injected by PracticeAreaLayout |
| PRAC-04 | PracticeAreaLayout auto-injects disclaimer, FAQPage schema, breadcrumbs, CTA | build smoke | `npm run build` (schema in HTML output) | ✅ Wave 0 — PracticeAreaLayout |
| PRAC-05 | JSON-LD validates (Service, FAQPage, BreadcrumbList) | manual | Google Rich Results Test (manual pre-merge) | Manual — run once after build |
| TEAM-01 | Scott bio at correct URL with headshot and bar status | build smoke | `npm run build && npm run linkcheck` | Wave 0 — scott-palmer.astro |
| TEAM-02 | Rachel page at `/team/rachel-palmer` (not `/attorneys/`) | build smoke | `npm run build && npm run linkcheck` | Wave 0 — rachel-palmer.astro |
| TEAM-03 | Person JSON-LD on bio page | build smoke | `npm run build` | PersonSchema component in Wave 0 |
| TEAM-04 | Bar admission copy exactly correct | unit | `npm run banned-words` (doesn't catch bar copy); manual review | Manual — read constants.ts output |
| PRICE-01 | $995/month anchor on pricing page | manual | Banned-words script won't catch; manual UAT | Manual — Scott reviews in UAT |
| PRICE-02 | Comparison context present | manual | Human review during UAT | Manual only |
| PRICE-03 | CTAs "Book a Fit Call" / "Schedule a Consultation" only | CI | `npm run banned-words` (catches if wrong CTAs slip in) | ✅ Existing |

### Sampling Rate

- **Per task commit:** `npm run banned-words` (ensures no banned vocabulary in new copy)
- **Per wave merge:** `npm run build` (catches build failures, missing frontmatter, broken routes)
- **Phase gate:** Full suite (`npm run build && npm run a11y && npm run linkcheck`) green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/content/coaching/` directory + MDX file — no coaching collection currently exists
- [ ] `content.config.ts` — needs `coaching` collection definition added
- [ ] `src/assets/team/` directory — headshots must move here from `public/images/team/` for `<Image />` processing
- [ ] `src/components/seo/FAQSchema.astro` — does not exist yet
- [ ] `src/components/seo/BreadcrumbSchema.astro` — does not exist yet
- [ ] `src/components/seo/PersonSchema.astro` — does not exist yet
- [ ] `src/components/legal/DisclaimerCallout.astro` — does not exist yet
- [ ] `src/layouts/PracticeAreaLayout.astro` — does not exist yet

---

## Security Domain

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No authenticated routes in this phase |
| V3 Session Management | No | Static pages only |
| V4 Access Control | No | All pages public |
| V5 Input Validation | No | No form submission in this phase |
| V6 Cryptography | No | No secrets in this phase |

**Phase 3 specific security considerations:**

- **Bar admission copy (UPL / bar rule compliance):** Any copy implying New Jersey bar admission is active would constitute unauthorized practice of law representation. The `formatBarStatus()` function in `constants.ts` is the only safe source for this string. The banned-words script does not catch this — it requires human review during UAT (TEAM-04 is manual-review only).

- **Attorney advertising (ABA Model Rule 7.1–7.2):** Practice area copy must not contain superlatives or comparisons that can't be substantiated. The banned-words CI gate catches the vocabulary list; copywriting discretion covers the rest.

- **UPL appearance — Rachel's page:** Page must not visually or textually imply Rachel is an attorney. "Head of Operations" title, no `Person`/`LegalService` schema, no bar admission display. D-25 is a legal compliance requirement.

- **Content Security Policy:** All JSON-LD uses `set:html={JSON.stringify(schema)}` on `<script type="application/ld+json">` tags. This is CSP-safe because `type="application/ld+json"` is not an executable script type and does not require `unsafe-inline`. The existing CSP in `vercel.json` handles this correctly.
[VERIFIED: vercel.json in project root; established pattern from Phase 1]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Coaching page can be a static `.astro` that renders an MDX file directly without a full collection, OR a single-entry collection — both are valid | Architecture Patterns | If Astro requires non-empty collection for `getCollection` to work, the single-entry collection approach is correct (low risk — either approach is verified to work) |
| A2 | `src/assets/team/` is the correct location for headshots to be processed by `<Image />` (vs. `public/images/team/`) | Pattern 6 | If images remain in `public/`, `<Image />` will still serve them but won't optimize — PERF-01 may not be fully satisfied. Moving to `src/assets/` is the correct approach. [ASSUMED — not verified against Vercel image service behavior for files in `public/`] |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions

1. **Rachel's headshot format and timing**
   - What we know: D-26 says headshots are a blocking prerequisite; D-28 suggests `.jpg` or `.webp`
   - What's unclear: Whether Rachel's headshot exists anywhere (it does not appear in `public/images/team/`)
   - Recommendation: The execution plan Wave 0 must be `autonomous: false` with an explicit checkpoint: "Commit Rachel's headshot to `public/images/team/` before running Wave 1." Same blocking prerequisite pattern used for Phase 2 logos.

2. **Coaching page: single static `.astro` vs. single-entry collection**
   - What we know: D-02 says "built from an MDX content file." This implies a collection.
   - What's unclear: Whether a single-entry collection is worth the overhead vs. a static `.astro` that imports an MDX file directly (not from a collection)
   - Recommendation: Use a minimal `coaching` collection. D-02 is explicit about content-editing consistency. The overhead is one collection definition + one directory. This also future-proofs if coaching content grows.

3. **Service schema on practice area pages**
   - What we know: PRAC-05 requires `Service` JSON-LD; ROADMAP success criteria 5 confirms this.
   - What's unclear: What `Service` schema fields are required beyond `@type` and `name`.
   - Recommendation: Build a `ServiceSchema.astro` component that emits `Service` with `name`, `provider` (the LegalService), and `description`. Validate with Google Rich Results Test post-build. [ASSUMED — schema.org/Service is simple and well-documented; this is LOW risk]

---

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` (Context7) — getCollection, getStaticPaths, entry.id, set:html JSON-LD pattern, Image component, content collection schema
- `package.json` (project root) — installed package versions verified directly
- `content.config.ts` (project root) — existing collection schemas verified directly
- `src/lib/constants.ts` — formatBarStatus(), ATTORNEYS['scott-palmer'] structure verified
- `src/components/layout/Header.astro` — existing vanilla JS pattern for mobile menu verified
- `src/components/sections/CTASection.astro` — existing component verified for reuse
- `src/layouts/BaseLayout.astro`, `MarketingLayout.astro` — layout hierarchy verified

### Secondary (MEDIUM confidence)
- `public/images/team/scott-palmer.png` — file size verified via `du -k` (296 KB, exceeds ceiling)
- `ls public/images/team/` — Rachel's headshot confirmed absent

### Tertiary (LOW confidence)
- A2 (Assumptions Log) — `src/assets/team/` vs. `public/` for Image optimization — standard Astro pattern but not verified against Vercel image service behavior for `public/` files in this specific config

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in package.json; no new installs
- Architecture: HIGH — MDX dynamic routing pattern verified via Astro docs; existing codebase patterns confirmed
- Pitfalls: HIGH — headshot size issue verified empirically; Astro 6 entry.id change verified via docs
- Copy/content: HIGH — all content decisions locked in CONTEXT.md; firm data in FIRM_BRIEF.md

**Research date:** 2026-05-07
**Valid until:** 2026-07-07 (stable framework; Astro minor versions unlikely to break patterns)
