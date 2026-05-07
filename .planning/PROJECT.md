# Scopal Firm Website

## What This Is

A professional law firm website for Scopal Firm, LLC — a fully remote, AI-native fractional General Counsel practice based in Annandale, NJ. The site is the primary vehicle for converting referral-only business into inbound leads from US-based SaaS companies seeking their first in-house legal role. Built on Astro + Tailwind, deployed via Vercel, copy follows the StoryBrand framework.

## Core Value

A SaaS founder lands on the site, immediately recognizes their situation ("this is for me"), understands the value of a dedicated legal partner vs. reactive law firm billing, and gets in touch.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

- [ ] Site scaffold with Astro 6 + Tailwind CSS v4, deployed to Vercel
- [ ] Homepage with StoryBrand-structured copy converting SaaS visitors into leads
- [ ] Practice area pages (Corporate Law, Outside GC / Fractional GC, Legal Executive Coaching)
- [ ] Attorney bio page for Scott A. Palmer
- [ ] Team/staff page including Rachel Palmer
- [ ] Pricing / engagement model page (subscriptions from $4,500/mo + project flat fees)
- [ ] Contact form with attorney-client disclaimer, server-side validation, spam protection
- [ ] Blog system with per-post attorney attribution and legal disclaimers
- [ ] SEO foundation: JSON-LD structured data, meta tags, sitemap, robots.txt
- [ ] Legal disclaimers on all relevant pages (footer, contact, practice areas, blog)
- [ ] Security hardening: HTTP headers, secrets management, ABA 477R compliance
- [ ] Performance: sub-3s load, Lighthouse 90+, images optimized

### Out of Scope

- Client portal / authenticated area — not needed for v1
- CMS / headless CMS — Astro content collections handle blog without external CMS
- Multi-language support — English only
- E-commerce / payment processing — inquiry-based firm, not transactional

## Context

- **Existing site:** https://scopalfirm.com — single-page, blue/white, "Business Focused Legal Support" tagline; new site replaces it
- **Visual reference:** https://newfangled.legal — retro-modern, approachable, personality-driven; not stuffy law firm
- **Color direction:** Orange and blue accents on a clean, modern base
- **Headshots:** Professional headshots ready for Scott and Rachel
- **Audience:** US SaaS companies (early-to-mid stage) who are paying too much for reactive law firm support and want a dedicated legal partner
- **Primary acquisition problem:** 100% referral today; site is the mechanism to change that
- **Key conversion insight:** Proactive legal support is cheaper than reactive — this must be communicated clearly and early
- **Tone:** Small but mighty, AI-native, casual but business-minded, approachable and direct

## Constraints

- **Tech Stack**: Astro 6 + Tailwind CSS v4 + GitHub + Vercel — non-negotiable, already decided
- **Bar Admission**: Maryland (2009); NJ pending — site must reflect current admission status accurately
- **Legal Compliance**: ABA Formal Opinion 477R governs pre-engagement communications via web form; contact form and lead storage must comply
- **Image Size**: No image >200 KB committed to repo
- **Security**: HTTP headers, no secrets in code, RLS on DB tables — mandatory before launch
- **Content**: Attorney-client disclaimers required on contact form, footer, all blog posts, all practice area pages

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 6 + Tailwind v4 | Fast static output, SEO-optimized, Claude-legible code | ✓ Confirmed in setup |
| Vercel for hosting | Auto-deploy on push, env var management, free tier covers needs | ✓ Confirmed in setup |
| StoryBrand copy framework | Client-as-hero converts better than credentials-first for law firms | — Pending |
| Contact form backend TBD | Depends on Scott's intake workflow; options reviewed at that phase | — Pending |

---
*Initialized: 2026-05-07 from FIRM_BRIEF.md via /hc-firm-site:setup + /gsd-new-project --auto*
