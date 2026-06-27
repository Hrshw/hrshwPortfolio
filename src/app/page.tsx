import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SystemDesignSection from "@/components/sections/SystemDesignSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import FeedbackTeaserSection from "@/components/sections/FeedbackTeaserSection";
import ContactSection from "@/components/sections/ContactSection";
import BlueprintCanvas from "@/components/3d/BlueprintCanvas";
import StructuredData from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 selection:bg-zinc-800 selection:text-white min-h-screen relative overflow-hidden transition-colors duration-500">
      <StructuredData />
      {/* Sophisticated Dark Mesh Gradient Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <BlueprintCanvas />
      </div>

      {/* Sections */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <SystemDesignSection />
        <FeedbackTeaserSection />
        <CertificationsSection />
        <ContactSection />
      </div>
    </main>
  );
}
