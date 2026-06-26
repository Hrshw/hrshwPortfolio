"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function HUDHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ["about", "experience", "skills", "projects", "certifications", "contact"];
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
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Connect" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "py-4 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5" : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between relative">
        {/* Logo/Name */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer group flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-bold tracking-tighter group-hover:scale-105 transition-transform duration-500">
            RS
          </div>
          <span className="text-zinc-900 dark:text-white font-medium tracking-tight hidden sm:block transition-colors duration-500">Rahul Singh Shekhawat</span>
        </div>

        {/* Desktop Nav */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-black/10 dark:border-white/10 transition-colors duration-500">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-500 rounded-full ${
                  activeSection === link.id ? "text-white dark:text-black" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
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
              href="/insights"
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-500 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white`}
            >
              Insights
            </Link>
            <Link
              href="/testimonials"
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-500 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white`}
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
