import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import LinkedInBadge from "@/components/LinkedInBadge";
import { constructMetadata, ogImageUrl, siteMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Contact | Rahul Singh Shekhawat",
  description:
    "Reach Rahul Singh Shekhawat by email or message — questions about his writing on AWS, serverless architecture, and AI systems, or simply to say hello.",
  path: "/contact",
  image: ogImageUrl({ title: "Get in touch", eyebrow: "Contact" }),
});

const contactPageUrl = `${siteMetadata.siteUrl}/contact`;

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: contactPageUrl },
  ],
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${contactPageUrl}#page`,
  url: contactPageUrl,
  name: 'Contact',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
  about: { '@id': `${siteMetadata.siteUrl}/#person` },
  breadcrumb,
};

// ---------------------------------------------------------------------------
// /contact — a general contact page for questions and discussion.
// Submissions go through /api/contact: validated, spam-filtered, rate-limited,
// stored in the admin inbox, and (optionally) emailed to the owner.
// ---------------------------------------------------------------------------
export default function ContactPage() {
  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen relative overflow-hidden transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-400/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-24 pt-32 pb-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300 mb-14"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back home
        </Link>

        {/* Page header */}
        <div className="mb-14">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-5 transition-colors duration-500">
            Get in touch.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-light tracking-tight max-w-2xl transition-colors duration-500">
            A question about something I&apos;ve written, a disagreement about an
            architecture decision, or just a note — send it over and I&apos;ll
            reply within a day or two.
          </p>
        </div>

        {/* Form + details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact details */}
          <div className="lg:col-span-2 flex flex-col gap-8 p-8 md:p-10 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                Contact details
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">
                Or reach me directly on any of these.
              </p>
            </div>

            <div className="flex flex-col gap-5 text-sm">
              <div>
                <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-500 tracking-widest uppercase mb-1">
                  Email
                </span>
                <a
                  href="mailto:rahulsinghpilani7@gmail.com"
                  className="text-zinc-800 dark:text-zinc-200 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
                >
                  rahulsinghpilani7@gmail.com
                </a>
              </div>
              <div>
                <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-500 tracking-widest uppercase mb-1">
                  Phone
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  +91 7082739587
                </span>
              </div>
              <div>
                <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-500 tracking-widest uppercase mb-1">
                  Location
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  Mumbai, India (remote-friendly)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-black/5 dark:border-white/5">
              {[
                { label: "GitHub", href: "https://github.com/Hrshw" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab" },
                { label: "Instagram", href: "https://www.instagram.com/hr.shw/" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <LinkedInBadge />
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono mt-auto">
              Messages are spam-filtered and rate-limited. Your email is only
              used to reply — never shared.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 p-8 md:p-10 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
