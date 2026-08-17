// ---------------------------------------------------------------------------
// Support / donation configuration.
//
// Everything here is safe to send to the client (a UPI ID is meant to be
// public — it's printed on payment apps everywhere). The payee is NEVER
// derived from user input; it comes from the server environment, so a visitor
// cannot re-point a payment at themselves.
// ---------------------------------------------------------------------------

export interface SupportConfig {
  /** Whether a UPI payee is configured. */
  upiEnabled: boolean;
  upiId: string;
  upiName: string;
  refPrefix: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  presets: number[];
  /** Optional Polar (polar.sh) hosted checkout link for card/international donations. */
  polarCheckoutUrl: string;
}

// The UPI ID is the owner's own payee address (public info) — it doubles as a
// sane default so the feature works out of the box. Override via env for
// different environments without touching code.
const rawUpiId = (process.env.SUPPORT_UPI_ID || "7082739587@jupiteraxis").trim();

export const supportConfig: SupportConfig = {
  upiEnabled: rawUpiId.length > 0,
  upiId: rawUpiId,
  upiName: (process.env.SUPPORT_UPI_NAME || "Rahul Singh Shekhawat").slice(0, 60),
  refPrefix: (process.env.SUPPORT_UPI_REF_PREFIX || "PORTFOLIO").slice(0, 20),
  currency: "INR",
  minAmount: 10,
  maxAmount: 10_000,
  presets: [100, 250, 500, 1000],
  polarCheckoutUrl: (process.env.POLAR_CHECKOUT_URL || "").trim(),
};
