import Link from "next/link";
import LinkedInBadge from "@/components/LinkedInBadge";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "System Design", href: "/system-design" },
  { label: "Insights", href: "/insights" },
  { label: "Testimonials", href: "/testimonials" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-8 md:px-24 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Rahul Singh Shekhawat
            </p>
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Full-Stack &amp; Cloud Engineer — building AI-powered SaaS on AWS.
            </p>
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

          {/* LinkedIn */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              Let&apos;s connect
            </p>
            <LinkedInBadge />
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
