# Phase 2: Homepage + Conversion Spine — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 02-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 02-homepage-conversion-spine
**Areas discussed:** Hero headline, 3-step plan content, Trust strip assets, CTA destination

---

## Hero Headline

| Option | Description | Selected |
|--------|-------------|----------|
| Use the candidate line from HOME-01 | "We are the in-house legal team for SaaS companies that aren't ready to hire one yet." | |
| I'll provide the headline | User types their own H1 | ✓ |
| Draft 3 options for me | Claude writes 3 candidates; user picks | (chosen initially) |

Claude drafted three options:
- Option A (situation-first): "Your SaaS company needs a General Counsel. You're not ready to hire one full-time."
- Option B (outcome-first): "Get a dedicated GC for your SaaS company — without the full-time salary."
- Option C (pain-first): "You're paying too much for legal help you rarely use. There's a better way."

**User's choice (free text):** "You need a GC, but not the salary that comes with it."
**Notes:** User provided their own headline via Other. Punchy, client-problem-first, names the friction. Locked as D-01.

**Sub-headline:** User confirmed they want a sub-headline drafted by Claude during planning. Direction: dedicated GC, available consistently, subscription-priced, for SaaS not ready for full-time.

---

## 3-Step Plan Content

| Option | Description | Selected |
|--------|-------------|----------|
| Set A — Simple journey | Schedule a fit call → We scope your legal needs → Get a dedicated partner | ✓ |
| Set B — Outcome-named | Fit call → Build legal foundation → Stay ahead of risk | |
| Set C — Client-centric | Tell us about your company → We map your landscape → You focus on growth | |

**User's choice:** Set A — Simple journey
**Notes:** User confirmed step names are accurate as-is. User also confirmed each step should include 1–2 sentence descriptions, drafted by Claude during planning.

---

## Trust Strip Assets

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, I have logos | SVG or PNG files available for some/all marks | ✓ |
| No logos — text treatment | Styled text-based trust strip | |

**Layout question:**

| Option | Description | Selected |
|--------|-------------|----------|
| "Prior in-house experience" label | Labels employer logos — signals in-house background | ✓ |
| "Where Scott has served as GC" | More specific, slightly longer | |
| No label | Context from body copy only | |

**Grouping question:**

| Option | Description | Selected |
|--------|-------------|----------|
| Two groups (Recommended) | Prior employers (uPerform, Ancile) + Professional associations (HeyCounsel, InHoused) | ✓ |
| One unified strip | All four marks in a single row | |

**User's choice:** Has logos; two-group layout with "Prior in-house experience" and "Professional associations" labels.
**Notes:** Logos must be committed to `public/images/logos/` before execution starts (blocking prerequisite per D-08).

---

## CTA Destination

| Option | Description | Selected |
|--------|-------------|----------|
| Build a placeholder /contact page | Simple page with email + "form coming soon"; clean URL for Phase 4 to replace | ✓ |
| mailto: link for now | Opens pre-addressed email | |
| Calendly or scheduling URL | Direct link to external scheduler | |

**Placeholder page content:**

| Option | Description | Selected |
|--------|-------------|----------|
| "Contact form coming soon" + email | Honest, functional, Phase 4 replaces it | ✓ |
| Just the email address | Minimal, could feel unfinished | |

**Navigation question:**

| Option | Description | Selected |
|--------|-------------|----------|
| Logo + CTA button only (Recommended) | No nav links until Phase 3 pages exist | |
| Add future page links now | Practice Areas, About, Pricing links — 404 until Phase 3 | ✓ |

**404 handling:**

| Option | Description | Selected |
|--------|-------------|----------|
| Live links that 404 is fine | Add links, accept temporary 404s | ✓ |
| Grayed out / disabled | Styled as coming soon, non-clickable | |

**User's choice:** Placeholder `/contact` page; nav links to Phase 3 pages added now; 404s acceptable until Phase 3 ships.

---

## Claude's Discretion

- Exact sub-headline wording (direction locked; Claude writes final copy)
- Step descriptions for 3-step plan (Claude drafts based on firm brief)
- StoryBrand body copy (problem agitation, guide positioning, stakes, success vision)
- Visual layout and Tailwind styling for all new sections
- Component file structure (names, number of components)

## Deferred Ideas

- Calendar scheduler embed (Calendly/SavvyCal) — v2 per REQUIREMENTS.md
- Testimonials — v2, pending client quotes
- Hero imagery / headshot in hero — deferred; Claude has discretion to include or omit
