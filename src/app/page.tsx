import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="w-full bg-[#010204] text-white selection:bg-[#00f2fe] selection:text-black min-h-screen relative">
      {/* Dynamic Starry Background (CSS-based) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.5,
        zIndex: 0
      }} />

      {/* Sections */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <HeroSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </main>
  );
}
