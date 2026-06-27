import React from "react";
import { notFound } from "next/navigation";
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
import { constructMetadata } from "@/lib/metadata";

interface SpecializationConfig {
  title: string;
  tagline: string;
}

const specializations: Record<string, SpecializationConfig> = {
  "cloud-engineer": {
    title: "Rahul Shekhawat | Cloud Engineer Portfolio",
    tagline: "Full-Stack & Cloud Engineer specializing in scalable AWS architectures, infrastructure as code, and performance tuning.",
  },
  "aws-developer": {
    title: "Rahul Shekhawat | AWS Developer India",
    tagline: "AWS Developer based in India, specializing in serverless API Gateway, Lambda, RDS, and cost-optimized cloud infrastructure.",
  },
  "full-stack-developer": {
    title: "Rahul Shekhawat | Full Stack Developer Portfolio",
    tagline: "Full Stack Developer specializing in robust Node.js backends, React interfaces, and cloud-native scalable systems.",
  },
  "node-js-developer": {
    title: "Rahul Shekhawat | Node.js Developer",
    tagline: "Node.js Developer specializing in fast Fastify endpoints, distributed Redis workers, and secure environment CLI toolsets.",
  },
  "ai-engineer": {
    title: "Rahul Shekhawat | AI Engineer Portfolio",
    tagline: "AI Systems & Software Engineer specializing in generative AI agent logging, trace trees, and MongoDB Time-Series telemetry.",
  },
  "serverless-engineer": {
    title: "Rahul Shekhawat | Serverless Architecture Engineer",
    tagline: "Serverless Architecture Engineer specializing in event-driven AWS SQS, Lambda concurrency, and cost-efficient FinOps automation.",
  },
};

export function generateStaticParams() {
  return Object.keys(specializations).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const config = specializations[slug];
  if (!config) return {};

  return constructMetadata({
    title: config.title,
    description: config.tagline,
    path: `/specialization/${slug}`,
  });
}

export default async function SpecializationPage({ params }: PageProps) {
  const { slug } = await params;
  const config = specializations[slug];

  if (!config) {
    notFound();
  }

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 selection:bg-zinc-800 selection:text-white min-h-screen relative overflow-hidden transition-colors duration-500">
      <StructuredData />
      {/* 3D background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <BlueprintCanvas />
      </div>

      {/* Sections */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <HeroSection customTagline={config.tagline} />
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
