# Feature Landscape: Scopal Firm Website

**Domain:** Law firm website (fractional GC / outside general counsel for US SaaS companies)
**Researched:** 2026-05-07
**Audience:** Early-to-mid stage SaaS founders/CEOs evaluating their first in-house legal support
**Primary Goal:** Convert inbound (currently referral-only) into qualified leads

---

## Executive Summary

A high-converting fractional GC website is fundamentally different from a traditional law firm site. Traditional firms sell trust through gravitas (marble columns, partner pedigree, scale). Scopal sells trust to a SaaS-buyer audience through clarity, relevance, and proof of business judgment. The site should read like a SaaS product website (clear positioning, plain-language pages, transparent pricing-as-anchor, founder-focused content) layered on top of mandatory bar-compliance scaffolding (disclaimers, attorney-advertising compliance, no-attorney-client-relationship language on every form).

The StoryBrand framework (client-as-hero, firm-as-guide) maps unusually well to this audience because SaaS founders already think in terms of "jobs to be done" and structured product narratives. Bio pages convert at roughly 2x the rate of homepage visitors and are the highest-leverage page after the homepage itself.

---

## Required Features (MVP — must ship for a credible launch)

### F1. Homepage — StoryBrand-Structured Landing
**What "done" looks like:**
- Above-the-fold hero with a one-sentence clarity statement ("We are the in-house legal team for SaaS companies that aren't ready to hire one yet") + primary CTA + secondary CTA
- Problem statement section (the founder's pain: contracts piling up, deals stalling, board asking about compliance, no one to call)
- Firm-as-guide section (empathy + authority — prior in-house experience, bar admissions, SaaS focus)
- The Plan section (3-step "how working together works": intake call → scoped engagement → embedded counsel)
- Explicit failure-stakes section (what happens if you keep flying without counsel — bad MSA terms, indemnity blowups, blown diligence)
- Success vision section (what life looks like with embedded GC support)
- Repeated primary CTA above-the-fold, mid-page, and at footer
- Trust bar (bar admissions, prior employer logos, publications) within first viewport on desktop
**Sources/confidence:** HIGH — multiple StoryBrand and law-firm CRO sources converge on this structure.

### F2. Practice Area Pages (3 pages: Outside GC, Corporate Law, Legal Executive Coaching)
**What "done" looks like — each page contains:**
- Clear, client-focused H1 (not "Corporate Law" but "Corporate Legal Support for SaaS Companies")
- "Who this is for" section (specific company stage/profile)
- Common scenarios this service handles (bullet list of 6–10 real situations)
- How the engagement works (process, typical cadence, deliverables)
- Pricing/scope orientation (link or summary — see F7)
- One short case-style narrative or "what good looks like" example
- FAQ block (3–5 questions) with FAQPage schema markup
- Page-specific CTA matched to service tier
- Internal link to attorney bio
**Sources/confidence:** HIGH — convergent best practices across multiple law-firm marketing sources.

### F3. Attorney Bio Page (highest-converting page after homepage — 2x conversion lift)
**What "done" looks like:**
- Professional headshot (high quality, recent, on-brand)
- Opening paragraph that leads with client benefit, not credentials ("I help SaaS founders…", not "Mr. Palmer is a partner at…")
- Prior in-house / GC roles with company names (this is the strongest trust signal for SaaS buyers)
- Bar admissions with admission year and jurisdiction (linked to state bar verification page where possible)
- Law school + JD year
- Representative matters / "things I do every week" (avoid CV-style chronology)
- Publications, speaking engagements, podcast appearances
- Professional associations (ABA, state bar sections, ACC if applicable)
- Personal/human element (1–2 sentences — what they care about outside law)
- Direct contact CTA (calendar link preferred over generic contact form for this audience)
- Person schema markup for SEO/E-E-A-T
**Sources/confidence:** HIGH — bio pages convert 2x homepage; convergent industry data.

### F4. Contact Form with ABA-Compliant Disclaimers
**What "done" looks like:**
- Minimum-viable fields: name, email, company, brief description of need (avoid asking for sensitive details upfront)
- Pre-submission disclaimer text visible above the submit button (not buried in footer):
  - "Submitting this form does not create an attorney-client relationship."
  - "Do not send confidential or time-sensitive information through this form."
  - "Information transmitted may not be secure or privileged until an engagement is established."
- TLS/HTTPS site-wide (ABA Formal Opinion 477R reasonable-efforts requirement for protecting client information in transit)
- Form submissions transmitted over encrypted connection; backend storage with reasonable access controls
- Confirmation page that re-states no-attorney-client-relationship language and sets expectations on response time
- Conflict-check disclaimer (Scopal must run conflicts before any substantive response)
- Optional: Calendly/SavvyCal embed as primary CTA, with form as fallback
**Sources/confidence:** HIGH — convergent across ABA Opinion 477R guidance and law-firm disclaimer practice; Florida-style "hiring a lawyer is an important decision" disclaimer recommended in footer site-wide as a safe practice even outside FL.

### F5. Site-Wide Legal Footer & Disclaimers
**What "done" looks like:**
- Attorney advertising statement ("Attorney Advertising. Prior results do not guarantee a similar outcome.")
- Named attorney responsible for site content (required in many jurisdictions)
- Principal office address and jurisdictions of practice
- "No attorney-client relationship" general disclaimer
- Privacy policy link
- Terms of use link
- Copyright + bar admission jurisdictions
**Sources/confidence:** HIGH — universally required across state bars per ABA Model Rules 7.1/7.2 baseline.

### F6. Trust Signal Bar / Credibility Strip
**What "done" looks like:**
- Visible within the homepage's first viewport on desktop
- Includes (in priority order for SaaS audience): prior in-house employer logos, bar admissions, notable publication logos (where Scott has been published or quoted), speaking venues
- Distinct from a "client logos" wall, which Scopal may not be able to use due to confidentiality
- If client testimonials are used, must comply with state attorney-advertising rules (no misleading claims; "prior results" disclaimer)
**Sources/confidence:** HIGH for what to display; MEDIUM on testimonial mechanics (state-rule dependent).

### F7. Pricing / Engagement Models Page (or Section)
**What "done" looks like:**
- Display starting-at price ($4,500/month) — partial transparency, not a full menu
- Frame as "engagement models" or "how we work together" rather than "pricing" (softens the commercial framing)
- Three tiers OR a single anchor tier plus "custom" — research shows fractional GC typical range is $2K–$15K+/month, so $4,500 sits credibly mid-market
- For each tier: who it's for, what's included, scope boundaries, what triggers a scope-adjustment conversation
- Explicit "what's NOT included" section (prevents misaligned expectations)
- Comparison framing vs. BigLaw hourly and full-time GC hire (cost-of-alternative anchor)
- Direct CTA: "Book a fit call" rather than "buy now"
**Sources/confidence:** HIGH on fractional GC pricing norms; MEDIUM on whether to show pricing publicly. Trade-off: showing builds trust and pre-qualifies leads (saves Scott's time), but reveals to competitors and may anchor low. Recommendation: show "starting at $4,500/month" anchor, full pricing on consultation. This matches what high-converting fractional GC sites do.

### F8. Mobile-Responsive Design + Performance Budget
**What "done" looks like:**
- Lighthouse score ≥ 90 on mobile for performance and accessibility
- Largest Contentful Paint < 2.5s on 4G
- Every additional second of load cuts conversions ~20% — this is a conversion feature, not just hygiene
- Mobile nav with persistent CTA in sticky header
**Sources/confidence:** HIGH — performance/conversion correlation is well-established.

### F9. Persistent CTA / Conversion Architecture
**What "done" looks like:**
- Primary CTA in top-right of every page header ("Book a call" or "Speak with Scott" — never "Contact us")
- CTA appears mid-page and at footer of every long-scroll page
- Sticky header with CTA on scroll
- One primary CTA verb used site-wide (consistency)
**Sources/confidence:** HIGH.

### F10. Privacy Policy & Terms of Use Pages
**What "done" looks like:**
- Privacy policy covering form submissions, analytics, cookies, data retention
- Terms of use covering site access, IP, no-legal-advice disclaimer, governing law
- Cookie consent banner if analytics that set non-essential cookies are used (CCPA/GDPR-aware even though primary audience is US)
**Sources/confidence:** HIGH.

---

## Nice-to-Have Features (Phase 2+)

### N1. Blog / Insights Section
**Role for a solo fractional GC:** Primarily an SEO and credibility play, secondarily a sales-enablement library (Scott can send specific posts to prospects answering common questions). NOT a publication treadmill — quality over cadence.
**What "done" looks like:**
- Categories aligned to SaaS-founder concerns: SaaS Contracts, Privacy & Compliance, Fundraising Legal, Equity & Hiring, Board & Governance, Outside GC Playbook
- Long-form posts (1,500–2,500 words) targeting specific founder questions
- Cadence: 1–2 quality posts/month is sufficient for solo practitioner; consistency over volume
- Each post: clear takeaway, plain-language, no "schedule a free consultation" hard sell — soft CTA at end
- Author byline links to bio page
- Article schema markup
**Sources/confidence:** MEDIUM-HIGH on cadence; HIGH on category fit for SaaS audience.

### N2. Newsletter / Email Capture
**What "done" looks like:**
- Lightweight email capture (single field) on blog posts and a dedicated /newsletter page
- Monthly or bi-weekly digest, not transactional
- Stronger long-term lead nurture than blog alone, especially for "not ready yet" founders
**Sources/confidence:** MEDIUM — strong B2B SaaS pattern, less proven for fractional legal specifically.

### N3. Resources / Downloadables
**Examples:** "SaaS MSA Red-Flag Checklist," "Founder's Guide to First Legal Hire," "DPA Negotiation Cheat Sheet"
**Why nice-to-have:** Highest-quality lead-magnet for the audience; gates email capture; demonstrates expertise in concrete artifacts.
**Sources/confidence:** MEDIUM-HIGH.

### N4. Case Studies / Engagement Narratives (Anonymized)
**What "done" looks like:**
- 3–5 anonymized engagement stories ("Series B SaaS company, 80 employees, Scopal embedded for 9 months, outcomes were…")
- Compliance-aware: no client identification without written consent, prior-results disclaimer, no outcome guarantees
**Why nice-to-have:** SaaS buyers respond to "verifiable outcomes and peer references"; anonymized case studies are a proven trust mechanism.
**Sources/confidence:** MEDIUM — confidentiality constraints make execution harder than for B2B SaaS generally.

### N5. Calendar Booking Integration (Calendly / SavvyCal)
**What "done" looks like:** Embedded scheduler on contact page and bio page; primary CTA across site links to a "fit call" booking flow with screening questions (company stage, ARR band, current legal setup).
**Sources/confidence:** HIGH — superior conversion mechanism for B2B service buyers vs. plain forms.

### N6. Testimonials / Quotes (if obtainable)
**Compliance considerations:** Most state bars permit testimonials but require disclaimers; some require client consent in writing; California specifically requires "previous results don't guarantee future outcomes" framing. Many in-house clients won't give attributed testimonials due to employer policies — anonymized or first-name-and-title format is more realistic.
**Sources/confidence:** MEDIUM — execution constrained by client willingness and state rules.

### N7. FAQ Page (Site-Wide)
**What "done" looks like:** Consolidated FAQ covering: how does fractional GC differ from BigLaw, what's the minimum engagement, do you handle litigation, what jurisdictions, conflict-check process, onboarding timeline. FAQPage schema for SEO.
**Sources/confidence:** HIGH.

### N8. Speaking / Media Page
**What "done" looks like:** Curated list of podcast appearances, panels, articles, conference talks. Reinforces thought-leadership trust signal for SaaS audience that vets via LinkedIn / podcast channels.
**Sources/confidence:** MEDIUM.

---

## Anti-Features (Explicitly DO NOT Build)

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| Generic "Contact Us" form with no disclaimers | Creates ABA 477R risk and unmet client expectations | F4 above with explicit pre-submission disclaimers |
| "Free consultation" language as primary CTA | Cheapens positioning; signals BigLaw/PI-firm vibe to SaaS buyers; Scott's audience values their time, not "free" | "Book a fit call" or "Speak with Scott" |
| Live chat / chatbot | Implies always-on availability solo practitioner can't deliver; chatbots create unauthorized-practice and confidentiality exposure | Calendar booking + clear response-time expectations |
| Stock photos of gavels, scales of justice, marble columns | Wrong visual register for SaaS audience; signals traditional firm | Founder-style imagery: real photography of Scott, clean SaaS-style layouts, product-marketing aesthetic |
| Practice areas listed for things Scott doesn't actually do (litigation, criminal, family, IP litigation) | SEO-bait that attracts wrong leads and erodes trust | Focused 3-service architecture (Outside GC, Corporate, Legal Exec Coaching) |
| Detailed pricing menu with line-items | Commoditizes the engagement; subscription legal is sold on relationship, not à-la-carte | Anchor pricing ($4,500+/month) + "engagement models" framing |
| Client logo wall | Most in-house roles forbid client identification; risks confidentiality breach | Prior-employer logos (Scott's own past in-house roles) — these are public and powerful |
| "Awards" badges that don't apply (Super Lawyers, etc., if not earned) | Misleading attorney advertising | Stick to verifiable credentials |
| Long bio in CV/chronology format | Bios that read as academic CVs are a known conversion failure point | Client-benefit-led bio (F3) |
| Blog publishing on a heavy cadence Scott can't sustain | Stale top post damages credibility more than no blog | 1–2 quality posts/month, evergreen-leaning |
| Forms that ask for matter details before conflict check | ABA 1.18 / prospective-client confidentiality risk | Generic intake; gate detail until conflict-cleared call |

---

## Feature Categories → Roadmap Phase Mapping

### Phase 1 (MVP / Launch-Ready)
Goal: A site that is credible, compliant, and converts referral-warmed visitors at a higher rate than no site at all.
- F1 Homepage (StoryBrand structure)
- F3 Attorney Bio (Scott)
- F4 Contact Form (ABA 477R-compliant)
- F5 Site-Wide Legal Footer / Disclaimers
- F6 Trust Signal Bar
- F8 Mobile / Performance
- F9 Persistent CTA Architecture
- F10 Privacy Policy + Terms

### Phase 2 (Service Depth)
Goal: Cold-traffic conversion, not just referral-warmed.
- F2 Practice Area Pages (3)
- F7 Pricing / Engagement Models page
- N5 Calendar Booking integration
- N7 FAQ page

### Phase 3 (Authority & Inbound Engine)
Goal: Generate net-new pipeline via search and content.
- N1 Blog / Insights
- N2 Newsletter
- N3 Resources / Downloadables
- N8 Speaking / Media page

### Phase 4 (Social Proof Maturation)
Goal: Compound trust as engagements complete.
- N4 Case Studies / Engagement Narratives
- N6 Testimonials (as obtainable)

---

## Confidence Assessment

| Area | Confidence | Notes |
|---|---|---|
| StoryBrand homepage structure | HIGH | Multiple convergent sources on legal application |
| Bio page conversion mechanics | HIGH | 2x conversion lift well-documented |
| ABA 477R form requirements | HIGH | Direct ABA opinion text + practitioner guidance |
| Pricing transparency norms | MEDIUM | Industry split; recommendation reasoned |
| Blog cadence for solo | MEDIUM | Inferred from B2B SaaS thought-leadership norms; less specific data on solo fractional |
| State-bar advertising rules | MEDIUM | Varies by jurisdiction; Scott's bar admissions drive specifics; safe-baseline approach recommended |
| Trust-signal priority order for SaaS audience | MEDIUM-HIGH | Reasoned from buyer psychology + general legal trust-signal data |

---

## Open Questions for Roadmap

1. **State bar specifics:** Which state(s) is Scott admitted in? Specific advertising-rule disclaimers (e.g., Florida 4-7.13, NY testimonial rules) depend on this — flag for Phase 1 finalization.
2. **Testimonial availability:** Will any prior in-house clients provide attributed quotes? Determines whether N6 is feasible.
3. **Pricing display decision:** Final call between (a) "starting at $4,500/month" public anchor vs. (b) pricing on consultation only. Recommend (a) based on research; needs Scott's sign-off.
4. **Conflict-check workflow:** What's the operational handoff from form-submit → Scott → conflict-cleared response? Affects F4 confirmation copy and SLA expectations.
5. **CMS vs. static for blog:** N1 implementation depends on stack decision (see STACK.md).

---

## Sources

- [StoryBrand Legal Website Examples](https://www.sbwebsiteexamples.com/storybrand-legal-website-examples)
- [Juris Digital — StoryBrand-Inspired Legal Web Design](https://jurisdigital.com/innovate/ferrante-koenig-storybrand-website/)
- [GavelGrow — CRO Best Practices for Law Firms](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices)
- [Smokeball — Optimizing Law Firm Website Conversions](https://www.smokeball.com/blog/optimizing-law-firm-website)
- [PaperStreet — CRO for Law Firms Guide](https://www.paperstreet.com/blog/conversion-rate-optimization-for-law-firms-a-best-practices-guide-part-1-the-basics-design-seo/)
- [PaperStreet — 50 Best Attorney Bio Designs](https://www.paperstreet.com/blog/50-best-attorney-bio-designs-for-law-firms/)
- [Rankings.io — Attorney Bios That Convert](https://rankings.io/blog/attorney-bios/)
- [Oklahoma Bar — Lawyer Bio Best Practices](https://www.okbar.org/cm_articles/lawyer-bio-best-practices-turning-about-me-into-why-you/)
- [PaperStreet — Best Practice Area Pages](https://www.paperstreet.com/blog/50-best-practice-area-pages-for-law-firms-get-creative/)
- [Edwards Legal Marketing — High-Converting Practice Area Pages](https://edwardslegalmarketing.com/what-should-a-high-converting-law-firm-practice-area-page-include/)
- [LawPay — ABA Opinion 477R Explained](https://www.lawpay.com/about/blog/protection-of-client-information-what-aba-opinion-477r-means-for-you/)
- [ABA Formal Opinion 477R full text (PDF)](https://docs.tbpr.org/pub/aba%20formal%20opinion%20477.authcheckdam.pdf)
- [Nifty Marketing — Law Website Contact Form Disclaimers](https://niftymarketing.com/is-your-law-websites-contact-form-and-disclaimer-correct/)
- [Clio — Lawyer Advertising Rules](https://www.clio.com/blog/lawyer-advertising-rules/)
- [Arizona Bar — Standard Disclaimer Language (PDF)](https://azbar.org/media/gpwdyn4l/standard-disclaimer-language.pdf)
- [LeanLaw — Fractional GC Pricing Guide](https://www.leanlaw.co/blog/how-to-price-fractional-general-counsel-services-a-monthly-subscription-model-for-corporate-law-firms/)
- [ABA Journal — Law Firm Subscription Plans](https://www.abajournal.com/web/article/law-firm-subscriptions)
- [ABA GPSolo — Subscription-Based OGC Programs](https://www.americanbar.org/groups/gpsolo/resources/magazine/2025-sep-oct/subscription-based-outside-general-counsel-programs-guide/)
- [AMBART LAW — Fractional GC for SaaS](https://www.ambartlaw.com/fractional-gc-for-saas)
- [Juro — What is a Fractional GC](https://juro.com/general-counsel/fractional-gc)
- [Intellectual Strategies — Fractional GC for Startups](https://www.intellectualstrategies.com/services/fractional-legal-services/fractional-general-counsel)
- [Legal Brand Marketing — Trust Signals for Attorney Websites](https://www.legalbrandmarketing.com/trust-signals-for-attorney-websites-build-client-confidence/)
- [By Crawford — Law Firm Website Design Elements](https://bycrawford.com/blog/law-firm-website-design)
- [Copo Strategies — Six Habits of Effective Law Firm Thought Leadership](https://www.copostrategies.com/6-habits-thought-leadership)
- [1SEO — Strategic Power of Blogging for Lawyers](https://1seo.com/blog/the-strategic-power-of-blogging-for-lawyers-and-law-firms/)
