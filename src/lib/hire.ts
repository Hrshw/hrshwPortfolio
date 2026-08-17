export const HIRE_LANGS = ["en", "hi"] as const;
export type Lang = (typeof HIRE_LANGS)[number];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (HIRE_LANGS as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Hire / project-inquiry configuration and types.
//
// The /hire page is deliberately PRIVATE: it is not linked in the nav, is
// blocked from search engines (robots.txt + noindex), and is shared only with
// potential clients. Prices are public *ranges*; the final quote is given
// after reviewing the brief.
// ---------------------------------------------------------------------------

/** Public rate ranges — edit these in ONE place. */
export const HIRE_RATES = {
  inr: { min: 1500, max: 3000, label: "₹1,500 – ₹3,000 / hour" },
  usd: { min: 25, max: 45, label: "$25 – $45 / hour" },
} as const;

/** Project-bundle anchors so clients buy outcomes, not just hours. */
export const PROJECT_BUNDLES = [
  { label: "Landing page / marketing website", range: "₹15,000 – ₹40,000" },
  { label: "New feature or integration on an existing app", range: "₹20,000 – ₹80,000" },
  { label: "Full SaaS MVP — design, build, deploy", range: "₹1,50,000 – ₹5,00,000" },
] as const;

export const PROJECT_TYPES = [
  "New website",
  "Changes to an existing site",
  "New feature / integration",
  "Something else",
] as const;

export const NEEDS = [
  "E-commerce / payments",
  "CMS / content editing",
  "API / backend",
  "Authentication / accounts",
  "Admin dashboard",
  "Hosting & deployment",
  "Speed / SEO improvements",
  "Other",
] as const;

export const BUDGET_BANDS = [
  "Under ₹50,000",
  "₹50,000 – ₹1,50,000",
  "₹1,50,000 – ₹5,00,000",
  "₹5,00,000+",
] as const;

export const TIMELINES = [
  "ASAP — within a few weeks",
  "1–3 months",
  "Flexible / not urgent",
] as const;

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  needs: string[];
  budgetBand: string;
  timeline: string;
  details: string;
  /** Client's UI language — used for the confirmation email. */
  lang: Lang;
  status: InquiryStatus;
  read: boolean;
  createdAt: string;
  ipHash: string;
}

/** Deterministic scope summary — no LLM, instant, never hallucinates. */
export function buildScopeSummary(i: {
  projectType: string;
  needs: string[];
  budgetBand: string;
  timeline: string;
  company?: string;
  details: string;
}): string {
  return [
    `Project type: ${i.projectType}`,
    i.needs.length > 0 ? `Needs: ${i.needs.join(", ")}` : null,
    `Budget: ${i.budgetBand}`,
    `Timeline: ${i.timeline}`,
    i.company ? `Company: ${i.company}` : null,
    "",
    i.details,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
