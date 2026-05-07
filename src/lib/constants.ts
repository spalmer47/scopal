// src/lib/constants.ts
// SINGLE SOURCE OF TRUTH for firm NAP, bar admissions, social URLs, and banned vocabulary.
// Consumed by: Footer.astro, FooterDisclaimer.astro, LegalServiceSchema.astro, SEO.astro,
// future contact confirmation (Phase 4), scripts/banned-words.mjs (Plan 04).
//
// Authoritative sources:
//   - .planning/FIRM_BRIEF.md (firm name, location, attorneys)
//   - .planning/STATE.md D9 (NAP areaServed=US), D14 (banned vocab), D15 (SOT), D17 (bar status exact copy)
//   - .planning/phases/01-foundation-live-skeleton/01-UI-SPEC.md (Footer copy table)
//
// Do NOT hardcode "Annandale", "Maryland", "Scopal Firm", "Attorney Advertising", or any
// disclaimer text anywhere else in the repo — import from this file.

export const FIRM = {
  legalName: 'Scopal Firm, LLC',
  shortName: 'Scopal Firm',
  url: 'https://scopalfirm.com',
  email: 'scott@scopalfirm.com',
  phone: null as string | null,
  address: {
    streetAddress: null as string | null,
    addressLocality: 'Annandale',
    addressRegion: 'NJ',
    postalCode: null as string | null,
    addressCountry: 'US',
  },
  areaServed: { type: 'Country' as const, name: 'United States' },
  responsibleAttorney: 'Scott A. Palmer',
  attorneyAdvertising:
    'Attorney Advertising. Prior results do not guarantee a similar outcome.',
  jurisdictionDisclaimer:
    'Scopal Firm, LLC attorneys are licensed to practice law in Maryland; New Jersey admission pending. ' +
    "This website is not intended to solicit clients in jurisdictions where the firm's attorneys are not licensed.",
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
      { state: 'Maryland',   year: 2009, status: 'active'  },
      { state: 'New Jersey', year: 0,    status: 'pending' },
    ] as BarAdmission[],
  },
} as const;

export const SOCIAL = {
  linkedinScott: null as string | null,
  linkedinFirm:  null as string | null,
} as const;

// Banned vocabulary (D14) — enforced by scripts/banned-words.mjs in CI (Plan 04).
// Permitted alternatives: "focuses on", "represents clients in", "experienced in".
// CTA banned strings: "Contact Us", "Free Consultation" (D16). "Book a Fit Call" is
// permitted in Phase 3 pricing context only — Phase 1 does NOT use it (UI-SPEC).
export const BANNED_TERMS = [
  'specialist',
  'specializing in',
  'expert',
  'experts',
  'the best',
  '#1',
  'leading',
  'top-rated',
  'super lawyer',
] as const;

/**
 * Formats Scott's bar status for display per D17 / UI-SPEC Footer copy table.
 * MUST produce exactly: "Maryland (2009); New Jersey admission pending"
 * Footer.astro imports and renders this string verbatim.
 */
export function formatBarStatus(): string {
  const scott = ATTORNEYS['scott-palmer'];
  return scott.barAdmissions
    .map((b) => (b.status === 'active' ? `${b.state} (${b.year})` : `${b.state} admission pending`))
    .join('; ');
}
