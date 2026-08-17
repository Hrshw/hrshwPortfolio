import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-400/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-violet-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-32 text-center">
        {/* Terminal-style label */}
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-zinc-500 mb-10">
          <span className="text-cyan-500 pr-2">{"//"}</span>
          error: page_not_found
        </p>

        {/* 404 */}
        <h1 className="text-[9rem] md:text-[12rem] leading-none font-black tracking-tighter bg-gradient-to-b from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600 bg-clip-text text-transparent transition-colors duration-500 select-none">
          404
        </h1>

        <p className="text-2xl md:text-3xl font-semibold tracking-tight mt-4">
          This page drifted off the map.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg font-light tracking-tight max-w-xl mt-4 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to something useful.
        </p>

        {/* Key section links */}
        <div className="flex flex-wrap gap-4 justify-center mt-12 max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300"
          >
            <span>Home</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
          >
            <span>Engineering Insights</span>
          </Link>

          <Link
            href="/system-design"
            className="inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
          >
            <span>System Design</span>
          </Link>

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
          >
            <span>Testimonials</span>
          </Link>

          <Link
            href="/#section-projects"
            className="inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
          >
            <span>View Projects</span>
          </Link>

          <a
            href="mailto:rahulsinghpilani7@gmail.com"
            className="inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
          >
            <span>Get in Touch</span>
          </a>
        </div>

        {/* Terminal hint */}
        <p className="font-mono text-sm text-zinc-500 mt-16 flex items-center gap-2">
          <span className="text-cyan-500">{"~$"}</span>
          <span>cd / &amp;&amp; ls</span>
          <span className="inline-block w-2 h-4 bg-zinc-500 animate-pulse" />
        </p>
      </div>
    </main>
  );
}
