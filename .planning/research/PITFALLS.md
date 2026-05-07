# Domain Pitfalls

**Domain:** Law firm website (Scopal Firm, LLC) — Astro 6 + Tailwind CSS v4 on Vercel, maintained by a non-developer attorney via Claude Code
**Researched:** 2026-05-07
**Overall confidence:** MEDIUM-HIGH (HIGH for ABA/ADA/Astro/Tailwind, MEDIUM for state-specific bar rules — must verify against the firm's licensing state)

---

## Severity Legend

- **P0 — Launch blocker.** Do not ship without addressing. Bar discipline, lawsuit, security incident, or broken site.
- **P1 — Serious.** Fix before scaling traffic. Hurts rankings, conversion, or maintainability.
- **P2 — Should fix.** Polish issues; address opportunistically.

---

## P0 — Critical Pitfalls (Launch Blockers)

### P0-1: Missing or Misplaced Attorney-Client Disclaimer

**Domain:** Legal compliance
**Failure mode:** Site implies an attorney-client relationship is formed by browsing, emailing, or submitting the contact form. A user sends confidential information believing they're protected; the firm is later disqualified from a matter or sued for breach of duty.
**Why it happens:** Generic web templates use "Contact Us" forms with no warning text. Attorneys assume "everyone knows" no relationship exists yet.
**Prevention:**
- Add an explicit disclaimer at every entry point that could elicit confidential info: contact form (above the submit button AND in confirmation page), email mailto links, footer.
- Required language pattern: "Submitting this form does not create an attorney-client relationship. Do not send confidential or time-sensitive information through this form." The attorney-client relationship is formed only after a written engagement agreement is signed.
- Place near the action, not buried in footer fine print.
**Detection:** Audit every form, every mailto link, every "contact" CTA before launch.

### P0-2: Past Results / Testimonial Disclaimer Missing or Weak

**Domain:** Legal compliance (ABA Model Rule 7.1; state-specific)
**Failure mode:** Page lists case wins ("$2M settlement") or client quotes without the required disclaimer. Bar grievance filed; ad deemed misleading under Rule 7.1.
**Why it happens:** Marketing impulse to lead with results; copy-pasted from non-lawyer template.
**Prevention:**
- Every testimonial and every past-result statement requires: "Past results do not guarantee a similar outcome." (NY-style language is broadly safe.)
- Place the disclaimer adjacent to the result/testimonial — same visual block, comparable font size — NOT in the footer.
- For California-licensed firms: use "this testimonial or endorsement does not constitute a guarantee, warranty, or prediction regarding the outcome of your legal matter."
- For Florida-licensed firms: past results and testimonials must be gated behind an acknowledgment overlay before display. If the firm is FL-licensed, a simple inline disclaimer is NOT sufficient.
- Build a `<TestimonialCard>` and `<CaseResult>` component that REQUIRES a disclaimer prop — make it impossible to render without one.
**Detection:** Lint check / component-level prop validation. Bar association website review services.

### P0-3: "Specialist" / "Expert" / "Best" / "Super Lawyer" Claims Without Certification

**Domain:** Legal compliance (ABA Model Rule 7.4 + state rules)
**Failure mode:** Bio says "specialist in family law" without state-board certification. Headline says "Best DUI Lawyer in [City]" without a verifiable basis. Both are per-se misleading under Rule 7.1/7.4 and many state rules.
**Why it happens:** SEO advice often pushes superlatives; attorneys think the term is colloquial.
**Prevention:**
- Banned vocabulary list enforced in copy: "specialist," "specializing in," "expert," "the best," "#1," "leading," "top-rated" (unless tied to a verifiable third-party rating with the source named).
- Permitted alternatives: "focuses on," "practice concentrated in," "represents clients in," "experienced in."
- If the attorney IS board-certified, the certifying body MUST be named immediately adjacent to the claim.
- "Super Lawyers" / "Best Lawyers" listings are permitted in most states ONLY if the year and selecting organization are named, and a disclaimer notes that no aspect of the advertisement has been approved by the state bar (FL/NJ specifically require this).
**Detection:** Grep the entire content corpus for the banned terms before launch and on every content edit.

### P0-4: Jurisdictional Practice Disclaimer Missing

**Domain:** Legal compliance / unauthorized practice of law (UPL)
**Failure mode:** A national-looking site reaches a visitor in a state where the attorney isn't licensed; visitor relies on content as advice; firm faces UPL exposure or duty-to-warn issues.
**Prevention:**
- Footer disclaimer naming the states of licensure: "Scopal Firm, LLC attorneys are licensed to practice law in [STATE(S)]. This website is not intended to solicit clients in jurisdictions where the firm's attorneys are not licensed."
- Identify a "Responsible Attorney" by name and bar number on the site (required in TX, FL, others).
- Include the firm's principal office address (required in many states for any "advertisement").

### P0-5: Contact Form Email Header Injection

**Domain:** Security
**Failure mode:** Attacker submits a `name` or `email` field containing `\r\n` followed by `Bcc: spamlist@example.com`. Form handler concatenates into mail headers; SMTP server now relays spam from the firm's domain. Domain gets blacklisted; client emails stop being delivered.
**Why it happens:** Form handler passes user input directly into `from`/`replyTo`/`subject` headers without sanitization. Older Nodemailer (<6.6.1) had this bug as a CVE (CVE-2021-23400).
**Prevention:**
- Reject any input containing `\r`, `\n`, or `%0A`/`%0D` before it reaches the mail library.
- Never put user input in `From:` or `Subject:` headers — use fixed values; put user content in the body only.
- Use a transactional email API (Resend, Postmark, SendGrid) instead of raw SMTP — they handle header validation.
- Pin Nodemailer >= 6.6.1 if used.
**Detection:** Submit a test payload with embedded CRLF + `Bcc:` header during QA. Confirm only the intended recipient receives the message.

### P0-6: Contact Form Has No Server-Side Validation

**Domain:** Security
**Failure mode:** Client-side `required` and regex are bypassed by a script POSTing directly to the API route. Garbage submissions, XSS payloads stored in inboxes, attackers using the form as an outbound spam relay.
**Prevention:**
- All validation duplicated server-side in the Astro API route (`src/pages/api/contact.ts`). Use Zod or a similar schema.
- Reject if email is malformed, body > N kilobytes, fields missing, or honeypot field is filled.
- Return generic error messages — don't echo input back into HTML responses (XSS risk).

### P0-7: Contact Form Has No Rate Limiting / Bot Protection

**Domain:** Security
**Failure mode:** Form is hammered with thousands of submissions per minute. Inbox unusable; transactional email quota exhausted; legitimate inquiries lost.
**Prevention:**
- Honeypot field (hidden input that humans don't fill, bots do) — first line of defense, zero-friction.
- Cloudflare Turnstile or hCaptcha on the form (Turnstile is invisible by default and free).
- Server-side rate limit per IP — Vercel KV or Upstash Redis with a token bucket. Suggested: 5 submissions per IP per hour.
- Log submission metadata (IP, timestamp, user-agent) so abuse patterns are diagnosable.

### P0-8: Secrets Committed to Repository

**Domain:** Security / maintenance
**Failure mode:** Resend API key, SMTP password, or analytics token committed to GitHub. Bot scrapes within hours; firm pays for someone else's email volume; abuse from firm's domain reputation.
**Why it happens:** Non-developer pastes a key directly into a config file when Claude Code asks for it.
**Prevention:**
- All secrets ONLY in Vercel environment variables, never in `.env` committed to repo.
- `.gitignore` includes `.env`, `.env.local`, `.env.*.local` from day one.
- Pre-commit hook (e.g., `gitleaks`) scans for secret patterns.
- Document in `CLAUDE.md`: "Never paste API keys into code — always use `import.meta.env.SECRET_NAME` and tell the user to add the secret to Vercel dashboard."

### P0-9: Vercel Adapter Output Mode Mismatch

**Domain:** Deployment
**Failure mode:** Build succeeds locally, fails on Vercel with `output: "server" is required to use the serverless adapter`, or pages deploy as static when API routes are needed (contact form 404s in production).
**Why it happens:** `astro add vercel` historically did not always set `output: 'server'` (issue #4285); Astro 6 defaults differ from older guides.
**Prevention:**
- Explicitly set `output: 'server'` (or `'hybrid'` if mostly static + few API routes) in `astro.config.mjs`.
- Mark all-static pages with `export const prerender = true;` so they are pre-rendered.
- Mark API routes with `export const prerender = false;`.
- First deploy should hit a production preview URL and the contact form should be tested before DNS cutover.

### P0-10: WCAG / ADA Accessibility Failures

**Domain:** Legal / compliance
**Failure mode:** Site fails WCAG 2.1 AA — missing alt text, low color contrast, keyboard-inaccessible nav, no focus indicators, form fields without labels. Plaintiff's firm sends a demand letter; settle for $5K-$25K. (2,300+ ADA website lawsuits/year, NY firms specifically targeted; law firm websites are ironic high-value targets.)
**Prevention:**
- Build to WCAG 2.1 AA from day one — cheaper than retrofitting.
- Every image: meaningful `alt` text (or `alt=""` for decorative).
- Color contrast ratios: 4.5:1 for body text, 3:1 for large text. Run all proposed colors through a contrast checker before commit.
- Every form input has a `<label>` (not just placeholder).
- Keyboard navigation works end-to-end; visible focus rings (do NOT remove `outline` in Tailwind without replacement).
- Skip-to-content link at top of every page.
- Run `axe-core` (via `@axe-core/cli` or Playwright) in CI on every build.
- Publish an Accessibility Statement page documenting the firm's commitment and how to report issues — this is a powerful litigation defense.

---

## P1 — Serious Pitfalls

### P1-1: Tailwind v4 Vite Plugin Misconfiguration

**Domain:** Technical (Astro + Tailwind v4)
**Failure mode:** "Cannot apply unknown utility class `text-primary`" errors; styles silently missing in production; build succeeds but pages render unstyled.
**Why it happens:** Migrating from `@astrojs/tailwind` (deprecated for v4) to `@tailwindcss/vite`. The plugin must go in `vite.plugins`, NOT in Astro `integrations`. PostCSS config from v3 conflicts.
**Prevention:**
- Use `astro add tailwind` on Astro 5.2+ (Astro 6 is fine) — it sets up `@tailwindcss/vite` correctly.
- Delete any old `postcss.config.cjs` / `tailwind.config.js` from v3 — v4 uses CSS-first config (`@theme` blocks in CSS).
- Single `src/styles/global.css` with `@import "tailwindcss";` at the top, imported once in the root layout.
- Theme tokens defined in `@theme { --color-primary: ...; }`, not in a JS config.
- Do NOT mix v3 patterns (`tailwind.config.js content: [...]`) with v4 — v4 auto-detects content.

### P1-2: Tailwind v4 Dark Mode Not Set Up Correctly

**Domain:** Technical
**Failure mode:** `dark:` variants don't apply, or apply only based on OS preference with no user toggle.
**Prevention:**
- v4 default: `dark:` triggers on `prefers-color-scheme: dark`. To support a manual toggle, add a `@custom-variant dark (&:where(.dark, .dark *));` in CSS.
- Persist preference to `localStorage`, set `class="dark"` on `<html>` before first paint (inline script in `<head>`) to avoid FOUC.

### P1-3: Practice Area Page Cannibalization / Thin Content

**Domain:** SEO
**Failure mode:** Single "Practice Areas" page lists 10 services in 50 words each. Or 10 location pages duplicate the same body with only the city name swapped. Google ignores all of them; firm doesn't rank for any practice + location combination.
**Prevention:**
- One dedicated page per practice area, 800-1500 words minimum, addressing real client questions ("How is property divided in a [STATE] divorce?").
- One dedicated page per geographic service area IF the firm genuinely serves multiple — with locally unique content (court names, local case examples, area-specific statutes), not a swap of city names.
- Do not duplicate H1s or title tags across pages.
- Internal linking: practice page → relevant blog posts → contact CTA.

### P1-4: Missing or Wrong Structured Data

**Domain:** SEO
**Failure mode:** No `LegalService` / `Attorney` / `LocalBusiness` schema. Site doesn't appear in local pack or rich results; competitors with schema take the click.
**Prevention:**
- JSON-LD `LegalService` schema in the root layout: name, address, phone, hours, areas served, founder.
- `Attorney` schema on bio pages: name, jobTitle, alumniOf, worksFor.
- `FAQPage` schema on practice area pages where Q&A content exists.
- Validate with Google's Rich Results Test before deploying.
- NAP (Name/Address/Phone) consistency: identical wording in schema, footer, contact page, and Google Business Profile.

### P1-5: Render-Blocking Fonts and Layout Shift

**Domain:** Performance / Core Web Vitals
**Failure mode:** Custom Google Fonts load via `<link>` blocking render; FOIT (flash of invisible text) for 2 seconds; CLS spikes when fallback swaps to custom font.
**Prevention:**
- Self-host fonts in `/public/fonts/` (use `astro-font` or `fontsource`) — no third-party request.
- `font-display: swap` so fallback text appears immediately.
- Preload only the WOFF2 weight used above the fold.
- Use `size-adjust` / `ascent-override` in `@font-face` to match metrics of the fallback and minimize CLS.
- Limit custom fonts to 2 weights × 1 family. Body text in system fonts is increasingly defensible.

### P1-6: Unoptimized Headshots Tank LCP

**Domain:** Performance
**Failure mode:** Attorney headshot is a 4MB JPEG straight from the photographer; LCP > 4 seconds; mobile Lighthouse score in the 30s. (Images are LCP for 85% of desktop pages.)
**Prevention:**
- Use Astro's `<Image />` component (`astro:assets`) for ALL images — automatic WebP/AVIF, responsive `srcset`, dimensions baked in.
- Hero / above-fold headshot: explicit `loading="eager"` and `fetchpriority="high"`. Never `loading="lazy"` on the LCP element.
- Always set `width` and `height` to prevent CLS.
- Source images committed at 2x max display size; let Astro generate variants.

### P1-7: Third-Party Script Bloat

**Domain:** Performance
**Failure mode:** Live chat widget + scheduling embed + 3 analytics scripts + heatmap tool = 800ms of main-thread blocking; INP > 500ms on mobile.
**Prevention:**
- Start with zero third-party scripts. Add one at a time with measured justification.
- Use `<script async>` or `<script defer>` and `client:idle` for Astro components.
- Prefer first-party analytics (Plausible self-hosted, or Vercel Analytics) over GA4.
- Defer chat widgets until user scrolls / interacts.

### P1-8: Burying the CTA / Vague "Contact Us"

**Domain:** Conversion
**Failure mode:** "Contact Us" button leads to a long form with no call-to-value. Phone number requires scrolling. Six competing CTAs above the fold confuse the user.
**Prevention:**
- One primary CTA per page, repeated 2-3 times.
- Phrase the CTA as a benefit: "Schedule My Free Consultation" beats "Contact Us." First-person ("My") outperforms second-person ("Your").
- Phone number (clickable `tel:` link) in the header on every page, visible without scroll on mobile.
- Practice area pages get their OWN CTA in the practice area context: "Talk to a [practice area] attorney."

### P1-9: Leading With Firm History Instead of Client Problems

**Domain:** Conversion / copy
**Failure mode:** Homepage hero says "Founded in 2018, Scopal Firm provides excellence in legal services to clients throughout the region." Visitor bounces — they want to know if you can solve THEIR problem.
**Prevention:**
- StoryBrand-style hero: address the visitor's problem, position the attorney as the guide, give a clear next step.
- Pattern: "Facing [problem]? Get [outcome] with [firm]. [CTA]."
- Save "About the Firm" content for the About page.

### P1-10: Vercel Environment Variables Missing in Production

**Domain:** Deployment
**Failure mode:** Local dev works (`.env.local` has the keys); first form submission in production throws a 500 because `RESEND_API_KEY` is undefined.
**Prevention:**
- Maintain a `.env.example` listing every required variable (NO values).
- Pre-launch checklist in `CLAUDE.md`: "Before deploying, confirm every variable in `.env.example` exists in Vercel dashboard for both Production and Preview."
- API routes should fail loudly at startup if env vars are missing — don't fail silently on first request.

### P1-11: No Privacy Policy / TCPA / Form Consent Language

**Domain:** Legal
**Failure mode:** Form collects PII without privacy notice; SMS opt-in without TCPA-compliant disclosure; no GDPR-style notice for any EU/UK visitors.
**Prevention:**
- Privacy Policy page (linked from footer + adjacent to every form).
- Consent checkbox or inline text on the form: "By submitting, you agree to our Privacy Policy and consent to be contacted about your inquiry. This does not create an attorney-client relationship."
- If SMS is offered: explicit TCPA opt-in with "Msg & data rates may apply. Reply STOP to cancel."

---

## P2 — Should-Fix Pitfalls

### P2-1: No Sitemap or Robots.txt

**Failure mode:** Slower indexing of new content; private pages accidentally indexed.
**Prevention:** Add `@astrojs/sitemap` integration; configure `robots.txt` in `/public`; submit sitemap in Google Search Console.

### P2-2: Missing Open Graph / Twitter Card Metadata

**Failure mode:** Links shared in email / social show no preview; click-through rates suffer.
**Prevention:** OG and Twitter meta tags in base layout, with per-page overrides; default OG image checked in.

### P2-3: No 404 Page / Broken Internal Links

**Failure mode:** Users hit dead ends; SEO equity lost on broken outbound links.
**Prevention:** Custom `404.astro`; run a link checker (`linkinator`) in CI.

### P2-4: Tailwind v4 Class Purging Issues with Dynamic Classes

**Failure mode:** Class names built via string concatenation (`bg-${color}-500`) are stripped by v4's content scanner; production looks broken.
**Prevention:** Always use complete class names. Use a `safelist` in CSS (`@source "..."` directive) for genuinely dynamic classes. Prefer mapping objects: `const colors = { red: 'bg-red-500', ... }`.

### P2-5: Case-Sensitive Path Issues on Vercel

**Failure mode:** macOS dev (case-insensitive FS) imports `./Hero.astro` while file is named `hero.astro`. Builds locally; 500s on Vercel's Linux runtime.
**Prevention:** Enforce lowercase-kebab filenames for routes, PascalCase for components, and import EXACTLY the on-disk casing. Lint via `eslint-plugin-import` casing rules.

### P2-6: Vercel Build Cache Stale After Major Upgrades

**Failure mode:** After Astro/Tailwind upgrade, builds reference cached old artifacts and produce broken output.
**Prevention:** After major-version upgrades, "Redeploy → Clear Build Cache" once in Vercel.

### P2-7: No Pricing Transparency

**Failure mode:** Visitors with budgets below the firm's typical engagement waste both parties' time; conversion-quality drops.
**Prevention:** Even a range ("Initial consultations are $XXX, flat fees for [common matter] start at $X,XXX") qualifies leads. If pricing is genuinely matter-dependent, say "fees discussed during a free 15-minute consult."

### P2-8: Missing Bio Substance

**Failure mode:** Bio pages list law school + bar admissions in 80 words. Visitors don't connect with the attorney; conversion suffers.
**Prevention:** Each bio: 300-500 words covering background, why this practice, representative matters (with disclaimers), community involvement. Headshot, contact info, social links.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| Project setup | Tailwind v4 misconfig (P1-1) | Use `astro add tailwind` on Astro 6; verify `@tailwindcss/vite` in `vite.plugins` |
| Layout / design system | Color contrast failure (P0-10), focus rings removed (P0-10) | Run axe in CI from phase 1; never write `outline-none` without replacement focus styles |
| Content components | Testimonial without disclaimer (P0-2), claim without certification (P0-3) | Build `<Testimonial>` component requiring a `disclaimer` prop; banned-words lint check |
| Practice area pages | Thin content / cannibalization (P1-3), missing schema (P1-4) | Word-count floor in CMS; required FAQ schema block per page |
| Contact form | Header injection (P0-5), no server validation (P0-6), no rate limit (P0-7) | Zod schema + Turnstile + Vercel KV rate limit + transactional email API |
| Bio pages | "Specialist" claim (P0-3), thin bio (P2-8) | Banned-words check; minimum word count |
| SEO / metadata | Missing structured data (P1-4), NAP inconsistency (P1-4) | Single source of truth for firm NAP in `src/data/firm.ts`; reused in schema, footer, contact page |
| Performance pass | Headshot LCP (P1-6), font CLS (P1-5) | Astro `<Image />` everywhere; self-hosted fonts with `size-adjust` |
| Deployment | Output mode (P0-9), env vars (P1-10) | `output: 'server'`; `.env.example` checklist |
| Legal review | Disclaimers (P0-1, P0-2), jurisdiction (P0-4), privacy (P1-11) | Full pre-launch legal review checklist; attorney signs off |

---

## Non-Developer Maintenance Pitfalls (Cross-Cutting)

The owner is a non-developer attorney maintaining via Claude Code. Specific failure modes:

### M-1: Compliance Drift Over Time

**Failure mode:** Attorney edits a testimonial section 6 months post-launch via Claude Code; disclaimer is accidentally removed; bar grievance follows.
**Prevention:**
- Lock disclaimers into reusable components, not free-form content.
- `CLAUDE.md` at repo root with explicit rules: "Never remove a disclaimer without explicit instruction. Never use the words 'specialist', 'expert', 'best', '#1' in any content."
- A `compliance-check.ts` script that greps content for banned terms and missing disclaimer patterns; run in CI.

### M-2: Dependency Updates Break the Site

**Failure mode:** Claude Code is asked to "update dependencies"; Astro major bump introduces breaking changes; site doesn't build for a week.
**Prevention:**
- Pin major versions in `package.json` (`"astro": "^6.0.0"`, not `"latest"`).
- Renovate / Dependabot configured for patch + minor only by default; major bumps require explicit approval.
- Vercel preview deployments on every PR — never merge without verifying preview.

### M-3: Content Mistakes Bypass Review

**Failure mode:** Owner asks Claude Code to "add this case win to the homepage"; Claude inserts result without disclaimer; goes live in 5 minutes.
**Prevention:**
- All deploys gated on a PR; main branch protected.
- `CLAUDE.md` rule: "Any change involving testimonials, case results, or attorney bio claims must surface the relevant compliance rules from PITFALLS.md and confirm with the user before committing."
- Automated content-lint check (banned words, missing disclaimers) blocks merge.

### M-4: Loss of Institutional Knowledge

**Failure mode:** 18 months later, owner asks "why is the contact form structured this way?" — no one remembers the rate-limiting or header-injection rationale.
**Prevention:**
- Inline comments in security-sensitive code citing the pitfall ID (e.g., `// See PITFALLS.md P0-5: email header injection`).
- `CLAUDE.md` is the canonical source; PITFALLS.md is referenced from it; both checked in.

### M-5: Secret Rotation Skipped

**Failure mode:** API keys never rotated; one compromised key = persistent backdoor.
**Prevention:** Calendar reminder; document rotation steps in `CLAUDE.md`; 12-month max key lifetime.

---

## Sources

### Legal / Compliance
- [ABA Model Rule 7.1 — Communications Concerning a Lawyer's Services](https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_2_advertising/) — HIGH
- [ABA Model Rules 7.1-7.4 Guide](https://www.broughtonpartners.com/the-dos-and-donts-of-legal-advertising-a-guide-to-aba-model-rules-7-1-7-4/) — MEDIUM
- [Six Disclaimers for Legal Websites — Justia](https://onward.justia.com/six-disclaimers-you-may-need-to-include-on-your-legal-website-or-blog/) — MEDIUM
- [Florida Bar Testimonial / Past Results Overlay Rules — PaperStreet](https://www.paperstreet.com/blog/fl-bar-rules-for-websites-an-overlay-disclaimer-for-past-results-testimonials/) — MEDIUM
- [Modern Firm — Client Testimonials Ethics](https://www.themodernfirm.com/client-testimonials-on-attorney-websites-ethical/) — MEDIUM
- [California Bar Lawyer Advertising Rules](https://www.lawyerlegion.com/bar-rules/california) — MEDIUM
- [ADA.gov Web Rule Fact Sheet](https://www.ada.gov/resources/2024-03-08-web-rule/) — HIGH
- [Rising ADA Website Lawsuits — Harter Secrest & Emery](https://hselaw.com/news-and-information/legalcurrents/ada-website-accessibility-lawsuits-are-on-the-rise/) — MEDIUM

### Astro + Tailwind + Vercel
- [Astro Tailwind v4 Setup Guide 2026 — Tailkits](https://tailkits.com/blog/astro-tailwind-setup/) — MEDIUM
- [Tailwind v4 Astro Migration — bhdouglass](https://bhdouglass.com/blog/how-to-upgrade-your-astro-site-to-tailwind-v4/) — MEDIUM
- [GitHub Issue: Astro 6 + Tailwind Vite Build Failure (#16542)](https://github.com/withastro/astro/issues/16542) — HIGH
- [GitHub Issue: Tailwind v4 not loaded in Astro (#18055)](https://github.com/tailwindlabs/tailwindcss/issues/18055) — HIGH
- [@astrojs/vercel Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/vercel/) — HIGH
- [GitHub Issue: astro add vercel misses output:server (#4285)](https://github.com/withastro/astro/issues/4285) — HIGH
- [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro) — HIGH

### Security
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) — HIGH
- [Email Header Injection — Acunetix](https://www.acunetix.com/blog/articles/email-header-injection/) — HIGH
- [CVE-2021-23400: Nodemailer Header Injection](https://vulert.com/vuln-db/CVE-2021-23400) — HIGH
- [Beagle Security: Email Injection Attack Prevention](https://beaglesecurity.com/blog/vulnerability/email-header-injection.html) — MEDIUM

### SEO / Performance / Conversion
- [10 SEO Mistakes That Cost Law Firms Clients — Justia](https://onward.justia.com/10-seo-mistakes-that-are-costing-your-law-firm-clients/) — MEDIUM
- [Local SEO Mistakes for Lawyers — Dallas SEO Co.](https://www.thedallasseocompany.com/blog/local-seo-mistakes-law-websites-do) — LOW
- [Core Web Vitals for Law Firms — FWD Lawyer Marketing](https://fwd-lawyermarketing.com/core-web-vitals-optimization-for-law-firms/) — MEDIUM
- [Optimize Images for Core Web Vitals](https://www.corewebvitals.io/pagespeed/optimize-images-for-core-web-vitals) — MEDIUM
- [Florida Law Firm Website Conversion Mistakes](https://digitalentflorida.com/blog/florida-law-firm-website-conversion-mistakes/) — LOW
- [Effective CTAs on Law Firm Websites — Bigger Law Firm](https://www.biggerlawfirm.com/techniques-for-effective-calls-to-action-on-law-firm-websites/) — MEDIUM

---

## Confidence Notes

- **HIGH confidence:** Astro/Tailwind/Vercel technical pitfalls (verified against official docs and active GitHub issues), ABA Model Rule 7.1/7.2/7.4 framing, OWASP-class web vulnerabilities, ADA litigation trend.
- **MEDIUM confidence:** State-specific bar disclaimer wording — the firm's licensing state(s) MUST be confirmed and the state's actual rules consulted before launch. Conversion-rate statistics (anecdotal industry studies, not peer-reviewed).
- **LOW confidence / open questions:**
  - Which state(s) is Scopal Firm licensed in? Critical for P0-2, P0-3, P0-4 mitigation specifics.
  - Does the firm intend to use SMS / chat? Triggers TCPA-specific work in P1-11.
  - Is the firm a target for high-litigation states (NY, CA, FL specifically)? Raises P0-10 priority.
  - What pricing model? Affects P2-7 implementation.

These open questions should feed into the discovery phase and may add specific mitigation tasks to roadmap phases.
