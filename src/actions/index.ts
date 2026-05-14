// src/actions/index.ts
// Contact form server-side action with all 7 FORM-03 security controls.
//
// Control 1 (CSRF): security.checkOrigin is true by default in Astro 6 — not overridden
//                   in astro.config.mjs, so this is active.
// Control 2 (Honeypot): z.string().max(0).optional() — empty or absent required
// Control 3 (IP rate limit): in-memory Map, ≤5/hour per clientAddress
// Control 4 (Zod re-validation): accept: 'form' — server-side schema runs always
// Control 5 (HTML escape): escapeHtml() on ALL four user-supplied fields
// Control 6 (CRLF rejection): .refine(v => !/[\r\n]/.test(v)) on name and email
// Control 7 (Fixed headers): from: and subject: are hardcoded — NEVER user-supplied

import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { FIRM } from '../lib/constants';

// Control 3: IP rate limit — in-memory Map (per-instance; acceptable for low-volume law firm form)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return;
  }
  if (entry.count >= 5) {
    throw new ActionError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many submissions. Please try again later.',
    });
  }
  entry.count++;
}

// Control 5: HTML escape — applied to ALL user-supplied fields before email body construction
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendEmail(data: {
  name: string;
  email: string;
  company?: string;
  description: string;
}): Promise<void> {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  await resend.emails.send({
    // Control 7: Fixed From and Subject — NEVER user-supplied
    from: 'scott@updates.scopalfirm.com',
    to: FIRM.email,
    subject: 'New Contact Form Submission — Scopal Firm',
    html: `
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Company:</strong> ${data.company ? escapeHtml(data.company) : '—'}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.description)}</p>
    `,
  });
}

export const server = {
  sendContact: defineAction({
    // Control 4: accept: 'form' ensures Zod schema re-validation runs server-side always
    accept: 'form',
    input: z.object({
      // Control 6: CRLF rejection on header-bound fields
      name: z.string().min(1).max(100)
        .refine(v => !/[\r\n]/.test(v), { message: 'Invalid characters in name' }),
      email: z.string().email().max(254)
        .refine(v => !/[\r\n]/.test(v), { message: 'Invalid characters in email' }),
      company: z.string().max(200).optional(),
      // Control 5: description HTML-escaped in sendEmail before embedding in email body
      description: z.string().min(1).max(2000),
      // Control 2: Honeypot — must be empty string or absent; bots fill visible hidden fields
      honeypot: z.string().max(0).optional(),
    }),
    handler: async (input, context) => {
      // Control 2: Honeypot check — reject if filled
      if (input.honeypot && input.honeypot.length > 0) {
        throw new ActionError({ code: 'FORBIDDEN', message: 'Submission rejected.' });
      }

      // Control 3: IP rate limit
      const ip = context.clientAddress ?? 'unknown';
      checkRateLimit(ip);

      // Controls 4 (Zod re-validation complete above) + 5 (HTML escape happens inside sendEmail)
      await sendEmail({
        name: input.name,
        email: input.email,
        company: input.company,
        description: input.description,
      });
      // Returns void on success; contact.astro checks result.error absence for redirect
    },
  }),
};
