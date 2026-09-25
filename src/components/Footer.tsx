import Link from "next/link";
import LinkedInBadge from "@/components/LinkedInBadge";
import { capabilities } from "@/lib/capabilities";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Technical Focus", href: "/specialization" },
  { label: "System Design", href: "/system-design" },
  { label: "Engineering Insights", href: "/insights" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "RSS feed", href: "/rss.xml" },
  { label: "Resume", href: "/resume.pdf" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "GitHub", href: "https://github.com/Hrshw", external: true },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-8 md:px-24 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Rahul Singh Shekhawat
            </p>
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Full-Stack &amp; Cloud Engineer — building AI-powered SaaS on AWS, and writing
              about how it works.
            </p>
            <Link
              href="/insights"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit underline underline-offset-4"
            >
              Read the engineering write-ups →
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              Explore
            </p>
            <nav className="flex flex-col gap-2 text-sm">
              {EXPLORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Focus areas — site-wide internal links for the topic cluster */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              Focus areas
            </p>
            <nav className="flex flex-col gap-2 text-sm">
              {capabilities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/specialization/${c.slug}`}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources + social */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              Resources
            </p>
            <nav className="flex flex-col gap-2 text-sm">
              {RESOURCE_LINKS.map((l) =>
                l.external ? (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
                  >
                    {l.label}
                  </a>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
                  >
                    {l.label}
                  </a>
                )
              )}
            </nav>
            <div className="pt-2">
              <LinkedInBadge />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-600">
          <span>© {new Date().getFullYear()} Rahul Singh Shekhawat</span>
          <span>Let&apos;s build something great together.</span>
        </div>
      </div>
    </footer>
  );
}
