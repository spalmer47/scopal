# Scopal Firm, LLC — Website Project

This project is building a law firm website for Scopal Firm, LLC, a Corporate Law /
Outside General Counsel / Legal Executive Coaching firm based in Annandale, NJ.
The person working on this project is a practicing attorney with no coding background.

---

## How to Communicate

Treat every technical concept as if you're explaining it for the very first time.
Specifically:

- **Before running any command**, explain in one sentence what it does and why
- **When errors occur**, explain what went wrong in plain English before attempting to fix it
- **When introducing a new tool or concept**, give a simple real-world analogy
- **Keep explanations short** — one concept at a time, not a wall of context
- **Never assume prior knowledge** of code, terminal commands, file structures, or web development

---

## Always Read Before Starting Work

At the beginning of every session, read these files:

- `.planning/FIRM_BRIEF.md` — the firm's complete profile, team, clients, and positioning
- `.planning/LAW_FIRM_WEBSITE_GUIDE.md` — best practices for law firm websites (SEO, AEO, conversion, disclaimers, StoryBrand)

Every content, copy, and SEO decision should be consistent with these documents.

---

## Tech Stack — Already Decided

Do not suggest alternatives to the core stack:

- **Astro 6** — builds the site
- **Tailwind CSS v4** — styles it
- **GitHub** — version control (https://github.com/spalmer47/scopal)
- **Vercel** — deployment and hosting

**Contact form integration is TBD.** When GSD reaches the contact form phase,
present Scott with his options (e.g. Supabase + Resend, Formspree, Netlify Forms,
direct email via SMTP, CRM webhook). Ask what he currently uses to manage client
intake — the right tool depends on his existing workflow. Do not assume Supabase or Resend.

---

## Non-Negotiables

These are not optional and must be implemented on every relevant page:

- Attorney-client disclaimer on the contact form
- Disclaimer in the footer on every page
- Disclaimer on every blog post
- Disclaimer on every practice area page
- Each practice area on its own URL (e.g., /practice-areas/corporate-law)
- Every blog post attributed to Scott Palmer
- No image committed to the repo larger than 200 KB
- JSON-LD structured data on every page (LegalService, Person, Article as appropriate)

Security requirements (must be addressed in a dedicated security phase):

- HTTP security headers in `vercel.json` (Content-Security-Policy, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- All API keys in Vercel environment variables only — never in source code or git
- `.env` files listed in `.gitignore` — never committed
- Supabase Row Level Security enabled on all tables (if Supabase is chosen)
- Server-side input validation on all form submissions
- Honeypot spam protection on the contact form
- Built output (`dist/`) verified to contain no exposed credentials
- ABA Formal Opinion 477R: attorney obligation to protect pre-engagement
  client communications applies to this contact form and lead storage system

---

## Copy Principles

All website copy follows the StoryBrand framework:
- The CLIENT is the hero, not the firm
- Lead with the client's problem, not the firm's credentials
- Position Scopal as the trusted guide with a clear plan
- Every section has one job: move the visitor toward getting in touch

Key messaging angles to weave in:
- Having a lawyer available consistently is cheaper than calling one only in a crisis
- Scott brings GC-level judgment (7+ years as in-house GC) at a fraction of law firm cost
- Long-term client relationships are a core value — the longer Scott knows your business,
  the better lawyer he becomes for you
- The firm is AI-native — faster, smarter service than a traditional practice

---

## Decision Log

When making significant decisions during the build, add an entry to
`.planning/DECISIONS.md` with: what was decided, why, and the teaching insight.
This file is course documentation for the HeyCounsel community.
