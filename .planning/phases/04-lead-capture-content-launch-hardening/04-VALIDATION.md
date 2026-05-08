---
phase: 4
slug: lead-capture-content-launch-hardening
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-08
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | @lhci/cli 0.15.1 + @axe-core/cli 4.11.3 + linkinator 7.6.1 |
| **Config file** | `.lighthouserc.json` (exists from Phase 1) |
| **Quick run command** | `npm run banned-words` |
| **Full suite command** | `npm run build && npm run a11y && npx lhci autorun` |
| **Estimated runtime** | ~45 seconds (build) + ~30 seconds (a11y + Lighthouse) |

---

## Sampling Rate

- **After every task commit:** Run `npm run banned-words`
- **After every plan wave:** Run `npm run build` to verify page count + zero errors
- **Before `/gsd-verify-work`:** Full suite must be green (`npm run build && npm run a11y`)
- **Max feedback latency:** 60 seconds (build alone)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| Font files | PERF | 0 | PERF-02 | — | Fonts served from /fonts/ not Google | file-check | `ls public/fonts/*.woff2` | ❌ W0 | ⬜ pending |
| OG image | SEO | 0 | SEO-03 | — | Default OG image exists ≤200 KB | file-check | `ls -lh public/og-default.jpg` | ❌ W0 | ⬜ pending |
| Testimonial/CaseResult components | LEGAL | 0 | LEGAL-04 | — | Build fails without disclaimer prop | build | `npm run build` | ❌ W0 | ⬜ pending |
| Contact action | FORM | 1 | FORM-01..06 | T-4-01..07 | Honeypot, rate limit, CRLF, HTML-escape | manual adversarial | See Manual-Only below | ✅ Astro Actions | ⬜ pending |
| ABA 477R disclaimer | FORM | 1 | FORM-02 | — | Disclaimer above submit button | visual + a11y | `npm run a11y` | ✅ axe-core wired | ⬜ pending |
| Blog index pagination | BLOG | 2 | BLOG-01 | — | Posts render at /blog/ | build | `npm run build && ls dist/blog/` | ❌ W0 post needed | ⬜ pending |
| Draft filtering | BLOG | 2 | BLOG-03 | — | draft:true posts absent from dist/ | build | `npm run build && ! grep -r "draft-slug" dist/` | No | ⬜ pending |
| RSS feed | BLOG | 2 | BLOG-04 | — | /rss.xml parses valid XML | build | `npm run build && node -e "require('fs').readFileSync('dist/rss.xml')"` | ❌ W0 | ⬜ pending |
| SEO component OG | SEO | 2 | SEO-01, SEO-03 | T-4-08 | OG image absolute URL | build | `grep og:image dist/index.html` | ✅ SEO.astro exists | ⬜ pending |
| Legal pages | LEGAL | 2 | LEGAL-01..03 | — | Four /legal/* pages exist | build | `npm run build && ls dist/legal/` | ❌ W0 | ⬜ pending |
| Footer links | LEGAL | 2 | LEGAL-01 | — | Privacy + terms links in footer | build | `grep -l "legal/privacy" dist/index.html` | ❌ | ⬜ pending |
| Security headers | SEC | 3 | SEC-01 | — | CSP, HSTS, X-Frame in vercel.json | file-check | `grep form-action vercel.json` | ✅ | ⬜ pending |
| Credentials audit | SEC | 3 | SEC-02 | T-4-09 | No secrets in dist/ | manual | `grep -r "re_\|sk_" dist/` | No | ⬜ pending |
| Image audit | PERF | 3 | PERF-01 | — | All images via astro:assets | build | `npm run build` | ✅ partial | ⬜ pending |
| Font @font-face | PERF | 0 | PERF-02 | — | @font-face in global.css | file-check | `grep @font-face src/styles/global.css` | ❌ W0 | ⬜ pending |
| Lighthouse all pages | PERF | 3 | PERF-03 | — | Mobile ≥90 across all page types | lighthouse | `npx lhci autorun` | ✅ wired | ⬜ pending |
| Banned words | ALL | after each | D14 | — | No banned vocab in any new content | lint | `npm run banned-words` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `public/fonts/Inter-Regular.woff2` + `Inter-SemiBold.woff2` + `Fraunces-SemiBold.woff2` — covers PERF-02; needed before Lighthouse runs
- [ ] `public/og-default.jpg` (1200×630, ≤200 KB) — covers SEO-03; needed before SEO validation
- [ ] `src/components/legal/Testimonial.astro` (requires `disclaimer` prop) — covers LEGAL-04; build-time enforcement
- [ ] `src/components/legal/CaseResult.astro` (requires `disclaimer` prop) — covers LEGAL-04; build-time enforcement
- [ ] `src/content/blog/when-saas-needs-a-lawyer.mdx` — covers BLOG-05; at least 1 published post must exist for blog index/RSS to render

*Validation infrastructure (@lhci/cli, @axe-core/cli, linkinator, banned-words) already exists from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 7 server-side form controls (FORM-03) | FORM-03 | Adversarial test; cannot auto-run against static build | (1) Fill honeypot field → verify 400 response. (2) Submit form 6 times in <1 hour from same IP → verify 6th is rejected. (3) Set `name` to `foo\r\nBcc:evil@x.com` → verify Zod CRLF rejection. (4) Set `description` to `<script>alert(1)</script>` → verify HTML-escaped in email. (5) Verify From/Subject are fixed strings, not user-supplied. |
| Contact form HTML fallback (FORM-04) | FORM-04 | Requires server; static build can't test POST path | Disable JS in browser; submit form → verify redirect to /contact/thank-you still works. |
| Email delivery to Scott (FORM-05) | FORM-05 | Requires real Vercel deployment + provider API key | Submit form on Vercel preview URL; verify Scott receives email at scott@scopalfirm.com |
| Google Rich Results Test (SEO-05) | SEO-05 | Requires live URL | Submit scopalfirm.com/* URLs to search.google.com/test/rich-results for Article, LegalService, Person, FAQPage |
| Contact page Lighthouse (PERF-03) | PERF-03 | `/contact` is server-rendered; static build can't Lighthouse it | Run Lighthouse manually against Vercel preview URL for /contact |

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 deps
- [x] Sampling continuity (no 3 consecutive tasks without automated verify)
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s

**Approval:** 2026-05-08
