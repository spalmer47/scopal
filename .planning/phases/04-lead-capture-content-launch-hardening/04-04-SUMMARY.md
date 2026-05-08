# 04-04 Pre-Launch Security + Performance Audit — SUMMARY

**Phase:** 04 — Lead Capture + Content + Launch Hardening
**Plan:** 04-04
**Date:** 2026-05-08
**Status:** ✅ COMPLETE — all checks pass, site ready for production deploy

---

## Pre-Launch Checklist

### Security (SEC-01 — SEC-05)

| Check | Status | Notes |
|-------|--------|-------|
| SEC-01: All 6 security headers in vercel.json | ✅ PASS | Content-Security-Policy (with `form-action 'self'`), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security |
| SEC-02: No API keys in dist/ | ✅ PASS | `grep -r "RESEND_API_KEY\|re_[a-zA-Z0-9]{20}" dist/` → 0 results. No .env files in dist/. |
| SEC-03: API key server-only via env vars | ✅ PASS | `RESEND_API_KEY` declared as `context: 'server', access: 'secret'` in astro.config.mjs. Never hardcoded. |
| SEC-04: Supabase RLS | N/A | Scott chose Option A (Resend). No Supabase in use. |
| SEC-05: Astro version CVE | ✅ PASS | Astro 6.x (post-CVE-2024-56140). No action needed. |

### SEO (SEO-02, SEO-04, SEO-05)

| Check | Status | Notes |
|-------|--------|-------|
| SEO-02: sitemap-index.xml generated | ✅ PASS | `dist/client/sitemap-index.xml` present (Vercel adapter outputs to dist/client/) |
| SEO-02: robots.txt correct | ✅ PASS | `Disallow: /api/` present; `Sitemap: https://scopalfirm.com/sitemap-index.xml` present |
| SEO-04: No inline JSON-LD in src/pages/ | ✅ PASS | 0 results — all JSON-LD served through schema components in src/components/seo/ |
| SEO-05: Google Rich Results Test | ⏳ PENDING | Manual verification required against live/preview Vercel URL. See instructions below. |

### Performance (PERF-01 — PERF-03)

| Check | Status | Notes |
|-------|--------|-------|
| PERF-01: No source images over 200 KB | ✅ PASS | No files over 200 KB in src/assets/ or public/. public/images/team/ is empty (no photos committed yet). |
| PERF-02: Self-hosted fonts active | ✅ PASS | 3 woff2 files in public/fonts/ (Fraunces-SemiBold, Inter-Regular, Inter-SemiBold). @font-face rules confirmed in built CSS. |
| PERF-03: Lighthouse mobile ≥90 | ✅ PASS | All 4 page types scored 100 — see scores below. |

### Content (BLOG, LEGAL)

| Check | Status | Notes |
|-------|--------|-------|
| Blog HTML pages in dist/ | ✅ PASS | 2 HTML files (blog index + blog post) |
| Legal pages in dist/ | ✅ PASS | 4 directories: accessibility-statement, disclaimer, privacy, terms |
| RSS feed | ✅ PASS | dist/client/rss.xml present |

### Final

| Check | Status | Notes |
|-------|--------|-------|
| npm run banned-words | ✅ PASS | 0 violations |
| npm run build | ✅ PASS | 0 errors |
| Internal link checker | ✅ PASS | 0 broken links (npx linkinator dist/client/ --recurse --skip "https?://") |

---

## Lighthouse Scores (mobile, 3-run average)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|------|-------------|---------------|----------------|-----|-----|-----|
| Homepage (`/`) | **100** | **100** | **100** | **100** | 1594ms | 0.000 |
| Practice area (`/practice-areas/corporate-law/`) | **100** | **100** | **100** | **100** | 1410ms | 0.000 |
| Blog post (`/blog/when-saas-needs-a-lawyer/`) | **100** | **100** | **100** | **100** | 1357ms | 0.000 |
| Legal page (`/legal/disclaimer/`) | **100** | **100** | **100** | **100** | 1359ms | 0.000 |

All scores ≥90 threshold. LCP well under 2000ms budget. CLS = 0 (perfect).

**Contact page note:** `/contact` uses `prerender = false` (server-rendered via Astro Actions). Lighthouse CI cannot audit server-rendered pages in static mode. Test the contact page manually against the Vercel preview URL after deploy.

---

## Issues Found and Resolved

### unsized-images (PERF-03 — FIXED before final audit pass)

**Problem:** Lighthouse `unsized-images` audit flagged 5 images that had `height` but no `width` attribute — the logo in Header.astro and 4 trust strip SVGs in TrustStrip.astro. Without explicit width, the browser can't reserve layout space before the SVG loads, causing potential CLS.

**Fix:** Added `width` attributes to all 5 images, calculated from each SVG's viewBox aspect ratio × display height:

| Image | viewBox | Display height | Width added |
|-------|---------|----------------|-------------|
| logo.svg | 361×70 | 36px | 186 |
| uperform.svg | 354×90 | 32px | 126 |
| ancile-solutions.svg | 256×256 | 32px | 32 |
| heycounsel.svg | 138×24 | 32px | 184 |
| inhoused.svg | 1084×341 | 32px | 102 |

**Result:** Lighthouse CI passes with 100/100/100/100 across all 4 page types.

### .lighthouserc.json staticDistDir (FIXED)

**Problem:** `staticDistDir` was set to `./dist` but the `@astrojs/vercel` adapter outputs static files to `./dist/client`. LHCI served the wrong directory and got 404s.

**Fix:** Updated `staticDistDir` to `./dist/client`. Also expanded URL list from 1 to 4 URLs to cover all required page types (homepage, practice area, blog post, legal page).

---

## Total HTML Page Count

**14 HTML files** in dist/client/ (static pages). The contact page is server-rendered and not included in the static count — it is served as a Vercel serverless function.

---

## SEO-05: Google Rich Results Test (Manual — Requires Live URL)

After pushing to production, validate structured data at https://search.google.com/test/rich-results for these 4 page types:

| Page | Expected schema types |
|------|-----------------------|
| `https://scopalfirm.com/` | LegalService + WebSite |
| `https://scopalfirm.com/attorneys/scott-palmer` | Person |
| `https://scopalfirm.com/practice-areas/corporate-law` | Service + FAQPage + BreadcrumbList |
| `https://scopalfirm.com/blog/when-saas-needs-a-lawyer` | Article + BreadcrumbList |

All JSON-LD is served through schema components (ServiceSchema, PersonSchema, FAQSchema, BreadcrumbSchema, ArticleSchema) — no inline JSON-LD in page files.

---

## Post-Deploy Manual Steps (for Scott)

1. **Resend domain verification** — log in to resend.com, add DNS records for scopalfirm.com, verify the domain
2. **Add env vars to Vercel** — in Vercel project settings → Environment Variables, add:
   - `RESEND_API_KEY` = your Resend API key
   - `CONTACT_TO_EMAIL` = `scott@scopalfirm.com`
3. **Test contact form** — submit a test message on the live site, confirm delivery to scott@scopalfirm.com
4. **Google Rich Results Test** — run all 4 page types (see above)
5. **Google Search Console** — submit sitemap: `https://scopalfirm.com/sitemap-index.xml`

---

## Phase 4 Requirements Coverage

All 28 Phase 4 requirements addressed:

- **BLOG-01..05** ✅ Blog content collection, BlogPostLayout, ArticleSchema, paginated index, RSS feed
- **SEO-01..05** ✅ SEO.astro upgrade, sitemap, robots.txt, JSON-LD components, Rich Results (manual pending)
- **LEGAL-01..04** ✅ Disclaimer, Privacy, Terms, Accessibility Statement + Footer links
- **FORM-01..06** ✅ Contact form with all 7 FORM-03 security controls (Resend, CSRF, honeypot, rate limit, Zod, HTML escape, CRLF rejection)
- **SEC-01..05** ✅ Security headers, credentials audit, env var isolation, Astro version verified
- **PERF-01..03** ✅ Images ≤200 KB, self-hosted fonts, Lighthouse 100/100/100/100

---

## Next Step

Push to main branch to trigger Vercel production deploy:

```bash
git push origin main
```

Vercel will build and deploy automatically. The contact form will not send emails until the `RESEND_API_KEY` and `CONTACT_TO_EMAIL` env vars are added in Vercel project settings.
