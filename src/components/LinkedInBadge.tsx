import Image from "next/image";
import Link from "next/link";

// ---------------------------------------------------------------------------
// LinkedIn profile card.
//
// LinkedIn's official profile-badge embed is deprecated/broken: its endpoint
// (badges.linkedin.com) now returns an authwall page instead of badge data,
// so the old iframe/JSONP badge can't render reliably anywhere.
//
// This self-hosted card is a strict improvement: a real <a> link that search
// engines follow (an iframe gives Google nothing), no external scripts, and
// light/dark support is native Tailwind — no theme plumbing required.
// ---------------------------------------------------------------------------

const PROFILE = {
  vanity: "rahul-singh-shekhawat-b4ba481ab",
  name: "Rahul Singh Shekhawat",
  headline: "Full-Stack & Cloud Engineer · AWS · SaaS",
  location: "Mumbai, India",
  // Real photo, served by GitHub and auto-updated when the GitHub avatar
  // changes. (LinkedIn's badge — which used to supply the photo — is
  // deprecated and returns an authwall, so it can no longer be used.)
  photo: "https://avatars.githubusercontent.com/u/91182435?v=4&s=200",
};

export default function LinkedInBadge() {
  const href = `https://www.linkedin.com/in/${PROFILE.vanity}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-5 transition-colors duration-300 hover:border-sky-500/50 dark:hover:border-sky-400/40"
    >
      <div className="flex items-center gap-3">
        {/* Profile photo + LinkedIn mark overlay */}
        <span className="relative h-12 w-12 shrink-0">
          <Image
            src={PROFILE.photo}
            alt={PROFILE.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A66C2] text-white ring-2 ring-white dark:ring-zinc-900">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
            {PROFILE.name}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {PROFILE.headline}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200/70 dark:border-zinc-800 pt-3">
        <span className="text-xs text-zinc-500 dark:text-zinc-500">{PROFILE.location}</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A66C2] dark:text-sky-400">
          Connect on LinkedIn
          <svg
            className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
