"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function HUDHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = [
        "about",
        "experience",
        "skills",
        "projects",
        "certifications",
        "support",
        "contact",
      ];
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(`section-${section}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push(`/#section-${id}`);
    } else {
      const el = document.getElementById(`section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = () => {
    if (pathname !== "/") {
      router.push("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "support", label: "Support" },
  ];

  const navLinkClass = (active: boolean) =>
    `relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-500 rounded-full whitespace-nowrap ${
      active
        ? "text-white dark:text-black"
        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between gap-4 relative">
        {/* Logo/Name */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer group flex items-center gap-3 min-w-0"
        >
          <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold tracking-tighter group-hover:scale-105 transition-transform duration-500 shrink-0">
            RS
          </div>
          <span className="text-zinc-900 dark:text-white font-medium text-[15px] tracking-tight hidden lg:block truncate transition-colors duration-500">
            Rahul Singh Shekhawat
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-0.5 bg-black/5 dark:bg-white/5 backdrop-blur-md px-1.5 py-1 rounded-full border border-black/10 dark:border-white/10 transition-colors duration-500">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={navLinkClass(activeSection === link.id)}
              >
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-full -z-10 transition-colors duration-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            ))}
            <Link
              href="/contact"
              className={navLinkClass(false)}
            >
              Contact
            </Link>
            <Link
              href="/system-design"
              className={navLinkClass(false)}
            >
              System Design
            </Link>
            <Link
              href="/insights"
              className={navLinkClass(false)}
            >
              Insights
            </Link>
            <Link
              href="/testimonials"
              className={navLinkClass(false)}
            >
              Testimonials
            </Link>
          </nav>
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-zinc-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#030303]/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-6 px-8 flex flex-col gap-6 shadow-xl"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-left text-xl font-medium transition-colors ${
                activeSection === link.id ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/contact"
            className={`text-left text-xl font-medium transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/system-design"
            className={`text-left text-xl font-medium transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            System Design
          </Link>
          <Link
            href="/insights"
            className={`text-left text-xl font-medium transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Insights
          </Link>
          <Link
            href="/testimonials"
            className={`text-left text-xl font-medium transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Testimonials
          </Link>
        </motion.div>
      )}
    </header>
  );
}
