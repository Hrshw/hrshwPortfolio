"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 hud-interactive"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Moon Icon */}
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Sun Icon */}
        <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </motion.div>
    </button>
  );
}
