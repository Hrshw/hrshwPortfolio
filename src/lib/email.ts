// ---------------------------------------------------------------------------
// Email notifications for new contact messages (optional).
//
// Two transports, no extra services required:
//   1. Gmail SMTP (preferred, no third party) — set SMTP_USER + SMTP_PASS
//      (a Gmail App Password; requires 2-Step Verification on the account).
//   2. Resend API fallback — set RESEND_API_KEY only.
//
// Owner notifications always go to the personal inbox below
// (CONTACT_EMAIL_TO overrides it). Failures are logged, never thrown — a down
// email provider must not lose the visitor's message.
//
// Gmail setup (3 minutes, once):
//   1. Google Account → Security → turn ON 2-Step Verification.
//   2. Search "Google App Passwords" → create one for "Mail" → copy the
//      16-character password.
//   3. Set SMTP_USER=rahulsinghpilani7@gmail.com, SMTP_PASS=<app password>.
// ---------------------------------------------------------------------------

import nodemailer from "nodemailer";
import type { Inquiry } from "./hire";
import { labelFor } from "./hire-i18n";

type Transport = "smtp" | "resend";

/** Which transport is configured, or null if email is entirely off. */
function transport(): Transport | null {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

/** Send via Gmail (or any) SMTP with an App Password. */
async function sendViaSmtp(opts: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: (process.env.SMTP_PORT || "465") === "465",
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });
    await transporter.sendMail({
      from: opts.from,
      to: opts.to.join(", "),
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
    });
    return true;
  } catch (err) {
    console.error("[email:smtp]", err);
    return false;
  }
}

/** Send via Resend's REST API (fallback transport). */
async function sendViaResend(opts: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(opts),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email:resend]", res.status, detail.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email:resend]", err);
    return false;
  }
}

/** Shared low-level sender — returns true if the request was accepted. */
async function sendEmail(opts: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const t = transport();
  if (t === "smtp") return sendViaSmtp(opts);
  if (t === "resend") return sendViaResend(opts);
  return false;
}

const fromAddress = () =>
  process.env.CONTACT_EMAIL_FROM ||
  process.env.SMTP_USER ||
  "Portfolio Contact <onboarding@resend.dev>";

/**
 * The only address owner notifications are ever sent to.
 * Defaults to the personal inbox; CONTACT_EMAIL_TO overrides it.
 */
const ownerEmail = () => process.env.CONTACT_EMAIL_TO || "rahulsinghpilani7@gmail.com";

/** Whether email notifications are configured (SMTP creds or Resend key). */
export function isEmailConfigured(): boolean {
  return transport() !== null;
}

export async function sendContactEmail(opts: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!isEmailConfigured()) return; // not configured — admin inbox still has it

  await sendEmail({
    from: fromAddress(),
    to: [ownerEmail()],
    replyTo: opts.email,
    subject: `New portfolio message from ${opts.name}`,
    text: [
      `Name: ${opts.name}`,
      `Email: ${opts.email}`,
      "",
      opts.message,
      "",
      "— Sent from the contact form on rahulshekhawat.dev",
    ].join("\n"),
  });
}

// ---------------------------------------------------------------------------
// Project inquiry notifications — copy to the owner + confirmation to client
// ---------------------------------------------------------------------------
/** Builds the client-facing confirmation email in the client's language. */
function clientConfirmationEmail(
  inquiry: Inquiry,
  summary: string
): { subject: string; text: string } {
  const firstName = inquiry.name.split(" ")[0];
  if (inquiry.lang === "hi") {
    return {
      subject: "आपका प्रोजेक्ट ब्रीफ मिल गया ✓",
      text: [
        `नमस्ते ${firstName},`,
        "",
        "धन्यवाद — आपकी बात मुझे मिल गई। आपने जो भेजा वह यह रहा:",
        "",
        summary,
        "",
        "मैं ब्रीफ देखकर 24–48 घंटों के भीतर शुरुआती कोटेशन के साथ वापस आऊँगा।",
        "अगर ऊपर कुछ गलत या अधूरा है, तो बस इसी ईमेल का जवाब दें।",
        "",
        "धन्यवाद,",
        "राहुल सिंह शेखावत",
      ].join("\n"),
    };
  }
  return {
    subject: "We received your project brief ✓",
    text: [
      `Hi ${firstName},`,
      "",
      "Thanks for reaching out — here's what I received:",
      "",
      summary,
      "",
      "I'll review the brief and get back to you within 24–48 hours with an",
      "initial quote. If anything above is wrong or missing, just reply to this",
      "email.",
      "",
      "Best,",
      "Rahul Singh Shekhawat",
    ].join("\n"),
  };
}

export async function sendInquiryNotifications(
  inquiry: Inquiry,
  summary: string
): Promise<void> {
  const ownerTo = ownerEmail();
  if (!isEmailConfigured()) return; // admin panel still has it

  const senderLabel = inquiry.company
    ? `${inquiry.name} (${inquiry.company})`
    : inquiry.name;
  const projectTypeLabel = labelFor(inquiry.lang, "projectType", inquiry.projectType);

  // 1) To the owner — full brief (English, canonical), Reply-To = the client.
  await sendEmail({
    from: fromAddress(),
    to: [ownerTo],
    replyTo: inquiry.email,
    subject: `New project inquiry: ${senderLabel} — ${projectTypeLabel} [${inquiry.lang.toUpperCase()}]`,
    text: [
      `New project inquiry from ${senderLabel}`,
      `Email: ${inquiry.email}`,
      `Language: ${inquiry.lang.toUpperCase()}`,
      "",
      summary,
      "",
      "— From the /hire brief form. Update its status in /admin → Inquiries.",
    ].join("\n"),
  });

  // 2) To the client — localized confirmation + scope summary + next step.
  const clientMail = clientConfirmationEmail(inquiry, summary);
  await sendEmail({
    from: fromAddress(),
    to: [inquiry.email],
    subject: clientMail.subject,
    text: clientMail.text,
  });
}
