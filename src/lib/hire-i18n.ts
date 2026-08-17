// ---------------------------------------------------------------------------
// Hire page i18n — English + Hindi.
//
// The DATA is always stored in canonical English (admin stays consistent); the
// UI and client-facing emails are localized via these maps. Add more languages
// by extending HIRE_LANGS, the dicts, and the label maps below.
// ---------------------------------------------------------------------------

import { BUDGET_BANDS, NEEDS, PROJECT_TYPES, TIMELINES } from "./hire";
import type { Lang } from "./hire";

// ---------------------------------------------------------------------------
// Dictionary
// ---------------------------------------------------------------------------
export interface HireDict {
  backHome: string;
  heading: string;
  intro: string;
  whatIDoTitle: string;
  services: string[];
  costsTitle: string;
  hourlyIndia: string;
  hourlyIntl: string;
  perHour: string;
  typicalRanges: string;
  bundles: string[];
  quoteNote: string;
  briefTitle: string;
  briefSub: string;
  // form
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  companyLabel: string;
  optional: string;
  companyPlaceholder: string;
  whatNeed: string;
  whatInclude: string;
  includeHint: string;
  budgetLabel: string;
  timelineLabel: string;
  detailsLabel: string;
  detailsPlaceholder: string;
  send: string;
  sending: string;
  successTitle: string; // use {email} placeholder
  successNote: string;
  privacyNote: string;
  // summary labels
  summaryProjectType: string;
  summaryNeeds: string;
  summaryBudget: string;
  summaryTimeline: string;
  summaryCompany: string;
  errors: {
    name: string;
    email: string;
    projectType: string;
    budget: string;
    timeline: string;
    details: string;
  };
}

export const hireDict: Record<Lang, HireDict> = {
  en: {
    backHome: "Back home",
    heading: "Let's work together.",
    intro:
      "I help teams design, build, and ship web products — from landing pages to full SaaS platforms. Share a brief and I'll come back with a concrete scope and quote.",
    whatIDoTitle: "What I do",
    services: [
      "Websites & landing pages — fast, SEO-ready, responsive",
      "Feature work & integrations on existing apps (APIs, auth, payments)",
      "Full builds — SaaS MVPs from design to deployment",
      "AWS / cloud architecture, serverless, and cost optimization",
      "Speed, SEO, and performance improvements",
    ],
    costsTitle: "What it costs",
    hourlyIndia: "Hourly (India)",
    hourlyIntl: "Hourly (international)",
    perHour: "/ hour",
    typicalRanges: "Typical project ranges",
    bundles: [
      "Landing page / marketing website",
      "New feature or integration on an existing app",
      "Full SaaS MVP — design, build, deploy",
    ],
    quoteNote:
      "Final quote after reviewing the brief — no surprises, fixed scope before we start.",
    briefTitle: "Send the brief",
    briefSub:
      "A few details now saves a lot of back-and-forth. You'll get a confirmation email with what you sent.",
    nameLabel: "Your Name *",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email *",
    emailPlaceholder: "jane@company.com",
    companyLabel: "Company",
    optional: "optional",
    companyPlaceholder: "Company / startup name",
    whatNeed: "What do you need? *",
    whatInclude: "What should it include?",
    includeHint: "select all that apply",
    budgetLabel: "Budget *",
    timelineLabel: "Timeline *",
    detailsLabel: "About the project *",
    detailsPlaceholder:
      "What are you trying to build or fix? What does success look like? Any existing code, designs, or constraints I should know about?",
    send: "Send Brief",
    sending: "Sending…",
    successTitle: "✓ Brief received. A confirmation is on its way to {email}.",
    successNote:
      "I'll get back to you within 24–48 hours with an initial quote.",
    privacyNote:
      "Your details are only used to reply to this inquiry — never shared. This form is rate-limited to keep out spam.",
    summaryProjectType: "Project type",
    summaryNeeds: "Needs",
    summaryBudget: "Budget",
    summaryTimeline: "Timeline",
    summaryCompany: "Company",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      projectType: "Choose one.",
      budget: "Choose one.",
      timeline: "Choose one.",
      details: "A few sentences help me quote accurately (min 20 characters).",
    },
  },
  hi: {
    backHome: "वापस होम पर",
    heading: "चलिए साथ काम करते हैं।",
    intro:
      "मैं टीमों को वेब प्रोडक्ट डिज़ाइन करने, बनाने और लॉन्च करने में मदद करता हूँ — लैंडिंग पेज से लेकर पूरे SaaS प्लेटफ़ॉर्म तक। एक संक्षिप्त विवरण (brief) भेजें और मैं स्पष्ट स्कोप और कोटेशन के साथ वापस आऊँगा।",
    whatIDoTitle: "मैं क्या करता हूँ",
    services: [
      "वेबसाइट और लैंडिंग पेज — तेज़, SEO-रेडी, रिस्पॉन्सिव",
      "मौजूदा ऐप पर नई सुविधाएँ और इंटीग्रेशन (API, लॉगिन, पेमेंट)",
      "पूर्ण प्रोजेक्ट — डिज़ाइन से डिप्लॉयमेंट तक SaaS MVP",
      "AWS / क्लाउड आर्किटेक्चर, सर्वरलेस और लागत अनुकूलन",
      "स्पीड, SEO और परफॉर्मेंस सुधार",
    ],
    costsTitle: "कीमत क्या है",
    hourlyIndia: "प्रति घंटा (भारत)",
    hourlyIntl: "प्रति घंटा (अंतरराष्ट्रीय)",
    perHour: "/ घंटा",
    typicalRanges: "सामान्य प्रोजेक्ट रेंज",
    bundles: [
      "लैंडिंग पेज / मार्केटिंग वेबसाइट",
      "मौजूदा ऐप पर नई सुविधा या इंटीग्रेशन",
      "पूर्ण SaaS MVP — डिज़ाइन, बिल्ड, डिप्लॉय",
    ],
    quoteNote:
      "ब्रीफ देखने के बाद अंतिम कोटेशन — कोई आश्चर्य नहीं, शुरू होने से पहले फिक्स स्कोप।",
    briefTitle: "ब्रीफ भेजें",
    briefSub:
      "अभी कुछ विवरण देने से बहुत आगे-पीछे की बातचीत बचती है। आपको भेजी गई जानकारी की एक कन्फर्मेशन ईमेल मिलेगी।",
    nameLabel: "आपका नाम *",
    namePlaceholder: "जैसे: राहुल शर्मा",
    emailLabel: "ईमेल *",
    emailPlaceholder: "aap@company.com",
    companyLabel: "कंपनी",
    optional: "वैकल्पिक",
    companyPlaceholder: "कंपनी / स्टार्टअप का नाम",
    whatNeed: "आपको क्या चाहिए? *",
    whatInclude: "क्या शामिल होना चाहिए?",
    includeHint: "जितने चाहें चुनें",
    budgetLabel: "बजट *",
    timelineLabel: "टाइमलाइन *",
    detailsLabel: "प्रोजेक्ट के बारे में *",
    detailsPlaceholder:
      "आप क्या बनाना या ठीक करना चाहते हैं? सफलता कैसी दिखेगी? कोई मौजूदा कोड, डिज़ाइन या कमियाँ जो मुझे पता होनी चाहिए?",
    send: "ब्रीफ भेजें",
    sending: "भेजा जा रहा है…",
    successTitle: "✓ ब्रीफ मिल गया। {email} पर कन्फर्मेशन भेजी जा रही है।",
    successNote:
      "मैं 24–48 घंटों के भीतर शुरुआती कोटेशन के साथ वापस आऊँगा।",
    privacyNote:
      "आपकी जानकारी केवल इस पूछताछ का जवाब देने के लिए उपयोग होती है — कभी साझा नहीं की जाती। स्पैम रोकने के लिए यह फ़ॉर्म रेट-लिमिटेड है।",
    summaryProjectType: "प्रोजेक्ट प्रकार",
    summaryNeeds: "ज़रूरतें",
    summaryBudget: "बजट",
    summaryTimeline: "टाइमलाइन",
    summaryCompany: "कंपनी",
    errors: {
      name: "कृपया अपना नाम दर्ज करें।",
      email: "कृपया एक मान्य ईमेल दर्ज करें।",
      projectType: "एक चुनें।",
      budget: "एक चुनें।",
      timeline: "एक चुनें।",
      details: "सटीक कोटेशन के लिए कुछ वाक्य लिखें (न्यूनतम 20 अक्षर)।",
    },
  },
};

// ---------------------------------------------------------------------------
// Canonical value → localized label maps (data stays English under the hood)
// ---------------------------------------------------------------------------
type LabelCategory = "projectType" | "needs" | "budgetBand" | "timeline";

const labelMaps: Record<LabelCategory, Record<Lang, Record<string, string>>> = {
  projectType: {
    en: Object.fromEntries(PROJECT_TYPES.map((t) => [t, t])),
    hi: {
      "New website": "नई वेबसाइट",
      "Changes to an existing site": "मौजूदा साइट में बदलाव",
      "New feature / integration": "नई सुविधा / इंटीग्रेशन",
      "Something else": "कुछ और",
    },
  },
  needs: {
    en: Object.fromEntries(NEEDS.map((n) => [n, n])),
    hi: {
      "E-commerce / payments": "ई-कॉमर्स / पेमेंट",
      "CMS / content editing": "CMS / कंटेंट एडिटिंग",
      "API / backend": "API / बैकएंड",
      "Authentication / accounts": "लॉगिन / अकाउंट",
      "Admin dashboard": "एडमिन डैशबोर्ड",
      "Hosting & deployment": "होस्टिंग और डिप्लॉयमेंट",
      "Speed / SEO improvements": "स्पीड / SEO सुधार",
      Other: "अन्य",
    },
  },
  budgetBand: {
    en: Object.fromEntries(BUDGET_BANDS.map((b) => [b, b])),
    hi: {
      "Under ₹50,000": "₹50,000 से कम",
      "₹50,000 – ₹1,50,000": "₹50,000 – ₹1,50,000",
      "₹1,50,000 – ₹5,00,000": "₹1,50,000 – ₹5,00,000",
      "₹5,00,000+": "₹5,00,000+",
    },
  },
  timeline: {
    en: Object.fromEntries(TIMELINES.map((t) => [t, t])),
    hi: {
      "ASAP — within a few weeks": "जल्दी — कुछ हफ़्तों में",
      "1–3 months": "1–3 महीने",
      "Flexible / not urgent": "लचीला / जल्दी नहीं",
    },
  },
};

/** Localized label for a canonical stored value (falls back to English). */
export function labelFor(
  lang: Lang,
  category: LabelCategory,
  value: string
): string {
  return labelMaps[category][lang][value] ?? value;
}

/** Summary in the client's language for the UI + confirmation email. */
export function buildLocalizedSummary(
  lang: Lang,
  i: {
    projectType: string;
    needs: string[];
    budgetBand: string;
    timeline: string;
    company?: string;
    details: string;
  }
): string {
  const d = hireDict[lang];
  return [
    `${d.summaryProjectType}: ${labelFor(lang, "projectType", i.projectType)}`,
    i.needs.length > 0
      ? `${d.summaryNeeds}: ${i.needs.map((n) => labelFor(lang, "needs", n)).join(", ")}`
      : null,
    `${d.summaryBudget}: ${labelFor(lang, "budgetBand", i.budgetBand)}`,
    `${d.summaryTimeline}: ${labelFor(lang, "timeline", i.timeline)}`,
    i.company ? `${d.summaryCompany}: ${i.company}` : null,
    "",
    i.details,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
