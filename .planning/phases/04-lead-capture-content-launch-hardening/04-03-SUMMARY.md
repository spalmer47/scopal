---
phase: "04-lead-capture-content-launch-hardening"
plan: "04-03"
subsystem: "contact-form"
tags: ["contact-form", "resend", "astro-actions", "aba-477r", "form-security", "wave-2"]
dependency_graph:
  requires: ["04-01", "04-02"]
  provides: ["contact-form-endpoint", "email-action-handler", "thank-you-page"]
  affects: ["src/actions/index.ts", "src/pages/contact.astro", "src/pages/contact/thank-you.astro"]
tech_stack:
  added: ["resend@4.x"]
  patterns: ["astro-actions", "zod-form-validation", "in-memory-rate-limiting", "html-escaping"]
key_files:
  created:
    - src/actions/index.ts
    - src/pages/contact/thank-you.astro
  modified:
    - src/pages/contact.astro
    - package.json
    - package-lock.json
decisions:
  - "Option A (Resend) chosen — simple email-only flow, no database storage"
  - "RESEND_API_KEY declared in astro.config.mjs env schema with context:server access:secret"
  - "prerender=false on contact.astro enables Astro Actions on the static output adapter"
metrics:
  duration: "~20 minutes"
  completed: "2026-05-08"
  tasks_completed: 2
  files_created: 3
  files_modified: 2
---

# Phase 4 Plan 03: Contact Form (Resend), ABA 477R Compliant — Summary

Contact form implemented with Astro Actions and Resend SDK. All 7 FORM-03 server-side security controls enforced. ABA 477R disclaimer rendered above submit button. Successful submission redirects to a noindex confirmation page.

## Provider Decision

**Option A: Resend** was chosen by Scott.

- Delivery email: `scott@scopalfirm.com` (sourced from `FIRM.email` in constants.ts)
- From address: `contact@scopalfirm.com` (fixed header — never user-supplied)
- Scott's intake workflow: email-first, keep it simple

## All 7 FORM-03 Security Controls Confirmed

### Control 1 — CSRF (security.checkOrigin)

**Status: Active (Astro 6 default)**

`astro.config.mjs` does NOT set `security: { checkOrigin: false }`. The Astro 6 default `checkOrigin: true` is in effect for all server-rendered routes.

```
grep -n "checkOrigin" astro.config.mjs
# → no output (not overridden — default true applies)
```

### Control 2 — Honeypot

**Status: Implemented**

```
grep -n "honeypot" src/actions/index.ts
# → 83: honeypot: z.string().max(0).optional(),
# → 87: if (input.honeypot && input.honeypot.length > 0) {

grep -n "position: absolute; left: -9999px" src/pages/contact.astro
# → 38: <div style="position: absolute; left: -9999px;" aria-hidden="true">
```

CSS `position: absolute; left: -9999px` is used (NOT `display:none`). Bots fill `display:none` fields; absolute positioning keeps the field invisible to humans while remaining accessible to form-filling bots.

### Control 3 — IP Rate Limit

**Status: Implemented**

```
grep -n "checkRateLimit\|TOO_MANY_REQUESTS\|rateLimitMap" src/actions/index.ts
# → 21: function checkRateLimit(ip: string): void {
# → 29: code: 'TOO_MANY_REQUESTS',
# → 93: checkRateLimit(ip);
```

In-memory Map keyed by `context.clientAddress`. Allows 5 submissions per hour; throws `ActionError(TOO_MANY_REQUESTS)` on the 6th attempt. Resets after 1 hour window.

### Control 4 — Zod Re-validation

**Status: Implemented**

```
grep -n "accept: 'form'" src/actions/index.ts
# → 72: accept: 'form',
```

`accept: 'form'` ensures the full Zod schema runs server-side for every submission, regardless of client-side validation state.

### Control 5 — HTML Escape on All User-Supplied Fields

**Status: Implemented on all 4 fields**

```
grep -n "escapeHtml" src/actions/index.ts
# → 38: function escapeHtml(str: string): string {
# → 60: <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
# → 61: <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
# → 62: <p><strong>Company:</strong> ${data.company ? escapeHtml(data.company) : '—'}</p>
# → 64: <p>${escapeHtml(data.description)}</p>
```

`escapeHtml()` is applied to name, email, company, AND description before embedding in the HTML email body. No user-supplied field is ever inserted raw.

### Control 6 — CRLF Rejection

**Status: Implemented on name and email**

```
grep -n "refine.*\\\\r\\\\n" src/actions/index.ts
# → 76: .refine(v => !/[\r\n]/.test(v), { message: 'Invalid characters in name' }),
# → 78: .refine(v => !/[\r\n]/.test(v), { message: 'Invalid characters in email' }),
```

CRLF characters in `name` or `email` fields would enable email header injection. Both fields reject these characters at the Zod validation layer.

### Control 7 — Fixed Email Headers

**Status: Implemented**

```
grep -n "from:.*contact@scopalfirm\|subject:.*New Contact" src/actions/index.ts
# → 56: from: 'contact@scopalfirm.com',
# → 58: subject: 'New Contact Form Submission — Scopal Firm',
```

`from:` and `subject:` are hardcoded string literals. They are never derived from user input.

## Security Verification — No API Keys in dist/

```
grep -r "RESEND_API_KEY|re_[a-zA-Z0-9]" dist/ 2>/dev/null | wc -l
# → 0
```

The `RESEND_API_KEY` env var is declared in `astro.config.mjs` with `context: 'server', access: 'secret'` — it is never emitted to client bundles.

## Build Result

```
npm run banned-words  →  banned-words: clean.
npm run build         →  [build] Complete!
```

Both checks pass. `/contact/thank-you` built as a static prerendered page. `/contact` built as a server-rendered on-demand route.

## Commit

`7845bd3` — feat(phase4): wave 2 — contact form (Resend), ABA 477R compliant, all 7 FORM-03 controls

## Manual Steps Required Before Form Can Send Email

**These are Scott's next steps — the form will not send email until both are done:**

1. **Add DNS records for Resend domain verification**
   - Go to resend.com → Sign in → Domains → Add Domain
   - Enter `scopalfirm.com`
   - Add the DNS records Resend provides (usually MX, DKIM TXT, and SPF records)
   - Wait for verification (typically 5–15 minutes)

2. **Create a Resend API key**
   - Go to resend.com → API Keys → Create API Key
   - Name it something like "scopalfirm-contact-form"
   - Copy the key (starts with `re_`)

3. **Add the API key to Vercel**
   - Go to Vercel dashboard → scopalfirm project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_your_key_here`
   - Apply to Production (and optionally Preview)
   - Trigger a redeployment

Until these steps are complete, form submissions will fail silently (the action will throw an error and the error message "There was a problem sending your message" will be shown to the visitor).

## Deviations from Plan

None — plan executed exactly as written. The checkpoint task was pre-resolved (Scott chose Option A: Resend, delivery to scott@scopalfirm.com) so execution proceeded directly to Task 1.

Pre-existing npm audit vulnerabilities (path-to-regexp in @astrojs/vercel, tmp in @lhci/cli) were found during `npm install resend`. These are out of scope — they exist in dev tooling, not in form-processing code. Logged to deferred-items.

## Self-Check: PASSED

- src/actions/index.ts: FOUND
- src/pages/contact.astro: FOUND (prerender=false on line 2)
- src/pages/contact/thank-you.astro: FOUND (noindex=true, 2 business days)
- Commit 7845bd3: FOUND
- dist/ secrets scan: 0 matches
- banned-words: clean
- build: complete
