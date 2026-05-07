# Phase 1: Foundation + Live Skeleton — Research

**Researched:** 2026-05-07
**Domain:** Astro 6 + Tailwind v4 + Vercel project bootstrap, security headers, CI rails, content collection plumbing, layout-enforced compliance
**Confidence:** HIGH

---

## Summary

Phase 1 stands up a deployable Astro 6 + Tailwind v4 site on Vercel with every compliance, security, and CI rail wired so later phases inherit them automatically. The thinnest viable Walking Skeleton is: scaffolded Astro project → Tailwind v4 via `@tailwindcss/vite` → `@astrojs/vercel` adapter → `vercel.json` security headers → `BaseLayout` that already injects the firm footer with NAP + UPL/attorney-advertising disclaimers → empty-but-typed `content.config.ts` (blog/practiceAreas/team) → `src/lib/constants.ts` single source of truth → CI workflow on every PR (banned-words, axe-core, linkinator, gitleaks, Lighthouse CI) → custom domain `scopalfirm.com` resolving to a placeholder homepage on Vercel. No homepage copy, no practice area content, no contact form — those are Phases 2–4.

Every decision in this phase is locked by project research D1–D17 [VERIFIED: .planning/research/SUMMARY.md]. The research below is prescriptive (use X), not exploratory, because the stack is non-negotiable per CLAUDE.md.

**Primary recommendation:** Execute the bootstrap in the order [scaffold → adapter → tailwind → vercel.json → constants/content config → BaseLayout+Footer → CI → domain cutover]. Do NOT install `@astrojs/tailwind` (deprecated). Do NOT generate `tailwind.config.js`. Set `output: 'static'` (NOT `'server'` as P0-9 in PITFALLS warns — Astro 6 supports per-route `prerender = false` from static mode, which is what the contact form will use in Phase 4).

---

## Project Constraints (from CLAUDE.md)

These are extracted from `.claude/CLAUDE.md` and treated with locked-decision authority:

| # | Directive | Source |
|---|-----------|--------|
| C1 | Stack is fixed: Astro 6 + Tailwind v4 + GitHub + Vercel. Do not suggest alternatives. | CLAUDE.md "Tech Stack — Already Decided" |
| C2 | User is a non-developer attorney. Every command needs a one-sentence plain-English explanation BEFORE running. | CLAUDE.md "How to Communicate" |
| C3 | Always read FIRM_BRIEF.md and LAW_FIRM_WEBSITE_GUIDE.md at session start. | CLAUDE.md "Always Read" |
| C4 | Footer disclaimer required on EVERY page (built into BaseLayout — Phase 1 deliverable). | CLAUDE.md "Non-Negotiables" |
| C5 | JSON-LD on every page (LegalService/Person/Article appropriate). Phase 1 ships LegalService on the placeholder homepage. | CLAUDE.md "Non-Negotiables" |
| C6 | No image > 200 KB committed. (Enforce via CI check; Phase 1 has at most a logo.) | CLAUDE.md "Non-Negotiables" |
| C7 | `.env` and `.env.local` in `.gitignore`; never commit secrets; gitleaks in CI from Phase 1. | CLAUDE.md "Security requirements" |
| C8 | Security headers in `vercel.json` from day one. | CLAUDE.md "Security requirements" |
| C9 | Contact form provider deferred — do NOT pick one in Phase 1. The contact action skeleton is Phase 4. | CLAUDE.md "Tech Stack" |
| C10 | Significant decisions get an entry in `.planning/DECISIONS.md` with what/why/teaching insight. | CLAUDE.md "Decision Log" |

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Astro 6 + Tailwind v4 + `@astrojs/vercel`, deployed via Vercel auto-deploy on push to `main` | §2 Bootstrap, §4 Vercel deployment |
| FOUND-02 | `vercel.json` ships CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS on every response | §5 Security Headers |
| FOUND-03 | `.env`/`.env.local` gitignored; `.env.example` documents every var; gitleaks in CI | §7 CI Pipeline, §3 Env Schema |
| FOUND-04 | `src/lib/constants.ts` single source of truth for NAP + bar admissions + social URLs | §3 constants.ts |
| FOUND-05 | CI runs banned-words, axe-core, linkinator, gitleaks, Lighthouse CI on every PR | §7 CI Pipeline |
| FOUND-06 | `content.config.ts` defines `blog`, `practiceAreas`, `team` collections with Zod schemas | §6 Content Collections |
| FOUND-07 | Layout hierarchy: `BaseLayout` → `MarketingLayout` / `BlogPostLayout` / `PracticeAreaLayout`; disclaimers injected by layouts | §8 Layout Hierarchy |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Static page rendering (placeholder home) | CDN / Static (Vercel edge HTML) | Frontend Server (Astro build) | Built once, served from edge; zero JS |
| Security headers | CDN / Edge (Vercel response middleware) | — | `vercel.json` is the canonical place for cross-route headers |
| Footer + disclaimers | Frontend Server (Astro build → static HTML) | — | Layout-injected at build time so no page can omit them |
| JSON-LD (LegalService) | Frontend Server (Astro build) | — | Emitted into static HTML head |
| Sitemap / robots | CDN / Static (build artifacts) | — | `@astrojs/sitemap` writes at build, served by Vercel |
| CI checks | GitHub Actions (CI runner, separate from runtime) | — | Off-platform; gates merges before deploy |
| Secret storage | Vercel platform (env vars) | — | Never committed; never in build output |
| DNS / TLS / domain | DNS (registrar) → Vercel platform | — | Vercel automates LE certs once domain is added |

---

## Standard Stack

### Core (install in Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `^6.3` (latest 6.3.0) | Framework | Stack locked; Astro 6 is current. [VERIFIED: npm view astro version → 6.3.0, 2026-05-07] |
| `@astrojs/vercel` | `^10.0` (latest 10.0.6) | Vercel adapter | Required for any server route; safe to install in Phase 1 even though no server routes ship until Phase 4. [VERIFIED: npm view @astrojs/vercel version → 10.0.6] |
| `tailwindcss` | `^4.2` (latest 4.2.4) | CSS engine | Stack locked; v4 mandatory. [VERIFIED: npm view tailwindcss version → 4.2.4] |
| `@tailwindcss/vite` | `^4.2` (latest 4.2.4) | Tailwind ↔ Vite glue | **Required**; replaces deprecated `@astrojs/tailwind`. [VERIFIED: npm registry; CITED: docs.astro.build/en/guides/styling/] |
| `@astrojs/sitemap` | `^3.7` (latest 3.7.2) | sitemap.xml generation | Official; zero-config once `site` is set. [VERIFIED: npm view @astrojs/sitemap version → 3.7.2] |
| `@astrojs/mdx` | `^5.0` (latest 5.0.4) | MDX support for blog | Phase 4 needs MDX; Phase 1 can install now so collection schema is ready. [VERIFIED: npm view @astrojs/mdx version → 5.0.4] |
| `@tailwindcss/typography` | `^0.5.19` | Prose styles for blog | Loaded with `@plugin` in CSS. Useful for legal/disclaimer prose blocks even in Phase 1. [VERIFIED: npm view @tailwindcss/typography version → 0.5.19] |

### Supporting (dev / CI only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@axe-core/cli` | `^4.11` (latest 4.11.3) | Headless a11y scanner | CI step; runs against `npm run preview` URL. [VERIFIED: npm view @axe-core/cli version → 4.11.3] |
| `linkinator` | `^7.6` (latest 7.6.1) | Internal link checker | CI step; crawl built `dist/`. [VERIFIED: npm view linkinator version → 7.6.1] |
| `@lhci/cli` | `^0.15` (latest 0.15.1) | Lighthouse CI | CI step; enforce performance budgets. [VERIFIED: npm view @lhci/cli version → 0.15.1] |
| `gitleaks` | latest binary | Secret scanner | GitHub Action `gitleaks/gitleaks-action@v2`. [CITED: github.com/gitleaks/gitleaks-action] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@tailwindcss/vite` | `@astrojs/tailwind` | Deprecated; do not use [CITED: docs.astro.build] |
| `output: 'static'` + per-route `prerender = false` | `output: 'server'` | `static` keeps every marketing page on the CDN; only the contact endpoint goes server-rendered in Phase 4. P0-9 in PITFALLS warns about this exact mismatch. |
| GitHub Actions for CI | Vercel-only checks | Vercel doesn't gate merges — only deploys. CI must live on GitHub to block PRs. |
| `husky` pre-commit | Server-side only (CI) | Pre-commit hooks help but CI is the binding gate. Phase 1 ships CI; pre-commit can be added later. |

**Installation cheat sheet** (Phase 1 plan should reference this verbatim):

```bash
# 1. Scaffold Astro 6 with strict TypeScript
npm create astro@latest -- --template minimal --typescript strict --install --no-git

# 2. Add Vercel adapter (configures astro.config.mjs)
npx astro add vercel

# 3. Add Tailwind v4 (configures @tailwindcss/vite)
npx astro add tailwind

# 4. Add MDX (Phase 4 needs it; install now so blog collection schema works)
npx astro add mdx

# 5. Sitemap + typography
npm install @astrojs/sitemap @tailwindcss/typography

# 6. CI dev deps
npm install --save-dev @axe-core/cli linkinator @lhci/cli
```

⚠ Run `npx astro add` commands one at a time and confirm each prompt; the CLI patches `astro.config.mjs` automatically.

---

## Architecture Patterns

### System Architecture Diagram (Phase 1 walking skeleton)

```
                ┌──────────────────────────────────────┐
                │  Developer (Claude Code, attorney)   │
                └──────────────────┬───────────────────┘
                                   │ git push origin main
                                   ▼
                ┌──────────────────────────────────────┐
                │  GitHub repo (spalmer47/scopal)      │
                │  ─────────────────────────────────── │
                │  PR open ──► CI workflow:            │
                │   • banned-words lint                │
                │   • axe-core (against preview build) │
                │   • linkinator (dist/ crawl)         │
                │   • gitleaks (secret scan)           │
                │   • Lighthouse CI (perf budgets)     │
                │  Merge gate: all checks green        │
                └──────────────────┬───────────────────┘
                                   │ webhook (Git integration)
                                   ▼
                ┌──────────────────────────────────────┐
                │  Vercel build (astro build)          │
                │  ─────────────────────────────────── │
                │  • Reads astro.config.mjs            │
                │  • Reads env vars from Vercel        │
                │  • Emits dist/ static HTML + assets  │
                └──────────────────┬───────────────────┘
                                   │ atomic deploy
                                   ▼
                ┌──────────────────────────────────────┐
                │  Vercel Edge CDN                     │
                │  scopalfirm.com (TLS via Let's Enc.) │
                │  ─────────────────────────────────── │
                │  Response = static HTML +            │
                │  vercel.json headers (CSP, HSTS, …)  │
                └──────────────────┬───────────────────┘
                                   │ HTTPS GET /
                                   ▼
                ┌──────────────────────────────────────┐
                │  Visitor browser                     │
                │  Sees placeholder homepage with      │
                │  footer NAP + disclaimers            │
                └──────────────────────────────────────┘
```

### Recommended Project Structure (Phase 1 minimum)

The full target structure is in ARCHITECTURE.md §2. Phase 1 ships a strict subset — files marked **[P1]** ship now; everything else is created in later phases:

```
scopal-website/
├── public/
│   ├── favicon.svg                    [P1]
│   └── robots.txt                     [P1]
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro           [P1] (logo + minimal nav placeholder)
│   │   │   └── Footer.astro           [P1] (NAP, disclaimers, jurisdiction, ad line)
│   │   ├── legal/
│   │   │   └── FooterDisclaimer.astro [P1] (rendered inside Footer)
│   │   └── seo/
│   │       ├── SEO.astro              [P1] (title, meta, OG, canonical)
│   │       └── LegalServiceSchema.astro [P1] (firm-level JSON-LD)
│   ├── content/                       [P1] (empty folders with .gitkeep)
│   │   ├── blog/.gitkeep
│   │   ├── practice-areas/.gitkeep
│   │   └── team/.gitkeep
│   ├── layouts/
│   │   ├── BaseLayout.astro           [P1]
│   │   └── MarketingLayout.astro      [P1] (BlogPost/PracticeArea defer to P3/P4 — but stub now if cheap)
│   ├── lib/
│   │   └── constants.ts               [P1]
│   ├── pages/
│   │   └── index.astro                [P1] (placeholder; Phase 2 replaces)
│   └── styles/
│       └── global.css                 [P1]
├── content.config.ts                  [P1]
├── astro.config.mjs                   [P1]
├── tsconfig.json                      [P1] (auto-generated, strict)
├── vercel.json                        [P1]
├── .env.example                       [P1]
├── .gitignore                         [P1]
├── .github/workflows/ci.yml           [P1]
├── .lighthouserc.json                 [P1]
├── scripts/banned-words.mjs           [P1]
└── package.json                       [P1]
```

### Pattern 1: `astro.config.mjs` (Phase 1 final form)

```js
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/integrations-guide/vercel/ + STACK.md §3
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://scopalfirm.com', // REQUIRED — sitemap + canonical derive from this
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
      // Phase 1 has no required runtime env; declare placeholders that Phase 4 will populate.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
});
```

**Why these settings:**
- `site` set BEFORE first deploy (P0-9 / SUMMARY.md item #3) — sitemap, canonicals, OG URLs all derive from it. [CITED: docs.astro.build/en/guides/integrations-guide/sitemap]
- `output: 'static'` (NOT `'server'`) — Phase 1 has no server routes; Phase 4 adds `prerender = false` to one route only. [VERIFIED: docs.astro.build/en/reference/configuration-reference/]
- `webAnalytics.enabled: true` — privacy-friendly; one less third-party script. [CITED: docs.astro.build/en/guides/integrations-guide/vercel]
- `imageService: true` — Vercel handles `<Image />` optimization in production. [CITED: same]
- MDX installed in Phase 1 even though no posts ship — content collection schema includes `**/*.{md,mdx}` so the loader needs MDX integration registered.

### Pattern 2: `src/styles/global.css` (Tailwind v4 CSS-first config)

```css
/* Source: https://tailwindcss.com/blog/tailwindcss-v4 */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Brand tokens — orange + blue accents per FIRM_BRIEF design direction */
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

⚠ Do NOT create `tailwind.config.js` (P1-1 in PITFALLS). Do NOT create `postcss.config.cjs`. Tailwind v4 reads its config from this CSS file via `@theme`.

### Pattern 3: Layout Composition (BaseLayout enforces disclaimers)

```astro
---
// src/layouts/BaseLayout.astro
// Source: ARCHITECTURE.md §4
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
  emitOrgSchema?: boolean; // true on / and /about only (D8)
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

```astro
---
// src/layouts/MarketingLayout.astro
import BaseLayout from './BaseLayout.astro';
const { ...seo } = Astro.props;
---
<BaseLayout {...seo}><slot /></BaseLayout>
```

The placeholder homepage in Phase 1 imports `MarketingLayout` and passes `emitOrgSchema={true}`. The Footer will already render NAP + disclaimers because `BaseLayout` always renders `<Footer />`.

### Anti-Patterns to Avoid

- **Setting `output: 'server'` to "be safe."** Static + per-route `prerender = false` is the correct pattern. Setting server-wide forces every page through the function runtime, hurting cache hit rate. (P0-9.)
- **Hand-rolling a `tailwind.config.js`.** v4 ignores it without an explicit shim; tokens live in `@theme {}` in CSS. (P1-1.)
- **Putting disclaimers in page files.** They go in layouts/Footer so a future page author cannot omit them. (P0-1, FOUND-07.)
- **Hardcoding NAP/bar info in the Footer.** Pull from `src/lib/constants.ts` so JSON-LD and Footer can never drift. (D15, FOUND-04.)
- **Inline scripts before defining a strict CSP.** Either avoid inline scripts entirely OR add `'sha256-...'` hashes to CSP. Phase 1 ships zero JS, so this is easy.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom XML writer | `@astrojs/sitemap` | Auto-derives from `site` + routes; handles index file split |
| TLS certs / domain | Manual cert install | Vercel auto Let's Encrypt | Zero config once domain is added in Vercel dashboard |
| HTTP security headers | Express middleware | `vercel.json` headers block | Single declarative file; applies to every response including static assets |
| Banned-words lint | Generic ESLint plugin | Tiny purpose-built script (`scripts/banned-words.mjs`) that greps content collections + .astro pages | Specific banned vocabulary list (D14) is ours; CI just needs `grep -nE` with exit code |
| Lighthouse perf budget | Custom Puppeteer | `@lhci/cli` with `.lighthouserc.json` | Standard tool, GitHub Action exists, has assertion config |
| Secret scanning | Custom regex | `gitleaks/gitleaks-action@v2` | Maintained ruleset; scans full PR diff |
| Link check | Custom crawler | `linkinator` | Drops in; reads built `dist/` |
| Email validation | Regex in form | Zod (`z.string().email()`) | Phase 4 concern; install pattern now |
| CSS purging | Manual content array | Tailwind v4 auto (respects `.gitignore`) | Don't `.gitignore` `src/`. (P2-4 nuance: avoid dynamic class concatenation.) |
| Image optimization | Manual srcset | `astro:assets` `<Image />` | Phase 1 has at most a logo; still use `<Image />` for it |

**Key insight:** Every "tiny" piece of infrastructure already has a standard tool. The non-developer maintenance pitfall (M-1 through M-5 in PITFALLS) is real — the more we hand-roll, the more brittle the site becomes when Claude Code returns 6 months later with no memory.

---

## Common Pitfalls

### Pitfall 1: `@astrojs/tailwind` instead of `@tailwindcss/vite`
**What goes wrong:** Build fails with "Cannot apply unknown utility class" or styles silently missing. (P1-1.)
**Why it happens:** Old tutorials and blog posts (pre-Tailwind v4) recommend `@astrojs/tailwind`. The deprecation is recent.
**How to avoid:** Always use `npx astro add tailwind` on Astro 6; verify `vite.plugins: [tailwindcss()]` in `astro.config.mjs`; verify NO `@astrojs/tailwind` in `package.json`.
**Warning sign:** Presence of `tailwind.config.js` or `postcss.config.cjs` in the repo.

### Pitfall 2: `output: 'server'` set without need
**What goes wrong:** Vercel deploys every route as a function; CDN caching is bypassed; cold starts on simple HTML; perf budget breached. (P0-9.)
**Why it happens:** Older Astro guides recommended `'server'` whenever an adapter was present.
**How to avoid:** Use `output: 'static'`. Plan to add `export const prerender = false;` only to `src/pages/api/contact.ts` in Phase 4.
**Warning sign:** Vercel dashboard shows a function for every route after deploy.

### Pitfall 3: `site` not set before first deploy
**What goes wrong:** Sitemap generates `localhost:3000` URLs; canonical tags wrong; OG previews broken; Google indexes the wrong domain. (SUMMARY item #3.)
**How to avoid:** Set `site: 'https://scopalfirm.com'` in `astro.config.mjs` before the first push to `main`.

### Pitfall 4: Secrets committed to repo
**What goes wrong:** Even if rotated, the secret is permanent in git history. (P0-8.)
**How to avoid:** `.gitignore` lists `.env`, `.env.local`, `.env.*.local`, `dist/`, `.vercel/` from the very first commit. gitleaks runs on every PR. `.env.example` is the only env file ever committed.
**Warning sign:** A file like `.env.production` or any `*.key` showing up in `git status`.

### Pitfall 5: CSP that breaks the site
**What goes wrong:** A too-strict CSP blocks Vercel Web Analytics, fonts, or the inline JSON-LD `<script>`. Site loads but with console errors and broken features.
**Why it happens:** Authors copy a "secure" CSP from a generic guide without accounting for `application/ld+json` script tags (allowed by `script-src 'self'` in modern browsers because they have a non-executable `type`) and Vercel's analytics endpoint.
**How to avoid:** Use the CSP recommended in §5 below (allows `'self'`, `vitals.vercel-insights.com`, and `va.vercel-scripts.com`). Test in Vercel preview before promoting to production.
**Warning sign:** Browser DevTools console showing "Refused to load…" or "Refused to execute inline script".

### Pitfall 6: WCAG failures on the placeholder
**What goes wrong:** Even a one-line placeholder homepage can fail axe-core (missing `<h1>`, low contrast on a "Coming soon" message, no skip-to-content link, no `<main>` landmark). CI blocks merge of the very first PR.
**How to avoid:** Placeholder homepage has: a single `<h1>`, a `<main>` element (provided by BaseLayout), correct color contrast (test in browser), `lang="en"` on `<html>`, descriptive `<title>`.

### Pitfall 7: NAP drift
**What goes wrong:** Footer says "Annandale, NJ"; JSON-LD says "Annandale, New Jersey"; future GBP says "Annandale Township, NJ". AI engines stop citing. (P1-4 / SUMMARY §6.)
**How to avoid:** All three (footer, JSON-LD, future GBP) read from `src/lib/constants.ts`. Phase 1 establishes this discipline.

### Pitfall 8: Vercel build cache stale across major upgrades
**What goes wrong:** A future Astro/Tailwind upgrade builds against cached old artifacts; deploy ships broken HTML. (P2-6.)
**How to avoid:** Document in the post-deploy checklist: "After major-version upgrades, Redeploy → Clear Build Cache once."

### Pitfall 9: Custom domain TLS not propagated
**What goes wrong:** Domain points to Vercel but cert provisioning is pending; visitors see browser warning. Brief window after first DNS cutover.
**How to avoid:** Add the domain in Vercel BEFORE updating registrar DNS. Vercel pre-provisions the cert, then DNS cutover is instant. Verify `https://scopalfirm.com/` returns 200 with valid TLS before announcing.

---

## Code Examples

### Example A: `vercel.json` (Phase 1 final form)

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

**CSP rationale (per directive):**
- `default-src 'self'` — fall-through deny
- `script-src 'self' https://va.vercel-scripts.com` — Vercel Web Analytics loads from this origin [CITED: vercel.com/docs/analytics]
- `style-src 'self' 'unsafe-inline'` — Astro emits scoped `<style>` blocks at build (these are inline). Acceptable because Astro generates them, not user input.
- `img-src 'self' data: https:` — `data:` for SVG inline icons, `https:` for future Vercel image-optimized URLs
- `font-src 'self'` — self-hosted only (D10)
- `connect-src 'self' https://vitals.vercel-insights.com` — Web Vitals beacon
- `frame-ancestors 'none'` — together with X-Frame-Options=DENY, kills clickjacking
- `form-action 'self'` — Phase 4 contact form posts to same origin
- `object-src 'none'` — no Flash/embed
- `upgrade-insecure-requests` — belt-and-suspenders with HSTS
**HSTS:** `max-age=63072000; includeSubDomains; preload` matches FOUND-02 exactly. Submit the domain to https://hstspreload.org once stable.

[ASSUMED] The CSP allows Vercel Web Analytics from `va.vercel-scripts.com` and `vitals.vercel-insights.com` based on Vercel's published analytics integration. Confirm against current Vercel docs at deploy time if analytics requests are blocked.

### Example B: `src/lib/constants.ts`

```ts
// src/lib/constants.ts
// SINGLE SOURCE OF TRUTH for firm NAP, bar admissions, social URLs.
// Consumed by Footer, JSON-LD, contact confirmation (Phase 4), and any future page.
// Source: FIRM_BRIEF.md, STATE.md D9/D15/D17

export const FIRM = {
  legalName: 'Scopal Firm, LLC',
  shortName: 'Scopal Firm',
  url: 'https://scopalfirm.com',
  email: 'scott@scopalfirm.com',          // confirm before launch
  phone: null as string | null,            // Q2: no published phone v1
  address: {
    streetAddress: null as string | null,  // Q1: deferred — locality+region only
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
    'This website is not intended to solicit clients in jurisdictions where the firm’s attorneys are not licensed.',
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

export const ATTORNEYS = {
  'scott-palmer': {
    name: 'Scott A. Palmer',
    role: 'Principal Attorney',
    isAttorney: true,
    barAdmissions: [
      { state: 'Maryland', year: 2009, status: 'active' },
      { state: 'New Jersey', year: 0,    status: 'pending' },
    ] as BarAdmission[],
  },
} as const;

export const SOCIAL = {
  linkedinScott: null as string | null,    // confirm before launch
  linkedinFirm:  null as string | null,
} as const;

// Banned vocabulary (D14) — used by scripts/banned-words.mjs
export const BANNED_TERMS = [
  'specialist', 'specializing in', 'expert', 'experts',
  'the best', '#1', 'leading', 'top-rated', 'super lawyer',
] as const;
```

### Example C: `content.config.ts` (Astro 6 root path)

```ts
// content.config.ts
// Astro 6 path: repo root, NOT src/content/config.ts (legacy)
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.literal('scott-palmer'),     // FIRM_BRIEF: every post by Scott
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

Phase 1 ships these collections **empty** (only `.gitkeep` files inside `src/content/blog/`, `practice-areas/`, `team/`). The build will succeed with empty collections. Phase 3/4 populate them.

### Example D: `.github/workflows/ci.yml` (skeleton)

```yaml
# .github/workflows/ci.yml
# Source: composed from official action docs; runs on every PR
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
        with: { fetch-depth: 0 }   # gitleaks needs history

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

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "banned-words": "node scripts/banned-words.mjs",
    "linkcheck": "linkinator dist --silent --skip 'mailto:|tel:'",
    "a11y": "astro preview & sleep 3 && axe http://localhost:4321 --exit; kill %1"
  }
}
```

⚠ The `a11y` script pattern (background preview + axe) works on macOS/Linux. For CI reliability, consider `start-server-and-test` (`npm i -D start-server-and-test`) — note this for the planner.

### Example E: `scripts/banned-words.mjs`

```js
#!/usr/bin/env node
// Greps src/ for banned vocabulary (D14). Exits non-zero on hit.
// Source: PITFALLS P0-3, .planning/research/SUMMARY.md D14
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { BANNED_TERMS } from '../src/lib/constants.ts'; // run via tsx in CI, or duplicate the list

// (Implementation: walk src/**/*.{astro,md,mdx,ts}, regex-test each banned term, print line:col on hit.)
```

The planner can decide whether to run this via `tsx` (TS-aware) or duplicate the banned list as plain JSON. Either works; tsx is cleaner.

### Example F: `.lighthouserc.json`

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
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }]
      }
    }
  }
}
```

### Example G: `.gitignore` (Phase 1)

```
# build
dist/
.astro/
.vercel/

# dependencies
node_modules/

# secrets — NEVER commit
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# editors
.vscode/
.idea/
```

### Example H: `.env.example`

```bash
# .env.example — documents every env var; commit to git WITHOUT VALUES
# Phase 1: no values required; vars below are stubs for later phases.

# Phase 4 (contact form):
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` plugin | Tailwind v4 (Jan 2025) | Required migration; old integration deprecated |
| `tailwind.config.js` | `@theme {}` block in CSS | Tailwind v4 | All theme tokens in CSS; faster builds |
| `src/content/config.ts` | `content.config.ts` at repo root | Astro 5 → 6 | Old path still works (legacy); use new path |
| `output: 'hybrid'` | `output: 'static'` + per-route `prerender = false` | Astro 5+ | `'hybrid'` removed as a name; same behavior is now opt-in per route |
| Schema.org `Attorney` type | `Person` + `worksFor` to `LegalService` | Schema.org deprecation | Use `Person` even on Phase 1 if any bio appears |
| `@tailwind base; @components; @utilities;` | `@import "tailwindcss";` | Tailwind v4 | One line; required |

**Deprecated/outdated:**
- `@astrojs/tailwind` — do not install
- `postcss.config.cjs` for Tailwind v3 — delete if present
- `output: 'hybrid'` as a config value — name removed; static + per-route is the replacement
- `@astro/content` dynamic `slug` field — Astro 6 uses `id` directly on glob-loaded entries

---

## Walking Skeleton — Thinnest Viable Phase 1

**The goal: deliver one PR that, when merged, results in `https://scopalfirm.com/` returning a static HTML placeholder served by Vercel with all rails wired.**

The minimum end-to-end vertical slice (in order):

1. **Repo init** — `git init`, `.gitignore`, README, push to `github.com/spalmer47/scopal`.
2. **Astro scaffold** — `npm create astro@latest -- --template minimal --typescript strict`.
3. **Adapter + Tailwind + MDX + Sitemap** — `npx astro add vercel`, `npx astro add tailwind`, `npx astro add mdx`, `npm i @astrojs/sitemap`.
4. **`astro.config.mjs`** — set `site`, `output: 'static'`, register integrations, declare env schema.
5. **`src/lib/constants.ts`** — NAP, bar admissions, banned terms.
6. **`content.config.ts`** + empty content folders (`.gitkeep`).
7. **`BaseLayout.astro` + `Footer.astro` + `FooterDisclaimer.astro`** — disclaimers wired into the layout, NAP/bar pulled from constants.
8. **`SEO.astro` + `LegalServiceSchema.astro`** — emit JSON-LD on home only.
9. **`src/pages/index.astro`** — placeholder: one `<h1>`, one paragraph, no copy work yet.
10. **`vercel.json`** — security headers + asset cache.
11. **`public/robots.txt`** — allow all, reference sitemap, disallow `/api/`.
12. **`.env.example`** + `.gitignore` audit.
13. **CI** — `.github/workflows/ci.yml` with all 5 checks; `scripts/banned-words.mjs`; `.lighthouserc.json`.
14. **Vercel project** — connect GitHub repo, deploy, verify preview URL.
15. **Domain** — add `scopalfirm.com` in Vercel dashboard, verify TLS provisioning, update registrar DNS, verify production URL responds with security headers.

**Deferred to later phases (do NOT do in Phase 1):**

| Item | Phase |
|------|-------|
| Real homepage copy / hero / StoryBrand structure | 2 |
| Practice area pages and content | 3 |
| Attorney bios, headshots, Person JSON-LD on bios | 3 |
| Pricing page | 3 |
| Blog index, blog posts, RSS | 4 |
| Contact form + Astro Action + Resend integration | 4 |
| Legal pages (`/legal/*`) | 4 |
| Full SEO component with per-page OG override | 4 (Phase 1 ships minimum SEO) |
| Per-page-type JSON-LD components beyond `LegalServiceSchema` | 3–4 |
| OG default image | 4 (Phase 1 ships site without; SEO degrades gracefully) |
| `BlogPostLayout` / `PracticeAreaLayout` | 3–4 (stubs OK in Phase 1 if cheap) |

**Phase 1 success demonstration (run all five before declaring done):**

1. `curl -I https://scopalfirm.com/` shows all six security headers including HSTS `max-age=63072000; includeSubDomains; preload`.
2. `curl -s https://scopalfirm.com/sitemap-index.xml` returns valid XML referencing `https://scopalfirm.com/`.
3. View source on the homepage shows footer NAP + attorney advertising line + UPL disclaimer + JSON-LD `LegalService` block.
4. Open a test PR with the word "specialist" added to a page → CI fails on banned-words step. Remove word → CI passes.
5. Push to `main` → Vercel auto-deploys within ~60s.

---

## Runtime State Inventory

> Greenfield phase — no rename/refactor/migration. **Section omitted.**

(For completeness: the project has no prior runtime state. The current `index.html` in the repo is a placeholder that this phase replaces.)

---

## Environment Availability

The Phase 1 plan needs the following toolchain on Scott's machine and in CI:

| Dependency | Required By | Available locally | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build, npm scripts | needs check | ≥ 20 LTS (recommend 22) | Install via [nodejs.org](https://nodejs.org) — explain in plain English before running |
| npm | package install | ships with Node | bundled | — |
| git | version control | likely yes (macOS Xcode CLT) | any recent | `xcode-select --install` |
| GitHub CLI (`gh`) | optional, simplifies repo creation | optional | any | use github.com web UI |
| Vercel CLI | optional, simplifies first deploy | optional | any | use Vercel web UI |
| Browser (Chromium) | Lighthouse CI / axe locally | macOS has Chrome typically | — | CI uses headless Chrome from action |

**Probe commands** (the planner should sequence these as a first task with plain-English explanations per CLAUDE.md C2):

```bash
node --version        # should be v20+ (v22 LTS recommended)
npm --version
git --version
```

**Missing-dependency fallback:** If Node is missing or < 20, install Node 22 LTS from nodejs.org installer (GUI installer; no terminal flags needed). Explain to Scott that Node is the engine that runs Astro locally; without it nothing else works.

[ASSUMED] Scott's macOS already has Xcode Command Line Tools (so `git` is present). Verify on first command — if `git --version` errors, run `xcode-select --install` and walk Scott through the GUI dialog.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None today — Phase 1 introduces CI checks (axe, linkinator, Lighthouse, banned-words, gitleaks) instead of unit tests. No Vitest/Jest in the project yet. |
| Config file | `.lighthouserc.json` (perf budgets); `.github/workflows/ci.yml` (orchestrator) |
| Quick run command | `npm run build && npm run a11y && npm run linkcheck && npm run banned-words` |
| Full suite command | Same as above + `gitleaks detect --source . --no-banner` |
| Phase gate | All five CI checks green on PR; placeholder homepage live at `scopalfirm.com` with security headers verified |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Site builds; deploys to Vercel; auto-deploys on push to `main` | smoke (manual + CI build step) | `npm run build` (CI) + Vercel deploy webhook | ❌ Wave 0 — repo is empty |
| FOUND-02 | All six security headers present on every response | smoke | `curl -I https://scopalfirm.com/ \| grep -E 'Content-Security-Policy\|X-Frame\|HSTS'` (post-deploy verification script) | ❌ Wave 0 |
| FOUND-03 | Secrets cannot be committed | unit (CI) | `gitleaks detect --source . --no-banner` (CI step) | ❌ Wave 0 |
| FOUND-04 | `constants.ts` is the only place NAP appears | manual review + grep audit | `grep -rE 'Annandale\|Maryland.*2009' src/` should only hit `constants.ts` and consumer components | ❌ Wave 0 |
| FOUND-05 | All five CI checks run on every PR | CI integration | Open a draft PR with intentional violation; confirm gate fails | ❌ Wave 0 |
| FOUND-06 | Content collections build with empty folders | unit (build) | `npm run build` succeeds with empty `src/content/{blog,practice-areas,team}/` | ❌ Wave 0 |
| FOUND-07 | A page rendered through `BaseLayout` automatically shows footer disclaimers | unit (build + DOM check) | Build, then `grep -c 'Attorney Advertising' dist/index.html` ≥ 1 | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` + relevant single check (e.g., `npm run banned-words`)
- **Per wave merge:** Full CI run on PR — all five checks
- **Phase gate:** Full CI green + manual `curl -I` verification of all six headers on production + view-source check of footer + JSON-LD before `/gsd-verify-work`

### Wave 0 Gaps

This is a greenfield phase — virtually everything is a Wave 0 gap. The planner should make Wave 0 the bootstrap wave:

- [ ] `package.json` — created by `npm create astro`
- [ ] `astro.config.mjs` — patched by `npx astro add` commands
- [ ] `.github/workflows/ci.yml` — author from scratch (template in Example D)
- [ ] `.lighthouserc.json` — author from scratch (template in Example F)
- [ ] `scripts/banned-words.mjs` — author from scratch (template in Example E)
- [ ] `vercel.json` — author from scratch (template in Example A)
- [ ] `src/lib/constants.ts` — author from scratch (template in Example B)
- [ ] `content.config.ts` — author from scratch (template in Example C)
- [ ] `src/layouts/BaseLayout.astro`, `MarketingLayout.astro` — author from scratch
- [ ] `src/components/layout/{Header,Footer}.astro`, `legal/FooterDisclaimer.astro`, `seo/{SEO,LegalServiceSchema}.astro` — author from scratch
- [ ] `src/pages/index.astro` — placeholder (Phase 2 replaces)
- [ ] `public/robots.txt`, `public/favicon.svg` — author/source
- [ ] `.env.example`, `.gitignore` — author from scratch

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies to Phase 1 | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | yes | Threat model in this section; static-first reduces attack surface |
| V2 Authentication | no | No auth in v1; deferred (no client portal) |
| V3 Session Management | no | Stateless static site |
| V4 Access Control | no (Phase 1) | Phase 4 contact endpoint adds origin/CSRF check + rate limit |
| V5 Input Validation | no (Phase 1) | Phase 4 (Zod re-validation server-side) |
| V6 Cryptography | yes (transport) | TLS via Vercel managed certs; HSTS `max-age=63072000; includeSubDomains; preload` |
| V7 Errors / Logging | partial | Vercel platform logs build/deploy; runtime logs come with Phase 4 |
| V8 Data Protection | yes | No client data collected in Phase 1; secrets in Vercel env only |
| V9 Communication | yes | TLS 1.2+ (Vercel default); HSTS preload |
| V10 Malicious Code | yes | gitleaks in CI; npm `package-lock.json` committed |
| V11 BizLogic | n/a Phase 1 | — |
| V12 Files / Resources | yes | CSP `object-src 'none'`, `base-uri 'self'`; strict CSP discussed above |
| V13 API | n/a Phase 1 | Phase 4 introduces the only API route |
| V14 Config | yes | `vercel.json` security headers; `.env*` gitignored; secrets in Vercel only |

### Known Threat Patterns for Astro+Vercel Static Site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Clickjacking (iframe embed for phishing) | Tampering | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| MIME-type confusion | Tampering | `X-Content-Type-Options: nosniff` |
| TLS strip / downgrade | Information Disclosure | HSTS `max-age=63072000; includeSubDomains; preload`; submit to hstspreload.org |
| XSS via injected `<script>` | Tampering | Strict CSP (`script-src 'self' …`); zero inline JS in Phase 1 |
| Referrer leakage to third parties | Information Disclosure | `Referrer-Policy: strict-origin-when-cross-origin` |
| Privacy-invasive APIs accessed by future scripts | Information Disclosure | `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| Secret leak via committed env file | Information Disclosure | `.gitignore` + gitleaks in CI; secrets only in Vercel dashboard |
| Build-output secret leak | Information Disclosure | Phase 1 verification: `grep -ri 'sk_\|api_key' dist/` returns nothing |
| Supply-chain compromise (malicious npm pkg) | Tampering | `package-lock.json` committed; pin majors; Renovate later |
| Domain takeover / cert mis-issuance | Spoofing | Vercel-managed Let's Encrypt; HSTS preload prevents downgrade attacks during cutover window |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Vercel Web Analytics loads from `va.vercel-scripts.com` and posts to `vitals.vercel-insights.com` | §5 / Example A CSP | Analytics requests blocked; site otherwise fine. Verify against current Vercel docs at deploy. |
| A2 | Scott's macOS has Xcode Command Line Tools installed (so `git` works) | Environment Availability | First command errors with clear message; install dialog appears |
| A3 | Node ≥ 20 LTS is acceptable; Astro 6 supports Node 22 LTS | Environment | If Node ≥ 18 only, Astro 6 still builds (verify per docs); trivial fix |
| A4 | The CSP in Example A is compatible with Astro's scoped `<style>` emission (which produces inline styles, hence `style-src 'unsafe-inline'`) | Example A | Styles silently broken; obvious in browser; `'unsafe-inline'` for styles is industry-standard for Astro sites |
| A5 | The `firm address` defaults to locality+region only (no street) per STATE.md Q1 default | constants.ts | LegalService schema may be marked incomplete by Google; acceptable until Scott decides |
| A6 | The placeholder homepage hits Lighthouse ≥ 90 with default Tailwind + a few paragraphs and no images | Validation | Highly likely true (Astro static + Tailwind purge ships ~5KB CSS, zero JS); if not, perf budget temporarily relaxed for placeholder |
| A7 | `treosh/lighthouse-ci-action@v12` is the current major and supports `configPath` + assertions | CI | If outdated, swap for `@v11` or run `lhci autorun` directly; trivial fix |
| A8 | `gitleaks/gitleaks-action@v2` is current and free for public/private repos | CI | If access rules changed, swap for `zricethezav/gitleaks-action` or run gitleaks binary in a step |
| A9 | The contact form endpoint will be the ONLY route with `prerender = false` (built in Phase 4) | output mode | If a future phase needs another server route, add per-route override; no architectural change |
| A10 | `Annandale, NJ` is the correct locality for the LegalService schema (FIRM_BRIEF says so) | constants.ts | NAP drift; correct in constants and rebuild |

**Assumptions A1, A7, A8 are operational** — they affect Phase 1 deploy mechanics and should be verified by quick web checks during execution, not blocked-on now. **A2, A3 are environmental** — verified by running `node --version` etc. as the first task. **A4–A6, A9, A10 are confirmed by referenced source documents** but called out for transparency.

---

## Open Questions

1. **Should the `.lighthouserc.json` budget gate the placeholder homepage at 90/90/90/90?**
   - What we know: A placeholder homepage trivially passes 90+ on a static Astro page.
   - What's unclear: If Phase 2's real homepage adds a hero image/font that temporarily dips below the budget, do we want the budget enforced from the very first PR or temporarily relaxed?
   - Recommendation: Enforce 90 from Phase 1 PR. Phase 2 must hit budget on real homepage to merge. This is the spirit of FOUND-05.

2. **Pre-commit hooks (Husky / lefthook) — Phase 1 or later?**
   - What we know: CI is the authoritative gate.
   - What's unclear: Whether to add pre-commit too (faster developer feedback).
   - Recommendation: Defer; CI is sufficient for Phase 1. Add later if PR rejection rate becomes annoying.

3. **DNS cutover timing — same PR or follow-up?**
   - What we know: Adding the domain in Vercel pre-provisions the cert.
   - What's unclear: Whether DNS cutover happens within Phase 1 or as a follow-up step.
   - Recommendation: Within Phase 1. The acceptance criteria explicitly say `https://scopalfirm.com/` returns a live page.

4. **`MarketingLayout.astro` — ship in Phase 1 or wait until Phase 2?**
   - What we know: It's a 5-line wrapper around `BaseLayout`.
   - Recommendation: Ship in Phase 1 (cheap; sets the pattern). `BlogPostLayout` and `PracticeAreaLayout` can defer.

5. **Homepage placeholder copy — what does it say?**
   - Recommendation: Two sentences: "Scopal Firm — Business-focused legal support for SaaS companies. New site coming soon. In the meantime, please reach out via [email link]." Keep it deliberately bland; Phase 2 replaces.

6. **OG default image — Phase 1 or Phase 4?**
   - Recommendation: Defer to Phase 4 (when SEO is finalized). SEO component should handle missing `og-default.jpg` gracefully (omit `og:image` if absent — search engines simply don't render a preview, not a failure).

---

## Sources

### Primary (HIGH confidence)
- [Astro Docs — Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/) — `output`, `site`, `env.schema` semantics
- [Astro Docs — Vercel Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/) — adapter options, prerender
- [Astro Docs — Styling & Tailwind](https://docs.astro.build/en/guides/styling/) — `@tailwindcss/vite` is the supported path
- [Astro Docs — Content Collections](https://docs.astro.build/en/guides/content-collections/) — Astro 6 `glob` loader + `content.config.ts`
- [Astro Docs — Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-config from `site`
- [Tailwind v4 Release Notes](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, plugin syntax
- [Vercel Headers Configuration](https://vercel.com/docs/projects/project-configuration#headers) — `vercel.json` schema
- [MDN HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) — preload requirements
- [hstspreload.org](https://hstspreload.org/) — submission requirements (matches FOUND-02 `max-age=63072000`)
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci) — `assertions.preset`, `staticDistDir`
- [gitleaks-action](https://github.com/gitleaks/gitleaks-action) — GitHub Actions integration
- npm registry version checks (verified 2026-05-07): astro 6.3.0; @astrojs/vercel 10.0.6; tailwindcss 4.2.4; @tailwindcss/vite 4.2.4; @astrojs/sitemap 3.7.2; @astrojs/mdx 5.0.4; @tailwindcss/typography 0.5.19; @axe-core/cli 4.11.3; linkinator 7.6.1; @lhci/cli 0.15.1

### Internal (HIGH confidence — project source of truth)
- `.planning/STATE.md` — D1–D17 locked decisions
- `.planning/REQUIREMENTS.md` — FOUND-01..07
- `.planning/research/SUMMARY.md` — cross-cutting decisions, top-10 facts
- `.planning/research/STACK.md` — bootstrap commands, version table, contact form pattern (informs Phase 4)
- `.planning/research/ARCHITECTURE.md` — directory layout, layout hierarchy, JSON-LD strategy
- `.planning/research/PITFALLS.md` — P0/P1/P2 catalog used to derive verification steps
- `.planning/FIRM_BRIEF.md` — firm NAP, attorney info, design direction
- `.planning/LAW_FIRM_WEBSITE_GUIDE.md` — disclaimer language, schema strategy
- `.claude/CLAUDE.md` — project constraints (verbatim in §Project Constraints above)

### Secondary (MEDIUM confidence — community/blog)
- [Astro on Vercel (Vercel docs)](https://vercel.com/docs/frameworks/frontend/astro) — corroborates adapter setup
- [Treosh Lighthouse CI Action](https://github.com/treosh/lighthouse-ci-action) — common GitHub Action wrapper

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against npm registry today
- Architecture: HIGH — fully derived from project research D1–D17
- Pitfalls: HIGH — sourced from PITFALLS.md (already triangulated against official docs)
- CSP exact directives: MEDIUM — the analytics origins (A1) should be verified at deploy
- CI action versions: MEDIUM — A7/A8 noted; verify at execution time

**Research date:** 2026-05-07
**Valid until:** 2026-06-06 (30 days; stack is stable, but check CSP origins and action major versions at execution)
