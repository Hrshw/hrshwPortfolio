// ---------------------------------------------------------------------------
// Email notifications for new contact messages (optional).
//
// Uses Resend's REST API directly (no SDK dependency). Everything is env-gated:
// if RESEND_API_KEY / CONTACT_EMAIL_TO aren't set, no email is sent and the
// message still lands in the /admin inbox. Failures are logged, never thrown —
// a down email provider must not lose the visitor's message.
//
// Setup (free tier: 100 emails/day):
//   1. Create an account at https://resend.com and copy the API key.
//   2. For testing, send to your own inbox with the default sender
//      (onboarding@resend.dev). For production, verify a domain and set
//      CONTACT_EMAIL_FROM to an address on it.
// ---------------------------------------------------------------------------

import type { Inquiry } from "./hire";
import { labelFor } from "./hire-i18n";

/** Shared low-level sender — returns true if the request was accepted. */
async function sendEmail(opts: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(opts),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email]", res.status, detail.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email]", err);
    return false;
  }
}

const fromAddress = () =>
  process.env.CONTACT_EMAIL_FROM || "Portfolio Contact <onboarding@resend.dev>";

/** Whether email notifications are configured (Resend key + inbox). */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO);
}

export async function sendContactEmail(opts: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !to) return; // not configured — admin inbox still has it

  await sendEmail({
    from: fromAddress(),
    to: [to],
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
  const ownerTo = process.env.CONTACT_EMAIL_TO;
  if (!isEmailConfigured() || !ownerTo) return; // admin panel still has it

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
