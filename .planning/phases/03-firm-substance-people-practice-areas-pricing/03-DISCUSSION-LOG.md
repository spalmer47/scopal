# Phase 3: Firm Substance — People, Practice Areas, Pricing — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 03-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 03-firm-substance-people-practice-areas-pricing
**Areas discussed:** Legal Executive Coaching classification, Practice area page architecture, Navigation (no index page), Pricing page format, Headshots

---

## Legal Executive Coaching — Classification

| Option | Description | Selected |
|--------|-------------|----------|
| Separate section — keep its own URL | Own page, visually differentiated, within existing URL structure | ✓ |
| Include it on the Pricing page | Roll coaching into /pricing as a second offering | |
| Same as other practice areas for now | Treat identically to Corporate Law / Fractional GC for v1 | |

**User's choice:** Separate section with its own URL

---

## Legal Executive Coaching — URL

| Option | Description | Selected |
|--------|-------------|----------|
| Keep /practice-areas/legal-executive-coaching | Stays within existing URL structure | |
| Move to /coaching or /services/coaching | Cleaner signal that it's not a legal service | ✓ |

**User's choice:** `/coaching`

---

## Legal Executive Coaching — Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Add Coaching link separately in nav | Own nav link at top level | ✓ |
| Coaching stays inside Practice Areas dropdown | Listed with Corporate Law + Fractional GC in dropdown | |
| Coaching appears in footer only | Not in main nav | |

**User's choice:** Own separate nav link at top level

---

## Legal Executive Coaching — Audience

| Option | Description | Selected |
|--------|-------------|----------|
| In-house attorneys / GCs | Page speaks to lawyers developing leadership / career | ✓ |
| Executives navigating legal decisions | Founders/COOs learning to work with legal | |
| Both | Addresses both audiences | |

**User's choice:** In-house attorneys and GCs

---

## Legal Executive Coaching — Pricing on Page

| Option | Description | Selected |
|--------|-------------|----------|
| Anchor a rate or package | Show starting price or session structure | |
| Inquiry-only — no pricing shown | CTA to "Book a Discovery Call"; pricing discussed privately | |
| You decide | Claude drafts; Scott reviews in UAT | ✓ |

**User's choice:** Claude decides (inquiry-based is likely the fit)

---

## Practice Area Page Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| MDX content files (dynamic routing) | Copy in src/content/practice-areas/ MDX files; one [slug].astro template | ✓ |
| Static .astro pages | Three individual page files; copy hardcoded | |

**User's choice:** MDX content collection with dynamic routing

---

## Practice Area Copy Authorship

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drafts from FIRM_BRIEF.md | Claude writes full pages; Scott reviews in UAT | ✓ |
| Scott provides draft copy first | Scott writes talking points; Claude structures them | |

**User's choice:** Claude drafts; Scott reviews in UAT

---

## /coaching Page Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| MDX content file (same pattern) | Consistent with practice areas | ✓ |
| Static .astro page | One-off page, simpler | |

**User's choice:** MDX content file

---

## /practice-areas Index Page

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — build a listing page | Index at /practice-areas showing cards for Corporate Law + Fractional GC | |
| No — change nav to a dropdown | Practice Areas nav item becomes dropdown; no index page | ✓ |

**User's choice:** No index page — nav becomes dropdown

---

## Coaching on Practice Areas Index

*(Moot — no index page being built)*

**User's choice:** Coaching is separate; not included on any practice areas index

---

## Nav Confirmation

Nav order confirmed: **Practice Areas ▾** (dropdown: Corporate Law, Fractional GC) | **Coaching** | **Scott Palmer** | **Pricing** | **Book a Fit Call**

---

## Pricing Page Format

| Option | Description | Selected |
|--------|-------------|----------|
| StoryBrand narrative | Client problem first, reframe as prevention vs. crisis | ✓ |
| Comparison table + narrative | Short narrative then comparison table | |
| Tiered cards | Cards per subscription tier | |

**User's choice:** StoryBrand narrative

---

## Pricing — Subscription Tiers

| Option | Description | Selected |
|--------|-------------|----------|
| One anchor ($4,500/mo) + custom above | Single anchor, tiers discussed on call | |
| 2–3 named tiers | Distinct packages with names and prices | initially selected |
| Project flat fees only | No subscription published | |

**Note:** User initially selected 2–3 named tiers, then revised to a single plan.

---

## Pricing — Unlimited GC Access Model

**User's revised decision:** Single plan at **$995/month** — "Unlimited GC Access" as headline.

- No hourly billing; unlimited day-to-day legal needs
- Major discrete projects scoped and billed separately (not listed as exclusions on the page)
- Headline leads with "Unlimited GC Access"

---

## Pricing — Scope Guardrail

| Option | Description | Selected |
|--------|-------------|----------|
| Unlimited within defined practice areas | Standard GC scope boundaries | |
| Unlimited hours, capped response types | Day-to-day covered; major projects scoped separately | ✓ |
| Unlimited within defined matters/month | Cap concurrent complexity | |

**User's choice:** Unlimited hours, capped response types (major discrete projects billed separately)

---

## Pricing — "Unlimited" Framing

| Option | Description | Selected |
|--------|-------------|----------|
| Lead with "Unlimited GC Access" as headline | Bold differentiator; scope explained on same page | ✓ |
| Call it "Dedicated General Counsel" — no "unlimited" | Avoids expectation management risk | |
| Use "unlimited" as sub-point, not headline | Outcome-led, unlimited as feature bullet | |

**User's choice:** Lead with "Unlimited GC Access" as headline

---

## Pricing — Exclusions on Page

**User's decision:** No exclusion bullet list on the pricing page. Instead, one note stating that work outside the included scope will be estimated and billed separately.

---

## Pricing — 5 Included Service Areas

**User provided exact names and descriptions:**
1. Corporate — Formation documents, partnership agreements, and related consulting
2. Contracts — Initial audit, drafting and negotiation
3. HR Matters — Daily HR questions, employment contracts
4. Pre-litigation — Negotiation and dispute management
5. Data — Audit, documentation, assessments, and agreements

---

## Pricing — Service Area Display

| Option | Description | Selected |
|--------|-------------|----------|
| Feature cards / icon list | Each area gets a card or icon+text block | ✓ |
| Bulleted list inside narrative | Bullets within copy, less visual | |

**User's choice:** Feature cards / icon list

---

## Headshots — Delivery Method

| Option | Description | Selected |
|--------|-------------|----------|
| Scott commits before execution (blocking checkpoint) | Same pattern as Phase 2 logos | ✓ |
| Use placeholders, add headshots after | Pages deploy with placeholders first | |
| Graceful fallback component | Missing headshot shows styled initial/avatar | |

**User's choice:** Blocking prerequisite — Scott commits before execution

---

## Headshots — Format

| Option | Description | Selected |
|--------|-------------|----------|
| JPG, cropped square, under 200KB | Scott optimizes before committing | |
| Any format — planner includes optimization step | Scott commits as-is; plan handles optimization | ✓ |

**User's choice:** Any format; planner includes optimization step

---

## Claude's Discretion

- Legal Executive Coaching page copy and format (inquiry-based CTA approach)
- Icon selection for the 5 pricing feature cards
- FAQ questions for each practice area (3–5 per page, drawn from FIRM_BRIEF.md)
- All other page body copy (Claude drafts; Scott reviews in UAT)
- Visual layout and Tailwind styling for all new pages and components

## Deferred Ideas

- Calendar scheduler embed (Calendly / SavvyCal) — v2
- Testimonials — v2, pending client authorization
- Speaking / media appearances page — v2
- Coaching pricing tiers / defined packages — future update if coaching offering matures
